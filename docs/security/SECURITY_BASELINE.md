# SECURITY_BASELINE

How this project applies the kit's security baseline ([`AGENTS.md`](../../AGENTS.md) → Security baseline): which OWASP requirements its acceptance criteria use, what it adds to the kit's secure-development practice, and when it needs a penetration test. Written for US-029 from the kit's [`SECURITY_BASELINE_TEMPLATE.md`](https://github.com/Raulc87/sdd_starter_kit/blob/v1.2.0/docs/security/SECURITY_BASELINE_TEMPLATE.md) at kit v1.2.0 (private repository, read at the kit ref in [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md); the template is not copied here).

Following these standards is a practice, not a certification. This document never says the site is certified, compliant or secure; it says which requirements were verified, how and when.

| Standard | Version used | Used for |
|---|---|---|
| OWASP Application Security Verification Standard (ASVS) | 5.0.0 | Verifiable requirements, chosen by level (section 2) |
| OWASP Top 10 | 2025 | Web application risks the acceptance criteria cover (section 3) |
| OWASP API Security Top 10 | 2023 | Risks of the site's two public endpoints (section 3) |
| NIST SP 800-218, Secure Software Development Framework (SSDF) | 1.1 | Secure-development practices (section 4) |
| Penetration Testing Execution Standard (PTES) | Technical guidelines | Penetration test before the first production release (section 5) |
| ISECOM OSSTMM | 3 | Considered and not required (section 5) |

The versions were current when this baseline was written (2026-11-08): ASVS 5.0.0 and the two Top 10 lists were read from OWASP's own publications on that date.

