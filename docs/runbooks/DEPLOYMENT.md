# DEPLOYMENT — Gabriela Kelly Pilot (GoDaddy cPanel)

Step-by-step runbook for the human owner to deploy the site to GoDaddy cPanel by hand.
Related: `docs/decisions/ADR-001_BACKEND_HOSTING.md` (hosting choice), `docs/decisions/ADR-002_GOOGLE_SHEETS_ACCESS.md`
(service account), `docs/specs/LEAD_API_CONTRACT.md` section 9 (every environment variable),
`docs/runbooks/GOOGLE_SHEETS_SETUP.md` (creating the production sheet and service account),
`docs/sprints/SPRINT_002.md` (the go-live gate and the file ownership map).

This is the runbook US-014 AC1, AC5 and AC6 require, and it completes US-016 AC7. It also
supports AC2–AC4 (the Python version, HTTPS, and Gabriela's production sheet), but those need
the human owner to actually perform the steps on the real account — a runbook can't close them
by itself. It does **not** decide *when* to go live — that is the go-live gate in section 10,
and it is the human owner's call.

Every command below uses `<your-domain>` as a placeholder for the real domain — replace it
throughout. Nothing in this file contains a real domain, sheet ID, key, or password.

**Order matters.** Sections 2 and 3 put HTTPS and password protection in place *before*
anything is uploaded or connected to a real sheet, precisely so the site and the API are never
reachable by a real visitor while unprotected (US-014 AC6). Don't skip ahead.

## 1. Prerequisites

- [ ] cPanel access for the GoDaddy hosting account. GoDaddy's own documentation lists the
  **Setup Python App** feature under *Software* as available on cPanel hosting (ADR-001) —
  but that's GoDaddy's general documentation, not a check of *this* account. Confirm it's
  actually there before relying on it; if it's missing on this plan, stop and see ADR-001's
  Option B fallback.
- [ ] The final domain is registered and pointed at this hosting account, and GoDaddy/cPanel
  has issued an SSL certificate for it (AutoSSL is usually automatic on cPanel; confirm under
  *Security → SSL/TLS Status* that it shows a valid certificate for `<your-domain>` — section 2
  needs this).
- [ ] The production Google Sheet and service account exist in **Gabriela's** Google account
  (US-014 AC4) — follow `docs/runbooks/GOOGLE_SHEETS_SETUP.md` end to end once, using her
  account rather than a development one. Keep the downloaded key file and the sheet ID at
  hand; you'll need them in section 6.
- [ ] The final `PUBLIC_CALENDLY_URL` and `PUBLIC_CONTACT_EMAIL` (go-live gate item 3 in
  `SPRINT_002.md`) — if either is still a placeholder, you can still deploy behind password
  protection, but go-live waits until both are real.
- [ ] A local clone of this repository. You'll run `npm ci` fresh right before building
  (section 4) rather than relying on one done earlier — see that section for why.

**Check:** you can log into cPanel, see *Setup Python App* under *Software*, and *SSL/TLS
Status* shows a certificate for `<your-domain>`.

## 2. HTTPS: force HTTP to HTTPS

Do this **before** uploading anything (section 4) or enabling password protection (section 3):
once a visitor — or you, testing — can reach the site at all, every request should already be
forced to HTTPS, so a Basic Auth prompt (section 3) is never answered over plain HTTP.

Check first whether your GoDaddy cPanel exposes a built-in toggle: *Domains* → manage
`<your-domain>` → **Force HTTPS Redirect** (wording varies by cPanel theme/version). **Prefer
this over the `.htaccess` fallback below if it's available** — it redirects at the web-server
level before any authentication is evaluated, so it has no cleartext-credential exposure
window; the `.htaccess` fallback's redirect runs after Apache's auth phase, which matters once
section 3 adds a password prompt.

If there's no such toggle, this `.htaccess` content does the same thing. **This is a
deploy-time file, not part of the Git repository** — place it directly in the document root
(`public_html/.htaccess`) via File Manager, and don't commit it. If you'd rather it live in the
repo and be deployed automatically, that's a decision for whoever owns the frontend build
output (`SPRINT_002.md`'s file ownership map) to weigh in on first.

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

**If you use the `.htaccess` fallback:** once section 3's password protection is on, always
type `https://` explicitly when opening the site or entering Directory Privacy credentials —
never click through a plain `http://` link and let the redirect happen, since the very first
request (the one carrying the Basic Auth prompt's credentials) would otherwise go out
unencrypted before this rule ever runs.

**Check** — both the site and the API path, since section 3's password protection will cover
both and either could bypass the redirect independently of the other:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://<your-domain>/
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://<your-domain>/api/save-lead
```
With the cPanel toggle, both must print `301` (or `308`), and `https://<your-domain>/` must
load without a certificate warning — right now, before section 3 adds anything else. (The
second check will only make sense once section 5 creates the app; for now it will fail to
connect or 404, which is fine.)

**If you're using the `.htaccess` fallback instead, the expected result changes once section 3
turns password protection on** — re-run both checks again after section 3, and expect `401`,
not `301`: Apache evaluates Directory Privacy's Basic Auth *before* this rule ever runs (as
noted above), so an unauthenticated plain-`http://` request gets challenged for credentials
first. That `401` is actually the correct outcome here — it proves no plain-HTTP request can
reach the app content without a cleartext-credential exchange happening first, which is exactly
what section 3's warning is about. Re-run the `/api` variant again after section 5 for the same
reason as section 3's warning: if Passenger's routing for the mounted app bypasses the document
root's directory-level rules, neither the auth challenge nor this redirect rule may reach
`/api`, which the `401`/`301` outcome alone won't tell you — section 5 has the dedicated check
for that. A vhost-level toggle, if your cPanel offers one, has neither risk — another reason to
prefer it.

**After go-live (section 3's protection is removed):** re-run both of this section's checks one
more time. With either mechanism, both must now print `301`/`308` — this is the point where
US-014 AC3 ("HTTP redirects to HTTPS") is actually being verified on the live, public site, not
merely on a still-password-protected one. Section 10's checklist references this.

## 3. Password-protect the whole site until go-live (US-014 AC6)

Until the go-live gate in section 10 passes, nothing on the site — including the API — may be
reachable by a real visitor, so it can't collect leads under a still-draft privacy notice. Do
this now, before section 4 uploads anything: the document root already exists (even empty), so
Directory Privacy can be enabled ahead of time.

1. cPanel → *Files* → **Directory Privacy**.
2. Navigate to the document root (`public_html`, or the relevant domain's folder).
3. Check **Password protect this directory**, give it a name, save, then create a user
   (choose a username and a strong password — not any value used elsewhere, and share it with
   collaborators out of band, never by committing it here).

**Check now** (before anything is even uploaded):
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://<your-domain>/
```
Must print `401`.

**Important — verify `/api` is actually covered too, once section 5 creates it, don't
assume it:** cPanel's Directory Privacy works by placing Basic Auth directives that Apache
evaluates for a directory. The Python app from section 5 is served through Passenger, which on
some cPanel configurations intercepts its mounted URL (`/api`) before Apache's normal
per-directory auth would apply — so protecting `public_html` might fully protect `/` while
leaving `/api` reachable. Section 5 has the matching check; don't skip it, and don't set the
real production sheet in section 6 until it passes.

**Removing it at go-live:** cPanel → *Files* → *Directory Privacy* → the same directory →
uncheck **Password protect this directory** → save. Re-run this section's check and section
5's `/api` check; both should now return something other than `401`. Also re-run section 2's
two HTTPS checks now — with protection gone, both must print `301`/`308` (see section 2's
"After go-live" note).

For every authenticated command later in this runbook, avoid putting the password directly in
a command — typed literally, it would sit in shell history indefinitely. Set it once per
terminal session instead, with a form that works in both bash and zsh (zsh's `read -p` means
something different — "read from the coprocess" — and errors out; this doesn't):
```bash
printf 'Directory Privacy password: '; read -rs DP_PASS; echo
```
Then use `-u "<privacy_user>:$DP_PASS"` in place of a literal `-u user:password` in every
`curl` command below that needs it. This keeps it out of shell history; it's a smaller
improvement against a process listing (`ps`) on a shared machine, since curl still briefly has
the expanded value in its own argument list when it starts, before it can scrub it — most
systems' `curl` does that quickly, but if this machine is shared and that residual window
matters to you, use a `curl` config file (`-K`) with the credentials instead of `-u`.

## 4. Build the static frontend with production values

1. Run a **clean** install before building — not whatever `node_modules` happens to be sitting
   around locally, since it may predate the revision you're about to deploy:
   ```bash
   npm ci
   ```
2. Create a local, git-ignored `.env.production` in the repository root (never commit it):
   ```
   PUBLIC_LEAD_ENDPOINT=/api/save-lead
   PUBLIC_CALENDLY_URL=<the real Calendly URL>
   PUBLIC_CONTACT_EMAIL=<the real contact email>
   ```
   Astro (via Vite) picks up `.env.production` automatically for `npm run build` — no extra
   flags needed.
3. Build:
   ```bash
   npm run build
   ```
   This produces a `dist/` folder with `index.html`, `es/index.html` and `en/index.html`
   (confirmed locally: a production build with placeholder values produced exactly these
   three pages, and the placeholder Calendly URL and contact email were both baked into the
   built HTML — this is a build-time substitution, not a runtime one, so a wrong value here
   means rebuilding and re-uploading, not an environment variable you can fix in cPanel).
4. Upload the **contents** of `dist/` (not the `dist` folder itself) to the site's document
   root — for the primary domain this is `public_html/`; for a subdomain or addon domain, the
   folder cPanel shows for that domain under *Domains*. Use cPanel's File Manager (upload a
   zip of `dist/`'s contents, then extract in place) or an SFTP client.

**Check:** with the Directory Privacy credentials from section 3
(`-u "<privacy_user>:$DP_PASS"`), `https://<your-domain>/es/` and `https://<your-domain>/en/`
both load. Don't worry yet that the lead form doesn't save anything — that needs section 5.

## 5. Create the Python app in cPanel ("Setup Python App")

1. cPanel → *Software* → **Setup Python App** → **Create Application**.
2. **Python version:** pick **3.11** if offered; otherwise the highest 3.9+ version available.
   The backend is *written* to be compatible with 3.9+, but only 3.11 is actually exercised by
   CI (`.github/workflows/backend.yml` pins `3.11`) — if this account only offers an older
   version, run `pytest` once against it **locally** first (not on the server — `tests/`,
   `pytest.ini` and `requirements-dev.txt` are deliberately not uploaded in step 8 below, so the
   app's own virtualenv can't run them). `docs/runbooks/LOCAL_DEVELOPMENT.md` section 9 shows
   `uv venv --python <version>` for exactly this — create a venv pinned to the older version,
   install `requirements.txt` and `requirements-dev.txt` into it, and run `pytest` there before
   relying on that version in production. **Record the exact version this account offers in
   `ADR-001`'s Validation section** (`docs/decisions/ADR-001_BACKEND_HOSTING.md`) — that section
   is explicitly waiting on it.
3. **Application root:** a folder **outside** the document root from section 4 — for example
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
   environment variables in section 6, not a `.env` file (the code already reflects this:
   `passenger_wsgi.py` never loads one, unlike `run_local.py`).
9. Install dependencies. On the app's detail page (cPanel → *Setup Python App* → click the
   app), there's a **requirements.txt** field — enter the path relative to the application
   root (just `requirements.txt` if you uploaded it directly there) and click **Run Pip
   Install**. If that control isn't available in your cPanel skin, use the *Terminal* app
   instead: run the `source .../activate` command from step 7, then
   `cd` into the application root and run `pip install -r requirements.txt`.
10. Click **Restart** on the app's detail page.

**Check (with credentials — the site is already password-protected from section 3):**
```bash
curl -u "<privacy_user>:$DP_PASS" -s -o /dev/null -w "%{http_code}\n" \
  https://<your-domain>/api/save-lead
```
Expect `405` (`GET` isn't allowed, but the app answered — not a 500, a blank page, or a
generic Passenger error page). It will report this even before section 6 sets any
`LEADS_STORAGE`-related variable, since Flask itself handles the method check before the
storage layer is ever touched.

**Check (without credentials) — confirm `/api` is actually protected, per section 3's
warning:**
```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://<your-domain>/api/save-lead \
  -H "Content-Type: application/json" -d '{}'
```
Must print `401`. If it doesn't — if the app answers instead — Directory Privacy isn't
reaching the Python app on this account. **Stop here and don't do section 6** (which connects
the real production sheet) until this is resolved. A fix would need either a different cPanel
mechanism for protecting this specific URL, or an application-level Basic Auth fallback added
to the Flask app itself behind its own environment variable; if you reach this point, that's a
decision to make with whoever owns `api/**` before writing it, not something to improvise here.

## 6. Environment variables

On the app's detail page in *Setup Python App*, use the **Environment variables** section to
add each of these (contract section 9), then **Restart** the app for changes to take effect.
Only do this once section 5's `401` check has passed — this is the step that points the app at
Gabriela's real production sheet.

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

## 7. Logs (US-016 AC7)

**Where:** Passenger writes the app's stdout/stderr — which is where every log line from
section 6's check and the tables below appears — to a log file cPanel exposes from the
*Setup Python App* interface: open the app's detail page and look for a **Log file** link or
path near the top. If your account doesn't show one directly there, check cPanel → *Metrics*
→ **Errors**, which also surfaces Apache/Passenger-level failures (including one that
prevented the app from starting at all, which wouldn't produce any of the lines below since
the app's own logging never ran). **Record the exact path here** once you've located it on
this account, so this runbook is precise for next time.

**What the startup line looks like** (also the section 6 check): one `INFO` line naming the
active storage, and for `memory` an additional `WARNING` — see section 6.

**What a honeypot decoy looks like (US-013 AC8):** one line, timestamped, reading exactly
`INFO:app:honeypot triggered; lead discarded`, with no request data — no name, email, phone,
the honeypot's `website` value in the request, or the visitor's IP. It fires every time that
value arrives non-empty (or the wrong JSON type), which is normally a bot, but ADR-004 records
that a real visitor's browser or password manager once filled it despite the mitigations,
silently dropping a real lead. A burst of these close together is spam protection working as
intended — nothing to do. A handful spread through the day is worth a weekly check either way:
**a decoy writes no row, so the sheet has no gap to find** — instead, compare Calendly's booked
calls against the sheet. A visitor who reached Calendly got a `201` from this endpoint (contract
section 7), so a booking with **no matching row** in the sheet around the same time means a real
lead was silently dropped here. If that happens, apply ADR-004's review trigger (propose
removing the honeypot through a spec change).

**Common causes per logged `ERROR`:**

| Log shows | Likely cause | Fix |
|---|---|---|
| `storage_unavailable (cause=FileNotFoundError)` | `GOOGLE_SERVICE_ACCOUNT_FILE` points to a path that doesn't exist | Check the path was typed correctly and the file was actually uploaded there |
| `storage_unavailable (cause=PermissionError)` | `gspread` 6.x's `open_by_key()` converts **any** HTTP 403 into this same built-in `PermissionError`, not `APIError` — so it covers three different causes: (a) the key file exists but the app's process can't read it, (b) the sheet isn't shared with the service account at all, **or** (c) the Google Sheets API isn't enabled on the service account's project | For (a), check the file's permissions are `600`. For (b), share the sheet with the service account's email (`GOOGLE_SHEETS_SETUP.md` step 4.4). For (c), enable the Sheets API (`GOOGLE_SHEETS_SETUP.md` steps 1–2). Don't assume it's the file just because the exception name matches a filesystem error — it's the single most common wrapper for sheet-access problems too |
| `storage_unavailable (cause=SpreadsheetNotFound)` | `GOOGLE_SHEET_ID` is wrong, or the sheet was deleted — `open_by_key()` converts a 404 into this, not `APIError 404` | Re-copy the ID from the sheet's URL (`docs/runbooks/GOOGLE_SHEETS_SETUP.md` step 4.5) |
| `storage_unavailable (cause=WorksheetNotFound)` | `GOOGLE_SHEET_TAB` doesn't match an actual tab name in the sheet | Confirm the tab is named exactly `leads` (or whatever `GOOGLE_SHEET_TAB` is set to) |
| `storage_unavailable (cause=APIError 403)` | Unlike the `PermissionError` cases above, this one happens **after** the sheet already opened successfully: the sheet is shared with the service account, but only as Viewer or Commenter, so appending a row is refused | Re-share the sheet with the service account's email as **Editor**, not Viewer/Commenter (`GOOGLE_SHEETS_SETUP.md` step 4.4) |
| `storage_unavailable (cause=RefreshError)` | The service account's key was revoked or deleted, or the server's clock is significantly wrong | Rotate the key (`GOOGLE_SHEETS_SETUP.md` section 7) if it was revoked; otherwise check the account's system time |
| `storage_unavailable (cause=<something else>)` | An unanticipated Google API or network failure | The exception class in the log names it; search it together with "gspread" for the specific cause |
| `internal_error (<ExceptionClass>)` followed by a traceback | An application bug, not a configuration problem | The traceback's file and line point at the bug; this needs a code fix, not an environment variable |
| `Unhandled exception on <METHOD> <path> (<ExceptionClass>)` followed by a traceback | Same as `internal_error`, but the bug is outside the request handler itself (e.g. in the rate limiter's own code) | Same — a code fix, not an environment variable |
| Startup `key_file_exists=False` | Same as `FileNotFoundError` above, but caught before any lead was even submitted | Same fix |
| Startup `key_file_readable=False` | Same as case (a) of `PermissionError` above | Same fix |
| Startup `sheet_id_set=False` | `GOOGLE_SHEET_ID` isn't set in cPanel's environment variables | Add it (section 6) and restart |
| Startup line says `Lead storage active: memory` (with a `WARNING`) | `LEADS_STORAGE` is explicitly set to `memory` in cPanel, overriding the production default | Remove that variable or set it to `google_sheets`, then restart |

No log line ever contains the submitted name, email, phone, or the visitor's IP address (see
`api/logging_utils.py` and pytest coverage in `api/tests/test_error_logging.py` and
`api/tests/test_spam_protection.py`) — if you see any of those in the log, that's a bug in the
app, not this runbook.

One thing outside the app's own logging that this doesn't control: cPanel/Apache's own access
log for the domain records every visitor's IP for every request, same as any web server. That
log exists independently of anything above and isn't a contract violation — it's standard web
server behavior, not something the application writes.

## 8. Post-deploy smoke test (US-014 AC5)

Run this while the site is still password-protected (section 3) — every request needs
`-u "<privacy_user>:$DP_PASS"` from section 3's `read -s` step.

1. **Both languages load:** visit `https://<your-domain>/es/` and `https://<your-domain>/en/`
   in a browser (it will prompt for the Directory Privacy username/password first).
2. **The rate limit works — do this before anything else touches `/api/save-lead`,** so the
   count starts clean: click **Restart** on the app's detail page (this clears the in-memory
   limiter — ADR-004), then run up to 20 requests, stopping at the first `429`:
   ```bash
   for i in $(seq 1 20); do
     code=$(curl -u "<privacy_user>:$DP_PASS" -s -o /dev/null -w "%{http_code}" \
       https://<your-domain>/api/save-lead -X POST -H "Content-Type: application/json" -d '{}')
     echo "request $i: $code"
     if [ "$code" = "429" ]; then break; fi
   done
   ```
   Verified locally against the memory-mode backend, as the very first traffic after a restart,
   with the production default (5 requests / 600 seconds) **and a single Passenger process**:
   requests 1–5 each returned `422` (empty body — invalid, but still counted toward the limit),
   and request 6 returned `429`. ADR-004 accepts that the limiter's counters are kept **per
   Passenger process**, not shared across however many processes serve this app — so if this
   account runs more than one, the loop's requests can land on different processes and the
   `429` can appear later than request 6 (as late as `5 × (number of processes) + 1`). That's an
   accepted trade-off (ADR-004), not a failure: let the loop run up to 20 and take whichever
   request first returns `429`. If **no** `429` appears within 20, stop and note how many
   Passenger processes cPanel's Setup Python App shows for this application (its resource
   settings) — that's useful to know, but still not a failure of the limiter itself.

   Whichever request number it was, confirm it carried a `Retry-After` header:
   ```bash
   curl -u "<privacy_user>:$DP_PASS" -s -D - -o /dev/null \
     https://<your-domain>/api/save-lead -X POST -H "Content-Type: application/json" -d '{}' \
     | grep -E "HTTP|Retry-After"
   ```
