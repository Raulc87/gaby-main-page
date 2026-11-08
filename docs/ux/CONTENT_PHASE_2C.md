# CONTENT — phase 2c copy (staged)

The copy for phase 2c, from Gaby's review of 2026-11-08 ([`BRIEF_2026-11-08_STORYBRAND.md`](BRIEF_2026-11-08_STORYBRAND.md)), written ahead of the code (`AGENTS.md` → Change management: the spec first).

**Why a separate file.** [`CONTENT.md`](CONTENT.md) stays the only source of the copy the site shows, and the unit tests check that the code's strings equal its tables verbatim (`tests/unit/i18n/*`, `tests/unit/data/resources.test.ts`). Changing those tables before the code would turn CI red. So the approved phase 2c copy waits here, and **each implementing story moves its part into `CONTENT.md` in the same PR as its code**, then deletes it from this file. When the file is empty it is deleted. The rules of `CONTENT.md` → Metadata (status column, pending badge, markers, `{contact_email}`) apply here as they do there.

| Part | Moved into `CONTENT.md` by |
|---|---|
| A.8 §9 privacy notice | US-037 (GoHighLevel: `privacy.p4`, `privacy.ts` is Agent 2's); US-035 moved `privacy.p2`, `privacy.p3` and `privacy.p5`. Each story bumps `PRIVACY_NOTICE_VERSION` in the PR that changes the text |
| §12 Método Polaris page | US-028 (new section) |

No staged key is an alias (a value of the form "= `key`") of a key that another story moves, so each story's PR can merge on its own: `calc.eyebrow`, `calc.title` and `home.calculator.example.zone` repeat the same text instead (Sprint 004 plan review). Aliases point only at keys already in [`CONTENT.md`](CONTENT.md). The Método Polaris page (§12) shows the `home.method.*` steps as [`CONTENT.md`](CONTENT.md) has them when it merges.

Section numbers below are the ones the moved text takes in `CONTENT.md`, so references such as "§11" stay valid after the move.

## A. Changes to existing sections of `CONTENT.md`

### A.1 Metadata: pending badge

Each story adds only its own blocks to the two lists in `CONTENT.md` → Metadata → Pending badge, so `CONTENT.md` never lists blocks of pages that don't exist yet.

| Story | Add to **Placeholders** (badge in every build) | Add to **Provisional copy blocks** (preview and development builds) |
|---|---|---|
| US-028 | the Método Polaris page's steps placeholder (`method.steps.placeholder`, §12) | — |

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

## 12. Método Polaris page (`/es/metodo-polaris/`, `/en/polaris-method/`)

US-028, placeholder version (human owner, 2026-11-08: "in the meantime let's placeholder it").

| Key | Español | English | Status |
|---|---|---|---|
| `method.eyebrow` | = `home.method.eyebrow` | = `home.method.eyebrow` | approved |
| `method.title` | = `home.method.title` | = `home.method.title` | approved |
| `method.lead` | Un camino simple para ordenar tu dinero, convertir tus beneficios en capital e invertir con claridad. | A simple path to organize your money, turn your benefits into capital and invest with clarity. | provisional |
| `method.steps.placeholder` | Los pasos oficiales del Método Polaris: disponibles pronto | The official steps of the Polaris Method: coming soon | provisional |

Until Gaby sends the official steps, the page shows the three provisional steps of §5.6 (same keys, with the pending badge) and, below them, `method.steps.placeholder` as a placeholder block (badge in every build). It ends with the VIP band (§4).
