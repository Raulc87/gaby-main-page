# ADR-002 — Google Sheets access with a service account

- Status: Accepted
- Date: 2026-09-23
- Decision owner: Human project owner
- Related specs: `LEAD_API_CONTRACT.md`, US-006

## Decision Request
How does the Python endpoint authenticate to Google Sheets?

## Options Considered

### Option A — Service account + key file (selected)
Pros: no interactive login; works unattended on shared hosting; access limited to sheets explicitly shared with the service account.
Cons: key file must be protected and rotated if leaked.

### Option B — OAuth user credentials (refresh token)
Pros: acts as a real user.
Cons: token expiry/revocation, consent screen setup, harder to operate.

### Option C — Apps Script web app
Covered in ADR-001 Option D; rejected for the same reasons.

## Decision
Option A. A Google Cloud project owned by the project owner's or Gabriela's Google account (TBD) holds a service account with the Google Sheets API enabled. The lead sheet is shared with the service account's email as Editor.

## Consequences
- Key file lives outside the web root; path given by `GOOGLE_SERVICE_ACCOUNT_FILE`; never committed.
- Changing the owning Google account later only requires re-sharing the sheet or creating a new service account; no code change.
- Libraries: `gspread` + `google-auth`.
- Rows appended with raw value input (no formula interpretation).

## Validation
Local run with real credentials appends a row (US-012 AC1); pytest covers the adapter with a fake client.

## Review Trigger
Organization policies block service-account keys, or write volume exceeds Sheets quotas.
