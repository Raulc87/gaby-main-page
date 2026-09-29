"""Entry point for cPanel "Setup Python App" (Phusion Passenger). See ADR-001.

cPanel mounts this application at the /api URL path and strips that prefix
before dispatching, so the app itself only needs to know about /save-lead.

Defaults LEADS_STORAGE to google_sheets (LEAD_API_CONTRACT.md section 9:
"default in production") before Config() reads it, so a setting missed on
cPanel cannot silently leave leads in memory (US-016 AC5). Local
development (run_local.py) and automated tests set LEADS_STORAGE=memory
explicitly instead; that path still logs a WARNING at startup.
"""

from __future__ import annotations

import os

os.environ.setdefault("LEADS_STORAGE", "google_sheets")

from app import create_app  # noqa: E402 - LEADS_STORAGE must be set before Config() reads it

application = create_app(api_prefix="")
