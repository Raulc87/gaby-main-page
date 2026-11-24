# SPRINT 006 — PLANNED

## Metadata
- Status: PLANNED — waiting for the human owner's go-ahead (Entry Gates, gate 12)
- Duration: 3 business days
- Saturdays and Sundays excluded
- Start: the first business day after the go-ahead
- End: 3 business days after the start, then the owner's deploy and checks, and Gaby's test on the demo
- Final reviewer: Human project owner

## Sprint Goal

Gaby can test the real funnel privately, before she decides to switch gabykelly.com from her GoHighLevel funnel to this site: a password-protected demo at `https://gabydemo.digitalstrike-solutions.com/` ([ADR-009](../decisions/ADR-009_DEMO_ENVIRONMENT.md)), with the documentation, the build artifact and the checklists the owner needs to deploy it and run the checks, and Gaby needs to test it.

## Required Deliverable

- **The demo section of [`DEPLOYMENT.md`](../runbooks/DEPLOYMENT.md):** the subdomain and its folders, the build values, the password and `noindex` file, the test sheet and `GHL_SYNC=on`, and a smoke check with its expected answers.
- **A cleanup list** in [`GOHIGHLEVEL.md`](../runbooks/GOHIGHLEVEL.md).
- **Gaby's test checklist in Spanish**, `docs/runbooks/DEMO_GABY_CHECKLIST_ES.md`.
- **A manually started workflow** that builds the demo's static site and packages `api/` as downloadable artifacts. It holds no secrets and deploys nothing.
- **The security baseline** records the demo environment.

After the sprint's PR merges: the owner deploys the demo from the artifact and runs ADR-009 → Validation. Then Gaby runs her checklist, which is the Sprint Review carried from Sprint 005.

