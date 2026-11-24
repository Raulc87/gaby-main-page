"""The "send the contact, then record the outcome" step of contract section 12."""

from __future__ import annotations

import logging
from typing import Callable, Protocol

from config import Config
from crm.client import GoHighLevelClient
from crm.contacts import Contact
from crm.errors import CrmError

logger = logging.getLogger(__name__)

STATUS_PENDING = "pending"
STATUS_SENT = "sent"
STATUS_FAILED = "failed"
STATUS_OFF = "off"
STATUS_SUPERSEDED = "superseded"  # contract v1.3.1, section 12 (Resending)
RESENDABLE_STATUSES = frozenset({STATUS_FAILED, STATUS_PENDING})


class ContactClient(Protocol):
    def send_contact(self, contact: Contact) -> None:
        """Create or update the contact. Must raise CrmError on failure."""
        ...


class CrmSync:
    """Whether leads are sent to GoHighLevel, and the client that sends them."""

    def __init__(self, enabled: bool, client: ContactClient | None = None) -> None:
        self.enabled = enabled
        self._client = client

    @property
    def initial_status(self) -> str:
        """`crm_status` of a row when it is appended."""
        return STATUS_PENDING if self.enabled else STATUS_OFF

    def send(self, build_contact: Callable[[dict], Contact], row: dict) -> str:
        """Send the row's contact and return the outcome, `sent` or `failed`. Never raises.

        The log line carries the reason, GoHighLevel's status code and the row's
        `submitted_at` only: no name, email or phone, and never the token.
        """
        submitted_at = row.get("submitted_at")
        try:
            if self._client is None:
                raise CrmError("not_configured")
            self._client.send_contact(build_contact(row))
        except CrmError as exc:
            logger.error(
                "GoHighLevel contact not sent: %s (submitted_at=%s)",
                exc.describe(),
                submitted_at,
            )
            return STATUS_FAILED
        except Exception as exc:  # noqa: BLE001 - a CRM failure must never change the endpoint's response
            logger.error(
                "GoHighLevel contact not sent: unexpected %s (submitted_at=%s)",
                type(exc).__name__,
                submitted_at,
            )
            return STATUS_FAILED
        return STATUS_SENT


def create_crm_sync(config: Config) -> CrmSync:
    """Build the sync from configuration; logs a startup summary without values."""
    if not config.GHL_SYNC_ENABLED:
        logger.info("GoHighLevel sync: off")
        return CrmSync(enabled=False)

    configured = bool(config.GHL_API_TOKEN) and bool(config.GHL_LOCATION_ID)
    missing_fields = [name for name, field_id in config.GHL_FIELD_IDS.items() if not field_id]
    logger.info(
        "GoHighLevel sync: on (token_set=%s, location_id_set=%s, custom_field_ids_missing=%s)",
        bool(config.GHL_API_TOKEN),
        bool(config.GHL_LOCATION_ID),
        ",".join(missing_fields) or "none",
    )
    if not configured or missing_fields:
        logger.warning(
            "GoHighLevel sync is on but its configuration is incomplete: "
            "leads will be saved with crm_status 'failed'."
        )
    client = GoHighLevelClient(
        api_token=config.GHL_API_TOKEN,
        location_id=config.GHL_LOCATION_ID,
        field_ids=config.GHL_FIELD_IDS,
        timeout_seconds=config.GHL_TIMEOUT_SECONDS,
    )
    return CrmSync(enabled=True, client=client)
