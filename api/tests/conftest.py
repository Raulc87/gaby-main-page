from __future__ import annotations

import pytest

from app import create_app
from rate_limit import RateLimiter


@pytest.fixture()
def app():
    flask_app = create_app(api_prefix="/api")
    flask_app.config.update(TESTING=True)
    flask_app.config["PRIVACY_NOTICE_VERSION"] = "2026-09-draft-1"
    # Disabled by default so tests unrelated to rate limiting are not
    # affected by it, or by RATE_LIMIT_* values set in the environment.
    # Rate-limit tests override this with their own RateLimiter.
    flask_app.config["RATE_LIMITER"] = RateLimiter(max_requests=0, window_seconds=600)
    return flask_app


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def storage(app):
    return app.config["LEAD_STORAGE"]
