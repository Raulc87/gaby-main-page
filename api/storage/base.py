from __future__ import annotations

from typing import Protocol


class StorageError(Exception):
    """Raised by a storage adapter when a lead cannot be persisted."""


class LeadStorage(Protocol):
    def save(self, lead: dict) -> None:
        """Persist a lead row. Must raise StorageError on failure."""
        ...
