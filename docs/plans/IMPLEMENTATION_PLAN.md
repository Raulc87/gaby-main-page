# IMPLEMENTATION_PLAN — Gabriela Kelly Pilot

## Metadata
- Version: 0.3
- Status: Approved for Sprint 001
- Related spec: `docs/specs/PROJECT_SPEC.md` (v0.3)
- Related stories: `docs/specs/USER_STORIES.md`
- Integration contract: `docs/specs/LEAD_API_CONTRACT.md` (v1.0, locked)
- Tech stack: `TECH_STACK.md` (v0.2)
- ADRs: ADR-001, ADR-002, ADR-003

## 1. Purpose

Build a semi-functional, locally runnable, bilingual one-page prototype that can be reviewed with Gabriela and that validates the complete lead-generation flow.

## 2. Technical Scope

- Responsive one-page frontend in Spanish and English with a language toggle
- Proposed marketing content (gender-neutral, both languages)
- Lead form with full client-side validation and privacy consent
- Pre-screening question
- Python endpoint `POST /api/save-lead`
- Google Sheets persistence (plus in-memory adapter for dev/tests)
- Thank-you message + inline Calendly with mailto fallback
- Local development setup and GitHub Actions CI
- Automated checks for critical paths

Not in scope for Sprint 001: spam protection (US-013), production deployment (US-014).

## 3. Traceability

| Requirement | Story | Workstream |
|---|---|---|
| FR-001, BR-005 | US-001 | Agent 1 |
| FR-002, FR-004 | US-002 | Agent 1 |
| FR-003, FR-005 | US-003 | Agent 1 |
| FR-012 | US-010 | Agent 1 |
| FR-006, FR-007, NFR-005, NFR-006 | US-004 | Agent 2 |
| FR-008, BR-002 | US-005 | Agent 2 |
| FR-010, FR-014, FR-015 | US-007 | Agent 2 |
| FR-013, BR-006 | US-011 | Agent 2 (form, notice) + Agent 3 (server validation, storage) |
| FR-009, FR-016, NFR-007 | US-006 | Agent 3 |
| NFR-004 | US-012 | Agent 3 |
| FR-011, NFR-001 | US-008 | Agent 1 (sections) + Agent 2 (form, scheduler) |
| BR-004 | US-009 | Sprint Review |
| NFR-008 | US-013 | Backlog |
| Constraints | US-014 | Backlog |

## 4. Current State

No implementation yet. Documentation, contract, and ADRs are approved.

## 5. Target State

A demonstrable, locally runnable end-to-end prototype that:
1. presents the offer in Spanish or English (auto-detected, toggleable)
2. captures and validates lead data, with privacy consent
3. persists the lead to Google Sheets (or memory in dev)
4. thanks the visitor and shows inline Calendly (or mailto fallback)
5. works on mobile
6. is checked by CI on every PR
7. is suitable for content/design review with Gabriela

## 6. Technical Approach

- Frontend: Astro (static) + TypeScript + Tailwind CSS, i18n routes `/es/` and `/en/` (ADR-003).
- Backend: Flask endpoint, Passenger-compatible, mounted at `/api` (ADR-001).
- Persistence: Google Sheets via service account (ADR-002); `memory` adapter for dev/tests.
- Scheduling: Calendly inline embed, loaded only after a `201`.

## 7. Components and Directory Layout

```
astro.config.mjs, package.json, tailwind config, eslint config   (Agent 1)
src/layouts/                                                      (Agent 1)
src/pages/index.astro        language redirect                    (Agent 1)
src/pages/es/index.astro     page composition (ES)                (Agent 1)
src/pages/en/index.astro     page composition (EN)                (Agent 1)
src/components/sections/     Hero, Recognition, TransformationRoadmap,
                             Guide, SocialProof, Offer, ClosingCTA,
                             Header + LanguageToggle, PendingBadge (Agent 1)
src/i18n/index.ts            helpers, language detection          (Agent 1)
src/i18n/{es,en}/content.ts  section copy                         (Agent 1)
src/components/lead/         LeadForm, ConsentField, PrivacyNotice,
                             ThankYou, Scheduling (Calendly)      (Agent 2)
src/lib/lead/                contract types, validation, api client (Agent 2)
src/i18n/{es,en}/form.ts     form, errors, consent, notice,
                             thank-you, fallback copy             (Agent 2)
tests/unit/                  Vitest (per owner's area)            (Agents 1, 2)
tests/e2e/                   Playwright                           (Agent 2)
api/                         Flask app, passenger_wsgi.py, validation,
                             storage adapters, requirements.txt   (Agent 3)
api/tests/                   pytest                               (Agent 3)
.github/workflows/           CI                                   (Agent 3)
.env.example, api/.env.example                                    (Agent 3)
docs/runbooks/               LOCAL_DEVELOPMENT.md, Google Sheets setup (Agent 3)
```

