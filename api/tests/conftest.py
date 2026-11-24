from __future__ import annotations

import pytest

from app import create_app
from crm.sync import CrmSync
from rate_limit import RateLimiter
from tests.crm_fakes import FakeCrmClient


@pytest.fixture()
def app():
    flask_app = create_app(api_prefix="/api")
    flask_app.config.update(TESTING=True)
    flask_app.config["PRIVACY_NOTICE_VERSION"] = "2026-09-draft-1"
    # Disabled by default so tests unrelated to rate limiting are not
    # affected by it, or by RATE_LIMIT_* values set in the environment.
    # Rate-limit tests override this with their own RateLimiter.
    flask_app.config["RATE_LIMITER"] = RateLimiter(max_requests=0, window_seconds=600)
    flask_app.config["CALCULATOR_RATE_LIMITER"] = RateLimiter(max_requests=0, window_seconds=600)
    # Never the real GoHighLevel client, whatever GHL_* the environment has:
    # tests that exercise the sending use the `crm_client` fixture.
    flask_app.config["CRM_SYNC"] = CrmSync(enabled=False)
    return flask_app


@pytest.fixture()
def crm_client(app):
    """A fake GoHighLevel client with sending switched on (GHL_SYNC=on)."""
    fake = FakeCrmClient()
    app.config["CRM_SYNC"] = CrmSync(enabled=True, client=fake)
    return fake


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def storage(app):
    return app.config["LEAD_STORAGE"]


@pytest.fixture()
def calculator_storage(app):
    return app.config["CALCULATOR_LEAD_STORAGE"]
