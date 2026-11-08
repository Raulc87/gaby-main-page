# ASVS_INVENTORY

Appendix of [`SECURITY_BASELINE.md`](SECURITY_BASELINE.md) section 2. The site stores personal data, so its ASVS level (L2) is inventoried requirement by requirement: every L1 and L2 requirement of OWASP ASVS 5.0.0 has its own row. Requirements of the five chapters that do not apply at all (V6, V7, V9, V10, V17) share their chapter's reason. The requirement list comes from the official ASVS 5.0.0 release (`OWASP/ASVS`, tag `v5.0.0`, `OWASP_Application_Security_Verification_Standard_5.0.0_en.json`); L3 requirements are outside the chosen level.

Status values:
- **Verified 2026-11-08**: checked on `main` at commit `220af67` (plus the named pull requests where stated) by running the named tests, reading the named configuration or searching the code, as the row says. This is a statement about what was checked on that date, not a claim that the site is secure or compliant.
- **Planned**: an acceptance criterion in `docs/specs/USER_STORIES.md` covers it and has not been verified yet (most are production configuration, which waits for US-014). The review-only agent checks the criterion when the story is reviewed.
- **Accepted risk**: not met, with a named risk in the baseline section 7 that the owner accepts by approving the baseline.
- **Not applicable**: with the reason.

Updating this file: when a story's pull request verifies a row, that pull request changes the row to `Verified <date>` and names its evidence.

