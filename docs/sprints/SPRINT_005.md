# SPRINT 005 — PLANNED

## Metadata
- Status: PLANNED — waiting for the human owner's go-ahead (Entry Gates, gate 16)
- Duration: 8 business days
- Saturdays and Sundays excluded
- Start: the first business day after the go-ahead
- End: 8 business days after the start, with the Sprint Review on the preview, with Gaby
- Final reviewer: Human project owner

## Sprint Goal

Phase 2d: Gaby's final content on the preview. The site speaks with voseo and calls the programme Wealth Mastery, with the new menu; the Wealth Mastery page replaces the Método Polaris page; the Home shows the three pillars; Gaby's calculator replaces the placeholder; the resource library is gone; and every saved lead reaches Gaby's GoHighLevel account with its tags (locally and in a development environment; the preview stores and sends nothing). The typefaces are self-hosted.

## Required Deliverable

The preview at `https://raulc87.github.io/gaby-main-page/`, both languages, showing:
- voseo and "Wealth Mastery" everywhere, and the header Mi historia · Wealth Mastery · Diagnóstico gratis, with "Aplicá a Wealth Mastery";
- the Wealth Mastery page in Gaby's eight sections;
- the Home with the pillars and without the Wealth Mastery section or library links;
- Gaby's calculator (currencies, six zones, the concentration alert), demonstrating its result without storing or sending anything (FR-030);
- no resource library, and no request to Google Fonts.

Locally, against the backend in memory mode: the calculator stores a v1.3 lead before showing its result. With a fake GoHighLevel client in tests, and with Gaby's token in a development environment for the owner's check: each saved lead becomes a GoHighLevel contact with its tags and fields ([`LEAD_API_CONTRACT.md`](../specs/LEAD_API_CONTRACT.md) §12).

No production deployment (US-014 on hold: hosting not decided).

## Entry Gates

Readiness checklist run on 2026-11-24 on the documents as #85 and this planning PR leave them ([`docs/checklists/SPRINT_READINESS_CHECKLIST.md`](../checklists/SPRINT_READINESS_CHECKLIST.md), kit v1.2.0).

