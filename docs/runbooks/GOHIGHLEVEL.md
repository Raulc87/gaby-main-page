# GOHIGHLEVEL — the leads in Gaby's account

How the site sends every saved lead to Gaby's GoHighLevel account as a contact, and how to set it up, check it, resend what failed and rotate the token. Written for US-045 ([ADR-008](../decisions/ADR-008_GOHIGHLEVEL_CONTACTS.md), [`LEAD_API_CONTRACT.md`](../specs/LEAD_API_CONTRACT.md) v1.3 section 12), in the style of the kit's runbook guide. Version 2, 2026-11-24: section 10 is the cleanup after a test round on the demo environment (US-047, [ADR-009](../decisions/ADR-009_DEMO_ENVIRONMENT.md)).

The site keeps its forms and the Google Sheet as the record of every lead. After each save, the backend creates or updates the person's contact in GoHighLevel, matched on the email, then writes the outcome in the row's `crm_status` column: `sent`, `failed`, `pending`, `off` or `superseded`. If GoHighLevel is down, the visitor still gets their result or their next screen, and the row says `failed` until it is resent (section 7). Gaby's workflows send the emails ([ADR-007](../decisions/ADR-007_FUNNEL_EMAILS.md)): the site sends no email.

## Values to have ready

Real values never go into Git, issues, pull requests or chat. This table names them and says where each one comes from.

| Value | Variable | Where it comes from |
|---|---|---|
| The private integration token | `GHL_API_TOKEN` | Section 1. A secret: it goes only into the server's environment settings |
| Gaby's location id | `GHL_LOCATION_ID` | Section 2 |
| The id of the custom field `meses` | `GHL_FIELD_MESES` | Section 3 |
| The id of the custom field `zona` | `GHL_FIELD_ZONA` | Section 3 |
| The id of the custom field `moneda` | `GHL_FIELD_MONEDA` | Section 3 |
| The id of the custom field `alerta_concentracion` | `GHL_FIELD_ALERTA` | Section 3 |
| The id of the custom field `preseleccion` | `GHL_FIELD_PRESELECCION` | Section 3 |
| `on` to send, `off` to save without sending | `GHL_SYNC` | Default `off`. Set `on` only after sections 1 to 3 |
| Seconds to wait for each GoHighLevel request | `GHL_TIMEOUT_SECONDS` | Default `5` |

## 1. Create the token (Gaby, or the owner in her account)

1. In Gaby's GoHighLevel account, open the sub-account for her business, then **Settings**, then **Private Integrations**.
2. Choose to create a new integration and name it `gaby-main-page backend`.
3. Under scopes, tick **contacts.write** (create and update contacts, and add tags) and nothing else. The site never reads contacts, and no other part of the account is needed.
4. Create it and copy the token once, when GoHighLevel shows it. It is not shown again.
5. Paste it straight into the place named in section 5. Never into chat, an issue, a pull request, a file in the repository or an email.

Expected: GoHighLevel lists the integration with only the contacts scope. If the screen names are different on Gaby's plan, use the equivalent: a private integration token for one sub-account, with access to contacts only.

## 2. Find the location id

Open the sub-account. The address in the browser contains `/location/` followed by a long string: that string is the location id. It is not a secret, but keep it out of Git.

Expected: a string of letters and digits, the same on every page of that sub-account.

## 3. Create the custom fields and note their ids

1. In the sub-account, **Settings**, then **Custom Fields**, and create five contact fields of type single-line text: `meses`, `zona`, `moneda`, `alerta_concentracion` and `preseleccion`. The names are Gaby's and the contract's; if she uses other names, only the ids below matter.
2. For each field, note its **id**: the long string of letters and digits that GoHighLevel uses to identify it (not its name, and not the merge tag shown in its settings). If the screen does not show it, GoHighLevel's custom-fields API lists it. That call is made by the owner, by hand: agents never call GoHighLevel.

What each field holds:

