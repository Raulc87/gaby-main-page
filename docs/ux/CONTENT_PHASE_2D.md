# CONTENT — phase 2d copy (staged)

The phase 2d copy: Gaby's final content of 2026-11-23 ([`BRIEF_2026-11-23_WEALTH_MASTERY.md`](BRIEF_2026-11-23_WEALTH_MASTERY.md)), written as [`CONTENT.md`](CONTENT.md) rows, ready to move. It is staged here, not in `CONTENT.md`, because the unit tests check the code against `CONTENT.md`: each Sprint 005 story moves **its part** into `CONTENT.md` in the same PR as its code, and deletes that part from this file. The story that moves the last part deletes this file and the references to it.

Same rules as `CONTENT.md` (its Metadata): the row format is the same (`| key | Español | English | Status |`), values are verbatim and never contain markers, `*text*` marks the italic part of a heading, `= key` points at another key, and **every English value is provisional** until Gaby validates the English as a whole.

## Parts and who moves them

| Part | What | Moved by |
|---|---|---|
| [H](#part-h--home-the-three-pillars-and-no-library-links) | Home: the Método Polaris as three pillars (§5.6), the Wealth Mastery section removed (§5.7), the teaser's library links removed (§5.10) | US-043 |
| [C](#part-c--gabys-calculator) | §11, Gaby's calculator, with the error for the unanswered shares question | US-044 |
| [P](#part-p--privacy-notice-gohighlevel) | §9, `privacy.p2` and `privacy.p4`: GoHighLevel as the processor of the contacts and the emails | US-045 |
| [L](#part-l--the-resource-library-withdrawn) | §7 withdrawn, and every key that pointed at the library; **after Part H** | US-046 |

Rules for the moves:

- **Part V (voseo, the name, the menu) has moved** (US-041, merged first in Sprint 005; it is in `CONTENT.md`). It gave interim voseo to keys that Parts H, W, C, P and L later replace or remove; each of those parts replaces those rows with its own. References below to "Part V" mean those moved rows.
- **No part depends on another part's move**, except **Part L, which moves after Part H**: until Part H, the Home's calculator teaser shows `home.calculator.more` and the titles of two resources from the data file Part L deletes (the same order as `docs/sprints/SPRINT_005.md`: `GK-046` after `GK-043`). Where two parts show the same text (the pillars on the Home and on the Wealth Mastery page), each writes it out in full; aliases (`= key`) point only at keys already in `CONTENT.md` after Part V.
- **Status.** `approved`: Gaby's Spanish, verbatim from the brief, or an approved value changed only by her two rules (voseo, the programme's name). `provisional`: proposed by the team, shown with the pending badge where `CONTENT.md` Metadata says so. Each part updates the Metadata's badge lists as its notes say.
- **Section numbers stay.** A section that is withdrawn keeps its heading with one line saying so, so references to other sections keep working.
- Gaby's few slips against her own rules are corrected here and listed for her in [Flags for Gaby](#flags-for-gaby).

---

## Part H — Home: the three pillars and no library links

**Moved by US-043.** Gaby's adjusted Home, section 6 (brief §3), verbatim.

### H.1 The plan: Método Polaris (§5.6), replaced

These rows replace the whole §5.6 table. `home.method.1.*` to `home.method.3.*` change meaning (pillars, not steps): each pillar has a `label` (the official name, shown small above), a `title` (the short name) and a `body`.

| Key | Español | English | Status |
|---|---|---|---|
| `home.method.eyebrow` | El Método Polaris | The Polaris Method | approved |
| `home.method.title` | Tres pilares que avanzan juntos, *con cada salario.* | Three pillars that move forward together, *with every paycheck.* | approved |
| `home.method.lead` | Polaris es la Estrella Polar: tu norte, el que guía el camino. Así nació mi método, de más de 10 años construyendo mi propio portafolio: un norte claro para que cada decisión con tu dinero vaya en la misma dirección. | Polaris is the North Star: your north, the one that guides the way. That's how my method was born, from more than 10 years building my own portfolio: a clear north so every decision with your money goes in the same direction. | approved |
| `home.method.1.label` | Mentalidad Millonaria | Millionaire Mindset | approved |
| `home.method.1.title` | Mentalidad | Mindset | approved |
| `home.method.1.body` | Tus creencias y patrones con el dinero, y la vida que querés construir. | Your beliefs and patterns with money, and the life you want to build. | approved |
| `home.method.2.label` | Administración del Dinero | Money Management | approved |
| `home.method.2.title` | Administración | Management | approved |
| `home.method.2.body` | Tu sistema de billeteras y tu protección: cada ingreso y cada beneficio con un propósito. | Your wallet system and your protection: every income and every benefit with a purpose. | approved |
| `home.method.3.label` | Inversiones e Ingresos Pasivos | Investments and Passive Income | approved |
| `home.method.3.title` | Inversión | Investing | approved |
| `home.method.3.body` | Bolsa, bienes raíces, oro, plata y cripto: entender, evaluar y decidir. | Stocks, real estate, gold, silver and crypto: understand, evaluate and decide. | approved |
| `home.method.closing` | No es primero una cosa y después la otra: con cada ingreso avanzás en los tres al mismo tiempo. | It isn't one thing first and then the other: with every income you move forward in all three at the same time. | approved |
| `home.method.cta` | = `cta.vip_apply` | = `cta.vip_apply` | approved |
| `home.method.link` | Conocé Wealth Mastery | Get to know Wealth Mastery | approved |

The note under §5.6 becomes: "Gaby's official pillars (2026-11-23). They are worked in parallel, so they show no numbers, no arrows and no order (`UX_UI_DIRECTION.md` §5.1). `home.method.cta` (blue, BR-010) leads to the application page; `home.method.link` is a text link to the Wealth Mastery page (§12), its arrow drawn by the link style." `home.method.cta` was "Quiero aplicar el Método Polaris con Gaby"; Gaby's section has the apply button instead. US-043 removes "the Método Polaris steps (§5.6)" from the Metadata's provisional blocks.

### H.2 What you learn in Wealth Mastery (§5.7), removed

The §5.7 section and all its keys (`home.mastery.*`) are removed: Gaby moved it to the Wealth Mastery page, which explains each pillar (FR-032 withdrawn). The §5.7 heading stays with one line: "Withdrawn in phase 2d (US-043): the Wealth Mastery page (§12) explains the pillars." US-043 removes "the Wealth Mastery modules (§5.7)" from the Metadata's provisional blocks, and the §5 intro says ten sections (the list without "Wealth Mastery").

### H.3 The calculator teaser (§5.10)

`home.calculator.more` is **removed**, with its two links; the note under §5.10 drops its sentence about them ("Below `home.calculator.more`…"). No other §5.10 row changes beyond Part V.

---

## Part C — Gaby's calculator

**Moved by US-044.** Gaby's prototype (brief §4), verbatim, as `CONTENT.md` §11, **replacing all of it**. The §11 intro becomes: "US-035, US-044. Gaby's calculator (phase 2d): her questions, formula, zones and texts. The formula is in [`PROJECT_SPEC.md`](../specs/PROJECT_SPEC.md) FR-034."

US-044 removes the calculator's questions, zones and result from the Metadata's provisional blocks (they are Gaby's now) and adds "the calculator's team-written lines (`calc.shares.placeholder`, `calc.error.shares`, `calc.capture.body`)".

### C.1 Page and your numbers

| Key | Español | English | Status |
|---|---|---|---|
| `calc.eyebrow` | Diagnóstico gratis · 3 minutos | Free diagnosis · 3 minutes | approved |
| `calc.title` | ¿Cuántos meses podrías sostenerte *si cambiara tu puesto?* | How many months could you sustain yourself *if your position changed?* | approved |
| `calc.lead` | Cinco datos, tres minutos. Descubrí cuánto tiempo te da hoy tu dinero sin tu salario. | Five figures, three minutes. Find out how long your money would last today without your salary. | approved |
| `calc.figures.title` | Tus números | Your numbers | approved |
| `calc.currency.label` | Moneda | Currency | provisional |
| `calc.currency.usd` | USD | USD | approved |
| `calc.currency.crc` | Colones | Colones | approved |
| `calc.example_note` | Ya viene con un ejemplo cargado. Cambialo por tus números. | It comes with an example filled in. Replace it with your numbers. | approved |
| `calc.expenses.label` | ¿Cuánto gastás al mes para vivir como vivís hoy? | How much do you spend a month to live the way you live today? | approved |
| `calc.expenses.hint` | Casa, comida, colegios, carro, seguros, salidas. Todo. | Home, food, schools, car, insurance, going out. Everything. | approved |
| `calc.savings.label` | ¿Cuánto tenés en cuentas de ahorro y billeteras? | How much do you have in savings accounts and wallets? | approved |
| `calc.investments.label` | ¿Cuánto tenés en inversiones que podrías vender en menos de un mes? | How much do you have in investments you could sell in less than a month? | approved |
| `calc.investments.hint` | Fondos, acciones, ETFs, CDPs. No incluyás tu casa. | Funds, stocks, ETFs, certificates of deposit. Don't include your home. | approved |
| `calc.solidarity.label` | ¿Cuánto tenés en la asociación solidarista? | How much do you have in your solidarity association (asociación solidarista)? | approved |
| `calc.solidarity.hint` | Lo que recibirías si dejaras la empresa. Si no sabés, poné 0. | What you would receive if you left the company. If you don't know, enter 0. | approved |
| `calc.passive.label` | ¿Cuánto te entra al mes sin trabajar? | How much comes in each month without working? | approved |
| `calc.passive.hint` | Alquileres, dividendos, intereses. | Rent, dividends, interest. | approved |
| `calc.shares.label` | ¿Qué parte de tus inversiones está en acciones de tu empresa? | How much of your investments is in your company's shares? | approved |
| `calc.shares.placeholder` | Elegí una opción | Choose an option | provisional |
| `calc.shares.none` | No tengo acciones de mi empresa | I don't have shares in my company | approved |
| `calc.shares.under_20` | Menos del 20% | Less than 20% | approved |
| `calc.shares.from_20_to_50` | Entre 20% y 50% | Between 20% and 50% | approved |
| `calc.shares.over_50` | Más del 50% | More than 50% | approved |
| `calc.error.expenses` | Escribí cuánto gastás al mes para poder calcular. | Enter how much you spend a month so we can calculate. | approved |
| `calc.error.shares` | Elegí qué parte de tus inversiones está en acciones de tu empresa. | Choose how much of your investments is in your company's shares. | provisional |
| `calc.error.number` | Escribí un número igual o mayor que 0. | Enter a number of 0 or more. | provisional |
| `calc.next` | Calcular mis meses | Calculate my months | approved |

Notes:

- **Removed:** `calc.debt.*`, `calc.other_income.*`, `calc.savings.hint` and `calc.error.no_outflow` (Gaby's calculator has no debt question; passive income replaces "other income"; the expenses error replaces "no outflow").
- `calc.eyebrow` stays the Home's "Diagnóstico gratis · 3 minutos" (Gaby's own wording on the Home and in the menu); the prototype's "Gaby Kelly · Diagnóstico gratuito" carries her name because it is a stand-alone page.
- The currency symbols (`$`, `₡`) and Gaby's example figures (4.500, 9.000, 6.000, 5.000, 0, in USD) are data, not copy keys: they live with the calculator's code (FR-034). Amounts show a thousands separator (a point in Spanish, a comma in English).
- `calc.shares.placeholder` is the select's empty first option and `calc.error.shares` its error (FR-034: the question opens unanswered and is required; US-044 AC7). `calc.error.number` keeps the FR-034 rule for an amount out of range.
- `calc.expenses.label` corrects "como vives hoy" (see the flags).

### C.2 Your details before the result

| Key | Español | English | Status |
|---|---|---|---|
| `calc.capture.title` | Tu resultado está listo | Your result is ready | approved |
| `calc.capture.body` | Dejanos tus datos para verlo. | Leave us your details to see it. | provisional |
| `calc.capture.body_with_guide` | ¿A dónde te lo enviamos? También te llega la guía "Cómo empezar a invertir siendo ejecutivo". | Where should we send it? You'll also get the guide "How to start investing as an executive". | approved |
| `calc.capture.phone.label` | WhatsApp (opcional) | WhatsApp (optional) | approved |
| `calc.capture.consent` | Acepto el tratamiento de mis datos personales según el [Aviso de Privacidad] para ver mi resultado y recibirlo por correo. | I agree to the processing of my personal data as described in the [Privacy Notice] to see my result and receive it by email. | provisional |
| `calc.capture.marketing` | Quiero recibir los correos de Gaby: seis correos en dos semanas sobre cómo ordenar e invertir mi dinero, con invitaciones a una llamada inicial, y después un correo semanal. Puedo darme de baja en cualquier momento. | I want to receive Gaby's emails: six emails over two weeks on how to organize and invest my money, with invitations to an initial call, then a weekly email. I can unsubscribe at any time. | provisional |
| `calc.capture.submit` | Ver mi resultado | See my result | approved |

Notes:

- `calc.capture.body_with_guide` is Gaby's; it is shown only once GoHighLevel sends email 1 with the guide end to end (US-038, FR-036), and `calc.capture.body` until then, so the page never promises an email that is not sent (the same rule as `home.calculator.receive_with_guide`).
- **Two checkboxes, not Gaby's one** (brief §8 point 1): `calc.capture.consent` (required) and `calc.capture.marketing` (optional, unticked), unchanged. Gaby's single text offered WhatsApp, which the funnel does not use (BR-012).
- Name and email keep `form.name.*` and `form.email.*` ("Nombre completo", "Correo electrónico") rather than Gaby's "Nombre" and "Correo", because the name needs a surname (contract §3); errors keep the shared `form.error.*` (§8.4, Part V). Gaby's three messages map to them: "Escribí tu nombre." → `form.error.required`; "Revisá tu correo: parece incompleto." → `form.error.invalid_format.email`; "Marcá la casilla para recibir tu resultado." → `form.error.consent_required`.
- No "Prototipo" note (Gaby's email: remove it). Preview builds show `preview.form_note` (§8.6).

### C.3 Result

| Key | Español | English | Status |
|---|---|---|---|
| `calc.result.label` | Tus meses de libertad | Your months of freedom | approved |
| `calc.result.unit.one` | mes | month | approved |
| `calc.result.unit.many` | meses | months | approved |
| `calc.zone.critical.label` | Zona crítica | Critical zone | approved |
| `calc.zone.critical.title` | Tu tranquilidad depende de tu próximo salario. | Your peace of mind depends on your next paycheck. | approved |
| `calc.zone.critical.body` | Si mañana cambiara tu puesto, tendrías menos de tres meses de margen. La buena noticia: con un buen salario, este número puede crecer rápido cuando tenés un sistema. | If your position changed tomorrow, you'd have less than three months of margin. The good news: with a good salary, this number can grow fast once you have a system. | approved |
| `calc.zone.alert.label` | Zona de alerta | Alert zone | approved |
| `calc.zone.alert.title` | Tenés un colchón, pero es delgado. | You have a cushion, but it's thin. | approved |
| `calc.zone.alert.body` | Podrías sostenerte unos meses, pero un cambio en tu trabajo te obligaría a decidir desde la presión. El siguiente paso es separar con propósito cada mes. | You could sustain yourself for a few months, but a change at work would force you to decide under pressure. The next step is to set money aside with a purpose every month. | approved |
| `calc.zone.building.label` | Base en construcción | Building your base | approved |
| `calc.zone.building.title` | Vas bien. Ahora toca ponerlo a trabajar. | You're on track. Now it's time to put it to work. | approved |
| `calc.zone.building.body` | Tenés una base real. El reto es que ese dinero no se quede quieto: que empiece a generar ingresos para que no todo dependa de tu salario. | You have a real base. The challenge is to keep that money from standing still: to have it start generating income so not everything depends on your salary. | approved |
| `calc.zone.path_to_freedom.label` | Camino a la libertad | Path to freedom | approved |
| `calc.zone.path_to_freedom.title` | Tenés margen para decidir con calma. | You have room to decide calmly. | approved |
| `calc.zone.path_to_freedom.body` | Podés tomar decisiones de carrera desde la libertad. El siguiente nivel es que tus inversiones paguen una parte creciente de tus gastos. | You can make career decisions from freedom. The next level is for your investments to pay a growing share of your expenses. | approved |
| `calc.zone.solid_cushion.label` | Colchón sólido | Solid cushion | approved |
| `calc.zone.solid_cushion.title` | Tu dinero ya te da años de tranquilidad. | Your money already gives you years of peace of mind. | approved |
| `calc.zone.solid_cushion.body` | Tenés más de tres años de margen. La pregunta ahora es si ese patrimonio está trabajando todo lo que podría y bien diversificado. | You have more than three years of margin. The question now is whether that wealth is working as hard as it could and is well diversified. | approved |
| `calc.zone.financially_free.label` | Libre financieramente | Financially free | approved |
| `calc.zone.financially_free.title` | Tus ingresos pasivos ya cubren tus gastos. | Your passive income already covers your expenses. | approved |
| `calc.zone.financially_free.body` | Ganaste el juego: tus inversiones pagan tu vida. Ahora se trata de proteger y hacer crecer ese patrimonio. | You've won the game: your investments pay for your life. Now it's about protecting and growing that wealth. | approved |
| `calc.gauge.max` | 36+ meses | 36+ months | approved |
| `calc.result.available` | Dinero disponible sin tu salario | Money available without your salary | approved |
| `calc.result.gap` | Lo que te falta cubrir cada mes | What you need to cover each month | approved |
| `calc.alert.lead` | Ojo con la concentración. | Watch your concentration. | approved |
| `calc.alert.body` | Una parte grande de tus inversiones está en tu propia empresa. Si a la empresa le va mal, podrías perder salario y ahorros al mismo tiempo. | A large part of your investments is in your own company. If the company does badly, you could lose your salary and your savings at the same time. | approved |
| `calc.next_step.title` | ¿Cómo subo este número? | How do I raise this number? | approved |
| `calc.next_step.body` | Con un sistema: billeteras, los beneficios de tu empresa trabajando para vos y un plan de inversión. Es lo que construimos juntos en Wealth Mastery, con el Método Polaris. | With a system: wallets, your company's benefits working for you, and an investment plan. It's what we build together in Wealth Mastery, with the Polaris Method. | approved |
| `calc.result.cta` | = `cta.vip_apply` | = `cta.vip_apply` | approved |
| `calc.restart` | Calcular otra vez | Calculate again | approved |
| `calc.result.email_note` | Te enviamos tu resultado y la guía "Cómo empezar a invertir siendo ejecutivo" a tu correo. | We've sent your result and the guide "How to start investing as an executive" to your email. | provisional |
| `calc.result.disclaimer` | Este cálculo es una estimación educativa con los datos que ingresaste. No incluye impuestos, comisiones ni cambios en tus gastos, y no constituye una recomendación de inversión. Gaby Kelly es inversora y mentora; no es asesora financiera. | This calculation is an educational estimate based on the figures you entered. It doesn't include taxes, fees or changes in your expenses, and it isn't investment advice. Gaby Kelly is an investor and mentor, not a financial advisor. | approved |

Notes:

- **Removed:** `calc.result.months`, `calc.result.covered`, `calc.zone.alert.title` (the old one, now `.label`), `calc.zone.freedom.*`, `calc.zone.building.title` and `.body` are replaced by the rows above, and `calc.result.secondary` (the library link; Part L if it merges first).
- The months: the number is formatted by FR-034 (below 10 one decimal, rounded half up, with a decimal comma in Spanish and a point in English, and a whole value without a decimal: "4,4", "6"; from 10 a whole number), followed by `calc.result.unit.one` when the shown value is exactly 1 and `calc.result.unit.many` otherwise. The covered case shows "∞" with no unit and the `financially_free` zone. "∞" and the numbers are not copy keys.
- The zone label is the pill's text (`UX_UI_DIRECTION.md` §6.7) and the value of the GoHighLevel field `zona` (contract §12): the Spanish label in both languages there. The gauge's other labels (0, 6, 12, 24) are numbers.
- `calc.alert.*` shows only when the shares answer is "Entre 20% y 50%" or "Más del 50%" (FR-034); `calc.alert.lead` is the bold lead-in.
- `calc.result.email_note` is shown only once email 1 is sent end to end (US-038).
- The §11 closing note becomes the notes above; "Zona de alerta is Gaby's label; the other zone names are the team's" is dropped (all are hers now).

---

## Part P — Privacy notice: GoHighLevel

**Moved by US-045** (AC7), with the `PRIVACY_NOTICE_VERSION` bump (the one bump of phase 2d, Part V.8). `privacy.p3` keeps its Part V value.

| Key | Español | English | Status |
|---|---|---|---|
| `privacy.p2` | Datos que recopilamos: nombre completo, correo electrónico, teléfono (WhatsApp), tu respuesta a la pregunta de preselección, el idioma en el que ves el sitio, y la fecha y hora de tu envío. Si usás la calculadora, guardamos tu nombre, tu correo, tu WhatsApp si lo das, tu resultado (meses y zona), la moneda que elegiste, si una parte grande de tus inversiones está en acciones de tu empresa (sí o no), si aceptaste recibir los correos de Gaby, el idioma y la fecha y hora; las cifras que escribís en la calculadora no se guardan ni se envían. | Data we collect: full name, email, phone (WhatsApp), your pre-screening answer, the language you viewed the site in, and the date and time of your submission. If you use the calculator, we store your name, your email, your WhatsApp if you give it, your result (months and zone), the currency you chose, whether a large part of your investments is in your company's shares (yes or no), whether you agreed to receive Gaby's emails, the language, and the date and time; the figures you enter in the calculator are neither stored nor sent. | provisional |
| `privacy.p4` | Con quién los compartimos: con Google (almacenamiento en Google Sheets) y con GoHighLevel, la plataforma de Gaby, que recibe tu contacto (tu nombre, correo, teléfono si lo das e idioma y, según el formulario, tu resultado de la calculadora o tu respuesta de preselección), envía los correos y agenda la llamada. Ambos pueden almacenar información fuera de Costa Rica. | Who we share it with: Google (Google Sheets storage) and GoHighLevel, Gaby's platform, which receives your contact (your name, email, phone if you give it and language and, depending on the form, your calculator result or your pre-screening answer), sends the emails and schedules the call. Both may store data outside Costa Rica. | provisional |

The note under §9 replaces its sentence on GoHighLevel and ADR-007 with: "v0.3 (phase 2d, US-045): `privacy.p2` adds the calculator's currency and concentration answer and says the figures are not sent; `privacy.p4` names GoHighLevel as the processor of the contacts and the emails as well as the booking (ADR-007 option C, ADR-008); `PRIVACY_NOTICE_VERSION` is bumped with this text." Both stay part of the legal review (US-018).

---

## Part L — The resource library withdrawn

**Moved by US-046, after Part H** (US-043 removes the Home teaser's library links first). Gaby: one free resource, the calculator (brief §1 point 1).

### L.1 Removed

- **§7** (all of 7.1, 7.2 and 7.3) and the resource data file. The heading stays with one line: "## 7. Free resources — withdrawn in phase 2d (US-046): the calculator (§11) is the site's only free resource."
- `meta.resources.*` (§1), `nav.resources` if Part V has not removed it, `cta.all_resources` and `vip_band.short_title` (§4), and `calc.result.secondary` (§11) if Part C has not removed it.
- The §4 note's sentence "the resource library uses `vip_band.short_title`".
- In the Metadata: the resource cards from the placeholders and the provisional blocks, and `resources.filter.label`, `resources.empty`, `resource.pending`, `resource.email.coming_soon` and `resource.cover_alt` from the no-badge list.

### L.2 Changed

| Key | Español | English | Status |
|---|---|---|---|
| `story.resources_link` | O empezá gratis: calculá tus meses de libertad | Or start free: calculate your months of freedom | provisional |
| `thanks.not_ready.body` | Es posible que te contactemos por correo electrónico o WhatsApp. Cuando sea tu momento, aquí estaremos. Mientras tanto, podés empezar gratis: descubrí cuántos meses podrías sostenerte hoy. | We may reach out by email or WhatsApp. When the time is right for you, we'll be here. In the meantime, you can start for free: find out how many months you could sustain yourself today. | provisional |
| `thanks.not_ready.more` | = `home.hero.secondary` | = `home.hero.secondary` | approved |

- `cta.start_free` is **removed**; `story.resources_link` gets its own value and links to the calculator (US-046 AC2). The key keeps its name so the My story code does not move.
- The not-ready screen shows the blue `thanks.not_ready.more` button to the calculator, not the mini-course card (`UX_UI_DIRECTION.md` §6.4); the note under §8.5 becomes "Below `thanks.not_ready.body`, the blue `thanks.not_ready.more` button leads to the calculator (§11)."

---

## Flags for Gaby

For the owner to send with the next message to Gaby; none blocks Sprint 005 (the rows above are what ships until she answers).

1. **Two slips against her own voseo rule, corrected:** "Tu libertad depende de un puesto que no **controlas**" → "controlás" (Home, stakes); "**Aplica**" → "Aplicá" (Home, closing step 1); "para vivir como **vives** hoy" → "vivís" (calculator, first question).
2. **Gender-neutral wording (project rule BR-005), three lines adapted, provisional until she confirms:** "Querés hacerte **rico** rápido o aprender trading." → "Querés enriquecerte rápido o aprender trading."; "No estás **dispuesto** a cambiar hábitos con tu dinero." → "No tenés la disposición de cambiar hábitos con tu dinero."; "Al terminar seguís **acompañado** por otras personas…" → "Al terminar seguís en compañía de otras personas…".
3. **"Norte" or "norte":** the Home's closing step says "Definimos tu **Norte**" and the Wealth Mastery page "Definimos tu **norte**"; both pages show the same steps, so one spelling is used, the Home's capital N, until she chooses.
4. **The problem section:** her final Home brings back "Cada vez más cosas dependen de vos, y" that she had called redundant in November; her final text is used.
5. **The number of people mentored** ("[X]" in her Home) stays "200+" (from gabykelly.com today), provisional until she confirms it.
6. **The narrow header button** reads "Aplicá" on phones, because "Aplicá a Wealth Mastery" does not fit there.
7. **The FAQ answers** carry the "pending validation" badge until she confirms them (her note).
8. **The English** of all the new text is the team's translation, provisional until she reviews it.
