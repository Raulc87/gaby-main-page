"""POST /save-calculator-lead route per LEAD_API_CONTRACT.md section 11.

Same checks, responses and server-generated fields as /save-lead
(routes/submission.py); this module holds the calculator's fields and the
row of section 11.5. The five figures the visitor typed are never part of
the request contract, so no field here can carry them.
"""

from __future__ import annotations

from flask import Blueprint

from routes.submission import handle_lead_submission, server_generated_fields
from validation import validate_calculator_lead

CALCULATOR_SOURCE = "calculator"  # FR-039

bp = Blueprint("calculator_lead", __name__)


def _build_row(normalized: dict) -> dict:
    server_fields = server_generated_fields()
    return {
        "submitted_at": server_fields["submitted_at"],
        "name": normalized["name"],
        "email": normalized["email"],
        "phone": normalized["phone"],
        "language": normalized["language"],
        "months": normalized["months"],
        "zone": normalized["zone"],
        "consent": normalized["consent"],
        "marketing_consent": normalized["marketing_consent"],
        "source": CALCULATOR_SOURCE,
        "privacy_notice_version": server_fields["privacy_notice_version"],
        "status": server_fields["status"],
    }


@bp.route("/save-calculator-lead", methods=["POST"])
def save_calculator_lead():
    return handle_lead_submission(
        "/save-calculator-lead",
        "CALCULATOR_LEAD_STORAGE",
        validate_calculator_lead,
        _build_row,
    )
