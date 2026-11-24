"""Send again the contacts whose `crm_status` is `failed` or `pending` (contract section 12).

Run by hand through `resend_crm.py` (docs/runbooks/GOHIGHLEVEL.md). Resending
is safe: GoHighLevel matches the contact on its email.

One rule keeps a resend from rolling a contact back: a person can submit again
after an earlier submission failed. Of all the rows of one email in a tab, only
the newest that GoHighLevel holds or still owes it counts (`sent`, `failed` or
`pending`; an `off` row never reached it). An older unsent row is superseded by
it and is not resent, so the contact is never overwritten with older values.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Callable

from crm.contacts import Contact
from crm.sync import RESENDABLE_STATUSES, STATUS_FAILED, STATUS_PENDING, STATUS_SENT, CrmSync
from storage.base import LeadStorage, StorageError

logger = logging.getLogger(__name__)

# Statuses of a row whose values are, or are about to be, in GoHighLevel.
CONTACT_STATUSES = frozenset({STATUS_SENT, STATUS_FAILED, STATUS_PENDING})


@dataclass
class ResendResult:
    sent: int = 0
    failed: int = 0
    not_updated: int = 0  # sent, but the row's crm_status could not be written
    superseded: int = 0  # not resent: a newer submission of the same email exists

    def __add__(self, other: ResendResult) -> ResendResult:
        return ResendResult(
            self.sent + other.sent,
            self.failed + other.failed,
            self.not_updated + other.not_updated,
            self.superseded + other.superseded,
        )


def _newest_row_by_email(rows: list[tuple[int | None, dict]]) -> dict[str, int]:
    """Position in `rows` (oldest first) of the newest row of each email that counts."""
    newest: dict[str, int] = {}
    for position, (_, row) in enumerate(rows):
        if row.get("crm_status") in CONTACT_STATUSES:
            newest[str(row.get("email", "")).strip().lower()] = position
    return newest


def resend_contacts(
    storage: LeadStorage, crm_sync: CrmSync, build_contact: Callable[[dict], Contact]
) -> ResendResult:
    """Resend every `failed` or `pending` row of one tab and update its `crm_status`.

    Raises StorageError when the rows cannot be read. Prints and logs counts
    only, never a name, email or phone.
    """
    result = ResendResult()
    rows = storage.saved_rows()
    newest = _newest_row_by_email(rows)
    for position, (row_reference, row) in enumerate(rows):
        if row.get("crm_status") not in RESENDABLE_STATUSES:
            continue
        if newest[str(row.get("email", "")).strip().lower()] != position:
            logger.info(
                "resend skipped: a newer submission exists (submitted_at=%s)",
                row.get("submitted_at"),
            )
            result.superseded += 1
            continue
        outcome = crm_sync.send(build_contact, row)
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
        if outcome == STATUS_SENT:
            result.sent += 1
        elif outcome == STATUS_FAILED:
            result.failed += 1
    return result
