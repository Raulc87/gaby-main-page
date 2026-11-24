"""Send again the contacts whose `crm_status` is `failed` or `pending` (contract section 12).

Run by hand through `resend_crm.py` (docs/runbooks/GOHIGHLEVEL.md). Resending
is safe: GoHighLevel matches the contact on its email.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Callable

from crm.contacts import Contact
from crm.sync import RESENDABLE_STATUSES, STATUS_FAILED, STATUS_SENT, CrmSync
from storage.base import LeadStorage, StorageError

logger = logging.getLogger(__name__)


@dataclass
class ResendResult:
    sent: int = 0
    failed: int = 0
    not_updated: int = 0  # sent, but the row's crm_status could not be written

    def __add__(self, other: ResendResult) -> ResendResult:
        return ResendResult(
            self.sent + other.sent,
            self.failed + other.failed,
            self.not_updated + other.not_updated,
        )


def resend_contacts(
    storage: LeadStorage, crm_sync: CrmSync, build_contact: Callable[[dict], Contact]
) -> ResendResult:
    """Resend every `failed` or `pending` row of one tab and update its `crm_status`.

    Raises StorageError when the rows cannot be read. Prints and logs counts
    only, never a name, email or phone.
    """
    result = ResendResult()
    for row_reference, row in storage.rows_with_crm_status(RESENDABLE_STATUSES):
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
