# CONTENT — phase 2d copy (staged)

The phase 2d copy: Gaby's final content of 2026-11-23 ([`BRIEF_2026-11-23_WEALTH_MASTERY.md`](BRIEF_2026-11-23_WEALTH_MASTERY.md)), written as [`CONTENT.md`](CONTENT.md) rows, ready to move. It is staged here, not in `CONTENT.md`, because the unit tests check the code against `CONTENT.md`: each Sprint 005 story moves **its part** into `CONTENT.md` in the same PR as its code, and deletes that part from this file. The story that moves the last part deletes this file and the references to it.

Same rules as `CONTENT.md` (its Metadata): the row format is the same (`| key | Español | English | Status |`), values are verbatim and never contain markers, `*text*` marks the italic part of a heading, `= key` points at another key, and **every English value is provisional** until Gaby validates the English as a whole.

## Parts and who moves them

| Part | What | Moved by |
|---|---|---|
| [W](#part-w--the-wealth-mastery-page) | The Wealth Mastery page (it replaces §12, the Método Polaris page) | US-042 |
| [C](#part-c--gabys-calculator) | §11, Gaby's calculator, with the error for the unanswered shares question | US-044 |
| [P](#part-p--privacy-notice-gohighlevel) | §9, `privacy.p2` and `privacy.p4`: GoHighLevel as the processor of the contacts and the emails | US-045 |
| [L](#part-l--the-resource-library-withdrawn) | §7 withdrawn, and every key that pointed at the library | US-046 |

Rules for the moves:

- **Part V (voseo, the name, the menu) has moved** (US-041, merged first in Sprint 005; it is in `CONTENT.md`). It gave interim voseo to keys that Parts H, W, C, P and L later replace or remove; each of those parts replaces those rows with its own. References below to "Part V" mean those moved rows.
- **No part depends on another part's move.** Part H (the Home) has moved (US-043), so the Home's calculator teaser no longer imports the resource data and Part L can move. Where two parts show the same text (the pillars on the Home and on the Wealth Mastery page), each writes it out in full; aliases (`= key`) point only at keys already in `CONTENT.md` after Part V.
- **Status.** `approved`: Gaby's Spanish, verbatim from the brief, or an approved value changed only by her two rules (voseo, the programme's name). `provisional`: proposed by the team, shown with the pending badge where `CONTENT.md` Metadata says so. Each part updates the Metadata's badge lists as its notes say.
- **Section numbers stay.** A section that is withdrawn keeps its heading with one line saying so, so references to other sections keep working.
- Gaby's few slips against her own rules are corrected here and listed for her in [Flags for Gaby](#flags-for-gaby).

---

## Part W — The Wealth Mastery page

**Moved by US-042.** Gaby's page (brief §2), verbatim, as `CONTENT.md` **§12, replacing the Método Polaris page**. The new heading is "## 12. Wealth Mastery page (`/es/wealth-mastery/`, `/en/wealth-mastery/`)". US-042 removes the old §12 rows (`method.*`) and `meta.method.*` from §1; the `mastery` route's metadata is already in §1 (Part V).

The pillars repeat the Home's (Part H, now in `CONTENT.md` §5.6) in full.

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

**Moved by US-046** (US-043 removed the Home teaser's library links first). Gaby: one free resource, the calculator (brief §1 point 1).

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
