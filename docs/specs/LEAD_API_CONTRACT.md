# LEAD_API_CONTRACT — Save Lead

## Metadata
- Version: 1.3.1
- Status: v1.3.1 approved by the human owner on 2026-11-24 (the resend rule, below), LOCKED for Sprint 005; v1.3 proposed in the phase 2d docs PR, LOCKED for Sprint 005 on merge; v1.2.1 (wording only) approved by the human owner on 2026-11-08; v1.2 proposed in the Sprint 004 planning PR, LOCKED for Sprint 004 on merge; v1.1 approved and locked for Sprint 002
- Changes in 1.3.1 (2026-11-24, section 12, Resending): the resend command does not resend an older `failed` or `pending` row when a later row in the same tab has the same email; it marks it `superseded`, a new `crm_status` value (sections 6, 11.5 and 12). Resending the older row would overwrite the newer submission's values in GoHighLevel, which matches contacts on the email. Found by Codex and Agent 3 in #92 (US-045); approved by the human owner ("Accept + 'superseded'"). References to v1.3 elsewhere stay valid.
- Changes in 1.3 (2026-11-23, phase 2d, [`PROJECT_SPEC.md`](PROJECT_SPEC.md) v0.7 FR-034, FR-035, FR-041; [ADR-008](../decisions/ADR-008_GOHIGHLEVEL_CONTACTS.md)): section 11 follows Gaby's calculator: six zone codes instead of three, `months` with up to two decimals (rounded down by the client), two new required fields (`currency`, `concentration_alert`), and new sheet columns. New section 12: after each save, both endpoints send the contact to GoHighLevel, and the row records the outcome in a new last column, `crm_status` (sections 6 and 11.5). Section 9: `PUBLIC_SCHEDULER_URL` replaces `PUBLIC_CALENDLY_URL` (US-037). The request and responses of `/api/save-lead` (sections 2–5, 7, 8) are unchanged.
- Changes in 1.2.1 (2026-11-08, wording only, no change in behavior): section 7, `405`: the `Allow` header includes `POST` and may list other methods (Flask also lists `OPTIONS`, as `/api/save-lead` always has). Proposed by Agent 3 in #73, approved by the human owner ("yes, reword the contract to 'includes POST'"). References to v1.2 elsewhere stay valid.
- Changes in 1.2 (2026-11-08, US-036, [`PROJECT_SPEC.md`](PROJECT_SPEC.md) v0.6 FR-035, FR-039): a second endpoint, `POST /api/save-calculator-lead`, for calculator leads (section 11), with its own sheet tab; the VIP endpoint (sections 2–10) is unchanged. Frontend configuration: `PUBLIC_SCHEDULER_URL` replaces `PUBLIC_CALENDLY_URL` (US-037, ADR-006).
- Changes in 1.1 (2026-09-28, US-013, ADR-004): honeypot field `website` (sections 3 and 3.1); `429` / `rate_limited` is now emitted (sections 3.2 and 7); rate-limit configuration (section 9).
- Related spec: `docs/specs/PROJECT_SPEC.md` (FR-006 to FR-010, FR-013, NFR-005, NFR-006)
- Related stories: US-004, US-005, US-006, US-007, US-011; v1.2: US-035, US-036; v1.3: US-044, US-045
- Related ADRs: ADR-001 (backend hosting), ADR-002 (Google Sheets access), ADR-008 (GoHighLevel contacts)
- Consumers: frontend lead form (Agent 2)
- Provider: Python endpoint (Agent 3)

Any change to this contract must follow the change-management process in `AGENTS.md` (update this document first, bump the version, notify both owning agents).

## 1. Conventions

- All field names, codes, and identifiers are English and `snake_case`.
- User-facing text is never taken from the API response. The frontend maps `error_code` / field error codes to localized copy (Spanish or English, see `docs/ux/UX_UI_DIRECTION.md`).
- The API `message` field is a short, safe English string for troubleshooting only.
- Encoding: UTF-8.

## 2. Endpoint

