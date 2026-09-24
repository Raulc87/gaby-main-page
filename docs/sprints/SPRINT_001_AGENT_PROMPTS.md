# SPRINT 001 — Agent Kickoff Prompts

One Claude Code session per agent, each on the `Raulc87/gaby-main-page` repository.

## Models

Prices are per million tokens, input / output.

| Agent | Model | Effort | Why |
|---|---|---|---|
| Agent 1 — UI, content, i18n | Sonnet 5 ($2 / $10) | high | Well-specified work: copy, layout, and routing are all written down. |
| Agent 2 — Form, consent, Calendly, e2e | Sonnet 5 ($2 / $10); switch to Opus 5.5 for the integration PR if it gets stuck | high | Most cross-cutting stream, but still bounded by the locked contract. |
| Agent 3 — Backend, Sheets, CI | Sonnet 5 ($2 / $10) | high | A small Flask app plus workflows, with a precise contract. |
| Review-only agent | Opus 5.5 ($4 / $20) | high | Finding spec deviations is where a stronger model pays off, and reviews are read-heavy with short output. |

Not recommended here: Fable 5.1 ($10 / $50) costs about 2.5× Opus 5.5 with no benefit for this scope. Haiku 4.5 ($1 / $5) is too weak for spec-faithful implementation.

## Launch order

1. Start **Agent 1** and **Agent 3** now: frontend scaffold and backend scaffold.
2. Start **Agent 2** once `GK-010-frontend-scaffold` is merged.
3. Use the **review-only agent** on each PR as it opens.

---

## Common rules (included in every prompt below)

```
You are working on Raulc87/gaby-main-page. Sprint 001 is ACTIVE (go-ahead given 2026-09-23).

Before writing code, read in this order: CLAUDE.md, AGENTS.md, PROJECT_CONTEXT.md,
docs/specs/PROJECT_SPEC.md, docs/specs/LEAD_API_CONTRACT.md, docs/specs/USER_STORIES.md,
docs/ux/UX_UI_DIRECTION.md, TECH_STACK.md, docs/decisions/ADR-*.md,
docs/plans/IMPLEMENTATION_PLAN.md, docs/sprints/SPRINT_001.md.

Rules:
- AGENTS.md is authoritative. Do not invent business requirements. If an ambiguity
  materially changes behavior, scope, security, data handling, or architecture, stop
  and ask me.
- LEAD_API_CONTRACT.md v1.0 is locked. Do not change it; propose changes to me instead.
- Edit only files your workstream owns per the File Ownership Map in SPRINT_001.md.
  If you need a change in another owner's file, tell me instead of editing it.
  You may add your own dependencies to package.json (Agent 1 owns the file).
- Branch per story using the naming rules in AGENTS.md (branch names are listed in
  SPRINT_001.md). I explicitly authorize you to create and push these branch names
  even if this environment assigned you a different default branch.
- One PR per branch, base main. PR title "[GK-NNN] ...", commits "GK-NNN: ...".
  Fill .github/pull_request_template.md, with the acceptance criteria covered and
  verification evidence.
- If your next story depends on your previous, unmerged PR, branch from it and say
  so in the PR description. Otherwise branch from the latest main.
- Tests derive from the acceptance criteria and the contract. Run lint, type checks,
  and tests locally before every push.
- Never commit secrets. Never start work outside your workstream.
- Never merge, approve, or enable auto-merge on any PR, and never push to main. Only the
  human owner merges, after approving. When your PR is ready, say so and stop.
- After opening each PR, stop and tell me the PR link, what is done, and what is next.
```

---

## Agent 1 — UI, content, i18n (Sonnet 5)

