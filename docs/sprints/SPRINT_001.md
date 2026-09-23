# SPRINT 001 — Ready / NOT STARTED

## Metadata
- Status: READY — waiting for the human owner's go-ahead
- Duration: 7 business days
- Saturdays and Sundays excluded
- Start: TBD (set at go-ahead)
- End: TBD (start + 7 business days)
- Final reviewer: Human project owner

## Sprint Goal

Deliver the first functional, locally runnable, bilingual end-to-end prototype of the Gabriela Kelly one-page lead-generation site.

## Required Deliverable

A demonstrable prototype, running locally, that:
- communicates the proposed offer in Spanish and English (auto-detected, with toggle)
- includes the proposed UX/content structure
- captures lead information with privacy consent
- stores the lead in Google Sheets (memory mode when credentials are not yet available)
- thanks the visitor and enables inline Calendly scheduling after successful storage, with a mailto fallback
- works on mobile
- is checked by GitHub Actions CI

## Entry Gates

| # | Gate | Status |
|---|---|---|
| 1 | Starter Kit repository exists in GitHub (`Raulc87/sdd_starter_kit`) | Done |
| 2 | Pilot repository exists in GitHub (`Raulc87/gaby-main-page`) | Done |
| 3 | Repository structure and documentation validated (readiness checklist) | Done — 2026-09-23 |
| 4 | Agent bootstrap instructions validated (`AGENTS.md` paths resolve) | Done — 2026-09-23 |
| 5 | Lead API contract locked (`LEAD_API_CONTRACT.md` v1.0) | Done |
| 6 | Final go-ahead from the human owner | Pending |

## Planned Stories

| Story | Points | Owner | Dependencies | Branch | Status |
|---|---:|---|---|---|---|
| US-001 | 3 | Agent 1 | Frontend scaffold | `GK-001-hero` | Planned |
| US-002 | 3 | Agent 1 | Frontend scaffold | `GK-002-roadmap` | Planned |
| US-003 | 2 | Agent 1 | Frontend scaffold | `GK-003-guide-section` | Planned |
| US-010 | 5 | Agent 1 | Frontend scaffold | `GK-010-i18n-toggle` | Planned |
| US-004 | 5 | Agent 2 | Frontend scaffold, contract | `GK-004-lead-form` | Planned |
| US-005 | 3 | Agent 2 | Frontend scaffold, contract | `GK-005-pre-screening` | Planned |
| US-007 | 3 | Agent 2 | US-004 | `GK-007-calendly` | Planned |
| US-011 | 3 | Agent 2 (client) + Agent 3 (server) | Contract | `GK-011-privacy-consent` | Planned |
| US-006 | 5 | Agent 3 | Contract | `GK-006-google-sheets` | Planned |
| US-012 | 3 | Agent 3 | Scaffolds | `GK-012-local-env-ci` | Planned |
| US-008 | 5 | Agent 1 (sections) + Agent 2 (form, scheduler) | Sections, form | Within each story; fixes on `GK-008-<slug>` | Planned |
| US-009 | 3 | Sprint Review | All above | — | Planned |

Total planned points: 43

Not in this sprint: US-013 (spam protection), US-014 (GoDaddy deployment).

Foundation branches: `GK-010-frontend-scaffold` (Agent 1), `GK-006-backend-scaffold` (Agent 3). Integration branch: `GK-004-integration-e2e` (Agent 2). Naming rules: `AGENTS.md`.

## Parallel Workstreams

### Agent 1 — UI, content, i18n
- Phase 0: frontend scaffold PR (see Implementation Plan §9 step 1), including stub components for every section and for `LeadForm`
- header with `ES | EN` toggle, language detection on `/`
- hero, recognition, roadmap, guide, proof placeholders, offer, closing CTA — both languages
- pending-validation markers
- responsive layout of sections

