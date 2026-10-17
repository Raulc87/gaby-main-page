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
- Status: Ready; phase 2: AC1 applies only to the qualified screening answers (US-023 AC4); the other answers get the not-ready screen (US-023 AC5)
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
6. Until the go-live gate in `SPRINT_002.md` passes, the whole site, including `/api`, is password-protected (cPanel Directory Privacy), so it cannot collect real leads under a draft notice; the runbook checks that `/` and `POST /api/save-lead` return `401` without credentials. Going live means removing the protection, only after US-013, US-016, and US-018 are done and the US-017 content is approved.

---

## US-015 — Apply the approved visual identity
- Priority: High
- Story Points: 5
- Status: Done — Sprint 002 (#29, #32, #34, #36, #42, #43); phase 2: the Proposal A look is replaced by the official brand (US-019)
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

---

## US-017 — Final content from Gabriela
- Priority: High
- Story Points: 3
- Status: Backlog since the Sprint 002 close-out (2026-10-16). Proof cards merged (#33); the remaining content arrives later (see the phase 2 note)
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
- Status: Done — Sprint 003 (#61)
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
- Status: Done — Sprint 003 (#57)
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
5. After `201` with `no_capacity_now` or `exploring`: a warm thank-you screen without Calendly, offering the featured free mini-course (shown as pending until its file exists, US-024 AC4; after US-025, requested by email); Calendly is not loaded.
6. Unit tests cover the routing for all four codes; e2e covers one qualified and one not-ready answer in both languages.

**Dependencies**
- `CONTENT.md` (VIP page, thank-you screens) and `UX_UI_DIRECTION.md` v1.0 merged; US-019 and US-020.

---

## US-024 — Free resource library
- Priority: High
- Story Points: 5
- Status: Done — Sprint 003 (#60)
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
- Status: Proposed — phase 2b; needs a contract and an ADR (sending mechanism) before implementation
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
- Status: Done — Sprint 003 (#55: workflow and `RELEASE.md`; #58: preview mode of the form)
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

## US-028 — Método Polaris page (phase 2b)
- Priority: Medium
- Story Points: 3
- Status: Proposed — phase 2b; waits on the official Método Polaris steps (Gaby)
- Related Requirements: FR-017, FR-018, BR-009

**User Story**

As a visitor,
I want a page that explains the Método Polaris in full,
so that I understand how Gaby works before applying.

**Acceptance Criteria**
1. A Método Polaris page exists in both languages at the path in `UX_UI_DIRECTION.md`, with the official steps from `CONTENT.md`.
2. The header navigation item and the Home section's link lead to the page; the Home keeps a short summary.
3. The page ends with a VIP band; existing tests stay green and e2e covers the navigation in both languages.
