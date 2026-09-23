from __future__ import annotations

import re
from datetime import datetime, timezone

import pytest

from time_utils import format_costa_rica_timestamp


def test_format_costa_rica_timestamp_converts_utc_to_costa_rica_offset():
    # America/Costa_Rica is a fixed UTC-06:00 offset (no daylight saving).
    utc_moment = datetime(2026, 9, 23, 20, 5, 31, tzinfo=timezone.utc)

    assert format_costa_rica_timestamp(utc_moment) == "23/09/2026 14:05:31"


def test_format_costa_rica_timestamp_uses_dd_mm_yyyy_hh_mm_ss():
    utc_moment = datetime(2026, 1, 5, 12, 0, 0, tzinfo=timezone.utc)

    assert format_costa_rica_timestamp(utc_moment) == "05/01/2026 06:00:00"


def test_format_costa_rica_timestamp_defaults_to_now():
    result = format_costa_rica_timestamp()

    assert re.fullmatch(r"\d{2}/\d{2}/\d{4} \d{2}:\d{2}:\d{2}", result)


def test_format_costa_rica_timestamp_requires_timezone_aware_input():
    naive_moment = datetime(2026, 9, 23, 20, 5, 31)

    with pytest.raises(ValueError):
        format_costa_rica_timestamp(naive_moment)
