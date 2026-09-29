"""POST /save-lead route per LEAD_API_CONTRACT.md sections 3, 5, 7, and 8.

Check order per the contract: rate limit (3.2) first, then the
Content-Type/JSON checks (415/400), then the honeypot (3.1), then field
validation (422). This lets a bot pass the honeypot decoy without ever
seeing a field error, while still bounding request volume before anything
else runs. The rate limit itself is enforced in app.py's before_request
hook (not here), so it also covers a wrong HTTP method, which never
reaches this view.

Unexpected exceptions are caught here (rather than left to Flask's error
handler) so the 500 response is deterministic under Flask's TESTING config,
where unhandled exceptions otherwise propagate instead of being converted.
Never log the payload, the lead row, the client IP, or the honeypot value:
they may carry personal data or are excluded from logging by the contract.
US-016: a storage failure logs an ERROR with the underlying cause, an
unexpected error logs an ERROR with the exception class and traceback;
neither includes the request data.
"""

from __future__ import annotations

from flask import Blueprint, current_app, request

from logging_utils import format_traceback_without_message
from responses import contract_response
from storage.base import StorageError
from time_utils import format_costa_rica_timestamp
from validation import validate_lead

bp = Blueprint("lead", __name__)


def _is_honeypot_triggered(payload: dict) -> bool:
    """True when `website` (LEAD_API_CONTRACT.md section 3.1) marks a bot.

    Absent, null, or a string empty after trimming means "empty" (not a
    bot). Any other string, or any non-string/non-null JSON type, is a bot.
    """
    if "website" not in payload:
        return False
    value = payload["website"]
    if value is None:
        return False
    if isinstance(value, str):
        return value.strip() != ""
    return True


def _describe_storage_error_cause(exc: StorageError) -> str:
    """Exception class (and HTTP status for a Google API error) behind a
    StorageError (US-016 AC1), e.g. "PermissionError", "APIError 403",
    "SpreadsheetNotFound", "FileNotFoundError". Never includes the
    exception's message, which could otherwise repeat request data.
    """
    cause = exc.__cause__ or exc
    status = getattr(getattr(cause, "response", None), "status_code", None)
    if status is not None:
        return f"{type(cause).__name__} {status}"
    return type(cause).__name__


@bp.route("/save-lead", methods=["POST"])
def save_lead():
    if (request.mimetype or "").lower() != "application/json":
        response = contract_response(
            False,
            "Content-Type must be application/json.",
            "unsupported_media_type",
        )
        response.status_code = 415
        return response

    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        response = contract_response(
            False,
            "Request body must be a JSON object.",
            "invalid_json",
        )
        response.status_code = 400
        return response

    if _is_honeypot_triggered(payload):
        response = contract_response(True, "Lead saved.")
        response.status_code = 201
        return response

    try:
        normalized, field_errors = validate_lead(payload)
        if field_errors:
            response = contract_response(
                False, "Validation failed.", "validation_error", field_errors
            )
            response.status_code = 422
            return response

        lead_row = {
            "submitted_at": format_costa_rica_timestamp(),
            "name": normalized["name"],
            "email": normalized["email"],
            "phone": normalized["phone"],
            "screening_answer": normalized["screening_answer"],
            "language": normalized["language"],
            "consent": normalized["consent"],
            "privacy_notice_version": current_app.config["PRIVACY_NOTICE_VERSION"],
            "status": "started",
        }

        storage = current_app.config["LEAD_STORAGE"]
        storage.save(lead_row)
    except StorageError as exc:
        current_app.logger.error(
            "POST /save-lead failed: storage_unavailable (cause=%s)",
            _describe_storage_error_cause(exc),
        )
        response = contract_response(
            False, "Failed to save lead.", "storage_unavailable"
        )
        response.status_code = 503
        return response
    except Exception as exc:  # noqa: BLE001 - never leak internals; contract requires a generic 500
        current_app.logger.error(
            "POST /save-lead failed: internal_error (%s)\n%s",
            type(exc).__name__,
            format_traceback_without_message(exc),
        )
        response = contract_response(
            False, "An unexpected error occurred.", "internal_error"
        )
        response.status_code = 500
        return response

    response = contract_response(True, "Lead saved.")
    response.status_code = 201
    return response
