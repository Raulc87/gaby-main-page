"""Request handling shared by the lead endpoints (LEAD_API_CONTRACT.md sections 3 to 8, 11).

Check order per the contract: rate limit (3.2) first, then the
Content-Type/JSON checks (415/400), then the honeypot (3.1), then field
validation (422). This lets a bot pass the honeypot decoy without ever
seeing a field error, while still bounding request volume before anything
else runs. The rate limit itself is enforced in app.py's before_request
hook (not here), so it also covers a wrong HTTP method, which never
reaches the view.

Unexpected exceptions are caught here (rather than left to Flask's error
handler) so the 500 response is deterministic under Flask's TESTING config,
where unhandled exceptions otherwise propagate instead of being converted.
Never log the payload, the lead row, the client IP, or the honeypot value:
they may carry personal data or are excluded from logging by the contract.
US-016: a storage failure logs an ERROR with the underlying cause, an
unexpected error logs an ERROR with the exception class and traceback;
neither includes the request data. US-013 AC8: a honeypot decoy logs one
INFO line, with no request data, so false positives (e.g. autofill) are
visible in production without ever logging what was filled in.
"""

from __future__ import annotations

from typing import Callable

from flask import Response, current_app, request

from logging_utils import format_traceback_without_message
from responses import contract_response
from storage.base import StorageError
from time_utils import format_costa_rica_timestamp

Validator = Callable[[dict], tuple[dict, dict]]
RowBuilder = Callable[[dict], dict]


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


def _json_error(message: str, error_code: str, status_code: int) -> Response:
    response = contract_response(False, message, error_code)
    response.status_code = status_code
    return response


def handle_lead_submission(
    endpoint: str,
    storage_config_key: str,
    validate: Validator,
    build_row: RowBuilder,
) -> Response:
    """Run one lead submission through the contract's checks and store it.

    `endpoint` is the application route, for log lines only. `validate`
    returns (normalized_fields, field_errors); `build_row` turns the
    normalized fields into the stored row, adding the server-generated
    fields.
    """
    if (request.mimetype or "").lower() != "application/json":
        return _json_error(
            "Content-Type must be application/json.", "unsupported_media_type", 415
        )

    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return _json_error("Request body must be a JSON object.", "invalid_json", 400)

    if _is_honeypot_triggered(payload):
        current_app.logger.info("honeypot triggered; lead discarded")
        response = contract_response(True, "Lead saved.")
        response.status_code = 201
        return response

    try:
        normalized, field_errors = validate(payload)
        if field_errors:
            response = contract_response(
                False, "Validation failed.", "validation_error", field_errors
            )
            response.status_code = 422
            return response

        current_app.config[storage_config_key].save(build_row(normalized))
    except StorageError as exc:
        current_app.logger.error(
            "POST %s failed: storage_unavailable (cause=%s)",
            endpoint,
            _describe_storage_error_cause(exc),
        )
        return _json_error("Failed to save lead.", "storage_unavailable", 503)
    except Exception as exc:  # noqa: BLE001 - never leak internals; contract requires a generic 500
        current_app.logger.error(
            "POST %s failed: internal_error (%s)\n%s",
            endpoint,
            type(exc).__name__,
            format_traceback_without_message(exc),
        )
        return _json_error("An unexpected error occurred.", "internal_error", 500)

    response = contract_response(True, "Lead saved.")
    response.status_code = 201
    return response


def server_generated_fields() -> dict:
    """Fields every stored row gets from the server (LEAD_API_CONTRACT.md section 5)."""
    return {
        "submitted_at": format_costa_rica_timestamp(),
        "privacy_notice_version": current_app.config["PRIVACY_NOTICE_VERSION"],
        "status": "started",
    }
