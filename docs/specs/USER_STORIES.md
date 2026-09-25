# USER_STORIES

Backlog source until Jira is available.

Common references:
- Spec: `docs/specs/PROJECT_SPEC.md`
- Lead API contract: `docs/specs/LEAD_API_CONTRACT.md`
- Copy (ES/EN): `docs/ux/UX_UI_DIRECTION.md`

"Common mobile widths" in any acceptance criterion means viewports of 360 px, 390 px, and 768 px wide. "Both languages" means the Spanish (`/es/`) and English (`/en/`) versions of the page.

---

## US-001 — Communicate the value proposition
- Priority: High
- Story Points: 3
- Status: Ready
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
- Status: Ready
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
- Status: Ready
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
- Status: Ready
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
- Status: Ready
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
5. The language toggle remains visible and usable on mobile.

---

## US-009 — Stakeholder content review
- Priority: High
- Story Points: 3
- Status: Ready (verified at Sprint Review)
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
- Status: Ready
- Related Requirements: FR-012, BR-005, BR-007
- Related ADR: ADR-003

**User Story**

As a visitor,
I want the page in my language, with the option to switch,
so that I can understand the offer comfortably.

**Acceptance Criteria**
1. Spanish content is served at `/es/` and English content at `/en/`, each with the correct `<html lang>`.
2. On `/`, a visitor with no saved choice is sent to `/es/` when the browser's first preferred language starts with `es` (e.g. `es`, `es-CR`, `es-MX`), and to `/en/` otherwise.
3. A language toggle (`ES | EN`) is visible at the top of the page on all widths and switches to the same section in the other language.
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
- Status: Backlog — required before public deployment (not in Sprint 001)
- Related Requirements: NFR-008

**User Story**

As the business owner,
I want the public form protected against automated submissions,
so that the lead sheet stays clean and the endpoint cannot be abused.

**Acceptance Criteria**
1. A hidden honeypot field silently discards bot submissions.
2. Requests are rate-limited per IP; excess requests receive `429` / `rate_limited`.
3. The need for a CAPTCHA (e.g. Cloudflare Turnstile or reCAPTCHA) is evaluated and recorded in an ADR.
4. The contract is updated (new version) before implementation.

---

## US-014 — Deploy to GoDaddy cPanel
- Priority: High
- Story Points: 3
- Status: Backlog (not in Sprint 001)
- Related ADR: ADR-001

**User Story**

As the business owner,
I want the site published on my GoDaddy hosting,
so that real visitors can use it.

**Acceptance Criteria**
1. The Python runtime available in "Setup Python App" is confirmed and recorded in ADR-001.
2. The static build is served from the site root and the Python app at `/api` on the same domain.
3. Credentials are stored outside the web root.
4. US-013 is done before the page is made public.
5. A deployment runbook exists in `docs/runbooks/`.

---

## US-015 — Apply the approved visual identity
- Priority: High
- Story Points: 5
- Status: Proposed — Sprint 002 candidate
- Related Requirements: NFR-001, NFR-003, BR-004
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
6. Text meets WCAG AA contrast; gold is never used as text on white (use `gold-ink`).
7. Existing unit and e2e tests stay green; e2e selectors are not broken by the restyle.

**Dependencies**
- Final logo file and photo from Gabriela (the provisional photo is acceptable until then).

