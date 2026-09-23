from __future__ import annotations

import json
import re

from storage.base import StorageError

VALID_PAYLOAD = {
    "name": "Ana Perez",
    "email": "ana.perez@example.com",
    "phone": "+50684104791",
    "screening_answer": "needs_investment_info",
    "language": "es",
    "consent": True,
}

SUBMITTED_AT_PATTERN = re.compile(r"^\d{2}/\d{2}/\d{4} \d{2}:\d{2}:\d{2}$")


class _FailingStorage:
    def __init__(self, exc: Exception) -> None:
        self._exc = exc

    def save(self, lead: dict) -> None:
        raise self._exc


def test_valid_submission_returns_201_and_contract_shape(client, storage):
    response = client.post("/api/save-lead", json=VALID_PAYLOAD)

    assert response.status_code == 201
    body = response.get_json()
    assert body["success"] is True
    assert body["error_code"] is None
    assert body["field_errors"] is None
    assert isinstance(body["message"], str) and body["message"]

    assert len(storage.leads) == 1
    saved = storage.leads[0]
    assert saved["name"] == VALID_PAYLOAD["name"]
    assert saved["email"] == VALID_PAYLOAD["email"]
    assert saved["phone"] == VALID_PAYLOAD["phone"]
    assert saved["screening_answer"] == VALID_PAYLOAD["screening_answer"]
    assert saved["language"] == VALID_PAYLOAD["language"]
    assert saved["consent"] is True
    assert SUBMITTED_AT_PATTERN.match(saved["submitted_at"])
    assert saved["privacy_notice_version"] == "2026-09-draft-1"
    assert saved["status"] == "started"


def test_submission_normalizes_fields_before_storing(client, storage):
    payload = dict(VALID_PAYLOAD)
    payload["name"] = "  ana   maria   perez  "
    payload["email"] = "  Ana.Perez@Example.COM "
    payload["phone"] = "+506 8410-4791"

    response = client.post("/api/save-lead", json=payload)

    assert response.status_code == 201
    saved = storage.leads[0]
    assert saved["name"] == "ana maria perez"
    assert saved["email"] == "ana.perez@example.com"
    assert saved["phone"] == "+50684104791"


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


def test_validation_errors_return_422_with_field_errors(client, storage):
    payload = dict(VALID_PAYLOAD)
    payload["name"] = "Ana"
    payload["phone"] = "not-a-phone"

    response = client.post("/api/save-lead", json=payload)

    assert response.status_code == 422
    body = response.get_json()
    assert body["success"] is False
    assert body["error_code"] == "validation_error"
    assert body["field_errors"] == {
        "name": "full_name_required",
        "phone": "invalid_format",
    }
    assert storage.leads == []


def test_unknown_fields_are_ignored(client, storage):
    payload = dict(VALID_PAYLOAD)
    payload["unexpected_field"] = "should be ignored"

    response = client.post("/api/save-lead", json=payload)

    assert response.status_code == 201
    assert "unexpected_field" not in storage.leads[0]


def test_storage_failure_returns_503_and_does_not_report_success(app, client):
    app.config["LEAD_STORAGE"] = _FailingStorage(StorageError("boom"))

    response = client.post("/api/save-lead", json=VALID_PAYLOAD)

    assert response.status_code == 503
    body = response.get_json()
    assert body["success"] is False
    assert body["error_code"] == "storage_unavailable"


def test_unexpected_storage_error_returns_500(app, client):
    app.config["LEAD_STORAGE"] = _FailingStorage(RuntimeError("unexpected"))

    response = client.post("/api/save-lead", json=VALID_PAYLOAD)

    assert response.status_code == 500
    body = response.get_json()
    assert body["success"] is False
    assert body["error_code"] == "internal_error"
