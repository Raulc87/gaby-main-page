# ADR-001 — Python endpoint on GoDaddy cPanel, same origin

- Status: Accepted (runtime confirmation pending before US-014)
- Date: 2026-09-23
- Decision owner: Human project owner
- Related specs: `PROJECT_SPEC.md` (Constraints), `TECH_STACK.md`, `LEAD_API_CONTRACT.md`

## Decision Request
Where and how does the lead endpoint run, given that the static frontend is hosted on GoDaddy?

## Context
The frontend is a static Astro build hosted on GoDaddy cPanel. The endpoint must keep Google credentials server-side and be simple to operate.

GoDaddy's Linux cPanel hosting offers "Setup Python App" (CloudLinux Python Selector with Phusion Passenger) under *Software*, which creates a virtualenv per app and can mount it at a URL path of the domain. Available Python versions depend on the plan and server; community reports show Python 3.x versions up to 3.10/3.11 on GoDaddy. This could not be verified against GoDaddy's official pages from the planning environment, so it must be confirmed in the actual cPanel account.

## Decision Drivers
- Same hosting account as the frontend, no extra vendor
- Credentials server-side
- Minimal operations
- No CORS

## Options Considered

### Option A — Flask app via cPanel "Setup Python App", mounted at `/api` (selected)
Pros: same origin (no CORS), same account, matches approved stack.
Cons: depends on plan features and available Python version; shared-hosting limits.
Risks: Python version lower than 3.11 → mitigated by keeping code 3.9-compatible.

### Option B (fallback) — Same Flask app on Google Cloud Run
Pros: identical Python code, generous free tier, same Google project as the Sheets service account.
Cons: extra vendor account; cross-origin (needs CORS for the site domain); cold starts.

### Option C (fallback) — PHP endpoint on the same cPanel
Pros: PHP is always available on cPanel; same origin.
Cons: changes the approved backend language; rewrite of validation logic.

### Option D (fallback) — Google Apps Script web app bound to the Sheet
Pros: no server to operate, no key file.
Cons: JavaScript rewrite; cross-origin quirks (no preflight, text/plain workaround); weaker control over status codes (always 200), which breaks the contract.

## Decision
Option A. If the GoDaddy plan does not offer "Setup Python App", use Option B (same code, add CORS for the site origin, update the contract's endpoint URL).

## Rationale
Keeps one host and one origin and matches the approved stack. Option B is the fallback because it reuses all Python code and tests.

## Consequences
### Positive
- Relative endpoint `/api/save-lead`; no CORS configuration.
### Negative / Trade-offs
- Must confirm plan capabilities before deployment.

## Implementation Impact
- Flask app with a `passenger_wsgi.py` entry point; application route `/save-lead`; cPanel app URL `/api`.
- Code compatible with Python 3.9+; tested on 3.11 in CI.
- Local dev: Astro dev server proxies `/api` to Flask.

## Validation
Before US-014: in cPanel → Software → Setup Python App, confirm the feature exists and record the highest available Python version here.

## Review Trigger
Plan lacks Python support, or Passenger limits cause failures.