3. **If step 2 found a `429`, before clearing the limiter, confirm a second network isn't
   sharing the first one's limit.** At this point network A's address is at or over the cap — if
   every visitor actually shared one apparent address at this host (a front-door proxy or CDN
   collapsing everyone to one `REMOTE_ADDR`), this is the moment that would show up. From a
   different connection — a phone on mobile data with Wi-Fi off, or a different location
   entirely — load `https://<your-domain>/es/` or `/en/` in a browser (it will prompt for the
   Directory Privacy credentials on that device) and submit the lead form once with throwaway
   data. It must **not** show the rate-limited error message. (A `curl` from a second device
   works too, with the same `-u "<privacy_user>:$DP_PASS"` pattern from section 3, run on that
   device's own terminal — not the placeholder password typed inline.)

   If the second network *does* get rate-limited, network A and B are arriving at this host as
   the same address, which contract section 3.2 would then be rate-limiting as a single visitor
   for everyone combined (section 3.2 counts per `REMOTE_ADDR` and deliberately does not trust
   `X-Forwarded-For`). If that happens, stop before go-live; fixing it would need a contract
   change (section 3.2), not a runbook change. If this submission used real-looking data, delete
   it from the sheet along with step 5's row.
4. **Click Restart** to clear the limiter before the rest of this smoke test, so steps 2 and 3
   don't block the checks below (or a real visitor, if one arrives while you're testing).
