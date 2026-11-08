# Contributing to the Gaby Kelly website

- Last updated: 2026-11-08 · Applies to: Sprint 004 (kit v1.2.0)
- Maintainer: Human project owner

How to set up, run, test and change this project, and where things live. It links to the specs and runbooks instead of repeating them. The workflow rules (branches, pull requests, review, who merges) are in [`AGENTS.md`](AGENTS.md); the document list is in [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md).

## What this project is

The bilingual (Spanish and English) website of Gaby Kelly, a financial-wellbeing mentor for corporate professionals: a static Astro site plus a small Python (Flask) backend that stores the leads from its forms in a Google Sheet. It has a home page, a free-resource library, a VIP mentorship application with call booking, a freedom-months calculator and more pages. Details are in [`docs/specs/PROJECT_SPEC.md`](docs/specs/PROJECT_SPEC.md); the stack and why are in [`TECH_STACK.md`](TECH_STACK.md) and [`docs/decisions/`](docs/decisions/).

## Values to have ready

Names only. Real values never go into Git, issues, pull requests or chat. The defaults in the example files work for local development, with no Google account.

| Value | Where to get it |
|---|---|
| Node.js 22.12 or newer (`node --version` prints `v22.x`) | [`TECH_STACK.md`](TECH_STACK.md), `engines` in [`package.json`](package.json) |
| Python 3.11 (`python3 --version`; the code stays compatible with 3.9 and newer) | [`TECH_STACK.md`](TECH_STACK.md), [`ADR-001`](docs/decisions/ADR-001_BACKEND_HOSTING.md) |
| Frontend variables, in `.env` (copied from [`.env.example`](.env.example)): `PUBLIC_LEAD_ENDPOINT`, `PUBLIC_CALCULATOR_ENDPOINT`, `PUBLIC_CALENDLY_URL`, `PUBLIC_CONTACT_EMAIL` | The defaults in the example file; meanings in [`LEAD_API_CONTRACT.md`](docs/specs/LEAD_API_CONTRACT.md) section 9 |
| Backend variables, in `api/.env` (copied from [`api/.env.example`](api/.env.example)): `LEADS_STORAGE`, `GOOGLE_SERVICE_ACCOUNT_FILE`, `GOOGLE_SHEET_ID`, `GOOGLE_SHEET_TAB`, `GOOGLE_SHEET_CALCULATOR_TAB`, `PRIVACY_NOTICE_VERSION`, `RATE_LIMIT_MAX_REQUESTS`, `RATE_LIMIT_WINDOW_SECONDS` | The defaults in the example file (`LEADS_STORAGE=memory` needs no Google account); the Google values only for real Sheets mode, from [`GOOGLE_SHEETS_SETUP.md`](docs/runbooks/GOOGLE_SHEETS_SETUP.md). The service-account key file stays outside the repository |
| Preview-build variables, set only when building the GitHub Pages preview: `PUBLIC_PREVIEW`, `SITE_BASE_PATH` | [`.github/workflows/preview.yml`](.github/workflows/preview.yml) and [`ADR-005`](docs/decisions/ADR-005_BRANCHING_AND_RELEASE_MODEL.md) |

## Set up

1. Clone the repository and open it.

   ```bash
   git clone https://github.com/Raulc87/gaby-main-page.git
   cd gaby-main-page
   ```

   Expected: a folder with `package.json`, `api/` and `docs/`.

2. Install the frontend dependencies.

   ```bash
   npm ci
   ```

   Expected: it finishes without errors. A warning about a newer Node patch version (`EBADENGINE`) is harmless.

3. Create the backend's virtual environment and install its dependencies.

   ```bash
   python3 -m venv api/.venv
   ```

   ```bash
   api/.venv/bin/pip install -r api/requirements.txt -r api/requirements-dev.txt
   ```

   Expected: the second command ends with `Successfully installed` and a list that includes `Flask`, `gspread` and `pytest`.

4. Create the local configuration from the example files.

   ```bash
   cp .env.example .env
   ```

   ```bash
   cp api/.env.example api/.env
   ```

   Expected: `.env` and `api/.env` exist. Both are ignored by Git. Do not commit them or paste their contents anywhere.

5. Install the browser for the end-to-end tests, once per machine.

   ```bash
   npx playwright install chromium
   ```

   Expected: it downloads Chromium, or says it is already installed. On Linux add `--with-deps` if system libraries are missing (needs `sudo`).