| Item | Value |
|---|---|
| Method | `POST` |
| Path | `/api/save-lead` |
| Production URL | `https://<site-domain>/api/save-lead` (same origin as the page) |
| Request content type | `application/json` |
| Response content type | `application/json` |
| Max request body | 10 KB |
| Authentication | None (public form). Spam protection: honeypot field and per-IP rate limit (sections 3.1 and 3.2, ADR-004). |
| CORS | Not required: frontend and endpoint are served from the same origin. Local development uses a dev-server proxy (see section 9). |

The `/api` prefix is the mount point of the Python application on cPanel (see ADR-001). The application route itself is `/save-lead`.

## 3. Request body

```json
{
  "name": "Ana María Pérez Soto",
  "email": "ana.perez@example.com",
  "phone": "+50684104791",
  "screening_answer": "needs_investment_info",
  "language": "es",
  "consent": true
}
```

| Field | Type | Required | Rules (applied on client AND server) | Stored as |
|---|---|---|---|---|
| `name` | string | yes | Trim; collapse internal whitespace to single spaces. Length 3–100 characters after normalization. Allowed characters: Unicode letters (including accents, `ñ`, `ü`), space, apostrophe (`'` `’`), hyphen (`-`), period (`.`). Must contain **at least two words** separated by a space, and each word must start with a letter (full name: first name(s) + last name(s)). | normalized value |
| `email` | string | yes | Trim; lowercase. Max 254 characters; local part max 64. Must match `^[a-z0-9._%+-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,63}$`. Local part must not start or end with `.` and must not contain `..`. | normalized value |
| `phone` | string | yes | Remove spaces, hyphens, parentheses, and periods. Result must match E.164: `^\+[1-9][0-9]{7,14}$` (a `+`, the country code, and the number; 8–15 digits total). Example: `+50684104791`. | normalized value |
| `screening_answer` | string (enum) | yes | One of the codes in section 4. | code |
| `language` | string (enum) | yes | `es` or `en` — the language the visitor was viewing when submitting. | code |
| `consent` | boolean | yes | Must be JSON `true` (privacy consent checkbox, US-011). | `true` |

Unknown fields are ignored, except the honeypot field `website` (section 3.1). Fields with the wrong JSON type are validation errors.

### 3.1 Honeypot field (US-013)

| Field | Type | Required | Rule |
|---|---|---|---|
| `website` | string | no | Sent by the form from a field that people never see or fill. Absent, `null`, and a string that is empty after trimming all mean "empty" and the request is processed normally. |

- The frontend always sends `website`, with the value of the hidden field (normally `""`).
- If `website` is a string that is non-empty after trimming, or any JSON type other than string or `null` (number, boolean, object, array), the request is treated as a bot: the server returns the normal `201` success response and **does not store the lead**. The bot gets no signal that it was detected. This decoy `201` is the only `201` that does not mean a stored lead (section 7).
- The honeypot check runs after the content-type and JSON checks (`415`, `400`) and after the rate limit (section 3.2), and before field validation, so a bot never receives field errors.
- `website` is never stored and never written to the sheet.

### 3.2 Rate limit (US-013)

- Requests are counted per client IP address as seen by the server (`REMOTE_ADDR`; `X-Forwarded-For` is not trusted).
- At most `RATE_LIMIT_MAX_REQUESTS` accepted requests per IP within a sliding window of `RATE_LIMIT_WINDOW_SECONDS` (defaults: 5 requests per 600 seconds). Every request that passes the limit counts, whatever its later outcome (`201`, `4xx`, `5xx`). Requests rejected with `429` do **not** count, so a client that waits `Retry-After` seconds can always make its next request.
- A rejected request gets `429` / `rate_limited` with a `Retry-After` header: the whole number of seconds (rounded up, at least 1) until the oldest counted request leaves the window. Nothing is stored.
- The rate limit is checked first, before any other processing.
- Limiter state is kept only in the memory of each server process (ADR-004): an IP address and the times of its counted requests are held while at least one of those requests is inside the window, and are dropped once they all expire (and on restart). IP addresses are never written to logs, files, the sheet, or any other storage, and are used for nothing but this count.
- `RATE_LIMIT_MAX_REQUESTS=0` disables the limit (automated tests and local development only).

