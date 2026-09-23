from __future__ import annotations

from app import create_app


def test_api_prefix_controls_route_path():
    prefixed_client = create_app(api_prefix="/api").test_client()
    unprefixed_client = create_app(api_prefix="").test_client()

    assert prefixed_client.post("/api/save-lead", json={}).status_code == 201
    assert unprefixed_client.post("/save-lead", json={}).status_code == 201
    assert prefixed_client.post("/save-lead", json={}).status_code == 404
