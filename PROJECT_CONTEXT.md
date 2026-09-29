# Project Context

## Project
- Name: Gabriela Kelly — Financial Health One-Page Pilot
- Project key: `GK` (branches `GK-<NNN>-<slug>`, see `AGENTS.md`)
- Repository: https://github.com/Raulc87/gaby-main-page
- Starter Kit: https://github.com/Raulc87/sdd_starter_kit
- Status: Sprint 002 active (go-ahead 2026-09-28); Sprint 001 closed 2026-09-28
- Product owner / final reviewer: Human project owner

## Active documentation
- Project spec: `docs/specs/PROJECT_SPEC.md` (v0.4)
- User stories: `docs/specs/USER_STORIES.md`
- Integration contracts: `docs/specs/LEAD_API_CONTRACT.md` (v1.1, locked for Sprint 002)
- Feature specs: Not required for the current simple scope
- Architecture spec: Not required for the current simple scope (covered by ADRs)
- UX/UI direction: `docs/ux/UX_UI_DIRECTION.md` (v0.6)
- Tech stack: `TECH_STACK.md` (v0.2)
- ADRs: `docs/decisions/` — ADR-001 backend hosting, ADR-002 Google Sheets access, ADR-003 i18n routing, ADR-004 spam protection
- Implementation plan: `docs/plans/IMPLEMENTATION_PLAN.md` (v0.4)
- Active sprint plan: `docs/sprints/SPRINT_002.md` (active; agent prompts in `docs/sprints/SPRINT_002_AGENT_PROMPTS.md`)
- Previous sprint: `docs/sprints/SPRINT_001.md` (closed 2026-09-28, with close-out and retrospective)
- Readiness checklist: `docs/checklists/SPRINT_READINESS_CHECKLIST.md`

## Current sprint
- Sprint: Sprint 002
- Goal: Make the site ready for public launch on GoDaddy (visual identity, final content and privacy notice, spam protection, storage-failure logging, deployment)
- Start: 2026-09-29
- End: 2026-10-07
- Duration: 7 business days, excluding Saturday and Sunday
- Deliverable: Site deployed on GoDaddy over HTTPS, password-protected and passing the smoke test; made public only after the go-live gate in the sprint plan
- Status: ACTIVE

## Agent allocation
- Implementation Agent 1: visual identity (tokens, fonts, sections), final content, testimonial cards
- Implementation Agent 2: form styling, honeypot and `429` handling (client), privacy notice, e2e
- Implementation Agent 3: spam protection (server), storage-failure logging, CI, runbooks (local and deployment)
- Review-only Agent: PR review only, no implementation
- Conflict resolution: human owner together with the owning agent, when conflicts occur

## Important constraints
- Hosting: GoDaddy with cPanel (frontend static; Python app at `/api`, same origin)
- Prefer simple hosting-compatible technologies
- No AWS requirement
- Maximum 3 implementation agents in parallel
- Human reviewer is final approver
- Content is provisional until validated with Gabriela
- Languages: Spanish and English (browser-detected, toggle at top)
- Code, identifiers, and data fields in English, `snake_case`
- Personal data governed by Costa Rica Ley N.° 8968 (consent required)
- Production: Gabriela's Google account and sheet (set up at deploy); development: the project owner's sheet or memory mode
- Spam protection: honeypot + per-IP rate limit, no CAPTCHA for now (ADR-004)

## Open questions
- Final brand colors: resolved 2026-09-25 (UX_UI_DIRECTION.md section 2.1, Proposal A)
- Logo file (SVG or transparent PNG) and final photo of Gabriela (US-017, by 2026-10-02)
- Final photography
- Final credentials/testimonials, possibly videos; placeholders stay until then (US-017)
- Final domain and SSL (US-014, human owner, this week)
- Final Calendly URL (go-live gate)
- Final contact email (currently `gkelly@poliartcr.com`)
- Legal review of the privacy notice and data-retention period (US-018, by 2026-10-02)
- Python version in the actual GoDaddy account (documented up to 3.11; confirm during US-014, ADR-001)
