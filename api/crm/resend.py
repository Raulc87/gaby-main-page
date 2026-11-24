"""Send again the contacts whose `crm_status` is `failed` or `pending` (contract section 12).

Run by hand through `resend_crm.py` (docs/runbooks/GOHIGHLEVEL.md). Resending
is safe: GoHighLevel matches the contact on its email.

Contract v1.3.1: a person can submit again after an earlier submission failed,
and GoHighLevel matches contacts on the email, so resending the older row would
overwrite the newer submission's values. The command therefore works one tab at
a time, oldest row first, and does not resend a `failed` or `pending` row when a
later row in the same tab has the same email (compared after the section 3
normalization: trimmed, lowercase). It sets that row's `crm_status` to
`superseded` instead, and never resends a `superseded` row. The later row is sent
on its own, at its save or by this command if it is itself `failed` or `pending`.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Callable

from crm.contacts import Contact
from crm.sync import (
    RESENDABLE_STATUSES,
    STATUS_FAILED,
    STATUS_SENT,
    STATUS_SUPERSEDED,
    CrmSync,
)
from storage.base import LeadStorage, StorageError

logger = logging.getLogger(__name__)


@dataclass
class ResendResult:
    sent: int = 0
    failed: int = 0
    not_updated: int = 0  # the row's crm_status could not be written (it stays resendable)
    superseded: int = 0  # marked `superseded` and not sent: a later row has the same email

    def __add__(self, other: ResendResult) -> ResendResult:
        return ResendResult(
            self.sent + other.sent,
            self.failed + other.failed,
            self.not_updated + other.not_updated,
            self.superseded + other.superseded,
        )


def _normalized_email(row: dict) -> str:
    return str(row.get("email", "")).strip().lower()


def _last_position_by_email(rows: list[tuple[int | None, dict]]) -> dict[str, int]:
    """Position in `rows` (oldest first) of the latest row of each email, whatever its status."""
    last: dict[str, int] = {}
    for position, (_, row) in enumerate(rows):
        email = _normalized_email(row)
        if email:
            last[email] = position
    return last


def resend_contacts(
    storage: LeadStorage, crm_sync: CrmSync, build_contact: Callable[[dict], Contact]
) -> ResendResult:
    """Resend every `failed` or `pending` row of one tab, oldest first, and update its `crm_status`.

    A row with a later row of the same email is marked `superseded` instead of sent.
    Raises StorageError when the rows cannot be read. Logs counts and `submitted_at`
    only, never a name, email or phone.
    """
    result = ResendResult()
    rows = storage.saved_rows()
    last_position = _last_position_by_email(rows)
    for position, (row_reference, row) in enumerate(rows):
        if row.get("crm_status") not in RESENDABLE_STATUSES:
            continue
        is_superseded = last_position.get(_normalized_email(row), position) != position
        outcome = STATUS_SUPERSEDED if is_superseded else crm_sync.send(build_contact, row)
        try:
            storage.set_crm_status(row_reference, outcome)
        except StorageError:
            logger.error(
                "crm_status not updated to %s: storage_unavailable (submitted_at=%s)",
                outcome,
                row.get("submitted_at"),
            )
            result.not_updated += 1
            continue
        if outcome == STATUS_SUPERSEDED:
            result.superseded += 1
        elif outcome == STATUS_SENT:
            result.sent += 1
        elif outcome == STATUS_FAILED:
            result.failed += 1
    return result
