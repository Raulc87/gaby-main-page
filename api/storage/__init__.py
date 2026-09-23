from __future__ import annotations

from .base import LeadStorage, StorageError
from .memory import MemoryLeadStorage


def create_storage(name: str) -> LeadStorage:
    if name == "memory":
        return MemoryLeadStorage()
    raise ValueError(f"Unsupported LEADS_STORAGE value: {name!r}")


__all__ = ["LeadStorage", "StorageError", "MemoryLeadStorage", "create_storage"]
