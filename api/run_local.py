"""Local development entry point.

Serves the app with the /api prefix so that
http://127.0.0.1:5000/api/save-lead works through the Astro dev proxy
(docs/runbooks/LOCAL_DEVELOPMENT.md).
"""

from __future__ import annotations

from app import create_app

app = create_app(api_prefix="/api")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
