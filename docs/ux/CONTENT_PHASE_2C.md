# CONTENT — phase 2c copy (staged)

The copy for phase 2c, from Gaby's review of 2026-11-08 ([`BRIEF_2026-11-08_STORYBRAND.md`](BRIEF_2026-11-08_STORYBRAND.md)), written ahead of the code (`AGENTS.md` → Change management: the spec first).

**Why a separate file.** [`CONTENT.md`](CONTENT.md) stays the only source of the copy the site shows, and the unit tests check that the code's strings equal its tables verbatim (`tests/unit/i18n/*`, `tests/unit/data/resources.test.ts`). Changing those tables before the code would turn CI red. So the approved phase 2c copy waits here, and **each implementing story moves its part into `CONTENT.md` in the same PR as its code**, then deletes it from this file. When the file is empty it is deleted. The rules of `CONTENT.md` → Metadata (status column, pending badge, markers, `{contact_email}`) apply here as they do there.

| Part | Moved into `CONTENT.md` by |
|---|---|
| A.7 §8.5 scheduler fallback key | US-037 |
| A.8 §9 privacy notice | US-037 (GoHighLevel: `privacy.p4`, `privacy.ts` is Agent 2's); US-035 moved `privacy.p2`, `privacy.p3` and `privacy.p5`. Each story bumps `PRIVACY_NOTICE_VERSION` in the PR that changes the text |

No staged key is an alias (a value of the form "= `key`") of a key that another story moves, so each story's PR can merge on its own: `calc.eyebrow`, `calc.title` and `home.calculator.example.zone` repeat the same text instead (Sprint 004 plan review). Aliases point only at keys already in [`CONTENT.md`](CONTENT.md). The Método Polaris page (§12) shows the `home.method.*` steps as [`CONTENT.md`](CONTENT.md) has them when it merges.

Section numbers below are the ones the moved text takes in `CONTENT.md`, so references such as "§11" stay valid after the move.

## A. Changes to existing sections of `CONTENT.md`

### A.7 §8.5 After a successful application

`thanks.calendly_fallback` is renamed (same text):

| Key | Español | English | Status |
|---|---|---|---|
| `thanks.scheduler_fallback` | No pudimos cargar el calendario. Escríbenos a {contact_email} y coordinamos tu llamada. | We couldn't load the calendar. Email us at {contact_email} and we'll arrange your call. | approved |

### A.8 §9 Privacy notice

| Key | Español | English | Status |
|---|---|---|---|
| `privacy.p4` | Con quién los compartimos: con Google (almacenamiento en Google Sheets) y GoHighLevel (agendamiento de la llamada: tu nombre, correo y teléfono, y los datos de tu reserva), que pueden almacenar información fuera de Costa Rica. | Who we share it with: Google (Google Sheets storage) and GoHighLevel (scheduling the call: your name, email and phone, and your booking details), which may store data outside Costa Rica. | provisional |

`privacy.p4` replaces the current row with US-037 (`privacy.p2`, `privacy.p3` and `privacy.p5` moved with US-035). Extend the note under the table (it already says v0.2 adds the calculator): US-037 replaces Calendly with GoHighLevel (ADR-006). If ADR-007 adds an email provider, it is named in `privacy.p4` in the same PR that adds it. Bump `PRIVACY_NOTICE_VERSION` when this text changes.