| ASVS requirement | Level | Covered by | Status | Not applicable because |
|---|---|---|---|---|
| `v5.0.0-1.1.1` | L2 | The backend only normalizes (trim, lowercase, collapse spaces) after Flask parses the JSON body once; nothing is decoded a second time (`api/tests/test_validation.py`, `api/tests/test_save_lead.py`; code search of `src/` and `api/` on 2026-11-08: no further decoding) | Verified 2026-11-08 |  |
| `v5.0.0-1.1.2` | L2 | Astro escapes every value it renders and Flask returns JSON through `jsonify`; no user value is placed into HTML by hand (code search of `src/` and `api/` on 2026-11-08: no `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `set:html`); US-004 AC9 adds a test for each place a form value is reused | Verified 2026-11-08 |  |
| `v5.0.0-1.2.1` | L1 | As V1.1.2; US-004 AC9 (planned test) covers values shown again or passed on | Verified 2026-11-08 |  |
| `v5.0.0-1.2.2` | L1 | The scheduler's prefilled URL is built with `URLSearchParams` (`src/components/lead/schedulingController.ts`); US-004 AC9 covers it with a test | Verified 2026-11-08 |  |
| `v5.0.0-1.2.3` | L1 | The site builds no JavaScript or JSON from untrusted data; the only `JSON.parse` reads build-time copy placed in a `data-` attribute (code search of `src/` and `api/` on 2026-11-08) | Verified 2026-11-08 |  |
| `v5.0.0-1.2.4` | L1 |  | Not applicable | There is no database and no query language; the only store is the Google Sheets append call, with values sent as raw text (US-006 AC5, contract section 6), so no value is interpreted as a formula |
| `v5.0.0-1.2.5` | L1 | The application makes no operating-system calls (code search of `src/` and `api/` on 2026-11-08: no `subprocess`, `os.system`, `exec`) | Verified 2026-11-08 |  |
| `v5.0.0-1.2.6` | L2 |  | Not applicable | No LDAP is used |
| `v5.0.0-1.2.7` | L2 |  | Not applicable | No XML or XPath is used |
| `v5.0.0-1.2.8` | L2 |  | Not applicable | No LaTeX is processed |
| `v5.0.0-1.2.9` | L2 |  | Not applicable | Regular expressions in `api/validation.py` are fixed patterns; no untrusted value is ever compiled into one |
| `v5.0.0-1.3.1` | L1 |  | Not applicable | The site has no WYSIWYG editor or other user-supplied HTML |
| `v5.0.0-1.3.2` | L1 | The application uses no dynamic code execution (code search of `src/` and `api/` on 2026-11-08: no `eval`, `new Function`, `exec`) | Verified 2026-11-08 |  |
| `v5.0.0-1.3.3` | L2 |  | Not applicable | No untrusted data reaches a dangerous interpreter context (see V1.2.x) |
| `v5.0.0-1.3.4` | L2 |  | Not applicable | The site accepts no user-supplied SVG |
| `v5.0.0-1.3.5` | L2 |  | Not applicable | The site accepts no user-supplied Markdown, CSS or XSL |
| `v5.0.0-1.3.6` | L2 |  | Not applicable | The server never fetches a URL taken from a request; its only outbound calls go to Google's fixed endpoints through `gspread` |
| `v5.0.0-1.3.7` | L2 | The backend renders no templates (code search of `src/` and `api/` on 2026-11-08: no `render_template`); the pages are static files built by Astro | Verified 2026-11-08 |  |
| `v5.0.0-1.3.8` | L2 |  | Not applicable | No JNDI is used |
| `v5.0.0-1.3.9` | L2 |  | Not applicable | No memcache is used |
| `v5.0.0-1.3.10` | L2 | No log call or message puts a request value in its format string; submitted values are never logged (`api/tests/test_error_logging.py`) | Verified 2026-11-08 |  |
| `v5.0.0-1.3.11` | L2 | No mail is sent today. US-038 AC7 and US-039 AC6 require a test that a name or email containing line breaks cannot add a header or recipient before the funnel emails ship | Planned |  |
| `v5.0.0-1.4.1` | L2 |  | Not applicable | Python and JavaScript are memory-safe and the application contains no native code |
| `v5.0.0-1.4.2` | L2 |  | Not applicable | Python and JavaScript are memory-safe and the application contains no native code |
| `v5.0.0-1.4.3` | L2 |  | Not applicable | Python and JavaScript are memory-safe and the application contains no native code |
| `v5.0.0-1.5.1` | L1 |  | Not applicable | The application parses no XML |
| `v5.0.0-1.5.2` | L2 | The only untrusted data deserialized is the JSON body, read by Flask's JSON parser into plain types and then validated field by field (code search of `src/` and `api/` on 2026-11-08: no `pickle`, `yaml.load`, `marshal`) | Verified 2026-11-08 |  |
| `v5.0.0-2.1.1` | L1 | Validation rules are documented in `docs/specs/LEAD_API_CONTRACT.md` sections 3, 4, 8 and 11.2 | Verified 2026-11-08 |  |
| `v5.0.0-2.1.2` | L2 | Combined-field consistency (calculator `zone` against `months`) is documented in contract section 11.2 and tested in `api/tests/test_calculator_lead.py` (US-036 AC2, PR #73) | Verified 2026-11-08 |  |
| `v5.0.0-2.1.3` | L2 | Limits are documented: body size and rate limit in contract sections 2, 3.2 and 11.1, and ADR-004 | Verified 2026-11-08 |  |
| `v5.0.0-2.2.1` | L1 | Positive validation against allowlists and patterns for every field, client and server (US-004 AC2 to AC5; `api/tests/test_validation.py`, `api/tests/test_save_lead.py`) | Verified 2026-11-08 |  |
| `v5.0.0-2.2.2` | L1 | The server validates every field itself; the client's checks are for usability (US-004 AC2, contract section 3: "applied on client AND server"; `api/tests/test_validation.py`, `api/tests/test_save_lead.py`) | Verified 2026-11-08 |  |
| `v5.0.0-2.2.3` | L2 | US-036 AC2: a `zone` that does not match `months` is a `422`; verified when PR #73 merges | Planned |  |
| `v5.0.0-2.3.1` | L1 | There is no multi-step server-side flow: each endpoint takes one complete request. The calculator shows its result only after a `201` (US-035 AC4); the result is computed in the browser, so skipping that step exposes nothing | Verified 2026-11-08 |  |
| `v5.0.0-2.3.2` | L2 | Per-IP rate limit and 10 KB body limit (US-013 AC3; `api/tests/test_spam_protection.py`, `api/tests/test_rate_limiter.py`) | Verified 2026-11-08 |  |
| `v5.0.0-2.3.3` | L2 | One append call stores a whole row or nothing; a failed save returns `503` and stores nothing partial (US-006 AC3, US-036 AC3; `api/tests/test_save_lead.py`) | Verified 2026-11-08 |  |
| `v5.0.0-2.3.4` | L2 |  | Not applicable | The site has no limited-quantity resource to reserve; scheduling is handled by the booking provider |
| `v5.0.0-2.4.1` | L2 | Honeypot and per-IP rate limit on both lead endpoints, with the calculator on its own budget (US-013 AC1 to AC3, US-036 AC3; `api/tests/test_spam_protection.py`, `api/tests/test_rate_limiter.py`) | Verified 2026-11-08 |  |
| `v5.0.0-3.2.1` | L1 | API responses are JSON with a matching `Content-Type` (`api/tests` check the status and body); `nosniff` and the policy headers are required on production by US-014 AC7 | Planned |  |
| `v5.0.0-3.2.2` | L1 | Text is inserted as text; code search of `src/` and `api/` on 2026-11-08: no `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `set:html`; US-004 AC9 adds a test | Verified 2026-11-08 |  |
| `v5.0.0-3.3.1` | L1 |  | Not applicable | The site sets no cookies: no `document.cookie` and no Flask session (code search of `src/` and `api/` on 2026-11-08). Cookies set by a third party's own widget belong to that provider and are listed in the baseline section 6 |
| `v5.0.0-3.3.2` | L2 |  | Not applicable | The site sets no cookies: no `document.cookie` and no Flask session (code search of `src/` and `api/` on 2026-11-08). Cookies set by a third party's own widget belong to that provider and are listed in the baseline section 6 |
| `v5.0.0-3.3.3` | L2 |  | Not applicable | The site sets no cookies: no `document.cookie` and no Flask session (code search of `src/` and `api/` on 2026-11-08). Cookies set by a third party's own widget belong to that provider and are listed in the baseline section 6 |
| `v5.0.0-3.3.4` | L2 |  | Not applicable | The site sets no cookies: no `document.cookie` and no Flask session (code search of `src/` and `api/` on 2026-11-08). Cookies set by a third party's own widget belong to that provider and are listed in the baseline section 6 |
| `v5.0.0-3.4.1` | L1 | US-014 AC7 (header check on the live site). The GitHub Pages preview cannot set headers; it stores nothing and is not indexed (US-027) | Planned |  |
| `v5.0.0-3.4.2` | L1 | The backend sends no `Access-Control-Allow-Origin` header: page and endpoint share one origin (contract section 2; code search of `src/` and `api/` on 2026-11-08: no CORS library) | Verified 2026-11-08 |  |
| `v5.0.0-3.4.3` | L2 | US-014 AC7 | Planned |  |
| `v5.0.0-3.4.4` | L2 | US-014 AC7 | Planned |  |
| `v5.0.0-3.4.5` | L2 | US-014 AC7 | Planned |  |
| `v5.0.0-3.4.6` | L2 | US-014 AC7 | Planned |  |
| `v5.0.0-3.5.1` | L1 | Cross-origin requests are blocked because the endpoints accept only `application/json`, which a cross-site form or simple request cannot send, and no CORS headers are sent (`415` for other content types; `api/tests/test_save_lead.py`) | Verified 2026-11-08 |  |
| `v5.0.0-3.5.2` | L1 | Same control as V3.5.1: a CORS-safelisted content type such as `text/plain` is refused with `415` | Verified 2026-11-08 |  |
| `v5.0.0-3.5.3` | L1 | Lead submission uses `POST` only; any other method returns `405` (contract section 7; `api/tests/test_save_lead.py`: 405) | Verified 2026-11-08 |  |
| `v5.0.0-3.5.4` | L2 |  | Not applicable | The site is a single application on one hostname |
| `v5.0.0-3.5.5` | L2 |  | Not applicable | The site's own code handles no `postMessage` (code search of `src/` and `api/` on 2026-11-08) |
| `v5.0.0-3.7.1` | L2 | Only current web standards, Astro and TypeScript (`TECH_STACK.md`); no plugins or deprecated technologies | Verified 2026-11-08 |  |
| `v5.0.0-3.7.2` | L2 | The only automatic redirect is the root page's `window.location.replace` to the visitor's own language home, built by the route helper (`src/pages/index.astro`); nothing redirects to another host | Verified 2026-11-08 |  |
| `v5.0.0-4.1.1` | L1 | Every response body is JSON sent by `jsonify` with `Content-Type: application/json` (`api/responses.py`) | Verified 2026-11-08 |  |
| `v5.0.0-4.1.2` | L2 | US-014 AC8: HTTP requests to `/` redirect to HTTPS and HTTP requests to `/api/*` are refused | Planned |  |
| `v5.0.0-4.1.3` | L2 | The backend trusts no header set by an intermediary; the rate limit uses the connection's address only (contract section 3.2: `X-Forwarded-For` is not trusted) | Verified 2026-11-08 |  |
| `v5.0.0-4.2.1` | L2 | HTTP message parsing is done by the hosting provider's web server (ADR-001); the project adds no proxy of its own. See R-8 | Accepted risk |  |
| `v5.0.0-4.3.1` | L2 |  | Not applicable | The site has no GraphQL or similar data-layer query API |
| `v5.0.0-4.3.2` | L2 |  | Not applicable | The site has no GraphQL or similar data-layer query API |
| `v5.0.0-4.4.1` | L1 |  | Not applicable | The site uses no WebSocket |
| `v5.0.0-4.4.2` | L2 |  | Not applicable | The site uses no WebSocket |
| `v5.0.0-4.4.3` | L2 |  | Not applicable | The site uses no WebSocket |
| `v5.0.0-4.4.4` | L2 |  | Not applicable | The site uses no WebSocket |
| `v5.0.0-5.1.1` | L2 |  | Not applicable | The site accepts no file uploads. The free resources are static files chosen by the owner and committed to Git (US-024 AC4); no visitor can supply, name or replace a file |
| `v5.0.0-5.2.1` | L1 |  | Not applicable | The site accepts no file uploads. The free resources are static files chosen by the owner and committed to Git (US-024 AC4); no visitor can supply, name or replace a file |
| `v5.0.0-5.2.2` | L1 |  | Not applicable | The site accepts no file uploads. The free resources are static files chosen by the owner and committed to Git (US-024 AC4); no visitor can supply, name or replace a file |
| `v5.0.0-5.2.3` | L2 |  | Not applicable | The site accepts no file uploads. The free resources are static files chosen by the owner and committed to Git (US-024 AC4); no visitor can supply, name or replace a file |
| `v5.0.0-5.3.1` | L1 |  | Not applicable | The site accepts no file uploads. The free resources are static files chosen by the owner and committed to Git (US-024 AC4); no visitor can supply, name or replace a file |
| `v5.0.0-5.3.2` | L1 |  | Not applicable | The site accepts no file uploads. The free resources are static files chosen by the owner and committed to Git (US-024 AC4); no visitor can supply, name or replace a file |
| `v5.0.0-5.4.1` | L2 |  | Not applicable | The site accepts no file uploads. The free resources are static files chosen by the owner and committed to Git (US-024 AC4); no visitor can supply, name or replace a file |
| `v5.0.0-5.4.2` | L2 |  | Not applicable | The site accepts no file uploads. The free resources are static files chosen by the owner and committed to Git (US-024 AC4); no visitor can supply, name or replace a file |
| `v5.0.0-5.4.3` | L2 |  | Not applicable | The site accepts no file uploads. The free resources are static files chosen by the owner and committed to Git (US-024 AC4); no visitor can supply, name or replace a file |
| `v5.0.0-6.1.1` | L1 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.1.2` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.1.3` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.2.1` | L1 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.2.2` | L1 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.2.3` | L1 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.2.4` | L1 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.2.5` | L1 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.2.6` | L1 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.2.7` | L1 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.2.8` | L1 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.2.9` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.2.10` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.2.11` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.2.12` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.3.1` | L1 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.3.2` | L1 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.3.3` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.3.4` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.4.1` | L1 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.4.2` | L1 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.4.3` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.4.4` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.5.1` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.5.2` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.5.3` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.5.4` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.5.5` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.6.1` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.6.2` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.6.3` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.8.1` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.8.2` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.8.3` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-6.8.4` | L2 | | Not applicable | The site has no user accounts, passwords or login. The only password is the hosting provider's Directory Privacy protection on the production host before go-live (US-014 AC6), set in the hosting account, not by the application. |
| `v5.0.0-7.1.1` | L2 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-7.1.2` | L2 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-7.1.3` | L2 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-7.2.1` | L1 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-7.2.2` | L1 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-7.2.3` | L1 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-7.2.4` | L1 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-7.3.1` | L2 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-7.3.2` | L2 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-7.4.1` | L1 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-7.4.2` | L1 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-7.4.3` | L2 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-7.4.4` | L2 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-7.4.5` | L2 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-7.5.1` | L2 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-7.5.2` | L2 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-7.6.1` | L2 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-7.6.2` | L2 | | Not applicable | The site has no sessions: it sets no cookie or token (V3.3.x) and has no logged-in state. |
| `v5.0.0-8.1.1` | L1 | Documented here: the site has no user roles or consumer permissions. Each endpoint is one public, write-only function (contract sections 2 and 11); the only privileged access is the owner's access to the sheet and the hosting account, outside the application (section 1 of the baseline) | Verified 2026-11-08 |  |
| `v5.0.0-8.1.2` | L2 | Same as V8.1.1: no field is readable through the application, so there are no field-level rules to define | Verified 2026-11-08 |  |
| `v5.0.0-8.2.1` | L1 |  | Not applicable | Both endpoints are intentionally public and offer one function each; there are no restricted functions |
| `v5.0.0-8.2.2` | L1 |  | Not applicable | The application reads nothing back to a visitor, so there is no data-specific access to restrict |
| `v5.0.0-8.2.3` | L2 |  | Not applicable | The application returns no stored fields to a visitor |
| `v5.0.0-8.3.1` | L1 |  | Not applicable | There are no authorization rules to enforce; input validation is enforced server-side (V2.2.2) |
| `v5.0.0-8.4.1` | L2 |  | Not applicable | The site is not multi-tenant |
| `v5.0.0-9.1.1` | L1 | | Not applicable | The site issues and accepts no self-contained tokens (JWT or similar). |
| `v5.0.0-9.1.2` | L1 | | Not applicable | The site issues and accepts no self-contained tokens (JWT or similar). |
| `v5.0.0-9.1.3` | L1 | | Not applicable | The site issues and accepts no self-contained tokens (JWT or similar). |
| `v5.0.0-9.2.1` | L1 | | Not applicable | The site issues and accepts no self-contained tokens (JWT or similar). |
| `v5.0.0-9.2.2` | L2 | | Not applicable | The site issues and accepts no self-contained tokens (JWT or similar). |
| `v5.0.0-9.2.3` | L2 | | Not applicable | The site issues and accepts no self-contained tokens (JWT or similar). |
| `v5.0.0-9.2.4` | L2 | | Not applicable | The site issues and accepts no self-contained tokens (JWT or similar). |
| `v5.0.0-10.1.1` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.1.2` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.2.1` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.2.2` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.3.1` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.3.2` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.3.3` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.3.4` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.4.1` | L1 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.4.2` | L1 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.4.3` | L1 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.4.4` | L1 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.4.5` | L1 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.4.6` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.4.7` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.4.8` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.4.9` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.4.10` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.4.11` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.5.1` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.5.2` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.5.3` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.5.4` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.5.5` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.6.1` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.6.2` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.7.1` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.7.2` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-10.7.3` | L2 | | Not applicable | The site is neither an OAuth or OIDC client nor a provider. The backend's Google access uses a service-account key, not a user authorization flow. |
| `v5.0.0-11.1.1` | L2 | The only key is the Google service-account key; its custody, rotation and revocation are in `docs/runbooks/GOOGLE_SHEETS_SETUP.md` sections 3 and 7 and summarized in the baseline section 6 | Verified 2026-11-08 |  |
| `v5.0.0-11.1.2` | L2 | Cryptographic inventory is in the baseline section 6: no application-level cryptography; TLS is provided by the host; one Google-issued service-account key | Verified 2026-11-08 |  |
| `v5.0.0-11.2.1` | L2 | The application implements no cryptography; TLS is the host's and Google's libraries (`google-auth`) handle signing (code search of `src/` and `api/` on 2026-11-08: no `hashlib`, `secrets`, `random`, `cryptography` use) | Verified 2026-11-08 |  |
| `v5.0.0-11.2.2` | L2 |  | Not applicable | No application-level cryptographic algorithms are chosen by the application |
| `v5.0.0-11.2.3` | L2 |  | Not applicable | No application-level cryptographic primitives; TLS strength is checked at go-live (US-014 AC8) |
| `v5.0.0-11.3.1` | L1 |  | Not applicable | The application encrypts no data itself |
| `v5.0.0-11.3.2` | L1 |  | Not applicable | The application encrypts no data itself |
| `v5.0.0-11.3.3` | L2 |  | Not applicable | The application encrypts no data itself |
| `v5.0.0-11.4.1` | L1 |  | Not applicable | The application uses no hash function |
| `v5.0.0-11.4.2` | L2 |  | Not applicable | The site has no passwords or password-derived keys |
| `v5.0.0-11.4.3` | L2 |  | Not applicable | The application uses no hash function |
| `v5.0.0-11.4.4` | L2 |  | Not applicable | The site has no passwords or password-derived keys |
| `v5.0.0-11.5.1` | L2 |  | Not applicable | The application generates no random value that must be unguessable (code search of `src/` and `api/` on 2026-11-08: no `random`, `uuid`, `secrets`) |
| `v5.0.0-11.6.1` | L2 |  | Not applicable | The application generates no keys and verifies no signatures itself |
| `v5.0.0-12.1.1` | L1 | TLS versions are set by the hosting provider; US-014 AC8 checks that only TLS 1.2 and 1.3 are accepted. See R-8 | Planned |  |
| `v5.0.0-12.1.2` | L2 | Cipher suites are set by the hosting provider (ADR-001); the project cannot configure them on shared hosting. See R-8 | Accepted risk |  |
| `v5.0.0-12.1.3` | L2 |  | Not applicable | The site uses no mutual TLS |
| `v5.0.0-12.2.1` | L1 | US-014 AC3 (HTTPS only, HTTP redirects) and AC7 (HSTS) | Planned |  |
| `v5.0.0-12.2.2` | L1 | US-014 AC8 (publicly trusted certificate) | Planned |  |
| `v5.0.0-12.3.1` | L2 | The backend's only outbound connections go to Google over HTTPS through `gspread` and `google-auth`; there is no unencrypted outbound call (code search of `src/` and `api/` on 2026-11-08) | Verified 2026-11-08 |  |
| `v5.0.0-12.3.2` | L2 | The backend does not disable certificate validation (code search of `src/` and `api/` on 2026-11-08: no `verify=False`) | Verified 2026-11-08 |  |
| `v5.0.0-12.3.3` | L2 |  | Not applicable | The application has no internal HTTP services: one web application and Google's API |
| `v5.0.0-12.3.4` | L2 |  | Not applicable | The application has no internal HTTP services: one web application and Google's API |
| `v5.0.0-13.1.1` | L2 | Communication needs are documented: integrations and processors in `PROJECT_SPEC.md` section 10, and the third-party list in the baseline section 6 | Verified 2026-11-08 |  |
| `v5.0.0-13.2.1` | L2 | The only backend-to-service call is to Google Sheets, authenticated with the service account (ADR-002) | Verified 2026-11-08 |  |
| `v5.0.0-13.2.2` | L2 | The service account has Editor access to the one lead sheet only (`docs/runbooks/GOOGLE_SHEETS_SETUP.md` step 4.4); the code requests only the Sheets scope (`api/storage/google_sheets.py`) | Verified 2026-11-08 |  |
| `v5.0.0-13.2.3` | L2 | US-014 AC4: production uses a service account created for the site; no default or shared credential | Planned |  |
| `v5.0.0-13.2.4` | L2 | The backend's code calls only fixed Google endpoints; shared cPanel hosting offers no outbound allowlist (ADR-001). See R-4 | Accepted risk |  |
| `v5.0.0-13.2.5` | L2 | As V13.2.4. See R-4 | Accepted risk |  |
| `v5.0.0-13.3.1` | L2 | Secrets live in cPanel environment variables and a key file outside the web root with `600` permissions (US-006 AC4, US-016, US-014 AC8), not in a vault. See R-3 | Accepted risk |  |
| `v5.0.0-13.3.2` | L2 | The key is readable only by the hosting account and shared only with the one sheet (US-014 AC8, `docs/runbooks/DEPLOYMENT.md`) | Planned |  |
| `v5.0.0-13.4.1` | L1 | US-014 AC8 | Planned |  |
| `v5.0.0-13.4.2` | L2 | `debug=True` appears only in `api/run_local.py`, which binds to `127.0.0.1` and is not the production entry point; production uses `api/passenger_wsgi.py`, which sets no debug. US-014 AC8 checks it on the live site | Verified 2026-11-08 |  |
| `v5.0.0-13.4.3` | L2 | US-014 AC8 | Planned |  |
| `v5.0.0-13.4.4` | L2 | US-014 AC8 | Planned |  |
| `v5.0.0-13.4.5` | L2 | US-014 AC8 (the application has only the two lead routes) | Planned |  |
| `v5.0.0-14.1.1` | L2 | Data is identified and classified in the baseline section 6 (personal data, financial indicators, credentials) | Verified 2026-11-08 |  |
| `v5.0.0-14.1.2` | L2 | Protection requirements per class are in the baseline section 6 | Verified 2026-11-08 |  |
| `v5.0.0-14.2.1` | L1 | The lead endpoints take their data in the JSON body, never in the URL or query string (contract sections 2 and 11). The scheduler's prefilled URL carries the visitor's name and email to the booking provider by design (US-007, US-037); the provider is listed in the baseline section 6 | Verified 2026-11-08 |  |
| `v5.0.0-14.2.2` | L2 | The application has no server-side cache and its responses carry no personal data (contract section 7) | Verified 2026-11-08 |  |
| `v5.0.0-14.2.3` | L2 | No analytics, tracker or advertising script is loaded (code search of `src/` and `api/` on 2026-11-08: the only third-party requests are Google Fonts and the booking widget). Google Fonts receives the visitor's address at page load: see R-1 | Verified 2026-11-08 |  |
| `v5.0.0-14.2.4` | L2 | The retention period and access rules for stored leads are decided by US-018 (final privacy notice); until then see the baseline section 6 and item O-5 | Planned |  |
| `v5.0.0-14.3.1` | L1 |  | Not applicable | The site has no authenticated area |
| `v5.0.0-14.3.2` | L2 |  | Not applicable | Responses carry no sensitive data to cache; the endpoints return only a status and a fixed message (contract section 7) |
| `v5.0.0-14.3.3` | L2 | The only browser storage used is `localStorage` for the language preference (`src/components/layout/LanguageToggle.astro`); no personal data is stored in the browser (code search of `src/` and `api/` on 2026-11-08) | Verified 2026-11-08 |  |
| `v5.0.0-15.1.1` | L1 | Remediation time frames are in the baseline section 4 (RV) | Verified 2026-11-08 |  |
| `v5.0.0-15.1.2` | L2 | Software bills of materials are generated by `.github/workflows/dependency-audit.yml` (`sbom-node`, `sbom-python` artifacts; both commands ran locally on 2026-11-08, verified on the workflow's first green run); `package-lock.json` pins the npm tree and `api/requirements.txt` bounds the Python versions. See R-6 | Planned |  |
| `v5.0.0-15.1.3` | L2 | The only costly operation is the Sheets write; it is protected by the body limit and the rate limit (contract sections 2, 3.2 and 11.1) | Verified 2026-11-08 |  |
| `v5.0.0-15.2.1` | L1 | `.github/workflows/dependency-audit.yml` fails on a high or critical npm advisory and on any Python advisory, on every pull request, on `main` and weekly. Item O-1: the npm audit reports high advisories on 2026-11-08 until the lockfile is updated, so this is verified once that merges | Planned |  |
| `v5.0.0-15.2.2` | L2 | Body limit (10 KB, `413`), per-IP rate limit (`429`), honeypot (US-013; `api/tests/test_spam_protection.py`, `api/tests/test_rate_limiter.py`) | Verified 2026-11-08 |  |
| `v5.0.0-15.2.3` | L2 | The application has only the two lead routes. US-014 AC8 checks that nothing else (tests, docs, source metadata) is on the live host | Planned |  |
| `v5.0.0-15.3.1` | L1 | Responses carry only `success`, `message`, `error_code` and `field_errors`; no stored data is ever returned (contract section 7) | Verified 2026-11-08 |  |
| `v5.0.0-15.3.2` | L2 |  | Not applicable | The backend follows no redirect to a URL it did not choose: it calls only Google's fixed endpoints |
| `v5.0.0-15.3.3` | L2 | Only the fields of the contract are copied from the request into the stored row; unknown fields are ignored and never stored (contract sections 3 and 11.2; `api/validation.py`; US-036's test that the calculator's figures never reach the row) | Verified 2026-11-08 |  |
| `v5.0.0-15.3.4` | L2 | US-014 AC8: the rate limit is checked behind the host's web server, so the address it sees is the visitor's | Planned |  |
| `v5.0.0-15.3.5` | L2 | Every field's JSON type is checked and a wrong type is `invalid_type` (`api/validation.py`; `api/tests/test_validation.py`, `api/tests/test_save_lead.py`) | Verified 2026-11-08 |  |
| `v5.0.0-15.3.6` | L2 | The frontend merges no untrusted object into another (code search of `src/` and `api/` on 2026-11-08: no `Object.assign`, deep merge or lodash on request or form data) | Verified 2026-11-08 |  |
| `v5.0.0-15.3.7` | L2 | The endpoints read only a JSON body; query string and form parameters are never read, and other content types are refused with `415` | Verified 2026-11-08 |  |
| `v5.0.0-16.1.1` | L2 | The logging inventory is in the baseline section 6 | Verified 2026-11-08 |  |
| `v5.0.0-16.2.1` | L2 | Each line has a timestamp, level, logger and message. There is no "who": visitors are anonymous and the IP address and request data are never logged, on purpose (US-013 AC5, US-016 AC3). See R-7 | Accepted risk |  |
| `v5.0.0-16.2.2` | L2 | US-016 AC8: log timestamps get an explicit UTC offset (today's format has none) | Planned |  |
| `v5.0.0-16.2.3` | L2 | The application writes only to standard error, which Passenger writes to the application log in cPanel (US-016, `docs/runbooks/DEPLOYMENT.md`) | Verified 2026-11-08 |  |
| `v5.0.0-16.2.4` | L2 | One line per event in a single `asctime level:logger:message` format (`api/app.py`) | Verified 2026-11-08 |  |
| `v5.0.0-16.2.5` | L2 | Personal data, the IP address and secrets are never logged (US-016 AC3, AC6; `api/tests/test_error_logging.py`) | Verified 2026-11-08 |  |
| `v5.0.0-16.3.1` | L2 |  | Not applicable | The site has no authentication to log |
| `v5.0.0-16.3.2` | L2 |  | Not applicable | The site has no authorization decisions to log |
| `v5.0.0-16.3.3` | L2 | Security events are defined in the baseline section 6. Honeypot triggers are logged (US-013 AC8); US-013 AC9 adds a line for each `429` and `422` | Planned |  |
| `v5.0.0-16.3.4` | L2 | Every `503` and `500` logs an ERROR with the cause class and, for unexpected errors, the traceback without data (US-016 AC1, AC2; `api/tests/test_error_logging.py`) | Verified 2026-11-08 |  |
| `v5.0.0-16.4.1` | L2 | Logs contain no request data, so a visitor cannot inject into them; the cause is logged as a class name, never a message (US-016 AC3; `api/tests/test_error_logging.py`) | Verified 2026-11-08 |  |
| `v5.0.0-16.4.2` | L2 | US-014 AC8: the application log is readable only through the hosting account | Planned |  |
| `v5.0.0-16.4.3` | L2 | Logs stay on the hosting account; there is no separate log system or alerting. See R-2 | Accepted risk |  |
| `v5.0.0-16.5.1` | L2 | Failures return a fixed, generic message and an error code, never internals (contract section 7; US-006 AC3; `api/tests/test_error_logging.py`) | Verified 2026-11-08 |  |
| `v5.0.0-16.5.2` | L2 | A failed Sheets write returns `503` and never success (NFR-006); a scheduler widget that fails to load shows the contact fallback (US-007 AC5; `tests/e2e/calendly-fallback.spec.ts`) | Verified 2026-11-08 |  |
| `v5.0.0-16.5.3` | L2 | Unexpected exceptions are caught and return `500` without continuing; a failed save never reports success (NFR-006; `api/tests/test_save_lead.py`) | Verified 2026-11-08 |  |
| `v5.0.0-17.1.1` | L2 | | Not applicable | The site uses no WebRTC. |
| `v5.0.0-17.2.1` | L2 | | Not applicable | The site uses no WebRTC. |
| `v5.0.0-17.2.2` | L2 | | Not applicable | The site uses no WebRTC. |
| `v5.0.0-17.2.3` | L2 | | Not applicable | The site uses no WebRTC. |
| `v5.0.0-17.2.4` | L2 | | Not applicable | The site uses no WebRTC. |
| `v5.0.0-17.3.1` | L2 | | Not applicable | The site uses no WebRTC. |
| `v5.0.0-17.3.2` | L2 | | Not applicable | The site uses no WebRTC. |

## Totals

253 L1 and L2 requirements in ASVS 5.0.0: 62 verified on 2026-11-08, 26 planned (an acceptance criterion covers them), 7 accepted risks (section 7 of the baseline), 158 not applicable.
