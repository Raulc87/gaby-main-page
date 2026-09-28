"""Backend configuration, read from environment variables.

Variable names and purpose match docs/specs/LEAD_API_CONTRACT.md section 9.
"""

from __future__ import annotations

import os


class Config:
    def __init__(self) -> None:
        self.LEADS_STORAGE = os.environ.get("LEADS_STORAGE", "memory")
        self.PRIVACY_NOTICE_VERSION = os.environ.get("PRIVACY_NOTICE_VERSION", "")
        self.GOOGLE_SERVICE_ACCOUNT_FILE = os.environ.get("GOOGLE_SERVICE_ACCOUNT_FILE")
        self.GOOGLE_SHEET_ID = os.environ.get("GOOGLE_SHEET_ID")
        self.GOOGLE_SHEET_TAB = os.environ.get("GOOGLE_SHEET_TAB", "leads")

        # Only 0 means "disabled" (contract section 9); anything else
        # invalid fails startup loudly instead of silently weakening or
        # turning off NFR-008 spam protection.
        max_requests = int(os.environ.get("RATE_LIMIT_MAX_REQUESTS", "5"))
        if max_requests < 0:
            raise ValueError(
                "RATE_LIMIT_MAX_REQUESTS must be 0 (disabled) or a positive "
                f"integer, got {max_requests!r}."
            )
        self.RATE_LIMIT_MAX_REQUESTS = max_requests

        window_seconds = int(os.environ.get("RATE_LIMIT_WINDOW_SECONDS", "600"))
        if window_seconds <= 0:
            raise ValueError(
                f"RATE_LIMIT_WINDOW_SECONDS must be a positive integer, got {window_seconds!r}."
            )
        self.RATE_LIMIT_WINDOW_SECONDS = window_seconds