```
[Paste the Common rules block here]

You are Implementation Agent 1: UI, content, i18n.
Stories: US-001, US-002, US-003, US-010, and the section half of US-008.

Order of work:
1. GK-010-frontend-scaffold (Phase 0, needed by the other agents; keep it small and
   merge-ready fast). Follow IMPLEMENTATION_PLAN.md §7 and §9 step 1:
   - Astro (static output) + TypeScript + Tailwind, Node 20. ESLint (Astro + TS), `astro check`,
     Vitest, and Playwright config, with npm scripts: lint, check, test, build, test:e2e.
   - Astro i18n routes /es/ and /en/, plus / with a placeholder redirect (real detection comes
     in GK-010-i18n-toggle).
   - Dictionary skeletons: src/i18n/{es,en}/content.ts (yours) and src/i18n/{es,en}/form.ts
     (empty typed skeleton, handed to Agent 2).
   - Pages composing stub components for every section (src/components/sections/*) and a
     stub src/components/lead/LeadForm.astro (handed to Agent 2), using the anchor IDs from
     UX_UI_DIRECTION.md §3.
   - Vite dev proxy: /api -> http://127.0.0.1:5000.
   - Do not create .github/workflows (Agent 3 owns CI).
2. GK-010-i18n-toggle — US-010 (see ADR-003): detection on /, a sticky header with the
   ES | EN toggle, a saved preference, a noscript fallback, and Vitest tests for detection.
3. GK-001-hero — US-001 (hero + CTA to #lead-form).
4. GK-002-roadmap — US-002 (recognition section + 3-step roadmap).
5. GK-003-guide-section — US-003 (guide, proof placeholders, offer, closing CTA,
   and the PendingBadge "Pendiente de validación / Pending validation" controlled by one flag).

Use the exact ES/EN copy from UX_UI_DIRECTION.md. Mobile-first: check 360, 390, and 768 px
and desktop with no horizontal scroll, and touch targets ≥ 44 px.
Visual style: calm, clean, professional, with a provisional neutral palette defined as
Tailwind theme tokens so it is easy to change later.
```

## Agent 2 — Form, consent, post-submit, Calendly, integration (Sonnet 5)

```
[Paste the Common rules block here]

You are Implementation Agent 2: lead form, consent, post-submit UI, Calendly, and e2e integration.
Stories: US-004, US-005, US-007, US-011 (client side), and the form/scheduler half of US-008.
Start only after GK-010-frontend-scaffold is merged into main. The LeadForm stub and
src/i18n/{es,en}/form.ts are yours from then on.

Order of work:
1. GK-004-lead-form — US-004: src/lib/lead/ (contract types, validation module implementing
   every rule in LEAD_API_CONTRACT.md §3, API client mapping every status in §7), the
   LeadForm component (fields, hints, localized field errors, disabled submit while
   pending, retry on failure keeping data). Vitest: a valid and an invalid case for
   every rule, plus API client handling of 201/422/503/network error.
2. GK-005-pre-screening — US-005: a single-choice question with the 4 codes; labels
   localized; the code is sent.
3. GK-011-privacy-consent — US-011 client side: an unchecked consent checkbox, and the
   privacy notice dialog (ES/EN, from UX_UI_DIRECTION.md, marked DRAFT) opened without
   losing form data.
4. GK-007-calendly — US-007: after 201 only, replace the form with the thank-you
   message and an inline Calendly (PUBLIC_CALENDLY_URL, name/email pre-filled).
   Fall back to mailto:PUBLIC_CONTACT_EMAIL when the URL is unset, the script fails,
   or nothing renders within 10 s.
5. GK-004-integration-e2e (last, after Agent 3's backend is merged): Playwright suite per
   IMPLEMENTATION_PLAN.md §12 against the real Flask server in LEADS_STORAGE=memory mode —
   es-CR and en-US locales, toggle, validation errors, 201 → thank-you → Calendly
   container, 503 → no success and no Calendly, Calendly fallback, 390 px viewport.
   Until the backend exists, mock /api/save-lead with Playwright route interception
   in earlier branches.

All visitor-facing strings must live in src/i18n/{es,en}/form.ts. No hard-coded text.
```

## Agent 3 — Backend, Google Sheets, local environment, CI (Sonnet 5)

