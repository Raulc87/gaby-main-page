from __future__ import annotations

import json

VALID_PAYLOAD = {
    "name": "Ana Perez",
    "email": "ana.perez@example.com",
    "phone": "+50684104791",
    "screening_answer": "needs_investment_info",
    "language": "es",
    "consent": True,
}


def test_valid_submission_returns_201_and_contract_shape(client, storage):
    response = client.post("/api/save-lead", json=VALID_PAYLOAD)

    assert response.status_code == 201
    body = response.get_json()
    assert body["success"] is True
    assert body["error_code"] is None
    assert body["field_errors"] is None
    assert isinstance(body["message"], str) and body["message"]
    assert storage.leads == [VALID_PAYLOAD]


def test_invalid_json_body_returns_400(client):
    response = client.post(
        "/api/save-lead",
        data="{not valid json",
        content_type="application/json",
    )

    assert response.status_code == 400
    body = response.get_json()
    assert body["success"] is False
    assert body["error_code"] == "invalid_json"


def test_non_object_json_body_returns_400(client):
    response = client.post("/api/save-lead", json=["not", "an", "object"])

    assert response.status_code == 400
    assert response.get_json()["error_code"] == "invalid_json"


def test_unsupported_media_type_returns_415(client):
    response = client.post(
        "/api/save-lead",
        data=json.dumps(VALID_PAYLOAD),
        content_type="text/plain",
    )

    assert response.status_code == 415
    assert response.get_json()["error_code"] == "unsupported_media_type"


def test_unknown_path_returns_404(client):
    response = client.get("/api/does-not-exist")

    assert response.status_code == 404
    assert response.get_json()["error_code"] == "not_found"


def test_wrong_method_returns_405_with_allow_header(client):
    response = client.get("/api/save-lead")

    assert response.status_code == 405
    assert response.get_json()["error_code"] == "method_not_allowed"
    assert "POST" in response.headers["Allow"]


def test_payload_too_large_returns_413(client):
    huge_payload = {"name": "A" * (11 * 1024)}

    response = client.post("/api/save-lead", json=huge_payload)

    assert response.status_code == 413
    assert response.get_json()["error_code"] == "payload_too_large"
