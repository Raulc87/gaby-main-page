"""Costa Rica timestamp formatting per LEAD_API_CONTRACT.md section 5."""

from __future__ import annotations

from datetime import datetime
from zoneinfo import ZoneInfo

COSTA_RICA_TZ = ZoneInfo("America/Costa_Rica")
TIMESTAMP_FORMAT = "%d/%m/%Y %H:%M:%S"


def format_costa_rica_timestamp(moment: datetime | None = None) -> str:
    """Format `moment` (default: now) as `DD/MM/YYYY HH:mm:ss` in America/Costa_Rica."""
    if moment is None:
        moment = datetime.now(tz=COSTA_RICA_TZ)
    if moment.tzinfo is None:
        raise ValueError("moment must be timezone-aware")
    return moment.astimezone(COSTA_RICA_TZ).strftime(TIMESTAMP_FORMAT)
