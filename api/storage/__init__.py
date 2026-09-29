from __future__ import annotations

import logging
import os

from config import Config

from .base import LeadStorage, StorageError
from .google_sheets import GoogleSheetsLeadStorage
from .memory import MemoryLeadStorage

logger = logging.getLogger(__name__)


def create_storage(config: Config) -> LeadStorage:
    """Build the configured storage adapter.

    Logs an INFO summary of the active storage at startup (US-016 AC4);
    for `google_sheets`, whether the key file exists and is readable and
    whether the sheet ID is set, never the values themselves. `memory`
    additionally logs a WARNING (US-016 AC5): it must be set explicitly
    and is for local development and automated tests only.
    """
    if config.LEADS_STORAGE == "memory":
        logger.info("Lead storage active: memory")
        logger.warning(
            "Lead storage is 'memory': leads are NOT persisted. This is "
            "expected only for local development and automated tests; "
            "production must set LEADS_STORAGE=google_sheets."
        )
        return MemoryLeadStorage()

    if config.LEADS_STORAGE == "google_sheets":
        key_file = config.GOOGLE_SERVICE_ACCOUNT_FILE
        key_file_exists = bool(key_file) and os.path.isfile(key_file)
        key_file_readable = key_file_exists and os.access(key_file, os.R_OK)
        logger.info(
            "Lead storage active: google_sheets (key_file_exists=%s, "
            "key_file_readable=%s, sheet_id_set=%s, sheet_tab=%r)",
            key_file_exists,
            key_file_readable,
            bool(config.GOOGLE_SHEET_ID),
            config.GOOGLE_SHEET_TAB,
        )
        return GoogleSheetsLeadStorage(
            service_account_file=config.GOOGLE_SERVICE_ACCOUNT_FILE,
            sheet_id=config.GOOGLE_SHEET_ID,
            sheet_tab=config.GOOGLE_SHEET_TAB,
        )

    raise ValueError(f"Unsupported LEADS_STORAGE value: {config.LEADS_STORAGE!r}")


__all__ = [
    "LeadStorage",
    "StorageError",
    "MemoryLeadStorage",
    "GoogleSheetsLeadStorage",
    "create_storage",
]
