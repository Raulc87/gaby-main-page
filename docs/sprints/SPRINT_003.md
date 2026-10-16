# SPRINT 003 — PLANNED

## Metadata
- Status: PLANNED — waiting for the human owner's go-ahead (entry gate 14)
- Duration: 8 business days
- Saturdays and Sundays excluded
- Start: 2026-10-19 (Monday), or the first business day after the go-ahead
- End: 2026-10-28 (Wednesday) — Sprint Review with the preview
- Final reviewer: Human project owner

## Sprint Goal

Phase 2a: turn the one-page site into Gaby Kelly's multipage site in her official brand — Home for corporate professionals, My story, the free resource library, the VIP page with screening-based routing — and publish every merge to a GitHub Pages preview Gaby can review.

## Required Deliverable

The preview at `https://raulc87.github.io/gaby-main-page/` (both languages), built from `main` by the preview workflow, showing: the new brand; header with navigation and mobile menu; footer with the disclaimer; Home; My story; Free resources; VIP page with the application form demonstrating both routes (qualified → scheduler stand-in; not ready → mini-course screen) without sending anything; the privacy notice page. Locally, the same build against the backend stores applications as before (contract v1.1) and shows the real Calendly for qualified answers.

No production deployment in this sprint (US-014 on hold, `PROJECT_SPEC.md` §11).

## Entry Gates

Readiness checklist run on 2026-10-16 on the documents as they will be merged by this planning PR (`docs/checklists/SPRINT_READINESS_CHECKLIST.md`).

