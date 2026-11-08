# Project Context

## Project
- Name: Gaby Kelly — website (phase 1: financial health one-page pilot; phase 2: brand redesign and multipage site)
- Project key: `GK` (branches `GK-<NNN>-<slug>`, see [`AGENTS.md`](AGENTS.md))
- Repository: https://github.com/Raulc87/gaby-main-page
- Starter Kit: https://github.com/Raulc87/sdd_starter_kit (private: attach it to the sessions that read its templates, guides and skills) · Edition: Full · Synced to kit v1.2.0 (tag on `bd756f9`). This is the project's only record of its kit version: templates, guides and kit skills are read at this ref, and each kit sync PR updates it.
- Repository visibility: public, as the owner's portfolio (owner decision, kit issue Raulc87/sdd_starter_kit#16) · current setting public (only the owner changes it)
- Status: Phase 2c. Sprint 004 PLANNED (`docs/sprints/SPRINT_004.md`), waiting for the owner's go-ahead. Sprint 003 (phase 2a) closed 2026-11-08 after Gaby's review, which became phase 2c (#69). Sprint 002 closed 2026-10-16; Sprint 001 closed 2026-09-28. Production deploy (US-014) on hold until the hosting is decided (the domain is gabykelly.com); progress is shown on the GitHub Pages preview (ADR-005)
- Product owner / final reviewer: Human project owner

## Active documentation
- Project spec: [`docs/specs/PROJECT_SPEC.md`](docs/specs/PROJECT_SPEC.md) (v0.6, phase 2c, proposed; v0.5 phase 2 source: Gaby's visual brief, https://claude.ai/artifact/LeuEgX7HC2otdkLEhcJM5j)
- User stories: [`docs/specs/USER_STORIES.md`](docs/specs/USER_STORIES.md) (phase 2: US-019 to US-028; phase 2c: US-034 to US-039; Sprint 004 candidates from the kit v1.2.0 sync: US-029, US-030; US-031 to US-033 reserved for the next kit sync)
- Phase 2 brief (text export): [`docs/ux/BRIEF_2026-10-15.md`](docs/ux/BRIEF_2026-10-15.md)
- Phase 2c source, Gaby's Sprint 003 review (StoryBrand Home dummy, funnel document, review notes; text export and the owner's decisions): [`docs/ux/BRIEF_2026-11-08_STORYBRAND.md`](docs/ux/BRIEF_2026-11-08_STORYBRAND.md)
- Integration contracts: [`docs/specs/LEAD_API_CONTRACT.md`](docs/specs/LEAD_API_CONTRACT.md) (v1.2, locked for Sprint 004: the calculator endpoint, section 11)
- Feature specs: Not required for the current simple scope
- Architecture spec: Not required for the current simple scope (covered by ADRs)
- UX/UI direction: [`docs/ux/UX_UI_DIRECTION.md`](docs/ux/UX_UI_DIRECTION.md) (v1.1, phase 2c, proposed)
- Content (visitor-facing copy): [`docs/ux/CONTENT.md`](docs/ux/CONTENT.md) (v0.1; the phase 2c copy is staged in [`docs/ux/CONTENT_PHASE_2C.md`](docs/ux/CONTENT_PHASE_2C.md) and moves here with each story), the only copy source ([`AGENTS.md`](AGENTS.md) → Before implementing, step 5). The phase 1 copy (`UX_UI_DIRECTION.md` v0.8 §4) is retired; it stays in the history at commit `09d6ca6`.
- Runbooks: [`docs/runbooks/`](docs/runbooks/) (`LOCAL_DEVELOPMENT.md`, `DEPLOYMENT.md`, `GOOGLE_SHEETS_SETUP.md`; `RELEASE.md` written in Sprint 003 with the preview, US-027, and completed with the release sections before the first production release, ADR-005), written per the kit's [`docs/process/RUNBOOK_STYLE.md`](https://github.com/Raulc87/sdd_starter_kit/blob/v1.2.0/docs/process/RUNBOOK_STYLE.md) (read from the kit at the kit ref above; owner decision 2026-10-25, kit v1.2.0 sync) (the existing ones predate it; restyling them is an optional Agent 3 chore)
- Tech stack: [`TECH_STACK.md`](TECH_STACK.md) (v0.4)
- ADRs: [`docs/decisions/`](docs/decisions/) — ADR-001 backend hosting (working assumption), ADR-002 Google Sheets access, ADR-003 i18n routing (multipage update), ADR-004 spam protection, ADR-005 branching, preview and release, ADR-006 GoHighLevel calendar instead of Calendly (phase 2c), ADR-007 how the funnel emails are sent (proposed, owner decision pending)
- Implementation plan: [`docs/plans/IMPLEMENTATION_PLAN.md`](docs/plans/IMPLEMENTATION_PLAN.md) (v0.5)
- Active sprint plan: [`docs/sprints/SPRINT_004.md`](docs/sprints/SPRINT_004.md) (planned; agent prompts in [`docs/sprints/SPRINT_004_AGENT_PROMPTS.md`](docs/sprints/SPRINT_004_AGENT_PROMPTS.md))
- Previous sprints: [`docs/sprints/SPRINT_003.md`](docs/sprints/SPRINT_003.md) (closed 2026-11-08), [`docs/sprints/SPRINT_002.md`](docs/sprints/SPRINT_002.md) (closed 2026-10-16), [`docs/sprints/SPRINT_001.md`](docs/sprints/SPRINT_001.md) (closed 2026-09-28), each with a close-out
- Readiness checklist: [`docs/checklists/SPRINT_READINESS_CHECKLIST.md`](docs/checklists/SPRINT_READINESS_CHECKLIST.md)
- Security baseline: `docs/security/SECURITY_BASELINE.md`, not written yet: planned as US-029 for Sprint 004 (the project already writes code, so [`AGENTS.md`](AGENTS.md) → Security baseline lets it be a story in the next sprint)
- Penetration-test plan: `docs/security/PENTEST_PLAN.md`, required (the lead form stores personal data, so a PTES test runs before the first production release, US-014); written and approved before the go-live sprint starts (US-029 AC5)
- Developer guide: `CONTRIBUTING.md`, not written yet: planned as US-030 for Sprint 004

## Current sprint
- Sprint: Sprint 004 (phase 2c, first part)
- Goal: the StoryBrand Home, the calculator storing its leads (placeholder formula), the Método Polaris page, the security baseline and the developer guide, on the preview; the GoHighLevel calendar if it is ready
- Start: the first business day after the go-ahead (earliest 2026-11-09)
- End: 8 business days later (earliest 2026-11-18)
- Duration: 8 business days, excluding Saturday and Sunday
- Deliverable: the preview with the new Home, the calculator and the Método Polaris page in both languages; `SECURITY_BASELINE.md` approved; `CONTRIBUTING.md`; no production deployment
- Status: PLANNED — waiting for the human owner's go-ahead (`SPRINT_004.md`, entry gate 15)

## Agent allocation
- Implementation Agent 1: site scaffold (routes and stub pages for the calculator and the Método Polaris page), the StoryBrand Home, the Método Polaris page
- Implementation Agent 2: the calculator page, the GoHighLevel scheduler (when its URL arrives), the cross-cutting e2e suite
- Implementation Agent 3: the calculator-lead endpoint (`api/**`), the security baseline and scanning, `CONTRIBUTING.md`
- Review-only Agent: PR review only, no implementation; reviews when an author, the owner or the coordinator asks, and reports ready PRs to the coordinator
- Coordinator: the planning session ([`AGENTS.md`](AGENTS.md) → Coordinator session)
- Conflict resolution: human owner together with the owning agent, when conflicts occur

## Important constraints
- Production domain: gabykelly.com (human owner, 2026-11-08); today it serves Gaby's GoHighLevel page, which the new site replaces. Hosting not decided; GoDaddy cPanel (ADR-001) is the working assumption; US-014 on hold
- Funnel (phase 2c): the site and its backend cover Gaby's funnel except the calendar, which is her GoHighLevel calendar (ADR-006); how the emails are sent is ADR-007 (proposed)
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
- Gaby's GoHighLevel calendar embed URL (ADR-006); final contact email (currently `gkelly@poliartcr.com`)
- ADR-007, how the funnel emails are sent (human owner, with Gaby)
- From Gaby (phase 2c): her calculator, the ebook and the six email texts; the hero's "desired state" photo; the number of people mentored; the Wealth Mastery module list; the new VSL
- Legal review of the privacy notice and retention (US-018); Terms page
