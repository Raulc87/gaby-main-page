# SPRINT 005 — CLOSED

## Metadata
- Status: CLOSED on 2026-11-24 (close-out below; approved by the human owner by merging it). The go-ahead was given on 2026-11-24 (Entry Gates, gate 16); agents launched the same day ([`SPRINT_005_AGENT_PROMPTS.md`](SPRINT_005_AGENT_PROMPTS.md) → Session IDs)
- Duration: 8 business days
- Saturdays and Sundays excluded
- Start: 2026-11-25 (the first business day after the go-ahead; agents began on their own files on 2026-11-24)
- End: 2026-12-04 (8 business days), with the Sprint Review on the preview, with Gaby
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
| 1 | Sprint 004 closed ([`SPRINT_004.md`](SPRINT_004.md) close-out) | Done in #88 (approved by the human owner, 2026-11-24) |
| 2 | Paths in [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) exist (§1, blocking) | Done, except `docs/ux/CONTENT_PHASE_2D.md`, which gate 6 adds; `docs/security/PENTEST_PLAN.md` stays "written before the go-live sprint" (US-029 AC5) |
| 3 | [`AGENTS.md`](../../AGENTS.md), [`CLAUDE.md`](../../CLAUDE.md) and the checklist match the Starter Kit (§1, blocking) | Done: kit v1.2.0. The kit's later versions are not synced (the owner's choice, 2026-11-08) |
| 4 | [`README.md`](../../README.md) status matches [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) (§1) | Done in #88, kept current by #90 |
| 5 | Branch names for every story (§1, blocking) | Done (Planned Stories) |
| 6 | Spec v0.7, stories US-040–US-046, UX v1.2, contract v1.3, ADR-007, ADR-008 and the staged phase 2d copy agree (§2, blocking) | Spec, contract, ADRs, UX and stories: done in #85. The staged copy (`CONTENT_PHASE_2D.md`, deleted with the last part, US-046): done in #89 |
| 7 | Every sprint story has testable acceptance criteria (§3, blocking) | Done (#85; reviewed) |
| 8 | Shared interfaces locked (§4, blocking): [`LEAD_API_CONTRACT.md`](../specs/LEAD_API_CONTRACT.md) v1.3 (§11, §12) locked by #85; the route map changes of [`UX_UI_DIRECTION.md`](../ux/UX_UI_DIRECTION.md) §3 are made by the scaffold (merge order step 1) | Done |
| 9 | Personal data (§5, blocking): Ley 8968; two consents; only the result goes to GoHighLevel (pending Gaby's confirmation, brief §8 point 4); the privacy notice names GoHighLevel's role (US-045 AC7). Nothing is public: the preview stores and sends nothing | Done. If Gaby asks for the figures, a docs PR changes FR-035, the notice and its consent before US-045 merges |
| 10 | Security baseline exists and is approved (§5, blocking from this sprint) | Done: [`SECURITY_BASELINE.md`](../security/SECURITY_BASELINE.md) (#75) |
| 11 | Every story touching an OWASP risk has acceptance criteria that verify it (§5, blocking) | Done: US-044 (only the contract's fields leave the browser), US-045 (the token, the outbound request, data minimization), US-040 (a third party removed) |
| 12 | Secret and dependency scanning (§5) | Done: secret scanning with push protection, Dependabot alerts, `npm audit` and `pip-audit` required on `main` |
| 13 | **No agent uses a third party's live account** (owner decision asked on 2026-11-23; this plan proposes it, and merging approves it): agents never load Gaby's live GoHighLevel widget or call its API. Tests use stubs and a fake client; checks against the real account are the owner's, by hand | Approved by the human owner by merging #88 |
| 14 | Developer guide (§6) | Done: [`CONTRIBUTING.md`](../../CONTRIBUTING.md) (#77), corrected by #86 |
| 15 | Workstreams, ownership map, scaffold-first merge order with no cycle, conflict rule, prompts with the merge, review-flow, attribution and reviewer-independence rules (§7, §7.1, blocking) | Done in #88 ([`SPRINT_005_AGENT_PROMPTS.md`](SPRINT_005_AGENT_PROMPTS.md)) |
| 16 | Go-ahead from the human owner (§8, blocking) | Done: given on 2026-11-24, after #86, #87, #88 and #89 merged |

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
| US-041 Voseo, the Wealth Mastery name, the menu and routes (the scaffold) | 5 | Agent 1 | Gate 6 (the staged copy) | `GK-041-voseo-wealth-mastery` | Done (#91) |
| US-043 Home for phase 2d | 3 | Agent 1 | `GK-041-voseo-wealth-mastery` | `GK-043-home` | Done (#95) |
| US-040 Self-hosted typefaces | 2 | Agent 1 | `GK-041-voseo-wealth-mastery` (both touch the layout) | `GK-040-self-hosted-fonts` | Done (#96) |
| US-046 Withdraw the resource library | 3 | Agent 2 | `GK-041-voseo-wealth-mastery`; `GK-043-home` merged (the Home's calculator teaser imports the resource data and links the library) | `GK-046-withdraw-library` | Done (#101) |
| US-044 Gaby's calculator | 5 | Agent 2 | `GK-041-voseo-wealth-mastery`; built on `GK-045-ghl-contacts`, and its PR targets that branch (the v1.3 client and endpoint land together, merge order step 3) | `GK-044-calculator` | Done (#93, in #92) |
| US-045 Calculator leads v1.3 and the GoHighLevel contacts | 5 | Agent 3 | `GK-041-voseo-wealth-mastery` (both touch `privacy.ts`); merges to `main` only together with `GK-044-calculator` (merge order step 3) | `GK-045-ghl-contacts` | Done (#92) |
| US-042 Wealth Mastery page | 5 | Agent 3 | `GK-041-voseo-wealth-mastery` (the route and its stub) | `GK-042-wealth-mastery-page` | Done (#97) |

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
| `src/components/method/**`, `src/i18n/{es,en}/method.ts`, `src/pages/es/metodo-polaris/**`, `src/pages/en/polaris-method/**`, `tests/e2e/method.spec.ts` (deleted in `GK-042-wealth-mastery-page`) | Agent 3, **to delete them** in `GK-042-wealth-mastery-page` (they were Agent 1's) |
| `src/components/mastery/**` (new), `src/i18n/{es,en}/mastery.ts` (new), `src/pages/{es,en}/wealth-mastery/**` (stub by Agent 1 in the scaffold, then Agent 3's), `tests/e2e/mastery.spec.ts` (new) | Agent 3 |
| `src/components/lead/**`, `src/components/resources/**` (to delete), `src/components/calculator/**`, `src/lib/lead/**`, `src/lib/calculator/**`, `src/data/resources.ts` (to delete) | Agent 2 |
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

**Cycle check:** `GK-043`, `GK-042` and `GK-040` wait on `GK-041` (Agent 1 works on `GK-043` before `GK-040`, an order of work, not a merge dependency); `GK-046` waits on `GK-041` and `GK-043`; `GK-044` is built on `GK-045`, which waits on `GK-041`, and the pair merges to `main` as one; nothing waits on a branch that waits on it. No cycle.

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

## Close-out (2026-11-24)

Every planned story is merged, eight business days early, in the planned order: the scaffold first (#91, step 1); the calculator (#93) merged into the GoHighLevel branch, and the pair reached `main` together as #92 (step 3); in step 2, which runs in parallel, the self-hosted typefaces (#96), the Home (#95) and the Wealth Mastery page (#97), in that merge order; and the library removal (#101) last, after the Home. Every implementation PR had a review-only agent review ("Ready for human approval" at its merged head, or confirmed for that head right after the merge: #101) and a Codex review before the human owner merged it.

**Integration check** (merge order step 4, Agent 2, 2026-11-24, on `main` at `d9db8cd`): passed.
- On a fresh checkout: lint clean; `astro check` 0 errors; 574 unit, 432 pytest and 309 e2e tests (backend in memory mode); the build has 13 pages and none of the removed ones; the docs link check 0 broken.
- A sweep at 390 and 1280 px of every page in both languages, on the normal build (with the backend) and the preview build: 1,286 checks, 0 failures; on the deployed preview: 656 checks, 0 failures. No request to Google Fonts, GoHighLevel or any other host (and none to `/api` in the preview); no link to a removed page; the removed paths answer 404 on a static host; the language toggle keeps the page; the calculator stores exactly the v1.3 fields (no figures) and shows "4,4" in the alert zone with the concentration alert, a failed save keeps the result hidden, and the preview stores nothing; the application routes qualified and not-ready answers in both languages.

**Done (28 points):** US-041 (#91), US-043 (#95), US-040 (#96), US-044 (#93, inside #92), US-045 (#92), US-042 (#97), US-046 (#101). Chores: #98 (the security baseline records the self-hosted typefaces), #100 (dead pending-badge entries), #102 (library-withdrawal e2e checks). Docs PRs: #88 (Sprint 004 close-out, this plan), #89 (the staged phase 2d copy), #90 (go-ahead and session IDs), #94 (contract 1.3.1), #99 (self-hosted typefaces in UX 1.2.1 and TECH_STACK 0.4.2; the GoHighLevel runbook). Before the go-ahead: #86 and #87 (the `PUBLIC_SCHEDULER_URL` rename).

**Owner decisions recorded during the sprint** (given in the coordinator's session and relayed on the PRs; merging this docs PR confirms them in the owner's name):
- #86, 2026-11-24: the `.env.example` placeholder for `PUBLIC_SCHEDULER_URL` kept as written (merged as is; Agent 3 had recommended an empty value).
- #91, 2026-11-24: "Accept both": the voseo of six descriptions in Agent 2's `src/data/resources.ts`, and two header-link tests removed from Agent 3's `tests/e2e/method.spec.ts`, beyond the scaffold's written exception.
- #92, 2026-11-24: "Accept + 'superseded'": the resend command marks an older duplicate row `superseded` instead of resending it; contract 1.3.1 (#94), refined in review so that only a later `sent`, `failed` or `pending` row supersedes (a later `off` row does not).
- #93, 2026-11-24: "Only the body": of the calculator's three team-written lines, only `calc.capture.body` carries the pending badge.
- US-046, 2026-11-24: "Exception for GK-046": Agent 2 removes what only the library used in Agent 1's and Agent 3's files, and points My story's link at the calculator.
- #97, 2026-11-24: the three uses of others' files listed in its Ownership (Agent 1's `index.ts`/`common.ts` and two e2e specs; one plain-text link in this plan), accepted by merging, as the reviewer and the coordinator recommended.
- 2026-11-24: the coordinator resolved the main-merge conflicts of #92, #95, #97 and #101 at the owner's request ("resolve … conflicts"); for #92 and #95 the author's identical merge was pushed first and kept.

**Process incidents and what changed:**
- **Crossing messages on a shared branch.** When the coordinator announced a hold and merged `main` into an agent's branch itself (#92, #95), the agent had already pushed the same merge; for #97, an agent pushed two follow-ups after a "do not push" that had not reached it yet. Scheduled messages arrive one to two minutes late, and in one case 9 h 40 min late. No work was lost (the trees were identical, and the follow-ups were kept on the owner's side of the trade-off), but it cost review rounds. Rule for the next sprint: before touching an agent's branch, the coordinator checks the remote head, asks the author, and waits for its acknowledgement; or, simpler, asks the author to do the merge with the exact resolution.
- **A hung CI job.** On #91 the `e2e` job sat for 30 minutes on "Install Playwright browsers" before any test ran. The coordinator's attempt to cancel it was blocked by the session's permissions; Agent 1 cancelled and re-ran it once (allowed: no test had run), and it passed.
- **#93 merged into its base branch before that branch had merged `main`**, earlier than step 3 said. No harm: the combined head was merged with `main` afterwards and re-reviewed before #92 reached `main`.
- **A contract wording gap**, caught in review: the first text of 1.3.1 let a later `off` row supersede an older unsent one, which would have left a lead never sent. Fixed before merge (#94); the code already handled it.
- **A coordinator instruction broke a check:** asking Agent 2 to leave `PROJECT_CONTEXT.md` alone left a link to the deleted staging file, turning #101's docs link check red; fixed in #101 with a one-line edit at the coordinator's request.
- **A plan gap found by an agent:** UX 1.2 added two colour tokens (`terracotta-soft`, `alert-tint`) that no story assigned; Agent 2 found it and Agent 1 added them in the scaffold (#91).

**Sprint Definition of Done:**
- [x] Stories meet their acceptance criteria and moved their copy out of `CONTENT_PHASE_2D.md`, deleted once empty (#101), **except US-040 AC3 ("looks as it does today"), partly met**: the review of #96 found the files identical to the upstream fonts, but no before/after comparison was possible (the agents cannot reach Google Fonts). The owner compares the typefaces on the preview (Follow-ups).
- [x] GitHub Actions green on `main`; the preview publishes (checked by the integration check).
- [ ] The owner's calendar check (US-037): carried. It needs a build with a backend and a real calendar URL; see "Testing with Gaby" below.
- [ ] The preview reviewed with Gaby (Sprint Review): carried to the functional test with Gaby (below).
- [x] No known critical regression.
- [x] Human reviewer approves the sprint: the human owner, 2026-11-24 (verbatim, in the coordinator's session): "102 merged, write the close-out now".

**Testing with Gaby (proposal, owner decision needed).** The GitHub Pages preview cannot test the funnel: it is static, has no backend, and by design (ADR-005, FR-030) stores and sends nothing and shows a stand-in instead of the calendar. A functional test, a calculator lead or an application reaching the sheet and Gaby's GoHighLevel and her real calendar, needs a **staging environment**: the site built without preview mode, pointing at a running backend with a test Google Sheet, `GHL_SYNC` on with Gaby's token, and `PUBLIC_SCHEDULER_URL` set. Options and the coordinator's recommendation are in the owner's session; the chosen one becomes an ADR and a story for Sprint 006.

**Follow-ups, for the Sprint 006 plan:**
- The staging environment (above), then the owner's checks with it: the calendar (US-037), the contacts with Gaby's token (US-045, ADR-008 → Validation), and the Sprint Review with Gaby on it.
- Gaby's GoHighLevel set-up (token with contacts access only, location id, custom fields, tags; `docs/runbooks/GOHIGHLEVEL.md`) and her workflows and texts (US-038, US-039).
- From Gaby: the "Flags for Gaby" list (formerly at the end of the staging file; in the history at #89), her answers on brief §8 points 4 and 6, the FAQ answers, the "Quién te guía" photo, the hero photo, testimonials, the English review; deleting the test contact `ana.perez@example.com` (Sprint 004 incident).
- Owner: compare the typefaces on the preview, to settle US-040 AC3 (partly met; see the Definition of Done).
- Done in this close-out: `ADR-003_I18N_ROUTING.md` gets a phase 2d update, because its 2026-10-16 route list still named the removed `resources` and the old `vip` paths (the reviewer's nit on #91 and #103).
- Kept in the backlog: the `LeadForm` defaults and `SECTION_IDS` cleanup; moving `PendingBadge`; the Vite preview server answering unknown paths with 200 in e2e (a static host returns 404).

**Retrospective (short):**
- What worked: the staged copy in parts, each moved by its story, kept seven stories editing `CONTENT.md` without one wrong value (the reviewer verified 229 staged rows by key: 226 on #97, 3 more on #101); the joint merge of the calculator and its endpoint kept `main` green through a breaking contract change; the integration check found nothing to fix.
- What to keep: owner decisions quoted on the PR they concern; the reviewer re-checking every merge of `main`.
- What to change: one writer per branch (see the first incident); plan every token and shared string a story needs (the colour tokens); a staging environment before the next review with Gaby.
