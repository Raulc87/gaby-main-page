# CONTENT — phase 2c copy (staged)

The copy for phase 2c, from Gaby's review of 2026-11-08 ([`BRIEF_2026-11-08_STORYBRAND.md`](BRIEF_2026-11-08_STORYBRAND.md)), written ahead of the code (`AGENTS.md` → Change management: the spec first).

**Why a separate file.** [`CONTENT.md`](CONTENT.md) stays the only source of the copy the site shows, and the unit tests check that the code's strings equal its tables verbatim (`tests/unit/i18n/*`, `tests/unit/data/resources.test.ts`). Changing those tables before the code would turn CI red. So the approved phase 2c copy waits here, and **each implementing story moves its part into `CONTENT.md` in the same PR as its code**, then deletes it from this file. When the file is empty it is deleted. The rules of `CONTENT.md` → Metadata (status column, pending badge, markers, `{contact_email}`) apply here as they do there.

| Part | Moved into `CONTENT.md` by |
|---|---|
| A.8 §9 privacy notice | US-035 (calculator data: `privacy.p2`, `privacy.p3`, `privacy.p5`; `privacy.ts` is Agent 2's) and US-037 (GoHighLevel: `privacy.p4`). US-035 and US-037 each bump `PRIVACY_NOTICE_VERSION` in the PR that changes the text |
| §11 Calculator | US-035 (new section) |
| §12 Método Polaris page | US-028 (new section) |

No staged key is an alias (a value of the form "= `key`") of a key that another story moves, so each story's PR can merge on its own: `calc.eyebrow`, `calc.title` and `home.calculator.example.zone` repeat the same text instead (Sprint 004 plan review). Aliases point only at keys already in [`CONTENT.md`](CONTENT.md). The Método Polaris page (§12) shows the `home.method.*` steps as [`CONTENT.md`](CONTENT.md) has them when it merges.

Section numbers below are the ones the moved text takes in `CONTENT.md`, so references such as "§11" stay valid after the move.

## A. Changes to existing sections of `CONTENT.md`

### A.1 Metadata: pending badge

Each story adds only its own blocks to the two lists in `CONTENT.md` → Metadata → Pending badge, so `CONTENT.md` never lists blocks of pages that don't exist yet.

| Story | Add to **Placeholders** (badge in every build) | Add to **Provisional copy blocks** (preview and development builds) |
|---|---|---|
| US-035 | — | the calculator's questions, zones and result (§11, placeholder formula) |
| US-028 | the Método Polaris page's steps placeholder (`method.steps.placeholder`, §12) | — |

### A.7 §8.5 After a successful application

`thanks.calendly_fallback` is renamed (same text):

| Key | Español | English | Status |
|---|---|---|---|
| `thanks.scheduler_fallback` | No pudimos cargar el calendario. Escríbenos a {contact_email} y coordinamos tu llamada. | We couldn't load the calendar. Email us at {contact_email} and we'll arrange your call. | approved |

### A.8 §9 Privacy notice

| Key | Español | English | Status |
|---|---|---|---|
| `privacy.p2` | Datos que recopilamos: nombre completo, correo electrónico, teléfono (WhatsApp), tu respuesta a la pregunta de preselección, el idioma en el que ves el sitio, y la fecha y hora de tu envío. Si usas la calculadora, guardamos tu nombre, tu correo, tu WhatsApp si lo das, tu resultado (meses y zona), si aceptaste recibir los correos de Gaby, el idioma y la fecha y hora; las cifras que escribes en la calculadora no se guardan. | Data we collect: full name, email, phone (WhatsApp), your pre-screening answer, the language you viewed the site in, and the date and time of your submission. If you use the calculator, we store your name, your email, your WhatsApp if you give it, your result (months and zone), whether you agreed to receive Gaby's emails, the language, and the date and time; the figures you enter in the calculator are not stored. | provisional |
| `privacy.p3` | Para qué los usamos: para contactarte sobre la llamada inicial y la Mentoría VIP, para priorizar las llamadas y, si usas la calculadora, para mostrarte tu resultado y enviártelo por correo con la guía y, solo si lo aceptas, enviarte los correos de Gaby, de los que puedes darte de baja en cualquier momento. No los usamos para ningún otro fin ni los vendemos. | Purpose: to contact you about the initial call and the VIP Mentorship, to prioritize calls and, if you use the calculator, to show you your result and email it to you with the guide and, only if you agree, to send you Gaby's emails, which you can unsubscribe from at any time. We do not use it for any other purpose and do not sell it. | provisional |
| `privacy.p4` | Con quién los compartimos: con Google (almacenamiento en Google Sheets) y GoHighLevel (agendamiento de la llamada: tu nombre, correo y teléfono, y los datos de tu reserva), que pueden almacenar información fuera de Costa Rica. | Who we share it with: Google (Google Sheets storage) and GoHighLevel (scheduling the call: your name, email and phone, and your booking details), which may store data outside Costa Rica. | provisional |

| `privacy.p5` | Carácter voluntario: brindar tus datos es opcional. Sin ellos no podemos procesar tu aplicación, agendar tu llamada ni mostrarte el resultado de la calculadora desde este sitio. | Voluntary nature: providing your data is optional. Without it, we cannot process your application, schedule your call or show you the calculator's result from this site. | provisional |

They replace the current rows (`privacy.p2`, `privacy.p3` and `privacy.p5` move with US-035, `privacy.p4` with US-037). Add to the note under the table: v0.2 adds the calculator (US-035, US-036) and replaces Calendly with GoHighLevel (US-037, ADR-006). If ADR-007 adds an email provider, it is named in `privacy.p4` in the same PR that adds it. Bump `PRIVACY_NOTICE_VERSION` when this text changes.


## 11. Calculator (`/es/calculadora/`, `/en/calculator/`)

US-035. The calculator is a **shell with a placeholder formula**: Gaby has her own calculator, which replaces the questions, the formula and the zones when she shares it (human owner, 2026-11-08). Until then every key below except the shared form keys is `provisional`, and the questions, zones and result show the pending badge in preview and development builds. The formula is in [`PROJECT_SPEC.md`](../specs/PROJECT_SPEC.md) FR-034.

### 11.1 Page and questions

| Key | Español | English | Status |
|---|---|---|---|
| `calc.eyebrow` | Diagnóstico gratis · 3 minutos | Free diagnosis · 3 minutes | approved |
| `calc.title` | ¿Cuántos meses podrías sostenerte *si cambiara tu puesto?* | How many months could you sustain yourself *if your position changed?* | approved |
| `calc.lead` | Cinco datos sobre tu dinero hoy. Usa la misma moneda en todos. | Five figures about your money today. Use the same currency for all of them. | provisional |
| `calc.expenses.label` | Gastos mensuales de tu hogar | Your household's monthly expenses | provisional |
| `calc.expenses.hint` | Lo que gastas en un mes normal: vivienda, comida, servicios, transporte, educación. | What you spend in a normal month: housing, food, utilities, transport, education. | provisional |
| `calc.debt.label` | Pagos mensuales de deudas | Monthly debt payments | provisional |
| `calc.debt.hint` | Tarjetas, préstamos y otras cuotas. Si no tienes, escribe 0. | Cards, loans and other installments. If you have none, enter 0. | provisional |
| `calc.savings.label` | Ahorros disponibles | Available savings | provisional |
| `calc.savings.hint` | Dinero que podrías usar ya: cuentas de ahorro, efectivo, fondo de emergencia. | Money you could use now: savings accounts, cash, emergency fund. | provisional |
| `calc.investments.label` | Inversiones que podrías vender en un mes | Investments you could sell within a month | provisional |
| `calc.investments.hint` | Acciones, fondos o ETFs. No incluyas tu casa ni tu pensión. Si no tienes, escribe 0. | Stocks, funds or ETFs. Don't include your home or your pension. If you have none, enter 0. | provisional |
| `calc.other_income.label` | Ingresos mensuales sin tu salario | Monthly income without your salary | provisional |
| `calc.other_income.hint` | Alquileres, un negocio propio u otros ingresos que seguirían si dejaras tu puesto. Si no tienes, escribe 0. | Rent, a business of your own or other income that would continue if you left your position. If you have none, enter 0. | provisional |
| `calc.next` | Ver mi resultado | See my result | provisional |
| `calc.error.number` | Escribe un número igual o mayor que 0. | Enter a number of 0 or more. | provisional |
| `calc.error.no_outflow` | Tus gastos y pagos de deudas no pueden sumar 0. | Your expenses and debt payments can't add up to 0. | provisional |

Required fields use `form.error.required` (§8.4). Figures are typed without currency symbols; the result does not depend on the currency.

### 11.2 Your details before the result

Gaby's funnel asks for the visitor's details before showing the result (brief 2026-11-08, §2, paso 3).

| Key | Español | English | Status |
|---|---|---|---|
| `calc.capture.title` | Tu resultado está listo | Your result is ready | provisional |
| `calc.capture.body` | Déjanos tus datos para verlo. | Leave us your details to see it. | provisional |
| `calc.capture.phone.label` | WhatsApp (opcional) | WhatsApp (optional) | provisional |
| `calc.capture.consent` | Acepto el tratamiento de mis datos personales según el [Aviso de Privacidad] para ver mi resultado y recibirlo por correo. | I agree to the processing of my personal data as described in the [Privacy Notice] to see my result and receive it by email. | provisional |
| `calc.capture.marketing` | Quiero recibir los correos de Gaby: seis correos en dos semanas sobre cómo ordenar e invertir mi dinero, con invitaciones a una llamada inicial, y después un correo semanal. Puedo darme de baja en cualquier momento. | I want to receive Gaby's emails: six emails over two weeks on how to organize and invest my money, with invitations to an initial call, then a weekly email. I can unsubscribe at any time. | provisional |
| `calc.capture.submit` | Ver mi resultado | See my result | provisional |

Name and email use `form.name.*` and `form.email.*`; the optional WhatsApp uses `form.phone.hint` and its errors; errors use §8.4. `[...]` in `calc.capture.consent` opens the privacy notice dialog. `calc.capture.consent` is required; `calc.capture.marketing` is an optional, unticked checkbox, and only leads who tick it enter the email sequence (FR-037, BR-012). The required consent already covers emailing the result and the guide, which the visitor asks for; until US-038 sends them, nothing is emailed, and the consent collected then still covers the email when it starts. Both texts are part of the legal review (US-018).

### 11.3 Result

| Key | Español | English | Status |
|---|---|---|---|
| `calc.result.label` | Con tu dinero de hoy, sin tu salario, podrías sostenerte | With your money today, without your salary, you could sustain yourself for | provisional |
| `calc.result.months` | {months} meses | {months} months | provisional |
| `calc.result.covered` | Tus otros ingresos ya cubren tus gastos y deudas. | Your other income already covers your expenses and debts. | provisional |
| `calc.zone.alert.title` | Zona de alerta | Alert zone | approved |
| `calc.zone.alert.body` | Menos de 6 meses. Es el momento de ordenar tu dinero y construir tu colchón. | Less than 6 months. It's time to organize your money and build your cushion. | provisional |
| `calc.zone.building.title` | Zona de construcción | Building zone | provisional |
| `calc.zone.building.body` | De 6 a menos de 12 meses. Vas bien: ahora se trata de poner tu dinero a trabajar. | From 6 to under 12 months. You're on track: now it's about putting your money to work. | provisional |
| `calc.zone.freedom.title` | Zona de libertad | Freedom zone | provisional |
| `calc.zone.freedom.body` | 12 meses o más. Tienes margen para decidir sobre tu carrera desde la libertad. | 12 months or more. You have room to make career decisions from freedom. | provisional |
| `calc.result.email_note` | Te enviamos tu resultado y la guía "Cómo empezar a invertir siendo ejecutivo" a tu correo. | We've sent your result and the guide "How to start investing as an executive" to your email. | provisional |
| `calc.result.disclaimer` | Este cálculo es una estimación educativa con los datos que escribiste; no es una recomendación financiera. | This calculation is an educational estimate based on the figures you entered; it is not financial advice. | provisional |
| `calc.result.cta` | = `cta.vip_apply` | = `cta.vip_apply` | approved |
| `calc.result.secondary` | = `cta.all_resources` | = `cta.all_resources` | approved |
| `calc.restart` | Calcular de nuevo | Calculate again | provisional |

`{months}` has one decimal, with a decimal comma in Spanish ("4,4 meses") and a point in English ("4.4 months"). `calc.result.covered` replaces the months and the zone body when other income covers the monthly outflow; the zone is then "freedom". "Zona de alerta" is Gaby's label (her example result); the other zone names are the team's. `calc.result.email_note` is shown only once the guide is sent by email (US-038). In preview builds the capture step stores nothing and the result shows `preview.form_note` (§8.6).

## 12. Método Polaris page (`/es/metodo-polaris/`, `/en/polaris-method/`)

US-028, placeholder version (human owner, 2026-11-08: "in the meantime let's placeholder it").

| Key | Español | English | Status |
|---|---|---|---|
| `method.eyebrow` | = `home.method.eyebrow` | = `home.method.eyebrow` | approved |
| `method.title` | = `home.method.title` | = `home.method.title` | approved |
| `method.lead` | Un camino simple para ordenar tu dinero, convertir tus beneficios en capital e invertir con claridad. | A simple path to organize your money, turn your benefits into capital and invest with clarity. | provisional |
| `method.steps.placeholder` | Los pasos oficiales del Método Polaris: disponibles pronto | The official steps of the Polaris Method: coming soon | provisional |

Until Gaby sends the official steps, the page shows the three provisional steps of §5.6 (same keys, with the pending badge) and, below them, `method.steps.placeholder` as a placeholder block (badge in every build). It ends with the VIP band (§4).
