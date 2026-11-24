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


def test_calculator_tab_defaults_to_calculator(monkeypatch):
    monkeypatch.delenv("GOOGLE_SHEET_CALCULATOR_TAB", raising=False)

    assert Config().GOOGLE_SHEET_CALCULATOR_TAB == "calculator"


def test_calculator_tab_is_read_from_the_environment(monkeypatch):
    monkeypatch.setenv("GOOGLE_SHEET_CALCULATOR_TAB", "calculadora")

    assert Config().GOOGLE_SHEET_CALCULATOR_TAB == "calculadora"


# --- GoHighLevel (LEAD_API_CONTRACT.md sections 9 and 12) -----------------

GHL_VARIABLES = (
    "GHL_SYNC",
    "GHL_API_TOKEN",
    "GHL_LOCATION_ID",
    "GHL_FIELD_MESES",
    "GHL_FIELD_ZONA",
    "GHL_FIELD_MONEDA",
    "GHL_FIELD_ALERTA",
    "GHL_FIELD_PRESELECCION",
    "GHL_TIMEOUT_SECONDS",
)


@pytest.fixture()
def no_ghl_variables(monkeypatch):
    for variable in GHL_VARIABLES:
        monkeypatch.delenv(variable, raising=False)


def test_ghl_defaults_when_unset(no_ghl_variables):
    config = Config()

    assert config.GHL_SYNC_ENABLED is False
    assert config.GHL_API_TOKEN is None
    assert config.GHL_LOCATION_ID is None
    assert config.GHL_FIELD_IDS == {
        "meses": None,
        "zona": None,
        "moneda": None,
        "alerta_concentracion": None,
        "preseleccion": None,
    }
    assert config.GHL_TIMEOUT_SECONDS == 5


def test_ghl_values_are_read_from_the_environment(no_ghl_variables, monkeypatch):
    monkeypatch.setenv("GHL_SYNC", "on")
    monkeypatch.setenv("GHL_API_TOKEN", "token-value")
    monkeypatch.setenv("GHL_LOCATION_ID", "location-1")
    monkeypatch.setenv("GHL_FIELD_MESES", "field-meses")
    monkeypatch.setenv("GHL_FIELD_ALERTA", "field-alerta")
    monkeypatch.setenv("GHL_TIMEOUT_SECONDS", "2.5")

    config = Config()

    assert config.GHL_SYNC_ENABLED is True
    assert config.GHL_API_TOKEN == "token-value"
    assert config.GHL_LOCATION_ID == "location-1"
    assert config.GHL_FIELD_IDS["meses"] == "field-meses"
    assert config.GHL_FIELD_IDS["alerta_concentracion"] == "field-alerta"
    assert config.GHL_FIELD_IDS["zona"] is None
    assert config.GHL_TIMEOUT_SECONDS == 2.5


@pytest.mark.parametrize("value", ["yes", "true", "1", ""])
def test_ghl_sync_other_than_on_or_off_is_rejected(no_ghl_variables, monkeypatch, value):
    monkeypatch.setenv("GHL_SYNC", value)

    with pytest.raises(ValueError):
        Config()


@pytest.mark.parametrize("value", ["0", "-1", "nan"])
def test_non_positive_ghl_timeout_is_rejected(no_ghl_variables, monkeypatch, value):
    monkeypatch.setenv("GHL_TIMEOUT_SECONDS", value)

    with pytest.raises(ValueError):
        Config()
