"""Shared response envelope per LEAD_API_CONTRACT.md section 7."""

from __future__ import annotations

from flask import Response, jsonify


def contract_response(
    success: bool,
    message: str,
    error_code: str | None = None,
    field_errors: dict[str, str] | None = None,
) -> Response:
    return jsonify(
        {
            "success": success,
            "message": message,
            "error_code": error_code,
            "field_errors": field_errors,
        }
    )
