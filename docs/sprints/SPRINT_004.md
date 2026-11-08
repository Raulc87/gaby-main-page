# SPRINT 004 — ACTIVE

## Metadata
- Status: ACTIVE — the human owner gave the go-ahead on 2026-11-08 (Entry Gates, gate 15)
- Duration: 8 business days
- Saturdays and Sundays excluded
- Start: Monday 2026-11-09, the first business day after the go-ahead (the agents started on 2026-11-08)
- End: Wednesday 2026-11-18, with the Sprint Review on the preview
- Final reviewer: Human project owner

## Sprint Goal

Phase 2c, first part: the StoryBrand Home from Gaby's review, the freedom-months calculator storing its leads (placeholder formula), the Método Polaris page, and the project's security baseline and developer guide, all published to the GitHub Pages preview. If Gaby's GoHighLevel calendar is ready, the scheduler moves from Calendly to it.

## Required Deliverable

The preview at `https://raulc87.github.io/gaby-main-page/`, both languages, showing:
- the new Home in its eleven sections ([`UX_UI_DIRECTION.md`](../ux/UX_UI_DIRECTION.md) §5.1);
- the calculator page, whose details step demonstrates the result without storing or sending anything (FR-030);
- the Método Polaris page with placeholder steps;
- the header's new VIP label.

Locally, against the backend in memory mode: the calculator stores a lead through `POST /api/save-calculator-lead` (contract v1.2) before showing the result.

Also delivered in the repository:
- `docs/security/SECURITY_BASELINE.md`, approved by the owner;
- secret and dependency scanning, set up or with dated owner actions;
- `CONTRIBUTING.md`.

No production deployment (US-014 on hold: hosting not decided).

## Entry Gates

Readiness checklist run on 2026-11-08 on the documents as this planning PR merges them ([`docs/checklists/SPRINT_READINESS_CHECKLIST.md`](../checklists/SPRINT_READINESS_CHECKLIST.md), kit v1.2.0).

