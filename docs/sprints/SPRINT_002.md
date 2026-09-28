# SPRINT 002 — PLANNED

## Metadata
- Status: PLANNED — waiting for the human owner's go-ahead
- Duration: 7 business days
- Saturdays and Sundays excluded
- Start: the first business day after the go-ahead (planned: 2026-09-29, Tuesday)
- End: the 7th business day from the start — Sprint Review (planned: 2026-10-07, Wednesday; moves with the start)
- Final reviewer: Human project owner

## Sprint Goal

Make the site ready for public launch on GoDaddy: the approved visual identity, Gabriela's final content and privacy notice, spam protection, diagnosable storage failures, and a tested deployment.

## Required Deliverable

The site running on GoDaddy cPanel (static site at the root, Python app at `/api`, HTTPS), storing leads in the production sheet in Gabriela's Google account, and passing the post-deploy smoke test. Until the go-live gate below passes, the whole site (including `/api`) stays password-protected, so it is not publicly reachable and cannot collect real leads.

## Entry Gates

Readiness checklist run on 2026-09-28 (`docs/checklists/SPRINT_READINESS_CHECKLIST.md`).

| # | Gate | Status |
|---|---|---|
| 1 | Sprint 001 closed (`SPRINT_001.md` close-out) | Done — 2026-09-28 |
| 2 | Documents consistent: spec v0.4, stories US-013 to US-018, UX direction v0.4, contract v1.1, ADR-001 and ADR-004 | Done in this planning PR |
| 3 | Shared interface locked: `LEAD_API_CONTRACT.md` v1.1 (honeypot, `429`) | Done in this planning PR |
| 4 | Spam protection decided (ADR-004: honeypot + rate limit, no CAPTCHA yet) | Done — 2026-09-28 |
| 5 | Hosting runtime: GoDaddy documents Python 3.11 in the Python Selector (ADR-001); account check during US-014 | Done (documentation) |
| 6 | Brand assets and content have a dated owner (checklist 5.1, blocking for a go-live sprint): human owner supplies the provisional photo by 2026-09-29, and Gabriela's content, final photo and logo by 2026-10-02 | Owner and dates set |
| 7 | Privacy notice legal text and retention period: human owner by 2026-10-02 | Owner and date set |
| 8 | Domain and SSL: human owner, this week; not needed until US-014's deploy step | Owner set |
| 9 | Production Google account (Gabriela's): human owner sets it up at deploy; development keeps the owner's sheet | Owner set |
| 10 | `main` protected in GitHub (checklist 7.1, non-blocking) | To confirm by the human owner |
| 11 | Final go-ahead from the human owner | Pending |

## Planned Stories

| Story | Points | Owner | Dependencies | Branch | Status |
|---|---:|---|---|---|---|
| US-015 (tokens, fonts, header, footer) | — | Agent 1 | — | `GK-015-theme-tokens` | Planned |
| US-015 (sections, hero trust row) | 5 | Agent 1 | `GK-015-theme-tokens`; provisional photo | `GK-015-visual-identity` | Planned |
| US-015 (form, thank-you, dialog styles) | — | Agent 2 | `GK-015-theme-tokens` | `GK-015-form-style` | Planned |
| US-013 (server) | 3 | Agent 3 | Contract v1.1 | `GK-013-spam-protection` | Planned |
| US-013 (client) | — | Agent 2 | Contract v1.1 | `GK-013-honeypot-client` | Planned |
| US-016 | 2 | Agent 3 | — | `GK-016-storage-logging` | Planned |
| US-017 (proof cards: text and video) | 3 | Agent 1 | `GK-015-visual-identity` | `GK-017-testimonial-cards` | Planned |
| US-017 (Gabriela's content) | — | Agent 1 | Content by 2026-10-02, recorded in the UX doc | `GK-017-final-content` | Planned |
| US-018 | 2 | Agent 2 | Legal text by 2026-10-02, recorded in the UX doc | `GK-018-privacy-notice` | Planned |
| US-018 (version in `api/.env.example` and `DEPLOYMENT.md`) | — | Agent 3 | Same as above | `GK-018-privacy-version` | Planned |
| US-014 (runbook) | 3 | Agent 3 | US-013, US-016 | `GK-014-deployment-runbook` | Planned |
| US-014 (deploy and smoke test) | — | Human owner | Runbook, domain, SSL, production sheet | — | Planned |
| Runbook refresh (chore) | — | Agent 3 | — | `GK-CHORE-runbook-refresh` | Planned |

Total planned points: 18. US-009 (carried over from Sprint 001) is completed inside US-017 and not counted twice.

The chore fixes `docs/runbooks/LOCAL_DEVELOPMENT.md`: the outdated section 7 note that `npm run test:e2e` finds no tests, and per-OS setup notes (Windows: Python install, PowerShell execution policy, OneDrive locks; macOS: Homebrew permissions or `uv`, port 5000 taken by AirPlay Receiver).

## Go-live Gate

The password protection is removed (the site goes public) and the site is announced only when all of these are true:
1. US-013, US-016 and US-018 are merged.
2. US-017 content is approved by Gabriela and merged; the human owner has decided which pending-validation markers, if any, remain (the proof placeholders stay for now).
3. The final Calendly URL and contact email are set in the production build.
4. The US-014 smoke test passes on the live HTTPS domain.

## Parallel Workstreams

### Agent 1 — Visual identity and content
- `GK-015-theme-tokens` first (small, merged fast): tokens from UX_UI_DIRECTION.md section 2.1 as Tailwind `@theme` tokens in `src/styles/global.css`, Crimson Pro and IBM Plex Sans (Inter removed), Playfair wordmark, header and footer.
- Section restyle per section 2.1, hero with portrait and trust row, responsive at 360/390/768/1280 px.
- Proof section with text and video testimonial cards (placeholders for now); then Gabriela's approved content.

### Agent 2 — Form, spam protection (client), privacy notice
- Form, thank-you, scheduler and privacy dialog styled per section 2.1 once the tokens are merged.
- Hidden `website` field, `429` message, tests; e2e for honeypot and `429` once Agent 3's server change is merged (route mocking before that).
- Final privacy notice once the reviewed text is recorded in the UX doc.
- Keeps the e2e suite green through the restyle (owns `tests/e2e/**`).

### Agent 3 — Backend, logging, deployment runbook
- Honeypot and rate limit in the Flask app per contract v1.1; `.env.example` updates; CI with the limit disabled.
- Storage-failure and startup logging; production default storage `google_sheets` (US-016).
- `docs/runbooks/DEPLOYMENT.md` and the local-development runbook refresh.

## File Ownership Map

An agent edits only files it owns. If it needs a change in another agent's file, it asks that agent (or the human owner) instead of editing it.

| Path | Owner |
|---|---|
| `package.json`, lockfile, `astro.config.mjs`, Tailwind/ESLint/TS/Vitest/Playwright config | Agent 1 (other agents may add their own dependencies) |
| `src/styles/**`, `src/layouts/**`, `src/pages/**`, `src/components/sections/**`, `src/i18n/index.ts`, `src/i18n/{es,en}/content.ts`, `public/**` | Agent 1 |
| `src/components/lead/**`, `src/lib/lead/**`, `src/i18n/{es,en}/form.ts`, `tests/e2e/**` | Agent 2 |
| `tests/unit/**` | The owner of the code under test |
| `api/**`, `.github/workflows/**`, `.env.example`, `docs/runbooks/**` | Agent 3 |
| `docs/specs/**`, `docs/ux/**`, `docs/plans/**`, `docs/sprints/**`, `docs/decisions/**`, `AGENTS.md`, `PROJECT_CONTEXT.md`, `README.md` | Human owner (agents propose changes via PR per change management) |

Content changes (US-017, US-018) follow change management: the human owner records the approved text in `UX_UI_DIRECTION.md` first (a `GK-DOCS-...` PR), then the agent applies it.

## Integration Contract

Locked: `docs/specs/LEAD_API_CONTRACT.md` v1.1. No parallel work may change it; changes follow `AGENTS.md` change management.

## Merge / Integration Order

1. `GK-015-theme-tokens` (Agent 1), `GK-013-spam-protection` (Agent 3) and `GK-013-honeypot-client` (Agent 2), in any order.
2. `GK-015-visual-identity` (Agent 1) and `GK-015-form-style` (Agent 2), after the tokens; `GK-016-storage-logging` and `GK-CHORE-runbook-refresh` (Agent 3).
3. `GK-017-testimonial-cards` (Agent 1); `GK-014-deployment-runbook` (Agent 3), after US-013 and US-016.
4. Content: the human owner's `GK-DOCS-...` PR with Gabriela's copy and the privacy text, then `GK-017-final-content` (Agent 1), `GK-018-privacy-notice` (Agent 2) and `GK-018-privacy-version` (Agent 3).
5. Human owner: deploy with the runbook behind password protection, smoke test, then the go-live gate.

## Conflict Resolution

- Merge conflicts are resolved when found, by the human owner together with the agent that owns the conflicting file.
- An agent must not rewrite another agent's files to resolve a conflict.
- If a conflict reveals a contract or requirement gap, stop and apply change management (spec first).

## Review Model

- Implementation agents create focused PRs referencing story IDs and acceptance criteria.
- The review-only agent reviews each PR in its own session and never changes code (`AGENTS.md`).
- The human owner is the final reviewer and the only one who merges.

## Integration Safety

Parallel work is not complete until:
- branches are merged
- CI is green
- the critical flow is rerun locally in both languages at 390 px and desktop, including honeypot and `429`
- previously accepted behavior still works

## Sprint Definition of Done

- Selected stories satisfy their acceptance criteria.
- GitHub Actions green on `main`.
- The site is deployed on GoDaddy and the smoke test passes.
- No known critical regression.
- Human reviewer approves.

## Risks

- Gabriela's content or the legal text arrives after 2026-10-02: US-017 content and US-018 move to Sprint 003 and go-live waits; everything else (look, spam protection, logging, deployment) still ships and can be deployed behind password protection.
- Domain or SSL not ready: the runbook is still written and reviewed; the deploy step waits.
- Shared-hosting limits (Passenger processes, Python version): ADR-001 fallback (Cloud Run) stays available.
- The restyle can break e2e selectors: Agent 1 keeps IDs, anchors, `data-testid` attributes and roles; the required e2e CI job runs on every PR, and if a selector must change, Agent 1 asks Agent 2 to update `tests/e2e/**`.

## Important

Do not start until the human owner gives the go-ahead (entry gate 11).

Agent kickoff prompts and model assignments: `docs/sprints/SPRINT_002_AGENT_PROMPTS.md`.
