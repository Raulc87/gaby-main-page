# ADR-005 — Branching, preview and release model

- Status: Proposed (accepted when the Sprint 003 planning PR merges)
- Date: 2026-10-16
- Decision owner: Human project owner
- Related specs: `AGENTS.md` (branch naming, merging), `PROJECT_SPEC.md` v0.5 (FR-030, §11), US-014, US-027, ADR-001, `docs/runbooks/RELEASE.md`

From the Starter Kit's `ADR_BRANCHING_AND_RELEASE_TEMPLATE.md`, adapted: production hosting is not known yet, so this ADR fixes the branching model and the preview now and leaves the production release mechanics to the hosting decision.

## Decision Request
How does work reach Gaby (preview) and, later, production? Does the project need a long-lived `develop` branch? Where does the preview run while the domain and hosting are unknown?

## Context
- Phase 1 had no preview: changes were checked locally, and production (GoDaddy, US-014) never happened.
- Phase 2 needs Gaby to follow progress on a URL (FR-030) before any production hosting exists (the domain may be gabykelly.com or another one; US-014 on hold).
- The repository is public, so GitHub Pages is available at no cost; it serves static files only, under `https://raulc87.github.io/gaby-main-page/`.
- `main` is protected (pull request required, no force pushes or deletions); CI (`frontend`, `e2e`, `pytest`) runs on every pull request.
- One owner, up to three implementation agents and a review-only agent; frequent small merges.

## Options Considered

### Option A — Trunk-based on `main`; every push to `main` publishes the preview to GitHub Pages; production later from release tags (selected)
Pros: one integration branch; the preview always shows exactly what `main` contains; nothing to keep in sync; free.
Cons: `main` must stay presentable (small PRs; pending content is marked, not hidden).

### Option B — `develop` + `main`
Pros: unreleased work is visibly separate.
Cons: every change merges twice; branches drift; CI, the preview, rules, agent prompts and runbooks need a second target. Release tags already separate "integrated" from "in production".

### Option C — Preview on another host (Netlify, Vercel, Cloudflare Pages)
Pros: per-PR previews, root paths.
Cons: another account and token; nothing needed here that Pages lacks for one preview of `main`.

## Decision
Option A.
1. `main` is the only long-lived branch. Story and docs branches (`AGENTS.md` naming) merge through reviewed PRs with the required checks green.
2. **Preview:** a workflow (`.github/workflows/preview.yml`, US-027) builds the site in preview mode on every push to `main` and publishes it to GitHub Pages with the official Pages actions (`actions/upload-pages-artifact`, `actions/deploy-pages`, environment `github-pages`). Preview mode (`PUBLIC_PREVIEW=true` at build time):
   - base path `/gaby-main-page/` (the build takes the base from a variable, so production builds at `/`);
   - `noindex` on every page and a visible preview bar (`UX_UI_DIRECTION.md` §6.6);
   - pending badges on;
   - forms never call an endpoint and load no third party; the scheduler is a static stand-in (FR-030, US-027 AC3).
   Only static files are published: no backend, no secrets. The workflow needs `pages: write` and `id-token: write`.
3. `main` stays presentable: unfinished work is not merged; pending content is shown with the pending badge (BR-011), never invented.
4. **Production** (when the domain and hosting are decided, US-014): release tags (`vMAJOR.MINOR.PATCH`) on a `main` commit that was checked on the preview; the deploy follows `docs/runbooks/DEPLOYMENT.md` for the chosen host, and the smoke test is recorded in the release. Before the first production release, `docs/runbooks/RELEASE.md` gains the release, smoke-test and rollback sections (Starter Kit `RELEASE_TEMPLATE.md`) and this ADR is updated for the host.
5. **Urgent fixes** (after the first production release): `release/vMAJOR.MINOR.x` from the last tag, fix on `GK-FIX-<slug>` with a PR against it, patch release from that branch, then the fix to `main` in a normal PR. `release/*` gets the same protection as `main` and CI runs on PRs to it (`frontend.yml` and `backend.yml` already run on every pull request).
6. **Data:** previews and automated tests never write production data (the marked submissions of each production smoke test, deleted or marked right after, are the only exception). The preview has no backend, so it writes nothing at all.

## Consequences
### Positive
- Gaby can review any time at one stable URL; no production hosting is needed for phase 2a.
- One branch; production changes only deliberately, later.
### Negative / Trade-offs
- The preview URL is public; it is marked, not indexed, and collects nothing.
- One preview (of `main`), not one per PR; PRs are checked locally and by CI.
- The build must honor a base path, so every internal link and asset goes through one helper (`UX_UI_DIRECTION.md` §3).

## Validation
US-027: the workflow publishes on push to `main`; Playwright (or a manual check) on the preview URL: pages, links and assets resolve under `/gaby-main-page/`, `noindex` present, the preview bar shown, the form demonstrates the routing without network calls to `/api` or Calendly.

## Review Trigger
The production host is chosen (update decision 4 and `RELEASE.md`); per-PR previews become necessary; the repository becomes private (Pages for private repositories needs a paid plan).
