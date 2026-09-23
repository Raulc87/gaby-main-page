from __future__ import annotations

import pytest

from config import Config
from storage import GoogleSheetsLeadStorage, MemoryLeadStorage, create_storage


def _config(**overrides) -> Config:
    config = Config()
    for key, value in overrides.items():
        setattr(config, key, value)
    return config


def test_memory_storage_selected_by_default():
    storage = create_storage(_config(LEADS_STORAGE="memory"))

    assert isinstance(storage, MemoryLeadStorage)


def test_google_sheets_storage_selected_and_configured():
    storage = create_storage(
        _config(
            LEADS_STORAGE="google_sheets",
            GOOGLE_SERVICE_ACCOUNT_FILE="/secure/service-account.json",
            GOOGLE_SHEET_ID="sheet-123",
            GOOGLE_SHEET_TAB="leads",
        )
    )

    assert isinstance(storage, GoogleSheetsLeadStorage)


def test_unsupported_storage_value_raises():
    with pytest.raises(ValueError):
        create_storage(_config(LEADS_STORAGE="postgres"))
