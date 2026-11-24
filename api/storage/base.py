from __future__ import annotations

from typing import Collection, Protocol

# Where a saved row can be found again (a sheet row number, a list index).
# None means the adapter could not tell, so the row's crm_status stays as written.
RowReference = int | None


class StorageError(Exception):
    """Raised by a storage adapter when a lead cannot be persisted."""


class LeadStorage(Protocol):
    def save(self, lead: dict) -> RowReference:
        """Persist a lead row and return where it is. Must raise StorageError on failure."""
        ...

    def set_crm_status(self, reference: RowReference, crm_status: str) -> None:
        """Update the `crm_status` of a saved row (LEAD_API_CONTRACT.md section 12).

        Must raise StorageError on failure; does nothing when `reference` is None.
        """
        ...

    def rows_with_crm_status(
        self, crm_statuses: Collection[str]
    ) -> list[tuple[RowReference, dict]]:
        """The saved rows whose `crm_status` is one of `crm_statuses`, for the resend command."""
        ...
