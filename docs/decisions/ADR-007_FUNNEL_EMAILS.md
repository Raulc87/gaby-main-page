# ADR-007 — How the funnel emails are sent

- Status: **Accepted on merge** of the phase 2d docs PR: option C (human owner, 2026-11-23)
- Date: 2026-11-08 (proposed); 2026-11-23 (decided)
- Decision owner: Human project owner
- Related specs: [`PROJECT_SPEC.md`](../specs/PROJECT_SPEC.md) NG-006, FR-025, FR-036, FR-037, FR-038, §10; US-025, US-038, US-039; [ADR-006](ADR-006_SCHEDULER_GOHIGHLEVEL.md)
- Source: [`BRIEF_2026-11-08_STORYBRAND.md`](../ux/BRIEF_2026-11-08_STORYBRAND.md) §2 (the funnel) and §5; [`BRIEF_2026-11-23_WEALTH_MASTERY.md`](../ux/BRIEF_2026-11-23_WEALTH_MASTERY.md) §1 point 5 and §8

## Decision Request
Which mechanism sends the funnel's emails: the calculator result with the ebook, Gaby's notification for each VIP application, the six-email sales sequence over 14 days, and the weekly email for people who don't book?

## Context
Gaby's funnel document puts every step in GoHighLevel, the only tool she knew when she wrote it. The human owner's direction (2026-11-08) is that the site and its backend replace GHL in everything except the calendar (ADR-006). The site already stores leads in Google Sheets from a Python backend (ADR-001, ADR-002), and FR-025 (phase 2b) planned to send requested resources from Gaby's Google account.

The emails are of two kinds:
- **Transactional, one at a time:** the calculator result and the ebook (day 0), the resource a visitor requests (FR-025), and Gaby's notification for each VIP application. Low volume, triggered by a form.
- **Sequences:** the six sales emails over 14 days (days 0, 3, 5, 8, 11, 14), which stop when the person books a call, and a weekly email after that for people who haven't booked. Scheduled, they need unsubscribe handling, and they are marketing email.

Constraints: consent under Ley 8968 (the result email is covered by the calculator's required consent; the sequences only by its separate, optional consent, which names them, `CONTENT_PHASE_2C.md` §11.2); every marketing email has a working unsubscribe; email from a new sender lands in spam unless the domain is authenticated (SPF, DKIM, DMARC on gabykelly.com); Gmail sending limits (about 500 a day for a consumer account, 2,000 for Workspace).

## Decision Drivers
- Replace GHL except the calendar (owner)
- Deliverability and a working unsubscribe for marketing email
- Little to build and maintain (NFR-004)
- Know when someone booked, to stop the sequence
- Cost for Gaby

## Options Considered

### Option A — Everything from our backend (Gmail API from Gaby's Google account)
The backend sends each email through Gmail; a scheduled job on the host (cron) sends the sequence emails when due, reading the state from the sheet; an unsubscribe link reaches a backend endpoint.
Pros: no new vendor or processor; everything in our code.
Cons: we build and maintain a scheduler, the unsubscribe flow and its records, bounce handling, and the sequence state; Gmail limits and spam risk for marketing email; the email texts live in code or the sheet, so Gaby can't edit them herself.

### Option B — Transactional email from our backend; sequences in an email marketing tool (for example Brevo or MailerLite)
The backend sends the one-off emails through Gmail (as FR-025 planned) and adds each calculator lead to the email tool through its API, with the fields the sequence uses (`meses`, `zona`, source). The tool runs the six-email sequence and the weekly email, handles unsubscribes, and lets Gaby edit the texts. When someone books, the GHL calendar's webhook or workflow, or Gaby marking the lead `booked`, removes them from the sequence through the tool's API.
Pros: deliverability, unsubscribe and scheduling come from a tool built for them; Gaby edits her own emails; little code.
Cons: a new vendor and data processor (named in the privacy notice); a monthly cost above the free tier's limits; the booking signal crosses three systems.

### Option C — Sequences in GoHighLevel
The backend pushes each calculator lead to GHL's contacts API with a tag and the `meses` and `zona` fields; GHL runs the sequences; a booking in the GHL calendar stops the sequence inside GHL.
Pros: the least to build; GHL already holds the calendar, so stopping the sequence on booking works without any integration; Gaby already pays for it.
Cons: against the owner's direction of leaving GHL except the calendar; keeps Gaby's funnel tied to GHL.

## Decision
**Option C, for every funnel email** (human owner, 2026-11-23: "go with your recommendations", on Gaby's final content). Gaby asked for her funnel in GoHighLevel ("El tag dispara la secuencia de 6 correos en 14 días. El correo 1 entrega el resultado y la guía"; "Si la persona agenda la llamada, sale de la secuencia"), and the owner had already welcomed sending the leads to GoHighLevel through its API. So:
- The site and its backend keep the forms, the validation, the consents and the Google Sheet as the record of every lead.
- After each save, the backend sends the person to GoHighLevel as a contact with a tag and fields ([ADR-008](ADR-008_GOHIGHLEVEL_CONTACTS.md), FR-041).
- GoHighLevel sends every funnel email from Gaby's workflows: email 1 (the result and the ebook, FR-036) to every calculator lead; emails 2 to 6 and the weekly email (FR-037) only to contacts with the consent tag (BR-012); Gaby's notification for each application (FR-038). Its calendar ends the sequence when the person books, inside GoHighLevel, with no integration.
- Option B's dedicated email tool is not used. Option A is not used. Our backend sends no email.

## Rationale
Gaby already pays for GoHighLevel and uses its calendar, so the stop-on-booking signal, unsubscribes, scheduling and deliverability come with it, and she edits her own emails. The lock-in stays small: the site owns the leads (the sheet) and sends the contact through one module (ADR-008), which another tool's API could replace.

## Consequences
- The privacy notice names GoHighLevel as the processor of the contacts and the emails before the first email is sent (phase 2d copy).
- Gaby's domain needs SPF, DKIM and DMARC records for GoHighLevel's sending before the first email (go-live work, US-014); GoHighLevel's own guidance applies.
- Gaby sets up the workflows, tags and custom fields in GoHighLevel; the site cannot test them in CI. US-038 and US-039 become Gaby's set-up with an end-to-end check, not code (USER_STORIES.md).
- FR-025 (resources by email) is withdrawn with the resource library (phase 2d), so no Gmail sending remains.

## Review Trigger
Gaby stops paying for GoHighLevel, or the owner moves the funnel off it: the contact module of ADR-008 is the place to switch, with option B.
