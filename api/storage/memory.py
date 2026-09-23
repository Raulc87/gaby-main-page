"""In-memory lead storage for local development and automated tests."""

from __future__ import annotations


class MemoryLeadStorage:
    def __init__(self) -> None:
        self._leads: list[dict] = []

    def save(self, lead: dict) -> None:
        self._leads.append(dict(lead))

    @property
    def leads(self) -> list[dict]:
        return list(self._leads)
