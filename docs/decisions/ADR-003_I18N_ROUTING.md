# ADR-003 — Bilingual page with static language routes

- Status: Accepted (updated 2026-10-16 for the phase 2 multipage site; see Update below)
- Date: 2026-09-23
- Decision owner: Human project owner
- Related specs: FR-012, US-010, `UX_UI_DIRECTION.md` section 3

## Decision Request
How is Spanish/English content delivered, with browser-language detection and a manual toggle?

## Options Considered

### Option A — Two static routes (`/es/`, `/en/`) with Astro i18n routing; `/` redirects (selected)
Pros: each version is plain HTML (fast, indexable, works without JS); no translation runtime; clean `<html lang>`.
Cons: `/` needs a tiny inline script for detection.

### Option B — Single page, swap text with client-side JavaScript
Pros: one URL.
Cons: flash of wrong language, content invisible without JS, worse SEO, larger JS.

## Decision
Option A.

- Translation strings live in typed dictionaries per namespace and language (`src/i18n/{es,en}/content.ts`, `src/i18n/{es,en}/form.ts`), so agents do not edit the same file.
- `/` contains an inline script: use the saved choice (`localStorage` key `preferred_language`) if present; otherwise `navigator.languages[0]` (or `navigator.language`) starting with `es` → `/es/`, else `/en/`. It keeps the URL hash. A `<noscript>` block links to both versions.
- The toggle links to the same anchor in the other language and saves the choice.
- Storage access is wrapped in try/catch; if unavailable, detection still works.

## Consequences
- Every visitor-facing string must exist in both dictionaries (type-checked).
- Section anchor IDs are shared across languages.

## Validation
Vitest for the detection function; Playwright with `locale` set to `es-CR` and `en-US`, and toggle behavior.

## Review Trigger
A third language is required, or SEO needs change.

## Update — 2026-10-16: multipage site (phase 2)

`PROJECT_SPEC.md` v0.5 (FR-017) turns the one page into several pages. The decision stays (static routes per language, `/` detects); it extends to every page:

- Each page has a stable **page id** and a path per language, localized for readers: `home` `/es/` `/en/`; `story` `/es/mi-historia/` `/en/my-story/`; `resources` `/es/recursos/` `/en/resources/`; `vip` `/es/mentoria-vip/` `/en/vip-mentorship/`; `privacy` `/es/privacidad/` `/en/privacy/`; later `blog` and `method` (`UX_UI_DIRECTION.md` §3).
- The routes live in one typed map (page id → path per language) in `src/i18n/`; pages, the navigation, the language toggle and tests read it. No path is written by hand in a component.
- The toggle switches to the same page id in the other language and keeps the anchor; it saves the choice as before. A blog post without a translation leads to the other language's blog list (FR-027).
- Every path is prefixed with the site's base path (`import.meta.env.BASE_URL`), so the same build works at the root and under `/gaby-main-page/` on the GitHub Pages preview (ADR-005).
- Translation dictionaries are split per page (`src/i18n/{es,en}/<page>.ts`) plus shared ones (`common.ts` for header, footer, CTAs, VIP band; `form.ts` for the form), so agents working on different pages do not edit the same file. Strings come verbatim from `docs/ux/CONTENT.md`.
- Section anchors are shared by both languages (`UX_UI_DIRECTION.md` §3).

Validation adds: a unit test that every page id has a path in both languages and every path is unique; e2e that the toggle keeps the page in both directions for every page.

