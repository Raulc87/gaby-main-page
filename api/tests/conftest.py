from __future__ import annotations

import pytest

from app import create_app


@pytest.fixture()
def app():
    flask_app = create_app(api_prefix="/api")
    flask_app.config.update(TESTING=True)
    flask_app.config["PRIVACY_NOTICE_VERSION"] = "2026-09-draft-1"
    return flask_app


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def storage(app):
    return app.config["LEAD_STORAGE"]
