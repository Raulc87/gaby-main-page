# DEPLOYMENT — Gabriela Kelly Pilot (GoDaddy cPanel)

Step-by-step runbook for the human owner to deploy the site to GoDaddy cPanel by hand.
Related: `docs/decisions/ADR-001_BACKEND_HOSTING.md` (hosting choice), `docs/decisions/ADR-002_GOOGLE_SHEETS_ACCESS.md`
(service account), `docs/specs/LEAD_API_CONTRACT.md` section 9 (every environment variable),
`docs/runbooks/GOOGLE_SHEETS_SETUP.md` (creating the production sheet and service account),
`docs/sprints/SPRINT_002.md` (the go-live gate).

This is the runbook US-014 AC1, AC5 and AC6 require, and it completes US-016 AC7. It also
supports AC2–AC4 (the Python version, HTTPS, and Gabriela's production sheet), but those need
the human owner to actually perform the steps on the real account — a runbook can't close them
by itself. It does **not** decide *when* to go live — that is the go-live gate in section 10,
and it is the human owner's call.

Every command below uses `<your-domain>` as a placeholder for the real domain — replace it
throughout. Nothing in this file contains a real domain, sheet ID, key, or password.

## 1. Prerequisites

- [ ] cPanel access for the GoDaddy hosting account, with the **Setup Python App** feature
  under *Software* (confirmed available per `ADR-001`; if it's missing on this plan, stop and
  see ADR-001's Option B fallback before continuing).
- [ ] The final domain is registered and pointed at this hosting account, and GoDaddy/cPanel
  has issued an SSL certificate for it (AutoSSL is usually automatic on cPanel; confirm under
  *Security → SSL/TLS Status* that it shows a valid certificate for `<your-domain>` before
  section 5).
- [ ] The production Google Sheet and service account exist in **Gabriela's** Google account
  (US-014 AC4) — follow `docs/runbooks/GOOGLE_SHEETS_SETUP.md` end to end once, using her
  account rather than a development one. Keep the downloaded key file and the sheet ID at
  hand; you'll need them in section 4.
- [ ] The final `PUBLIC_CALENDLY_URL` and `PUBLIC_CONTACT_EMAIL` (go-live gate item 3 in
  `SPRINT_002.md`) — if either is still a placeholder, you can still deploy behind password
  protection (section 6), but go-live waits until both are real.
- [ ] A local clone of this repository, with `npm ci` already run once (see
  `docs/runbooks/LOCAL_DEVELOPMENT.md` section 2).

**Check:** you can log into cPanel, see *Setup Python App* under *Software*, and *SSL/TLS
Status* shows a certificate for `<your-domain>`.

## 2. Build the static frontend with production values

1. Create a local, git-ignored `.env.production` in the repository root (never commit it):
   ```
   PUBLIC_LEAD_ENDPOINT=/api/save-lead
   PUBLIC_CALENDLY_URL=<the real Calendly URL>
   PUBLIC_CONTACT_EMAIL=<the real contact email>
   ```
   Astro (via Vite) picks up `.env.production` automatically for `npm run build` — no extra
   flags needed.
2. From the repository root:
   ```bash
   npm run build
   ```
   This produces a `dist/` folder with `index.html`, `es/index.html` and `en/index.html`
   (confirmed locally: a production build with placeholder values produced exactly these
   three pages, and the placeholder Calendly URL and contact email were both baked into the
   built HTML — this is a build-time substitution, not a runtime one, so a wrong value here
   means rebuilding and re-uploading, not an environment variable you can fix in cPanel).
3. Upload the **contents** of `dist/` (not the `dist` folder itself) to the site's document
   root — for the primary domain this is `public_html/`; for a subdomain or addon domain, the
   folder cPanel shows for that domain under *Domains*. Use cPanel's File Manager (upload a
   zip of `dist/`'s contents, then extract in place) or an SFTP client.

**Check:** `https://<your-domain>/es/` and `https://<your-domain>/en/` both load (once section
5's HTTPS redirect is in place; before that, `http://` is fine for this check only). Don't
worry yet that the lead form doesn't save anything — that needs section 3.

## 3. Create the Python app in cPanel ("Setup Python App")

1. cPanel → *Software* → **Setup Python App** → **Create Application**.
2. **Python version:** pick **3.11** if offered; otherwise the highest 3.9+ version available
   (the backend is tested against 3.9–3.11 for exactly this reason — see ADR-001). **Tell me
   the exact version this account offers so I can record it in `ADR-001`'s Validation
   section** — I can't see your cPanel account from here, and that section is explicitly
   waiting on this.
3. **Application root:** a folder **outside** the document root from section 2 — for example
   `gaby-api` (sibling to `public_html`, i.e. `/home/<cpanel_user>/gaby-api`), not
   `public_html/api`. Keeping the backend's source and virtualenv out of the publicly served
   folder means nothing in it can ever be served as a static file by mistake.
4. **Application URL:** `<your-domain>` with the path `/api`.
5. **Application startup file:** `passenger_wsgi.py`.
6. **Application Entry point:** `application` (the WSGI callable `api/passenger_wsgi.py`
   already defines — `application = create_app(api_prefix="")`).
7. Click **Create**. cPanel creates the application root folder and a dedicated virtualenv,
   and shows a command to activate that virtualenv from a terminal (looks like
   `source /home/<cpanel_user>/virtualenv/gaby-api/3.11/bin/activate`) — you won't need it
   unless you use the terminal method in step 9.
8. Upload the contents of this repository's `api/` folder into the application root
   (`gaby-api/` from step 3), preserving the directory structure. Upload:
   - `app.py`, `config.py`, `errors.py`, `logging_utils.py`, `passenger_wsgi.py`,
     `rate_limit.py`, `responses.py`, `time_utils.py`, `validation.py`
   - `requirements.txt`
   - the `routes/` and `storage/` folders (with their `.py` files)

   Do **not** upload: `run_local.py` (local-dev only, harmless but unnecessary),
   `requirements-dev.txt` (pytest and `python-dotenv`, dev-only), `tests/`, `pytest.ini`,
   `.venv/` or any `__pycache__/`, or **`.env`** — production configuration is set as cPanel
   environment variables in section 4, not a `.env` file (the code already reflects this:
   `passenger_wsgi.py` never loads one, unlike `run_local.py`).
9. Install dependencies. On the app's detail page (cPanel → *Setup Python App* → click the
   app), there's a **requirements.txt** field — enter the path relative to the application
   root (just `requirements.txt` if you uploaded it directly there) and click **Run Pip
   Install**. If that control isn't available in your cPanel skin, use the *Terminal* app
   instead: run the `source .../activate` command from step 7, then
   `cd` into the application root and run `pip install -r requirements.txt`.
10. Click **Restart** on the app's detail page.

**Check:** visiting `https://<your-domain>/api/save-lead` with a plain `GET` (e.g. in a
browser) returns a JSON body with `"error_code": "method_not_allowed"` and HTTP 405 — not a
500, a blank page, or a generic Passenger error page. That confirms the app started and
`passenger_wsgi.py` is being served, even before any environment variable in section 4 is set
(the app runs with `LEADS_STORAGE` defaulting to `google_sheets` per `passenger_wsgi.py`, so
it will report `503`/`storage_unavailable` on an actual lead submission until section 4 is
done — expected at this point, not a failure).

## 4. Environment variables

On the app's detail page in *Setup Python App*, use the **Environment variables** section to
add each of these (contract section 9), then **Restart** the app for changes to take effect.

| Variable | Production value |
|---|---|
| `LEADS_STORAGE` | `google_sheets` — set it explicitly even though it's also the default when unset (US-016 AC5), so it's visible in the cPanel UI rather than implicit |
| `GOOGLE_SERVICE_ACCOUNT_FILE` | Absolute path to the key file **outside both the document root and the application root** — e.g. `/home/<cpanel_user>/secrets/service-account.json`. Upload it via File Manager or SFTP directly to that path (not through the app's own folder), then restrict its permissions: File Manager → select the file → *Permissions* → `600` (owner read/write only), or `chmod 600` from the Terminal app. |
| `GOOGLE_SHEET_ID` | The production sheet's ID from `docs/runbooks/GOOGLE_SHEETS_SETUP.md` step 4.5 |
| `GOOGLE_SHEET_TAB` | `leads` (unless you renamed the tab in the Sheets setup) |
| `PRIVACY_NOTICE_VERSION` | Whatever `api/.env.example` documents at deploy time (this is `GK-018-privacy-version`'s job to finalize; don't hand-pick a value here) |
| `RATE_LIMIT_MAX_REQUESTS` | Leave **unset** (defaults to `5`) or set an explicit number above `0`. **Never `0` in production** — `0` disables spam protection entirely (contract section 9 reserves `0` for tests and local development) |
| `RATE_LIMIT_WINDOW_SECONDS` | Leave unset (defaults to `600`) unless you have a specific reason to change it |

**Check:** after restarting, look at the app's log (section 7 below) for the startup line. It
should read `Lead storage active: google_sheets (key_file_exists=True, key_file_readable=True,
sheet_id_set=True, sheet_tab='leads')` — all three booleans `True`. If any is `False`, fix that
specific thing (the path, its permissions, or the missing variable) and restart again before
moving on; section 7's table below maps each possible startup problem and runtime error to its
likely cause.

## 5. HTTPS: force HTTP to HTTPS

Check first whether your GoDaddy cPanel exposes a built-in toggle: *Domains* → manage
`<your-domain>` → **Force HTTPS Redirect** (wording varies by cPanel theme/version). If present,
enable it and skip the `.htaccess` below.

If there's no such toggle, this `.htaccess` content does the same thing. **This is a
deploy-time file, not part of the Git repository** — place it directly in the document root
(`public_html/.htaccess`) via File Manager, and don't commit it. If you'd rather it live in
the repo and be deployed automatically, tell me and I'll propose where it should go and who
owns it, since `src/**` and the build output aren't in my ownership.

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

**Check:** `curl -I http://<your-domain>/` (note: plain `http://`) returns `301` with a
`Location: https://<your-domain>/` header, and `https://<your-domain>/` itself loads without
a certificate warning.

## 6. Password-protect the whole site until go-live (US-014 AC6)

Until the go-live gate in section 10 passes, nothing on the site — including the API — may be
reachable by a real visitor, so it can't collect leads under a still-draft privacy notice.

1. cPanel → *Files* → **Directory Privacy**.
2. Navigate to the document root (`public_html`, or the relevant domain's folder).
3. Check **Password protect this directory**, give it a name, save, then create a user
   (choose a username and a strong password — not any value used elsewhere, and share it with
   collaborators out of band, never by committing it here).

**Important — verify `/api` is actually covered, don't assume it:** cPanel's Directory Privacy
works by placing Basic Auth directives that Apache evaluates for a directory. The Python app
from section 3 is served through Passenger, which on some cPanel configurations intercepts
its mounted URL (`/api`) before Apache's normal per-directory auth would apply — so protecting
`public_html` might fully protect `/` while leaving `/api` reachable. The check below is
exactly how you catch that; don't skip it.

**Check (run both, with no credentials):**
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://<your-domain>/
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://<your-domain>/api/save-lead \
  -H "Content-Type: application/json" -d '{}'
```
Both must print `401`. If the first does and the second doesn't, Directory Privacy isn't
reaching the Python app on this account — stop and tell me before going further; I can add an
application-level fallback (e.g. HTTP Basic Auth inside the Flask app itself, behind its own
environment variable) if cPanel's mechanism doesn't cover it here, but I won't add that
without confirming it's actually needed on your account.

**Removing it at go-live:** cPanel → *Files* → *Directory Privacy* → the same directory →
uncheck **Password protect this directory** → save. Re-run the two `curl` checks above; both
should now return something other than `401` (the real page, and `422` for the empty body).

## 7. Logs (US-016 AC7)

**Where:** Passenger writes the app's stdout/stderr — which is where every log line from
section 4's check and the tables below appears — to a log file cPanel exposes from the
*Setup Python App* interface: open the app's detail page and look for a **Log file** link or
path near the top. If your account doesn't show one directly there, check cPanel → *Metrics*
→ **Errors**, which also surfaces Apache/Passenger-level failures (including one that
prevented the app from starting at all, which wouldn't produce any of the lines below since
the app's own logging never ran). **Record the exact path you find here** once you've located
it on this account, so this runbook is precise for next time.

**What the startup line looks like** (also the section 4 check): one `INFO` line naming the
active storage, and for `memory` an additional `WARNING` — see section 4.

**Common causes per logged `ERROR`:**

| Log shows | Likely cause | Fix |
|---|---|---|
| `storage_unavailable (cause=FileNotFoundError)` | `GOOGLE_SERVICE_ACCOUNT_FILE` points to a path that doesn't exist | Check the path was typed correctly and the file was actually uploaded there |
| `storage_unavailable (cause=PermissionError)` | The key file exists but the app's process can't read it | Check its permissions are `600` and owned by the cPanel account the app runs as |
| `storage_unavailable (cause=SpreadsheetNotFound)` | `GOOGLE_SHEET_ID` is wrong, or the sheet was deleted | Re-copy the ID from the sheet's URL (`docs/runbooks/GOOGLE_SHEETS_SETUP.md` step 4.5) |
| `storage_unavailable (cause=WorksheetNotFound)` | `GOOGLE_SHEET_TAB` doesn't match an actual tab name in the sheet | Confirm the tab is named exactly `leads` (or whatever `GOOGLE_SHEET_TAB` is set to) |
| `storage_unavailable (cause=APIError 403)` | The service account doesn't have access, or the Google Sheets API isn't enabled on its project | Re-check `docs/runbooks/GOOGLE_SHEETS_SETUP.md` steps 1–2 (API enabled) and step 4.4 (sheet shared with the service account's email as Editor) |
| `storage_unavailable (cause=APIError 404)` | The sheet ID doesn't exist (typo, or it was deleted/moved) | Re-copy the sheet ID |
| `storage_unavailable (cause=<something else>)` | An unanticipated Google API or network failure | The exception class in the log names it; search it together with "gspread" for the specific cause |
| `internal_error (<ExceptionClass>)` followed by a traceback | An application bug, not a configuration problem | The traceback's file and line point at the bug; this needs a code fix, not an environment variable |
| Startup `key_file_exists=False` | Same as `FileNotFoundError` above, but caught before any lead was even submitted | Same fix |
| Startup `key_file_readable=False` | Same as `PermissionError` above | Same fix |
| Startup `sheet_id_set=False` | `GOOGLE_SHEET_ID` isn't set in cPanel's environment variables | Add it (section 4) and restart |
| Startup line says `Lead storage active: memory` (with a `WARNING`) | `LEADS_STORAGE` is explicitly set to `memory` in cPanel, overriding the production default | Remove that variable or set it to `google_sheets`, then restart |

No log line ever contains the submitted name, email, phone, or the visitor's IP address (see
`api/logging_utils.py` and pytest coverage in `api/tests/test_error_logging.py`) — if you see
any of those in the log, that's a bug in the app, not this runbook; tell me.

One thing outside the app's own logging that this doesn't control: cPanel/Apache's own access
log for the domain records every visitor's IP for every request, same as any web server. That
log exists independently of anything above and isn't a contract violation — it's standard web
server behavior, not something the application writes.

## 8. Post-deploy smoke test (US-014 AC5)

Run this while the site is still password-protected (section 6) — every request needs the
Directory Privacy credentials.

1. **Both languages load:** visit `https://<your-domain>/es/` and `https://<your-domain>/en/`
   in a browser (it will prompt for the Directory Privacy username/password first).
2. **A valid test lead saves correctly:** submit the form once with clearly fake, identifiable
   data (e.g. name "Test Delete Me", a real email you control so you can also verify the
   thank-you flow). Confirm a new row appears in the **production** sheet (not a dev sheet)
   with all nine columns from `LEAD_API_CONTRACT.md` section 6, `status = started`.
3. **Thank-you and the real Calendly appear:** after that submission, confirm the thank-you
   message shows and the real Calendly scheduler loads inline (not the `mailto:` fallback —
   if it shows the fallback, `PUBLIC_CALENDLY_URL` wasn't set before the build in section 2,
   and you'll need to rebuild and re-upload).
4. **A filled honeypot stores nothing** — from a terminal, with `-u` supplying the Directory
   Privacy credentials:
   ```bash
   curl -u <privacy_user>:<privacy_password> https://<your-domain>/api/save-lead \
     -X POST -H "Content-Type: application/json" \
     -d '{"name":"Test Delete Me","email":"test@example.com","phone":"+50684104791","screening_answer":"exploring","language":"es","consent":true,"website":"http://spam.example"}'
   ```
   Expect HTTP `201` with `"success": true` and `"error_code": null` — and **no** new row in
   the sheet from this one (the decoy response gives no signal to a bot, so confirm by sheet
   row count, not by the response itself).
5. **Six quick submissions trigger the rate limit:** repeat a normal (non-honeypot) submission
   six times in a row. The first five should succeed (or fail validation, if you reuse invalid
   test data — either way they count); the sixth must return `429` with a `Retry-After`
   header:
   ```bash
   for i in 1 2 3 4 5 6; do
     curl -u <privacy_user>:<privacy_password> -s -D - -o /dev/null \
       https://<your-domain>/api/save-lead -X POST -H "Content-Type: application/json" \
       -d '{}' | grep -E "HTTP|Retry-After"
   done
   ```
   Verified locally against the memory-mode backend with the production default (5 requests /
   600 seconds): the first five each returned their normal status, and the sixth returned
   `HTTP/1.1 429 TOO MANY REQUESTS` with a `Retry-After` header (592 in that run, i.e. just
   under 600 — the window had barely started). **This ties up the rate limit for that IP for
   up to 10 minutes afterward** — if you need to submit test leads again immediately, wait it
   out, or temporarily raise `RATE_LIMIT_MAX_REQUESTS` in cPanel, restart, test, then set it
   back and restart again.
6. **Delete the test rows:** remove every row this smoke test added to the production sheet
   (steps 2 and 5's non-honeypot attempts) before real visitors can see them — they're
   confirmed to arrive at all, not data to keep.

**Check:** all six items above behaved as described. If any didn't, fix the specific cause
(section 7's table covers storage failures) and re-run the smoke test from the top — a partial
pass isn't a pass.

## 9. Updating an existing deployment, and rolling back

**Updating:**
1. Frontend: rebuild (section 2) with the same `.env.production`, and re-upload `dist/`'s
   contents over the existing document root (overwrite in place). Keep a copy of the previous
   `dist/` output locally before overwriting, so you have something to roll back to.
2. Backend: upload the changed files into the application root from section 3 (overwrite in
   place), keeping a local copy of what was there before. If `requirements.txt` changed,
   re-run **Run Pip Install** (or the terminal equivalent). Click **Restart** on the app's
   detail page either way — code changes don't take effect until Passenger restarts the app.

**Rolling back:** reverse the same steps with the previous copy — re-upload the previous
`dist/` output over the document root, and the previous backend files over the application
root, then **Restart** the app again. Environment variables (section 4) aren't touched by a
rollback unless the variable itself needs to change.

**Check (either way):** re-run section 3's check (`GET /api/save-lead` → `405`, not a 500 or a
blank page) and, once live, a single real-feeling form submission end to end.

## 10. Go-live checklist

Mirrors the go-live gate in `docs/sprints/SPRINT_002.md` — all of these, not some:

- [ ] US-013, US-016 and US-018 are merged.
- [ ] US-017 content is approved by Gabriela and merged; the human owner has decided which
  pending-validation markers, if any, remain.
- [ ] The final Calendly URL and contact email are set in the production build (section 2) —
  not placeholders.
- [ ] This runbook's smoke test (section 8) passes on the live HTTPS domain.
- [ ] Only once every item above is checked: remove the password protection (section 6) and
  announce the site.
