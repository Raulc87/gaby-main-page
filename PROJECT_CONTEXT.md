# Project Context

## Project
- Name: Gaby Kelly — website (phase 1: financial health one-page pilot; phase 2: brand redesign and multipage site)
- Project key: `GK` (branches `GK-<NNN>-<slug>`, see [`AGENTS.md`](AGENTS.md))
- Repository: https://github.com/Raulc87/gaby-main-page
- Starter Kit: https://github.com/Raulc87/sdd_starter_kit (private: attach it to the sessions that read its templates, guides and skills) · Edition: Full · Synced to kit v1.2.0 (tag on `bd756f9`). This is the project's only record of its kit version: templates, guides and kit skills are read at this ref, and each kit sync PR updates it.
- Repository visibility: public, as the owner's portfolio (owner decision, kit issue Raulc87/sdd_starter_kit#16) · current setting public (only the owner changes it)
- Status: Phase 2. Sprint 003 (phase 2a) DELIVERED 2026-10-16 (all stories Done, 34 points; the close-out gaps in US-024 AC4 and US-027 AC2 fixed 2026-10-17; closes after the Sprint Review). Sprint 002 closed 2026-10-16; Sprint 001 closed 2026-09-28. Production deploy (US-014) on hold until the domain and hosting are known; progress is shown on the GitHub Pages preview (ADR-005)
- Product owner / final reviewer: Human project owner