## 4. `screening_answer` codes

| Code | Spanish label (ES) | English label (EN) |
|---|---|---|
| `ready_to_invest` | Quiero invertir si el programa es adecuado para mí. | I want to invest if the program is right for me. |
| `needs_investment_info` | Tengo disposición, pero necesito conocer la inversión primero. | I am willing, but I need to understand the investment first. |
| `no_capacity_now` | Me interesa, pero actualmente no tengo capacidad para invertir. | I am interested, but I do not currently have the capacity to invest. |
| `exploring` | Solo estoy explorando por ahora. | I am only exploring for now. |

Labels are proposed copy pending Gabriela's review; codes are stable.

## 5. Server-generated fields

| Field | Value |
|---|---|
| `submitted_at` | Server time in `America/Costa_Rica` (UTC-06:00, no daylight saving; same offset as Central America and Mexico City). Format `DD/MM/YYYY HH:mm:ss`, 24-hour. Example: `23/09/2026 14:05:31`. |
| `privacy_notice_version` | Version identifier of the privacy notice the visitor accepted, from backend configuration (`PRIVACY_NOTICE_VERSION`). |
| `status` | Always `started` on creation. |

## 6. Google Sheets row

One row is appended per successful request, in this column order (header row in the sheet uses these exact names):

| Column | Source |
|---|---|
| `submitted_at` | server |
| `name` | request |
| `email` | request |
| `phone` | request |
| `screening_answer` | request (code) |
| `language` | request |
| `consent` | request (`TRUE`) |
| `privacy_notice_version` | server |
| `status` | server (`started`) |
| `crm_status` | server (v1.3): `pending`, `sent`, `failed`, `off` or (v1.3.1) `superseded` (section 12) |

Allowed `status` values (maintained manually in the sheet by the business owner; the endpoint only writes `started`):

`started`, `contacted`, `booked`, `not_interested_yet`, `dropped`

Values are written as raw strings (not interpreted as formulas or numbers), so a phone starting with `+` or text starting with `=` is stored literally.

## 7. Responses

Every response body is JSON with this shape:

```json
{
  "success": true,
  "message": "Lead saved.",
  "error_code": null,
  "field_errors": null
}
```

- `success` (boolean) — always present.
- `message` (string) — always present; safe, English, never contains secrets, stack traces, or submitted data.
- `error_code` (string | null) — present on failures.
- `field_errors` (object | null) — only for `422`; maps field name to one field error code (section 8).

### Status codes