| # | Gate (checklist section) | Status |
|---|---|---|
| 1 | Sprint 003 closed ([`SPRINT_003.md`](SPRINT_003.md) close-out) | Done in this PR (approved by the human owner, 2026-11-08) |
| 2 | Paths in [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) exist (§1, blocking) | Done. `docs/security/SECURITY_BASELINE.md`, `docs/security/PENTEST_PLAN.md` and `CONTRIBUTING.md` are listed as "not written yet" with their stories (US-029, US-030), which this sprint writes; agents do not stop on them |
| 3 | [`AGENTS.md`](../../AGENTS.md), [`CLAUDE.md`](../../CLAUDE.md) and the checklist match the Starter Kit (§1, blocking) | Done: kit v1.2.0 (#67). The kit's v1.3.0 is not synced (the owner closed #68 on 2026-11-08 and will sync a later version) |
| 4 | [`README.md`](../../README.md) status matches [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) (§1) | Done in this PR |
| 5 | Branch names for every story (§1, blocking) | Done (Planned Stories) |
| 6 | Spec v0.6, stories US-028–US-037, UX v1.1, the staged copy ([`CONTENT_PHASE_2C.md`](../ux/CONTENT_PHASE_2C.md)), contract v1.2, ADR-006 and this plan agree (§2, blocking) | Done in #69 and this PR |
| 7 | Every sprint story has testable acceptance criteria (§3, blocking) | Done |
| 8 | Shared interfaces locked (§4, blocking): [`LEAD_API_CONTRACT.md`](../specs/LEAD_API_CONTRACT.md) v1.2 (the calculator endpoint, section 11) is locked by this PR; the route map for `method` and `calculator` is defined by the scaffold (merge order step 1) | Done in this PR |
| 9 | Personal data: jurisdiction, consent mechanism, privacy notice (§5, blocking): Ley 8968; the calculator's two consents (owner, 2026-11-08); the notice text of [`CONTENT_PHASE_2C.md`](../ux/CONTENT_PHASE_2C.md) A.8, still DRAFT. Nothing is public: the preview stores nothing | Done |
| 10 | Security baseline (§5): GK already wrote code when it adopted the baseline (kit v1.2.0 sync, #67), so the baseline is a story in this sprint (US-029) and the item blocks from Sprint 005 | Done (US-029 planned) |
| 11 | Every sprint story that touches an applicable OWASP risk has acceptance criteria that verify it (§5, blocking) | Done: each story has its Security section (US-028's is added in this PR); US-029 AC3 adds any missing criterion |
| 12 | Secret and dependency scanning set up, or planned as a story in this sprint (§5) | Planned: US-029 AC4 |
| 13 | Developer guide (§6, blocking for the first sprint that runs code; the project runs code) | Planned: US-030 in this sprint, so it exists by the sprint's end |
| 14 | Workstreams, ownership map, scaffold-first merge order with no dependency cycle, conflict rule, agent prompts with the merge, review-flow, attribution and reviewer-independence rules (§7, §7.1, blocking) | Done in this PR ([`SPRINT_004_AGENT_PROMPTS.md`](SPRINT_004_AGENT_PROMPTS.md)) |
| 15 | Go-ahead from the human owner (§8, blocking) | Done: "merged, go ahead with Sprint 004" (human owner, 2026-11-08) |

Non-blocking items, for the human owner:
- **Formatter (§6):** [`TECH_STACK.md`](../../TECH_STACK.md) names ESLint, but no formatter. Adding one (for example Prettier) reformats every file, which would clash with three agents working in parallel. It is proposed as the first change of Sprint 005, and is not a gate here.
- **Required checks (§7.1):** confirm that `frontend`, `e2e`, `pytest` and "Docs link check" are required status checks on `main`. "Docs link check" was added in #67, and making it required was left to you.
- **Owner settings for US-029 AC4:** GitHub secret scanning with push protection, and Dependabot alerts (Settings → Code security). The story records the date they are on.
- **US-037 needs Gaby's GoHighLevel calendar:** it has to be set up, modelled on her current Calendly event (ADR-006), and its embed URL sent. Until then US-037 waits, and the sprint's scope is 26 points.
- **Open owner decisions carried from Sprint 003:**
  - the featured mini-course also appears in the resource grid (#60);
  - one pending badge per Método Polaris step, or one for the block (#61);
  - the logo source for My story (#56).
  None blocks this sprint.
- **ADR-007 (how the funnel emails are sent):** still proposed, and US-038 and US-039 wait on it. Not in this sprint.

## Planned Stories

| Story | Points | Owner | Dependencies | Branch | Status |
|---|---:|---|---|---|---|
| US-034 (scaffold: routes `method` and `calculator`, their stub pages, header label) | — | Agent 1 | — | `GK-034-site-scaffold` | To do |
| US-034 StoryBrand Home | 8 | Agent 1 | `GK-034-site-scaffold` | `GK-034-home` | To do |
| US-028 Método Polaris page (placeholder steps) | 3 | Agent 1 | `GK-034-site-scaffold` | `GK-028-method-page` | To do |
| US-036 Calculator leads (endpoint and sheet tab; contract v1.2 locked by this PR) | 3 | Agent 3 | — | `GK-036-calculator-leads` | To do |
| US-035 Calculator page | 5 | Agent 2 | `GK-034-site-scaffold`; `GK-036-calculator-leads` merged (the e2e test needs the endpoint) | `GK-035-calculator` | To do |
| US-029 Security baseline | 5 | Agent 3 | — | `GK-029-security-baseline` | To do |
| US-030 Developer guide (`CONTRIBUTING.md`) | 2 | Agent 3 | `GK-036-calculator-leads` merged (the guide lists its configuration) | `GK-030-contributing` | To do |
| US-037 GoHighLevel calendar (only when the embed URL arrives) | 3 | Agent 2 | Gaby's GoHighLevel calendar and its embed URL | `GK-037-ghl-scheduler` | Waiting on Gaby |
| Chore: e2e for the root page's preview marker (Sprint 003 follow-up, US-027 AC2) | — | Agent 2 | — | `GK-CHORE-root-marker-e2e` | To do |

Total: 26 points, plus US-037 (3) when the calendar is ready.

**Not in this sprint:**
- US-038 and US-039: wait on ADR-007, the ebook and the email texts.
- US-031 to US-033: reserved for the next kit sync.
- US-025, US-026: phase 2b.
- US-014: on hold.
- US-017 and US-018: waiting on content and legal text.

**Sprint 003 follow-ups kept in the backlog:**
- the `LeadForm` defaults and `SECTION_IDS` cleanup;
- moving `PendingBadge`;
- a live count after filtering resources (needs a [`CONTENT.md`](../ux/CONTENT.md) string);
- the optional resource-loop assertion;
- replacing the provisional photo (waits on Gaby's photos).

The first two touch files of two agents at once, which this sprint's parallel work would conflict with.

## Parallel Workstreams

### Agent 1 — Site scaffold, Home, Método Polaris page
- `GK-034-site-scaffold` first, small and merged fast:
  - route ids `method` and `calculator` with the paths of [`UX_UI_DIRECTION.md`](../ux/UX_UI_DIRECTION.md) §3;
  - stub pages in both languages with their titles and descriptions (`meta.calculator.*`, `meta.method.*`);
  - `nav.method` keeps linking to the Home's `#metodo` section; `GK-028-method-page` switches it to the page, so the header never leads to an empty stub;
  - the header's `nav.vip` and `nav.vip_short` (§4.1);
  - it moves [`CONTENT_PHASE_2C.md`](../ux/CONTENT_PHASE_2C.md) A.2 and A.3 into [`CONTENT.md`](../ux/CONTENT.md).
  The calculator stub pages belong to Agent 2 once the PR merges.
- `GK-034-home`: the new Home (US-034).
- `GK-028-method-page`: the Método Polaris page (US-028).

### Agent 2 — Calculator, scheduler, e2e
- `GK-035-calculator`: the calculator page (US-035).
  - Built against contract v1.2 with the request stubbed in unit tests.
  - Its e2e test runs against the endpoint once `GK-036-calculator-leads` is merged.
  - It also moves the privacy-notice text for the calculator ([`CONTENT_PHASE_2C.md`](../ux/CONTENT_PHASE_2C.md) A.8: `privacy.p2`, `privacy.p3`, `privacy.p5`).
- `GK-037-ghl-scheduler`: the GoHighLevel calendar (US-037), when its embed URL arrives.
- `GK-CHORE-root-marker-e2e`: the e2e test for the root page's preview marker ([`SPRINT_003.md`](SPRINT_003.md) follow-ups).
- Keeps the cross-cutting e2e suite green, and runs the integration check (merge order step 4).

### Agent 3 — Backend, security baseline, developer guide
- `GK-036-calculator-leads`: the endpoint and sheet tab of contract v1.2 §11 (US-036), with its own rate-limit budget; `GOOGLE_SHEET_CALCULATOR_TAB` in `api/.env.example` and `GOOGLE_SHEETS_SETUP.md`, `PUBLIC_CALCULATOR_ENDPOINT` in the root `.env.example`.
- `GK-029-security-baseline`: `docs/security/SECURITY_BASELINE.md` from the kit template (US-029), and secret and dependency scanning (AC4: the CI audit step; the owner settings, with their date).
- `GK-030-contributing`: `CONTRIBUTING.md` from the kit's developer guide template (US-030), last, so it describes the sprint's commands and configuration.

## File Ownership Map

An agent edits only files it owns. If it needs a change in another agent's file, it asks that agent (or the human owner, through the coordinator) instead of editing it.

| Path | Owner |
|---|---|
| [`package.json`](../../package.json), lockfile, `astro.config.mjs`, Tailwind/ESLint/TS/Vitest/Playwright config | Agent 1 (other agents may add their own dependencies) |
| `src/styles/**`, `src/layouts/**`, `src/components/layout/**`, `src/components/home/**`, `src/components/sections/**`, `src/components/method/**` (new), `src/lib/site/**` | Agent 1 |
| [`src/i18n/index.ts`](../../src/i18n/index.ts), [`src/i18n/routes.ts`](../../src/i18n/routes.ts), `src/i18n/{es,en}/common.ts`, `src/i18n/{es,en}/home.ts`, `src/i18n/{es,en}/method.ts` (new) | Agent 1 |
| [`src/pages/index.astro`](../../src/pages/index.astro), `src/pages/{es,en}/index.astro`, `src/pages/es/metodo-polaris/**`, `src/pages/en/polaris-method/**`, `public/**` except the folders below | Agent 1 |
| `src/components/lead/**`, `src/components/resources/**`, `src/components/calculator/**` (new), `src/lib/lead/**`, `src/lib/calculator/**` (new; the formula), [`src/data/resources.ts`](../../src/data/resources.ts) | Agent 2 |
| `src/i18n/{es,en}/form.ts`, `vip.ts`, `resources.ts`, `privacy.ts`, `calculator.ts` (new) | Agent 2 |
| `src/pages/es/{mentoria-vip,recursos,privacidad,calculadora}/**`, `src/pages/en/{vip-mentorship,resources,privacy,calculator}/**`, `public/resources/**` | Agent 2 |
| `src/components/story/**`, `src/i18n/{es,en}/story.ts`, `src/pages/es/mi-historia/**`, `src/pages/en/my-story/**`, `public/logos/**` | Agent 3 (no story this sprint) |
| `api/**`, `.github/workflows/**`, `.github/scripts/**`, [`.env.example`](../../.env.example), `docs/runbooks/**`, `docs/security/**` (new), `CONTRIBUTING.md` (new) | Agent 3 |
| `tests/unit/**` | The owner of the code under test |
| [`tests/e2e/home.spec.ts`](../../tests/e2e/home.spec.ts) and a new `tests/e2e/method.spec.ts` (Agent 1); [`tests/e2e/story.spec.ts`](../../tests/e2e/story.spec.ts) (Agent 3); every other file in `tests/e2e/**`, including `support/`, the calculator and the cross-cutting suite | Agent 2 |
| `docs/**` except `docs/runbooks/**` and `docs/security/**`, [`AGENTS.md`](../../AGENTS.md), [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md), [`README.md`](../../README.md) | Human owner (agents propose changes through PRs, per change management) |

**Recorded exceptions (human owner, by approving this plan):**
- **Copy moves:** each agent edits [`docs/ux/CONTENT.md`](../ux/CONTENT.md) and [`docs/ux/CONTENT_PHASE_2C.md`](../ux/CONTENT_PHASE_2C.md) only to move its own staged parts, as its story's acceptance criteria say. The copy moves in the same PR as the code, and the moved text is deleted from the staging file. The staging file's part table says who moves what.
- **US-029 AC3:** Agent 3 may add a missing security acceptance criterion to a story in [`docs/specs/USER_STORIES.md`](../specs/USER_STORIES.md), in `GK-029-security-baseline`, and names each one in the PR.
- **The privacy-notice version:** Agent 2 may change the one `PRIVACY_NOTICE_VERSION` line in [`api/.env.example`](../../api/.env.example) in `GK-035-calculator` and in `GK-037-ghl-scheduler`, because each changes the notice text (`privacy.ts` is Agent 2's). The version and the text it names always change in the same PR.

Stub pages created by Agent 1 in `GK-034-site-scaffold` belong to the owner listed above once that PR merges.

## Integration Contract

Locked:
- [`docs/specs/LEAD_API_CONTRACT.md`](../specs/LEAD_API_CONTRACT.md) v1.2. Section 11, the calculator endpoint, is new in this PR; sections 2–10 are unchanged.
- The placeholder formula and zones of [`PROJECT_SPEC.md`](../specs/PROJECT_SPEC.md) FR-034. It lives in one function in `src/lib/calculator/`, so Gaby's version replaces it in one place.

Shared, and owned by Agent 1 once `GK-034-site-scaffold` merges: the route map ([`src/i18n/routes.ts`](../../src/i18n/routes.ts)) and the layout components. Changing their API needs a PR from Agent 1 that the consumers are told about.

## Merge / Integration Order

1. `GK-034-site-scaffold` (Agent 1). Nothing that links to the new routes merges before it. Agent 3's branches touch none of its files and may merge at any time.
2. In parallel after step 1:
   - Agent 1: `GK-034-home` and `GK-028-method-page`, in either order.
   - Agent 3: `GK-036-calculator-leads`, then `GK-029-security-baseline`, then `GK-030-contributing`.
   - Agent 2: `GK-035-calculator`, after `GK-036-calculator-leads` (its e2e test needs the endpoint); and `GK-CHORE-root-marker-e2e`.
3. `GK-037-ghl-scheduler` (Agent 2), when the GoHighLevel embed URL arrives. It waits on no other branch.
4. Integration check (Agent 2, owner of the cross-cutting e2e suite), on `main` locally and on the preview, at 390 px and 1280 px:
   - every page in both languages, and the toggle on every page;
   - the Home's calls to action;
   - the calculator flow against the backend in memory mode (stores, then shows the result; an error keeps the result hidden);
   - the VIP routing.

**Copy across PRs:** no PR depends on copy another PR moves. The staged keys that two pages share are written out in full (`calc.eyebrow`, `calc.title`, `home.calculator.example.zone`), and aliases point only at keys already in `CONTENT.md`. The Método Polaris page shows the `home.method.*` steps as they are when it merges; `GK-034-home` updates step 3's body for both pages ([`CONTENT_PHASE_2C.md`](../ux/CONTENT_PHASE_2C.md), note above the part table).

**Cycle check (AGENTS.md → Parallel agent rules):**
- The waits are: home, method and calculator wait on the scaffold; calculator waits on calculator-leads; contributing waits on calculator-leads.
- Nothing waits on a branch that waits on it. The scaffold and calculator-leads wait on nothing.
- No cycle.

## Conflict Resolution

- Merge conflicts are resolved when found, by the human owner together with the agent that owns the conflicting file.
- An agent must not rewrite another agent's files to resolve a conflict.
- [`CONTENT.md`](../ux/CONTENT.md) and [`CONTENT_PHASE_2C.md`](../ux/CONTENT_PHASE_2C.md) are edited by several PRs, each in its own sections. When one falls behind, its author merges `main` and keeps every other PR's moves intact.
- If a conflict reveals a contract or requirement gap, stop and apply change management (spec first).

## Review Model

Per [`AGENTS.md`](../../AGENTS.md) → Review-only agent → Review flow, and [`SPRINT_004_AGENT_PROMPTS.md`](SPRINT_004_AGENT_PROMPTS.md):
- **Authors:** each implementation agent opens focused PRs, subscribes only to its own PRs, and keeps them current with `main`.
- **After every push:** the author asks the review-only agent for a review at the new head.
- **The reviewer:** posts a comment-only review on the PR. When a PR is ready, it tells the coordinator, who tells the owner with the merge order.
- **Codex:** reviews each PR when it opens. Authors ask it again at most twice per PR, and every finding gets an outcome.
- **The human owner** is the final reviewer and the only one who merges.

## Integration Safety

Parallel work is not complete until:
- branches are merged and CI is green on `main`;
- the preview shows the new Home, the calculator and the Método Polaris page in both languages;
- the calculator flow works locally against the backend in memory mode (stores before the result, honeypot, `429`, a storage failure keeps the result hidden);
- previously accepted behavior still works: the VIP application and its routing, the resource library, My story, the privacy notice and the language toggle.

## Sprint Definition of Done

- Selected stories satisfy their acceptance criteria, and each moved its copy out of [`CONTENT_PHASE_2C.md`](../ux/CONTENT_PHASE_2C.md).
- GitHub Actions green on `main`; the preview publishes.
- `SECURITY_BASELINE.md` approved by the human owner (US-029 AC7).
- The preview reviewed by the human owner and shared with Gaby.
- No known critical regression.
- Human reviewer approves.

## Risks

- **Scope** (26 points, plus 3): the Home is the largest story. If it slips, the preview keeps the Sprint 003 Home and the calculator is reached only from its own URL. The other stories do not depend on the Home.
- **Stub pages on the preview:** the calculator's stub page is reachable from the Home's links once `GK-034-home` merges, and shows only the layout until `GK-035-calculator` merges. This is accepted for the preview (no real visitors). The header's Método Polaris link stays on the Home's section until its page is built.
- **Copy moves** across parallel PRs touch the same two files; conflicts are expected and resolved by merging `main` (Conflict Resolution).
- **The placeholder formula** is visible on the preview. Its blocks carry the pending badge, and Gaby's calculator replaces it.
- **US-029 can surface security gaps in merged work.** They become stories or dated open items in the baseline. Exploitable details are never written in a public tracked file.
- **US-037 depends on Gaby's set-up of the calendar;** it can slip to Sprint 005 without affecting the rest.

## Important

Planned on 2026-11-08 by the coordinator, after the human owner's "yes, go ahead with the close-out and Sprint 004 plan". When the go-ahead is given (gate 15), the coordinator:
1. archives the Sprint 003 sessions;
2. launches the agents and the review-only agent with the prompts in [`docs/sprints/SPRINT_004_AGENT_PROMPTS.md`](SPRINT_004_AGENT_PROMPTS.md);
3. records the session IDs there.

Done on 2026-11-08: the Sprint 003 sessions are archived, and the review-only agent and the three implementation agents are running; their session IDs are in [`SPRINT_004_AGENT_PROMPTS.md`](SPRINT_004_AGENT_PROMPTS.md) → Session IDs.