### Agent 2 — Form, consent, post-submit, Calendly, integration
- fields, hints, validation module (contract rules)
- pre-screening options (codes + localized labels)
- consent checkbox + privacy notice dialog
- API client, loading/error states
- thank-you message + inline Calendly (pre-filled) + mailto fallback
- responsive form and scheduler
- integration PR and Playwright e2e suite

### Agent 3 — Backend, persistence, local environment, CI
- Phase 0: backend scaffold PR (Flask, memory storage, pytest, backend CI job)
- full server validation and status codes per contract
- Google Sheets adapter (service account), raw value writes, timestamp/timezone
- secure configuration, `.env.example` files
- `docs/runbooks/LOCAL_DEVELOPMENT.md` and Google Sheets setup guide
- frontend and e2e CI jobs (after the frontend scaffold is merged)

## File Ownership Map

An agent edits only files it owns. If it needs a change in another agent's file, it asks that agent (or the human owner) instead of editing it.

| Path | Owner |
|---|---|
| `package.json`, lockfile, `astro.config.mjs`, Tailwind/ESLint/TS/Vitest/Playwright config | Agent 1 (other agents may add their own dependencies; conflicts resolved per rules below) |
| `src/layouts/**`, `src/pages/**`, `src/components/sections/**`, `src/i18n/index.ts`, `src/i18n/{es,en}/content.ts`, `public/**` | Agent 1 |
| `src/components/lead/**`, `src/lib/lead/**`, `src/i18n/{es,en}/form.ts`, `tests/e2e/**` | Agent 2 (the `LeadForm` stub created by Agent 1 in Phase 0 is handed over to Agent 2) |
| `tests/unit/**` | The owner of the code under test |
| `api/**`, `.github/workflows/**`, `.env.example`, `docs/runbooks/**` | Agent 3 |
| `docs/specs/**`, `docs/plans/**`, `docs/sprints/**`, `docs/decisions/**`, `AGENTS.md`, `PROJECT_CONTEXT.md` | Human owner (agents propose changes via PR per change management) |

## Integration Contract

Locked: `docs/specs/LEAD_API_CONTRACT.md` v1.0 (endpoint, request, validation, status codes, response, sheet columns, configuration). No parallel work may change it; changes follow `AGENTS.md` change management.

## Merge / Integration Order

1. Frontend scaffold (Agent 1) and backend scaffold (Agent 3). Agent 2 starts when the frontend scaffold is merged.
2. Phase 1 PRs from all three agents, any order, each with green CI.
3. Integration PR (Agent 2): e2e against the real backend in memory mode.
4. Human owner: local run with real Google Sheets and Calendly (when available).

## Conflict Resolution

- Merge conflicts are resolved when found, by the human owner together with the agent that owns the conflicting file.
- An agent must not rewrite another agent's files to resolve a conflict.
- If a conflict reveals a contract or requirement gap, stop and apply change management (spec first).

## Review Model

- Implementation agents create focused PRs referencing story IDs and acceptance criteria.
- Review-only agent performs technical/spec review and does not implement.
- Human project owner is the final reviewer/approver.

## Integration Safety

Parallel work is not considered complete until:
- branches are merged
- CI is green
- critical end-to-end flow is rerun (both languages, mobile viewport)
- previously accepted behavior remains working

## Sprint Definition of Done

- Selected stories satisfy acceptance criteria.
- Required automated checks pass in GitHub Actions.
- End-to-end lead flow works locally.
- No known critical regression remains.
- Human reviewer approves.
- Prototype is ready to show Gabriela.

## Risks

- 43 points in 7 business days is higher than the original 32. If needed, move the pending-validation markers polish or the English copy review to Sprint 002; do not cut consent, validation, or the save-before-Calendly rule.
- Real Google credentials and Calendly URL may arrive late; memory mode and the fallback keep the demo working.

## Important

This sprint must remain **NOT STARTED** until gate 6 (final go-ahead) is given by the human owner.
