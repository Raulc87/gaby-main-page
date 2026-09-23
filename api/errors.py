"""App-level error handlers producing the contract's JSON response shape.

Field-level validation (422) and storage failures (503) are handled inside
the route itself, since they depend on business rules (see LEAD_API_CONTRACT.md
section 8) rather than generic HTTP/framework failures.
"""

from __future__ import annotations

from flask import Flask

from responses import contract_response


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(404)
    def handle_not_found(_e):
        response = contract_response(False, "Resource not found.", "not_found")
        response.status_code = 404
        return response

    @app.errorhandler(405)
    def handle_method_not_allowed(e):
        response = contract_response(False, "Method not allowed.", "method_not_allowed")
        response.status_code = 405
        valid_methods = getattr(e, "valid_methods", None)
        if valid_methods:
            response.headers["Allow"] = ", ".join(sorted(valid_methods))
        return response

    @app.errorhandler(413)
    def handle_payload_too_large(_e):
        response = contract_response(False, "Request body is too large.", "payload_too_large")
        response.status_code = 413
        return response

    @app.errorhandler(415)
    def handle_unsupported_media_type(_e):
        response = contract_response(
            False, "Content-Type must be application/json.", "unsupported_media_type"
        )
        response.status_code = 415
        return response

    @app.errorhandler(500)
    def handle_internal_error(_e):
        response = contract_response(False, "An unexpected error occurred.", "internal_error")
        response.status_code = 500
        return response