| Field | Calculator lead | Application |
|---|---|---|
| `meses` | The months as the visitor saw them, with a decimal comma ("4,5", "10"); empty when the result is "∞" | not set |
| `zona` | The zone's Spanish label: Zona crítica, Zona de alerta, Base en construcción, Camino a la libertad, Colchón sólido, Libre financieramente | not set |
| `moneda` | `USD` or `CRC` | not set |
| `alerta_concentracion` | `sí` or `no` | not set |
| `preseleccion` | not set | The Spanish text of the screening answer |

An existing contact keeps its other tags and fields; the ones above are set again each time.

## 3b. Make GoHighLevel match contacts on the email (Gaby, or the owner in her account)

The site creates or updates a contact by its email, and sends the phone too when it has one. GoHighLevel decides which existing contact matches from the sub-account's duplicate-contact setting, not from the request: if it checks the phone first, an email that belongs to one contact and a phone that belongs to another would update the phone's contact, and put the tags and fields on the wrong person.

1. In the sub-account's settings, find the **Allow Duplicate Contact** setting (GoHighLevel's help names the screen).
2. Turn duplicates off, and set the fields it checks so that **email comes first**, before phone.

Expected: the setting shows duplicates not allowed with email first. Section 6 checks it with two test contacts. Do not turn sync on in production before that check passes.

## 4. Tags and workflows

The site adds these tags. GoHighLevel creates a tag the first time it is added, and Gaby may create them before to pick them in her workflows.

| Tag | When the site adds it |
|---|---|
| `lead-calculadora` | A calculator lead |
| `consentimiento-correos` | A calculator lead who ticked the optional consent to follow-up emails, and only then |
| `aplicacion-vip` | A Wealth Mastery application |
| `idioma-es`, `idioma-en` | The language the visitor was viewing |

The custom fields are set before the tags are added, so a workflow that starts on a tag finds the fields filled.

The site only ever adds tags. It never removes `consentimiento-correos`: a person who ticked the follow-up consent once and later uses the calculator without ticking it keeps the tag, and the sequence keeps running until they unsubscribe in GoHighLevel. Not ticking a box again is not withdrawing consent; the privacy notice's legal review (US-018) should confirm this.

Gaby's workflows (US-038 and US-039; hers to build, the site cannot test them):

1. Email 1, with the result and the ebook, for every contact with `lead-calculadora`, in the language of `idioma-es` or `idioma-en`.
2. Emails 2 to 6 and the weekly email only for contacts that also have `consentimiento-correos`; the sequence ends when the person books a call or unsubscribes.
3. A notification to Gaby for each contact that gets `aplicacion-vip`.
4. **Email only.** No automated SMS or WhatsApp: no consent covers them (BR-012). Gaby or her team may still write to a person by WhatsApp by hand.

## 5. Put the values in the server's environment

Local development: edit `api/.env` (copied from `api/.env.example`, ignored by Git), fill in the `GHL_*` lines and set `GHL_SYNC=on`. Then restart the backend.

Production: follow [`DEPLOYMENT.md`](DEPLOYMENT.md) section 6, which lists the same variables. Paste the token only into the *Environment variables* screen of *Setup Python App*.

Expected: the backend's startup log has the line `GoHighLevel sync: on (token_set=True, location_id_set=True, custom_field_ids_missing=none)`. If a value is missing, the line says which field ids are missing and a warning says leads will be saved with `crm_status` `failed`. The log never shows a value.

## 6. Check it by hand (the owner)

Done once, with Gaby's token in a development environment and your own name and email. No agent does this.

1. Start the backend locally with `LEADS_STORAGE=memory` and `GHL_SYNC=on`, and the site as in [`LOCAL_DEVELOPMENT.md`](LOCAL_DEVELOPMENT.md).
2. Use the calculator with your own email, tick the optional follow-up consent, and finish. Expected: the result shows.
3. In GoHighLevel, open the contact with your email. Expected: the tags `lead-calculadora`, the language tag and `consentimiento-correos`; the fields `meses`, `zona`, `moneda` and `alerta_concentracion` filled.
4. Send a Wealth Mastery application with the same email. Expected: the same contact now also has `aplicacion-vip`, the earlier tags are still there, and `preseleccion` is filled.
5. Run the calculator again without the optional consent, with the same email. Expected: the tags added before stay (the site never removes a tag).
6. Check the matching of section 3b. In GoHighLevel, create a second test contact with another email and a phone number. Send a calculator lead with your first email and that phone number. Expected: the first contact is updated and the second keeps its own email, tags and fields. If the second contact changed, fix section 3b before going on.
7. Delete both test contacts in GoHighLevel, and note the date and result in the sprint close-out.

