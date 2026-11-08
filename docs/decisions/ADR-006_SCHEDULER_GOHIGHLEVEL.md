# ADR-006 — Call scheduling: GoHighLevel calendar replaces Calendly

- Status: Accepted on merge of the phase 2c docs PR (human owner, 2026-11-08)
- Date: 2026-11-08
- Decision owner: Human project owner, at Gaby Kelly's request
- Related specs: [`PROJECT_SPEC.md`](../specs/PROJECT_SPEC.md) FR-010, FR-015, §10; [`CONTENT.md`](../ux/CONTENT.md) §8.5, §9; [`UX_UI_DIRECTION.md`](../ux/UX_UI_DIRECTION.md) §6.4; US-007, US-023, US-037
- Source: [`BRIEF_2026-11-08_STORYBRAND.md`](../ux/BRIEF_2026-11-08_STORYBRAND.md) §3 note 3 and §5

## Decision Request
Which booking calendar does the VIP thank-you screen embed for qualified applicants?

## Context
Since phase 1 the qualified thank-you screen embeds Calendly inline (`PUBLIC_CALENDLY_URL`, US-007). Gaby already pays for GoHighLevel (GHL), which includes a booking calendar, and does not want to pay Calendly as well (review note, 2026-11-08). The human owner's direction is that the site and its backend replace everything GHL does in Gaby's funnel except the calendar ("the intention is us being the substitute of pretty much all GHL except the calendar"). The owner also asked whether a Google Workspace calendar could do the same.

## Decision Drivers
- No extra subscription for Gaby
- Gaby likes GHL's calendar and already uses it
- Keep the rest of the funnel in the site and its backend (no lock-in beyond the calendar)
- Easy to switch the calendar later

## Options Considered

### Option A — GoHighLevel booking calendar, embedded (selected)
Pros: Gaby already pays for it and likes it; GHL's booking widget embeds as an iframe (with GHL's embed script) and its calendars can sync with Google Calendar.
Cons: GHL stays a data processor (the booking details the visitor enters); bookings land in GHL, not in the lead sheet; prefilling the visitor's name, email and phone depends on what the GHL widget accepts in its URL (verified in US-037).

### Option B — Google Calendar appointment schedules (Google Workspace)
Pros: a Google booking page that embeds on the site, with availability rules, buffers, Google Meet links, booking questions, and confirmation and reminder emails; Google is already a processor (Sheets).
Cons: depends on Gaby's Google plan (the fuller features need a paid plan); no booking webhook, so the site cannot react to a booking without polling the Calendar API; Gaby would leave a tool she likes.

### Option C — Cal.com
Pros: embeds inline, syncs with Google Calendar, prefills name and email from the URL, and its webhooks can tell the backend about each booking (useful to stop a follow-up sequence).
Cons: another vendor and data processor; Gaby would leave a tool she likes.

### Option D — Keep Calendly
Cons: the extra subscription Gaby wants to drop.

## Decision
Option A: the qualified thank-you screen embeds Gaby's GoHighLevel booking calendar instead of Calendly (human owner, 2026-11-08). The calendar URL is configuration (`PUBLIC_SCHEDULER_URL`, replacing `PUBLIC_CALENDLY_URL`), and the embed sits in one component, so Option B or C can replace it later without touching the rest of the flow.

## Rationale
It costs Gaby nothing extra and keeps the tool she chose. Keeping the scheduler behind one setting and one component limits the lock-in to the calendar, which is the owner's direction.

## Consequences
### Positive
- No Calendly subscription.
- The fallback (`thanks.scheduler_fallback`), the preview stand-in and the routing (only qualified answers see the calendar) stay as they are.
### Negative / Trade-offs
- GoHighLevel replaces Calendly in the privacy notice as the processor of the booking details (`CONTENT.md` `privacy.p4`).
- A booking is known only inside GHL. A follow-up sequence that must stop when someone books (FR-037) needs that signal: a GHL webhook or workflow that calls the backend, or Gaby marking the lead `booked` in the sheet (decided in ADR-007 and US-039).
- GHL's embed script loads from a GHL domain on the thank-you screen only, after the application is saved (as Calendly's did).

## Implementation Impact
- Frontend: `Scheduling.astro` and its controller embed the GHL widget instead of Calendly's; same fallback timeout and preview stand-in; the copy key `thanks.calendly_fallback` becomes `thanks.scheduler_fallback`.
- Configuration: `PUBLIC_SCHEDULER_URL` (GHL's booking widget URL); `PUBLIC_CALENDLY_URL` is removed from `.env.example` and the runbooks.
- Privacy notice: `privacy.p4` names GoHighLevel; `PRIVACY_NOTICE_VERSION` is bumped.
- Security baseline: GHL is a third party whose script runs on the thank-you page; it is listed in the baseline's third parties (US-029).

## Validation
US-037: on the preview the stand-in still shows; in a development build with a real GHL calendar URL, a qualified application shows the GHL calendar, a test booking appears in Gaby's GHL calendar, and the fallback appears when the URL is unset.

## Review Trigger
Gaby stops paying for GHL, or the funnel needs booking events GHL cannot send: revisit with Option B or C.
