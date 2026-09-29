"""Shared log-formatting helper (US-016 AC2/AC3).

Used by both the route's own StorageError/generic-exception handling
(`routes/lead.py`) and the app-level catch-all (`errors.py`), so a bug
raised anywhere in the app is logged the same safe way.
"""

from __future__ import annotations

import traceback


def format_traceback_without_message(exc: BaseException) -> str:
    """The traceback's stack frames and the exception's class, but never
    its message: the message could otherwise repeat submitted data or the
    client's IP (e.g. a bug that raises ValueError(lead["email"]), or a
    rate-limit lookup that raises KeyError(remote_addr)).
    """
    frames = "".join(traceback.format_tb(exc.__traceback__))
    return f"Traceback (most recent call last):\n{frames}{type(exc).__name__}"
