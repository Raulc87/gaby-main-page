# Project Context

## Project
- Name: Gabriela Kelly — Financial Health One-Page Pilot
- Project key: `GK` (branches `GK-<NNN>-<slug>`, see `AGENTS.md`)
- Repository: https://github.com/Raulc87/gaby-main-page
- Starter Kit: https://github.com/Raulc87/sdd_starter_kit
- Status: Ready for Sprint 001 (not started; waiting for go-ahead)
- Product owner / final reviewer: Human project owner

## Active documentation
- Project spec: `docs/specs/PROJECT_SPEC.md` (v0.3)
- User stories: `docs/specs/USER_STORIES.md`
- Integration contracts: `docs/specs/LEAD_API_CONTRACT.md` (v1.0, locked)
- Feature specs: Not required for the current simple scope
- Architecture spec: Not required for the current simple scope (covered by ADRs)
- UX/UI direction: `docs/ux/UX_UI_DIRECTION.md` (v0.2)
- Tech stack: `TECH_STACK.md` (v0.2)
- ADRs: `docs/decisions/` — ADR-001 backend hosting, ADR-002 Google Sheets access, ADR-003 i18n routing
- Implementation plan: `docs/plans/IMPLEMENTATION_PLAN.md` (v0.3)
- Active sprint plan: `docs/sprints/SPRINT_001.md` (ready, not started)
- Readiness checklist: `docs/checklists/SPRINT_READINESS_CHECKLIST.md`

## Current sprint
- Sprint: Sprint 001
- Goal: Build the first end-to-end, bilingual, locally runnable prototype
- Start: TBD (set at go-ahead)
- End: TBD
- Duration: 7 business days, excluding Saturday and Sunday
- Deliverable: Local one-page prototype (ES/EN) with lead capture, privacy consent, Google Sheets persistence, inline Calendly handoff, responsive layout, and CI
- Status: READY — NOT STARTED

## Agent allocation
- Implementation Agent 1: UI, content, i18n (language detection + toggle), frontend scaffold
- Implementation Agent 2: Lead form, validation, consent, thank-you + Calendly, integration/e2e
- Implementation Agent 3: Python endpoint, Google Sheets, local environment, CI
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
- Sprint 001 runs locally; deployment is US-014, spam protection US-013 (both before public launch)

## Open questions (non-blocking for Sprint 001)
- Final brand colors
- Final photography
- Final credentials/testimonials
- Google account that owns the lead sheet (project owner or Gabriela)
- Final Calendly URL
- Final contact email (currently `gkelly@poliartcr.com`)
- Legal review of the privacy notice and data-retention period
- Python version available in the GoDaddy cPanel plan (ADR-001, needed for US-014)
