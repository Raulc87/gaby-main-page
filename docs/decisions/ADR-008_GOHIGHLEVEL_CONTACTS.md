# ADR-008 — Leads sent to GoHighLevel as contacts through its API

- Status: **Accepted on merge** of the phase 2d docs PR (human owner, 2026-11-23)
- Date: 2026-11-23
- Decision owner: Human project owner, at Gaby Kelly's request
- Related specs: [`PROJECT_SPEC.md`](../specs/PROJECT_SPEC.md) FR-035, FR-039, FR-041, BR-012, §10; [`LEAD_API_CONTRACT.md`](../specs/LEAD_API_CONTRACT.md) v1.3 sections 6, 9, 11.5 and 12; [ADR-006](ADR-006_SCHEDULER_GOHIGHLEVEL.md), [ADR-007](ADR-007_FUNNEL_EMAILS.md); US-045
- Source: [`BRIEF_2026-11-23_WEALTH_MASTERY.md`](../ux/BRIEF_2026-11-23_WEALTH_MASTERY.md) §1 point 5 and §8 points 2 to 4

## Decision Request
How does a lead saved by the site (a calculator lead or a Wealth Mastery application) reach Gaby's GoHighLevel account, where her follow-up emails run (ADR-007)?

## Context
Gaby's email of 2026-11-23 asks that the calculator "crea o actualiza el contacto con el tag lead-calculadora", with the custom fields `meses` and `zona` (and, if possible, the currency, the figures and the concentration alert), and that the application arrive with the tag `aplicacion-vip`. She asked whether the calculator would be "dentro de la web con un webhook a GHL o con un formulario nativo de GHL".

The site already validates both forms, asks for the consents, stores the leads in Google Sheets, and routes the application by its screening answer (FR-010). The owner's direction is that the site keeps its forms and GoHighLevel receives the data (2026-11-08: "If we can consume GHL's API to fill up the data also there, that would be great"; 2026-11-23: "go with your recommendations").

Constraints: data minimization (only the result, never the figures: FR-035, pending Gaby's confirmation); the follow-up only with its separate consent (BR-012); no secret in the browser or in Git (NFR-007); a GoHighLevel outage must not lose a lead or show a failure to a visitor whose data was saved (NFR-006).

## Decision Drivers
- Gaby gets the contact, its tag and its fields, so her workflows start on their own
- The site keeps its forms, validation, consents and the sheet as the record
- No credential in the browser
- A GoHighLevel failure never loses a lead
- Testable without the real GoHighLevel

## Options Considered

### Option A — The backend calls GoHighLevel's contacts API (selected)
After the row is saved, the backend creates or updates the contact, matched on the email, with a private integration token from the server's environment, and records the outcome in the row (`crm_status`).
Pros: the token stays on the server; the backend controls exactly what is sent (no figures) and can be tested with a fake client; one module, replaceable later.
Cons: a token to create, keep and rotate; GoHighLevel's API version and field ids to follow.

### Option B — A GoHighLevel inbound webhook, called by the backend
Gaby creates a workflow with an inbound-webhook trigger and maps the payload to the contact in GoHighLevel's editor.
Pros: no API token; the mapping is Gaby's to edit.
Cons: the webhook URL works as a credential; the mapping and the "create or update" behaviour live outside the repository and cannot be tested in CI; field errors fail silently in GoHighLevel.

### Option C — GoHighLevel's native forms on the site
The calculator's details step and the application are GoHighLevel forms embedded in the pages.
Pros: no backend code for the contact.
Cons: the site loses its validation, its consent texts, its screening routing and the sheet; another third-party script on every form; the calculator's result step would depend on a GoHighLevel form. Rejected (brief §8 point 3).

## Decision
Option A. Both endpoints, after the row is appended (with `crm_status` = `pending`), create or update the contact through GoHighLevel's contacts API, with the fields of `LEAD_API_CONTRACT.md` section 12, then update `crm_status` to `sent` or `failed` (`off` when sending is switched off). If the save fails, nothing is sent: no contact exists for a result the visitor never saw.

## Rationale
It is the only option that keeps the secret off the browser, the data minimization in our code, and the behaviour under test. A webhook (option B) would trade a token for an equally secret URL and move the logic where CI cannot see it.

## Consequences
### Positive
- Gaby's workflows start from the tag (email 1, her notification), and the consent tag gates the sequence (BR-012).
- A GoHighLevel outage costs nothing at the moment: the lead is saved, the visitor sees the next screen, and the row says `failed` (or `pending`, if the process stopped) until it is resent.
### Negative / Trade-offs
- A secret to manage: Gaby creates a private integration token with access to contacts only, and the human owner puts it in the server's environment (never in chat, a PR or Git). Rotating it is documented in the runbook.
- GoHighLevel becomes a processor of the contacts and their result; the privacy notice says so before phase 2d goes live.
- The custom field ids and the API version are configuration; if Gaby renames or recreates a field, the configuration changes with it.
- A preview build and the honeypot never send anything (FR-030, section 3.1).

## Implementation Impact
- Backend: a small GoHighLevel client (create or update a contact; set tags and custom fields; a time limit), used by both endpoints; a resend command for `failed` and `pending` rows; configuration in `api/.env.example` without values; tests with a fake client (contract section 12). The endpoint, its version header and the payload shape are verified against GoHighLevel's API documentation in US-045, and the PR states what was verified.
- Sheet: the new last column `crm_status` in both tabs.
- Runbook: [`GOOGLE_SHEETS_SETUP.md`](../runbooks/GOOGLE_SHEETS_SETUP.md) gains the new columns; a new GoHighLevel section (token, location id, custom fields, tags, workflows, resend, rotation).
- Security baseline: GoHighLevel's API as a third party receiving personal data; the token as a secret (Agent 3's file).
- Gaby's set-up, before the first real lead: the custom fields `meses`, `zona`, `moneda`, `alerta_concentracion` and `preseleccion`; the tags `lead-calculadora`, `consentimiento-correos`, `aplicacion-vip`, `idioma-es` and `idioma-en`; the workflows of ADR-007.

## Validation
US-045: pytest with the fake client covers every case of contract section 12. Then, with Gaby's token in a development environment and `GHL_SYNC` = `on`, one calculator lead and one application made by the human owner appear in GoHighLevel with their tags and fields, and a row with `failed` is resent by the command.

## Review Trigger
GoHighLevel changes its API version or authentication, Gaby leaves GoHighLevel, or she asks for data beyond section 12 (that needs a docs PR and, for the figures, a privacy-notice change and its own consent).