With `LEADS_STORAGE=google_sheets`, each of those rows also shows `crm_status` `sent`.

## 7. Resend what was not sent

A row is `failed` when GoHighLevel did not answer in time, refused the request or the configuration was incomplete. It is `pending` when the server stopped between sending and writing the outcome. Resending is safe: GoHighLevel matches the contact on its email, so a contact never doubles. A row saved while `GHL_SYNC` was `off` stays `off`; it is not resent.

`superseded` (contract 1.3.1) is set by the resend command only. A person can submit again after an earlier submission failed, and GoHighLevel matches contacts on the email, so sending the older values again would overwrite the newer submission's. The command works one tab at a time, oldest row first. When a `failed` or `pending` row has a later row in the same tab with the same email (compared without capitals or surrounding spaces) and a `crm_status` of `sent`, `failed` or `pending`, it marks the older row `superseded` and does not send it. A later row that is `off` (saved while `GHL_SYNC` was `off`, so never sent) does not count: the older row is still resent. The later row is sent on its own: when it was saved, or by this command if it is itself `failed` or `pending`. A `superseded` row is never resent, and needs no action. A row with no later row of the same email is resent as usual. The application tab and the calculator tab are separate: the same email in both never supersedes.

Fix the cause first (section 9), then run the command on the server, in the application's folder, with the same environment variables as the application.

macOS and Linux, from the repository's `api/` folder with its virtual environment:

```bash
.venv/bin/python resend_crm.py
```

Windows (PowerShell), from the repository's `api/` folder:

```powershell
.venv\Scripts\python resend_crm.py
```

In cPanel, open the Python app's page in *Setup Python App*, copy the command it shows to enter the virtual environment, run it in the *Terminal*, and then run `python resend_crm.py` from the application's folder. The command reads the same environment variables as the application.

Expected output, one line per tab, with counts only:

```
applications: sent 0, failed 0, status not updated 0, marked superseded 0
calculator: sent 2, failed 0, status not updated 0, marked superseded 1
```

The rows' `crm_status` cells change to `sent`, or to `superseded` for the rows counted as `marked superseded`. If a count of `failed` is above 0, the cause is not fixed: see section 9. If `status not updated` is above 0, the sheet could not be written for those rows: they keep their old status, and a second run settles them (a contact sent twice does no harm).

No terminal: open the sheet, filter the `crm_status` column for `failed` and `pending`, and create or update each contact in GoHighLevel by hand with the tags and fields of section 3 and 4. Skip a row whose email appears in a later row of the same tab that is `sent`, `failed` or `pending`: write `superseded` in its cell instead. Then change the other cells to `sent`.

## 8. Rotate the token

Do this at the first sign of exposure, and when someone who knew it leaves.

1. In GoHighLevel, create a new private integration token as in section 1.
2. Paste the new token into the `GHL_API_TOKEN` setting (cPanel *Environment variables*, or `api/.env` locally) and restart the app.
3. Send one test lead as in section 6, steps 2 and 3. Expected: its row says `sent`.
4. Delete the old integration in GoHighLevel. Its token stops working at once.
5. Run the command of section 7 for anything that failed in between.

If the token was exposed in Git, chat or a log, treat step 4 as urgent: do it first, then steps 1 to 3.

