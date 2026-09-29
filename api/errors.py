"""App-level error handlers producing the contract's JSON response shape.

Field-level validation (422) and storage failures (503) are handled inside
the route itself, since they depend on business rules (see LEAD_API_CONTRACT.md
section 8) rather than generic HTTP/framework failures.
"""

from __future__ import annotations

from flask import Flask, current_app, request

from logging_utils import format_traceback_without_message
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

    @app.errorhandler(Exception)
    def handle_unexpected_error(e):
        # Catches an exception raised outside a route's own try/except
        # (e.g. the rate-limit before_request hook in app.py, or any
        # future route without its own handling), so US-016's "never log
        # submitted data or the IP" holds everywhere, not only inside
        # save_lead(). HTTPExceptions (404/405/413/415/500 above) never
        # reach here: Flask routes those to their specific handler first.
        # Registering this handler also makes the 500 response
        # deterministic under Flask's TESTING config, where an unhandled
        # exception would otherwise propagate to the caller instead.
        current_app.logger.error(
            "Unhandled exception on %s %s (%s)\n%s",
            request.method,
            request.path,
            type(e).__name__,
            format_traceback_without_message(e),
        )
        response = contract_response(False, "An unexpected error occurred.", "internal_error")
        response.status_code = 500
        return response
