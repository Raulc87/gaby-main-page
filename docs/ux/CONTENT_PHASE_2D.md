# CONTENT — phase 2d copy (staged)

The phase 2d copy: Gaby's final content of 2026-11-23 ([`BRIEF_2026-11-23_WEALTH_MASTERY.md`](BRIEF_2026-11-23_WEALTH_MASTERY.md)), written as [`CONTENT.md`](CONTENT.md) rows, ready to move. It is staged here, not in `CONTENT.md`, because the unit tests check the code against `CONTENT.md`: each Sprint 005 story moves **its part** into `CONTENT.md` in the same PR as its code, and deletes that part from this file. The story that moves the last part deletes this file and the references to it.

Same rules as `CONTENT.md` (its Metadata): the row format is the same (`| key | Español | English | Status |`), values are verbatim and never contain markers, `*text*` marks the italic part of a heading, `= key` points at another key, and **every English value is provisional** until Gaby validates the English as a whole.

## Parts and who moves them

| Part | What | Moved by |
|---|---|---|
| [V](#part-v--voseo-the-wealth-mastery-name-and-the-new-menu) | Voseo and the Wealth Mastery name in every existing key that stays or that a later story replaces (§1–§6, §8, §9, §11), the new menu keys, the `mastery` stub's metadata, and the check list of "tú" forms for the US-041 AC1 test | US-041 |
| [H](#part-h--home-the-three-pillars-and-no-library-links) | Home: the Método Polaris as three pillars (§5.6), the Wealth Mastery section removed (§5.7), the teaser's library links removed (§5.10) | US-043 |
| [W](#part-w--the-wealth-mastery-page) | The Wealth Mastery page (it replaces §12, the Método Polaris page) | US-042 |
| [P](#part-p--privacy-notice-gohighlevel) | §9, `privacy.p2` and `privacy.p4`: GoHighLevel as the processor of the contacts and the emails | US-045 |
| [L](#part-l--the-resource-library-withdrawn) | §7 withdrawn, and every key that pointed at the library; **after Part H** | US-046 |

Rules for the moves:

- **Part V goes first** (US-041 merges first in Sprint 005). It also gives interim voseo to keys that Parts H, W, C, P and L later replace or remove, so the site is in voseo from the first merge and the AC1 test passes; each later part replaces those rows with its own.
- **No part depends on another part's move**, except on Part V, and **Part L, which moves after Part H**: until Part H, the Home's calculator teaser shows `home.calculator.more` and the titles of two resources from the data file Part L deletes (the same order as `docs/sprints/SPRINT_005.md`: `GK-046` after `GK-043`). Where two parts show the same text (the pillars on the Home and on the Wealth Mastery page), each writes it out in full; aliases (`= key`) point only at keys already in `CONTENT.md` after Part V.
- **Status.** `approved`: Gaby's Spanish, verbatim from the brief, or an approved value changed only by her two rules (voseo, the programme's name). `provisional`: proposed by the team, shown with the pending badge where `CONTENT.md` Metadata says so. Each part updates the Metadata's badge lists as its notes say.
- **Section numbers stay.** A section that is withdrawn keeps its heading with one line saying so, so references to other sections keep working.
- Gaby's few slips against her own rules are corrected here and listed for her in [Flags for Gaby](#flags-for-gaby).

---

## Part V — Voseo, the Wealth Mastery name and the new menu

**Moved by US-041** ([`USER_STORIES.md`](../specs/USER_STORIES.md) US-041). Each row below **replaces** the row with the same key in `CONTENT.md`, or is **new** where marked. Keys not listed keep their values: they have no "tú" form (first-person, neutral or conditional text such as "podrías sostenerte" reads the same in voseo).

US-041 also sets `CONTENT.md` Metadata to version 0.3, replaces its phase 2c line with "Phase 2d: staged in `CONTENT_PHASE_2D.md`", and removes `home.ladder.p2` from the provisional blocks (it is Gaby's text now).

### V.1 Check list of "tú" forms (US-041 AC1)

The unit test fails if any Spanish string in `src/i18n/es/` contains one of these, matched **case-insensitively, as whole words, accent-sensitively** (so "puedes" fails and "podés" passes; "aplica a" fails and "Aplicá a" passes). Whole words must treat accented letters as letters (in JavaScript, a Unicode-aware look-around such as `(?<!\p{L})…(?!\p{L})` with the `u` flag; `\b` is ASCII-only). Each entry is a form the current copy uses, or a common one that has no voseo reading:

- pronouns: `tú`, `ti` (as in "para ti", "sin ti"), `contigo`, `usted`, `ustedes`;
- present: `quieres`, `tienes`, `puedes`, `sabes`, `sientes`, `eres`, `gastas`, `inviertes`, `decides`, `aprendes`, `entiendes`, `conviertes`, `ordenas`, `inflas`, `construyes`, `vives`, `buscas`, `necesitas`, `prefieres`, `descubres`, `recibes`, `deseas`, `usas`, `escribes`, `calificas`, `aceptas`;
- subjunctive: `trabajes`, `incluyas`;
- imperative, as **phrases** (a bare imperative such as "incluye" or "trabaja" is also the third person, as in Gaby's "No incluye impuestos"): `aplica a`, `calcula tus`, `calcúlalo`, `define tu`, `descubre cuánto`, `descubre qué`, `escribe tu`, `escribe un`, `escribe el`, `escribe 0`, `escríbenos`, `inténtalo`, `déjanos`, `lee mi`, `llena la`, `llena una`, `mira el`, `ordena tu`, `convierte los`, `invierte y`, `usa la`, `usa solo`, `incluye el`, `selecciona una`, `conoce la`, `imagina saber`, `espera unos`, `trabaja directamente`, `organiza tus`, `reparte tu`, `agenda tu`, `empieza gratis`;
- perfect, as a phrase (`has` alone is ambiguous): `has construido`.

Checked when this file was written: every Spanish string in `src/i18n/es/` that matches the list has its voseo row in this part, and no Spanish value in this file matches it.

Deliberately **not** in the list, because the same spelling is correct in voseo or is another word: `estás`, `ganas` (noun), `cuentas` (noun), `agenda` alone (noun), `tu` (possessive), bare imperatives (the third person), and preterites such as `escribiste`, `ganaste`, `subiste` (the same in voseo).

### V.2 Site metadata (§1)

| Key | Español | English | Status |
|---|---|---|---|
| `meta.home.description` | Mentoría financiera para ejecutivos y profesionales corporativos: ordená tu dinero, convertí los beneficios de tu carrera en capital e invertí para construir patrimonio. | Financial mentorship for corporate executives and professionals: organize your money, turn your career's benefits into capital and invest to build wealth. | provisional |
| `meta.vip.title` | Aplicá a Wealth Mastery — Gaby Kelly | Apply to Wealth Mastery — Gaby Kelly | provisional |
| `meta.vip.description` | Aplicá para trabajar directamente con Gaby y agendá tu llamada inicial sin costo. | Apply to work directly with Gaby and book your free initial call. | provisional |
| `meta.calculator.description` | Diagnóstico gratis en 3 minutos: descubrí cuánto tiempo te da hoy tu dinero sin tu salario. | A free 3-minute diagnosis: find out how long your money would last today without your salary. | provisional |
| `meta.mastery.title` | Wealth Mastery — Gaby Kelly | Wealth Mastery — Gaby Kelly | provisional |
| `meta.mastery.description` | Mentoría individual para ejecutivos y profesionales del mundo corporativo: convertí tu salario en patrimonio con el Método Polaris. | One-to-one mentorship for corporate executives and professionals: turn your salary into wealth with the Polaris Method. | provisional |
| `meta.method.description` | Los tres pasos del Método Polaris para que tu salario trabaje para vos. | The three steps of the Polaris Method so your salary works for you. | provisional |
| `meta.resources.description` | Guías, plantillas y minicursos gratuitos para ordenar, invertir y crecer. | Free guides, templates and mini-courses to organize, invest and grow. | provisional |

`meta.mastery.*` is **new** (the stub page of the `mastery` route, US-041 AC5; US-042 fills the page). `meta.method.description` is interim (Part W removes it with the page); `meta.resources.description` is unchanged and listed only to say so (Part L removes it).

### V.3 Header and navigation (§2)

| Key | Español | English | Status |
|---|---|---|---|
| `nav.mastery` | Wealth Mastery | Wealth Mastery | approved |
| `nav.diagnosis` | Diagnóstico gratis | Free diagnosis | approved |
| `nav.vip` | Aplicá a Wealth Mastery | Apply to Wealth Mastery | approved |
| `nav.vip_short` | Aplicá | Apply | provisional |

`nav.mastery` and `nav.diagnosis` are **new**; `nav.method` and `nav.resources` are **removed** (the header no longer links to the Método Polaris page or the library). The note under the §2 table becomes: "`nav.blog` is not shown until US-026. `nav.mastery` links to the Wealth Mastery page (§12), `nav.diagnosis` to the calculator (§11). `nav.vip` is Gaby's header button (2026-11-23); below 1024 px the header shows `nav.vip_short`, which fits next to the menu button." `nav.vip_short` is the team's: "Aplicá a Wealth Mastery" does not fit beside the wordmark and the menu button at 390 px (the same reason as phase 2c's "Mentoría VIP"); it is the narrow-width label of the same button, not a different one.

### V.4 Shared calls to action and the VIP band (§4)

| Key | Español | English | Status |
|---|---|---|---|
| `cta.vip_long` | Trabajá directamente con Gaby · Wealth Mastery | Work directly with Gaby · Wealth Mastery | approved |
| `cta.vip_apply` | Aplicá a Wealth Mastery | Apply to Wealth Mastery | approved |
| `cta.start_free` | O empezá gratis con los recursos | Or start free with the resources | approved |
| `cta.read_story` | Leé mi historia completa | Read my full story | approved |
| `vip_band.eyebrow` | Mentoría Wealth Mastery | Wealth Mastery Mentorship | approved |
| `vip_band.title` | ¿Querés trabajar *directamente conmigo*? | Do you want to work *directly with me*? | approved |
| `vip_band.body` | Imaginá saber exactamente con cuánto contás, tener tu dinero trabajando a tu favor y decidir sobre tu carrera desde la libertad, no desde la necesidad. Y, cuando estés con tu familia, estar ahí de verdad. Llená una breve aplicación y agendá tu llamada inicial. | Imagine knowing exactly what you have, having your money work for you, and making career decisions from freedom, not necessity. And when you're with your family, truly being there. Fill in a short application and book your initial call. | approved |
| `vip_band.short_title` | ¿Preferís un plan hecho a tu medida? *Trabajá directamente con Gaby.* | Would you prefer a plan made for you? *Work directly with Gaby.* | approved |

`cta.start_free` and `vip_band.short_title` are interim (Part L replaces or removes them with the library). `vip_band.eyebrow`, `cta.vip_apply` and `cta.read_story` are Gaby's own words (brief §2, §3).

### V.5 Home (§5)

Gaby's adjusted Home (brief §3), verbatim. The pillars (§5.6), the Wealth Mastery section (§5.7) and the teaser's links (§5.10) are Part H; the rows of §5.6 and §5.7 below are interim voseo until Part H.

| Key | Español | English | Status |
|---|---|---|---|
| `home.hero.title` | Ganás bien, pero tu dinero *no te está dando tranquilidad.* | You earn well, but your money *isn't giving you peace of mind.* | approved |
| `home.hero.lead` | Te acompaño a ordenar tu dinero, convertir los beneficios de tu carrera en capital e invertir para construir patrimonio y libertad, sin tener que renunciar a lo que ya construiste. | I help you organize your money, turn your career's benefits into capital, and invest to build wealth and freedom, without giving up what you've already built. | approved |
| `home.hero.cta` | Aplicá a Wealth Mastery | Apply to Wealth Mastery | approved |
| `home.hero.secondary` | Calculá tus meses de libertad gratis | Calculate your months of freedom for free | approved |
| `home.ladder.p2` | Pero aunque trabajés desde casa, tu mente no está ahí. Está en la cuota, en el equipo, en la próxima reunión. Cada vez más cosas dependen de vos, y sentís que *todo depende de vos*. | But even when you work from home, your mind isn't there. It's on the quota, the team, the next meeting. More and more depends on you, and you feel that *everything depends on you*. | approved |
| `home.stakes.1.title` | Tenés un gran currículum, pero no patrimonio. | You have a great résumé, but no wealth. | approved |
| `home.stakes.2.title` | Tu libertad depende de un puesto que no controlás. | Your freedom depends on a position you don't control. | approved |
| `home.stakes.3.title` | Los años con tu familia pasan sin vos. | The years with your family go by without you. | approved |
| `home.stakes.closing` | No tiene que ser así. Y no tenés que descubrirlo tan tarde como yo. | It doesn't have to be this way. And you don't have to find out as late as I did. | approved |
| `home.stakes.cta` | ¿Cuántos meses podrías sostenerte vos? Calculalo gratis | How many months could you sustain yourself? Calculate it for free | approved |
| `home.story.title` | Yo estuve donde *estás vos.* | I was where *you are.* | approved |
| `home.opportunity.eyebrow` | La oportunidad que tenés en las manos | The opportunity in your hands | approved |
| `home.opportunity.lead` | Trabajar en una transnacional o una gran corporación te da beneficios que casi nadie aprovecha. Si no inflás tu estilo de vida, se convierten en capital para invertir. | Working at a multinational or a large corporation gives you benefits almost no one takes advantage of. If you don't inflate your lifestyle, they become capital to invest. | approved |
| `home.opportunity.6.body` | Una red que vale oro cuando construís algo propio. | A network worth gold when you build something of your own. | approved |
| `home.method.title` | Tres pasos para que tu salario *trabaje para vos.* | Three steps so your salary *works for you.* | approved |
| `home.method.1.title` | Definí tu Norte | Define your North | provisional |
| `home.method.1.body` | Claridad sobre lo que querés y sobre tu relación con el dinero. | Clarity about what you want and about your relationship with money. | provisional |
| `home.method.2.title` | Ordená tu dinero | Organize your money | provisional |
| `home.method.3.title` | Invertí y construí patrimonio | Invest and build wealth | provisional |
| `home.method.3.body` | Decisiones conscientes, alineadas con la vida que querés. | Deliberate decisions, aligned with the life you want. | provisional |
| `home.mastery.title` | Lo que aprendés *en la mentoría.* | What you learn *in the mentorship.* | approved |
| `home.mastery.lead` | No es teoría: es lo mismo que aplico en mi propio portafolio desde hace más de 10 años, explicado para que vos lo podás entender, evaluar y decidir. | It isn't theory: it's what I've applied in my own portfolio for more than 10 years, explained so you can understand it, evaluate it and decide. | approved |
| `home.mastery.1.body` | Claridad sobre la vida que querés y las creencias que hoy te frenan. | Clarity about the life you want and the beliefs holding you back today. | provisional |
| `home.mastery.2.body` | Ordenás cada ingreso y cada beneficio con un propósito. | You give every income and every benefit a purpose. | provisional |
| `home.mastery.3.body` | Convertís lo que tu empresa ya te da en capital para invertir. | You turn what your company already gives you into capital to invest. | provisional |
| `home.mastery.4.body` | Entendés cómo funcionan los mercados y cómo evaluar una inversión. | You understand how markets work and how to evaluate an investment. | provisional |
| `home.mastery.7.body` | Entendés cómo funciona y cómo pensarla con criterio y sin euforia. | You understand how it works and how to think about it with judgment and without euphoria. | provisional |
| `home.calculator.lead` | Cinco datos y descubrís cuánto tiempo te da hoy tu dinero sin tu salario. | Five figures and you find out how long your money would last today without your salary. | approved |
| `home.calculator.receive` | Recibís tu resultado y tu zona al instante. | You get your result and your zone right away. | provisional |
| `home.calculator.receive_with_guide` | Recibís tu resultado, tu zona y la guía "Cómo empezar a invertir siendo ejecutivo". | You get your result, your zone and the guide "How to start investing as an executive". | approved |
| `home.change.before.2` | No sabés cuántos meses podrías sostenerte | You don't know how many months you could sustain yourself | approved |
| `home.change.before.4` | Invertís poco, tarde o con miedo | You invest little, late, or with fear | approved |
| `home.change.after.2` | Sabés exactamente con cuánto contás | You know exactly what you have | approved |
| `home.change.after.4` | Invertís con un plan y con claridad | You invest with a plan and with clarity | approved |
| `home.change.after.5` | Decidís sobre tu carrera desde la libertad, y estás presente de verdad | You make career decisions from freedom, and you're truly present | approved |
| `home.vip.body` | Imaginá saber exactamente con cuánto contás, tener tu dinero trabajando a tu favor y, cuando estés con tu familia, estar ahí de verdad. | Imagine knowing exactly what you have, having your money work for you and, when you're with your family, truly being there. | approved |
| `home.vip.step.1.title` | Aplicá | Apply | approved |
| `home.vip.step.2.body` | Vemos dónde estás y si Wealth Mastery es para vos. | We look at where you are and whether Wealth Mastery is for you. | approved |

Notes:

- `home.ladder.p2`: Gaby's final Home keeps the sentence "Cada vez más cosas dependen de vos" that phase 2c dropped as redundant, and marks the section "se mantiene"; her final text is used, so the row is `approved` and leaves the provisional list. The note under §5.2 drops its first sentence.
- `home.stakes.cta`: Gaby's "Calculalo gratis ?" ends with an arrow lost in her file's encoding (brief §7); the arrow is drawn by the link style, as before.
- `home.stakes.2.title` and `home.vip.step.1.title` correct two slips in her text ("controlas", "Aplica"): see the flags.
- `home.method.*` and `home.mastery.*` rows are interim; Part H replaces the first and removes the second.

### V.6 My story (§6)

No change in this part: `story.p1` to `story.p3` are first person, and `story.resources_link` (= `cta.start_free`) follows V.4 until Part L.

### V.7 The application page (§8)

The page moves to `/es/aplicar/` and `/en/apply/` (US-041 AC4); the §8 heading becomes "## 8. Wealth Mastery application (`/es/aplicar/`, `/en/apply/`)". Labels, options and the consent are first person or neutral and keep their values.

| Key | Español | English | Status |
|---|---|---|---|
| `vip.eyebrow` | = `vip_band.eyebrow` | = `vip_band.eyebrow` | approved |
| `vip.title` | ¿Querés trabajar *directamente conmigo*? | Do you want to work *directly with me*? | approved |
| `vip.steps.1` | Llená la aplicación | Fill in the application | provisional |
| `vip.steps.2` | Mirá el video de Gaby | Watch Gaby's video | provisional |
| `vip.steps.3` | Agendá tu llamada inicial (si calificás) | Book your initial call (if you qualify) | provisional |
| `vip.video.title` | Conocé Wealth Mastery | Get to know Wealth Mastery | provisional |
| `form.title` | Aplicá a Wealth Mastery | Apply to Wealth Mastery | approved |
| `form.name.hint` | Escribí tu nombre y apellido(s). | Enter your first and last name. | approved |
| `form.phone.hint` | Incluí el código de país. Ejemplo: +50684104791 | Include your country code. Example: +50684104791 | approved |
| `form.screening.prompt` | Si este programa encaja con lo que buscás, ¿cuál es tu disposición para invertir en mejorar tu salud financiera? | If this program fits what you're looking for, how willing are you to invest in improving your financial health? | approved |
| `form.error.invalid_characters` | Usá solo letras, espacios, apóstrofos, guiones o puntos. | Use only letters, spaces, apostrophes, hyphens, or periods. | approved |
| `form.error.full_name_required` | Escribí tu nombre completo: nombre y al menos un apellido. | Please enter your full name: first name and at least one last name. | approved |
| `form.error.invalid_format.email` | Escribí un correo válido, por ejemplo nombre@dominio.com. | Enter a valid email, for example name@domain.com. | approved |
| `form.error.invalid_format.phone` | Escribí el número con código de país, por ejemplo +50684104791. | Enter the number with country code, for example +50684104791. | approved |
| `form.error.invalid_option` | Elegí una opción. | Please select an option. | approved |
| `form.error.submission` | No pudimos guardar tu información. Por favor, intentalo de nuevo en unos minutos. Si el problema continúa, escribinos a {contact_email}. | We couldn't save your information. Please try again in a few minutes. If the problem continues, email us at {contact_email}. | approved |
| `form.error.rate_limited` | Recibimos varios intentos seguidos desde tu conexión. Por favor, esperá unos minutos e intentalo de nuevo. Si lo preferís, escribinos a {contact_email}. | We received several attempts in a row from your connection. Please wait a few minutes and try again. If you prefer, email us at {contact_email}. | approved |
| `thanks.qualified.body` | Es posible que te contactemos por correo electrónico o WhatsApp. Si lo deseás, podés agendar ahora tu llamada inicial: | We may reach out by email or WhatsApp. If you'd like, you can book your initial call now: | approved |
| `thanks.scheduler_fallback` | No pudimos cargar el calendario. Escribinos a {contact_email} y coordinamos tu llamada. | We couldn't load the calendar. Email us at {contact_email} and we'll arrange your call. | approved |
| `thanks.not_ready.body` | Es posible que te contactemos por correo electrónico o WhatsApp. Cuando sea tu momento, aquí estaremos. Mientras tanto, podés empezar gratis con el minicurso: | We may reach out by email or WhatsApp. When the time is right for you, we'll be here. In the meantime, you can start for free with the mini-course: | provisional |

`form.error.invalid_option` uses Gaby's "Elegí una opción" (her calculator's wording) instead of "Seleccioná una opción". `vip.video.title` names the programme instead of "la mentoría". `thanks.not_ready.body` is interim (Part L points it at the calculator).

### V.8 Privacy notice (§9)

Voseo and the programme's name only; what is collected, why and with whom does not change here (Part P changes that).

| Key | Español | English | Status |
|---|---|---|---|
| `privacy.p2` | Datos que recopilamos: nombre completo, correo electrónico, teléfono (WhatsApp), tu respuesta a la pregunta de preselección, el idioma en el que ves el sitio, y la fecha y hora de tu envío. Si usás la calculadora, guardamos tu nombre, tu correo, tu WhatsApp si lo das, tu resultado (meses y zona), si aceptaste recibir los correos de Gaby, el idioma y la fecha y hora; las cifras que escribís en la calculadora no se guardan. | Data we collect: full name, email, phone (WhatsApp), your pre-screening answer, the language you viewed the site in, and the date and time of your submission. If you use the calculator, we store your name, your email, your WhatsApp if you give it, your result (months and zone), whether you agreed to receive Gaby's emails, the language, and the date and time; the figures you enter in the calculator are not stored. | provisional |
| `privacy.p3` | Para qué los usamos: para contactarte sobre la llamada inicial y Wealth Mastery, para priorizar las llamadas y, si usás la calculadora, para mostrarte tu resultado y enviártelo por correo con la guía y, solo si lo aceptás, enviarte los correos de Gaby, de los que podés darte de baja en cualquier momento. No los usamos para ningún otro fin ni los vendemos. | Purpose: to contact you about the initial call and Wealth Mastery, to prioritize calls and, if you use the calculator, to show you your result and email it to you with the guide and, only if you agree, to send you Gaby's emails, which you can unsubscribe from at any time. We do not use it for any other purpose and do not sell it. | provisional |
| `privacy.p6` | Tus derechos: podés solicitar acceso, rectificación, cancelación (eliminación) u oposición al tratamiento de tus datos escribiendo a {contact_email}. | Your rights: you can request access, rectification, cancellation (deletion), or opposition to the processing of your data by emailing {contact_email}. | provisional |

**No `PRIVACY_NOTICE_VERSION` bump in US-041** (proposed in this PR): these are wording changes only, the notice is still a DRAFT, and nothing public stores data. US-045 bumps the version once for phase 2d with Part P, which changes the substance.

### V.9 Calculator (§11), interim

The current calculator stays until US-044; these rows give its strings voseo. Part C replaces all of §11.

| Key | Español | English | Status |
|---|---|---|---|
| `calc.lead` | Cinco datos sobre tu dinero hoy. Usá la misma moneda en todos. | Five figures about your money today. Use the same currency for all of them. | provisional |
| `calc.expenses.hint` | Lo que gastás en un mes normal: vivienda, comida, servicios, transporte, educación. | What you spend in a normal month: housing, food, utilities, transport, education. | provisional |
| `calc.debt.hint` | Tarjetas, préstamos y otras cuotas. Si no tenés, escribí 0. | Cards, loans and other installments. If you have none, enter 0. | provisional |
| `calc.investments.hint` | Acciones, fondos o ETFs. No incluyás tu casa ni tu pensión. Si no tenés, escribí 0. | Stocks, funds or ETFs. Don't include your home or your pension. If you have none, enter 0. | provisional |
| `calc.other_income.hint` | Alquileres, un negocio propio u otros ingresos que seguirían si dejaras tu puesto. Si no tenés, escribí 0. | Rent, a business of your own or other income that would continue if you left your position. If you have none, enter 0. | provisional |
| `calc.error.number` | Escribí un número igual o mayor que 0. | Enter a number of 0 or more. | provisional |
| `calc.capture.body` | Dejanos tus datos para verlo. | Leave us your details to see it. | provisional |
| `calc.zone.freedom.body` | 12 meses o más. Tenés margen para decidir sobre tu carrera desde la libertad. | 12 months or more. You have room to make career decisions from freedom. | provisional |

### V.10 Resource library (§7), interim

The library is unlinked from the header after US-041 but its page exists until US-046, so its strings get voseo too.

| Key | Español | English | Status |
|---|---|---|---|
| `resources.lead` | Guías, plantillas y minicursos que podés usar hoy. Algunos se descargan directo; otros te llegan al correo. | Guides, templates and mini-courses you can use today. Some download directly; others arrive in your inbox. | approved |

In the §7.3 list (the data file `src/data/resources.ts`), the descriptions become: `guide-corporate-benefits` "Convertí los beneficios de tu carrera en capital para invertir."; `template-debt` "Organizá tus deudas y definí el orden para pagarlas."; `guide-investing` "Primeros pasos para que tu salario trabaje para vos."; `template-budget` "Repartí tu ingreso en billeteras con propósito."; `diagnostic-benefits` "Descubrí cuánto valen hoy los beneficios de tu empresa y cómo convertirlos en capital."; `diagnostic-investor` "Descubrí qué tipo de inversionista sos hoy y por dónde empezar." (English unchanged; all still provisional.)

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

## Part W — The Wealth Mastery page

**Moved by US-042.** Gaby's page (brief §2), verbatim, as `CONTENT.md` **§12, replacing the Método Polaris page**. The new heading is "## 12. Wealth Mastery page (`/es/wealth-mastery/`, `/en/wealth-mastery/`)". US-042 removes the old §12 rows (`method.*`) and `meta.method.*` from §1; the `mastery` route's metadata is already in §1 (Part V).

The pillars repeat the Home's (Part H) in full, so this part does not depend on Part H's move.

### W.1 Hero

| Key | Español | English | Status |
|---|---|---|---|
| `mastery.eyebrow` | = `vip_band.eyebrow` | = `vip_band.eyebrow` | approved |
| `mastery.title` | Convertí tu salario en patrimonio, *con un sistema y conmigo a tu lado.* | Turn your salary into wealth, *with a system and with me by your side.* | approved |
| `mastery.lead` | Una mentoría individual para ejecutivos y profesionales del mundo corporativo que ganan bien y quieren que su dinero les dé tranquilidad y libertad. Trabajamos con el Método Polaris, el mismo que aplico en mi propio portafolio desde hace más de 10 años. | One-to-one mentorship for corporate executives and professionals who earn well and want their money to give them peace of mind and freedom. We work with the Polaris Method, the same one I've applied in my own portfolio for more than 10 years. | approved |
| `mastery.cta` | = `cta.vip_apply` | = `cta.vip_apply` | approved |
| `mastery.secondary` | = `home.hero.secondary` | = `home.hero.secondary` | approved |

### W.2 Is it for you? (`#para-vos`)

| Key | Español | English | Status |
|---|---|---|---|
| `mastery.fit.title` | ¿Es para vos? | Is it for you? | approved |
| `mastery.fit.yes.title` | Es para vos si… | It's for you if… | approved |
| `mastery.fit.yes.1` | Ganás bien, subiste de puesto y aun así sentís que tu dinero no avanza. | You earn well, you've been promoted, and you still feel your money isn't moving forward. | approved |
| `mastery.fit.yes.2` | Tenés beneficios corporativos que no estás aprovechando. | You have corporate benefits you aren't making the most of. | approved |
| `mastery.fit.yes.3` | Querés invertir, pero no sabés por dónde empezar o te da miedo equivocarte. | You want to invest, but you don't know where to start or you're afraid of getting it wrong. | approved |
| `mastery.fit.yes.4` | Gran parte de tus ahorros está en la acción de tu propia empresa. | A large part of your savings is in your own company's stock. | approved |
| `mastery.fit.yes.5` | Querés decidir sobre tu carrera desde la libertad, no desde la necesidad. | You want to make career decisions from freedom, not necessity. | approved |
| `mastery.fit.no.title` | No es para vos si… | It's not for you if… | approved |
| `mastery.fit.no.1` | Buscás que alguien invierta por vos o te diga qué comprar. | You want someone to invest for you or tell you what to buy. | approved |
| `mastery.fit.no.2` | Querés enriquecerte rápido o aprender trading. | You want to get rich quick or learn trading. | provisional |
| `mastery.fit.no.3` | No tenés la disposición de cambiar hábitos con tu dinero. | You aren't willing to change your habits with money. | provisional |

`mastery.fit.no.2` and `.no.3` adapt Gaby's "Querés hacerte rico rápido…" and "No estás dispuesto a cambiar hábitos…" to gender-neutral wording (BR-005); provisional until she confirms (see the flags).

### W.3 The Método Polaris (`#metodo`)

| Key | Español | English | Status |
|---|---|---|---|
| `mastery.method.eyebrow` | = `home.method.eyebrow` | = `home.method.eyebrow` | approved |
| `mastery.method.title` | Un norte claro para tu dinero, *en tres pilares.* | A clear north for your money, *in three pillars.* | approved |
| `mastery.method.lead` | Polaris es la Estrella Polar: tu norte, el que guía el camino. El método nació de mi propio portafolio y del patrimonio que construyo con mi familia: no es teoría, es lo que aplico y lo que me funcionó, ordenado para que vos lo podás aplicar. | Polaris is the North Star: your north, the one that guides the way. The method was born from my own portfolio and the wealth I'm building with my family: it isn't theory, it's what I apply and what worked for me, organized so you can apply it. | approved |
| `mastery.method.1.label` | Mentalidad Millonaria | Millionaire Mindset | approved |
| `mastery.method.1.title` | Mentalidad | Mindset | approved |
| `mastery.method.1.point.1` | Las creencias sobre el dinero que heredaste y que hoy te frenan. | The beliefs about money you inherited that hold you back today. | approved |
| `mastery.method.1.point.2` | Tus patrones con el dinero, con evaluaciones de psicología financiera. | Your patterns with money, with financial psychology assessments. | approved |
| `mastery.method.1.point.3` | Tu norte: la vida que querés construir y para qué. | Your north: the life you want to build, and why. | approved |
| `mastery.method.2.label` | Administración del Dinero | Money Management | approved |
| `mastery.method.2.title` | Administración | Management | approved |
| `mastery.method.2.point.1` | Tu sistema de billeteras: cada ingreso se reparte con un propósito apenas entra. | Your wallet system: every income is split with a purpose as soon as it comes in. | approved |
| `mastery.method.2.point.2` | Tu billetera de confianza y tu protección: seguros médicos, de vida y de casa. | Your safety wallet and your protection: health, life and home insurance. | approved |
| `mastery.method.2.point.3` | Tus beneficios corporativos (aumentos, solidarista, allowances) convertidos en capital. | Your corporate benefits (raises, solidarity association, allowances) turned into capital. | approved |
| `mastery.method.3.label` | Inversiones e Ingresos Pasivos | Investments and Passive Income | approved |
| `mastery.method.3.title` | Inversión | Investing | approved |
| `mastery.method.3.point.1` | Bolsa y ETFs: un portafolio simple y global, con aportes mensuales y sin trading. | Stocks and ETFs: a simple, global portfolio, with monthly contributions and no trading. | approved |
| `mastery.method.3.point.2` | Bienes raíces: analizar una propiedad como inversión, no como gasto. | Real estate: analyzing a property as an investment, not an expense. | approved |
| `mastery.method.3.point.3` | Oro, plata y cripto: qué papel juegan y cómo guardarlos de forma segura. | Gold, silver and crypto: the role they play and how to store them safely. | approved |
| `mastery.method.parallel.title` | En paralelo, no en orden | In parallel, not in order | approved |
| `mastery.method.parallel.body` | No tenés que pagar todas tus deudas antes de empezar a invertir. Con cada salario avanzás en los tres pilares al mismo tiempo: así se crea el hábito y tu patrimonio empieza a crecer desde ya. | You don't have to pay off all your debts before you start investing. With every paycheck you move forward in all three pillars at the same time: that's how the habit forms and your wealth starts growing right away. | approved |

No numbers and no arrows between the pillars, and the wallet system is only named, never detailed (Gaby's note, brief §2).

### W.4 How it works (`#como-funciona`)

| Key | Español | English | Status |
|---|---|---|---|
| `mastery.how.title` | Cómo funciona. | How it works. | approved |
| `mastery.how.1.title` | Programa de 3 meses | A 3-month programme | approved |
| `mastery.how.1.body` | Tres meses para dejar tu sistema funcionando en los tres pilares. | Three months to get your system working in all three pillars. | approved |
| `mastery.how.2.title` | Sesiones 1 a 1 conmigo | One-to-one sessions with me | approved |
| `mastery.how.2.body` | Por videollamada, cada 15 días. Trabajamos con tus números y tu situación real. | By video call, every 15 days. We work with your numbers and your real situation. | approved |
| `mastery.how.3.title` | Biblioteca de contenido | Content library | approved |
| `mastery.how.3.body` | Acceso a mis cursos y materiales para repasar a tu ritmo entre sesiones. | Access to my courses and materials to review at your own pace between sessions. | approved |
| `mastery.how.4.title` | Comunidad de graduados | Graduate community | approved |
| `mastery.how.4.body` | Al terminar seguís en compañía de otras personas que también están construyendo su libertad. | When you finish, you stay in the company of other people who are also building their freedom. | provisional |

`mastery.how.4.body` adapts "seguís acompañado" to gender-neutral wording (BR-005), provisional until Gaby confirms. No prices (Gaby's note).

### W.5 Who guides you (`#guia`)

| Key | Español | English | Status |
|---|---|---|---|
| `mastery.guide.eyebrow` | Quién te guía | Who guides you | approved |
| `mastery.guide.title` | Soy Gaby Kelly. | I'm Gaby Kelly. | approved |
| `mastery.guide.p1` | Pasé 18 años en el mundo corporativo, con partners de Intel, Microsoft y Oracle. Hoy invierto desde hace más de 10 años y administro el patrimonio de mi familia con el mismo método que te enseño. | I spent 18 years in the corporate world, with Intel, Microsoft and Oracle partners. I've been investing for more than 10 years and I manage my family's wealth with the same method I teach you. | approved |
| `mastery.guide.p2` | Soy inversora y mentora, no asesora financiera: no te digo qué comprar. Te enseño a entender, evaluar y decidir, para que tu dinero trabaje para vos. | I'm an investor and mentor, not a financial advisor: I don't tell you what to buy. I teach you to understand, evaluate and decide, so your money works for you. | approved |
| `mastery.guide.photo.placeholder` | Foto de Gaby | Photo of Gaby | provisional |
| `mastery.guide.photo_alt` | Gaby Kelly | Gaby Kelly | provisional |
| `mastery.guide.cta` | = `cta.read_story` | = `cta.read_story` | approved |

The photo is a different one from the Home's portrait (Gaby's note); until it arrives the frame shows `mastery.guide.photo.placeholder` with the pending badge in every build (BR-011).

### W.6 Testimonials (`#testimonios`)

| Key | Español | English | Status |
|---|---|---|---|
| `mastery.testimonials.title` | = `home.testimonials.title` | = `home.testimonials.title` | approved |

The cards are the Home's (`testimonial.placeholder.*`, §5.9), with their badges (Gaby's note: "los mismos testimonios de la home sirven aquí").

### W.7 Frequently asked questions (`#preguntas`)

| Key | Español | English | Status |
|---|---|---|---|
| `mastery.faq.title` | Preguntas frecuentes. | Frequently asked questions. | approved |
| `mastery.faq.1.question` | ¿Me vas a decir en qué invertir? | Are you going to tell me what to invest in? | approved |
| `mastery.faq.1.answer` | No. Aprendés a entender cómo funciona cada inversión y a evaluarla. Las decisiones son tuyas, con criterio propio. | No. You learn to understand how each investment works and to evaluate it. The decisions are yours, with your own judgment. | provisional |
| `mastery.faq.2.question` | ¿Tengo que pagar mis deudas antes de empezar? | Do I have to pay off my debts before I start? | approved |
| `mastery.faq.2.answer` | No. Con cada ingreso avanzás en paralelo: deudas, protección e inversión al mismo tiempo. | No. With every income you move forward in parallel: debts, protection and investing at the same time. | provisional |
| `mastery.faq.3.question` | ¿Es presencial? | Is it in person? | approved |
| `mastery.faq.3.answer` | No, todo es por videollamada. Podés estar en cualquier país. | No, everything is by video call. You can be in any country. | provisional |
| `mastery.faq.4.question` | ¿Cuánto cuesta? | How much does it cost? | approved |
| `mastery.faq.4.answer` | Lo conversamos en la llamada inicial, cuando ya sepamos si Wealth Mastery es para vos. | We talk about it in the initial call, once we know whether Wealth Mastery is for you. | provisional |

The answers are Gaby's text but `provisional`: her note says she confirms them before publishing, so they carry the pending badge (US-042 AC3). The questions are approved.

### W.8 Apply (`#aplicar`)

| Key | Español | English | Status |
|---|---|---|---|
| `mastery.apply.eyebrow` | = `vip_band.eyebrow` | = `vip_band.eyebrow` | approved |
| `mastery.apply.title` | ¿Empezamos a construir *tu libertad?* | Shall we start building *your freedom?* | approved |
| `mastery.apply.cta` | = `cta.vip_apply` | = `cta.vip_apply` | approved |

The three steps are the Home's (`home.vip.step.*`, §5.11): Gaby's steps here are the same text, except "tu norte" in lower case in step 3 (see the flags).

### W.9 Metadata changes (US-042)

- Placeholders (badge in every build): remove "the Método Polaris page's steps placeholder (`method.steps.placeholder`, §12)"; add "the Wealth Mastery page's guide photo (`mastery.guide.photo.placeholder`, §12)".
- Provisional copy blocks: add "the Wealth Mastery page's FAQ answers and the two adapted lines (`mastery.fit.no.2`, `mastery.fit.no.3`, `mastery.how.4.body`, §12)".
- No badge: add `mastery.guide.photo_alt`.

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
