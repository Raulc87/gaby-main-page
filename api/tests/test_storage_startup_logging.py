"""US-016 AC4/AC5: startup logging for the active storage.

Secret values (the sheet ID, the key file path) are never logged; the
sheet tab name is explicitly allowed by the contract and is checked here.
"""

from __future__ import annotations

import logging

from config import Config
from storage import create_storage


def _config(**overrides) -> Config:
    config = Config()
    for key, value in overrides.items():
        setattr(config, key, value)
    return config


def test_memory_storage_logs_info_and_warning(caplog):
    caplog.set_level(logging.INFO)

    create_storage(_config(LEADS_STORAGE="memory"))

    assert any(
        r.levelno == logging.INFO and "memory" in r.getMessage() for r in caplog.records
    )
    assert any(
        r.levelno == logging.WARNING and "memory" in r.getMessage().lower()
        for r in caplog.records
    )


def test_google_sheets_storage_logs_info_without_secret_values(caplog, tmp_path):
    caplog.set_level(logging.INFO)
    key_file = tmp_path / "service-account.json"
    key_file.write_text('{"fake": "key"}')

    create_storage(
        _config(
            LEADS_STORAGE="google_sheets",
            GOOGLE_SERVICE_ACCOUNT_FILE=str(key_file),
            GOOGLE_SHEET_ID="super-secret-sheet-id",
            GOOGLE_SHEET_TAB="leads",
        )
    )

    info_records = [r for r in caplog.records if r.levelno == logging.INFO]
    assert len(info_records) == 1
    message = info_records[0].getMessage()
    assert "google_sheets" in message
    assert "key_file_exists=True" in message
    assert "key_file_readable=True" in message
    assert "sheet_id_set=True" in message
    assert "leads" in message  # the sheet tab name may be logged
    assert "super-secret-sheet-id" not in message  # but not the sheet ID itself
    assert str(key_file) not in message  # nor the key file's path


def test_google_sheets_storage_logs_missing_key_file_and_unset_sheet_id(caplog):
    caplog.set_level(logging.INFO)

    create_storage(
        _config(
            LEADS_STORAGE="google_sheets",
            GOOGLE_SERVICE_ACCOUNT_FILE="/does/not/exist.json",
            GOOGLE_SHEET_ID=None,
            GOOGLE_SHEET_TAB="leads",
        )
    )

    info_records = [r for r in caplog.records if r.levelno == logging.INFO]
    assert len(info_records) == 1
    message = info_records[0].getMessage()
    assert "key_file_exists=False" in message
    assert "key_file_readable=False" in message
    assert "sheet_id_set=False" in message


def test_google_sheets_storage_does_not_log_a_warning(caplog):
    caplog.set_level(logging.INFO)

    create_storage(
        _config(
            LEADS_STORAGE="google_sheets",
            GOOGLE_SERVICE_ACCOUNT_FILE="/does/not/exist.json",
            GOOGLE_SHEET_ID="sheet-123",
            GOOGLE_SHEET_TAB="leads",
        )
    )

    assert not any(r.levelno == logging.WARNING for r in caplog.records)
