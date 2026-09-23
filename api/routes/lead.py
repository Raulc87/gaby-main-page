"""POST /save-lead route.

Phase 0 scaffold: structural request checks (content type, JSON body shape)
and the memory storage path. Full field validation (LEAD_API_CONTRACT.md
section 3/8) and the Google Sheets adapter land in GK-006-google-sheets.
"""

from __future__ import annotations

from flask import Blueprint, current_app, request

from responses import contract_response

bp = Blueprint("lead", __name__)


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

    storage = current_app.config["LEAD_STORAGE"]
    storage.save(payload)

    response = contract_response(True, "Lead saved.")
    response.status_code = 201
    return response
