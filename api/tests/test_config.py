"""Rate-limit configuration validation (LEAD_API_CONTRACT.md section 9).

Only RATE_LIMIT_MAX_REQUESTS=0 means "disabled"; any other invalid value
must fail startup loudly instead of silently weakening or turning off
NFR-008 spam protection.
"""

from __future__ import annotations

import pytest

from config import Config


def test_defaults_when_unset(monkeypatch):
    monkeypatch.delenv("RATE_LIMIT_MAX_REQUESTS", raising=False)
    monkeypatch.delenv("RATE_LIMIT_WINDOW_SECONDS", raising=False)

    config = Config()

    assert config.RATE_LIMIT_MAX_REQUESTS == 5
    assert config.RATE_LIMIT_WINDOW_SECONDS == 600


def test_zero_max_requests_disables_the_limit(monkeypatch):
    monkeypatch.setenv("RATE_LIMIT_MAX_REQUESTS", "0")

    config = Config()

    assert config.RATE_LIMIT_MAX_REQUESTS == 0


def test_negative_max_requests_is_rejected(monkeypatch):
    monkeypatch.setenv("RATE_LIMIT_MAX_REQUESTS", "-1")

    with pytest.raises(ValueError):
        Config()


def test_zero_window_seconds_is_rejected(monkeypatch):
    monkeypatch.setenv("RATE_LIMIT_WINDOW_SECONDS", "0")

    with pytest.raises(ValueError):
        Config()


def test_negative_window_seconds_is_rejected(monkeypatch):
    monkeypatch.setenv("RATE_LIMIT_WINDOW_SECONDS", "-600")

    with pytest.raises(ValueError):
        Config()
