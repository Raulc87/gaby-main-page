"""POST /save-lead route per LEAD_API_CONTRACT.md sections 3, 5, 7, and 8.

The checks and the storage call are shared with the calculator endpoint
(routes/submission.py); this module holds what is specific to VIP leads:
their fields and the row of section 6.
"""

from __future__ import annotations

from flask import Blueprint

from routes.submission import handle_lead_submission, server_generated_fields
from validation import validate_lead

bp = Blueprint("lead", __name__)


def _build_row(normalized: dict) -> dict:
    server_fields = server_generated_fields()
    return {
        "submitted_at": server_fields["submitted_at"],
        "name": normalized["name"],
        "email": normalized["email"],
        "phone": normalized["phone"],
        "screening_answer": normalized["screening_answer"],
        "language": normalized["language"],
        "consent": normalized["consent"],
        "privacy_notice_version": server_fields["privacy_notice_version"],
        "status": server_fields["status"],
    }


@bp.route("/save-lead", methods=["POST"])
def save_lead():
    return handle_lead_submission("/save-lead", "LEAD_STORAGE", validate_lead, _build_row)