## Active documentation
- Project spec: [`docs/specs/PROJECT_SPEC.md`](docs/specs/PROJECT_SPEC.md) (v0.5, phase 2; source: Gaby's visual brief, https://claude.ai/artifact/LeuEgX7HC2otdkLEhcJM5j)
- User stories: [`docs/specs/USER_STORIES.md`](docs/specs/USER_STORIES.md) (phase 2: US-019 to US-028; Sprint 004 candidates from the kit v1.2.0 sync: US-029, US-030)
- Phase 2 brief (text export): [`docs/ux/BRIEF_2026-10-15.md`](docs/ux/BRIEF_2026-10-15.md)
- Integration contracts: [`docs/specs/LEAD_API_CONTRACT.md`](docs/specs/LEAD_API_CONTRACT.md) (v1.1, locked for Sprint 002)
- Feature specs: Not required for the current simple scope
- Architecture spec: Not required for the current simple scope (covered by ADRs)
- UX/UI direction: [`docs/ux/UX_UI_DIRECTION.md`](docs/ux/UX_UI_DIRECTION.md) (v1.0, phase 2)
- Content (visitor-facing copy): [`docs/ux/CONTENT.md`](docs/ux/CONTENT.md) (v0.1, phase 2), the only copy source ([`AGENTS.md`](AGENTS.md) → Before implementing, step 5). The phase 1 copy (`UX_UI_DIRECTION.md` v0.8 §4) is retired; it stays in the history at commit `09d6ca6`.
- Runbooks: [`docs/runbooks/`](docs/runbooks/) (`LOCAL_DEVELOPMENT.md`, `DEPLOYMENT.md`, `GOOGLE_SHEETS_SETUP.md`; `RELEASE.md` written in Sprint 003 with the preview, US-027, and completed with the release sections before the first production release, ADR-005), written per [`docs/process/RUNBOOK_STYLE.md`](docs/process/RUNBOOK_STYLE.md) (the existing ones predate it; restyling them is an optional Agent 3 chore)
- Tech stack: [`TECH_STACK.md`](TECH_STACK.md) (v0.4)
- ADRs: [`docs/decisions/`](docs/decisions/) — ADR-001 backend hosting (working assumption), ADR-002 Google Sheets access, ADR-003 i18n routing (multipage update), ADR-004 spam protection, ADR-005 branching, preview and release
- Implementation plan: [`docs/plans/IMPLEMENTATION_PLAN.md`](docs/plans/IMPLEMENTATION_PLAN.md) (v0.5)
- Active sprint plan: [`docs/sprints/SPRINT_003.md`](docs/sprints/SPRINT_003.md) (planned; agent prompts in [`docs/sprints/SPRINT_003_AGENT_PROMPTS.md`](docs/sprints/SPRINT_003_AGENT_PROMPTS.md))
- Previous sprints: [`docs/sprints/SPRINT_002.md`](docs/sprints/SPRINT_002.md) (closed 2026-10-16), [`docs/sprints/SPRINT_001.md`](docs/sprints/SPRINT_001.md) (closed 2026-09-28), each with a close-out
- Readiness checklist: [`docs/checklists/SPRINT_READINESS_CHECKLIST.md`](docs/checklists/SPRINT_READINESS_CHECKLIST.md)
- Security baseline: `docs/security/SECURITY_BASELINE.md`, not written yet: planned as US-029 for Sprint 004 (the project already writes code, so [`AGENTS.md`](AGENTS.md) → Security baseline lets it be a story in the next sprint)
- Penetration-test plan: `docs/security/PENTEST_PLAN.md`, required (the lead form stores personal data, so a PTES test runs before the first production release, US-014); written and approved before the go-live sprint starts (US-029 AC5)
- Developer guide: `CONTRIBUTING.md`, not written yet: planned as US-030 for Sprint 004

## Current sprint
- Sprint: Sprint 003 (phase 2a)
- Goal: Gaby Kelly's multipage site in her official brand (Home, My story, Free resources, VIP page with screening-based routing), published to a GitHub Pages preview on every merge
- Start: 2026-10-19 (or the first business day after the go-ahead)
- End: 2026-10-28
- Duration: 8 business days, excluding Saturday and Sunday
- Deliverable: the preview at `https://raulc87.github.io/gaby-main-page/` with every phase 2a page in both languages; no production deployment
- Status: DELIVERED — all stories merged on 2026-10-16; waiting on the Sprint Review (preview reviewed by the owner and shared with Gaby), see `SPRINT_003.md` → Close-out

## Agent allocation
- Implementation Agent 1: brand tokens, site shell (routes, layout, header, footer, VIP band), Home
- Implementation Agent 2: VIP page and form, routing, privacy page, resource library, preview mode of the form, cross-cutting e2e
- Implementation Agent 3: preview workflow and `RELEASE.md`, My story page (also owns `api/**`, unchanged this sprint)
- Review-only Agent: PR review only, no implementation; reviews when the owner or the coordinator asks
- Coordinator: the planning session ([`AGENTS.md`](AGENTS.md) → Coordinator session)
- Conflict resolution: human owner together with the owning agent, when conflicts occur

## Important constraints
- Production hosting and domain: not decided (gabykelly.com or another); GoDaddy cPanel (ADR-001) is the working assumption; US-014 on hold
- Preview: GitHub Pages, static, no backend, forms in demonstration mode, not indexed (ADR-005)
- Prefer simple hosting-compatible technologies; no AWS requirement
- Maximum 3 implementation agents in parallel
- Human reviewer is final approver
- Copy comes only from [`docs/ux/CONTENT.md`](docs/ux/CONTENT.md); provisional keys show the pending badge; English is provisional until Gaby validates it
- Brand: `UX_UI_DIRECTION.md` v1.0 §2 (tokens, allowed contrast pairs, one gold button per viewport)
- Languages: Spanish and English (browser-detected, toggle in the header, same page in the other language)
- Code, identifiers, and data fields in English, `snake_case`
- Personal data governed by Costa Rica Ley N.° 8968 (consent required)
- Production: Gaby's Google account and sheet (set up at deploy); development: the project owner's sheet or memory mode
- Spam protection: honeypot + per-IP rate limit, no CAPTCHA for now (ADR-004)

## Open questions
See [`docs/specs/PROJECT_SPEC.md`](docs/specs/PROJECT_SPEC.md) §16 (the full list). In short:
- Production domain and hosting (human owner)
- From Gaby: official Método Polaris steps; resource names and files; session photos; authorized testimonials; bio and credentials; the VIP video; media logo permissions (Intel logo not confirmed)
- Microsoft and Oracle logo files for My story (human owner, US-022)
- Sending account for resource emails (phase 2b)
- Final Calendly URL; final contact email (currently `gkelly@poliartcr.com`)
- Legal review of the privacy notice and retention (US-018); Terms page
