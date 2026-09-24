# LOCAL_DEVELOPMENT — Gabriela Kelly Pilot

Run the frontend and backend together on your machine (US-012). Related:
`docs/specs/LEAD_API_CONTRACT.md` (section 9, configuration), `TECH_STACK.md`,
`docs/runbooks/GOOGLE_SHEETS_SETUP.md` (only needed for real Google Sheets mode).

## 1. Prerequisites

- Node.js 22 LTS (`node --version` should print `v22.x`; see `TECH_STACK.md` v0.3 and `package.json` `engines`)
- Python 3.11 (target runtime; the backend also runs on 3.9+, see ADR-001)
- `pip` and `venv` (bundled with Python)

## 2. Install dependencies

From the repository root:

```bash
# Frontend
npm ci

# Backend (in a virtual environment)
cd api
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt -r requirements-dev.txt
cd ..
```

## 3. Configure environment variables

Copy the example files and adjust as needed — never commit the real `.env` files (they are git-ignored):

```bash
cp .env.example .env
cp api/.env.example api/.env
```

- `.env` (repository root) configures the frontend. The defaults work as-is for local development.
- `api/.env` configures the backend. `api/run_local.py` loads it automatically (via `python-dotenv`, a dev-only dependency). Production (`api/passenger_wsgi.py`, cPanel) reads real environment variables instead and never touches a `.env` file.

Every variable is documented in `docs/specs/LEAD_API_CONTRACT.md` section 9.

## 4. Run both servers

Two terminals, both from the repository root.

**Terminal 1 — backend (Flask):**

```bash
cd api
source .venv/bin/activate
python run_local.py
```

Serves `http://127.0.0.1:5000/api/save-lead`. Uses `LEADS_STORAGE` from `api/.env` (default: `memory`, see section 5).

**Terminal 2 — frontend (Astro):**

```bash
npm run dev
```

Serves `http://localhost:4321`. The dev server proxies `/api/*` to `http://127.0.0.1:5000` (see `astro.config.mjs`), so the frontend always calls the same relative path (`PUBLIC_LEAD_ENDPOINT=/api/save-lead`) in every environment.

Open `http://localhost:4321/` and confirm the full flow: landing → language toggle → lead form → submit → thank-you → inline Calendly (or the `mailto:` fallback if `PUBLIC_CALENDLY_URL` is a placeholder).

## 5. Memory mode (no Google account needed)

Default. With `LEADS_STORAGE=memory` in `api/.env` (or unset — `memory` is the default), submitted leads are kept in the Flask process's memory only; nothing is written anywhere, and everything is lost when the server restarts. This is the mode used automatically by the backend test suite (`api/pytest.ini` fixtures) and by the CI backend/e2e jobs — no Google credentials are ever required to develop or test the flow end to end.

## 6. Real Google Sheets mode

1. Follow `docs/runbooks/GOOGLE_SHEETS_SETUP.md` to create the service account and share the sheet.
2. In `api/.env`, set:
   ```
   LEADS_STORAGE=google_sheets
   GOOGLE_SERVICE_ACCOUNT_FILE=/absolute/path/outside/webroot/service-account.json
   GOOGLE_SHEET_ID=<your sheet id>
   GOOGLE_SHEET_TAB=leads
   ```
   Keep the key file **outside** the repository (e.g. in your home directory), and never commit it — `.gitignore` already excludes any `*service-account*.json` file as a safety net, but do not rely on that alone.
3. Restart `python run_local.py`.
4. Submit the form once and confirm a new row appears in the sheet, in the column order from `LEAD_API_CONTRACT.md` section 6.

## 7. Running the checks locally

```bash
# Frontend
npm run lint      # ESLint
npm run check     # astro check (type checking)
npm run test      # Vitest unit tests
npm run build     # production build

# Backend (each command block below is self-contained: run it in its own
# subshell so `cd api` / the activated venv don't leak into the next block)
(cd api && source .venv/bin/activate && pytest)

# End-to-end (Playwright), backend in memory mode
(cd api && source .venv/bin/activate && LEADS_STORAGE=memory python run_local.py) &
npm run test:e2e
```

`npm run test:e2e` currently reports `Error: No tests found` — `tests/e2e/**` doesn't exist yet, it lands with Agent 2's `GK-004-integration-e2e` integration PR. That is expected until then, not a broken setup (see the `e2e` job comment in `.github/workflows/frontend.yml`).

These are the same checks GitHub Actions runs on every pull request and on pushes to `main` (`.github/workflows/backend.yml`, `.github/workflows/frontend.yml`).

## 8. Troubleshooting

| Symptom | Likely cause |
|---|---|
| Frontend shows a submission error immediately | Backend not running, or running on a different port than `127.0.0.1:5000` |
| `503`/`storage_unavailable` in Google Sheets mode | `GOOGLE_SERVICE_ACCOUNT_FILE` path wrong, key file unreadable, sheet not shared with the service account's email, or wrong `GOOGLE_SHEET_ID`/`GOOGLE_SHEET_TAB` — see `docs/runbooks/GOOGLE_SHEETS_SETUP.md` |
| `ModuleNotFoundError` running `run_local.py` | Virtual environment not activated, or dependencies not installed (`pip install -r requirements.txt -r requirements-dev.txt`); also check you're running `python run_local.py` from inside `api/`, not `python api/run_local.py` after already `cd`-ing into `api/` |
| `npm ci` reports an `EBADENGINE` warning | Some transitive devDependencies want a Node patch version slightly newer than the documented `22.12.0+` floor (e.g. `22.22.3+`). Harmless and doesn't block install; upgrade Node if you want it gone |
| Thank-you shows but the Calendly scheduler never appears (mailto fallback shows instead) | Expected if `PUBLIC_CALENDLY_URL` is still the `.env.example` placeholder, or if outbound network access to `assets.calendly.com` is blocked (e.g. a restrictive proxy/firewall) — this is the documented fallback behavior (US-007 AC5), not a bug |
