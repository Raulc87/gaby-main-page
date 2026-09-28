"""Route-level tests for US-013 (LEAD_API_CONTRACT.md v1.1 sections 3.1, 3.2, 7).

The `app`/`client`/`storage` fixtures come from conftest.py, where the rate
limiter is disabled by default so these tests are isolated from each other;
the rate-limit tests below install their own RateLimiter.
"""

from __future__ import annotations

import json

import pytest

from rate_limit import RateLimiter

VALID_PAYLOAD = {
    "name": "Ana Perez",
    "email": "ana.perez@example.com",
    "phone": "+50684104791",
    "screening_answer": "needs_investment_info",
    "language": "es",
    "consent": True,
}


def _install_limiter(app, max_requests: int, window_seconds: float, clock=None):
    limiter = RateLimiter(
        max_requests=max_requests,
        window_seconds=window_seconds,
        clock=clock or (lambda: 0.0),
    )
    app.config["RATE_LIMITER"] = limiter
    return limiter


# --- rate limit (section 3.2) ------------------------------------------


def test_requests_within_limit_are_accepted(app, client):
    _install_limiter(app, max_requests=2, window_seconds=600)

    first = client.post("/api/save-lead", json=VALID_PAYLOAD)
    second = client.post("/api/save-lead", json=VALID_PAYLOAD)

    assert first.status_code == 201
    assert second.status_code == 201


def test_request_over_limit_returns_429_with_retry_after(app, client, storage):
    _install_limiter(app, max_requests=1, window_seconds=600)

    client.post("/api/save-lead", json=VALID_PAYLOAD)
    response = client.post("/api/save-lead", json=VALID_PAYLOAD)

    assert response.status_code == 429
    body = response.get_json()
    assert body["success"] is False
    assert body["error_code"] == "rate_limited"
    assert body["field_errors"] is None
    assert response.headers["Retry-After"] == "600"
    assert len(storage.leads) == 1  # only the first (accepted) request stored


def test_rejected_request_is_not_counted_and_next_window_is_accepted(app, client):
    now = [0.0]
    _install_limiter(app, max_requests=1, window_seconds=600, clock=lambda: now[0])

    client.post("/api/save-lead", json=VALID_PAYLOAD)  # counted
    rejected = client.post("/api/save-lead", json=VALID_PAYLOAD)  # not counted
    assert rejected.status_code == 429

    now[0] = 600.0  # the one counted request now leaves the window
    accepted = client.post("/api/save-lead", json=VALID_PAYLOAD)
    assert accepted.status_code == 201


def test_window_expiry_frees_the_limit(app, client):
    now = [0.0]
    _install_limiter(app, max_requests=1, window_seconds=10, clock=lambda: now[0])

    client.post("/api/save-lead", json=VALID_PAYLOAD)
    still_limited = client.post("/api/save-lead", json=VALID_PAYLOAD)
    assert still_limited.status_code == 429

    now[0] = 10.0
    after_expiry = client.post("/api/save-lead", json=VALID_PAYLOAD)
    assert after_expiry.status_code == 201


def test_disabled_limit_never_rejects(app, client):
    _install_limiter(app, max_requests=0, window_seconds=600)

    for _ in range(10):
        response = client.post("/api/save-lead", json=VALID_PAYLOAD)
        assert response.status_code == 201


def test_rate_limit_is_checked_before_honeypot(app, client):
    _install_limiter(app, max_requests=1, window_seconds=600)

    client.post("/api/save-lead", json=VALID_PAYLOAD)
    payload = dict(VALID_PAYLOAD)
    payload["website"] = "https://bot.example"
    response = client.post("/api/save-lead", json=payload)

    assert response.status_code == 429


def test_rate_limit_is_per_ip(app, client):
    _install_limiter(app, max_requests=1, window_seconds=600)

    first = client.post(
        "/api/save-lead", json=VALID_PAYLOAD, environ_overrides={"REMOTE_ADDR": "10.0.0.1"}
    )
    second = client.post(
        "/api/save-lead", json=VALID_PAYLOAD, environ_overrides={"REMOTE_ADDR": "10.0.0.2"}
    )

    assert first.status_code == 201
    assert second.status_code == 201


def test_rate_limit_does_not_trust_x_forwarded_for(app, client):
    _install_limiter(app, max_requests=1, window_seconds=600)

    client.post(
        "/api/save-lead",
        json=VALID_PAYLOAD,
        environ_overrides={"REMOTE_ADDR": "10.0.0.1"},
        headers={"X-Forwarded-For": "1.1.1.1"},
    )
    response = client.post(
        "/api/save-lead",
        json=VALID_PAYLOAD,
        environ_overrides={"REMOTE_ADDR": "10.0.0.1"},
        headers={"X-Forwarded-For": "2.2.2.2"},
    )

    assert response.status_code == 429  # same REMOTE_ADDR, spoofed header ignored


# --- honeypot (section 3.1) ---------------------------------------------


def test_filled_honeypot_returns_201_and_stores_nothing(client, storage):
    payload = dict(VALID_PAYLOAD)
    payload["website"] = "https://spambot.example"

    response = client.post("/api/save-lead", json=payload)

    assert response.status_code == 201
    body = response.get_json()
    assert body["success"] is True
    assert body["error_code"] is None
    assert body["field_errors"] is None
    assert storage.leads == []


@pytest.mark.parametrize("value", [123, 1.5, True, False, {"a": 1}, ["x"]])
def test_non_string_honeypot_returns_201_and_stores_nothing(client, storage, value):
    payload = dict(VALID_PAYLOAD)
    payload["website"] = value

    response = client.post("/api/save-lead", json=payload)

    assert response.status_code == 201
    assert storage.leads == []


@pytest.mark.parametrize("value", [None, "", "   "])
def test_empty_honeypot_is_processed_normally(client, storage, value):
    payload = dict(VALID_PAYLOAD)
    payload["website"] = value

    response = client.post("/api/save-lead", json=payload)

    assert response.status_code == 201
    assert len(storage.leads) == 1
    assert "website" not in storage.leads[0]


def test_missing_honeypot_is_processed_normally(client, storage):
    response = client.post("/api/save-lead", json=VALID_PAYLOAD)

    assert response.status_code == 201
    assert len(storage.leads) == 1
    assert "website" not in storage.leads[0]


def test_bot_never_receives_422(client, storage):
    # No required fields at all, but the honeypot is filled: the decoy
    # response must win over field validation, per section 3.1.
    payload = {"website": "https://spambot.example"}

    response = client.post("/api/save-lead", json=payload)

    assert response.status_code == 201
    assert response.get_json()["error_code"] is None
    assert storage.leads == []


def test_honeypot_checked_after_content_type_and_json_checks(client, storage):
    payload = dict(VALID_PAYLOAD)
    payload["website"] = "https://spambot.example"

    wrong_content_type = client.post(
        "/api/save-lead", data=json.dumps(payload), content_type="text/plain"
    )
    assert wrong_content_type.status_code == 415

    invalid_json = client.post(
        "/api/save-lead", data="{not valid json", content_type="application/json"
    )
    assert invalid_json.status_code == 400

    assert storage.leads == []
