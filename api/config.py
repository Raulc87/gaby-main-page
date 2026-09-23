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
