"""Flask application factory.

`api_prefix` lets the same app expose /save-lead both:
- unprefixed, for cPanel Passenger, which mounts the app at /api and strips
  the prefix before it reaches the WSGI app (see ADR-001), and
- prefixed with /api, for local development (run_local.py), so that
  http://127.0.0.1:5000/api/save-lead works through the frontend dev proxy.
"""

from __future__ import annotations

from flask import Flask

from config import Config
from errors import register_error_handlers
from routes.lead import bp as lead_bp
from storage import create_storage

MAX_REQUEST_BODY_BYTES = 10 * 1024  # LEAD_API_CONTRACT.md section 2


def create_app(api_prefix: str = "") -> Flask:
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = MAX_REQUEST_BODY_BYTES

    config = Config()
    app.config["LEAD_STORAGE"] = create_storage(config.LEADS_STORAGE)
    app.config["PRIVACY_NOTICE_VERSION"] = config.PRIVACY_NOTICE_VERSION

    register_error_handlers(app)
    app.register_blueprint(lead_bp, url_prefix=api_prefix)

    return app
