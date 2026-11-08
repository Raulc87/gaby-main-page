"""Route tests for US-036 (LEAD_API_CONTRACT.md v1.2 section 11, test obligations 11.6).

The `app`/`client`/`storage`/`calculator_storage` fixtures come from
conftest.py, where both rate limiters are disabled by default.
"""

from __future__ import annotations

import json
import logging
import re

import pytest

from rate_limit import RateLimiter
from storage.base import StorageError

ENDPOINT = "/api/save-calculator-lead"
VIP_ENDPOINT = "/api/save-lead"

VALID_PAYLOAD = {
    "name": "Ana María Pérez Soto",
    "email": "ana.perez@example.com",
    "phone": None,
    "language": "es",
    "consent": True,
    "marketing_consent": False,
    "months": 4.4,
    "zone": "alert",
}

VIP_PAYLOAD = {
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


def _payload(**overrides) -> dict:
    return {**VALID_PAYLOAD, **overrides}


def _without(*fields: str) -> dict:
    return {key: value for key, value in VALID_PAYLOAD.items() if key not in fields}


def _post(client, payload: dict):
    return client.post(ENDPOINT, json=payload)


def _install_limiters(app, max_requests: int, window_seconds: float = 600, clock=None):
    """Install separate limiters for the two endpoints, as the app does."""
    for key in ("RATE_LIMITER", "CALCULATOR_RATE_LIMITER"):
        app.config[key] = RateLimiter(
            max_requests=max_requests,
            window_seconds=window_seconds,
            clock=clock or (lambda: 0.0),
        )


# --- success and the stored row (11.4, 11.5) ---------------------------


def test_valid_submission_returns_201_and_contract_shape(client, calculator_storage):
    response = _post(client, VALID_PAYLOAD)

    assert response.status_code == 201
    assert response.get_json() == {
        "success": True,
        "message": "Lead saved.",
        "error_code": None,
        "field_errors": None,
    }
    assert len(calculator_storage.leads) == 1


def test_stored_row_has_exactly_the_contract_columns(client, calculator_storage):
    _post(client, _payload(phone="+506 8410-4791", marketing_consent=True))

    saved = calculator_storage.leads[0]
    assert list(saved) == [
        "submitted_at",
        "name",
        "email",
        "phone",
        "language",
        "months",
        "zone",
        "consent",
        "marketing_consent",
        "source",
        "privacy_notice_version",
        "status",
    ]
    assert SUBMITTED_AT_PATTERN.match(saved["submitted_at"])
    assert saved["name"] == "Ana María Pérez Soto"
    assert saved["email"] == "ana.perez@example.com"
    assert saved["phone"] == "+50684104791"
    assert saved["language"] == "es"
    assert saved["months"] == "4.4"
    assert saved["zone"] == "alert"
    assert saved["consent"] is True
    assert saved["marketing_consent"] is True
    assert saved["source"] == "calculator"
    assert saved["privacy_notice_version"] == "2026-09-draft-1"
    assert saved["status"] == "started"


def test_lead_is_stored_in_the_calculator_storage_only(client, storage, calculator_storage):
    _post(client, VALID_PAYLOAD)

    assert len(calculator_storage.leads) == 1
    assert storage.leads == []


def test_row_never_carries_the_calculator_figures(client, calculator_storage):
    figures = {
        "monthly_expenses": 1500,
        "savings": 9000,
        "income": 3000,
        "debts": 200,
        "investments": 4000,
        "anything_else": "x",
    }

    response = _post(client, {**VALID_PAYLOAD, **figures})

    assert response.status_code == 201
    saved = calculator_storage.leads[0]
    assert not set(figures) & set(saved)
    assert "9000" not in json.dumps(saved)


def test_unprefixed_route_is_served_for_passenger(app):
    """Passenger strips /api before the request reaches the app (ADR-001)."""
    from app import create_app

    unprefixed = create_app(api_prefix="")
    unprefixed.config.update(TESTING=True)

    response = unprefixed.test_client().post("/save-calculator-lead", json=VALID_PAYLOAD)

    assert response.status_code == 201


# --- phone (optional) --------------------------------------------------


@pytest.mark.parametrize("phone", [None, "", "   "])
def test_phone_empty_forms_store_an_empty_phone(client, calculator_storage, phone):
    assert _post(client, _payload(phone=phone)).status_code == 201
    assert calculator_storage.leads[0]["phone"] == ""


def test_phone_absent_stores_an_empty_phone(client, calculator_storage):
    assert _post(client, _without("phone")).status_code == 201
    assert calculator_storage.leads[0]["phone"] == ""


def test_phone_is_normalized_to_e164(client, calculator_storage):
    assert _post(client, _payload(phone="+506 (8410) 47-91")).status_code == 201
    assert calculator_storage.leads[0]["phone"] == "+50684104791"


@pytest.mark.parametrize("phone", ["84104791", "+0123456789", "+506", "abc"])
def test_phone_present_but_invalid_is_invalid_format(client, calculator_storage, phone):
    response = _post(client, _payload(phone=phone))

    assert response.status_code == 422
    assert response.get_json()["field_errors"] == {"phone": "invalid_format"}
    assert calculator_storage.leads == []


def test_phone_with_wrong_type_is_invalid_type(client):
    response = _post(client, _payload(phone=50684104791))

    assert response.status_code == 422
    assert response.get_json()["field_errors"] == {"phone": "invalid_type"}


# --- name, email, language, consent (shared rules of section 3) --------


@pytest.mark.parametrize(
    ("overrides", "field", "code"),
    [
        ({"name": "Ana"}, "name", "full_name_required"),
        ({"name": "A"}, "name", "too_short"),
        ({"name": "Ana 3 Perez"}, "name", "invalid_characters"),
        ({"name": "Ana " + "x" * 100}, "name", "too_long"),
        ({"name": ""}, "name", "required"),
        ({"name": 12}, "name", "invalid_type"),
        ({"email": "not-an-email"}, "email", "invalid_format"),
        ({"email": ""}, "email", "required"),
        ({"language": "fr"}, "language", "invalid_option"),
        ({"language": ""}, "language", "required"),
        ({"consent": False}, "consent", "consent_required"),
        ({"consent": "true"}, "consent", "invalid_type"),
        ({"consent": None}, "consent", "required"),
    ],
)
def test_invalid_field_returns_422_with_its_code(client, calculator_storage, overrides, field, code):
    response = _post(client, _payload(**overrides))

    assert response.status_code == 422
    body = response.get_json()
    assert body["success"] is False
    assert body["error_code"] == "validation_error"
    assert body["field_errors"] == {field: code}
    assert calculator_storage.leads == []


@pytest.mark.parametrize("field", ["name", "email", "language", "consent", "months", "zone"])
def test_missing_required_field_is_required(client, field):
    response = _post(client, _without(field))

    assert response.status_code == 422
    assert response.get_json()["field_errors"] == {field: "required"}


def test_all_errors_are_reported_together(client):
    response = _post(client, _payload(name="Ana", consent=False, zone="moon"))

    assert response.get_json()["field_errors"] == {
        "name": "full_name_required",
        "consent": "consent_required",
        "zone": "invalid_option",
    }


# --- marketing_consent (optional boolean) ------------------------------


def test_marketing_consent_absent_is_false(client, calculator_storage):
    assert _post(client, _without("marketing_consent")).status_code == 201
    assert calculator_storage.leads[0]["marketing_consent"] is False


@pytest.mark.parametrize("value", [True, False])
def test_marketing_consent_is_stored_as_sent(client, calculator_storage, value):
    assert _post(client, _payload(marketing_consent=value)).status_code == 201
    assert calculator_storage.leads[0]["marketing_consent"] is value


@pytest.mark.parametrize("value", ["true", 1, None, [True]])
def test_marketing_consent_with_wrong_type_is_invalid_type(client, value):
    response = _post(client, _payload(marketing_consent=value))

    assert response.status_code == 422
    assert response.get_json()["field_errors"] == {"marketing_consent": "invalid_type"}


# --- months and zone (11.2, 11.3) --------------------------------------


@pytest.mark.parametrize(
    ("months", "zone", "stored"),
    [
        (0, "alert", "0.0"),
        (4.4, "alert", "4.4"),
        (5.9, "alert", "5.9"),
        (6, "building", "6.0"),
        (6.0, "building", "6.0"),
        (11.9, "building", "11.9"),
        (12, "freedom", "12.0"),
        (12.5, "freedom", "12.5"),
        (1500, "freedom", "1500.0"),
        (1234567.8, "freedom", "1234567.8"),
        (1e20, "freedom", "100000000000000000000.0"),
    ],
)
def test_months_and_zone_accepted_with_one_decimal_text(
    client, calculator_storage, months, zone, stored
):
    response = _post(client, _payload(months=months, zone=zone))

    assert response.status_code == 201
    assert calculator_storage.leads[0]["months"] == stored
    assert calculator_storage.leads[0]["zone"] == zone


def test_months_null_with_freedom_is_covered_and_stored_empty(client, calculator_storage):
    response = _post(client, _payload(months=None, zone="freedom"))

    assert response.status_code == 201
    assert calculator_storage.leads[0]["months"] == ""
    assert calculator_storage.leads[0]["zone"] == "freedom"


@pytest.mark.parametrize("zone", ["alert", "building"])
def test_months_null_with_another_zone_is_a_mismatch(client, zone):
    response = _post(client, _payload(months=None, zone=zone))

    assert response.status_code == 422
    assert response.get_json()["field_errors"] == {"zone": "zone_mismatch"}


@pytest.mark.parametrize(
    ("months", "zone"),
    [
        (5.9, "building"),
        (5.9, "freedom"),
        (6, "alert"),
        (11.9, "freedom"),
        (12, "building"),
        (12, "alert"),
        (0, "freedom"),
        (30, "building"),
    ],
)
def test_zone_that_does_not_match_months_is_zone_mismatch(client, calculator_storage, months, zone):
    response = _post(client, _payload(months=months, zone=zone))

    assert response.status_code == 422
    assert response.get_json()["field_errors"] == {"zone": "zone_mismatch"}
    assert calculator_storage.leads == []


@pytest.mark.parametrize("months", [-1, -0.1, 4.45, 4.44, 0.05, 1e-7])
def test_months_negative_or_more_than_one_decimal_is_invalid_format(client, months):
    response = _post(client, _payload(months=months))

    assert response.status_code == 422
    assert response.get_json()["field_errors"] == {"months": "invalid_format"}


@pytest.mark.parametrize("literal", ["NaN", "Infinity", "-Infinity"])
def test_months_not_finite_is_invalid_format(client, literal):
    # Python's JSON parser accepts these literals, so the server must reject them.
    body = json.dumps(VALID_PAYLOAD).replace("4.4", literal)

    response = client.post(ENDPOINT, data=body, content_type="application/json")

    assert response.status_code == 422
    assert response.get_json()["field_errors"] == {"months": "invalid_format"}


@pytest.mark.parametrize("months", ["4.4", True, False, [4.4], {"v": 4}])
def test_months_with_wrong_type_is_invalid_type(client, months):
    response = _post(client, _payload(months=months))

    assert response.status_code == 422
    assert response.get_json()["field_errors"] == {"months": "invalid_type"}


@pytest.mark.parametrize("zone", ["moon", "ALERT", ""])
def test_unknown_zone_is_invalid_option_or_required(client, zone):
    response = _post(client, _payload(zone=zone))

    assert response.status_code == 422
    expected = "required" if zone == "" else "invalid_option"
    assert response.get_json()["field_errors"] == {"zone": expected}


def test_zone_with_wrong_type_is_invalid_type(client):
    response = _post(client, _payload(zone=3))

    assert response.get_json()["field_errors"] == {"zone": "invalid_type"}


def test_invalid_months_does_not_also_report_a_zone_mismatch(client):
    response = _post(client, _payload(months=-3, zone="freedom"))

    assert response.get_json()["field_errors"] == {"months": "invalid_format"}


# --- HTTP-level checks (section 7) -------------------------------------


def test_non_json_content_type_is_415(client):
    response = client.post(ENDPOINT, data="x", content_type="text/plain")

    assert response.status_code == 415
    assert response.get_json()["error_code"] == "unsupported_media_type"


@pytest.mark.parametrize("body", ["not json", "[1, 2]", '"text"'])
def test_invalid_or_non_object_json_is_400(client, body):
    response = client.post(ENDPOINT, data=body, content_type="application/json")

    assert response.status_code == 400
    assert response.get_json()["error_code"] == "invalid_json"


def test_get_is_405_with_allow_post(client):
    response = client.get(ENDPOINT)

    assert response.status_code == 405
    assert "POST" in response.headers["Allow"]
    assert response.get_json()["error_code"] == "method_not_allowed"


def test_body_over_10_kb_is_413(client):
    response = _post(client, _payload(name="Ana " + "x" * 11000))

    assert response.status_code == 413
    assert response.get_json()["error_code"] == "payload_too_large"


# --- storage failure (NFR-006) -----------------------------------------


def test_storage_error_returns_503_and_never_success(app, client, caplog):
    app.config["CALCULATOR_LEAD_STORAGE"] = _FailingStorage(StorageError("boom"))

    with caplog.at_level(logging.ERROR):
        response = _post(client, VALID_PAYLOAD)

    assert response.status_code == 503
    body = response.get_json()
    assert body["success"] is False
    assert body["error_code"] == "storage_unavailable"
    assert "ana.perez@example.com" not in caplog.text
    assert "POST /save-calculator-lead failed: storage_unavailable" in caplog.text


def test_unexpected_error_returns_500_without_leaking_data(app, client, caplog):
    app.config["CALCULATOR_LEAD_STORAGE"] = _FailingStorage(
        ValueError("ana.perez@example.com exploded")
    )

    with caplog.at_level(logging.ERROR):
        response = _post(client, VALID_PAYLOAD)

    assert response.status_code == 500
    assert response.get_json()["error_code"] == "internal_error"
    assert "ana.perez@example.com" not in caplog.text
    assert "ana.perez@example.com" not in response.get_data(as_text=True)


def test_vip_storage_failure_does_not_affect_the_calculator(app, client, calculator_storage):
    app.config["LEAD_STORAGE"] = _FailingStorage(StorageError("boom"))

    assert _post(client, VALID_PAYLOAD).status_code == 201
    assert len(calculator_storage.leads) == 1


# --- honeypot (section 3.1) --------------------------------------------


@pytest.mark.parametrize("value", ["http://spam.example", " x ", 1, True, ["a"], {"a": 1}, 0, False])
def test_filled_honeypot_returns_decoy_201_and_stores_nothing(
    client, calculator_storage, caplog, value
):
    with caplog.at_level(logging.INFO):
        response = _post(client, _payload(website=value))

    assert response.status_code == 201
    assert response.get_json()["success"] is True
    assert calculator_storage.leads == []
    assert "honeypot triggered" in caplog.text
    assert "ana.perez@example.com" not in caplog.text


@pytest.mark.parametrize("value", [None, "", "   "])
def test_empty_honeypot_is_processed_normally(client, calculator_storage, value):
    assert _post(client, _payload(website=value)).status_code == 201
    assert len(calculator_storage.leads) == 1
    assert "website" not in calculator_storage.leads[0]


def test_absent_honeypot_is_processed_normally(client, calculator_storage):
    assert _post(client, VALID_PAYLOAD).status_code == 201
    assert len(calculator_storage.leads) == 1


def test_a_bot_never_receives_field_errors(client, calculator_storage):
    response = _post(client, {"website": "spam", "name": "x", "months": -5})

    assert response.status_code == 201
    assert calculator_storage.leads == []


# --- rate limit with its own budget (section 11.1) ----------------------


def test_request_over_limit_returns_429_with_retry_after(app, client, calculator_storage):
    _install_limiters(app, max_requests=1)

    _post(client, VALID_PAYLOAD)
    response = _post(client, VALID_PAYLOAD)

    assert response.status_code == 429
    body = response.get_json()
    assert body["success"] is False
    assert body["error_code"] == "rate_limited"
    assert response.headers["Retry-After"] == "600"
    assert len(calculator_storage.leads) == 1


def test_rejected_requests_do_not_count_and_a_retry_after_the_wait_is_accepted(
    app, client, calculator_storage
):
    now = [0.0]
    _install_limiters(app, max_requests=1, window_seconds=600, clock=lambda: now[0])

    assert _post(client, VALID_PAYLOAD).status_code == 201
    now[0] = 100.0
    rejected = _post(client, VALID_PAYLOAD)
    assert rejected.status_code == 429
    assert rejected.headers["Retry-After"] == "500"

    now[0] = 600.0
    assert _post(client, VALID_PAYLOAD).status_code == 201
    assert len(calculator_storage.leads) == 2


def test_calculator_requests_do_not_count_against_the_vip_endpoint(app, client, storage):
    _install_limiters(app, max_requests=1)

    assert _post(client, VALID_PAYLOAD).status_code == 201
    assert _post(client, VALID_PAYLOAD).status_code == 429

    assert client.post(VIP_ENDPOINT, json=VIP_PAYLOAD).status_code == 201
    assert len(storage.leads) == 1


def test_vip_requests_do_not_count_against_the_calculator(app, client, calculator_storage):
    _install_limiters(app, max_requests=1)

    assert client.post(VIP_ENDPOINT, json=VIP_PAYLOAD).status_code == 201
    assert client.post(VIP_ENDPOINT, json=VIP_PAYLOAD).status_code == 429

    assert _post(client, VALID_PAYLOAD).status_code == 201
    assert len(calculator_storage.leads) == 1


def test_non_post_requests_to_the_calculator_count_against_its_budget(app, client):
    _install_limiters(app, max_requests=1)

    assert client.get(ENDPOINT).status_code == 405
    assert client.get(ENDPOINT).status_code == 429


def test_rate_limit_is_checked_before_content_type(app, client):
    _install_limiters(app, max_requests=1)

    client.post(ENDPOINT, data="x", content_type="text/plain")
    response = client.post(ENDPOINT, data="x", content_type="text/plain")

    assert response.status_code == 429


def test_each_endpoint_gets_its_own_limiter_from_the_configuration(monkeypatch):
    from app import create_app

    monkeypatch.setenv("RATE_LIMIT_MAX_REQUESTS", "3")
    monkeypatch.setenv("RATE_LIMIT_WINDOW_SECONDS", "60")

    fresh = create_app(api_prefix="/api")

    assert fresh.config["RATE_LIMITER"] is not fresh.config["CALCULATOR_RATE_LIMITER"]
    assert fresh.config["CALCULATOR_RATE_LIMITER"].enabled
