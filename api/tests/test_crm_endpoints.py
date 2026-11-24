"""LEAD_API_CONTRACT.md section 12 on both endpoints, with a fake GoHighLevel client.

No test calls the real GoHighLevel API: the fake client records what would be
sent, or fails the way GoHighLevel can.
"""

from __future__ import annotations

import logging

import pytest

from app import create_app
from crm.client import GoHighLevelClient
from crm.errors import CrmError
from crm.sync import CrmSync
from storage.base import StorageError
from tests.crm_fakes import FakeCrmClient, http_error, timeout_error
from tests.test_calculator_lead import VALID_PAYLOAD as CALCULATOR_PAYLOAD
from tests.test_calculator_lead import VIP_PAYLOAD

CALCULATOR_ENDPOINT = "/api/save-calculator-lead"
VIP_ENDPOINT = "/api/save-lead"
TOKEN = "pit-secret-token-123"


def _post_calculator(client, **overrides):
    return client.post(CALCULATOR_ENDPOINT, json={**CALCULATOR_PAYLOAD, **overrides})


def _post_vip(client, **overrides):
    return client.post(VIP_ENDPOINT, json={**VIP_PAYLOAD, **overrides})


class _StorageFailing:
    """Wraps a storage: one method fails with StorageError, the rest delegate."""

    def __init__(self, inner, fail: str) -> None:
        self._inner = inner
        self._fail = fail

    def save(self, lead):
        if self._fail == "save":
            raise StorageError("boom")
        return self._inner.save(lead)

    def set_crm_status(self, reference, crm_status):
        if self._fail == "set_crm_status":
            raise StorageError("boom")
        self._inner.set_crm_status(reference, crm_status)


# --- the payloads ----------------------------------------------------------------


def test_calculator_lead_is_sent_as_a_contact_with_its_tags_and_fields(client, crm_client):
    response = _post_calculator(client, phone="+506 8410-4791", marketing_consent=True)

    assert response.status_code == 201
    (contact,) = crm_client.contacts
    assert contact.name == "Ana María Pérez Soto"
    assert contact.email == "ana.perez@example.com"
    assert contact.phone == "+50684104791"
    assert contact.tags == ("lead-calculadora", "idioma-es", "consentimiento-correos")
    assert contact.custom_fields == {
        "meses": "4,4",
        "zona": "Zona de alerta",
        "moneda": "USD",
        "alerta_concentracion": "sí",
    }


def test_the_consent_tag_is_not_sent_without_marketing_consent(client, crm_client):
    _post_calculator(client, marketing_consent=False)

    assert "consentimiento-correos" not in crm_client.contacts[0].tags


@pytest.mark.parametrize(
    ("months", "zone", "shown"),
    [
        (4.45, "alert", "4,5"),
        (9.95, "building", "10"),
        (9.96, "building", "10"),
        (10.49, "building", "10"),
        (10.5, "building", "11"),
    ],
)
def test_meses_is_derived_half_up_from_the_months_sent(client, crm_client, months, zone, shown):
    assert _post_calculator(client, months=months, zone=zone).status_code == 201

    assert crm_client.contacts[0].custom_fields["meses"] == shown


def test_empty_meses_for_a_financially_free_result(client, crm_client):
    _post_calculator(client, months=None, zone="financially_free")

    contact = crm_client.contacts[0]
    assert contact.custom_fields["meses"] == ""
    assert contact.custom_fields["zona"] == "Libre financieramente"


def test_the_calculator_figures_are_never_sent(client, crm_client):
    _post_calculator(client, monthly_expenses=1500, savings=9000, website="")

    assert "9000" not in repr(crm_client.contacts[0])
    assert "1500" not in repr(crm_client.contacts[0])


def test_application_is_sent_as_a_contact_with_its_tag_and_screening_answer(client, crm_client):
    response = _post_vip(client, language="en")

    assert response.status_code == 201
    (contact,) = crm_client.contacts
    assert contact.name == "Ana Perez"
    assert contact.phone == "+50684104791"
    assert contact.tags == ("aplicacion-vip", "idioma-en")
    assert contact.custom_fields == {
        "preseleccion": "Tengo disposición, pero necesito conocer la inversión primero."
    }


# --- the order and the recorded outcome ------------------------------------------


