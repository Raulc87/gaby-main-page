"""Flask application factory.

`api_prefix` lets the same app expose /save-lead and /save-calculator-lead both:
- unprefixed, for cPanel Passenger, which mounts the app at /api and strips
  the prefix before it reaches the WSGI app (see ADR-001), and
- prefixed with /api, for local development (run_local.py), so that
  http://127.0.0.1:5000/api/save-lead works through the frontend dev proxy.
"""

from __future__ import annotations

import logging

from flask import Flask, request

from config import Config
from errors import register_error_handlers
from rate_limit import RateLimiter
from responses import contract_response
from routes.calculator_lead import bp as calculator_lead_bp
from routes.lead import bp as lead_bp
from storage import create_calculator_storage, create_storage

MAX_REQUEST_BODY_BYTES = 10 * 1024  # LEAD_API_CONTRACT.md section 2


def _new_rate_limiter(config: Config) -> RateLimiter:
    return RateLimiter(
        max_requests=config.RATE_LIMIT_MAX_REQUESTS,
        window_seconds=config.RATE_LIMIT_WINDOW_SECONDS,
    )


def create_app(api_prefix: str = "") -> Flask:
    # US-016: makes INFO (startup) and WARNING (memory storage) records
    # actually reach stderr, which Passenger writes to the app log in
    # cPanel, not just ERROR (which Python's handler of last resort would
    # already show). A no-op if a handler is already configured on the
    # root logger (e.g. under pytest), which is fine: tests capture with
    # caplog.set_level() instead. The timestamp (US-013 AC8) lets the
    # human owner tell a bot-like burst of honeypot lines apart from a
    # handful spread out with real-looking timing; caplog's own formatter
    # is unaffected by this format string, so existing substring-based
    # log assertions still pass regardless.
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s:%(name)s:%(message)s")

    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = MAX_REQUEST_BODY_BYTES

    config = Config()
    app.config["LEAD_STORAGE"] = create_storage(config)
    app.config["CALCULATOR_LEAD_STORAGE"] = create_calculator_storage(config)
    app.config["PRIVACY_NOTICE_VERSION"] = config.PRIVACY_NOTICE_VERSION
    # One limiter per endpoint: the calculator's requests never count
    # against /save-lead's budget, nor the reverse (contract section 11.1).
    app.config["RATE_LIMITER"] = _new_rate_limiter(config)
    app.config["CALCULATOR_RATE_LIMITER"] = _new_rate_limiter(config)

    limiter_config_key_by_path = {
        f"{api_prefix}/save-lead": "RATE_LIMITER",
        f"{api_prefix}/save-calculator-lead": "CALCULATOR_RATE_LIMITER",
    }

    @app.before_request
    def _enforce_rate_limit():
        # Registered at app level (not on the blueprint) and matched on
        # the raw path so this runs before Flask's method dispatch: a
        # non-POST request to a lead endpoint is counted and can be rejected
        # with 429 here, before Flask would otherwise answer 405
        # (LEAD_API_CONTRACT.md section 3.2: "checked first, before any
        # other processing"; every request that reaches the endpoint
        # counts, whatever its later outcome).
        limiter_config_key = limiter_config_key_by_path.get(request.path)
        if limiter_config_key is None:
            return None
        limiter = app.config[limiter_config_key]
        allowed, retry_after = limiter.check(request.remote_addr or "")
        if allowed:
            return None
        response = contract_response(False, "Too many requests.", "rate_limited")
        response.status_code = 429
        response.headers["Retry-After"] = str(retry_after)
        return response

    register_error_handlers(app)
    app.register_blueprint(lead_bp, url_prefix=api_prefix)
    app.register_blueprint(calculator_lead_bp, url_prefix=api_prefix)

    return app
