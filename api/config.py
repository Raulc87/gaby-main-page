"""Backend configuration, read from environment variables.

Variable names and purpose match docs/specs/LEAD_API_CONTRACT.md section 9.
"""

from __future__ import annotations

import os

# LEAD_API_CONTRACT.md section 12: the custom fields Gaby creates in
# GoHighLevel, by their name in the contract and the variable holding their id.
GHL_FIELD_ENVIRONMENT_VARIABLES = {
    "meses": "GHL_FIELD_MESES",
    "zona": "GHL_FIELD_ZONA",
    "moneda": "GHL_FIELD_MONEDA",
    "alerta_concentracion": "GHL_FIELD_ALERTA",
    "preseleccion": "GHL_FIELD_PRESELECCION",
}
GHL_SYNC_VALUES = {"on": True, "off": False}
GHL_DEFAULT_TIMEOUT_SECONDS = "5"


class Config:
    def __init__(self) -> None:
        self.LEADS_STORAGE = os.environ.get("LEADS_STORAGE", "memory")
        self.PRIVACY_NOTICE_VERSION = os.environ.get("PRIVACY_NOTICE_VERSION", "")
        self.GOOGLE_SERVICE_ACCOUNT_FILE = os.environ.get("GOOGLE_SERVICE_ACCOUNT_FILE")
        self.GOOGLE_SHEET_ID = os.environ.get("GOOGLE_SHEET_ID")
        self.GOOGLE_SHEET_TAB = os.environ.get("GOOGLE_SHEET_TAB", "leads")
        # Calculator leads (contract v1.2 section 11.5) go to their own tab.
        self.GOOGLE_SHEET_CALCULATOR_TAB = os.environ.get(
            "GOOGLE_SHEET_CALCULATOR_TAB", "calculator"
        )

        # Only 0 means "disabled" (contract section 9); anything else
        # invalid fails startup loudly instead of silently weakening or
        # turning off NFR-008 spam protection.
        max_requests = int(os.environ.get("RATE_LIMIT_MAX_REQUESTS", "5"))
        if max_requests < 0:
            raise ValueError(
                "RATE_LIMIT_MAX_REQUESTS must be 0 (disabled) or a positive "
                f"integer, got {max_requests!r}."
            )
        self.RATE_LIMIT_MAX_REQUESTS = max_requests

        window_seconds = int(os.environ.get("RATE_LIMIT_WINDOW_SECONDS", "600"))
        if window_seconds <= 0:
            raise ValueError(
                f"RATE_LIMIT_WINDOW_SECONDS must be a positive integer, got {window_seconds!r}."
            )
        self.RATE_LIMIT_WINDOW_SECONDS = window_seconds

        self.GHL_SYNC_ENABLED = _parse_ghl_sync(os.environ.get("GHL_SYNC", "off"))
        # Secret: read here and passed to the client only; never logged.
        self.GHL_API_TOKEN = os.environ.get("GHL_API_TOKEN") or None
        self.GHL_LOCATION_ID = os.environ.get("GHL_LOCATION_ID") or None
        self.GHL_FIELD_IDS = {
            name: os.environ.get(variable) or None
            for name, variable in GHL_FIELD_ENVIRONMENT_VARIABLES.items()
        }

        timeout_seconds = float(
            os.environ.get("GHL_TIMEOUT_SECONDS", GHL_DEFAULT_TIMEOUT_SECONDS)
        )
        if not timeout_seconds > 0:
            raise ValueError(
                f"GHL_TIMEOUT_SECONDS must be a positive number, got {timeout_seconds!r}."
            )
        self.GHL_TIMEOUT_SECONDS = timeout_seconds


def _parse_ghl_sync(value: str) -> bool:
    # Anything but on/off fails startup loudly: a typo must not silently stop
    # (or start) sending personal data to a third party.
    try:
        return GHL_SYNC_VALUES[value.strip().lower()]
    except KeyError:
        raise ValueError(f"GHL_SYNC must be 'on' or 'off', got {value!r}.") from None
