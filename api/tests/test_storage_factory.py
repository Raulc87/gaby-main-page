from __future__ import annotations

import pytest

from config import Config
from storage import (
    GoogleSheetsLeadStorage,
    MemoryLeadStorage,
    create_calculator_storage,
    create_storage,
)
from storage.google_sheets import CALCULATOR_COLUMN_ORDER


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


def test_calculator_storage_is_a_separate_memory_storage():
    config = _config(LEADS_STORAGE="memory")

    calculator_storage = create_calculator_storage(config)

    assert isinstance(calculator_storage, MemoryLeadStorage)
    assert calculator_storage is not create_storage(config)


def test_calculator_storage_uses_its_own_tab_and_columns():
    storage = create_calculator_storage(
        _config(
            LEADS_STORAGE="google_sheets",
            GOOGLE_SERVICE_ACCOUNT_FILE="/secure/service-account.json",
            GOOGLE_SHEET_ID="sheet-123",
            GOOGLE_SHEET_TAB="leads",
            GOOGLE_SHEET_CALCULATOR_TAB="calc-tab",
        )
    )

    assert isinstance(storage, GoogleSheetsLeadStorage)
    assert storage._sheet_tab == "calc-tab"
    assert storage._columns == CALCULATOR_COLUMN_ORDER


def test_unsupported_storage_value_raises_for_the_calculator_too():
    with pytest.raises(ValueError):
        create_calculator_storage(_config(LEADS_STORAGE="postgres"))