def test_the_row_is_appended_as_pending_before_the_contact_is_sent(app, client, calculator_storage):
    seen_while_sending: list[list[dict]] = []
    fake = FakeCrmClient(on_send=lambda contact: seen_while_sending.append([dict(row) for row in calculator_storage.leads]))
    app.config["CRM_SYNC"] = CrmSync(enabled=True, client=fake)

    _post_calculator(client)

    assert [row["crm_status"] for row in seen_while_sending[0]] == ["pending"]
    assert [row["crm_status"] for row in calculator_storage.leads] == ["sent"]


def test_the_application_row_goes_pending_then_sent(app, client, storage):
    seen_while_sending: list[list[dict]] = []
    fake = FakeCrmClient(on_send=lambda contact: seen_while_sending.append([dict(row) for row in storage.leads]))
    app.config["CRM_SYNC"] = CrmSync(enabled=True, client=fake)

    _post_vip(client)

    assert [row["crm_status"] for row in seen_while_sending[0]] == ["pending"]
    assert [row["crm_status"] for row in storage.leads] == ["sent"]


def test_a_failed_append_returns_503_and_sends_nothing(app, client, crm_client, calculator_storage):
    app.config["CALCULATOR_LEAD_STORAGE"] = _StorageFailing(calculator_storage, "save")

    response = _post_calculator(client)

    assert response.status_code == 503
    assert response.get_json()["error_code"] == "storage_unavailable"
    assert crm_client.contacts == []


def test_a_failed_application_append_returns_503_and_sends_nothing(app, client, crm_client, storage):
    app.config["LEAD_STORAGE"] = _StorageFailing(storage, "save")

    assert _post_vip(client).status_code == 503
    assert crm_client.contacts == []


# --- when nothing is sent ----------------------------------------------------------


@pytest.mark.parametrize("value", ["spam", " x ", 1, True, ["a"]])
def test_a_honeypot_decoy_sends_nothing(client, crm_client, calculator_storage, storage, value):
    assert _post_calculator(client, website=value).status_code == 201
    assert _post_vip(client, website=value).status_code == 201

    assert crm_client.contacts == []
    assert calculator_storage.leads == [] and storage.leads == []


def test_a_validation_error_sends_nothing(client, crm_client):
    assert _post_calculator(client, zone="moon").status_code == 422
    assert _post_vip(client, phone="x").status_code == 422

    assert crm_client.contacts == []


@pytest.mark.parametrize("kwargs", [{"data": "x", "content_type": "text/plain"}, {"data": "[1]", "content_type": "application/json"}])
def test_a_415_or_400_sends_nothing(client, crm_client, kwargs):
    for endpoint in (CALCULATOR_ENDPOINT, VIP_ENDPOINT):
        assert client.post(endpoint, **kwargs).status_code in (400, 415)

    assert crm_client.contacts == []


def test_a_rate_limited_request_sends_nothing(app, client, crm_client):
    from rate_limit import RateLimiter

    app.config["CALCULATOR_RATE_LIMITER"] = RateLimiter(
        max_requests=1, window_seconds=600, clock=lambda: 0.0
    )

    assert _post_calculator(client).status_code == 201
    assert _post_calculator(client).status_code == 429

    assert len(crm_client.contacts) == 1


def test_with_sync_off_nothing_is_sent_and_the_row_says_off(
    client, calculator_storage, storage
):
    # The `app` fixture's default is GHL_SYNC=off: no client at all.
    assert _post_calculator(client).status_code == 201
    assert _post_vip(client).status_code == 201

    assert calculator_storage.leads[0]["crm_status"] == "off"
    assert storage.leads[0]["crm_status"] == "off"


# --- GoHighLevel failing never changes the response ----------------------------------


@pytest.mark.parametrize(
    "error",
    [timeout_error(), http_error(500), http_error(401), CrmError("network"), ValueError("boom")],
    ids=["timeout", "500", "401", "network", "unexpected"],
)
def test_a_gohighlevel_failure_keeps_the_201_and_marks_the_row_failed(
    app, client, calculator_storage, storage, error
):
    app.config["CRM_SYNC"] = CrmSync(enabled=True, client=FakeCrmClient(error=error))

    calculator_response = _post_calculator(client)
    vip_response = _post_vip(client)

    assert calculator_response.status_code == 201
    assert calculator_response.get_json() == {
        "success": True,
        "message": "Lead saved.",
        "error_code": None,
        "field_errors": None,
    }
    assert vip_response.status_code == 201
    assert calculator_storage.leads[0]["crm_status"] == "failed"
    assert storage.leads[0]["crm_status"] == "failed"