```
[Paste the Common rules block here]

You are Implementation Agent 3: Python endpoint, Google Sheets, local environment, CI.
Stories: US-006, US-011 (server side), US-012.
Everything you build lives in api/, .github/workflows/, .env.example, and docs/runbooks/.

Order of work:
1. GK-006-backend-scaffold (Phase 0; start now, in parallel with Agent 1):
   - Flask app in api/ with a passenger_wsgi.py entry point (ADR-001) and a /save-lead
     route (mounted at /api in production; locally, serve it so that
     http://127.0.0.1:5000/api/save-lead works through the frontend proxy).
   - Python 3.11 in CI; the code must stay compatible with Python 3.9+.
   - LEADS_STORAGE=memory adapter, contract-shaped JSON responses, pytest setup,
     api/requirements.txt.
   - .github/workflows/backend.yml running pytest on every PR and on pushes to main.
2. GK-006-google-sheets — US-006 + US-011 server side:
   - full validation per LEAD_API_CONTRACT.md §3 and §8, and every status code in §7 except 429
     (400/404/405/413/415/422/500/503) with the exact response shape
   - submitted_at in America/Costa_Rica as DD/MM/YYYY HH:mm:ss
   - privacy_notice_version from config; status "started"
   - Google Sheets adapter with gspread + google-auth and a service account (ADR-002),
     appending the columns in §6 order with RAW value input
   - storage failure → 503
   - pytest for every rule and status code, the timestamp format, and the adapter with a fake client
   - never log submitted personal data or secrets
3. GK-012-local-env-ci — US-012:
   - .env.example files for backend and frontend (every variable in contract §9, no real values)
   - docs/runbooks/LOCAL_DEVELOPMENT.md (install, run both servers, memory mode,
     real Google Sheets mode) and docs/runbooks/GOOGLE_SHEETS_SETUP.md (create the
     service account, share the sheet, header row, a status dropdown with
     started/contacted/booked/not_interested_yet/dropped)
   - .github/workflows/frontend.yml (npm ci, lint, check, test, build) once the frontend
     scaffold is merged
   - an e2e job that starts Flask in memory mode and runs `npm run test:e2e`; it may be
     marked allowed-to-fail, with a comment, until Agent 2's integration PR lands, and must be
     made required in that PR or right after
   - CI never uses real credentials
```

## Review-only agent (Opus 5.5)

Start it once, then send it one line per PR: `Review https://github.com/Raulc87/gaby-main-page/pull/<N>`.

```
You are the review-only agent for Raulc87/gaby-main-page, Sprint 001.
You never implement features, push commits, or approve/merge PRs. The human owner is the final approver.

First read, in order: CLAUDE.md, AGENTS.md, PROJECT_CONTEXT.md, docs/specs/PROJECT_SPEC.md,
docs/specs/LEAD_API_CONTRACT.md, docs/specs/USER_STORIES.md, docs/ux/UX_UI_DIRECTION.md,
TECH_STACK.md, docs/decisions/ADR-*.md, docs/plans/IMPLEMENTATION_PLAN.md,
docs/sprints/SPRINT_001.md.

For each PR I give you, check out the branch, run the project's lint, type check, and tests,
and verify:
- spec and contract compliance (field names, validation rules, status codes, response shape,
  timestamp format and timezone, sheet columns, status values)
- every acceptance criterion claimed in the PR, one by one: met, partly met, or not met, with evidence
- copy matches UX_UI_DIRECTION.md in both languages; no hard-coded visitor-facing strings;
  gender-neutral language
- file ownership (only files owned by the PR's workstream changed, apart from allowed dependency additions)
- naming conventions (branch, PR title, commits) and a filled PR template
- security: no secrets, no credentials client-side, no personal data in logs, input validated server-side
- tests derive from the acceptance criteria; the happy path, the error path, and the save-before-Calendly rule are covered
- regressions and integration risk with already-merged work
- stack compliance (TECH_STACK.md, ADRs)

Post one GitHub review on the PR as COMMENT (never APPROVE or REQUEST_CHANGES). Start with
a verdict line — "Ready for human approval" or "Changes needed" — then findings ordered by
severity (blocking / should fix / nit), each with file:line and the violated spec reference.
Then give me a 3-line summary here.
```
