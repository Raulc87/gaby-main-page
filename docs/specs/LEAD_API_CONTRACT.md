# LEAD_API_CONTRACT — Save Lead

## Metadata
- Version: 1.0
- Status: Approved — LOCKED for Sprint 001
- Related spec: `docs/specs/PROJECT_SPEC.md` (FR-006 to FR-010, FR-013, NFR-005, NFR-006)
- Related stories: US-004, US-005, US-006, US-007, US-011
- Related ADRs: ADR-001 (backend hosting), ADR-002 (Google Sheets access)
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
| Authentication | None (public form). Spam protection is tracked in US-013. |
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

Unknown fields are ignored. Fields with the wrong JSON type are validation errors.

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
| `201 Created` | Row appended to Google Sheets | `null` | Show success message, then inline Calendly (US-007). |
| `400 Bad Request` | Body is not valid JSON or not a JSON object | `invalid_json` | Generic error, keep form data, allow retry. |
| `404 Not Found` | Unknown path | `not_found` | Generic error. |
| `405 Method Not Allowed` | Method other than `POST` (response includes `Allow: POST`) | `method_not_allowed` | Generic error. |
| `413 Payload Too Large` | Body larger than 10 KB | `payload_too_large` | Generic error. |
| `415 Unsupported Media Type` | `Content-Type` is not `application/json` | `unsupported_media_type` | Generic error. |
| `422 Unprocessable Entity` | One or more fields fail validation | `validation_error` | Show localized field-level errors. |
| `429 Too Many Requests` | Reserved for spam protection (US-013); not emitted in Sprint 001 | `rate_limited` | "Please try again later." |
| `500 Internal Server Error` | Unexpected server error | `internal_error` | Generic error, keep form data, allow retry. |
| `503 Service Unavailable` | Google Sheets write failed or storage is misconfigured | `storage_unavailable` | Generic error, keep form data, allow retry. Never show success. |

Network failure or a non-JSON response is treated by the frontend like `500`.

Only `201` means the lead was saved. Any other outcome must not show success and must not show Calendly (NFR-006, BR-001).

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
| `PRIVACY_NOTICE_VERSION` | Identifier of the current privacy notice (e.g. `2026-09-draft-1`) |

Frontend (Astro public build-time variables):

| Variable | Purpose |
|---|---|
| `PUBLIC_LEAD_ENDPOINT` | Defaults to `/api/save-lead` |
| `PUBLIC_CALENDLY_URL` | Calendly scheduling URL (placeholder until provided) |
| `PUBLIC_CONTACT_EMAIL` | Fallback contact email, currently `gkelly@poliartcr.com` |

Local development: the Astro dev server proxies `/api/*` to the local Python server (default `http://127.0.0.1:5000`), so the frontend always calls the same relative path.

## 10. Test obligations

- Frontend unit tests (Vitest) and backend tests (pytest) must cover every rule in section 3 with at least one valid and one invalid case per field, using the same shared example values.
- Backend tests must cover every status code in section 7 except `429`, including a storage failure that returns `503` and does not report success.
- The end-to-end test (Playwright) must cover: landing → form → `201` → success message → Calendly visible; and a failure path where Calendly stays hidden.