No production deployment (US-014 waits on Gaby's decision).

## Entry Gates

Readiness checklist run on 2026-11-24 on the documents as #104 and this planning PR leave them ([`docs/checklists/SPRINT_READINESS_CHECKLIST.md`](../checklists/SPRINT_READINESS_CHECKLIST.md), kit v1.2.0).

| # | Gate (checklist section) | Status |
|---|---|---|
| 1 | Sprint 005 closed ([`SPRINT_005.md`](SPRINT_005.md) close-out) | Done in #103 (approved by the human owner, 2026-11-24) |
| 2 | Paths in [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) exist (§1, blocking) | Done; `docs/security/PENTEST_PLAN.md` stays "written before the go-live sprint" (US-029 AC5) |
| 3 | [`AGENTS.md`](../../AGENTS.md), [`CLAUDE.md`](../../CLAUDE.md) and the checklist match the Starter Kit (§1, blocking) | Done: kit v1.2.0 (later versions not synced, the owner's choice, 2026-11-08) |
| 4 | [`README.md`](../../README.md) status matches [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) (§1) | Done in this PR |
| 5 | Branch names for every story (§1, blocking) | Done (Planned Stories) |
| 6 | ADR-009 and US-047 agree with the spec, contract v1.3.1, ADR-001, ADR-005, ADR-006 and ADR-008 (§2, blocking) | Done in #104 |
| 7 | Every sprint story has testable acceptance criteria (§3, blocking) | Done: US-047 AC1–AC7; AC7 is verified by the owner, not by agents |
| 8 | Shared interfaces locked (§4, blocking) | Nothing changes: contract v1.3.1 and the build variables of contract §9 are used as they are |
| 9 | Personal data (§5, blocking): the demo is private (basic authentication over everything, `/api` included) and carries test data only (ADR-009 decision 4); the draft privacy notice stays (ADR-009 → Consequences) | Done |
| 10 | Security (§5, blocking): the baseline exists (#75); US-047 has security criteria (no secret in Git, a workflow, an artifact or chat; the whole subdomain behind the password; test data only); secret scanning, Dependabot, `npm audit` and `pip-audit` required on `main` | Done |
| 11 | **No agent uses a third party's live account, the owner's cPanel or Gaby's GoHighLevel** (Sprint 005 gate 13, extended to the owner's hosting) | Approved by merging this plan |
| 12 | Go-ahead from the human owner (§8, blocking) | Pending |

Non-blocking items, needed for the owner's checks after the sprint, not for merging:
- **From Gaby:** her GoHighLevel set-up ([`GOHIGHLEVEL.md`](../runbooks/GOHIGHLEVEL.md)), consisting of:
  - a private integration token with access to contacts only, given to the owner directly (never in chat, a PR or Git);
  - her location id;
  - the custom fields and tags of contract §12.
  Her email workflows are optional for the first round.
- **From the owner:**
  - the subdomain `gabydemo.digitalstrike-solutions.com` in cPanel;
  - a test Google Sheet with its two tabs and a service account ([`GOOGLE_SHEETS_SETUP.md`](../runbooks/GOOGLE_SHEETS_SETUP.md));
  - the demo's password.
- **Carried from Sprint 005:**
  - the owner's comparison of the typefaces on the preview (US-040 AC3);
  - Gaby's flags, answers, FAQ and photos;
  - deleting the test contact `ana.perez@example.com`.

## Planned Stories

| Story | Points | Owner | Dependencies | Branch | Status |
|---|---:|---|---|---|---|
| US-047 Demo environment for Gaby's functional test | 5 | Agent 1 | ADR-009 (#104) | `GK-047-demo-environment` | To do |

Total: 5 points.

**Owner and Gaby tasks after the merge (no points):**
1. The owner deploys the demo from the workflow's artifact, as the new `DEPLOYMENT.md` section says, and records the deployed commit.
2. The owner runs ADR-009 → Validation: the `401` and `noindex` checks; a calculator lead and an application in both languages reaching the test sheet and Gaby's GoHighLevel with `crm_status` = `sent`; a qualified application showing her calendar prefilled; one booking, then cancelled. This includes the calendar check (US-037) and the US-045 check carried from Sprint 005.
3. Gaby runs her Spanish checklist on the demo (the Sprint Review), then the cleanup list.

**Not in this sprint:** US-038 and US-039 (Gaby's workflows and texts); US-014 (go-live, after Gaby's decision; the penetration test comes before it); US-026, US-017, US-018; US-031 to US-033 (the next kit sync).

## Parallel Workstreams

One implementation agent; the work is documentation, one workflow and the baseline.

### Agent 1 — Demo environment (operations)
- `GK-047-demo-environment` (US-047): one PR with the runbook sections, the checklist, the workflow and the baseline change.

## File Ownership Map

| Path | Owner |
|---|---|
| `docs/runbooks/**` (new: `DEMO_GABY_CHECKLIST_ES.md`), `docs/security/**`, `.github/workflows/demo-build.yml` (new) | Agent 1 |
| Every other workflow in `.github/workflows/**`, `.github/scripts/**`, `src/**`, `api/**`, `tests/**`, `public/**`, configuration files | Nobody this sprint: Agent 1 asks the coordinator if US-047 needs a change there |
| `docs/**` except `docs/runbooks/**` and `docs/security/**`, [`AGENTS.md`](../../AGENTS.md), [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md), [`README.md`](../../README.md), [`TECH_STACK.md`](../../TECH_STACK.md) | Human owner (the coordinator proposes changes through PRs) |

No recorded exceptions.

## Integration Contract

Locked, used as is:
- [`LEAD_API_CONTRACT.md`](../specs/LEAD_API_CONTRACT.md) v1.3.1, in particular:
  - §9: the build and server variables;
  - §12: what reaches GoHighLevel.
- [ADR-009](../decisions/ADR-009_DEMO_ENVIRONMENT.md): the demo's address, privacy, data and secrets.

## Merge / Integration Order

1. `GK-047-demo-environment` (Agent 1), reviewed and merged.
2. The workflow is run once on `main` by the owner (or the coordinator at the owner's request) to produce the artifact; the coordinator checks that the artifact holds the demo build (preview mode off, the calendar URL set, base path `/`) and no secret.
3. The owner's deploy and checks, then Gaby's test (Planned Stories → Owner and Gaby tasks).

**Cycle check:** one branch; no dependencies between agents. No cycle.

## Conflict Resolution

- One writer per branch: only the author pushes to `GK-047-demo-environment`. If a merge of `main` is needed, the author does it. The coordinator never pushes to an agent's branch (the Sprint 005 lesson).
- If a conflict reveals a contract or requirement gap, stop and apply change management (spec first).

## Review Model

As in Sprint 005 ([`SPRINT_005_AGENT_PROMPTS.md`](SPRINT_005_AGENT_PROMPTS.md) → Coordination; [`SPRINT_006_AGENT_PROMPTS.md`](SPRINT_006_AGENT_PROMPTS.md)): the author requests the review-only agent after every push with a one-off scheduled message that has a fire time; Codex reviews too; the owner merges.

## Integration Safety

- CI green on `main`, and the preview unchanged (this sprint changes no site code).
- The workflow's artifact holds no secret: the reviewer and the coordinator inspect it.
- No step deploys anywhere; the owner deploys by hand.

## Sprint Definition of Done

- US-047 AC1–AC6 merged; AC7 recorded by the owner in this file's close-out.
- GitHub Actions green on `main`; the preview publishes.
- The demo deployed and ADR-009 → Validation passed (the owner).
- Gaby has run her checklist (the Sprint Review carried from Sprint 005), and the cleanup list was applied.
- No known critical regression.
- Human reviewer approves.

## Risks

- **The host blocks an outbound call** to Google or GoHighLevel. The smoke check finds it on the first submission, and `crm_status` = `failed` records it without losing the lead. The fallback is the host's support, or ADR-009 option C.
- **Passenger mounts `/api` outside the password**, a known cPanel quirk (`DEPLOYMENT.md` §3). The smoke check's unauthenticated `401` on `/api` catches it.
- **Gaby's set-up is late.** The demo can be checked first with `GHL_SYNC=off` (the sheet and the calendar), then with sync on.
- **Real emails during the test** if Gaby's workflows are active. This is intended, and limited to test addresses (ADR-009 decision 4).

## Important

Planned on 2026-11-24 by the coordinator, after the owner chose the demo on the owner's cPanel ("yes it has Setup Python App") and merged ADR-009 (#104). When the go-ahead is given (gate 12), the coordinator:
1. launches the review-only agent and Agent 1 with the prompts in [`SPRINT_006_AGENT_PROMPTS.md`](SPRINT_006_AGENT_PROMPTS.md);
2. records the session IDs there.
