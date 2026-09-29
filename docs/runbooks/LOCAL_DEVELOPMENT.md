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
npx playwright install --with-deps chromium webkit   # once per machine, or after a Playwright upgrade
(cd api && source .venv/bin/activate && LEADS_STORAGE=memory python run_local.py) &
npm run test:e2e
```

These are the same checks GitHub Actions runs on every pull request and on pushes to `main` (`.github/workflows/backend.yml`, `.github/workflows/frontend.yml`).

## 8. Troubleshooting

| Symptom | Likely cause |
|---|---|
| Frontend shows a submission error immediately | Backend not running, or running on a different port than `127.0.0.1:5000` |
| `503`/`storage_unavailable` in Google Sheets mode | `GOOGLE_SERVICE_ACCOUNT_FILE` path wrong, key file unreadable, sheet not shared with the service account's email, or wrong `GOOGLE_SHEET_ID`/`GOOGLE_SHEET_TAB` — see `docs/runbooks/GOOGLE_SHEETS_SETUP.md` |
| `ModuleNotFoundError` running `run_local.py` | Virtual environment not activated, or dependencies not installed (`pip install -r requirements.txt -r requirements-dev.txt`); also check you're running `python run_local.py` from inside `api/`, not `python api/run_local.py` after already `cd`-ing into `api/` |
| `npm ci` reports an `EBADENGINE` warning | Some transitive devDependencies want a Node patch version slightly newer than the documented `22.12.0+` floor (e.g. `22.22.3+`). Harmless and doesn't block install; upgrade Node if you want it gone |
| Thank-you shows but the Calendly scheduler never appears (mailto fallback shows instead) | Expected if `PUBLIC_CALENDLY_URL` is still the `.env.example` placeholder, or if outbound network access to `assets.calendly.com` is blocked (e.g. a restrictive proxy/firewall) — this is the documented fallback behavior (US-007 AC5), not a bug |

## 9. Platform-specific setup notes

### Windows

- **Installing Python:** `winget install Python.Python.3.11` (from PowerShell or Command Prompt) installs Python 3.11 and adds it to `PATH` for new terminals. Confirm with `python --version` in a fresh terminal; if it still resolves to a different version (or the Microsoft Store stub), check `py --list` and use the `py -3.11` launcher, or reorder `PATH`.
- **PowerShell execution policy blocking npm:** `npm` and `npx` on Windows run through generated `.ps1` shims. If PowerShell's default execution policy is `Restricted`, commands like `npm run dev` or `npx playwright install` fail with a message about running scripts being disabled. Fix for the current user only (doesn't need admin rights): `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. Using `cmd.exe` instead of PowerShell avoids the issue entirely, since it doesn't apply an execution policy.
- **OneDrive file locks:** if the repository is cloned inside a folder OneDrive syncs (the default `Documents` or `Desktop` on a managed/work PC), OneDrive can hold a lock on a file it's mid-upload, causing intermittent `EPERM`/`EBUSY` errors during `npm ci`, Python venv creation, or `npx playwright install` (browser binaries are large and slow to sync). Symptoms include installs that fail once and succeed on retry. Preferred fix: clone the repository outside any OneDrive-synced folder (e.g. `C:\dev\gaby-main-page`). If that isn't possible, right-click the repository folder in Explorer and choose "Always keep on this device" to stop on-demand eviction, or pause OneDrive syncing while running installs.

### macOS

- **Homebrew `node@22` and `python@3.11`, and getting them on `PATH`:** `brew install node@22 python@3.11`. Homebrew installs versioned formulas *unlinked* by default (so installing `node@22` doesn't silently override another Node version you have), so `node`/`python3` may still not resolve to them in a fresh terminal. Add both to `PATH` in your shell profile (`~/.zshrc` on modern macOS):
  ```bash
  export PATH="$(brew --prefix node@22)/bin:$(brew --prefix python@3.11)/bin:$PATH"
  ```
  Open a new terminal (or `source ~/.zshrc`) and confirm with `node --version` / `python3 --version`.
- **Homebrew permission errors:** `brew install` failing with "Permission denied" on `/opt/homebrew` (Apple Silicon) or `/usr/local` (Intel) usually means an earlier install ran under `sudo` or the directory ownership drifted, often on a shared/managed Mac. Fix: `sudo chown -R $(whoami) $(brew --prefix)/*` (see Homebrew's own `brew doctor` output for the exact paths it flags) rather than running `brew install` itself with `sudo`, which makes the problem worse.
- **`uv` as an alternative to `venv`/`pip`:** if Homebrew is locked down (e.g. no write access, per above) or you'd rather not fight it for Python, [`uv`](https://docs.astral.sh/uv/) installs standalone via `curl -LsSf https://astral.sh/uv/install.sh | sh` and needs no Homebrew or system Python at all. Replace section 2's backend install with:
  ```bash
  cd api
  uv venv --python 3.11
  source .venv/bin/activate
  uv pip install -r requirements.txt -r requirements-dev.txt
  cd ..
  ```
  Everything else in this runbook (`run_local.py`, `pytest`, etc.) works the same once that virtual environment is activated.
- **AirPlay Receiver occupying port 5000:** on macOS Monterey (12) and later, System Settings → General → AirDrop & Handoff → AirPlay Receiver is on by default and listens on port 5000 (and 7000). Since `run_local.py` and the Astro dev proxy both hardcode `127.0.0.1:5000` for the backend (see `astro.config.mjs`), starting the Flask server either fails with "Address already in use" or — more confusingly — appears to start, but requests are answered by AirPlay's own HTTP stub instead of Flask. Fix: turn AirPlay Receiver off in System Settings. Changing the backend's port instead would require updating `astro.config.mjs`'s dev-server proxy target too (owned by Agent 1 — ask before editing it) and does not match the deployed setup, so it isn't recommended.
- **iCloud-synced folders:** the same class of problem as OneDrive on Windows — if the repository lives under a folder synced by iCloud Drive (Desktop and Documents sync is a common default on personal Macs), "Optimize Mac Storage" can evict files to iCloud-only and lazily re-download them on access, which shows up as slow or flaky `npm ci` / `pip install` runs and occasionally a corrupted `node_modules`. Clone the repository outside `~/Desktop` and `~/Documents` (e.g. `~/dev/gaby-main-page`), or disable "Desktop & Documents Folders" syncing in iCloud Drive settings if you keep it there.