def test_incomplete_configuration_marks_the_row_failed_with_a_201(app, client, calculator_storage):
    incomplete = GoHighLevelClient(
        api_token=None, location_id=None, field_ids={}, timeout_seconds=1.0
    )
    app.config["CRM_SYNC"] = CrmSync(enabled=True, client=incomplete)

    assert _post_calculator(client).status_code == 201
    assert calculator_storage.leads[0]["crm_status"] == "failed"


def test_sync_on_without_a_client_marks_the_row_failed(app, client, calculator_storage):
    app.config["CRM_SYNC"] = CrmSync(enabled=True, client=None)

    assert _post_calculator(client).status_code == 201
    assert calculator_storage.leads[0]["crm_status"] == "failed"


def test_a_failed_cell_update_leaves_the_row_pending_and_still_returns_201(
    app, client, crm_client, calculator_storage, caplog
):
    app.config["CALCULATOR_LEAD_STORAGE"] = _StorageFailing(calculator_storage, "set_crm_status")

    with caplog.at_level(logging.ERROR):
        response = _post_calculator(client)

    assert response.status_code == 201
    assert len(crm_client.contacts) == 1
    assert calculator_storage.leads[0]["crm_status"] == "pending"
    assert "crm_status not updated" in caplog.text
    assert "ana.perez@example.com" not in caplog.text


def test_a_failed_application_cell_update_leaves_the_row_pending(app, client, crm_client, storage):
    app.config["LEAD_STORAGE"] = _StorageFailing(storage, "set_crm_status")

    assert _post_vip(client).status_code == 201
    assert storage.leads[0]["crm_status"] == "pending"


# --- logs and responses: no personal data, never the token ---------------------------


def test_a_failure_is_logged_without_personal_data_or_the_token(app, client, caplog):
    def _answer_401(request, timeout_seconds):
        return 401, b'{"message": "ana.perez@example.com is not allowed"}'

    real_client = GoHighLevelClient(
        api_token=TOKEN,
        location_id="location-1",
        field_ids={
            "meses": "a",
            "zona": "b",
            "moneda": "c",
            "alerta_concentracion": "d",
            "preseleccion": "e",
        },
        timeout_seconds=1.0,
        transport=_answer_401,
    )
    app.config["CRM_SYNC"] = CrmSync(enabled=True, client=real_client)

    with caplog.at_level(logging.DEBUG):
        calculator_response = _post_calculator(client, phone="+50684104791")
        vip_response = _post_vip(client)

    assert calculator_response.status_code == 201 and vip_response.status_code == 201
    assert "GoHighLevel contact not sent: http_error 401" in caplog.text
    assert "submitted_at=" in caplog.text
    for secret in (TOKEN, "ana.perez@example.com", "Ana", "Pérez", "+50684104791", "50684104791"):
        assert secret not in caplog.text
        assert secret not in calculator_response.get_data(as_text=True)
        assert secret not in vip_response.get_data(as_text=True)


def test_an_unexpected_client_error_is_logged_by_class_only(app, client, caplog):
    error = ValueError("ana.perez@example.com exploded")
    app.config["CRM_SYNC"] = CrmSync(enabled=True, client=FakeCrmClient(error=error))

    with caplog.at_level(logging.ERROR):
        assert _post_calculator(client).status_code == 201

    assert "unexpected ValueError" in caplog.text
    assert "ana.perez@example.com" not in caplog.text


# --- configuration at startup --------------------------------------------------------


def test_sync_is_off_by_default(monkeypatch):
    monkeypatch.delenv("GHL_SYNC", raising=False)

    assert create_app(api_prefix="/api").config["CRM_SYNC"].enabled is False


def test_sync_on_builds_the_real_client_and_logs_no_values(monkeypatch, caplog):
    monkeypatch.setenv("GHL_SYNC", "on")
    monkeypatch.setenv("GHL_API_TOKEN", TOKEN)
    monkeypatch.setenv("GHL_LOCATION_ID", "location-1")

    with caplog.at_level(logging.INFO):
        sync = create_app(api_prefix="/api").config["CRM_SYNC"]

    assert sync.enabled is True
    assert isinstance(sync._client, GoHighLevelClient)
    assert "GoHighLevel sync: on (token_set=True, location_id_set=True" in caplog.text
    assert "custom_field_ids_missing=" in caplog.text
    assert "incomplete" in caplog.text  # the field ids are not set
    assert TOKEN not in caplog.text
    assert "location-1" not in caplog.text
