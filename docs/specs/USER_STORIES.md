# USER_STORIES

Backlog source until Jira is available.

Common references:
- Spec: `docs/specs/PROJECT_SPEC.md`
- Lead API contract: `docs/specs/LEAD_API_CONTRACT.md`
- Copy (ES/EN): `docs/ux/CONTENT.md` (phase 2, the only copy source); phase 1 copy was `UX_UI_DIRECTION.md` v0.8 §4 (history, commit `09d6ca6`)
- Phase 2 source: Gaby's visual brief (2026-10-15), recorded in `PROJECT_SPEC.md` v0.5

"Common mobile widths" in any acceptance criterion means viewports of 360 px, 390 px, and 768 px wide. "Both languages" means the Spanish (`/es/...`) and English (`/en/...`) versions of a page.

**Phase 2 (2026-10-15).** US-019 to US-027 turn the one-page site into a multipage site with the official brand (`PROJECT_SPEC.md` v0.5). Where they conflict with an earlier story's acceptance criteria (one page, CTA scrolling to the form, Proposal A look, Calendly for every answer), the phase 2 story wins; each affected story says so in its status.

---

## US-001 — Communicate the value proposition
- Priority: High
- Story Points: 3
- Status: Ready; phase 2: the Home hero is redefined by US-021 (concept, VIP button to the VIP page, link to the resources)
- Related Requirements: FR-001, BR-005, FR-012

**User Story**

As a visitor,
I want to understand quickly what financial problem the program addresses,
so that I can decide whether the page is relevant to me.

**Acceptance Criteria**
1. The first visible section communicates that good income does not automatically create financial order.
2. The section includes a clear headline, supporting text, and a CTA that scrolls to the lead form.
3. The content is readable at common mobile widths without zooming.
4. The language is gender-neutral in both languages (copy from `UX_UI_DIRECTION.md`).

---

## US-002 — Understand the transformation approach
- Priority: High
- Story Points: 3
- Status: Ready; phase 2: the recognition section and the roadmap become the Home sections of US-021 (corporate ladder, opportunity, Método Polaris)
- Related Requirements: FR-002, FR-004

**User Story**

As a visitor,
I want to understand the proposed path toward better financial health,
so that I can visualize a practical way forward.

**Acceptance Criteria**
1. The recognition (problem framing) section and a simple 3-step conceptual roadmap are visible.
2. The roadmap uses the approved proposed copy, which avoids financial jargon.
3. The tone is hopeful rather than fear-based (copy from `UX_UI_DIRECTION.md`).
4. The roadmap stacks vertically at common mobile widths.

---

## US-003 — Understand Gabriela's role as guide
- Priority: High
- Story Points: 2
- Status: Ready; phase 2: superseded by US-022 (My story page) and the testimonials section of US-021
- Related Requirements: FR-003, FR-005

**User Story**

As a visitor,
I want to understand who Gabriela is and how she can guide the process,
so that I can decide whether I trust the next step.

**Acceptance Criteria**
1. Gabriela is presented as the guide, not the hero of the story.
2. A space exists for photo, biography, and credentials, and a proof section exists with placeholder structure (testimonial cards, credibility statements).
3. Provisional content is marked with a visible "pending validation" indicator in the prototype (see US-009), and no testimonial or quantified outcome is invented.

---

## US-004 — Submit lead information
- Priority: Critical
- Story Points: 5
- Status: Ready
- Related Requirements: FR-006, FR-007, NFR-005, NFR-006

**User Story**

As a visitor,
I want to submit my contact information,
so that I can continue toward a conversation about the program.