| HTTP | When | `error_code` | Frontend behavior |
|---|---|---|---|
| `201 Created` | Row appended to Google Sheets; or a honeypot decoy (section 3.1), where nothing is stored | `null` | Show success message, then inline Calendly (US-007). |
| `400 Bad Request` | Body is not valid JSON or not a JSON object | `invalid_json` | Generic error, keep form data, allow retry. |
| `404 Not Found` | Unknown path | `not_found` | Generic error. |
| `405 Method Not Allowed` | Method other than `POST` (the response's `Allow` header includes `POST`; it may list other methods, such as `OPTIONS`) | `method_not_allowed` | Generic error. |
| `413 Payload Too Large` | Body larger than 10 KB | `payload_too_large` | Generic error. |
| `415 Unsupported Media Type` | `Content-Type` is not `application/json` | `unsupported_media_type` | Generic error. |
| `422 Unprocessable Entity` | One or more fields fail validation | `validation_error` | Show localized field-level errors. |
| `429 Too Many Requests` | Rate limit exceeded (section 3.2); includes a `Retry-After` header | `rate_limited` | Localized "too many attempts" message (`UX_UI_DIRECTION.md` section 4, Section 7), keep form data. Never show success. |
| `500 Internal Server Error` | Unexpected server error | `internal_error` | Generic error, keep form data, allow retry. |
| `503 Service Unavailable` | Google Sheets write failed or storage is misconfigured | `storage_unavailable` | Generic error, keep form data, allow retry. Never show success. |

Network failure or a non-JSON response is treated by the frontend like `500`.

Only `201` means the lead was saved, with one deliberate exception: the honeypot decoy (section 3.1), which only a bot filling the hidden field receives. Tests must not assume every `201` stored a row. Any other outcome must not show success and must not show Calendly (NFR-006, BR-001).

## 8. Field error codes

| Code | Meaning |
|---|---|
| `required` | Missing, `null`, or empty after trimming |
| `invalid_type` | Wrong JSON type |
| `too_short` | Below minimum length |
| `too_long` | Above maximum length |
| `invalid_characters` | Contains characters not allowed for the field |
| `full_name_required` | `name` has fewer than two words |
| `invalid_format` | `email` or `phone` does not match its format |
| `invalid_option` | `screening_answer` or `language` is not an allowed code |
| `consent_required` | `consent` is not `true` |

Example `422`:

```json
{
  "success": false,
  "message": "Validation failed.",
  "error_code": "validation_error",
  "field_errors": {
    "name": "full_name_required",
    "phone": "invalid_format"
  }
}
```

## 9. Configuration

Backend (environment variables; never committed; see `.env.example` once created):

| Variable | Purpose |
|---|---|
| `LEADS_STORAGE` | `google_sheets` (default in production) or `memory` (local development and automated tests only) |
| `GOOGLE_SERVICE_ACCOUNT_FILE` | Absolute path to the service-account JSON key, stored outside the web root |
| `GOOGLE_SHEET_ID` | Target spreadsheet ID |
| `GOOGLE_SHEET_TAB` | Worksheet name (default `leads`) |
| `GOOGLE_SHEET_CALCULATOR_TAB` | Worksheet for calculator leads (default `calculator`; section 11.5) |
| `PRIVACY_NOTICE_VERSION` | Identifier of the current privacy notice (e.g. `2026-09-draft-1`) |
| `RATE_LIMIT_MAX_REQUESTS` | Requests allowed per IP per window (default `5`; `0` disables the limit, for tests and local development only) |
| `RATE_LIMIT_WINDOW_SECONDS` | Length of the rate-limit window in seconds (default `600`) |
| `GHL_SYNC` | `on` or `off` (default `off`). `off` sends nothing to GoHighLevel and writes `crm_status` = `off` (section 12); tests and local development use `off` or a fake client |
| `GHL_API_TOKEN` | GoHighLevel private integration token (a secret: the server's environment only, never committed or logged; NFR-007) |
| `GHL_LOCATION_ID` | Gaby's GoHighLevel location (sub-account) id |
| `GHL_FIELD_MESES`, `GHL_FIELD_ZONA`, `GHL_FIELD_MONEDA`, `GHL_FIELD_ALERTA`, `GHL_FIELD_PRESELECCION` | The ids of the custom fields Gaby creates in GoHighLevel (section 12) |
| `GHL_TIMEOUT_SECONDS` | Time limit for each GoHighLevel request (default `5`) |

Frontend (Astro public build-time variables):

| Variable | Purpose |
|---|---|
| `PUBLIC_LEAD_ENDPOINT` | Defaults to `/api/save-lead` |
| `PUBLIC_SCHEDULER_URL` | Gaby's GoHighLevel booking widget URL (ADR-006, US-037; it replaces `PUBLIC_CALENDLY_URL`). Use the final widget URL, not one that redirects |
| `PUBLIC_CALCULATOR_ENDPOINT` | Defaults to `/api/save-calculator-lead` (section 11) |
| `PUBLIC_CRC_PER_USD` | Colones per US dollar for the calculator's currency switch (default `500`; v1.3, FR-034). Not sent to the API |
| `PUBLIC_CONTACT_EMAIL` | Fallback contact email, currently `gkelly@poliartcr.com` |

Local development: the Astro dev server proxies `/api/*` to the local Python server (default `http://127.0.0.1:5000`), so the frontend always calls the same relative path.

## 10. Test obligations

- Frontend unit tests (Vitest) and backend tests (pytest) must cover every rule in section 3 with at least one valid and one invalid case per field, using the same shared example values.
- Backend tests must cover every status code in section 7, including a storage failure that returns `503` and does not report success, and `429` with its `Retry-After` header.
- Backend tests must cover the honeypot (section 3.1): a filled or non-string `website` returns `201` and nothing is stored; an absent, `null`, empty, or whitespace-only `website` is processed normally; a bot never receives `422`.
- Backend tests must cover the rate limit (section 3.2) with an injected clock: the request over the limit gets `429` and is not counted; a retry after `Retry-After` seconds is accepted; limiter entries are dropped after the window.
- Frontend tests must cover the `429` message and that the hidden `website` field is sent.
- The end-to-end test (Playwright) must cover: landing → form → `201` → success message → Calendly visible; and a failure path where Calendly stays hidden.

## 11. Calculator leads (v1.2)

The calculator (US-035, [`PROJECT_SPEC.md`](PROJECT_SPEC.md) FR-034, FR-035) stores a lead before showing its result. It is a second endpoint on the same application, with the same conventions (section 1), limits, honeypot, rate limit, responses and server-generated fields as `/api/save-lead`, except where this section says otherwise.

### 11.1 Endpoint

| Item | Value |
|---|---|
| Method | `POST` |
| Path | `/api/save-calculator-lead` (application route `/save-calculator-lead`) |
| Request and response content type | `application/json` |
| Max request body | 10 KB |
| Authentication | None. Honeypot `website` (section 3.1) as for `/api/save-lead`, and a rate limit that works as section 3.2 but with **its own budget**: the calculator's requests are counted separately from the VIP endpoint's, so using the calculator (or recalculating) never makes a VIP application return `429`. Same configuration (`RATE_LIMIT_MAX_REQUESTS`, `RATE_LIMIT_WINDOW_SECONDS`), applied to each endpoint on its own. Section 3.2 is unchanged for `/api/save-lead`. |

### 11.2 Request body

```json
{
  "name": "Ana María Pérez Soto",
  "email": "ana.perez@example.com",
  "phone": null,
  "language": "es",
  "consent": true,
  "marketing_consent": false,
  "months": 4.43,
  "zone": "alert",
  "currency": "USD",
  "concentration_alert": true
}
```

| Field | Type | Required | Rules (client AND server) | Stored as |
|---|---|---|---|---|
| `name` | string | yes | As in section 3. | normalized value |
| `email` | string | yes | As in section 3. | normalized value |
| `phone` | string or `null` | no | Absent, `null`, or empty after trimming: no phone. Otherwise the section 3 rules (E.164). | normalized value, or empty |
| `language` | string (enum) | yes | `es` or `en`. | code |
| `consent` | boolean | yes | Must be JSON `true` (the required calculator consent, [`CONTENT.md`](../ux/CONTENT.md) §11.2). | `TRUE` |
| `marketing_consent` | boolean | no | JSON `true` or `false`; absent means `false`. The optional consent to Gaby's follow-up emails (FR-035, BR-012). | `TRUE` or `FALSE` |
| `months` | number or `null` | yes | `null` only with the zone `financially_free` (the monthly gap is 0 or less, FR-034). Otherwise a number ≥ 0 with at most two decimal places: the exact months **rounded down** to two decimals. No upper limit. | written with exactly two decimals and a point (`6` → `6.00`, `4.43` → `4.43`), or empty when `null` |
| `zone` | string (enum) | yes | `critical`, `alert`, `building`, `path_to_freedom`, `solid_cushion` or `financially_free`, and consistent with `months`: `null` → `financially_free`; below 3 → `critical`; 3 to below 6 → `alert`; 6 to below 12 → `building`; 12 to below 36 → `path_to_freedom`; 36 or more → `solid_cushion`. | code |
| `currency` | string (enum) | yes (v1.3) | `USD` or `CRC`: the currency the visitor chose. | code |
| `concentration_alert` | boolean | yes (v1.3) | `true` when the visitor said 20% to 50%, or over 50%, of their investments are in their own company's shares; otherwise `false` (FR-034). | `TRUE` or `FALSE` |

The figures the visitor typed into the calculator are never sent (FR-035); a request that carries extra fields has them ignored and never stored or forwarded.

Why two decimals, rounded down: the page shows the months with Gaby's rounding to the nearest (FR-034), which near a zone's lower limit can show the limit itself (5.96 is shown as "6" in `alert`). Rounding the sent value **down** to two decimals keeps it on the same side of every limit as the exact value (5.96 stays below 6; 6.0 exactly stays 6.00), so the server's consistency check is exact, and the value shown to the visitor can be derived from it (section 12).

### 11.3 Field error codes

The codes of section 8, plus:

| Code | Field | Meaning |
|---|---|---|
| `invalid_format` | `months` | Negative, not finite, or more than two decimal places |
| `invalid_option` | `zone` | Not one of the six codes of section 11.2 |
| `zone_mismatch` | `zone` | The zone does not match `months` (section 11.2) |
| `invalid_option` | `currency` | Not `USD` or `CRC` |

`consent_required` applies to `consent`; `marketing_consent` and `concentration_alert` have `invalid_type` (and `concentration_alert` also `required`).

### 11.4 Responses

As in section 7. `201` means the row was appended (or a honeypot decoy). The frontend shows the result only after a `201` (US-035 AC4); on any other outcome it shows the error and keeps the result hidden (NFR-006).

### 11.5 Google Sheets row

One row per successful request, in the tab named by `GOOGLE_SHEET_CALCULATOR_TAB` (default `calculator`), in this column order:

| Column | Source |
|---|---|
| `submitted_at` | server (section 5) |
| `name` | request |
| `email` | request |
| `phone` | request, or empty |
| `language` | request |
| `months` | request, or empty when covered |
| `zone` | request (code) |
| `consent` | request (`TRUE`) |
| `marketing_consent` | request (`TRUE` / `FALSE`) |
| `source` | server, always `calculator` (FR-039) |
| `privacy_notice_version` | server (section 5) |
| `status` | server (`started`); same allowed values as section 6 |
| `currency` | request (v1.3) |
| `concentration_alert` | request (`TRUE` / `FALSE`, v1.3) |
| `crm_status` | server (v1.3): `pending`, `sent`, `failed`, `off` or (v1.3.1) `superseded` (section 12) |

The three v1.3 columns are added at the end, so rows written by v1.2 keep their columns; a v1.2 row's `months` has one decimal and its `zone` uses the v1.2 codes (`alert`, `building`, `freedom`). The preview stored nothing, so no production row exists in that format.

Values are written as raw strings, as in section 6.

### 11.6 Test obligations

As section 10, for this endpoint: every rule of section 11.2 with a valid and an invalid case (including `phone` absent, `null` and empty; `marketing_consent` absent; `months` `null` with `financially_free`; a value above 1,000 accepted; three decimals rejected; each zone boundary: 2.99 → `critical`, 3 → `alert`, 5.99 → `alert`, 6 → `building`, 11.99 → `building`, 12 → `path_to_freedom`, 35.99 → `path_to_freedom`, 36 → `solid_cushion`; each mismatch; `currency` and `concentration_alert` missing and invalid); the honeypot; the calculator's own rate-limit budget (requests to it do not count against `/api/save-lead`, and the reverse); a storage failure returning `503`; that the row has no figures from the calculator; and section 12. End-to-end (US-044): calculator → details → `201` → result shown; a failure path where the result stays hidden; and in a preview build, no request to `/api`.

## 12. GoHighLevel contacts (v1.3)

[ADR-008](../decisions/ADR-008_GOHIGHLEVEL_CONTACTS.md), [`PROJECT_SPEC.md`](PROJECT_SPEC.md) FR-041. Both endpoints send the person to Gaby's GoHighLevel account as a contact, through GoHighLevel's contacts API (create or update, matched on the email). It is a server-side step: the request and the responses of both endpoints do not change, and the browser never talks to GoHighLevel's API.

**When.** After the row is appended (the save, FR-041: the sheet is the record). In order: the row is appended with `crm_status` = `pending` (or `off` when `GHL_SYNC` is `off`); then the contact is sent; then the row's `crm_status` cell is updated to `sent` or `failed`. The response is sent only after these steps, so it never reports a lead that was not stored. If the append fails, the response is `503` and nothing is sent to GoHighLevel, so no contact exists for a result the visitor never saw. A honeypot decoy (section 3.1) and a request rejected with any `4xx` send nothing. If the process stops between the send and the cell update, the row stays `pending`; the resend command covers it (resending is safe: the contact is matched on its email).

**What is sent.**

| GoHighLevel | `/api/save-calculator-lead` | `/api/save-lead` |
|---|---|---|
| name, email, phone | from the request (phone only if given) | from the request |
| tags | `lead-calculadora`; `idioma-es` or `idioma-en` (the request's `language`); plus `consentimiento-correos` when `marketing_consent` is `true` | `aplicacion-vip`; `idioma-es` or `idioma-en` |
| custom field `meses` (`GHL_FIELD_MESES`) | the months as the visitor saw them, derived from `months` with Gaby's rule (below 10: rounded to the nearest tenth, written without a decimal when it is whole, as in the prototype; from 10: a whole number rounded to the nearest). Ties round **half up**, computed on the exact decimal value, never on binary floating point (Python: `decimal.Decimal` with `ROUND_HALF_UP`; the page uses the same rule, FR-034): 9.95 → `10`, 9.96 → `10`, 4.45 → `4.5` (written `4,5` in Spanish), 10.49 → `10`, 10.5 → `11`. Written with a decimal comma (the Spanish form the visitor saw). Empty when `months` is `null` | — |
| custom field `zona` (`GHL_FIELD_ZONA`) | the zone's Spanish label: Zona crítica, Zona de alerta, Base en construcción, Camino a la libertad, Colchón sólido, Libre financieramente | — |
| custom field `moneda` (`GHL_FIELD_MONEDA`) | `USD` or `CRC` | — |
| custom field `alerta_concentracion` (`GHL_FIELD_ALERTA`) | `sí` or `no` | — |
| custom field `preseleccion` (`GHL_FIELD_PRESELECCION`) | — | the Spanish text of the screening answer ([`CONTENT.md`](../ux/CONTENT.md) `form.screening.*`) |

Nothing else is sent: never the calculator's figures, the IP address or the honeypot. An existing contact keeps its other tags and fields; the ones above are set.

**Outcome.** The row's last column, `crm_status`, records it: `pending` while the send is under way (or left by an interrupted process); `sent` when GoHighLevel confirmed the contact; `failed` when it did not answer within `GHL_TIMEOUT_SECONDS`, refused the request, or the configuration is incomplete; `off` when `GHL_SYNC` is `off`; `superseded` (v1.3.1) when the resend command skipped the row because a later row has the same email (Resending, below). A failure in GoHighLevel never changes the endpoint's response: the lead is saved, the response is `201`, and the visitor sees their result or next screen. The server logs a failure without personal data (no name, email or phone; the status code and the row's `submitted_at` only). A failure in the cell update after a successful send leaves the row `pending` and still returns `201` (the lead is stored); the resend command settles it.

**Resending.** A command on the server (documented in the runbook) resends the rows whose `crm_status` is `failed` or `pending` and updates the column. It is run by hand. It works one tab at a time, oldest row first, and (v1.3.1) does **not** resend a `failed` or `pending` row when a later row in the same tab has the same email (compared after the section 3 normalization): it sets that row's `crm_status` to `superseded` instead, because GoHighLevel matches contacts on the email and the older values would overwrite the newer submission's. The later row is sent on its own (at its save, or by this command if it is itself `failed` or `pending`). `superseded` rows are never resent.

**Tests (pytest).** With a fake GoHighLevel client: the payload of each endpoint (tags, fields, the consent tag only with `marketing_consent`, `meses` derived half up at 4.45, 9.95, 9.96, 10.49 and 10.5 with the outputs above, empty `meses` for `null`); the order (the row appended as `pending` before the send; a failed append returns `503` and sends nothing); no call for a honeypot decoy, a `4xx`, or `GHL_SYNC` = `off`; a timeout and an error response give `crm_status` = `failed` and still `201`; the resend command picks up `failed` and `pending` rows, and (v1.3.1) marks an older row `superseded` without sending it when a later row in the same tab has the same email, while a row with no later duplicate is still resent; the token never appears in logs or responses. No test calls the real GoHighLevel API.
