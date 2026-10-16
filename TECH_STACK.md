# TECH_STACK — Gabriela Kelly Pilot

## Metadata
- Version: 0.4
- Status: Approved for Sprint 001; v0.4 proposed for Sprint 003 (phase 2)
- Complexity: Simple
- Last updated: 2026-10-16 (v0.4: phase 2 — GitHub Pages preview, ADR-005; production host undecided; multipage routes, ADR-003 update; fonts Playfair Display and Manrope, `UX_UI_DIRECTION.md` v1.0). v0.3 (2026-09-23: Node floor raised from 20 LTS to 22 LTS, section 4 — see GK-010-frontend-scaffold PR #4)

## 1. Complexity Assessment

This is a content-heavy one-page site with:
- two language versions (Spanish / English)
- lead form
- one lightweight backend endpoint
- Google Sheets persistence
- Calendly inline embed

A heavy application framework or relational database is not justified.

## 2. Hosting and Environment Constraints

- Production hosting: **not decided** (phase 2, `PROJECT_SPEC.md` §11). GoDaddy cPanel (below, ADR-001) stays the working assumption until the domain and its hosting are known.
- Preview: GitHub Pages, static files only, under `/gaby-main-page/`, published on every push to `main` (ADR-005). No backend, no secrets; forms run in demonstration mode.
- Hosting provider (working assumption): GoDaddy
- Expected environment: cPanel (Linux shared hosting)
- Frontend: static files in the site's document root
- Backend: Python app via cPanel "Setup Python App" (Phusion Passenger), mounted at `/api` on the same domain (ADR-001)
- Cloud migration target: None required
- AWS: Not required
- Sprint 001 target: local prototype only; production deployment is US-014
- Runtime availability on the exact GoDaddy plan must be confirmed before US-014 (ADR-001 lists the fallback)

## 3. Selection Principle

Use the least-complex stack that satisfies the requirements and works reliably in the target hosting environment.

## 4. Frontend

### Selected
- Astro (static output) with built-in i18n routing (`/es/`, `/en/`)
- TypeScript
- Tailwind CSS
- Node.js 22 LTS for development and CI (raised from 20 LTS in v0.3: the
  Node-20-compatible majors of Astro/Vitest/`eslint-plugin-astro` carry
  unpatched critical advisories — XSS, SSRF, RCE via AVIF image
  optimization; the human owner approved the Node 22 floor over shipping
  those, 2026-09-23)

### Why
- Excellent fit for a mostly static one-page site
- Low runtime complexity; deploys as plain files on cPanel
- Fast delivery
- Easy responsive styling
- Keeps JavaScript payload small
- Built-in i18n routing avoids a runtime translation library (ADR-003)

### Not selected for current scope
- React SPA
- Next.js
- Angular
- Runtime i18n libraries

Reason: unnecessary complexity for the current requirements.

## 5. Backend

### Selected
- Python 3.11 (target). Code must stay compatible with Python 3.9+ so it can run on whichever 3.x version the cPanel Python selector offers (ADR-001).
- Flask (WSGI), served by Passenger on cPanel through a `passenger_wsgi.py` entry point
- `gspread` + `google-auth` for Google Sheets access with a service account (ADR-002)

### Responsibility
- implement `POST /api/save-lead` exactly as defined in `docs/specs/LEAD_API_CONTRACT.md`
- validate server-side input
- write lead to Google Sheets
- return success/failure response
- never expose Google credentials client-side

## 6. Persistence

### Selected
Google Sheets, one worksheet (`leads`).

Columns (exact order, `snake_case`):
- `submitted_at`
- `name`
- `email`
- `phone`
- `screening_answer`
- `language`
- `consent`
- `privacy_notice_version`
- `status` (`started` on creation; manual values: `contacted`, `booked`, `not_interested_yet`, `dropped`)

A `memory` storage adapter exists for local development and tests.

No SQL database for the pilot.

## 7. Scheduling

Calendly inline embed (official embed script), shown only after a successful save, with name and email pre-filled. Fallback: `mailto:` link to the contact email.

## 8. Testing

- Vitest for frontend logic (validation, language detection, API client)
- Playwright for the critical browser flow (both languages, mobile and desktop viewports)
- pytest for the endpoint: validation, status codes, storage adapter, storage failure

## 9. Code Quality

- ESLint (with the Astro and TypeScript plugins) for frontend code
- `astro check` for type checking
- Identifiers, codes, and data fields in English, `snake_case` for data/API fields (BR-007)

## 10. CI/CD

GitHub Actions, on every pull request and on pushes to `main`:
- Frontend job: install, ESLint, `astro check`, Vitest, build
- Backend job: install, pytest
- End-to-end job: Playwright against the built frontend and the backend in `memory` mode

CI never uses real Google credentials.

Preview workflow (`.github/workflows/preview.yml`, US-027, ADR-005): on push to `main`, build with `PUBLIC_PREVIEW=true` and the Pages base path, publish with the official GitHub Pages actions.

Production deployment (US-014) waits on the hosting decision; on GoDaddy it may be manual or scripted depending on cPanel capabilities.

## 11. Local Development

Documented in `docs/runbooks/LOCAL_DEVELOPMENT.md` (US-012):
- Astro dev server proxies `/api/*` to the local Flask server (`http://127.0.0.1:5000`)
- `LEADS_STORAGE=memory` by default; Google Sheets mode with a local service-account key file
- `.env.example` files document all variables

## 12. Security and Secrets

- Google credentials must remain server-side, outside the web root.
- Do not commit secrets to Git (`.env` and key files are git-ignored).
- Use hosting environment variables or protected configuration.
- Validate and sanitize incoming form data; write sheet values as raw text.
- Spam protection (honeypot + rate limit) before public deployment (US-013).

## 13. Scaling Path

Re-evaluate the stack if future requirements introduce:
- authenticated users
- payments
- course delivery
- large-scale CRM needs
- complex workflows
- significant reporting
- high write volume
- multi-tenant behavior
