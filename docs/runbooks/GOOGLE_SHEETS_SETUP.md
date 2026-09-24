# GOOGLE_SHEETS_SETUP — Gabriela Kelly Pilot

How to create the Google Sheet and service account used by
`LEADS_STORAGE=google_sheets` (US-006, ADR-002). Needed only for real
Google Sheets mode — memory mode (the default) needs none of this; see
`docs/runbooks/LOCAL_DEVELOPMENT.md` section 5.

The Google account that owns the project/sheet (project owner's or
Gabriela's) is still an open question — see `PROJECT_CONTEXT.md`. Any
account can follow these steps; re-sharing the sheet with a new service
account later requires no code change (ADR-002).

## 1. Create a Google Cloud project and enable the Sheets API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a project (or reuse an existing one you control).
2. In **APIs & Services → Library**, search for **Google Sheets API** and enable it for the project.

## 2. Create a service account

1. In **APIs & Services → Credentials**, click **Create Credentials → Service account**.
2. Give it a descriptive name (e.g. `gaby-leads-writer`). No project-level role is required — access is granted per-sheet in step 4.
3. Finish creating the service account, then open it and go to the **Keys** tab.
4. **Add Key → Create new key → JSON**. This downloads a JSON key file — treat it as a secret.

## 3. Store the key file outside the repository

- Move the downloaded file somewhere **outside** the project's web root and outside this Git repository (e.g. `~/secrets/gaby-service-account.json`).
- Never commit it. `.gitignore` already excludes any `*service-account*.json` filename as a safety net, but the file should not live under the repository at all.
- Note the service account's email address (looks like `gaby-leads-writer@<project-id>.iam.gserviceaccount.com`) — you'll need it in the next step.

## 4. Create the lead sheet and share it

1. Create a new Google Sheet (e.g. "Gabriela Kelly — Leads").
2. Rename the first worksheet tab to `leads` (matches `GOOGLE_SHEET_TAB` default; use a different tab name only if you also set `GOOGLE_SHEET_TAB` to match).
3. In row 1, add the header row in this **exact order** (`LEAD_API_CONTRACT.md` section 6):

   | A | B | C | D | E | F | G | H | I |
   |---|---|---|---|---|---|---|---|---|
   | `submitted_at` | `name` | `email` | `phone` | `screening_answer` | `language` | `consent` | `privacy_notice_version` | `status` |

4. Click **Share**, paste the service account's email address (from step 3), give it **Editor** access, and uncheck "Notify people" (a service account has no inbox).
5. Copy the sheet ID from its URL: `https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit` — this is `GOOGLE_SHEET_ID`.

## 5. Add a status dropdown (data validation)

The endpoint only ever writes `status = started` on creation; the business owner updates it manually afterward. To make that easy and avoid typos:

1. Select the `status` column below the header (e.g. `I2:I1000`).
2. **Data → Data validation** (Google Sheets) → **Add rule**.
3. Criteria: **Dropdown** (or "List of items" in the classic editor), with these exact values, one per line:
   ```
   started
   contacted
   booked
   not_interested_yet
   dropped
   ```
4. On invalid data, choose **Reject input** so the column can't drift from the contract's allowed values.
5. Save.

## 6. Point the backend at the sheet

In `api/.env` (see `docs/runbooks/LOCAL_DEVELOPMENT.md` section 6):

```
LEADS_STORAGE=google_sheets
GOOGLE_SERVICE_ACCOUNT_FILE=/absolute/path/outside/webroot/service-account.json
GOOGLE_SHEET_ID=<the id from step 4.5>
GOOGLE_SHEET_TAB=leads
```

Restart `python run_local.py`, submit the form once, and confirm a new row appears with `status = started` and every other column populated as described in section 4.

## 7. Rotating or revoking the key

If the key file is ever exposed:

1. In the Cloud Console, delete the compromised key from the service account's **Keys** tab (this immediately invalidates it; it does not affect the account's access to the sheet).
2. Create a new key (step 2.4) and update `GOOGLE_SERVICE_ACCOUNT_FILE` to point at it.
3. No re-sharing or code change is needed — the sheet was shared with the service account's email, not with a specific key.