5. **A valid test lead saves correctly:** submit the form once through the browser with
   clearly fake, identifiable data (e.g. name "Test Delete Me", a real email you control so you
   can also verify the thank-you flow). Confirm a new row appears in the **production** sheet
   (not a dev sheet) with all nine columns from `LEAD_API_CONTRACT.md` section 6,
   `status = started`.
6. **Thank-you and the real Calendly appear:** after that submission, confirm the thank-you
   message shows and the real Calendly scheduler loads inline (not the `mailto:` fallback —
   if it shows the fallback, `PUBLIC_CALENDLY_URL` wasn't set before the build in section 4,
   and you'll need to rebuild and re-upload).
7. **A filled honeypot stores nothing:**
   ```bash
   curl -u "<privacy_user>:$DP_PASS" -i https://<your-domain>/api/save-lead \
     -X POST -H "Content-Type: application/json" \
     -d '{"name":"Test Delete Me","email":"test@example.com","phone":"+50684104791","screening_answer":"exploring","language":"es","consent":true,"website":"http://spam.example"}'
   ```
   `-i` prints the response headers as well as the body — confirm the status line reads
   `HTTP/1.1 201` (not just a success-shaped body at some other status) and the body shows
   `"success": true`, `"error_code": null`. Then confirm by sheet row count that this one added
   **no** new row — the decoy response gives no signal to a bot, so the response alone can't
   prove nothing was stored.
8. **Delete the test rows:** remove every row this smoke test added to the production sheet —
   step 5's, and step 3's too if it wasn't rate-limited (a submission that gets `429` stores
   nothing) — before real visitors can see them.

