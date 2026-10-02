# ADR-004 — Spam protection: honeypot and per-IP rate limit, no CAPTCHA yet

- Status: Accepted
- Date: 2026-09-28
- Decision owner: Human project owner
- Related specs: `PROJECT_SPEC.md` NFR-008, `LEAD_API_CONTRACT.md` v1.1 sections 3.1 and 3.2, US-013

## Decision Request
How is the public lead endpoint protected against automated submissions before go-live, and is a CAPTCHA needed?

## Context
The form is public and unauthenticated. Spam would fill Gabriela's lead sheet with junk rows and could exhaust the Google Sheets API quota. The site is small, new, and not yet indexed, so early bot traffic is expected to be low and unsophisticated. The backend runs on shared cPanel hosting (ADR-001), where Passenger may run more than one Python process and there is no shared cache such as Redis.

## Decision Drivers
- Keep real visitors' friction at zero (conversion page)
- No extra vendor or third-party script before the visitor submits (privacy, Ley 8968, page speed)
- Works on shared hosting without new infrastructure
- Easy to strengthen later if spam appears

## Options Considered

### Option A — Honeypot field + per-IP rate limit in process memory (selected)
Pros: invisible to people; no vendor; no new infrastructure; a few dozen lines of code.
Cons: stops only simple bots; counters are per process and reset on restart, so the effective limit can be a few times higher than configured.
Risks: a browser autofilling the hidden field would silently drop a real lead → mitigated by `autocomplete="off"`, `tabindex="-1"`, `aria-hidden`, and moving the field off-screen instead of using a field type browsers autofill.

### Option B — A + Cloudflare Turnstile
Pros: stops most automated traffic; usually no visible challenge.
Cons: third-party script and data processor (privacy notice change); token verification from the server; extra failure mode if Turnstile is unreachable.

### Option C — A + Google reCAPTCHA
Cons: same as B, plus heavier script and stronger tracking concerns.

### Option D — Rate limit stored in a file or SQLite
Pros: shared across processes, survives restarts.
Cons: file locking on shared hosting; closer to the "no database" non-goal (NG-004). Not needed at the expected volume.

## Decision
Option A, as specified in `LEAD_API_CONTRACT.md` v1.1. No CAPTCHA in Sprint 002 (human owner, 2026-09-28).

## Rationale
It meets NFR-008 with no friction, no vendor, and no infrastructure. The per-process limitation is acceptable because the goal is to stop floods from one source, not to enforce an exact number.

## Consequences
### Positive
- No change to the visitor experience or the privacy notice's list of processors.
### Negative / Trade-offs
- Targeted or distributed bots are not stopped.
- Since the 2026-09-30 redesign the honeypot sits in its own form, outside the lead form. Bots that fill only the lead form's own controls (its `elements`) no longer reach it; the rate limit and the weekly sheet check cover them. Accepted by the human owner: losing a real lead is worse than some extra spam, and Option B (Turnstile) is ready if spam appears.

## Implementation Impact
- Backend: honeypot check and in-memory sliding-window limiter in the Flask app; `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_SECONDS` configuration.
- Frontend: hidden `website` field sent with every submission; localized `429` message.
- The honeypot value is never logged or stored. IP addresses live only in the limiter's in-memory state for the length of the window and are never logged or written anywhere.

## Validation
After go-live, the human owner checks the lead sheet weekly during the first month, and checks the app log for "honeypot triggered" lines (US-013 AC8).

2026-09-30: the accepted autofill risk happened in the human owner's own local test (browser autofill filled the hidden field and the lead was dropped). After the fix (#47) the human owner retested on macOS (2026-09-30) and confirmed on 2026-10-02 that the retest used the same browser setup as the incident, with real data in the development sheet: autofill fills the visible fields, the honeypot stays empty, and the lead is stored. The exact browser version was not recorded. The honeypot is kept, with stronger mitigations: its own separate form, a name without autofill meaning, password-manager opt-out attributes, and an INFO log per decoy (`UX_UI_DIRECTION.md` v0.8, US-013 AC1 and AC8).

## Review Trigger
More than 5 junk rows in a week, or any flood that reaches the Google Sheets quota: add Option B (Turnstile) through a new contract version and a privacy-notice update.

Any confirmed real lead lost to the honeypot after the 2026-09-30 fix: propose removing the honeypot through a spec change first (`PROJECT_SPEC.md` NFR-008, contract v1.2 section 3.1, US-013), then rely on the rate limit (plus Option B if spam appears).