| # | Gate (checklist section) | Status |
|---|---|---|
| 1 | Sprint 004 closed ([`SPRINT_004.md`](SPRINT_004.md) close-out) | Done in this PR (approved by the human owner, 2026-11-24) |
| 2 | Paths in [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) exist (§1, blocking) | Done, except `docs/ux/CONTENT_PHASE_2D.md`, which gate 6 adds; `docs/security/PENTEST_PLAN.md` stays "written before the go-live sprint" (US-029 AC5) |
| 3 | [`AGENTS.md`](../../AGENTS.md), [`CLAUDE.md`](../../CLAUDE.md) and the checklist match the Starter Kit (§1, blocking) | Done: kit v1.2.0. The kit's later versions are not synced (the owner's choice, 2026-11-08) |
| 4 | [`README.md`](../../README.md) status matches [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) (§1) | Done in this PR |
| 5 | Branch names for every story (§1, blocking) | Done (Planned Stories) |
| 6 | Spec v0.7, stories US-040–US-046, UX v1.2, contract v1.3, ADR-007, ADR-008 and the staged phase 2d copy agree (§2, blocking) | Spec, contract, ADRs, UX and stories: done in #85. **The staged copy (`CONTENT_PHASE_2D.md`): the coordinator's next docs PR, merged before the go-ahead** |
| 7 | Every sprint story has testable acceptance criteria (§3, blocking) | Done (#85; reviewed) |
| 8 | Shared interfaces locked (§4, blocking): [`LEAD_API_CONTRACT.md`](../specs/LEAD_API_CONTRACT.md) v1.3 (§11, §12) locked by #85; the route map changes of [`UX_UI_DIRECTION.md`](../ux/UX_UI_DIRECTION.md) §3 are made by the scaffold (merge order step 1) | Done |
| 9 | Personal data (§5, blocking): Ley 8968; two consents; only the result goes to GoHighLevel (pending Gaby's confirmation, brief §8 point 4); the privacy notice names GoHighLevel's role (US-045 AC7). Nothing is public: the preview stores and sends nothing | Done. If Gaby asks for the figures, a docs PR changes FR-035, the notice and its consent before US-045 merges |
| 10 | Security baseline exists and is approved (§5, blocking from this sprint) | Done: [`SECURITY_BASELINE.md`](../security/SECURITY_BASELINE.md) (#75) |
| 11 | Every story touching an OWASP risk has acceptance criteria that verify it (§5, blocking) | Done: US-044 (only the contract's fields leave the browser), US-045 (the token, the outbound request, data minimization), US-040 (a third party removed) |
| 12 | Secret and dependency scanning (§5) | Done: secret scanning with push protection, Dependabot alerts, `npm audit` and `pip-audit` required on `main` |
| 13 | **No agent uses a third party's live account** (owner decision asked on 2026-11-23; this plan proposes it, and merging approves it): agents never load Gaby's live GoHighLevel widget or call its API. Tests use stubs and a fake client; checks against the real account are the owner's, by hand | Proposed in this PR |
| 14 | Developer guide (§6) | Done: [`CONTRIBUTING.md`](../../CONTRIBUTING.md) (#77), corrected by #86 |
| 15 | Workstreams, ownership map, scaffold-first merge order with no cycle, conflict rule, prompts with the merge, review-flow, attribution and reviewer-independence rules (§7, §7.1, blocking) | Done in this PR ([`SPRINT_005_AGENT_PROMPTS.md`](SPRINT_005_AGENT_PROMPTS.md)) |
| 16 | Go-ahead from the human owner (§8, blocking) | Pending, after gate 6 and #86 and #87 merge |

Non-blocking items, for the human owner and Gaby:
- **The owner's manual check of the GoHighLevel calendar** (US-037, ADR-006 → Validation; the owner asked for it on 2026-11-24). In a local build with `PUBLIC_SCHEDULER_URL` set to Gaby's calendar and the backend in memory mode, submit a Wealth Mastery application with a qualified answer, using your own name and email:
  1. the thank-you screen shows Gaby's calendar, with your first name, last name, email and phone filled in;
  2. book one test slot, and check that it appears in Gaby's GoHighLevel calendar;
  3. cancel the booking, and delete the test contact in GoHighLevel.
  Record the date and result in this file's close-out. [`docs/runbooks/LOCAL_DEVELOPMENT.md`](../runbooks/LOCAL_DEVELOPMENT.md) explains running the site locally.
- **Gaby's GoHighLevel set-up** (ADR-008), needed for the owner's end-to-end check of US-045 and for US-038 and US-039, not for merging:
  - a private integration token with access to contacts only, put by the owner in the development environment's secrets (never in chat, a PR or Git);
  - her location id;
  - the custom fields `meses`, `zona`, `moneda`, `alerta_concentracion` and `preseleccion`;
  - the tags `lead-calculadora`, `consentimiento-correos`, `aplicacion-vip`, `idioma-es` and `idioma-en`;
  - her workflows: email 1 for every calculator lead; emails 2 to 6 and the weekly email only with the consent tag; her notification on `aplicacion-vip`; the stop on booking. Email only: no automated SMS or WhatsApp (BR-012).
- **Gaby's confirmations:** brief §8 point 4 (only the result goes to GoHighLevel) and point 6 (her rounding, or rounding down); the Wealth Mastery page's FAQ answers; the "Quién te guía" photo.
- **The test contact** `ana.perez@example.com` in Gaby's GoHighLevel, from Sprint 004: deleted by Gaby.
- **Formatter** ([`TECH_STACK.md`](../../TECH_STACK.md) names none): deferred again. This sprint renames copy across every agent's files, and a formatter would reformat them all at once.
- **Open owner decision carried from Sprint 003:** the logo source for My story (#56).

## Planned Stories

| Story | Points | Owner | Dependencies | Branch | Status |
|---|---:|---|---|---|---|
| US-041 Voseo, the Wealth Mastery name, the menu and routes (the scaffold) | 5 | Agent 1 | Gate 6 (the staged copy) | `GK-041-voseo-wealth-mastery` | To do |
| US-043 Home for phase 2d | 3 | Agent 1 | `GK-041-voseo-wealth-mastery` | `GK-043-home` | To do |
| US-040 Self-hosted typefaces | 2 | Agent 1 | `GK-041-voseo-wealth-mastery` (both touch the layout) | `GK-040-self-hosted-fonts` | To do |
| US-046 Withdraw the resource library | 3 | Agent 2 | `GK-041-voseo-wealth-mastery`; `GK-043-home` merged (the Home's calculator teaser imports the resource data and links the library) | `GK-046-withdraw-library` | To do |
| US-044 Gaby's calculator | 5 | Agent 2 | `GK-041-voseo-wealth-mastery`; built on `GK-045-ghl-contacts`, and its PR targets that branch (the v1.3 client and endpoint land together, merge order step 3) | `GK-044-calculator` | To do |
| US-045 Calculator leads v1.3 and the GoHighLevel contacts | 5 | Agent 3 | `GK-041-voseo-wealth-mastery` (both touch `privacy.ts`); merges to `main` only together with `GK-044-calculator` (merge order step 3) | `GK-045-ghl-contacts` | To do |
| US-042 Wealth Mastery page | 5 | Agent 3 | `GK-041-voseo-wealth-mastery` (the route and its stub) | `GK-042-wealth-mastery-page` | To do |

Total: 28 points.

**Owner and Gaby tasks in this sprint (no points):** the manual calendar check (US-037); Gaby's GoHighLevel set-up; the owner's end-to-end check of US-045 with Gaby's token (ADR-008 → Validation).

**Not in this sprint:**
- US-038 and US-039: Gaby's GoHighLevel workflows and texts, then the owner's end-to-end checks; AC4 of US-038 (the "we've sent it" copy) is a small change once that check passes, in a later sprint.
- US-031 to US-033: reserved for the next kit sync.
- US-026 (Blog), US-014 (go-live, on hold), US-017 and US-018 (content and legal text).

**Backlog follow-ups:** the `LeadForm` defaults and `SECTION_IDS` cleanup; moving `PendingBadge`; replacing the provisional photo (waits on Gaby's photos).

## Parallel Workstreams

### Agent 1 — The scaffold (voseo, name, menu, routes), Home, typefaces
- `GK-041-voseo-wealth-mastery` first, merged fast (US-041):
  - the voseo and naming copy of `CONTENT_PHASE_2D.md` moved into [`CONTENT.md`](../ux/CONTENT.md), with every agent's string files updated to match (a recorded exception);
  - the header and its new keys; the route `mastery` with a stub page in both languages; `vip` moved to `/es/aplicar/` and `/en/apply/`; the routes table of [`UX_UI_DIRECTION.md`](../ux/UX_UI_DIRECTION.md) §3 changed in the same PR;
  - the mechanical path and string updates in other agents' tests that the rename breaks (a recorded exception).
- `GK-043-home` (US-043), then `GK-040-self-hosted-fonts` (US-040).

### Agent 2 — Calculator, library removal, e2e
- Starts at once on its own files: Gaby's formula as one function in `src/lib/calculator/` with its unit tests (US-044 AC1).
- `GK-046-withdraw-library` (US-046), after the scaffold and `GK-043-home` (the Home's teaser stops using the library there). It also removes the library links in Agent 2's own calculator and thank-you files (`CalculatorPage.astro`, `LeadForm.astro`) if `GK-044` has not replaced them yet.
- `GK-044-calculator` (US-044), built on `GK-045-ghl-contacts` (merge order step 3).
- Keeps the cross-cutting e2e suite green, and runs the integration check (merge order step 4).

### Agent 3 — Backend and GoHighLevel, Wealth Mastery page
- Starts at once on `api/**`: `GK-045-ghl-contacts` (US-045), merged after the scaffold (both touch `privacy.ts`) and together with `GK-044-calculator` (merge order step 3).
- `GK-042-wealth-mastery-page` (US-042), after the scaffold; it removes the Método Polaris page. It imports Agent 1's testimonial section unchanged (`src/components/home/**`); a change to it is Agent 1's, on request.

## File Ownership Map

An agent edits only files it owns. If it needs a change in another agent's file, it asks that agent (or the human owner, through the coordinator) instead of editing it.

| Path | Owner |
|---|---|
| [`package.json`](../../package.json), lockfile, `astro.config.mjs`, Tailwind/ESLint/TS/Vitest/Playwright config, [`src/env.d.ts`](../../src/env.d.ts) | Agent 1 (other agents may add their own dependencies) |
| `src/styles/**`, `src/layouts/**`, `src/components/layout/**`, `src/components/home/**`, `src/components/sections/**`, `src/lib/site/**`, `public/fonts/**` (new) | Agent 1 |
| [`src/i18n/index.ts`](../../src/i18n/index.ts), [`src/i18n/routes.ts`](../../src/i18n/routes.ts), `src/i18n/{es,en}/common.ts`, `src/i18n/{es,en}/home.ts` | Agent 1 |
| [`src/pages/index.astro`](../../src/pages/index.astro), `src/pages/{es,en}/index.astro`, `public/**` except the folders below | Agent 1 |
| `src/components/method/**`, `src/i18n/{es,en}/method.ts`, `src/pages/es/metodo-polaris/**`, `src/pages/en/polaris-method/**`, [`tests/e2e/method.spec.ts`](../../tests/e2e/method.spec.ts) | Agent 3, **to delete them** in `GK-042-wealth-mastery-page` (they were Agent 1's) |
| `src/components/mastery/**` (new), `src/i18n/{es,en}/mastery.ts` (new), `src/pages/{es,en}/wealth-mastery/**` (stub by Agent 1 in the scaffold, then Agent 3's), `tests/e2e/mastery.spec.ts` (new) | Agent 3 |
| `src/components/lead/**`, `src/components/resources/**` (to delete), `src/components/calculator/**`, `src/lib/lead/**`, `src/lib/calculator/**`, [`src/data/resources.ts`](../../src/data/resources.ts) (to delete) | Agent 2 |
| `src/i18n/{es,en}/form.ts`, `vip.ts`, `resources.ts` (to delete), `privacy.ts`, `calculator.ts` | Agent 2 |
| `src/pages/es/{aplicar,mentoria-vip,recursos,privacidad,calculadora}/**`, `src/pages/en/{apply,vip-mentorship,resources,privacy,calculator}/**` (the scaffold moves the VIP pages to the new paths), `public/resources/**` (to delete) | Agent 2 |
| `src/components/story/**`, `src/i18n/{es,en}/story.ts`, `src/pages/es/mi-historia/**`, `src/pages/en/my-story/**`, `public/logos/**` | Agent 3 |
| `api/**`, `.github/workflows/**`, `.github/scripts/**`, [`.env.example`](../../.env.example), `docs/runbooks/**`, `docs/security/**`, [`CONTRIBUTING.md`](../../CONTRIBUTING.md) | Agent 3 |
| `tests/unit/**` | The owner of the code under test |
| [`tests/e2e/home.spec.ts`](../../tests/e2e/home.spec.ts), a new `tests/e2e/header.spec.ts` (US-041 AC6) and a new `tests/e2e/fonts.spec.ts` (Agent 1); [`tests/e2e/story.spec.ts`](../../tests/e2e/story.spec.ts), `tests/e2e/mastery.spec.ts` (Agent 3); every other file in `tests/e2e/**`, including `support/`, the calculator and the cross-cutting suite | Agent 2 |
| `docs/**` except `docs/runbooks/**` and `docs/security/**`, [`AGENTS.md`](../../AGENTS.md), [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md), [`README.md`](../../README.md), [`TECH_STACK.md`](../../TECH_STACK.md) | Human owner (agents propose changes through PRs, per change management) |

**Recorded exceptions (human owner, by approving this plan):**
- **Copy moves:** each agent edits [`docs/ux/CONTENT.md`](../ux/CONTENT.md) and `docs/ux/CONTENT_PHASE_2D.md` only to move its own staged parts, as its story's acceptance criteria and the staging file's part table say, in the same PR as the code; the moved text is deleted from the staging file.
- **The scaffold's voseo pass (US-041):** Agent 1 updates every agent's `src/i18n/{es,en}/*.ts` string values, and the expected strings and paths in other agents' tests, **only** to apply the staged voseo and naming copy and the `vip` path change. It changes no logic, key or component in those files. It also moves Agent 2's application page files to the new `vip` paths (`src/pages/es/aplicar/`, `src/pages/en/apply/`) unchanged; they stay Agent 2's. Each owner is named in the PR.
- **Routes table:** the story that changes a route changes [`UX_UI_DIRECTION.md`](../ux/UX_UI_DIRECTION.md) §3's table in the same PR (US-041 adds `mastery` and moves `vip`; US-042 removes `method`; US-046 removes `resources`), because `tests/unit/site/routes.test.ts` reads it.
- **US-042:** Agent 3 deletes the Método Polaris page's files (Agent 1's, listed above) and removes `method` from [`src/i18n/routes.ts`](../../src/i18n/routes.ts) and its route tests.
- **US-046:** Agent 2 removes `resources` from [`src/i18n/routes.ts`](../../src/i18n/routes.ts) and its route tests, and changes My story's link to the calculator (one key in `story.ts` and its use in `src/components/story/**`, Agent 3's).
- **US-044:** Agent 2 adds `PUBLIC_CRC_PER_USD` to [`.env.example`](../../.env.example) (Agent 3's) and to [`src/env.d.ts`](../../src/env.d.ts) (Agent 1's), one line each.
- **US-045 AC7:** Agent 3 changes the privacy-notice paragraphs in `src/i18n/{es,en}/privacy.ts` (Agent 2's) and the `PRIVACY_NOTICE_VERSION` line together, in `GK-045-ghl-contacts`.
- **US-040 AC5:** Agent 1 proposes the baseline's change (Agent 3's file) in its PR body; Agent 3 makes it, or the coordinator relays it.

## Integration Contract

Locked:
- [`docs/specs/LEAD_API_CONTRACT.md`](../specs/LEAD_API_CONTRACT.md) v1.3: §11 (Gaby's calculator) and §12 (the GoHighLevel contacts). `/api/save-lead`'s request and responses are unchanged.
- [`PROJECT_SPEC.md`](../specs/PROJECT_SPEC.md) FR-034 (the formula, zones, display rule and tie rule), in one function in `src/lib/calculator/`.

Shared, owned by Agent 1 once `GK-041-voseo-wealth-mastery` merges: the route map ([`src/i18n/routes.ts`](../../src/i18n/routes.ts)) and the layout components. A change to their API needs a PR from Agent 1, and the consumers are told.

## Merge / Integration Order

1. `GK-041-voseo-wealth-mastery` (Agent 1). Nothing else merges before it.
2. In parallel after step 1:
   - Agent 1: `GK-043-home`, then `GK-040-self-hosted-fonts`.
   - Agent 2: `GK-046-withdraw-library`, after `GK-043-home`.
   - Agent 3: `GK-042-wealth-mastery-page`.
3. **`GK-045-ghl-contacts` and `GK-044-calculator` together** (contract v1.3 changes the request and the zone codes, so neither the old client with the new endpoint nor the reverse passes the e2e suite):
   - Agent 3 opens `GK-045-ghl-contacts` against `main`; its `e2e` job is expected red on the calculator spec until `GK-044` lands in it (the old client sends a v1.2 request). The reviewer reviews its backend at its own head.
   - Agent 2 builds `GK-044-calculator` on `GK-045-ghl-contacts` and opens its PR **against that branch**. It is reviewed on its own diff.
   - The owner merges `GK-044` into `GK-045-ghl-contacts`; the reviewer re-checks the combined head; when CI is green there, the owner merges `GK-045-ghl-contacts` into `main`. Neither merges into `main` alone.
   - If `main` moves meanwhile, Agent 3 merges `main` into `GK-045-ghl-contacts` and Agent 2 merges that into `GK-044-calculator`.
4. Integration check (Agent 2), on `main` locally and on the preview, at 390 and 1280 px: every page in both languages and the toggle; the header; the Home; the Wealth Mastery page; the calculator against the backend in memory mode (stores a v1.3 lead, then shows the result; an error keeps it hidden); the application and its routing; no link to a removed page; no request to Google Fonts; and, in the preview, no request to `/api` or to GoHighLevel.
5. The owner's checks: the calendar (US-037), and US-045 with Gaby's token (ADR-008 → Validation).

**Cycle check:** `GK-043`, `GK-042` and `GK-040` wait on `GK-041` (and `GK-040` on `GK-043`); `GK-046` waits on `GK-041` and `GK-043`; `GK-044` is built on `GK-045`, which waits on `GK-041`, and the pair merges to `main` as one; nothing waits on a branch that waits on it. No cycle.

## Conflict Resolution

- Merge conflicts are resolved when found, by the human owner together with the agent that owns the conflicting file.
- An agent must not rewrite another agent's files to resolve a conflict, beyond the recorded exceptions.
- [`CONTENT.md`](../ux/CONTENT.md), `CONTENT_PHASE_2D.md`, [`src/i18n/routes.ts`](../../src/i18n/routes.ts) and UX §3 are edited by several PRs, each in its own part. When one falls behind, its author merges `main` and keeps every other PR's changes.
- If a conflict reveals a contract or requirement gap, stop and apply change management (spec first).

## Review Model

As in Sprint 004 ([`AGENTS.md`](../../AGENTS.md) → Review-only agent → Review flow; [`SPRINT_005_AGENT_PROMPTS.md`](SPRINT_005_AGENT_PROMPTS.md)): focused PRs; each author subscribes to its own PRs and keeps them current with `main`; after every push the author asks the review-only agent for a review (a scheduled message **with** `run_once_at`); the reviewer posts a comment-only review and tells the coordinator when a PR is ready; Codex reviews each PR when it opens, and is asked again at most twice; resolving Codex threads is the owner's; the owner is the final reviewer and the only one who merges, and merges a PR only when its blocking review items are resolved or the reason is recorded on it.

## Integration Safety

Parallel work is not complete until:
- branches are merged and CI is green on `main`;
- the preview shows the phase 2d site in both languages;
- the calculator flow works locally against the backend in memory mode, and the GoHighLevel step works with the fake client in tests;
- previously accepted behaviour still works: the application and its routing, the GoHighLevel calendar (stubbed), My story, the privacy notice and the language toggle.

## Sprint Definition of Done

- Selected stories satisfy their acceptance criteria and moved their copy out of `CONTENT_PHASE_2D.md`.
- GitHub Actions green on `main`; the preview publishes.
- The owner's calendar check (US-037) recorded.
- The preview reviewed with Gaby (Sprint Review).
- No known critical regression.
- Human reviewer approves.

## Risks

- **The scaffold touches every agent's strings.** It merges first and fast; the other branches start from it, so the voseo pass is never redone.
- **Gaby's answers** on points 4 and 6 may arrive mid-sprint. Point 6 changes one function and its tests (US-044); point 4, if she asks for the figures, needs a docs PR first and holds US-045.
- **GoHighLevel's API** is verified against its documentation in US-045 and only exercised for real by the owner. A mismatch found then is a small follow-up in the client module.
- **The required shares question** and the new copy keys need Gaby's wording; until she validates the English and the new keys, they carry the pending badge (UX §6.5).
- **Removing pages** (library, Método Polaris) can leave links behind; US-046 AC3 and the integration check look for them.

## Important

Planned on 2026-11-24 by the coordinator, after the human owner's "add it to the Sprint 005 plan, and close Sprint 004". When the go-ahead is given (gate 16), the coordinator:
1. archives the Sprint 004 sessions;
2. launches the agents and the review-only agent with the prompts in [`SPRINT_005_AGENT_PROMPTS.md`](SPRINT_005_AGENT_PROMPTS.md);
3. records the session IDs there.