**Check:** all of the above behaved as described. If any didn't, fix the specific cause
(section 7's table covers storage failures) and re-run the smoke test from the top — a partial
pass isn't a pass.

## 9. Updating an existing deployment, and rolling back

**Updating:**
1. Frontend: `npm ci` fresh, then rebuild (section 4) with the same `.env.production`, and
   re-upload `dist/`'s contents over the existing document root (overwrite in place). Keep a
   copy of the previous `dist/` output locally before overwriting, so you have something to
   roll back to.
2. Backend: upload the changed files into the application root from section 5 (overwrite in
   place), keeping a local copy of what was there before — **including the old
   `requirements.txt`**, even if it didn't change, so a rollback can restore the matching
   dependency set. If `requirements.txt` changed, re-run **Run Pip Install** (or the terminal
   equivalent). Click **Restart** on the app's detail page either way — code changes don't take
   effect until Passenger restarts the app.

**Rolling back:** reverse the same steps with the previous copy — re-upload the previous
`dist/` output over the document root, and the previous backend files (including the previous
`requirements.txt`) over the application root. If the version being rolled back from changed
`requirements.txt`, re-run **Run Pip Install** against the *restored* `requirements.txt` before
restarting — otherwise the virtualenv can be left with packages that don't match the restored
code, which can fail in ways this runbook's checks won't obviously explain. Then **Restart**
the app. Environment variables (section 6) aren't touched by a rollback unless the variable
itself needs to change.

**Check (either way):** confirm the app still answers (`GET /api/save-lead` → `405`, not a 500
or a blank page — with Directory Privacy credentials if the site is still password-protected,
without them once it's gone live) and do a single real-feeling form submission end to end.

## 10. Go-live checklist

Mirrors the go-live gate in `docs/sprints/SPRINT_002.md` — all of these, not some:

- [ ] US-013, US-016 and US-018 are merged.
- [ ] US-017 content is approved by Gabriela and merged; the human owner has decided which
  pending-validation markers, if any, remain.
- [ ] The final Calendly URL and contact email are set in the production build (section 4) —
  not placeholders.
- [ ] This runbook's smoke test (section 8) passes on the live HTTPS domain.
- [ ] Only once every item above is checked: remove the password protection (section 3), then
  re-run section 2's two HTTPS checks — both must now print `301`/`308` on the live, public
  site — before announcing it.
