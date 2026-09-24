"""Local development entry point.

Serves the app with the /api prefix so that
http://127.0.0.1:5000/api/save-lead works through the Astro dev proxy
(docs/runbooks/LOCAL_DEVELOPMENT.md).

Loads api/.env if present (python-dotenv, dev-only dependency) so
LEADS_STORAGE and the Google Sheets variables can be set once instead of
exported in every shell. Production (passenger_wsgi.py) reads real
environment variables from cPanel and never touches a .env file.
"""

from __future__ import annotations

from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

from app import create_app  # noqa: E402 - .env must load before Config() reads it

app = create_app(api_prefix="/api")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