## Metadata
- Project: Gaby Kelly — website ([`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md))
- Status: Draft. It becomes Approved when the human owner merges the pull request that carries it (US-029 AC7)
- Owner: Human project owner
- Written by: Agent 3 (security baseline), 2026-11-08
- Last updated: 2026-11-08
- Versions used: ASVS 5.0.0 · Top 10 2025 · API Top 10 2023 · SSDF 1.1
- Appendix: [`ASVS_INVENTORY.md`](ASVS_INVENTORY.md) (every ASVS requirement of the chosen level, one row each)

## 1. Classification

Answers come from [`PROJECT_SPEC.md`](../specs/PROJECT_SPEC.md) (section 10, personal data and integrations; section 11, constraints), the lead contract ([`LEAD_API_CONTRACT.md`](../specs/LEAD_API_CONTRACT.md)) and [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md).

| Question | Answer | Source |
|---|---|---|
| Personal data collected or stored (which, from whom) | **Yes.** From visitors who submit a form: full name, email and phone (VIP application; the calculator's phone is optional); the screening answer (a self-declared level of readiness to invest); the calculator's result as months and a zone code (a coarse financial indicator; the five figures the visitor types are never sent or stored, FR-035); language; the consent and the optional email consent; the privacy-notice version; the time of submission; a `status` the owner maintains. Stored in a Google Sheet in the owner's (later Gaby's) Google account. The visitor's name and email are also passed to the booking provider when the visitor books a call (US-007, US-037) | [`PROJECT_SPEC.md`](../specs/PROJECT_SPEC.md) §10, FR-035; contract sections 6 and 11.5 |
| Authentication (accounts, logins, admin areas, API keys issued to users) | **No.** Visitors are anonymous; there are no accounts, sessions or tokens. Until go-live the hosting provider's Directory Privacy password protects the whole site (US-014 AC6); that password is a hosting setting, not application code | [`USER_STORIES.md`](../specs/USER_STORIES.md) US-014 |
| Payments (card data, payment provider, invoices) | **No.** The site takes no payment and stores no card data. | [`PROJECT_SPEC.md`](../specs/PROJECT_SPEC.md) |
| Exposure (public internet, internal only, API consumed by third parties) | **Public site with two public, write-only endpoints**: `POST /api/save-lead` and `POST /api/save-calculator-lead` (same origin as the page; no CORS). Today only the static GitHub Pages preview is public: it has no backend, stores nothing and is not indexed (ADR-005). The production site will be served from the owner's hosting (ADR-001, hosting undecided), after the go-live gate of US-014 | [`LEAD_API_CONTRACT.md`](../specs/LEAD_API_CONTRACT.md) sections 2 and 11; ADR-001, ADR-005 |
| High-risk or complex (documentation level "Complex" in [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md), or the owner classifies it high-risk: health, financial, children's or other sensitive data, critical operations) | **No** (proposed; the owner confirms by approving). [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) records a simple scope. The data is contact data plus two coarse indicators (a screening answer and a zone). The site holds no account, balance, income, debt or other financial figure, no health data and no data about children, and no critical operation depends on it. Reclassify if that changes, for example if the site starts storing the calculator's figures, takes payments or adds accounts | Owner decision at approval, 2026-11-08 |

## 2. OWASP ASVS level

- Level chosen: **L2** (proposed 2026-11-08; the owner's decision is the approval of this baseline, US-029 AC7)
- Why: the site stores personal data, which is the kit's trigger for L2 ([`AGENTS.md`](../../AGENTS.md) → Security baseline). L3 is not chosen because the classification above is not high-risk, and the site has no authentication, payments or other sensitive operation that L3 is built for. L1 alone is below what the classification calls for.

**ASVS inventory.** Because the site handles personal data, every L1 and L2 requirement of ASVS 5.0.0 is inventoried one row each in [`ASVS_INVENTORY.md`](ASVS_INVENTORY.md) (253 requirements; the file totals each status). The five chapters that do not apply at all (authentication, session management, self-contained tokens, OAuth and OIDC, WebRTC) still have one row per requirement; the rows of a chapter share its reason. The inventory records, for every requirement, the acceptance criterion, test or configuration check that covers it, or why it does not apply.

How to read the inventory: most "Planned" rows are production configuration (response headers, TLS, file placement, hosting), because production waits for US-014; they are covered by new acceptance criteria US-014 AC7 and AC8, added with this baseline (US-029 AC3). The inventory is approved with this baseline and is read by the review-only agent and by the sprint readiness check.

## 3. OWASP Top 10 and API Top 10 as acceptance criteria

Each risk that applies is covered by acceptance criteria in the stories that touch it ([`USER_STORIES.md`](../specs/USER_STORIES.md)). Where a touching story had no criterion that verifies an applicable risk, US-029 AC3 adds one to that story, named below. ASVS requirements are cited by versioned ID, `v5.0.0-<chapter>.<section>.<requirement>`.

### OWASP Top 10:2025

| Risk | Applies | Where it is covered (stories, acceptance criteria, ASVS) | Reason if not |
|---|---|---|---|
| A01:2025 Broken Access Control | Yes, limited | No roles or readable data exist. Both endpoints are public and write-only by design (contract sections 2, 11); the sheet and the hosting account are reached only with the owner's accounts. The key file stays outside the web root (US-006 AC4, US-014 AC8). Before go-live the whole site, `/api` included, is behind Directory Privacy and returns `401` (US-014 AC6). ASVS `v5.0.0-8.1.1` (documented), `v5.0.0-13.3.2` | |
| A02:2025 Security Misconfiguration | Yes | **US-014 AC7** (security headers) and **AC8** (production configuration checks), both added by US-029; US-016 AC5 (production defaults to Google Sheets, memory storage must be explicit); US-013 AC6 (limits documented in `.env.example`). ASVS `v5.0.0-3.4.1` to `3.4.6`, `13.4.1` to `13.4.5` | |
| A03:2025 Software Supply Chain Failures | Yes | US-029 AC4 (dependency audit in CI, [`dependency-audit.yml`](../../.github/workflows/dependency-audit.yml); section 6), US-012 (CI, lockfile, `npm ci`), US-007 and US-037 (the booking widget loads only after a saved lead; listed in section 6). ASVS `v5.0.0-15.1.1`, `15.1.2`, `15.2.1` | |
| A04:2025 Cryptographic Failures | Yes, transport and secrets only | US-014 AC3 (HTTPS only), AC7 (HSTS), AC8 (TLS versions, public certificate); NFR-007 and US-006 AC4 (credentials server-side only). The application implements no cryptography. ASVS `v5.0.0-12.1.1`, `12.2.1`, `12.2.2`, `11.1.1` | |
| A05:2025 Injection | Yes | US-004 AC2 to AC6 and AC9 (validation on client and server; **AC9 added by US-029**: values reused in the page are inserted as text or URL-encoded), US-006 AC5 (values stored as raw text, never as formulas), US-023 AC2 (the VIP form keeps US-004's rules), US-036 AC2 (calculator fields), US-035 (the five figures never leave the browser), US-038 AC7 and US-039 AC6 (**added by US-029**: no header injection in emails). ASVS `v5.0.0-1.2.1`, `1.2.2`, `1.3.11`, `2.2.1`, `2.2.2` | |
| A06:2025 Insecure Design | Yes | NFR-006 (a failed save is never shown as success): US-004 AC8, US-006 AC3, US-035 AC4, US-036 AC3. Consent is enforced on the server (US-011 AC3). Abuse limits (US-013). Data minimization (FR-035). ASVS `v5.0.0-2.1.2`, `2.3.2`, `2.3.3`, `2.4.1` | |
| A07:2025 Authentication Failures | No | | The site has no authentication (section 1). If accounts are ever added, this row, ASVS chapters 6 and 7 and the classification change first, in a new story |
| A08:2025 Software or Data Integrity Failures | Yes | Vendor widget scripts (Calendly now, GoHighLevel later) are loaded without subresource integrity, which vendors that update their widgets do not support: loaded only after a saved lead (US-007 AC2, US-037) and limited by the Content-Security-Policy of US-014 AC7; risk R-5. Build integrity: lockfile and `npm ci` (US-012); only the owner merges ([`AGENTS.md`](../../AGENTS.md)); no automatic dependency updates | |
| A09:2025 Security Logging and Alerting Failures | Yes | US-016 AC1 to AC7 (storage and unexpected-error logs without personal data), US-013 AC8 (honeypot line), **US-013 AC9** and **US-016 AC8** (added by US-029: `429` and `422` events; timestamps with an explicit offset). There is no alerting beyond the owner reading the log (R-2). ASVS `v5.0.0-16.2.2`, `16.3.3`, `16.3.4` | |
| A10:2025 Mishandling of Exceptional Conditions | Yes | Generic errors that expose no internals (contract section 7; US-006 AC3); no success on any failure (US-004 AC8, US-036 AC3); a failed scheduler widget shows the contact fallback (US-007 AC5); unexpected errors are caught and logged (US-016 AC2). ASVS `v5.0.0-16.5.1` to `16.5.3` | |

### OWASP API Security Top 10:2023

| Risk | Applies | Where it is covered (stories, acceptance criteria, ASVS) | Reason if not |
|---|---|---|---|
| API1:2023 Broken Object Level Authorization | No | | The endpoints take no object identifier and return no stored object |
| API2:2023 Broken Authentication | No | | The endpoints are public by design (section 1); see A07 |
| API3:2023 Broken Object Property Level Authorization | Yes | Only the contract's fields are copied into the stored row; unknown fields are ignored and never stored (contract sections 3 and 11.2; US-036 AC2 and its test that the calculator's figures never reach the row). Responses carry no stored data. ASVS `v5.0.0-15.3.1`, `15.3.3` | |
| API4:2023 Unrestricted Resource Consumption | Yes | 10 KB body limit (contract section 2); per-IP rate limit with its own budget per endpoint (US-013 AC3, US-036 AC3; contract sections 3.2 and 11.1). ASVS `v5.0.0-15.2.2`, `2.3.2` | |
| API5:2023 Broken Function Level Authorization | No | | Each endpoint offers one anonymous function, `POST` only; there are no privileged functions to reach |
| API6:2023 Unrestricted Access to Sensitive Business Flows | Yes | Lead submission and the calculator are the flows a bot would abuse: honeypot and rate limit (US-013 AC1 to AC3, US-036 AC3); no CAPTCHA for now (ADR-004). ASVS `v5.0.0-2.4.1` | |
| API7:2023 Server Side Request Forgery | No | | The server fetches no URL taken from a request; its only outbound calls go to Google's fixed endpoints |
| API8:2023 Security Misconfiguration | Yes | As A02, plus no CORS (same origin, contract section 2) and fixed generic error bodies. US-014 AC7, AC8 | |
| API9:2023 Improper Inventory Management | Yes | The endpoint inventory is contract sections 2 and 11: two public endpoints, one version. US-014 AC8 checks that no other endpoint, documentation or monitoring route is reachable on the live host | |
| API10:2023 Unsafe Consumption of APIs | Yes | The Google Sheets API: a failed write returns `503` and never success (US-006 AC3); values are written as raw text (US-006 AC5). The funnel-email tool of ADR-007 is covered by US-038 and US-039 (Security sections and AC7 and AC6) before it is used | |

**Criteria added to existing stories by US-029 AC3** (each named in the pull request, and the only edits to [`USER_STORIES.md`](../specs/USER_STORIES.md)):

| Story | New criterion | Why |
|---|---|---|
| US-004 | AC9 | No story verified that form values reused in the page are not inserted as HTML (A05, ASVS 1.2.1, 1.2.2, 3.2.2) |
| US-013 | AC9 | `429` and `422` events were not logged (A09, ASVS 16.3.3) |
| US-014 | AC7, AC8 | Nothing verified the response headers or the production configuration (A02, A04, API8, ASVS 3.4.x, 4.1.2, 12.x, 13.x, 15.3.4, 16.4.2) |
| US-016 | AC8 | Log timestamps carry no offset (A09, ASVS 16.2.2) |
| US-038 | AC7 | No story verified header injection in emails (A05, ASVS 1.3.11) |
| US-039 | AC6 | The sequence emails reuse US-038 AC7 |

The review-only agent checks every pull request against these criteria ([`AGENTS.md`](../../AGENTS.md) → Review-only agent).

## 4. Secure development (NIST SSDF SP 800-218 v1.1)

| SSDF practice group | Covered by the kit's workflow ([`AGENTS.md`](../../AGENTS.md)) | This project adds |
|---|---|---|
| **PO** Prepare the Organization | Security requirements recorded in the spec and this baseline before implementation; roles (owner, implementation agents, review-only agent, coordinator); sprint readiness gates | Toolchain: GitHub secret scanning with push protection; a dependency audit in CI (section 6); ESLint, type check, unit, end-to-end and pytest suites in CI ([`frontend.yml`](../../.github/workflows/frontend.yml), [`backend.yml`](../../.github/workflows/backend.yml)); workflows run with read-only repository permissions. Credentials: the owner holds the GitHub and hosting accounts; agents act through the owner's GitHub account ([`AGENTS.md`](../../AGENTS.md) → Attribution of agent posts) and never run anything against production; Gaby's Google account holds the production sheet and service account, set up by the owner at deploy (US-014 AC4) |
| **PS** Protect the Software | The `main protection` ruleset: pull request required, no deletion, no force-push, no bypass (read on 2026-11-08); only the owner merges; releases are tags on checked commits ([`RELEASE.md`](../runbooks/RELEASE.md)) | The ruleset has no required status checks yet: the owner is asked to require `frontend`, `e2e`, `pytest`, "Docs link check", `npm audit` and `pip-audit` (O-4). Tags and commits are not signed: not adopted, because there are no third-party consumers of releases; revisit if that changes. Workflow actions are GitHub's own (`actions/*`), pinned to a major version |
| **PW** Produce Well-Secured Software | Spec first; tests from acceptance criteria; independent review; the least-complex stack | A threat model of the main flows (below); `npm ci` from the lockfile in CI; Python versions bounded in `api/requirements.txt`, with a bill of materials and an advisory check in CI (R-6); security tests in the existing suites (validation, honeypot, rate limit, no personal data in logs, storage failure); secure defaults in code (production defaults to Google Sheets, rate limit on by default, no debug in production) |
| **RV** Respond to Vulnerabilities | Findings become stories through change management | How reports arrive, who triages and fix times (below) |

**Threat model of the main flows** (a table, not a diagram, because the system is two endpoints and a static site):

| Flow | Asset | Main threats | Controls |
|---|---|---|---|
| A visitor submits the VIP form or the calculator's details | Lead data in transit and in the sheet | Spam and bots; malformed or malicious input; a fake success that loses a lead; formula injection into the sheet; reading data in transit | Honeypot and per-IP rate limit (US-013, US-036); server-side validation (US-004, US-036); no success unless stored (NFR-006); raw-text writes (US-006 AC5); HTTPS (US-014 AC3, AC7) |
| The booking widget loads after a saved lead | The visitor's name and email, the page's integrity | A compromised or changed vendor script; data sent to the vendor | Loaded only after a saved lead, from the vendor's own host; Content-Security-Policy allowlist (US-014 AC7); processor named in the privacy notice (US-018); R-5 |
| The owner deploys and operates the site | Service-account key, the sheet, the hosting account | A leaked key; a mis-set production variable; exposed source metadata | Key outside the web root with `600` permissions, rotation runbook ([`GOOGLE_SHEETS_SETUP.md`](../runbooks/GOOGLE_SHEETS_SETUP.md)); secret scanning with push protection; US-016 AC4, AC5; US-014 AC8 |
| A developer or agent changes the code | The repository and the build | A vulnerable dependency; a secret committed; an unreviewed change on `main` | Dependency audit and bill of materials in CI; secret scanning; ruleset and independent review; only the owner merges |
| The preview on GitHub Pages | Nothing: it stores and sends nothing | A visitor mistakes the preview for the real site | `noindex`, a visible "Preview" marker, forms in demonstration mode (US-027) |

**How a vulnerability is reported and fixed**
- Reporting: privately to the owner. GitHub's private vulnerability reporting is off today; the owner is asked to turn it on (O-3). Until then, a reporter contacts the owner directly. Nobody posts an unfixed, exploitable vulnerability in an issue, pull request or tracked file (section 7).
- Triage: the owner, with the review-only agent's help.
- Fix: an owning implementation agent, through a story and a pull request that adds a test for it, reviewed like any change. Proposed target times (the owner approves them by approving this baseline): triage within 7 days of a report; then a fix within 7 days for critical, 14 days for high, and the next sprint for moderate. A dependency advisory that cannot be fixed yet, or does not reach production code (for example a build-time tool), is recorded with a date in section 7 and in the audit step's ignore list.
- Root cause: each fixed vulnerability gets a short note in the pull request on what allowed it, and a test or a baseline change that closes it.
- Alerts: Dependabot alerts (on since 2026-11-08) and the weekly audit workflow (section 6).

## 5. Penetration test

| Condition | Applies to this project | Required test |
|---|---|---|
| The project handles personal data, authentication or payments (section 1) | **Yes**: personal data | A PTES penetration test **before the first production release** |
| The project is high-risk or complex (section 1), whether or not it handles personal data, authentication or payments | **No** (section 1) | An OSSTMM 3 test would apply only if the owner reclassifies the project |

- Required: **PTES**. OSSTMM 3 is not required.
- OSSTMM re-test triggers for this project: none, because OSSTMM is not required. If the owner reclassifies the site as high-risk, the funnel emails of US-038 and US-039 and any account area would be major new attack surfaces.
- Plan: `docs/security/PENTEST_PLAN.md`, from the kit's `PENTEST_PLAN_TEMPLATE.md`. It does not exist yet and is written and approved before the go-live sprint starts (US-029 AC5; O-6).
- Planned before release: the first production release, that is, the removal of the Directory Privacy protection under US-014 AC6. **US-014 AC6 already makes this test a gate of go-live**: it requires the PTES test to have run with no open critical or high finding. The same gate is copied into [`RELEASE.md`](../runbooks/RELEASE.md) when its release sections are written (ADR-005).
- Already in production when this baseline was adopted: **No.** Only the static preview is public; the production domain serves a different page today (Gaby's GoHighLevel sales page, which the new site replaces at go-live), so the dated-deadline exception for existing production projects does not apply, and the test gates the first production release.

Penetration tests are run only by people the owner authorizes in writing, under a written scope signed by the owner. No implementation agent runs a penetration test, attack tools or security scans against production, the preview or any running system. The dependency audit of section 6 checks the code's dependencies against published advisories and scans no running system.

## 6. Secrets, dependencies and data

**Secret scanning.** GitHub secret scanning and push protection are both **on** as of 2026-11-08: the repository settings show them enabled (read by Agent 3 and by the coordinator that day). The settings do not show when they were first turned on, so the record says "on as of 2026-11-08", not a start date. No secret is committed or sent to the browser (NFR-007, US-006 AC4): `.env`, `.env.production`, `*.env.local` and `**/*service-account*.json` are ignored by Git, `.env.example` files carry no value, and the service-account key sits outside the repository and the web root. Scanning runs on GitHub only; there is no local pre-commit hook.

**Dependency scanning and update policy.**
- CI: [`dependency-audit.yml`](../../.github/workflows/dependency-audit.yml) runs on every pull request, on every push to `main` and every Monday. `npm audit --audit-level=high` checks `package-lock.json` and fails on a high or critical advisory. `pip-audit -r api/requirements.txt` checks the Python requirements and fails on any known vulnerability, because PyPI advisories carry no severity (stricter than the story requires). Each job also writes a CycloneDX bill of materials as a build artifact (ASVS `v5.0.0-15.1.2`).
- Dependabot alerts: **on since 2026-11-08**, enabled by the owner that day (the owner's statement, relayed by the coordinator; the settings API does not show alerts to the agents). Dependabot security updates are off, and there is no Dependabot version-updates file, on purpose: three agents work in parallel and automatic pull requests would touch the lockfile and `package.json` they do not own. Updates are made by hand in a pull request by the file's owner (npm: Agent 1; Python: Agent 3).
- Who acts: the owning agent, within the fix times of section 4; a failed weekly run on `main` is the signal.
- Current state: on 2026-11-08 `npm audit` reports high advisories in build and dev-time packages; a lockfile-only update clears them. It is item O-1 and must merge before the audit step can be green.

**Personal data handling** ([`PROJECT_SPEC.md`](../specs/PROJECT_SPEC.md) §10; Costa Rica Ley N.° 8968).

| Class | Data | Where | Who can read it | Protection |
|---|---|---|---|---|
| Contact | Name, email, phone | A Google Sheet, tabs `leads` and `calculator` | The owner and Gaby, through their Google accounts | Server-side only (NFR-007); sent in a JSON body over HTTPS; stored as raw text |
| Qualification | Screening answer; calculator months and zone | The same tabs | The same | As above; the calculator's five figures are never sent or stored (FR-035) |
| Consent record | `consent`, `marketing_consent`, privacy-notice version, submission time | The same tabs | The same | Consent is required before storing (BR-006, US-011) |
| Credential | Google service-account key | A file on the host, outside the web root, `600` | The hosting account | Rotation and revocation in [`GOOGLE_SHEETS_SETUP.md`](../runbooks/GOOGLE_SHEETS_SETUP.md) section 7 |
| Not stored | IP addresses (held in memory only for the rate limit and dropped when their window ends, ADR-004); cookies (the site sets none) | | | |

- Retention and deletion: **not decided yet.** The final privacy notice (US-018) must fix the retention period. Until then a lead is deleted by the owner removing its row from the sheet when asked (O-5).
- Processors and third parties, with what each receives:

| Third party | Role | What it receives | Note |
|---|---|---|---|
| Google (Sheets) | Storage | The lead rows | ADR-002 |
| Google (Fonts) | Typefaces, loaded when any page opens | The visitor's address and browser details | R-1 |
| Calendly, later GoHighLevel | Booking widget, loaded after a saved lead | The visitor's name and email (prefilled), and what the visitor enters in the widget | US-007, US-037, ADR-006; named in the privacy notice (US-018) |
| Hosting provider (cPanel, ADR-001) | Hosts the site and the backend | All traffic; its web-server logs may record visitors' addresses, outside the application | Hosting not decided; the privacy notice must say so (O-5) |
| GitHub | Hosts the repository and the preview | Preview visitors' requests | The preview stores and sends nothing |
| Email tool, video host | Not in use yet | | Added to this table, and to the privacy notice, before use (US-038, US-039, ADR-007) |

**Logging.** What is logged, where, and what is never logged (ASVS `v5.0.0-16.1.1`):

| Layer | What is logged | Where it goes | Never logged |
|---|---|---|---|
| Backend application | Startup: the active storage, and a warning when it is memory (US-016 AC4, AC5). Honeypot triggers (US-013 AC8). Storage failures: the cause's class and, for Google errors, the HTTP status (US-016 AC1). Unexpected errors: the class and traceback (US-016 AC2). Planned: each `429` and `422`, with the endpoint and failing field names only (US-013 AC9) | Standard error, which Passenger writes to the application log in cPanel ([`DEPLOYMENT.md`](../runbooks/DEPLOYMENT.md)); one line per event; timestamps get an explicit offset (US-016 AC8) | Submitted values, the request body, the IP address, the honeypot value, the service-account key (US-016 AC3, AC6) |
| Hosting web server | The provider's own access and error logs | The hosting account | Outside the application's control (section 6, third parties) |
| Frontend | Nothing is sent to a logging service | | |

Security events the application records: honeypot triggers, rate-limit rejections (planned), validation failures (planned), storage failures and unexpected errors. Logs are read by the owner through the hosting account; nothing ships them elsewhere or alerts on them (R-2).

**Cryptographic inventory** (ASVS `v5.0.0-11.1.2`): the application implements no cryptography and stores no password. TLS for visitors is the host's. The backend reaches Google over TLS through `google-auth` and `gspread`. The only key is the Google-issued service-account key, whose lifecycle is the runbook above.

## 7. Open items and accepted risks

In this public repository, no unfixed, exploitable vulnerability is recorded here or in any other tracked file. Items below are gaps in process, configuration and documentation, not exploit details. A vulnerability found later is tracked privately and appears here only as a neutral reference, such as "SEC-001, tracked privately", until it is fixed and retested.

**Open items**

| Item | Owner | Decision / due |
|---|---|---|
| O-1 `npm audit` reports high advisories in build and dev-time packages on 2026-11-08; a lockfile-only update (`npm audit fix --package-lock-only`, `package.json` unchanged) clears them in a trial run | Agent 1 (owns the lockfile), requested through the coordinator | Before the pull request that adds the audit step merges, so `main` is never red |
| O-2 Dependabot alerts: the owner turned them on on 2026-11-08 (recorded in section 6). Secret scanning and push protection are on as of 2026-11-08; the owner may add the date they were first enabled | Human owner | Closed for Dependabot; optional for the other two |
| O-3 Turn on GitHub private vulnerability reporting (off on 2026-11-08) | Human owner | At approval |
| O-4 Require the status checks `frontend`, `e2e`, `pytest`, "Docs link check", `npm audit` and `pip-audit` in the `main protection` ruleset | Human owner | After the audit step merges |
| O-5 Retention period; the privacy notice to name the hosting provider's logs and every processor in section 6 | Human owner with the legal review (US-018) | Before go-live |
| O-6 Write and approve `docs/security/PENTEST_PLAN.md` | Human owner and the coordinator | Before the go-live sprint starts (US-029 AC5) |
| O-7 Implement and verify the criteria added by US-029: US-004 AC9 (Agent 2), US-013 AC9 and US-016 AC8 (Agent 3), US-038 AC7 and US-039 AC6 (with those stories); US-014 AC7 and AC8 at go-live. These reopen Done stories: each needs a small fix branch and the owner's scheduling decision | Human owner | Proposed for Sprint 005; the inventory rows turn to "Verified" as each merges |
| O-8 Propose a story to self-host the typefaces (R-1). Not drafted here because [`USER_STORIES.md`](../specs/USER_STORIES.md) is the owner's and numbers US-031 to US-033 are reserved | Human owner | Owner decides |
| O-9 Set `permissions` explicitly in every workflow: done in this pull request for `frontend.yml` and `backend.yml` (the other two already had it) | Agent 3 | Done |

**Accepted risks** (accepted by the owner by approving this baseline)

| Risk | Reason it is accepted, and when to revisit |
|---|---|
| R-1 Google Fonts are loaded from Google, so Google receives each visitor's address when a page opens, before any consent | The cost of removing it is small but touches Agent 1's layout; the privacy notice must name Google as a recipient until it is removed. Revisit by O-8 |
| R-2 No separate log system and no alerting; the owner reads the application log in cPanel | Volume is low, and the site has no accounts. Revisit if the hosting changes or traffic grows |
| R-3 Secrets live in cPanel environment variables and a `600` key file, not in a secrets vault | Shared hosting offers no vault (ADR-001); the key reaches one sheet only. Revisit if the hosting changes |
| R-4 No outbound network allowlist at the host | Shared hosting offers none; the code calls only Google's fixed endpoints. Revisit if the hosting changes |
| R-5 Vendor widget scripts are loaded without subresource integrity | Vendors change their widgets, so a fixed hash would break booking; mitigated by loading only after a saved lead and by the Content-Security-Policy. Revisit when the booking provider changes (US-037) |
| R-6 `api/requirements.txt` bounds versions but does not pin every package | The bill of materials and the weekly advisory check cover it; deployment installs the latest allowed versions. Revisit if a pinned lock file for Python is wanted |
| R-7 Log lines carry no "who": no IP address, no request data | Deliberate, for privacy (US-013 AC5, ADR-004) |
| R-8 TLS versions and ciphers, and HTTP message parsing, are the hosting provider's | The project cannot configure them on shared hosting; US-014 AC8 checks what is observable at go-live |

## 8. Approval
- Approved by: the human owner, by merging the pull request that carries this baseline and [`ASVS_INVENTORY.md`](ASVS_INVENTORY.md) (US-029 AC7)
- Date: the date of that merge
