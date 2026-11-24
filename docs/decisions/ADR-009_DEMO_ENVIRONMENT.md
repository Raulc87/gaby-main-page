# ADR-009 — A password-protected demo environment for Gaby's functional test

- Status: **Accepted** by the human owner by merging #104 (2026-11-24)
- Date: 2026-11-24
- Decision owner: Human project owner
- Related: [ADR-001](ADR-001_BACKEND_HOSTING.md) (Python endpoint on cPanel, same origin), [ADR-005](ADR-005_BRANCHING_AND_RELEASE_MODEL.md) (preview and release), [ADR-006](ADR-006_SCHEDULER_GOHIGHLEVEL.md) (calendar), [ADR-008](ADR-008_GOHIGHLEVEL_CONTACTS.md) (contacts); [`DEPLOYMENT.md`](../runbooks/DEPLOYMENT.md), [`GOHIGHLEVEL.md`](../runbooks/GOHIGHLEVEL.md), [`GOOGLE_SHEETS_SETUP.md`](../runbooks/GOOGLE_SHEETS_SETUP.md); [`SPRINT_005.md`](../sprints/SPRINT_005.md) close-out ("Testing with Gaby")

## Decision Request
Where does Gaby test the site **functionally** (a calculator lead or a Wealth Mastery application reaching the sheet and her GoHighLevel, and a real booking in her calendar) before she decides to switch gabykelly.com from her GoHighLevel funnel to this site?

## Context
- The GitHub Pages preview (ADR-005) is static and, by design, stores and sends nothing (FR-030) and shows a stand-in instead of the calendar. It shows look and feel, not the funnel.
- Production (US-014) waits on two decisions: the hosting, and Gaby's go-ahead to point gabykelly.com at the site, which she gives **only after seeing it work** (human owner, 2026-11-24). A test site on her domain would need her DNS and her permission before she has seen anything.
- The human owner has a cPanel hosting account with *Setup Python App* (confirmed 2026-11-24) for the domain `digitalstrike-solutions.com`, which serves the owner's own site. ADR-001's design (static site plus a Flask app mounted at `/api` on the same origin) and `DEPLOYMENT.md` already target cPanel, subdomains included.

## Decision Drivers
- Gaby tests the real funnel: the same build and backend as production, her real calendar and her real GoHighLevel account.
- Nothing changes on gabykelly.com or on the owner's own site.
- Only invited people reach it; search engines never index it.
- Test data only, and easy to clean up.
- The production deploy is rehearsed on the way.

## Options Considered

### Option A — A subdomain of the owner's domain on the owner's cPanel: `gabydemo.digitalstrike-solutions.com` (selected)
Pros: no change to gabykelly.com and no need for Gaby's DNS; the owner controls it today; same stack as ADR-001, so `DEPLOYMENT.md` applies almost as is; cPanel's free SSL covers the subdomain.
Cons: the address carries the owner's company name, which is fine for a private test; the test data sits in the owner's hosting account.

### Option B — `staging.gabykelly.com` on the same cPanel
Pros: Gaby's own domain.
Cons: needs a DNS record on her domain, so her permission and access before she has seen the site, which is the decision this test exists to inform. Kept as a possible permanent staging copy after go-live.

### Option C — A managed app host (Render, Fly.io or similar)
Pros: deploys from GitHub.
Cons: a different stack from the one production is planned on (ADR-001); a new provider handling personal data; free tiers sleep, which makes for a poor demo.

### Option D — The owner's machine through a tunnel
Rejected: works only while that machine is on; not suitable for Gaby's review.

## Decision
Option A. A **demo environment** at `https://gabydemo.digitalstrike-solutions.com/`, on the owner's cPanel account:

1. **Separate from the owner's site.** A cPanel subdomain with its own document root (for example `gabydemo/`, not `public_html/`), and the Python app (*Setup Python App*) in its own application root outside any document root, mounted at `/api` on the subdomain only (ADR-001).
2. **The production build, not a preview.** The site is built with `PUBLIC_PREVIEW` unset (the forms store and send for real) and with `PUBLIC_SCHEDULER_URL` set to Gaby's calendar (ADR-006). The base path is `/`.
3. **Private.** The whole subdomain is password-protected (HTTP basic authentication), **including `/api`**, as `DEPLOYMENT.md` §3 describes and checks. The same deploy-time `.htaccess` sends `X-Robots-Tag: noindex, nofollow`, and forces HTTPS. The password reaches Gaby outside the repository.
4. **Test data only.**
   - Leads go to a **test Google Sheet** owned by the owner, never the production sheet (ADR-002, `GOOGLE_SHEETS_SETUP.md`).
   - Testers use their own or test email addresses, never a client's.
   - GoHighLevel sync is on (`GHL_SYNC=on`) with Gaby's token, so contacts reach her real account (ADR-008). Each test contact is deleted after the test round, and each test booking cancelled, as the demo runbook lists.
   - If Gaby's email workflows are already active, a test lead triggers her real emails to the test address. That is intended: it tests them too.
5. **Secrets.** The GoHighLevel token (contacts access only) and the Google service-account key live only in the Python app's environment and in a file outside the document root (`DEPLOYMENT.md` §6). Never in Git, a PR, chat or the build. Gaby gives the token to the owner directly.
6. **Deploys** are by hand from a commit of `main` that is green and already on the preview, following a demo section of `DEPLOYMENT.md`; the commit deployed is recorded.
7. **Lifetime.** The demo lives until Gaby decides. After go-live it is deleted, or kept as a staging copy (then possibly moved to Option B), by an update to this ADR.

## Rationale
It is the only option that lets Gaby test the real thing without first giving the permission the test is meant to earn, and it reuses the production design and runbook, so the go-live becomes the same deploy on a different domain.

## Consequences
- The owner's hosting account holds test personal data during the test; the security baseline records the demo environment (its third parties: the owner's host, Google, GoHighLevel) and that it carries test data only.
- The privacy notice stays the draft: the demo is private and carries test data. Before any real visitor, US-018 (legal review) and US-014 apply as before.
- A second place where the site runs: a deploy can lag behind `main`; the demo shows which commit it runs (recorded at each deploy).
- The penetration test (PTES, `PENTEST_PLAN.md`) still runs before the first production release; the demo is not that release.

## Implementation Impact
A story, US-047 (`USER_STORIES.md`):
- `DEPLOYMENT.md` gains a demo section, covering the subdomain, the build values, the password and `noindex` file, the test sheet and `GHL_SYNC=on`.
- A smoke check, with expected answers with and without the password.
- A cleanup list.
- A short Spanish test checklist for Gaby.
- A manually started workflow that builds the demo's static files and packages `api/` as a downloadable artifact.
The owner deploys and runs the checks; agents never log into the owner's cPanel or Gaby's GoHighLevel.

## Validation
On the demo, with the password, in both languages:
- a calculator lead and an application each appear in the test sheet and as a contact in Gaby's GoHighLevel with their tags and fields (contract §12), with `crm_status` = `sent`;
- a qualified application shows Gaby's calendar prefilled, and one test booking appears in her calendar, then is cancelled (ADR-006 → Validation);
- without the password, every page and `/api` answer `401`;
- no page is indexed (`X-Robots-Tag` present).

## Review Trigger
Gaby decides (go-live or not); the hosting for production differs from cPanel; the demo must accept real visitors.