Windows (PowerShell): steps 1, 2 and 5 are the same. Where the Python command is `python3`, use `py -3.11`, and use `Copy-Item` and the virtual environment's `Scripts` folder:

```powershell
py -3.11 -m venv api/.venv
```

```powershell
api/.venv/Scripts/pip install -r api/requirements.txt -r api/requirements-dev.txt
```

```powershell
Copy-Item .env.example .env
Copy-Item api/.env.example api/.env
```

Windows tips (Git Bash alternative, execution policy, OneDrive locks) and macOS notes are in [`docs/runbooks/LOCAL_DEVELOPMENT.md`](docs/runbooks/LOCAL_DEVELOPMENT.md) section 9. That runbook has the detailed local steps for every operating system.

## Run locally

Two terminals, both from the repository root.

1. Start the backend (Flask, in memory mode).

   ```bash
   api/.venv/bin/python api/run_local.py
   ```

   Expected: it prints `Running on http://127.0.0.1:5000` and warns that leads are kept in memory only.

2. Start the frontend (Astro) in the second terminal.

   ```bash
   npm run dev
   ```

   Expected: it prints `http://localhost:4321/`. Open it: the site loads, the language toggle works, and the lead form on the VIP page ends in the thank-you message. The dev server sends `/api/*` to the backend on port 5000.

Windows (PowerShell): start the backend with `api/.venv/Scripts/python api/run_local.py`. The frontend command is the same.

To look at the GitHub Pages preview build locally (forms in demonstration mode, base path `/gaby-main-page/`):

```bash
PUBLIC_PREVIEW=true SITE_BASE_PATH=/gaby-main-page/ npm run build
```

Expected: the build finishes and `dist/` holds the preview. In PowerShell, set `$env:PUBLIC_PREVIEW = "true"` and `$env:SITE_BASE_PATH = "/gaby-main-page/"` on their own lines first, then run `npm run build`.

## Test and check

Run from the repository root. CI runs the same checks on every pull request ([`frontend.yml`](.github/workflows/frontend.yml), [`backend.yml`](.github/workflows/backend.yml), [`docs-link-check.yml`](.github/workflows/docs-link-check.yml); [`preview.yml`](.github/workflows/preview.yml) builds and publishes the preview on every push to `main`), and the required ones must be green before merge.

| What | Command | Expected |
|---|---|---|
| Unit tests (frontend, Vitest) | `npm run test` | Every test passes. They include the check that the translation files equal [`docs/ux/CONTENT.md`](docs/ux/CONTENT.md) |
| Unit tests (backend, pytest) | `api/.venv/bin/python -m pytest api` | Every test passes. Run it from the repository root, or `cd api && pytest` with the venv active |
| End-to-end tests (Playwright) | Start the backend as in "Run locally" with `LEADS_STORAGE=memory`, then `npm run test:e2e` | Every spec passes. It builds the site and serves it on port 4321 by itself, so stop `npm run dev` first |
| Lint | `npm run lint` | No output and exit code 0 |
| Format | Not applicable: the project has no formatter yet. ESLint settles style ([`TECH_STACK.md`](TECH_STACK.md)) | |
| Type check | `npm run check` | `0 errors` |
| Production build | `npm run build` | Finishes without errors |
| Docs link check | `python3 .github/scripts/check_doc_links.py` | `0 broken` |

Before every push, run lint, type check, unit tests, build, the end-to-end specs you touched, and the docs link check when you changed a document.

## Where things live

