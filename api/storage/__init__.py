from __future__ import annotations

from config import Config

from .base import LeadStorage, StorageError
from .google_sheets import GoogleSheetsLeadStorage
from .memory import MemoryLeadStorage


def create_storage(config: Config) -> LeadStorage:
    if config.LEADS_STORAGE == "memory":
        return MemoryLeadStorage()
    if config.LEADS_STORAGE == "google_sheets":
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
