"""Entry point for cPanel "Setup Python App" (Phusion Passenger). See ADR-001.

cPanel mounts this application at the /api URL path and strips that prefix
before dispatching, so the app itself only needs to know about /save-lead.
"""

from __future__ import annotations

from app import create_app

application = create_app(api_prefix="")