| # | Gate (checklist section) | Status |
|---|---|---|
| 1 | Sprint 002 closed (`SPRINT_002.md` close-out) | Done in this PR |
| 2 | Paths in `PROJECT_CONTEXT.md` exist (§1, blocking) | Done in this PR (`CONTENT.md`, ADR-005 added), except `docs/runbooks/RELEASE.md`, planned in US-027 and merged before the first preview publish (`AGENTS.md` → Document map, Runbooks: a runbook may be a story ordered before the first deploy). Agents do not stop on it |
| 3 | `AGENTS.md` and the checklist match the Starter Kit (§1, blocking) | Done (#49; kit #12 and #13 changed neither) |
| 4 | `README.md` status matches `PROJECT_CONTEXT.md` (§1) | Done in this PR |
| 5 | Branch names for every story (§1, blocking) | Done (Planned Stories) |
| 6 | Spec v0.5, stories US-019–US-028, UX v1.0, `CONTENT.md` v0.1, tech stack v0.4, plan v0.5 and this plan agree (§2, blocking) | Done in this PR |
| 7 | Every sprint story has testable criteria; "common mobile widths" and "both languages" are defined in `USER_STORIES.md` (§3, blocking) | Done |
| 8 | Shared interfaces locked (§4, blocking): `LEAD_API_CONTRACT.md` v1.1, unchanged; the route map (ADR-003 update) and the resource list (`CONTENT.md` §7.3) are defined before parallel work by the scaffold (merge order step 1) | Done |
| 9 | Personal data: jurisdiction, consent, notice decided (§5, blocking) — unchanged; the notice stays DRAFT, which is fine because nothing is public: the preview collects nothing (FR-030) | Done |
| 10 | Visual identity approved and recorded (§5.1): Gaby's brief, `UX_UI_DIRECTION.md` v1.0 §2 | Done |
| 11 | Branching and release model recorded (ADR-005) before a sprint that deploys a preview; the preview's runbook is part of US-027, in the same PR as the workflow, so it exists by the first preview deploy (§6, blocking for a deploying sprint) | Done in this PR (ADR-005 proposed, accepted on merge) |
| 12 | Previews use no production data (§6): the preview has no backend and its forms send nothing | Done (FR-030, ADR-005) |
| 13 | Workstreams, ownership map, scaffold-first merge order, conflict rule, agent prompts with the merge and reviewer rules (§7, §7.1, blocking) | Done in this PR (`SPRINT_003_AGENT_PROMPTS.md`) |
| 14 | Go-ahead from the human owner (§8, blocking) | **Pending** |

Non-blocking items, for the human owner:
- `main` protection is in place; please confirm `frontend`, `e2e` and `pytest` are **required** status checks on `main` (checklist §6; Settings → Rules → Rulesets, or Branches).
- After merging this PR, enable GitHub Pages with source **GitHub Actions** (Settings → Pages) so the preview workflow can publish (US-027).
- Not a go-live sprint, so §5.1's brand-asset gate and the release runbook gate do not block. Still owed by Gaby (US-017, `PROJECT_SPEC.md` §16): session photos, testimonials, resource names and files, official Método Polaris steps, bio and credentials, the video, media logo permissions; and the Microsoft and Oracle logo files (human owner, for US-022).

## Planned Stories

| Story | Points | Owner | Dependencies | Branch | Status |
|---|---:|---|---|---|---|
| US-019 Official brand skin | 5 | Agent 1 | — | `GK-019-brand-tokens` | Planned |
| US-020 Multipage site and navigation (site shell) | 5 | Agent 1 | `GK-019-brand-tokens` | `GK-020-site-shell` | Planned |
| US-023 VIP page and routing | 5 | Agent 2 | `GK-020-site-shell` | `GK-023-vip-page` | Planned |
| US-020 AC1 (privacy notice page) | — | Agent 2 | `GK-020-site-shell` | `GK-020-privacy-page` | Planned |
| US-024 Free resource library | 5 | Agent 2 | `GK-020-site-shell` | `GK-024-resource-library` | Planned |
| US-027 AC3 (preview mode in forms) | — | Agent 2 | `GK-023-vip-page` | `GK-027-preview-forms` | Planned; merges **before** the preview workflow |
| US-021 Home for corporate professionals | 8 | Agent 1 | `GK-020-site-shell`; `GK-023-vip-page` merged (the form leaves the Home); `GK-024-resource-library` merged (the teaser reads `src/data/resources.ts`) | `GK-021-home` | Planned |
| US-027 Preview on GitHub Pages (workflow, `RELEASE.md`) | 3 | Agent 3 | `GK-020-site-shell` (base path); `GK-027-preview-forms` merged (no form may send data from the preview) | `GK-027-preview-workflow` | Planned |
| US-022 My story page | 3 | Agent 3 | `GK-020-site-shell`; logo files (human owner) | `GK-022-my-story` | Planned |

Total: 34 points. Not in this sprint: US-025, US-026, US-028 (phase 2b); US-014 (on hold); US-017 and US-018 (waiting on content and legal text, backlog); the Sprint 003 follow-up from Sprint 002 (`h1`–`h3` colour rule into `@layer base`) is absorbed by US-019 (the token rewrite replaces those rules).

## Parallel Workstreams

### Agent 1 — Brand, site shell, Home
- `GK-019-brand-tokens` first (small, merged fast): `UX_UI_DIRECTION.md` §2 tokens, Playfair Display and Manrope, buttons (gold, blue, outlined), the polar-star motif component, the pending badge restyle.
- `GK-020-site-shell`: the route map (ADR-003 update), base-path-aware link helper, `PUBLIC_PREVIEW` flag helper and the preview bar (`UX_UI_DIRECTION.md` §6.6), layout, header with the mobile menu, footer, the VIP band component, stub pages for every phase 2a page id in both languages (each with its title and description) so the other agents only fill their pages, and the new dictionary split (`common.ts` per language). The current one-page Home stays as it is in this branch.
- `GK-021-home`: the new Home (`CONTENT.md` §5), after `GK-023-vip-page` has moved the form to the VIP page; removes the phase 1 section components and `content.ts` that nothing uses any more.

### Agent 2 — VIP page, privacy page, resources, preview forms
- `GK-023-vip-page`: the VIP page (`CONTENT.md` §8, `UX_UI_DIRECTION.md` §5.4, §6.2, §6.4), the form restyle (US-019 tokens; `field-line` borders), the routing by screening answer, the not-ready screen; moves the e2e suite from the Home's form to the VIP page.
- `GK-020-privacy-page`: the privacy notice page from the existing notice component (same text, DRAFT kept).
- `GK-024-resource-library`: the typed resource list (`CONTENT.md` §7.3), resource card, filters, featured mini-course, short VIP band.
- `GK-027-preview-forms`: preview mode for the application form (US-027 AC3), right after `GK-023-vip-page`; it must merge before the preview workflow publishes anything.
- Keeps the cross-cutting e2e suite green.

### Agent 3 — Preview, My story
- `GK-027-preview-workflow`: `.github/workflows/preview.yml` (ADR-005: build with `PUBLIC_PREVIEW=true` and the Pages base path on push to `main`, publish with the official Pages actions) and `docs/runbooks/RELEASE.md` (preview section: where it is, what it does not do, how to check it; written per `docs/process/RUNBOOK_STYLE.md`).
- `GK-022-my-story`: the My story page (`CONTENT.md` §6, `UX_UI_DIRECTION.md` §5.2), media names row, experience logos.

## File Ownership Map

An agent edits only files it owns. If it needs a change in another agent's file, it asks that agent (or the human owner) instead of editing it.

| Path | Owner |
|---|---|
| `package.json`, lockfile, `astro.config.mjs`, Tailwind/ESLint/TS/Vitest/Playwright config | Agent 1 (other agents may add their own dependencies) |
| `src/styles/**`, `src/layouts/**`, `src/components/layout/**`, `src/components/home/**`, `src/components/sections/**` (phase 1, to be removed), `src/lib/site/**` (routes helper, base path, preview flag) | Agent 1 |
| `src/i18n/index.ts`, `src/i18n/routes.ts`, `src/i18n/{es,en}/common.ts`, `src/i18n/{es,en}/home.ts`, `src/i18n/{es,en}/content.ts` (phase 1, to be removed) | Agent 1 |
| `src/pages/index.astro`, `src/pages/{es,en}/index.astro`, `public/**` except the folders below | Agent 1 |
| `src/components/lead/**`, `src/components/resources/**`, `src/lib/lead/**`, `src/data/resources.ts` | Agent 2 |
| `src/i18n/{es,en}/form.ts`, `src/i18n/{es,en}/vip.ts`, `src/i18n/{es,en}/resources.ts`, `src/i18n/{es,en}/privacy.ts` | Agent 2 |
| `src/pages/es/{mentoria-vip,recursos,privacidad}/**`, `src/pages/en/{vip-mentorship,resources,privacy}/**`, `public/resources/**` | Agent 2 |
| `src/components/story/**`, `src/i18n/{es,en}/story.ts`, `src/pages/es/mi-historia/**`, `src/pages/en/my-story/**`, `public/logos/**` | Agent 3 |
| `api/**`, `.github/workflows/**`, `.env.example`, `docs/runbooks/**` | Agent 3 |
| `tests/unit/**` | The owner of the code under test |
| `tests/e2e/home.spec.ts` (Agent 1), `tests/e2e/story.spec.ts` (Agent 3); every other file in `tests/e2e/**`, including `support/` and the cross-cutting suite (navigation, language, responsive, forms) | Agent 2 |
| `docs/**` except `docs/runbooks/**`, `AGENTS.md`, `PROJECT_CONTEXT.md`, `README.md` | Human owner (agents propose changes via PR per change management) |

Stub pages created by Agent 1 in `GK-020-site-shell` belong to the owner listed above from the moment that PR merges. Copy changes follow change management: `CONTENT.md` first (a `GK-DOCS-...` PR), then the code.

## Integration Contract

Locked: `docs/specs/LEAD_API_CONTRACT.md` v1.1, unchanged by phase 2. Shared within the sprint and owned by Agent 1 once `GK-020-site-shell` merges: the route map (`src/i18n/routes.ts`, paths from `UX_UI_DIRECTION.md` §3), the link and preview helpers (`src/lib/site/**`), and the layout components (`Button`, `VipBand`, `PolarStar`, `PendingBadge`). Changing their API needs a PR from Agent 1 that the consumers are told about.

## Merge / Integration Order

1. `GK-019-brand-tokens`, then `GK-020-site-shell` (Agent 1). Nothing else merges before the site shell, except unit-test-only or docs PRs.
2. In parallel after step 1: `GK-023-vip-page`, then `GK-027-preview-forms`, `GK-020-privacy-page` and `GK-024-resource-library` (Agent 2); `GK-022-my-story` (Agent 3). `GK-027-preview-forms` covers the lead form wherever it is used, including the phase 1 Home while it still has it.
3. `GK-027-preview-workflow` (Agent 3), only after `GK-027-preview-forms` is merged: the first publish must already have demonstration-mode forms (FR-030). Agent 3 can open the PR earlier; it does not merge before that.
4. `GK-021-home` (Agent 1), after `GK-023-vip-page` (the form must be on the VIP page before the Home drops it; e2e moved in the same PR as the form) and `GK-024-resource-library` (the teaser reads its data).
5. Integration check (Agent 2, owner of the cross-cutting e2e suite): every page in both languages, the toggle on every page, the VIP routing, at 390 px and 1280 px, on `main` locally and on the preview.

Each merge to `main` after `GK-027-preview-workflow` updates the preview.

## Conflict Resolution

- Merge conflicts are resolved when found, by the human owner together with the agent that owns the conflicting file.
- An agent must not rewrite another agent's files to resolve a conflict.
- If a conflict reveals a contract or requirement gap, stop and apply change management (spec first).

## Review Model

- Implementation agents create focused PRs referencing story IDs and acceptance criteria.
- The review-only agent reviews each PR in its own session when the human owner (or the coordinator on the owner's behalf) asks, and never changes code (`AGENTS.md`).
- Codex reviews every PR automatically; its comments are handled per `AGENTS.md` → Automated PR reviewers.
- The human owner is the final reviewer and the only one who merges.

## Integration Safety

Parallel work is not complete until:
- branches are merged and CI is green on `main`
- the preview shows every phase 2a page in both languages
- the VIP flow works locally against the backend in memory mode (stores, qualified → Calendly or its fallback, not ready → mini-course screen, honeypot, `429`)
- previously accepted behavior still works (validation, consent, privacy dialog, error messages)

## Sprint Definition of Done

- Selected stories satisfy their acceptance criteria.
- GitHub Actions green on `main`; the preview workflow publishes.
- The preview reviewed by the human owner and shared with Gaby.
- No known critical regression.
- Human reviewer approves.

## Risks

- Scope (34 points, 8 days): if Agent 1's Home slips, `GK-021-home` moves to the start of Sprint 004 and the preview shows the new pages with the old Home; the other pages do not depend on it.
- The base path: links written by hand break on the preview; the route helper and an e2e run under the base path catch them.
- Moving the form off the Home breaks e2e selectors: the move and the e2e update happen in one PR (`GK-023-vip-page`), and the Home drops the form only after it.
- Content arrives during the sprint: it goes to `CONTENT.md` first; agents apply it in their own pages.
- The preview is public: marked, not indexed, collects nothing (FR-030).

## Important

Planned on 2026-10-16. Agents start only after the human owner's go-ahead (entry gate 14), recorded here.

Agent kickoff prompts and model assignments: `docs/sprints/SPRINT_003_AGENT_PROMPTS.md`.