| Path | What it holds |
|---|---|
| `src/pages/` | Routes: `es/` and `en/` pages, and the root page that redirects to the visitor's language |
| `src/components/`, `src/layouts/` | Astro components by area (`home`, `layout`, `lead`, `resources`, `sections`, `story`, and the new calculator and method areas) and the base layout |
| `src/i18n/` | All visitor-facing text, per language (`es/`, `en/`), and the route map (`routes.ts`). The text comes from [`docs/ux/CONTENT.md`](docs/ux/CONTENT.md) and nowhere else |
| `src/lib/`, `src/data/` | Logic (lead form, links and base-path helpers) and typed data (the resource list) |
| `src/styles/` | Tailwind setup and the brand design tokens |
| `public/` | Static files: favicon, photos, logos, downloadable resources |
| `api/` | The Flask backend: `app.py` (application factory), `routes/` (the lead endpoints), `validation.py`, `rate_limit.py`, `storage/` (Google Sheets and memory), `tests/` (pytest), `passenger_wsgi.py` (cPanel entry point), `run_local.py` |
| `tests/unit/`, `tests/e2e/` | Vitest unit tests and Playwright end-to-end specs |
| `scripts/` | Helper used by the end-to-end suite |
| `.github/` | CI workflows, the docs link check script and the pull request template |
| `docs/specs/` | Specs, user stories and the lead API contract: the source of truth for behavior |
| `docs/ux/` | UX/UI direction and the copy ([`CONTENT.md`](docs/ux/CONTENT.md)) |
| `docs/decisions/` | ADRs: why the stack and structure are what they are |
| `docs/plans/`, `docs/sprints/` | The implementation plan and the sprint plans, with each agent's file ownership |
| `docs/runbooks/` | Local development, Google Sheets setup, deployment and release |
| `docs/security/` | The security baseline, when it exists ([`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md)) |

## How to make a change

1. Find or write the user story and its acceptance criteria ([`docs/specs/USER_STORIES.md`](docs/specs/USER_STORIES.md)). A behavior change starts in the spec, then the stories and the plan, then the code ([`AGENTS.md`](AGENTS.md) → Change management). The lead API contract ([`LEAD_API_CONTRACT.md`](docs/specs/LEAD_API_CONTRACT.md)) is shared by the frontend and the backend: propose changes to it, do not make them in code.
2. Branch, pull request title and commit names: [`AGENTS.md`](AGENTS.md) → Branch, PR, and commit naming (for example branch `GK-030-contributing`, title `[GK-030] ...`, commits `GK-030: ...`).
3. Edit only the files your workstream owns in the active sprint plan ([`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) names it); ask for changes in anyone else's files.
4. Write the tests from the acceptance criteria, then the code. Follow [`AGENTS.md`](AGENTS.md) → Code readability; ESLint settles style questions.
5. Project rules that are easy to miss:
   - Visitor-facing text comes verbatim, by key, in both languages, from [`docs/ux/CONTENT.md`](docs/ux/CONTENT.md). If a string is missing or wrong, the document changes first. Never invent copy, numbers, names, testimonials or files.
   - Brand: use the design tokens only, and only the color pairs of [`docs/ux/UX_UI_DIRECTION.md`](docs/ux/UX_UI_DIRECTION.md) section 2.2. At most one gold button in view at 360, 390, 768 and 1280 px.
   - Links and assets go through the route and base-path helpers in `src/lib/site/` and `src/i18n/routes.ts`, so the site works at `/` and under `/gaby-main-page/` (the preview).
   - Secrets, credentials and real personal data never go into Git, tests, logs or the browser.
6. Open a pull request with [`.github/pull_request_template.md`](.github/pull_request_template.md), including Ownership and the verification evidence. The review-only agent and the automated reviewer review it; only the human owner merges.
7. If the change alters setup, commands or structure, update this file in the same pull request.

## Troubleshooting

Local-development problems (backend not running, Google Sheets errors, a missing module, a missing scheduler) are in [`docs/runbooks/LOCAL_DEVELOPMENT.md`](docs/runbooks/LOCAL_DEVELOPMENT.md) section 8. The most common ones:

| Symptom | Likely cause | Fix |
|---|---|---|
| The form shows an error straight away | The backend is not running, or is not on `127.0.0.1:5000` | Start it as in "Run locally" and submit again |
| `npm run test:e2e` cannot start, or the port 4321 is busy | `npm run dev` is still running, or a browser is missing | Stop `npm run dev`; run `npx playwright install chromium` |
| `ModuleNotFoundError` when starting the backend | The virtual environment was not used or the dependencies are not installed | Use `api/.venv/bin/python` as in "Run locally", and repeat step 3 of "Set up" |
| A test says the translation files differ from `CONTENT.md` | A string was changed in code or in the document but not in both | Change [`docs/ux/CONTENT.md`](docs/ux/CONTENT.md) first, then the `src/i18n/` files to match it |
| `check_doc_links.py` reports a broken link | A moved file or a renamed heading | Fix the link; the script names the file and the link |