## 9. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Rows say `off` | `GHL_SYNC` is `off` or unset | Set it to `on` (section 5) and restart; earlier rows stay `off` |
| Rows say `failed`; the log says `not_configured` | The token, the location id or a field id is missing | Fill the variables of section 5 and restart; then section 7 |
| The log says `http_error 401` | The token is wrong, revoked or lacks the contacts scope | Create a new token (section 8) |
| The log says `http_error 422` or `http_error 400` | A custom field id or the location id is wrong | Check each id against GoHighLevel (section 3) |
| The log says `http_error 429` or `http_error 5xx` | GoHighLevel is limiting or down | Wait, then section 7 |
| The log says `timeout` | GoHighLevel did not answer within `GHL_TIMEOUT_SECONDS` | Wait, then section 7; raise the limit only if it keeps happening |
| The log says `invalid_response` | GoHighLevel answered without a contact id | Section 7; if it repeats, tell the developer: its API may have changed (ADR-008 review trigger) |
| The log says `network` | The server cannot reach GoHighLevel (a firewall or DNS) | Fix the hosting's outbound network access, then section 7 |
| Rows stay `pending` | The process stopped between sending and writing the outcome, or the sheet could not be written | Section 7 |
| A contact got another person's tags or fields | GoHighLevel matched on the phone first | Fix section 3b, check it as in section 6 step 6, and correct the contact by hand |
| The contact exists but the email workflow did not start | The tag is missing or the workflow's trigger names another tag | Compare the contact's tags with section 4 |
| The command prints `GHL_SYNC is off` | Its environment has `GHL_SYNC` off or unset | Run it with the application's variables (section 7) |
| The command prints `the rows could not be read from storage` | The sheet is not reachable, or its header has no `crm_status` column, or the column is not in the position of the setup runbook | Check [`GOOGLE_SHEETS_SETUP.md`](GOOGLE_SHEETS_SETUP.md) sections 4 and 4b |

## 10. Clean up after a demo test round (US-047, ADR-009)

The demo environment ([`DEPLOYMENT.md`](DEPLOYMENT.md) section 11) sends contacts to Gaby's real GoHighLevel account and saves rows in a test sheet. After each test round, and before the demo is taken down, remove what the test made. Done by Gaby, or by the owner in her account; no agent does it.

**The rule: delete only what the test made.** Work from the test email addresses in the test sheet, never from a tag alone: Gaby's real contacts may carry the same tags (`lead-calculadora`, `aplicacion-vip`).

**Order matters:** bookings first, then contacts, then the sheet. Do not run the resend command (section 7) after step 3: it would create the deleted contacts again.

1. **List the test rows.** Open the **test** sheet (check its name: never a sheet that holds a real lead). In the tabs `leads` and `calculator`, note the email of every row the round made (filter by the date in `submitted_at`). If a row you still want to see in GoHighLevel says `failed` or `pending`, resend it first (section 7); otherwise leave it.

   Expected: a list of the test email addresses and nothing else. Test applications use their own fictitious phone number each (`DEPLOYMENT.md` section 11.9): GoHighLevel falls back to the phone when no contact has the email (section 3b), so a shared or real number could merge two test contacts or update a real one.

2. **Cancel the test bookings.** In GoHighLevel, open **Calendars**, then the appointments list of the demo's calendar. Find each appointment booked by a test address, and cancel it. If the screen names differ on Gaby's plan, use the equivalent.

   Expected: no appointment of a test address stays booked, and its time is free again in the calendar. GoHighLevel may email the cancellation to the test address.

3. **Delete the test contacts.** Open **Contacts**, search each email of step 1, check that the name and email are the test's and that the contact was created on the day of the test (its creation date), and delete the contact. If anything does not match, or the contact is a real person, do not delete it. Include the test contact of the earlier checks, `ana.perez@example.com`, if it still exists.

   Expected: searching each test email finds no contact. A contact of a person who is not a test stays untouched.

4. **Clear or archive the test sheet's rows.** Archive first if you want a record: **File**, **Make a copy**, and name the copy for the round. Then, in each tab (`leads` and `calculator`), select the rows from row 2 down and delete them. Never delete row 1: it is the header, `crm_status` included, and the backend writes under it.

   Expected: each tab holds only its header row, and the next test's row appears in row 2.

5. **Note it.** Write the date and the result (for example "2 contacts, 1 booking, 3 rows") in the sprint's close-out.

Emails that Gaby's workflows already sent cannot be recalled; they went to test addresses only.
