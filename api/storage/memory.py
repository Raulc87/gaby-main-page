"""In-memory lead storage for local development and automated tests."""

from __future__ import annotations

from typing import Collection

from .base import RowReference


class MemoryLeadStorage:
    def __init__(self) -> None:
        self._leads: list[dict] = []

    def save(self, lead: dict) -> RowReference:
        self._leads.append(dict(lead))
        return len(self._leads) - 1

    def set_crm_status(self, reference: RowReference, crm_status: str) -> None:
        if reference is not None:
            self._leads[reference]["crm_status"] = crm_status

    def rows_with_crm_status(
        self, crm_statuses: Collection[str]
    ) -> list[tuple[RowReference, dict]]:
        return [
            (index, dict(lead))
            for index, lead in enumerate(self._leads)
            if lead.get("crm_status") in crm_statuses
        ]

    @property
    def leads(self) -> list[dict]:
        return list(self._leads)
