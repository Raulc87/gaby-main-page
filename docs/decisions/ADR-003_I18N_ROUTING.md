# ADR-003 — Bilingual page with static language routes

- Status: Accepted
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
