"""US-016 AC5: passenger_wsgi.py defaults LEADS_STORAGE to google_sheets
so a setting missed on cPanel cannot silently leave leads in memory.
"""

from __future__ import annotations

import os
import sys

import pytest

from storage import GoogleSheetsLeadStorage, MemoryLeadStorage


@pytest.fixture()
def fresh_passenger_wsgi_import(monkeypatch):
    # Not monkeypatch.delenv(..., raising=False): when the key is already
    # absent that records nothing to undo, so passenger_wsgi's own
    # os.environ.setdefault() (an untracked, direct mutation) would leak
    # into later tests. Managing cleanup manually here is robust either way.
    monkeypatch.delenv("LEADS_STORAGE", raising=False)
    sys.modules.pop("passenger_wsgi", None)
    try:
        yield
    finally:
        os.environ.pop("LEADS_STORAGE", None)
        sys.modules.pop("passenger_wsgi", None)


def test_defaults_to_google_sheets_when_unset(fresh_passenger_wsgi_import, monkeypatch):
    monkeypatch.setenv("GOOGLE_SHEET_ID", "sheet-123")
    monkeypatch.setenv("GOOGLE_SHEET_TAB", "leads")
    monkeypatch.setenv("GOOGLE_SERVICE_ACCOUNT_FILE", "/does/not/exist.json")

    import passenger_wsgi

    assert os.environ["LEADS_STORAGE"] == "google_sheets"
    assert isinstance(passenger_wsgi.application.config["LEAD_STORAGE"], GoogleSheetsLeadStorage)


def test_does_not_override_an_explicit_memory_setting(fresh_passenger_wsgi_import, monkeypatch):
    monkeypatch.setenv("LEADS_STORAGE", "memory")

    import passenger_wsgi

    assert os.environ["LEADS_STORAGE"] == "memory"
    assert isinstance(passenger_wsgi.application.config["LEAD_STORAGE"], MemoryLeadStorage)


def test_does_not_override_an_explicit_google_sheets_setting(
    fresh_passenger_wsgi_import, monkeypatch
):
    monkeypatch.setenv("LEADS_STORAGE", "google_sheets")
    monkeypatch.setenv("GOOGLE_SHEET_ID", "sheet-123")
    monkeypatch.setenv("GOOGLE_SHEET_TAB", "leads")
    monkeypatch.setenv("GOOGLE_SERVICE_ACCOUNT_FILE", "/does/not/exist.json")

    import passenger_wsgi

    assert os.environ["LEADS_STORAGE"] == "google_sheets"
    assert isinstance(passenger_wsgi.application.config["LEAD_STORAGE"], GoogleSheetsLeadStorage)