## 8. Data Contract

Locked in `docs/specs/LEAD_API_CONTRACT.md` v1.0. Summary:

- `POST /api/save-lead`, JSON in/out, same origin.
- Request: `name`, `email`, `phone`, `screening_answer`, `language`, `consent`.
- Server-generated: `submitted_at` (`DD/MM/YYYY HH:mm:ss`, `America/Costa_Rica`), `privacy_notice_version`, `status` = `started`.
- Response: `success`, `message`, `error_code`, `field_errors`.
- `201` = saved; `400/404/405/413/415/422/500/503` as defined; `429` reserved.

Client and server validation must implement the same rules; both test suites use the contract's examples.

## 9. Implementation Steps

Phase 0 — Foundation (day 1, before parallel work)
1. Agent 1: frontend scaffold PR — Astro/TS/Tailwind, ESLint, Vitest, Playwright config, i18n routes and dictionary skeletons (all four files), `/es/` and `/en/` pages composing **stub** components for every section and for `LeadForm`, `/api` dev proxy.
2. Agent 3 (in parallel): backend scaffold — Flask app, `/save-lead` returning contract-shaped responses, `memory` storage, pytest setup, backend CI job.

Phase 1 — Parallel implementation (after the frontend scaffold is merged)
3. Agent 1: sections and copy (US-001/002/003), language detection + toggle (US-010), responsive layout (US-008 sections).
4. Agent 2: form fields, validation module, consent + privacy notice, API client, loading/error states (US-004/005/011), thank-you + Calendly + fallback (US-007). Uses Playwright route mocking for the endpoint until integration.
5. Agent 3: full validation, Google Sheets adapter, error mapping, `.env.example`, runbooks, frontend and e2e CI jobs (US-006, US-011 server side, US-012).

Phase 2 — Integration
6. Agent 2: integration PR — Playwright e2e against the real Flask server in `memory` mode, in both languages and mobile viewport.
7. Human owner: local run with real Google Sheets credentials and Calendly URL (when available).
8. Full regression; prepare prototype for Gabriela review (US-009).

## 10. Parallelization Plan

See `docs/sprints/SPRINT_001.md` for the file ownership map, merge order, and conflict rules.

- Agent 1 — UI, content, i18n: US-001, US-002, US-003, US-010, US-008 (sections)
- Agent 2 — Form, consent, post-submit UI, Calendly, e2e/integration: US-004, US-005, US-007, US-011 (client), US-008 (form)
- Agent 3 — Backend, Sheets, local environment, CI: US-006, US-011 (server), US-012

Shared contract: `LEAD_API_CONTRACT.md` (locked). Shared frontend conventions: set by the Phase 0 scaffold (component stubs, dictionary files, Tailwind tokens).

## 11. Merge / Integration Guidance

1. Frontend scaffold (Agent 1) and backend scaffold (Agent 3) merge first.
2. Phase 1 PRs merge in any order; each must keep CI green.
3. Integration PR (Agent 2) merges last.
4. Run the full regression after each merge that affects the critical flow.
5. Merge conflicts are resolved by the human owner together with the agent that owns the conflicting file, when they occur.

## 12. Testing Strategy

- Build succeeds; ESLint and `astro check` pass.
- Vitest: validation rules (every contract rule, valid + invalid), language detection, API client response handling.
- pytest: validation, every status code except `429`, storage adapter, storage failure → `503`, timestamp format/timezone, `status` = `started`.
- Playwright:
  - landing (`es-CR` → `/es/`, `en-US` → `/en/`) → toggle → form → `201` → thank-you → Calendly container visible
  - validation errors shown in the active language
  - failed save (`503`) → no success, no Calendly, data kept
  - Calendly unavailable → mailto fallback
  - 390 px viewport: no horizontal scroll
- Regression checks after merging parallel work.

## 13. Error Handling

- Invalid form: field-level localized feedback.
- Backend failure / network error: localized error, keep data, allow retry; never success.
- Google Sheets failure: `503`; normal success path stays locked.
- Calendly unavailable or not configured: mailto fallback.

## 14. Rollback

- Use Git commits/PRs as the primary rollback mechanism.
- Preserve last known good revision (green `main`).

## 15. Risks

- cPanel Python runtime limitations (ADR-001; fallback defined)
- Google authentication setup (account TBD)
- Calendly embed behavior on mobile
- Cross-agent merge conflicts (mitigated by ownership map and stubs)
- Provisional content changes after stakeholder review
- Sprint load increased to 43 points (bilingual, consent, local env/CI added)

## 16. Definition of Done

- Required user stories satisfy acceptance criteria.
- CI checks pass.
- Critical integration flow works locally in both languages.
- Mobile layout works.
- Review-only agent has reviewed relevant PRs.
- Human reviewer has approved.
- Prototype is ready for Gabriela review.