**Acceptance Criteria**
1. The form contains full name, email, phone, the pre-screening question, and the privacy consent checkbox.
2. All fields are required and enforced on the client and on the server.
3. Full name: the field shows a hint asking for first name and last name; input with fewer than two words, disallowed characters, or outside 3–100 characters is rejected, per `LEAD_API_CONTRACT.md` section 3.
4. Email is validated with the contract's format rule.
5. Phone must be in international format `+<country code><number>` (e.g. `+50684104791`); spaces, hyphens, parentheses, and periods are removed before validation; the field shows an example.
6. Validation errors are shown next to the relevant field, in the selected language.
7. The submit button is disabled while a submission is in progress.
8. Success is only shown after the endpoint returns `201`; on any other result the form keeps the entered data and shows a clear error with the option to retry.
9. Given a visitor types markup into any field (for example `<img src=x onerror=alert(1)>` as the name), when the page shows that value again or passes it on (an error message, the scheduler's prefilled URL), then it is inserted as text or URL-encoded, never as HTML, and a unit test shows it for each place the form's values are reused (ASVS `v5.0.0-1.2.1`, `v5.0.0-1.2.2`, `v5.0.0-3.2.2`; added by US-029).

---

## US-005 — Complete pre-screening
- Priority: Critical
- Story Points: 3
- Status: Ready
- Related Requirements: FR-008, BR-002, BR-005

**User Story**

As the business owner,
I want a simple indication of the lead's willingness and approximate capacity to invest,
so that calls can be better prioritized.

**Acceptance Criteria**
1. The question is required, single-choice, with exactly the four options in `LEAD_API_CONTRACT.md` section 4.
2. The language is respectful, non-invasive, and gender-neutral in both languages.
3. The selected option is sent as its English code (`ready_to_invest`, `needs_investment_info`, `no_capacity_now`, `exploring`) and stored with the lead, regardless of the display language.

---

## US-006 — Store lead in Google Sheets
- Priority: Critical
- Story Points: 5
- Status: Ready
- Related Requirements: FR-009, FR-016, NFR-006, NFR-007

**User Story**

As the business owner,
I want submitted leads stored in a simple shared repository,
so that I can review and follow up without a complex CRM.

**Acceptance Criteria**
1. `POST /api/save-lead` behaves as defined in `LEAD_API_CONTRACT.md` (request, validation, status codes, response body).
2. A valid submission appends one row with the columns, order, and formats in contract section 6, including `submitted_at` as `DD/MM/YYYY HH:mm:ss` in `America/Costa_Rica` and `status` = `started`.
3. If the Google Sheets write fails, the endpoint returns `503` and the user is not shown success.
4. Credentials are read from server-side configuration only; nothing secret is in client code or in Git.
5. Values are stored as literal text (no formula interpretation).
6. The endpoint can run with `LEADS_STORAGE=memory` for local development and tests.

---

## US-007 — Schedule through Calendly
- Priority: Critical
- Story Points: 3
- Status: Ready; phase 2: AC1 applies only to the qualified screening answers (US-023 AC4); the other answers get the not-ready screen (US-023 AC5). Phase 2c: the scheduler becomes Gaby's GoHighLevel calendar (ADR-006, US-037); where these criteria say Calendly, read the booking calendar
- Related Requirements: FR-010, FR-014, FR-015, BR-001

**User Story**

As a qualified visitor,
I want to schedule a call after submitting my information,
so that I can continue the process immediately.

**Acceptance Criteria**
1. After a `201` response, the form is replaced by the thank-you message ("we may reach out by email or WhatsApp") and the Calendly scheduler embedded inline below it.
2. Calendly is not loaded or shown before a successful save.
3. The visitor's name and email are pre-filled in Calendly.
4. The inline scheduler is usable at common mobile widths.
5. If the Calendly URL is not configured, the embed script fails to load, or the scheduler does not appear within 10 seconds, a message with a `mailto:` link to the configured contact email is shown instead.

---

## US-008 — Mobile-friendly experience
- Priority: High
- Story Points: 5
- Status: Ready; phase 2: applies to every page; US-020 adds the mobile navigation
- Related Requirements: FR-011, NFR-001

**User Story**

As a mobile visitor,
I want the page and form to be easy to use on my phone,
so that I can complete the flow without friction.

**Acceptance Criteria**
1. No horizontal scrolling is required at common mobile widths.
2. Form fields and the consent checkbox are usable at common mobile widths; touch targets are at least 44×44 px.
3. Content hierarchy remains clear.
4. The 3-step roadmap stacks on narrow screens.
5. The language toggle remains usable on mobile: in phase 2 it sits in the menu panel below 1024 px (`UX_UI_DIRECTION.md` §4.1, US-020).

---

## US-009 — Stakeholder content review
- Priority: High
- Story Points: 3
- Status: Done 2026-10-15 — Gaby reviewed the prototype and proposals A and B and answered with her visual brief (phase 2). Carried over from Sprint 001 into Sprint 002 as part of US-017.
- Related Requirements: BR-004

**User Story**

As Gabriela,
I want to review a coherent semi-functional prototype,
so that I can refine the proposed copy, imagery, proof, and positioning without starting from a blank page.

**Acceptance Criteria**
1. Every major section contains meaningful proposed content in both languages.
2. Areas requiring final stakeholder input are identifiable (visible "pending validation" markers in the prototype).
3. The prototype runs locally and is representative enough to discuss content and design.

---

## US-010 — Bilingual page (Spanish / English)
- Priority: Critical
- Story Points: 5
- Status: Ready; phase 2: applies to every page; the toggle switches to the same page in the other language (US-020 AC4)
- Related Requirements: FR-012, BR-005, BR-007
- Related ADR: ADR-003

**User Story**

As a visitor,
I want the page in my language, with the option to switch,
so that I can understand the offer comfortably.

**Acceptance Criteria**
1. Spanish content is served at `/es/` and English content at `/en/`, each with the correct `<html lang>`.
2. On `/`, a visitor with no saved choice is sent to `/es/` when the browser's first preferred language starts with `es` (e.g. `es`, `es-CR`, `es-MX`), and to `/en/` otherwise.
3. A language toggle (`ES | EN`) is available at all widths and switches to the same section in the other language. In phase 2 it is in the header from 1024 px and in the menu panel below that (`UX_UI_DIRECTION.md` §4.1, US-020).
4. The choice made with the toggle is remembered on the device and overrides browser detection on later visits.
5. Every visitor-facing string (content, form labels, hints, errors, success message, consent, privacy notice, Calendly fallback) exists in both languages; no string is hard-coded outside the translation files.
6. Without JavaScript, `/` shows links to both language versions.

---

## US-011 — Privacy consent (Costa Rica)
- Priority: Critical
- Story Points: 3
- Status: Ready
- Related Requirements: FR-013, BR-006

**User Story**

As the business owner,
I want visitors to give informed consent before their data is stored,
so that lead collection follows Costa Rica's data protection law (Ley N.° 8968).

**Acceptance Criteria**
1. The form has an unchecked-by-default consent checkbox with the text from `UX_UI_DIRECTION.md`, linking to the privacy notice.
2. The privacy notice is viewable from the page without leaving it and without losing form data, in both languages.
3. The form cannot be submitted without consent (client), and the endpoint rejects `consent` other than `true` with `422` / `consent_required` (server).
4. The stored row records `consent` and `privacy_notice_version`.
5. The privacy notice is visibly marked as a draft pending legal review in the prototype.

---

## US-012 — Local prototype environment and CI
- Priority: Critical
- Story Points: 3
- Status: Ready
- Related Requirements: NFR-004, NFR-007

**User Story**

As the project owner,
I want to run the full prototype on my machine and have GitHub check every PR,
so that I can demo it to Gabriela and trust that merges do not break it.

**Acceptance Criteria**
1. `docs/runbooks/LOCAL_DEVELOPMENT.md` explains how to install and run frontend and backend together, with `LEADS_STORAGE=memory` (no Google account needed) and with real Google Sheets credentials.
2. With both running locally, the full flow works: landing → form → save → thank-you → Calendly (or fallback).
3. `.env.example` files list every configuration variable from the contract, with no real values.
4. GitHub Actions run on every pull request and on pushes to `main`: frontend lint (ESLint), type check, unit tests (Vitest), build; backend tests (pytest); and the end-to-end test (Playwright) against the backend in `memory` mode.
5. CI never requires real Google credentials.

---

## US-013 — Spam protection for the lead endpoint
- Priority: High
- Story Points: 3
- Status: Done — Sprint 002 (#30, #31; reopened 2026-09-30 after browser autofill filled the honeypot, fixed in #47 and #46). AC1 manual check confirmed by the human owner on 2026-10-02 with the same browser setup as the incident, using real data in the development sheet: autofill fills the visible fields, the honeypot stays empty, and the lead is stored.
- Related Requirements: NFR-008
- Related Spec: `LEAD_API_CONTRACT.md` v1.1 sections 3.1, 3.2, 7, 9
- Related ADR: ADR-004

**User Story**

As the business owner,
I want the public form protected against automated submissions,
so that the lead sheet stays clean and the endpoint cannot be abused.

**Acceptance Criteria**
1. The honeypot input follows `UX_UI_DIRECTION.md` section 4, Section 7 (v0.8): in its own `<form>` outside the lead form, a DOM `id`/`name` with no autofill meaning, `autocomplete="off"` plus the password-manager opt-out attributes, off-screen, `tabindex="-1"`, `aria-hidden` wrapper, no label. Its value is always sent as `website`. Verified with Playwright in Chromium (desktop and 390 px): the input is not inside `#lead-form-form`; not visible; not reachable with Tab; empty after load and after filling the visible fields; and a simulated autofill of the lead form (filling every field the lead form contains) leaves it empty. The value still reaches the server: Playwright fills the honeypot input directly, submits the lead form, and asserts the outgoing request body carries that value as `website` (e.g. with `page.waitForRequest`); Vitest covers the controller reading the input from outside the lead form. Autofill keeps working for visitors: the name, email and phone inputs keep `autocomplete="name"`, `"email"` and `"tel"` inside the lead form, and nothing disables autofill on them. Manually verified by the human owner with their own browser's autofill: the visible fields are filled, the honeypot stays empty, and the lead lands in the sheet.
2. A request with a filled `website` returns the normal `201` success response and stores nothing (contract section 3.1).
3. Requests are rate-limited per IP as in contract section 3.2; excess requests receive `429` / `rate_limited` with a `Retry-After` header, and nothing is stored.
4. On `429` the form keeps the entered data and shows the localized "too many attempts" message from `UX_UI_DIRECTION.md` (both languages); no success and no Calendly.
5. The honeypot value is never logged or stored. IP addresses exist only in the limiter's in-memory state and are dropped when their requests leave the window (contract section 3.2); they are never logged or written anywhere.
6. `.env.example` files document `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_SECONDS`; CI and e2e run with the limit disabled or high enough not to interfere.
7. Done already in planning: CAPTCHA evaluated in ADR-004 (not needed for now); contract updated to v1.1.
8. Each honeypot decoy writes one INFO log line (e.g. "honeypot triggered; lead discarded") with no request data, IP, or field value, so false positives can be spotted in production. pytest covers it, including that no submitted value appears in the log.
9. Given a request rejected by the rate limit (`429`) or by field validation (`422`), when it is handled, then one log line records the event with the endpoint and the failing field names only, never the IP address, a value or the request body, and pytest shows the line and that no submitted value appears in it (ASVS `v5.0.0-16.3.3`; added by US-029).

---

## US-014 — Deploy to GoDaddy cPanel
- Priority: High
- Story Points: 3
- Status: On hold (backlog) since the Sprint 002 close-out, 2026-10-16. Per criterion:
  - AC1 runbook: done (#44).
  - AC2 Python version in cPanel: actionable now (human owner checks "Setup Python App" and records the version in ADR-001).
  - AC3 HTTPS: waits on the domain and SSL.
  - AC4 production sheet: waits on Gabriela's Google account, sheet and service account.
  - AC5 smoke test: waits on AC3 and AC4.
  - AC6 go-live: waits on AC5, US-018 done, US-017 content approved, and the go-live gate in `SPRINT_002.md`.
  - Kit v1.2.0 sync (2026-10-25): AC6 go-live also waits on the PTES penetration test that US-029 AC5 plans, with no open critical or high finding.
- Phase 2 (2026-10-15): **on hold** until Gaby's production domain and its hosting capabilities are known (human owner). The runbook (AC1) stays; AC2–AC6 wait. The GitHub Pages preview (US-027) is not this story
- Related ADR: ADR-001, ADR-002

**User Story**

As the business owner,
I want the site published on my GoDaddy hosting,
so that real visitors can use it.

**Acceptance Criteria**
1. `docs/runbooks/DEPLOYMENT.md` explains, step by step for the human owner: building the static site with production `PUBLIC_*` values; uploading it to the site root; creating the Python app in cPanel "Setup Python App" mounted at `/api`; installing `api/requirements.txt`; setting every backend variable from contract section 9; placing the service-account key outside the web root; restarting the app; updating an existing deployment; and rolling back to the previous version.
2. The Python version used in the account is confirmed and recorded in ADR-001.
3. The site is served only over HTTPS on the final domain (HTTP redirects to HTTPS).
4. Production uses the Google Sheet and service account in Gabriela's Google account (set up by the human owner at deploy time); development and CI keep using the owner's development sheet or memory mode.
5. A post-deploy smoke test in the runbook passes on the live site: both languages load, a test lead lands in the production sheet with the right columns, the thank-you and the real Calendly appear, a filled honeypot stores nothing, and the test row is then deleted.
6. Until the go-live gate in `SPRINT_002.md` passes, the whole site, including `/api`, is password-protected (cPanel Directory Privacy), so it cannot collect real leads under a draft notice; the runbook checks that `/` and `POST /api/save-lead` return `401` without credentials. Going live means removing the protection, only after US-013, US-016, and US-018 are done, the US-017 content is approved, and the PTES penetration test planned in US-029 AC5 has run with no open critical or high finding (this criterion is the gate until [`docs/runbooks/RELEASE.md`](../runbooks/RELEASE.md) gets its release sections; whoever writes them copies this gate into them, per ADR-005).
7. Given the live site over HTTPS (AC3), when the post-deploy smoke test requests `/` and `/api/save-lead` and reads the response headers, then every response carries `Strict-Transport-Security` with a `max-age` of at least one year (`v5.0.0-3.4.1`), a `Content-Security-Policy` that allows only the site's own origin and the third parties listed in `docs/security/SECURITY_BASELINE.md` section 6, including `frame-ancestors` (`v5.0.0-3.4.3`, `v5.0.0-3.4.6`), `X-Content-Type-Options: nosniff` (`v5.0.0-3.4.4`) and a `Referrer-Policy` (`v5.0.0-3.4.5`), and a lead can still be submitted and the scheduler still loads with the policy on. The runbook gives the exact configuration and where it lives; if the host cannot set a header, the owner records the exception in the baseline (section 7) before go-live. The GitHub Pages preview is out of scope (it cannot set headers, stores nothing and is not indexed). Added by US-029.
8. Given the live site, when the post-deploy smoke test checks the production configuration, then: an HTTP request to `/` redirects to HTTPS while an HTTP request to `/api/*` is refused, not redirected (`v5.0.0-4.1.2`); only TLS 1.2 and 1.3 are accepted and the certificate is publicly trusted (`v5.0.0-12.1.1`, `v5.0.0-12.2.1`, `v5.0.0-12.2.2`); no `.git` folder, directory listing, debug mode, TRACE method, documentation or monitoring endpoint is reachable (`v5.0.0-13.4.1` to `v5.0.0-13.4.5`); the service-account key and the application log are outside the web root and readable only by the account (`v5.0.0-13.3.2`, `v5.0.0-16.4.2`); and the rate limit still works behind the host's web server, because the client address it sees is the visitor's, not a proxy's (`v5.0.0-15.3.4`). The runbook lists each check and its command. Added by US-029.

---

## US-015 — Apply the approved visual identity
- Priority: High
- Story Points: 5
- Status: Done — Sprint 002 (#29, #32, #34, #36, #42, #43); phase 2: the Proposal A look is replaced by the official brand (US-019); AC4: since #61 the provisional portrait is shown larger than half its source size, accepted by the owner on 2026-10-17 until a better photo replaces it in a small PR (`SPRINT_003.md` → Close-out)
- Related Requirements: NFR-001, NFR-003, BR-004, BR-008
- Related Spec: `docs/ux/UX_UI_DIRECTION.md` section 2.1 (Proposal A)

**User Story**

As Gabriela,
I want the page to look like my brand,
so that visitors see a serious, trustworthy professional before they leave their data.

**Acceptance Criteria**
1. The color tokens in UX_UI_DIRECTION.md section 2.1 replace the provisional palette in `src/styles/global.css`; no component uses a hex color literal.
2. Crimson Pro and IBM Plex Sans are loaded from Google Fonts with fallback stacks; Inter is removed.
3. Every section matches the component descriptions in section 2.1 in both languages, at 360, 390, 768 and 1280 px, with no horizontal scroll.
4. Gabriela's photo is shown as a round portrait in the hero and guide sections, from an optimized image in `public/` (at least 2× the displayed size), with Spanish and English `alt` text.
5. The logo file (SVG, or PNG with transparency) replaces the typographic wordmark when provided; until then the Playfair Display wordmark is used.
6. Text meets WCAG AA contrast; form control boundaries reach 3:1 (`field-line`); gold is never used as text on white (use `gold-ink`).
7. Existing unit and e2e tests stay green; e2e selectors are not broken by the restyle.

8. The hero trust row from `UX_UI_DIRECTION.md` section 4, Section 1 is shown in both languages.

**Dependencies**
- Photo file: the provisional photo (the one used in the Proposal A mockup) is supplied by the human owner at the start of the sprint; the final photo and logo file come through US-017.

---

## US-016 — Diagnose storage failures in production
- Priority: High
- Story Points: 2
- Status: Done — Sprint 002 (AC1–AC6 in #40, AC7 in #44)
- Related Requirements: NFR-006, NFR-007
- Related Spec: `LEAD_API_CONTRACT.md` sections 7 and 9

**User Story**

As the project owner,
I want the server to record why a lead could not be saved,
so that I can fix a production problem quickly instead of losing leads silently.

**Acceptance Criteria**
1. Every `503` / `storage_unavailable` writes one ERROR log line to the server log (stderr, which Passenger writes to the app log in cPanel) with the underlying cause: exception class, and for Google API errors the HTTP status (e.g. `PermissionError`, `APIError 403`, `SpreadsheetNotFound`, `FileNotFoundError`).
2. Every `500` / `internal_error` writes an ERROR log line with the exception class and traceback.
3. Log lines never contain submitted data, the request body, the IP address, the service-account key or its contents.
4. At startup the app logs, at INFO, which storage is active and, for `google_sheets`, whether the key file exists and is readable, and whether the sheet ID and tab are set (values of secrets are never printed; the sheet tab name may be).
5. The production entry point (`api/passenger_wsgi.py`) uses `google_sheets` when `LEADS_STORAGE` is unset, as contract section 9 states, so a missing setting cannot silently keep leads in memory; `memory` must be set explicitly and logs a WARNING at startup.
6. pytest covers each log case above, including a check that a submitted name, email and phone never appear in the captured logs.
7. `docs/runbooks/DEPLOYMENT.md` (US-014) says where to find the log in cPanel and lists the common causes per logged error.
8. Given any log line the application writes, when it is read, then its timestamp carries an explicit UTC offset or is in UTC (today's format has no offset), and pytest shows the format (ASVS `v5.0.0-16.2.2`; added by US-029).

---

## US-017 — Final content from Gabriela
- Priority: High
- Story Points: 3
- Status: Backlog since the Sprint 002 close-out (2026-10-16). Proof cards merged (#33); the remaining content arrives later (see the phase 2 note). Phase 2c adds (Gaby's review, 2026-11-08): the "desired state" photo for the Home hero, real testimonials with photos and a concrete result (her priority before launch), the number of people mentored, the Wealth Mastery module list, the new VSL, her calculator, the ebook and the six email texts
- Phase 2 (2026-10-15): the copy now comes from Gaby's brief and is applied by US-021 to US-024. This story keeps what arrives later: session photos, authorized testimonials (text and video), bio and credentials, media logos once authorized, and the final names of the resources and the Método Polaris steps
- Related Requirements: FR-003, FR-005, BR-003, BR-004, BR-005, BR-008
- Related Spec: `docs/ux/UX_UI_DIRECTION.md` sections 4, 5, 6

**User Story**

As Gabriela,
I want the page to show my approved words, photo, bio and credentials,
so that visitors meet the real me before they leave their data.

**Acceptance Criteria**
1. Gabriela reviews the running prototype (this completes US-009); her approved copy for every section, in Spanish and English, is recorded in `UX_UI_DIRECTION.md` first (spec before code) and then applied. Copy still follows BR-003, BR-005 and BR-008.
2. Final photo (at least 800×800 px, with Gabriela's consent for web use), short bio, credentials and approach replace the placeholders in the guide section, and their pending-validation markers are removed.
3. The proof section supports two card types, text testimonials and video testimonials, and shows the approved placeholders until real, approved testimonials are supplied. Placeholders stay for now (human owner, 2026-09-28).
4. Video testimonials, when supplied, load nothing from a third party until the visitor presses play (a poster image with a play button), have captions or a text summary in the page language, and do not cause horizontal scroll at 360 px. Where videos are hosted (self-hosted file or YouTube/Vimeo) is decided with the human owner before they are added; a third-party host is added to the privacy notice (US-018).
5. The open brand questions in `UX_UI_DIRECTION.md` section 8 (cash imagery, employer audience) are answered and recorded.
6. Every remaining pending-validation marker is listed in the PR; before go-live the human owner decides per marker whether it ships or the flag is turned off.
7. Existing unit and e2e tests stay green.

**Dependencies**
- Content from Gabriela (copy review, photo, bio, credentials, logo file), collected by the human owner by 2026-10-02.

---

## US-018 — Final privacy notice
- Priority: High
- Story Points: 2
- Status: Backlog since the Sprint 002 close-out (2026-10-16), waiting on the legal text; must be done before any public launch; phase 2: the notice also gets its own page, linked from the footer (FR-017); the consent links keep opening it in a dialog (AC5)
- Related Requirements: FR-013, BR-006
- Related Spec: `docs/ux/UX_UI_DIRECTION.md` section 4, Privacy Notice

**User Story**

As the business owner,
I want a final, reviewed privacy notice,
so that the public form complies with Costa Rica's Ley N.° 8968.

**Acceptance Criteria**
1. The reviewed notice text (Spanish and English), including the confirmed responsible party, contact email and the data-retention period, is recorded in `UX_UI_DIRECTION.md` first and then applied.
2. The DRAFT marker is removed from the notice in both languages.
3. `PRIVACY_NOTICE_VERSION` gets a new, non-draft identifier (e.g. `2026-10-v1`) in `api/.env.example`, the deployment runbook, and the notice itself, so stored rows record which version was accepted.
4. The processors list matches what the site really uses at go-live (Google, Calendly, and any video host added by US-017).
5. The notice still opens in a dialog without losing form data, in both languages; existing tests stay green.

**Dependencies**
- Reviewed text and retention period, provided by the human owner by 2026-10-02.

---

## US-019 — Official brand skin
- Priority: Critical
- Story Points: 5
- Status: Done — Sprint 003 (#53)
- Related Requirements: FR-019, NFR-003, BR-005, BR-010
- Related Spec: `UX_UI_DIRECTION.md` (brand section, phase 2)

**User Story**

As Gaby,
I want the site in my official brand,
so that visitors see the same Gaby Kelly they know from my other channels.

**Acceptance Criteria**
1. The six brand colors (Azul Patrimonio `#3C5F8D`, Marfil `#F5F1EA`, Arena `#D8C5B1`, Oro Suave `#D6B04D`, Terracota `#C98368`, Carbón `#2B2B2B`) are design tokens and replace the Proposal A tokens; no component uses a hex color literal.
2. Playfair Display (headings H1–H2, editorial phrases, italic emphasis) and Manrope (body, buttons, forms, navigation, labels; body 17–18 px on desktop) replace Crimson Pro and IBM Plex Sans, with fallback stacks.
3. The large yellow circles are replaced by the polar-star line motif with thin arcs in Oro Suave or Arena, as `UX_UI_DIRECTION.md` describes.
4. Buttons: a gold VIP style (Carbón text on Oro Suave) for in-page VIP calls to action, at most one visible per viewport (BR-010); an outlined style for the header VIP link; a blue style (Azul Patrimonio) for free actions; text links in Azul Patrimonio.
5. Text meets WCAG AA contrast with the pairs allowed in `UX_UI_DIRECTION.md`. Never used for text on Marfil: Oro Suave (1.83:1), Terracota (2.69:1), Arena (1.49:1). Terracota and Arena are never backgrounds for small text unless the pair is listed as allowed.
6. Existing unit and e2e tests stay green, adjusted only where they assert the old look.
7. Form control boundaries reach 3:1 against their background (WCAG 1.4.11, as US-015 AC6); `UX_UI_DIRECTION.md` names the border token (Arena on Marfil, 1.49:1, does not qualify).

**Dependencies**
- `UX_UI_DIRECTION.md` v1.0 (brand section) merged.

---

## US-020 — Multipage site and navigation
- Priority: Critical
- Story Points: 5
- Status: Done — Sprint 003 (#54, privacy page #59)
- Related Requirements: FR-017, FR-018, FR-020, FR-012, FR-011
- Related ADR: ADR-003 (updated for multiple pages)

**User Story**

As a visitor,
I want to move between the site's pages easily, in my language,
so that I can find the story, the resources or the VIP path without getting lost.

**Acceptance Criteria**
1. The phase 2a pages of FR-017 (`UX_UI_DIRECTION.md` §3, rows with Phase 2a: Home, My story, Free resources, VIP mentorship, Privacy notice) exist in both languages at their paths. The Blog (US-026) and Método Polaris (US-028) pages are phase 2b: not built and not linked in this story.
2. The header shows the brand name, the navigation, the language toggle and the outlined VIP link on every page; the current page is indicated in the navigation.
3. At common mobile widths the navigation collapses into a menu button that opens and closes with mouse, touch and keyboard (Escape closes it, focus is managed); the VIP link stays visible.
4. The language toggle switches to the same page (and section) in the other language and remembers the choice (ADR-003).
5. The footer on every page shows the brand name, the concept line, the legal disclaimer (FR-028), the privacy notice link (to the privacy notice page), and the Ley 8968 note; no Terms link until a Terms page exists.
6. `/` keeps the language detection of ADR-003 and sends the visitor to the Home in their language.
7. Every page has a unique `<title>` and meta description in its language.

**Dependencies**
- `UX_UI_DIRECTION.md` v1.0 (site map with paths, header, footer) and ADR-003 update merged; footer copy in `CONTENT.md`.

---

## US-021 — Home for corporate professionals
- Priority: Critical
- Story Points: 8
- Status: Done — Sprint 003 (#61). Its section order and copy are replaced by the StoryBrand Home (US-034, phase 2c)
- Related Requirements: FR-001, FR-002, FR-004, FR-005, FR-021, FR-022, BR-003, BR-005, BR-009, BR-011
- Related Spec: `CONTENT.md` (Home), `UX_UI_DIRECTION.md` (Home layout)

**User Story**

As a corporate professional,
I want the Home to describe my situation and show me a way forward,
so that I decide whether to start free or apply to work with Gaby.

**Acceptance Criteria**
1. Sections, in order, with the copy from `CONTENT.md`: hero (concept eyebrow, headline, supporting text, VIP button, "start free with the resources" link, trust line); the corporate ladder; the opportunity (six benefit cards); the Método Polaris (three steps); free-resources teaser (three cards, link to the library); My story teaser (media names, link to My story); testimonials; VIP band (link to the VIP page).
2. The hero's VIP button and the VIP band are gold; no viewport shows two gold buttons (the header link is outlined, BR-010).
3. Placeholders (resource names, testimonials, photos) are visibly marked as pending and follow BR-011.
4. Copy is gender-neutral (BR-005) and makes no guaranteed outcomes (BR-003).
5. The layout matches `UX_UI_DIRECTION.md` at 360, 390, 768 and 1280 px with no horizontal scroll.

**Dependencies**
- `CONTENT.md` (Home copy, Spanish verbatim from the brief, English provisional) and `UX_UI_DIRECTION.md` v1.0 (Home layout) merged; US-019 and US-020.

---

## US-022 — My story page
- Priority: High
- Story Points: 3
- Status: Done — Sprint 003 (#56)
- Related Requirements: FR-003, FR-029, BR-011

**User Story**

As a visitor,
I want to read Gaby's story,
so that I understand why she can guide me.

**Acceptance Criteria**
1. The page shows Gaby's story with the copy from `CONTENT.md`, in both languages.
2. Media mentions (Canal 13, Radio Azul, Radio Fides, talks) are shown as names only, in a layout that can take logos later without redesign.
3. Microsoft and Oracle are shown with their logos as prior experience, from files committed with their source noted in the PR; Intel is named without a logo until confirmed.
4. Spaces for session photos, bio and credentials are visibly marked as pending (US-017).
5. The page ends with a VIP band and a link to the resources.

**Dependencies**
- `CONTENT.md` (My story) and `UX_UI_DIRECTION.md` v1.0 merged; the Microsoft and Oracle logo files (human owner); US-019 and US-020.

---

## US-023 — VIP mentorship page and screening-based routing
- Priority: Critical
- Story Points: 5
- Status: Done — Sprint 003 (#57). Phase 2c: the scheduler becomes the GoHighLevel calendar (US-037), and the video module holds Gaby's new VSL when she records it (US-017)
- Related Requirements: FR-006 to FR-010, FR-014, FR-015, FR-026, BR-001, BR-002, BR-006, BR-008
- Related Spec: `LEAD_API_CONTRACT.md` (unchanged), `CONTENT.md` (VIP)

**User Story**

As Gaby,
I want one VIP page where people apply, and only those ready to invest reach my calendar,
so that my calls go to qualified applicants and everyone else still gets something useful.

**Acceptance Criteria**
1. The VIP page shows the steps (apply, video, call), the video module with a visible placeholder (FR-026), and the application form.
2. The form keeps the fields, validation, honeypot, consent and error handling of US-004, US-005, US-011 and US-013, restyled per US-019: fields on Marfil with the border token from `UX_UI_DIRECTION.md` (at least 3:1, US-019 AC7) and an Azul Patrimonio focus; screening options as large cards at least 44 px high; the gold submit button (the only gold button in its viewport); the line "Llamada inicial sin costo · Tus datos protegidos (Ley 8968)" below it.
3. The request to `POST /api/save-lead` is unchanged (`LEAD_API_CONTRACT.md` v1.1).
4. After `201` with `ready_to_invest` or `needs_investment_info`: thank-you and the inline Calendly with name and email pre-filled, as in US-007 (including the fallback).
5. After `201` with `no_capacity_now` or `exploring`: a warm thank-you screen without Calendly, offering the featured free mini-course (an email-delivered resource: shown as "coming soon" with `resource.email.coming_soon` until US-025, per US-024 AC4; after US-025, requested by email); Calendly is not loaded.
6. Unit tests cover the routing for all four codes; e2e covers one qualified and one not-ready answer in both languages.

**Dependencies**
- `CONTENT.md` (VIP page, thank-you screens) and `UX_UI_DIRECTION.md` v1.0 merged; US-019 and US-020.

---

## US-024 — Free resource library
- Priority: High
- Story Points: 5
- Status: Done — Sprint 003 (#60; AC4 fix #63). Withdrawn in phase 2d: the library is removed by US-046 (Gaby, 2026-11-23)
- Related Requirements: FR-023, FR-024, BR-011

**User Story**

As a visitor,
I want a library of free resources I can filter by topic,
so that I can start improving my finances today, at no cost.

**Acceptance Criteria**
1. The page shows a featured mini-course, topic filters (All, Getting out of debt, Wallets and budget, Investing, Mindset and money) and resource cards (type, access, title, topic, call to action).
2. Filters work without reloading the page and are usable with the keyboard; without JavaScript all resources are shown.
3. Resources are defined in one typed data file (title, description, type, topic, access, file or link per language), so adding a resource does not touch components.
4. A free-download resource links to its file only when the real file has been delivered and committed (or hosted at a confirmed URL); until then its card shows as pending (BR-011) with no link. Email-delivered resources show "coming soon" and collect no data until US-025.
5. Placeholder names are visibly marked as pending (BR-011).
6. The page ends with a VIP band.

**Dependencies**
- `CONTENT.md` (library copy and the resource list) and `UX_UI_DIRECTION.md` v1.0 merged; resource files from Gaby for any card that links; US-019 and US-020.

---

## US-025 — Resource delivery by email (phase 2b)
- Priority: High
- Story Points: 5
- Status: Withdrawn — phase 2d (no resource library; Gaby, 2026-11-23). It was proposed for phase 2b
- Related Requirements: FR-025, FR-013, NFR-007, NFR-008, NG-006

**User Story**

As a visitor,
I want to receive a free resource in my inbox,
so that I can keep it and use it later.

**Acceptance Criteria**
1. The request form asks for email and privacy consent; the endpoint has the honeypot and rate limit of NFR-008.
2. Each request is stored (email, language, resource, consent, timestamp, privacy notice version) in its own tab or sheet.
3. The resource is sent from Gaby's Google account; the email states why it was sent and how to opt out; opt-outs are recorded.
4. Success is shown only after the request is stored and the email is accepted for sending; failures show a clear error.
5. A real-delivery test passes before release: the email arrives in the inbox (not spam) of an external Gmail and an external Outlook account, opened in those recipient accounts, with the link or attachment working; the sending account shows no bounce.
6. The privacy notice covers resource requests before this goes live (US-018).

---

## US-026 — Blog (phase 2b)
- Priority: Medium
- Story Points: 3
- Status: Proposed — phase 2b
- Related Requirements: FR-027

**User Story**

As Gaby,
I want to publish articles on my site,
so that visitors find useful content and get to know my approach.

**Acceptance Criteria**
1. Posts are Markdown files in the repository with title, date, language, summary and optional cover.
2. The blog list page exists in both languages and lists the posts of its language; each post has a page in each language it was written in; posts link to the resources and the VIP page.
3. The navigation shows Blog only when at least one post exists.
4. The language toggle on a post leads to its translation when there is one, and to the blog list of the other language otherwise (FR-027).

---

## US-027 — Preview on GitHub Pages
- Priority: High
- Story Points: 3
- Status: Done — Sprint 003 (#55: workflow and `RELEASE.md`; #58: preview mode of the form; #64: AC2 fix, preview marker on `/`)
- Related Requirements: FR-030
- Related ADR: ADR-005 (branching, preview and release)

**User Story**

As the project owner,
I want every merged change published to a preview,
so that Gaby can follow progress without a production deployment.

**Acceptance Criteria**
1. A workflow builds the site in preview mode and publishes it to GitHub Pages on every push to `main`, under the repository path; links, assets and the language detection work there.
2. Preview mode adds `noindex` to every page and a visible "Preview" marker in both languages.
3. In preview mode, forms do not call any endpoint and load no third-party service: after client-side validation they show the next screen as a demonstration, including the US-023 routing, with a note that nothing was sent; the scheduler step shows a static stand-in, never the real Calendly, whatever is configured.
4. The production build is unchanged by preview mode (no marker, no `noindex`, real endpoint).
5. `docs/runbooks/RELEASE.md` explains how to find the preview and what it does not do.

---

## US-028 — Método Polaris page
- Priority: Medium
- Story Points: 3
- Status: Done — Sprint 004 (#79), with placeholder steps. Replaced in phase 2d by the Wealth Mastery page (US-042), which removes this page
- Related Requirements: FR-017, FR-018, BR-009

**User Story**

As a visitor,
I want a page that explains the Método Polaris in full,
so that I understand how Gaby works before applying.

**Acceptance Criteria**
1. A Método Polaris page exists in both languages at the path in `UX_UI_DIRECTION.md` (§5.7), with the steps and copy from `CONTENT_PHASE_2C.md` §12: until the official steps arrive, the three provisional steps with the pending badge and the placeholder block.
2. The header navigation item (`nav.method`) leads to the page: this PR switches it from the Home's `#metodo` section (where the scaffold leaves it) to the page. The Home keeps its short Método Polaris section (US-034).
3. The page ends with a VIP band; existing tests stay green and e2e covers the navigation in both languages.

4. The PR moves its copy from `CONTENT_PHASE_2C.md` into [`CONTENT.md`](../ux/CONTENT.md) in the same PR as the code, and deletes it from the staging file: §12 and its row of A.1. `meta.method.*` moves with the scaffold (US-034).

**Security**
- None: a static page with no form or third party.

---

## US-029 — Security baseline
- Priority: High
- Story Points: 5
- Status: Planned — Sprint 004 (`GK-029-security-baseline`); Sprint 004 candidate (kit v1.2.0 sync, kit issue Raulc87/sdd_starter_kit#62). The project already writes code, so the baseline is a story in its next sprint and is approved by that sprint's end ([`AGENTS.md`](../../AGENTS.md) → Security baseline; [readiness checklist](../checklists/SPRINT_READINESS_CHECKLIST.md) → Security)
- Related Requirements: NFR-007, NFR-008, FR-013, BR-006
- Related ADR: ADR-001, ADR-002, ADR-004, ADR-005

**User Story**

As the project owner,
I want the site's security baseline written and approved,
so that every later story and the first production release are checked against OWASP, not against memory.

**Acceptance Criteria**
1. `docs/security/SECURITY_BASELINE.md` exists, written from the kit's `docs/security/SECURITY_BASELINE_TEMPLATE.md` at the kit ref in [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) (the template is read from the kit, not copied into this repository). Its classification records that the site stores personal data (the lead form, Ley N.° 8968), has no authentication or payments, and is a public site with one public endpoint (`POST /api/save-lead`) plus the static GitHub Pages preview; and whether it is high-risk or complex, with the reason.
2. It names the OWASP ASVS 5.0.0 level and why. Because the site handles personal data, the ASVS inventory lists every requirement of that level, each covered (an acceptance criterion, a test or a configuration check, named) or marked not applicable with the reason.
3. It lists the OWASP Top 10 (2025) and API Security Top 10 (2023) risks that apply to the site and the endpoint. For each one, the stories that touch it (at least US-004, US-006, US-011, US-013, US-014, US-023) are named, with the acceptance criterion that verifies it; when a story that touches an applicable risk has no criterion that verifies it, this story's PR adds a testable acceptance criterion to that story in this file; only a risk that no existing story can verify is recorded as an open item in the baseline (§7), with a new story to cover it.
4. Secret scanning and dependency scanning are set up, or planned as stories: GitHub secret scanning with push protection on this public repository (a repository setting the human owner turns on), and dependency scanning for `package.json` and `api/requirements.txt` (for example Dependabot alerts and an audit step in CI). The baseline (§6) records which are on and since when. It also maps the SDD workflow to the NIST SSDF 1.1 practice groups (PO, PS, PW, RV) and says how a vulnerability is reported and fixed.
5. The penetration-test section records a PTES test before the first production release (US-014 AC6, go-live), because the site stores personal data, and whether OSSTMM 3 also applies (only if the baseline classifies the site as high-risk). `docs/security/PENTEST_PLAN.md` (from the kit's `PENTEST_PLAN_TEMPLATE.md`) is written and approved before the go-live sprint starts. The test is run only by people the human owner authorizes in writing, under a written scope; no agent runs a penetration test, attack tools or scans against production. The site is not in production today (only the preview, ADR-005), so the dated-deadline exception for projects already in production does not apply: the test gates the first production release.
6. No document, copy or PR says the site is certified, compliant or secure; the baseline says which requirements were verified, how and when.
7. The human owner approves the baseline (§8) by the end of the sprint that carries this story.

**Security**
- This story writes the baseline; it verifies no OWASP reference itself.

**Dependencies**
- None. US-014 (go-live, AC6) depends on this story's AC5.

---

## US-030 — Developer guide (`CONTRIBUTING.md`)
- Priority: Medium
- Story Points: 2
- Status: Planned — Sprint 004 (`GK-030-contributing`); Sprint 004 candidate (kit v1.2.0 sync, kit issue Raulc87/sdd_starter_kit#62). Due by the end of the first sprint that runs code; that sprint has passed, so it goes in the next one ([`AGENTS.md`](../../AGENTS.md) → Document map)
- Related Requirements: none (process)

**User Story**

As a developer or agent new to the project,
I want one guide that says how to set up, run, test and change the site,
so that I can make a correct change without reading every runbook first.

**Acceptance Criteria**
1. `CONTRIBUTING.md` exists at the repository root, written from the kit's `docs/DEVELOPER_GUIDE_TEMPLATE.md` at the kit ref in [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) (read from the kit, not copied in), with every section of the template filled in or marked not applicable with the reason.
2. Set up, run and test give the real commands from `package.json`, `api/` and the CI workflows (`frontend.yml`, `backend.yml`, `preview.yml`, `docs-link-check.yml`), and link to [`docs/runbooks/LOCAL_DEVELOPMENT.md`](../runbooks/LOCAL_DEVELOPMENT.md) instead of repeating it.
3. "Values to have ready" lists every variable a developer needs (the `PUBLIC_*` values and `api/.env.example`), without any real value or secret.
4. "How to make a change" links to [`AGENTS.md`](../../AGENTS.md) (branches, PRs, the review flow, Code readability) instead of restating it.
5. Following the guide from a fresh clone, the reviewer can install, run the site locally and run the checks CI runs; any step that fails is fixed in the guide in the same PR.

**Security**
- None: a documentation story. AC3 keeps secrets out of the guide (NFR-007).

**Dependencies**
- None.

---

**Phase 2c (2026-11-08).** US-034 to US-039 come from Gaby's review of the Sprint 003 preview (`PROJECT_SPEC.md` v0.6; source: `docs/ux/BRIEF_2026-11-08_STORYBRAND.md`). US-031 to US-033 are reserved for the security stories planned in the dropped kit v1.3.0 sync (Raulc87/gaby-main-page#68), which the next kit sync brings back.

---

## US-034 — StoryBrand Home
- Priority: High
- Story Points: 8
- Status: Planned — Sprint 004 (`GK-034-site-scaffold`, `GK-034-home`); Sprint 004 candidate (phase 2c)
- Related Requirements: FR-001, FR-002, FR-004, FR-005, FR-021, FR-022, FR-031, FR-032, FR-033, FR-040, BR-003, BR-010, BR-011
- Replaces: the US-021 section order and copy

**User Story**

As a corporate professional visiting the site,
I want the Home to show my problem, what is at stake, a guide who has been there, a plan and what success looks like,
so that I see myself in it and know my next step: apply, or find out where I stand with the calculator.

**Acceptance Criteria**
1. The Home has the eleven sections of `UX_UI_DIRECTION.md` §5.1, in that order, with the anchors of §3, in both languages, with the copy of `CONTENT_PHASE_2C.md` §5 copied verbatim. The free-resources teaser (`#recursos`) is gone.
2. The hero has the gold `home.hero.cta` to the VIP page and the blue `home.hero.secondary` to the calculator page (US-035). Its image frame shows the "desired state" placeholder with the pending badge until the photo arrives; the studio portrait appears only in the guide section.
3. The problem's second paragraph uses the corrected wording (`home.ladder.p2`, without "Cada vez más cosas dependen de ti, y").
4. The stakes, guide, Wealth Mastery, before-and-after and VIP sections render as `UX_UI_DIRECTION.md` §5.1 says, with the three figures (the third, "200+", provisional), the media names as text (no logos, FR-029), and seven module cards.
5. Gold appears only in the hero and the closing VIP band; `home.method.cta`, `home.mastery.cta` and `home.testimonials.cta` use the blue style; no viewport at 360, 390, 768 or 1280 px shows two gold buttons (BR-010). `home.testimonials.cta` is hidden while every testimonial card is a placeholder.
6. The calculator teaser links to the calculator page, shows the example result, and shows `home.calculator.receive` (not `receive_with_guide`) until US-038 is done; its two library links go to the resource library, where both resources show as coming soon.
7. Pending badges follow `CONTENT.md` → Metadata (the new provisional blocks in preview and development builds; the hero photo and testimonial placeholders in every build).
8. Existing tests are updated for the new order and anchors; e2e covers both languages, the hero's two calls to action, the gold rule at the four widths, and that no link points at the removed `#recursos` anchor.
9. The PR moves its copy from `CONTENT_PHASE_2C.md` into [`CONTENT.md`](../ux/CONTENT.md) in the same PR as the code, and deletes it from the staging file: A.2 and A.3 (in the scaffold PR, `GK-034-site-scaffold`, Sprint 004 plan); then, in the Home PR, its rows of A.1, A.4 to A.6b, and §5 (replacing [`CONTENT.md`](../ux/CONTENT.md) §5), and bumps [`CONTENT.md`](../ux/CONTENT.md) to v0.2.

**Security**
- None: static content. No new form or third party.

**Dependencies**
- US-035 for the calculator page the links point to (the link can land first; the page must exist before the sprint closes).

---

## US-035 — Freedom-months calculator (page and placeholder formula)
- Priority: High
- Story Points: 5
- Status: Planned — Sprint 004 (`GK-035-calculator`); Sprint 004 candidate (phase 2c). Built as a shell with a placeholder formula; Gaby's calculator replaces the questions, formula and zones later (human owner, 2026-11-08)
- Related Requirements: FR-034, FR-035, FR-013, FR-030, NFR-005, NFR-006, BR-003

**User Story**

As a corporate professional,
I want to find out how many months my money would last without my salary,
so that I understand where I stand and whether I need a plan.

**Acceptance Criteria**
1. The calculator page exists in both languages at the paths in `UX_UI_DIRECTION.md` §3, with the three steps of §5.6 and the copy of `CONTENT_PHASE_2C.md` §11.
2. The five figures are required numbers of 0 or more, validated in the browser with the `CONTENT.md` errors; expenses plus debt payments must be above 0.
3. The result follows the placeholder formula of FR-034 exactly, including the "covered" case and the zone limits (below 6, 6 to under 12, 12 or more, from the unrounded value), with one decimal in the language's format ("4,4 meses" / "4.4 months"), and no upper limit (a test with a result above 1,000 months). The formula lives in one function with unit tests for each zone, each boundary (5.99, 6, 11.99, 12), the covered case and rounding, so Gaby's version can replace it in one place.
4. Before the result, the visitor gives name, email, optional WhatsApp, the required consent and, optionally, the consent to Gaby's emails (`CONTENT_PHASE_2C.md` §11.2; the second checkbox starts unticked); the details are sent to the calculator-lead endpoint (US-036) with the months, the zone and whether the visitor ticked the email consent, never the five figures. The result appears only after a successful save; on an error the visitor sees the error message and can retry, and the result stays hidden (NFR-006).
5. Preview builds store and send nothing: after the details step the result appears with `preview.form_note` (FR-030).
6. The result shows the zone in words and colour (§6.7), the disclaimer, the gold `calc.result.cta` to the VIP page, the library link and "Calculate again". "Calculate again" returns to the questions; the details step then shows again, prefilled, and submitting it stores a new row with the new result (the calculator has its own rate-limit budget, contract v1.2 §11.1). `calc.result.email_note` is not shown until US-038 is done.
7. The questions, zones and result show the pending badge in preview and development builds (placeholder formula).
8. Accessibility: every input has a label and hint linked to it; focus moves to each step's title; errors are announced; the page works at 360 px with no horizontal scroll. Without JavaScript the page shows the VIP and library links instead of the calculator.
9. The PR moves its copy from `CONTENT_PHASE_2C.md` into [`CONTENT.md`](../ux/CONTENT.md) in the same PR as the code, and deletes it from the staging file: §11, its row of A.1, and the calculator's privacy text (A.8: `privacy.p2`, `privacy.p3`, `privacy.p5`), and bumps the `PRIVACY_NOTICE_VERSION` line in [`api/.env.example`](../../api/.env.example) in the same PR, so the version and the text it names change together (recorded exception, Sprint 004 plan). `meta.calculator.*` moves with the scaffold (US-034).

**Security**
- OWASP Top 10 (2025) A05 Injection and the API's input validation are covered by US-036. This story sends only what FR-035 lists (data minimization); the five figures never leave the browser.

**Dependencies**
- US-036 for the endpoint (the frontend can be built against the contract and memory mode first).

---

## US-036 — Calculator leads: contract and storage
- Priority: High
- Story Points: 3
- Status: Planned — Sprint 004 (`GK-036-calculator-leads`); Sprint 004 candidate (phase 2c)
- Related Requirements: FR-035, FR-039, FR-013, NFR-006, NFR-007, NFR-008
- Related ADR: ADR-001, ADR-002, ADR-004

**User Story**

As Gaby,
I want every calculator lead stored with its result,
so that I can follow up with the people who used it.

**Acceptance Criteria**
1. Before implementation, [`LEAD_API_CONTRACT.md`](LEAD_API_CONTRACT.md) v1.2 is approved in a docs PR (done: section 11, written in the Sprint 004 planning PR and locked when it merges): a calculator-lead endpoint (path, request fields of [`PROJECT_SPEC.md`](PROJECT_SPEC.md) §10, `zone` codes `alert`, `building`, `freedom`, `months` as a number with one decimal or null when covered, optional `phone`, the required `consent` and the optional `marketing_consent` boolean, the honeypot and rate limit of v1.1, responses and error codes), and the sheet tab and its columns, including `source` = `calculator` and `status`.
2. The backend implements the endpoint per the contract, validating every field (an unknown `zone`, `months` negative or with more than one decimal, a `zone` that does not match `months`, missing consent → field errors; `months` has no upper limit, since the formula has none, FR-034), storing a row in the calculator tab with server-generated `submitted_at`, `privacy_notice_version` and `status` = `started`.
3. A failed save returns the contract's error and stores nothing partial (NFR-006). Honeypot and rate limit behave as for the VIP endpoint (ADR-004).
4. The new configuration is documented: `GOOGLE_SHEET_CALCULATOR_TAB` in [`api/.env.example`](../../api/.env.example) and [`docs/runbooks/GOOGLE_SHEETS_SETUP.md`](../runbooks/GOOGLE_SHEETS_SETUP.md) (the new tab and its header row), and `PUBLIC_CALCULATOR_ENDPOINT` in the root [`.env.example`](../../.env.example). `PRIVACY_NOTICE_VERSION` is bumped by US-035, in the same PR as the notice text it versions.
5. Tests cover the contract's success, validation errors, honeypot, rate limit and storage failure, as `LEAD_API_CONTRACT.md` §10 requires for the VIP endpoint.

**Security**
- OWASP Top 10 (2025) A05 Injection (server-side validation of every field), API Security Top 10 (2023) API4 Unrestricted Resource Consumption (rate limit), and personal data minimization (no financial figures stored).

**Dependencies**
- None (the contract change comes first, AC1).

---

## US-037 — GoHighLevel booking calendar instead of Calendly
- Priority: High
- Story Points: 3
- Status: Planned — Sprint 004 if Gaby's GoHighLevel calendar is ready (`GK-037-ghl-scheduler`); Sprint 004 candidate (phase 2c, ADR-006)
- Related Requirements: FR-010, FR-014, FR-015, FR-030
- Related ADR: ADR-006

**User Story**

As Gaby,
I want qualified applicants to book on my GoHighLevel calendar,
so that I don't pay for Calendly as well and all my bookings are in one place.

**Acceptance Criteria**
1. The qualified thank-you screen embeds the booking widget at `PUBLIC_SCHEDULER_URL` (Gaby's GoHighLevel calendar) inline, as `UX_UI_DIRECTION.md` §6.4 says; `PUBLIC_CALENDLY_URL` and the Calendly embed are removed from the code, `.env.example` and the runbooks.
2. The applicant's name, email and phone are prefilled in the widget if GoHighLevel's embed supports it; the PR states what was verified and how. If it doesn't, the visitor types them again and the PR says so. Either way GoHighLevel ends up with the booking's name, email and phone, which `privacy.p4` states.
3. The fallback (`thanks.scheduler_fallback`, renamed from `thanks.calendly_fallback`) appears when the URL is unset, the widget fails to load, or nothing appears within 10 seconds (US-007).
4. The not-ready screen loads no scheduler. Preview builds still show the static stand-in and load nothing from GoHighLevel (FR-030).
5. The privacy notice names GoHighLevel instead of Calendly (`CONTENT_PHASE_2C.md` A.8 (`privacy.p4`)), and `PRIVACY_NOTICE_VERSION` is bumped in the same PR.
6. Tests: unit tests for the fallback timing and the URL handling; e2e for both screens with the scheduler stubbed (no network call to GoHighLevel in CI).
7. The PR moves its copy from `CONTENT_PHASE_2C.md` into [`CONTENT.md`](../ux/CONTENT.md) in the same PR as the code, and deletes it from the staging file: A.7 (the renamed key) and A.8 `privacy.p4`.

**Security**
- A third-party script (GoHighLevel's embed) runs on the thank-you screen only, after the save; it is listed in the security baseline's third parties (US-029). No secret is involved: the widget URL is public.

**Dependencies**
- Gaby's GoHighLevel calendar set up and its embed URL (human owner, with Gaby): she uses Calendly today, so the GHL calendar may not exist yet. Model it on her current Calendly event (ADR-006 → Implementation Impact).

---

## US-038 — Funnel emails: the calculator result with the ebook, and Gaby's notification
- Priority: Medium
- Story Points: 2
- Status: Proposed — phase 2d (ADR-007 decided: GoHighLevel). Rewritten 2026-11-23: GoHighLevel sends these emails from Gaby's workflows; the site's part is US-045. Blocked on US-045, Gaby's set-up in GoHighLevel and the ebook. The phase 2c version (our backend sending email) is replaced; its text is in the history
- Related Requirements: FR-036, FR-038, FR-041, BR-012, NFR-006
- Related ADR: ADR-007, ADR-008

**User Story**

As Gaby,
I want each calculator lead to receive their result and my ebook, and to be told of each Wealth Mastery application,
so that the follow-up starts at once without my doing it by hand.

**Acceptance Criteria**
1. Gaby's GoHighLevel set-up exists and is written down in the GoHighLevel runbook (US-045): a workflow that, when a contact gets the tag `lead-calculadora`, sends email 1 in the contact's language (tag `idioma-es` / `idioma-en`) with the `meses` and `zona` fields and the ebook; and a workflow that notifies Gaby when a contact gets the tag `aplicacion-vip`.
2. End to end, in the development environment with `GHL_SYNC` = `on` (the human owner, with Gaby): a calculator lead made with the owner's own address receives email 1 with its months and zone; an application made with it notifies Gaby. The PR or the sprint review records the check.
3. Email 1 names the sender (Gaby Kelly), says why it was sent, and has GoHighLevel's unsubscribe.
4. Once 2 passes, the site shows `home.calculator.receive_with_guide` and `calc.result.email_note` instead of the "no email" wording (a copy-only change in this story's PR, from `CONTENT.md`).
5. The sending domain is authenticated for GoHighLevel's sending (SPF, DKIM, DMARC) before this ships to production; the go-live check (US-014) records it.

**Security**
- No email credential exists in the site: GoHighLevel sends. The contact data GoHighLevel holds is limited to FR-041 (no calculator figures).

**Dependencies**
- US-045 merged; Gaby's workflows, custom fields and ebook in GoHighLevel.

---

## US-039 — Funnel sequence: six emails over 14 days and the weekly email
- Priority: Medium
- Story Points: 2
- Status: Proposed — phase 2d (ADR-007 decided: GoHighLevel). Rewritten 2026-11-23: GoHighLevel runs the sequence; blocked on US-045 and on Gaby's six email texts loaded in GoHighLevel. The phase 2c version (an email tool through our backend) is replaced
- Related Requirements: FR-037, FR-039, FR-041, BR-012
- Related ADR: ADR-006, ADR-007, ADR-008

**User Story**

As Gaby,
I want calculator leads who haven't booked to receive my sequence and then a weekly email,
so that the people who are not ready yet keep hearing from me until they are.

**Acceptance Criteria**
1. Gaby's GoHighLevel workflow sends emails 2 to 6 on days 3, 5, 8, 11 and 14, then the weekly email, in the contact's language, **only** to contacts with both `lead-calculadora` and `consentimiento-correos` (BR-012); a contact without the consent tag gets email 1 only. No workflow sends calculator leads an automated SMS or WhatsApp message (BR-012).
2. A booking in Gaby's GoHighLevel calendar removes the contact from the sequence (inside GoHighLevel, ADR-007); GoHighLevel's unsubscribe stops every email at once.
3. End to end (the human owner, with Gaby, in the development environment): one lead with the follow-up consent enters the sequence and leaves it after a test booking; one lead without it receives only email 1. The sprint review records the check.
4. The GoHighLevel runbook (US-045) says how Gaby edits the texts and sees who is in the sequence.
5. The privacy notice names GoHighLevel as the sender before the first sequence email (US-045 AC7).

**Security**
- Nothing in the site sends these emails; the consent tag is set only when the visitor ticked the optional consent (US-044, US-045).

**Dependencies**
- US-038; Gaby's six email texts and the weekly content in GoHighLevel.

---

## US-040 — Self-hosted typefaces (no Google Fonts)
- Priority: Medium
- Story Points: 2
- Status: Proposed — Sprint 005 candidate (human owner, 2026-11-19: "let's do that", answering the security baseline's item O-8)
- Related Requirements: NFR-002 (fast loading); Ley 8968 privacy (the security baseline's R-1); [`UX_UI_DIRECTION.md`](../ux/UX_UI_DIRECTION.md) §2.3
- Related: [`SECURITY_BASELINE.md`](../security/SECURITY_BASELINE.md) R-1 and O-8

**User Story**

As a visitor,
I want the site to load its typefaces from its own server,
so that Google does not receive my address every time I open a page, before I have agreed to anything.

**Acceptance Criteria**
1. Playfair Display (500, italic 500) and Manrope (400, 600, 700) are served from the site itself, as WOFF2 files in the repository with their SIL Open Font License texts, and only the weights and subsets the site uses (Latin, including Spanish accents and `ñ`).
2. No page requests anything from `fonts.googleapis.com` or `fonts.gstatic.com`: the `preconnect` and stylesheet links in [`src/layouts/BaseLayout.astro`](../../src/layouts/BaseLayout.astro) are removed, and an e2e test fails if any page requests either host.
3. The typefaces look as they do today in both languages. The fallback stacks in the CSS tokens stay, `font-display: swap` is kept, and the heading and body fonts are preloaded so text does not jump on load. Screenshots at 390 and 1280 px are in the PR.
4. Links and asset paths go through the base-path helpers, so the fonts load both at `/` and under `/gaby-main-page/` (the preview).
5. The PR proposes the doc changes for its owners: the security baseline closes R-1 and O-8 and removes Google Fonts from its third parties (Agent 3's file), and [`TECH_STACK.md`](../../TECH_STACK.md) and [`UX_UI_DIRECTION.md`](../ux/UX_UI_DIRECTION.md) §2.3 say "self-hosted" instead of "Google Fonts".

**Security**
- It removes a third party that received visitors' addresses before any consent (R-1). The font files are static assets from the upstream projects under the OFL; no new dependency at runtime.

**Dependencies**
- None. It touches [`src/layouts/BaseLayout.astro`](../../src/layouts/BaseLayout.astro) and the global styles (Agent 1's files in Sprint 004's ownership map).

---

## US-041 — Voseo, the Wealth Mastery name and the new menu
- Priority: High
- Story Points: 5
- Status: Proposed — Sprint 005 candidate (phase 2d)
- Related Requirements: FR-017, FR-018, FR-019, FR-043, BR-009
- Source: [`BRIEF_2026-11-23_WEALTH_MASTERY.md`](../ux/BRIEF_2026-11-23_WEALTH_MASTERY.md) §1 point 1

**User Story**

As a Costa Rican corporate professional,
I want the site to speak to me with "vos" and call the programme by its name,
so that it sounds like Gaby and I know what I'm applying to.

**Acceptance Criteria**
1. Every Spanish string the site shows uses voseo, as `CONTENT.md` has it after this story moves the staged voseo copy (`CONTENT_PHASE_2D.md`) into it; a unit test fails if a Spanish string in `src/i18n/es/` contains a "tú" form listed in the staging file's check list (for example "aplica a", "quieres", "tienes", "puedes").
2. "Mentoría VIP" appears nowhere the visitor sees, in either language; every apply button reads "Aplicá a Wealth Mastery" / "Apply to Wealth Mastery".
3. The header shows Mi historia · Wealth Mastery · Diagnóstico gratis (and Blog when it exists), the language toggle, and the outlined "Aplicá a Wealth Mastery" link (`UX_UI_DIRECTION.md` §4.1); "Diagnóstico gratis" leads to the calculator, "Wealth Mastery" to the Wealth Mastery page (a stub page until US-042), at every width, in both languages.
4. The application page moves to `/es/aplicar/` and `/en/apply/` (route id `vip` kept); no link anywhere still points at `/es/mentoria-vip/` or `/en/vip-mentorship/`, and the route unit tests cover the new paths, uniqueness and the base path.
5. The `mastery` route exists with a stub page in both languages (its title and description), which US-042 fills.
6. E2E: the header's links in both languages and at 390 and 1280 px; no gold link in the header (BR-010).

**Security**
- No change to forms, data or third parties.

**Dependencies**
- `CONTENT_PHASE_2D.md` merged (the phase 2d copy docs PR). Merges first in Sprint 005 (the scaffold of phase 2d).

---

## US-042 — Wealth Mastery page
- Priority: High
- Story Points: 5
- Status: Proposed — Sprint 005 candidate (phase 2d). Replaces the Método Polaris page of US-028
- Related Requirements: FR-042, FR-004, BR-009, BR-011
- Source: brief §2

**User Story**

As a corporate professional considering the mentorship,
I want one page that explains Wealth Mastery, who it is for and how it works,
so that I can decide whether to apply.

**Acceptance Criteria**
1. The page has Gaby's eight sections in her order, with the anchors and layout of `UX_UI_DIRECTION.md` §5.7, and the copy of `CONTENT_PHASE_2D.md` (moved into `CONTENT.md` in this PR) in both languages.
2. The three pillars show no numbers and no arrows; the "En paralelo, no en orden" card follows them.
3. The FAQ is an accordion of native `<details>` elements, usable with the keyboard; its answers carry the pending badge until Gaby confirms them.
4. "Quién te guía" shows a marked photo placeholder (not the Home's portrait) until Gaby's photo arrives (BR-011); the testimonials are the Home's placeholder cards.
5. No price appears on the page.
6. The Método Polaris page (`method` route, its stubs and its copy, `CONTENT.md` §12) is removed, and no link points at it.
7. Exactly one gold button per viewport at 360, 390, 768 and 1280 px (BR-010).
8. E2E: the page from the header in both languages, the section order and anchors, the accordion opening by keyboard, and the badges.

**Security**
- No forms and no third parties on this page.

**Dependencies**
- US-041 merged.

---

## US-043 — Home for phase 2d: the pillars, no Wealth Mastery section, no library links
- Priority: High
- Story Points: 3
- Status: Proposed — Sprint 005 candidate (phase 2d)
- Related Requirements: FR-004, FR-022, FR-032 (withdrawn), FR-043
- Source: brief §3

**User Story**

As a visitor on the Home,
I want the method explained as Gaby teaches it and one clear free next step,
so that I'm not sent to things that don't exist.

**Acceptance Criteria**
1. The Home has the ten sections of `UX_UI_DIRECTION.md` §5.1 (the Wealth Mastery section `#wealth-mastery` removed, with its keys) and Gaby's adjusted copy from `CONTENT_PHASE_2D.md`, moved into `CONTENT.md` in this PR.
2. The Método Polaris section shows the three pillars with their official names as labels, no numbers, no arrows, the closing line, the blue apply button and the text link "Conocé Wealth Mastery →" to the Wealth Mastery page.
3. The calculator teaser has no links to other resources, and nothing on the Home links to the resource library.
4. Section backgrounds alternate as §5.1 says; gold only in the hero and the closing band (BR-010) at 360, 390, 768 and 1280 px.
5. `tests/e2e/home.spec.ts` covers the new order and anchors, the pillars (no step numbers), the "Conocé Wealth Mastery" link, and no link to `#wealth-mastery` or the library, in both languages.

**Security**
- No change.

**Dependencies**
- US-041 merged; US-042 for the link's target (the stub of US-041 is enough to merge first).

---

## US-044 — Gaby's calculator
- Priority: High
- Story Points: 5
- Status: Proposed — Sprint 005 candidate (phase 2d). Replaces the placeholder formula and the questions of US-035
- Related Requirements: FR-034, FR-035, FR-030, NFR-006
- Related contract: [`LEAD_API_CONTRACT.md`](LEAD_API_CONTRACT.md) v1.3 §11
- Source: brief §4

**User Story**

As a corporate professional,
I want to see how many months my money would carry me if my position changed, in dollars or colones,
so that I know where I stand and what to do next.

**Acceptance Criteria**
1. One function implements FR-034 (available money, monthly gap, months, the six zones from the exact value, the display rule, the concentration alert), with unit tests for: the covered case (gap 0 and below → ∞, `financially_free`); each zone boundary (2.99, 3, 5.99, 6, 11.99, 12, 35.99, 36); the display rule, half up on the exact decimal value (4.44 → "4,4"; 4.45 → "4,5"; 5.96 → "6" in `alert`; 9.95 → "10"; 9.96 → "10"; 10.5 → "11"; 11.6 → "12"; a whole value below 10 without a decimal; "mes" for exactly 1); a result above 1,000 months; and the value sent to the API rounded **down** to two decimals and consistent with the zone.
2. The page follows `UX_UI_DIRECTION.md` §5.6 with Gaby's texts (`CONTENT_PHASE_2D.md`, moved into `CONTENT.md` in this PR): the currency switch (§6.10, rate `PUBLIC_CRC_PER_USD`, default 500, in the root `.env.example`), Gaby's example figures, the five money inputs and the company-shares select (opening on "Elegí una opción", required: FR-034), one step at a time. Switching currency back and forth never changes the amounts the visitor typed (a unit test: ₡1,250 → USD → CRC gives ₡1,250 again).
3. The details step has two checkboxes: the required consent and the optional, unticked follow-up consent (FR-035); it sends `POST /api/save-calculator-lead` per contract v1.3 §11.2 (`currency`, `concentration_alert`, `months` rounded down to two decimals, the v1.3 zone codes), never the figures; the result appears only after a `201`.
4. The result shows the months (or ∞), the zone pill (§6.7), the gauge (§6.8), the zone's title and message, the available money and monthly gap in the chosen currency, the concentration alert when it applies, the "how do I raise this number" card with the gold apply button and "Calcular otra vez", and the disclaimer.
5. "Calcular otra vez" returns to step 1 with the figures kept; the details step shows again, prefilled, and stores a new lead.
6. Preview builds store and send nothing and show `preview.form_note` (FR-030).
7. The shares question left on "Elegí una opción" shows its own error (copy from `CONTENT_PHASE_2D.md`) and nothing is sent; the details button keeps its busy state while the save and the GoHighLevel send run (up to `GHL_TIMEOUT_SECONDS`, 5 s), and the visitor can't submit twice.
8. E2E: figures → details → `201` → result, in both currencies; the unanswered shares question blocks step 1; a failure keeps the result hidden; the concentration alert for "Entre 20% y 50%"; no request to `/api` in a preview build; one gold button per viewport at 360, 390, 768 and 1280 px.

**Security**
- The figures never leave the browser (FR-035): a test asserts the request body has only the contract's fields. Same honeypot and error handling as US-035.

**Dependencies**
- US-041 merged; US-045's endpoint changes merged first (the e2e runs against the real endpoint in memory mode).

---

## US-045 — Calculator leads v1.3 and the GoHighLevel contacts
- Priority: High
- Story Points: 5
- Status: Proposed — Sprint 005 candidate (phase 2d)
- Related Requirements: FR-035, FR-039, FR-041, BR-012, NFR-006, NFR-007
- Related contract: [`LEAD_API_CONTRACT.md`](LEAD_API_CONTRACT.md) v1.3 §6, §9, §11, §12
- Related ADR: ADR-007, ADR-008

**User Story**

As Gaby,
I want every lead the site saves to appear in my GoHighLevel account with its tag and result,
so that my emails and my follow-up start on their own.

**Acceptance Criteria**
1. `/api/save-calculator-lead` validates the v1.3 request (§11.2, §11.3): the six zone codes and their boundaries, `months` with up to two decimals, `currency`, `concentration_alert`; and writes the v1.3 row (§11.5, the new columns at the end).
2. Both endpoints send the contact to GoHighLevel as contract §12 says (tags, custom fields, the consent tag only with `marketing_consent`, `meses` derived with Gaby's display rule), in the order of §12 (append the row as `pending`, send, update the cell), and record `crm_status` (`pending`, `sent`, `failed`, `off`); a failed append returns `503` and sends nothing; `/api/save-lead`'s request and responses are unchanged.
3. A GoHighLevel timeout or error never changes the response (`201`, the lead saved) and is logged without personal data; the token never appears in logs, responses or the repository.
4. A resend command sends the `failed` and `pending` rows again and updates their `crm_status`; an older row with a later row of the same email in the same tab, whose `crm_status` is `sent`, `failed` or `pending`, is marked `superseded` and not sent (a later `off` row does not count; contract v1.3.1 §12); the runbook documents it.
5. pytest covers every case of §11.6 and §12 with a fake GoHighLevel client; no test calls the real API. The PR states what was verified against GoHighLevel's API documentation (endpoint, version header, payload).
6. Configuration: the `GHL_*` variables of §9 in `api/.env.example` without values; a GoHighLevel section in the runbooks (the token with contacts access only, the location id, the custom fields, the tags, the workflows of US-038 and US-039, which send calculator leads email only, never automated SMS or WhatsApp (BR-012), the resend command, rotating the token).
7. The privacy notice (`privacy.p4`, and `privacy.p2`/`p3` where they describe the calculator's data) names GoHighLevel as the processor of the contacts and the emails, from `CONTENT_PHASE_2D.md`, and `PRIVACY_NOTICE_VERSION` is bumped in the same PR.
8. The security baseline's third parties list GoHighLevel's API and the token as a secret (a proposed change for its owner if it is not this story's).

**Security**
- ASVS: the outbound request uses HTTPS with certificate checks; the token lives only in the server's environment (NFR-007); only the fields of §12 leave the server (data minimization).

**Dependencies**
- Contract v1.3 (the phase 2d docs PR). Gaby's token, location id and custom field ids for the end-to-end check (not for merging: tests use the fake client).

---

## US-046 — Withdraw the resource library
- Priority: Medium
- Story Points: 3
- Status: Proposed — Sprint 005 candidate (phase 2d). Withdraws what US-024 built; US-025 is withdrawn with it
- Related Requirements: FR-023 to FR-025 (withdrawn), FR-010, FR-017
- Source: brief §1 point 1

**User Story**

As a visitor,
I want every link on the site to lead somewhere real,
so that I don't land on a library that no longer exists.

**Acceptance Criteria**
1. The resources page, its route (`resources`), its components (resource card, filters), its data (`src/data/resources.ts`) and their tests are removed; `CONTENT.md` §7 and the keys only it used are removed in the same PR.
2. No page links to the library: the header (US-041), My story's link now leads to the calculator, and the not-ready thank-you screen offers the blue `thanks.not_ready.more` button to the calculator instead of the mini-course card (`UX_UI_DIRECTION.md` §6.4, copy from `CONTENT_PHASE_2D.md`).
3. The build has no page at `/es/recursos/` or `/en/resources/`, and an e2e test checks that no internal link on any page points there.
4. `npm run build`, the unit tests and the full e2e suite pass with the library gone.

**Security**
- Removes code; no new data or third party.

**Dependencies**
- US-041 merged (the header). Can run in parallel with US-042 to US-045 where files do not overlap (the sprint plan's ownership map).

---

## US-047 — Demo environment for Gaby's functional test
- Priority: High
- Story Points: 5
- Status: Planned — Sprint 006 ([`SPRINT_006.md`](../sprints/SPRINT_006.md))
- Related Requirements: FR-030 (the preview stays demonstration-only), FR-034 to FR-041, NFR-007
- Related ADR: [ADR-009](../decisions/ADR-009_DEMO_ENVIRONMENT.md); ADR-001, ADR-005, ADR-006, ADR-008
- Source: the human owner, 2026-11-24 (Gaby decides on gabykelly.com only after seeing the funnel work)

**User Story**

As Gaby,
I want to use the real site, privately, before it replaces my GoHighLevel funnel,
so that I can see my leads arrive and my calendar take a booking, and decide.

**Acceptance Criteria**
1. `docs/runbooks/DEPLOYMENT.md` has a demo section for `gabydemo.digitalstrike-solutions.com` (ADR-009):
   - the cPanel subdomain and its own document root, separate from the owner's site;
   - the Python app in its own application root, mounted at `/api` on the subdomain only;
   - the build values: `PUBLIC_PREVIEW` unset, `PUBLIC_SCHEDULER_URL` set to Gaby's calendar, base path `/`;
   - the deploy-time `.htaccess`: basic authentication over everything, `/api` included; `X-Robots-Tag: noindex, nofollow`; HTTPS forced;
   - the environment: a test Google Sheet, `GHL_SYNC=on`, the token and key handled as `DEPLOYMENT.md` §6 says;
   - how to record which `main` commit is deployed.
2. A smoke check in that section, with expected answers:
   - without the password: `401` for `/`, a page and both `/api` endpoints;
   - with the password: the pages load, and an empty `POST` to each endpoint gets its validation error;
   - the `X-Robots-Tag` header is present.
3. A cleanup list in `docs/runbooks/GOHIGHLEVEL.md`: test contacts deleted from Gaby's GoHighLevel, test bookings cancelled, the test sheet's rows cleared or archived.
4. A Spanish test checklist for Gaby, `docs/runbooks/DEMO_GABY_CHECKLIST_ES.md`, with what to do and what she should see:
   - the calculator in USD and colones, with both consents and with only the required one;
   - an application with a qualified answer and a not-ready answer;
   - a booking;
   - the contact and its tags in GoHighLevel;
   - the emails, if her workflows are active.
5. A workflow started by hand, `.github/workflows/demo-build.yml` (`workflow_dispatch`, `main` only), runs the same checks as CI. It then uploads two artifacts: the static site built with the demo values, and `api/` without tests. It never contains a secret, and no step deploys anywhere.
6. The security baseline records the demo environment, as a proposed change for its owner if this is not this story's:
   - its third parties: the owner's host, Google, GoHighLevel;
   - test data only;
   - the password and the secrets outside Git.
7. Verified by the owner, not by agents, as ADR-009 → Validation lists:
   - a calculator lead and an application reach the test sheet and Gaby's GoHighLevel (`crm_status` = `sent`);
   - one booking is made and then cancelled;
   - the `401` and `noindex` checks pass.
   The results are recorded in the sprint's close-out.

**Security**
- No secret in Git, in a workflow, in an artifact or in chat; the token has contacts access only (`GOHIGHLEVEL.md`).
- The demo is private (basic authentication over the whole subdomain, `/api` included) and carries test data only.
- Agents never log into the owner's cPanel or Gaby's GoHighLevel, and never call the live APIs (Sprint 005 entry gate 13).

**Dependencies**
- ADR-009 accepted (the docs PR that adds this story).
- Gaby's GoHighLevel set-up: a token with contacts access only, the location id, the custom fields and tags of contract §12.
- The owner's cPanel account and a test Google Sheet with its service account (`GOOGLE_SHEETS_SETUP.md`).
