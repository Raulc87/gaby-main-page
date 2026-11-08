# CONTENT — Gaby Kelly website (Spanish source → English)

Every visitor-facing string of the phase 2 site lives here, keyed, in both languages. `UX_UI_DIRECTION.md` says how the site looks and behaves; this file says what it says. It is the **only** source of visitor-facing copy for phase 2 (`PROJECT_CONTEXT.md`). Implementation copies each string verbatim into the translation files (`src/i18n/<lang>/*`). Changing copy means changing this file first (`AGENTS.md` → Change management), then the code.

## Metadata
- Version: 0.2
- Phase 2c: the copy for phase 2c (Gaby's review, 2026-11-08) is staged in [`CONTENT_PHASE_2C.md`](CONTENT_PHASE_2C.md); each implementing story moves its part here in the same PR as its code, because the unit tests check the code against this file.
- Status: Proposed for Sprint 003 (this PR)
- Owner: Gaby Kelly approves copy; the human owner records it here
- Source language: Spanish. Later changes start in Spanish and are translated in the same PR.
- Sources: Gaby's brief (`docs/ux/BRIEF_2026-10-15.md`) for the Spanish copy she wrote, quoted verbatim; the phase 1 form copy (`UX_UI_DIRECTION.md` v0.8 §4, sections 7–8, kept unchanged); proposals by the project team where the brief has no copy.
- Rules: no guaranteed outcomes (BR-003); gender-neutral, inclusive language toward the visitor in both languages (BR-005; Gaby's first-person story may describe herself); the initial call is free, the mentorship is not (BR-008); "Gaby Kelly", "Método Polaris" / "Polaris Method", "Wealth Mastery" (BR-009); no invented testimonials, logos, files or figures (BR-011).
- **Status column:**
  - `approved`: the Spanish is Gaby's (from her brief), was approved earlier, or was decided by the human owner (dated note next to the key, e.g. `form.submit`); the English is a translation.
  - `provisional`: proposed by the team, or a placeholder in the brief itself (`[...]` there); shown with the pending badge in preview builds.
  - **All English values are provisional** until Gaby validates them (one review of the English as a whole); that does not add badges.
- Values are copied verbatim and never contain markers. The code keeps the list of provisional keys next to the strings (`UX_UI_DIRECTION.md` §7).
- **Pending badge (which keys show one):** only content blocks, never navigation, accessibility labels, alt text, metadata or state messages. Two kinds (`UX_UI_DIRECTION.md` §6.5):
  - **Placeholders** (content that has not arrived; BR-011), badge in **every** build, production included, until the real content replaces them: the Home hero photo (§5.1), the testimonial cards (§5.9), the story photo and bio placeholders (§6), the VIP video module (§8.2), and every resource card whose file has not been delivered (§7.3).
  - **Provisional copy blocks**, badge in preview and development builds only: the Método Polaris steps (§5.6), the problem's second paragraph (§5.2), the third figure of the guide (§5.4), the Wealth Mastery modules (§5.7), the calculator's questions, zones and result (§11, placeholder formula), the VIP steps (§8.1), the not-ready screen (§8.5), and resource cards with provisional titles. Before any production release, each of these is approved or the human owner decides per block whether it ships (as the phase 1 go-live gate did).
  - No badge: `nav.*`, `skip_link`, `lang.*`, `meta.*`, `*_alt`, `resource.cover_alt`, `resources.filter.label`, `resources.empty`, `resource.pending`, `resource.email.coming_soon`, `story.media.label`, `story.experience.label`, `preview.*`, `privacy.*` (the notice has its own DRAFT label).
- `*text*` marks the italic emphasis (Playfair italic, `UX_UI_DIRECTION.md` §2) inside a heading; the asterisks are not part of the text.
- `{contact_email}` is replaced with a `mailto:` link to `PUBLIC_CONTACT_EMAIL`.

---

## 1. Site metadata (per page)

| Key | Español | English | Status |
|---|---|---|---|
| `meta.site_name` | Gaby Kelly | Gaby Kelly | approved |
| `meta.home.title` | Gaby Kelly — Del mundo corporativo a tu libertad financiera | Gaby Kelly — From corporate life to your financial freedom | approved |
| `meta.home.description` | Mentoría financiera para ejecutivos y profesionales corporativos: ordena tu dinero, convierte los beneficios de tu carrera en capital e invierte para construir patrimonio. | Financial mentorship for corporate executives and professionals: organize your money, turn your career's benefits into capital and invest to build wealth. | provisional |
| `meta.story.title` | Mi historia — Gaby Kelly | My story — Gaby Kelly | provisional |
| `meta.story.description` | Del mundo corporativo a mi libertad: la historia de Gaby Kelly. | From corporate life to my freedom: Gaby Kelly's story. | provisional |
| `meta.resources.title` | Recursos gratis — Gaby Kelly | Free resources — Gaby Kelly | provisional |
| `meta.resources.description` | Guías, plantillas y minicursos gratuitos para ordenar, invertir y crecer. | Free guides, templates and mini-courses to organize, invest and grow. | provisional |
| `meta.vip.title` | Mentoría VIP · Wealth Mastery — Gaby Kelly | VIP Mentorship · Wealth Mastery — Gaby Kelly | provisional |
| `meta.vip.description` | Aplica para trabajar directamente con Gaby y agenda tu llamada inicial sin costo. | Apply to work directly with Gaby and book your free initial call. | provisional |
| `meta.privacy.title` | Aviso de privacidad — Gaby Kelly | Privacy notice — Gaby Kelly | provisional |
| `meta.privacy.description` | Cómo tratamos tus datos personales según la Ley 8968. | How we handle your personal data under Costa Rica Law 8968. | provisional |
| `meta.calculator.title` | ¿Cuántos meses podrías sostenerte? — Gaby Kelly | How many months could you sustain yourself? — Gaby Kelly | provisional |
| `meta.calculator.description` | Diagnóstico gratis en 3 minutos: descubre cuánto tiempo te da hoy tu dinero sin tu salario. | A free 3-minute diagnosis: find out how long your money would last today without your salary. | provisional |
| `meta.method.title` | Método Polaris — Gaby Kelly | The Polaris Method — Gaby Kelly | provisional |
| `meta.method.description` | Los tres pasos del Método Polaris para que tu salario trabaje para ti. | The three steps of the Polaris Method so your salary works for you. | provisional |

## 2. Header, navigation and language

| Key | Español | English | Status |
|---|---|---|---|
| `nav.brand` | Gaby Kelly | Gaby Kelly | approved |
| `nav.story` | Mi historia | My story | approved |
| `nav.method` | Método Polaris | Polaris Method | approved |
| `nav.resources` | Recursos gratis | Free resources | approved |
| `nav.blog` | Blog | Blog | approved |
| `nav.vip` | Aplicar a la Mentoría VIP | Apply to the VIP Mentorship | approved |
| `nav.vip_short` | Mentoría VIP | VIP Mentorship | approved |
| `nav.menu_open` | Abrir menú | Open menu | provisional |
| `nav.menu_close` | Cerrar menú | Close menu | provisional |
| `nav.label` | Navegación principal | Main navigation | provisional |
| `lang.toggle_label` | Cambiar idioma | Change language | approved |
| `skip_link` | Saltar al contenido | Skip to content | provisional |

`nav.blog` is not shown until US-026. `nav.method` links to the Método Polaris page (§12, US-028). `nav.vip` is the dummy's header label (2026-11-08); below 1024 px the header shows `nav.vip_short`, which fits next to the menu button.

## 3. Footer

| Key | Español | English | Status |
|---|---|---|---|
| `footer.brand` | Gaby Kelly | Gaby Kelly | approved |
| `footer.concept` | Del mundo corporativo a tu libertad financiera. | From corporate life to your financial freedom. | approved |
| `footer.disclaimer` | Gaby Kelly es inversora y mentora; no es asesora financiera. El contenido es educativo y no constituye una recomendación de inversión. | Gaby Kelly is an investor and mentor, not a financial advisor. The content is educational and does not constitute investment advice. | approved |
| `footer.data_note` | Tus datos protegidos según la Ley 8968. | Your data is protected under Costa Rica Law 8968. | approved |
| `footer.privacy_link` | Aviso de privacidad | Privacy notice | approved |

No Terms link until a Terms page exists (`PROJECT_SPEC.md` FR-020).

## 4. Shared calls to action and VIP band

| Key | Español | English | Status |
|---|---|---|---|
| `cta.vip_long` | Trabaja directamente con Gaby · VIP | Work directly with Gaby · VIP | approved |
| `cta.vip_apply` | Aplicar a la Mentoría VIP | Apply to the VIP Mentorship | approved |
| `cta.start_free` | O empieza gratis con los recursos | Or start free with the resources | approved |
| `cta.all_resources` | Ver la biblioteca completa | See the full library | approved |
| `cta.read_story` | Lee mi historia completa | Read my full story | approved |
| `vip_band.eyebrow` | Mentoría VIP · Wealth Mastery | VIP Mentorship · Wealth Mastery | approved |
| `vip_band.title` | ¿Quieres trabajar *directamente conmigo*? | Do you want to work *directly with me*? | approved |
| `vip_band.body` | Imagina saber exactamente con cuánto cuentas, tener tu dinero trabajando a tu favor y decidir sobre tu carrera desde la libertad, no desde la necesidad. Y, cuando estés con tu familia, estar ahí de verdad. Llena una breve aplicación y agenda tu llamada inicial. | Imagine knowing exactly what you have, having your money work for you, and making career decisions from freedom, not necessity. And when you're with your family, truly being there. Fill in a short application and book your initial call. | approved |
| `vip_band.short_title` | ¿Prefieres un plan hecho a tu medida? *Trabaja directamente con Gaby.* | Would you prefer a plan made for you? *Work directly with Gaby.* | approved |

My story uses `vip_band.title` and `vip_band.body`; the Home's closing band uses `vip_band.title` with its own body and steps (§5.11); the resource library uses `vip_band.short_title`. All bands use `cta.vip_apply` (the gold button).

## 5. Home (`/es/`, `/en/`)

Phase 2c (US-034): the StoryBrand Home from Gaby's review of 2026-11-08 ([`BRIEF_2026-11-08_STORYBRAND.md`](BRIEF_2026-11-08_STORYBRAND.md) §1). Eleven sections in this order: hero, problem, stakes, guide, opportunity, Método Polaris, Wealth Mastery, before and after, proof, calculator, VIP. The Spanish marked `approved` is Gaby's, quoted from the dummy; the English is a translation (provisional, see Metadata). The dummy is plain text: where a new title has an italic part (`*...*`), the split follows the site's title pattern ([`UX_UI_DIRECTION.md`](UX_UI_DIRECTION.md) §2.3), not the dummy.

### 5.1 Hero (`#hero`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.hero.eyebrow` | Mentoría financiera para ejecutivos y profesionales corporativos | Financial mentorship for corporate executives and professionals | approved |
| `home.hero.title` | Ganas bien, pero tu dinero *no te está dando tranquilidad.* | You earn well, but your money *isn't giving you peace of mind.* | approved |
| `home.hero.lead` | Te acompaño a ordenar tu dinero, convertir los beneficios de tu carrera en capital e invertir para construir patrimonio y libertad, sin tener que renunciar a lo que has construido. | I help you organize your money, turn your career's benefits into capital, and invest to build wealth and freedom, without giving up what you've built. | approved |
| `home.hero.cta` | Aplica a la Mentoría VIP | Apply to the VIP Mentorship | approved |
| `home.hero.secondary` | Calcula tus meses de libertad gratis | Calculate your months of freedom for free | approved |
| `home.hero.trust` | 18 años en el mundo corporativo · Más de 10 años invirtiendo | 18 years in the corporate world · More than 10 years investing | approved |
| `home.hero.photo.placeholder` | Foto de Gaby en su vida de libertad | Photo of Gaby living her freedom | provisional |
| `home.hero.photo_alt` | Gaby Kelly disfrutando de su libertad | Gaby Kelly enjoying her freedom | provisional |

`home.hero.cta` leads to the VIP page (gold); `home.hero.secondary` leads to the calculator (§11, blue). The hero photo is the "desired state" (Gaby living her freedom, or a real client); until it arrives the frame shows `home.hero.photo.placeholder` with the pending badge. The studio portrait is used only in §5.4.

### 5.2 The problem (`#escalera`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.ladder.title` | Subiste la escalera corporativa. *¿Y tu libertad?* | You climbed the corporate ladder. *What about your freedom?* | approved |
| `home.ladder.p1` | Más rango, más gente a cargo, cuotas cada vez más altas, aumentos, viajes. Por fuera, todo va bien. | A higher rank, more people reporting to you, ever-higher quotas, raises, travel. From the outside, everything is going well. | approved |
| `home.ladder.p2` | Pero aunque trabajes desde casa, tu mente no está ahí. Está en la cuota, en el equipo, en la próxima reunión. Sientes que *todo depende de ti*. | But even when you work from home, your mind isn't there. It's on the quota, the team, the next meeting. You feel that *everything depends on you*. | provisional |
| `home.ladder.p3` | Mientras tanto, cada aumento se va en un estilo de vida un poco más caro. | Meanwhile, every raise goes into a slightly more expensive lifestyle. | approved |
| `home.ladder.closing` | Nadie debería tener que elegir entre su carrera y estar presente para su familia. | No one should have to choose between their career and being present for their family. | approved |

`home.ladder.p2` drops "Cada vez más cosas dependen de ti, y", the redundancy Gaby pointed out (brief §3, note 1); provisional until she confirms the wording. "Si mañana tu puesto cambiara…" moved to §5.3.

### 5.3 What's at stake (`#en-juego`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.stakes.title` | Si nada cambia, en cinco años… | If nothing changes, in five years… | approved |
| `home.stakes.1.title` | Tienes un gran currículum, pero no patrimonio. | You have a great résumé, but no wealth. | approved |
| `home.stakes.1.body` | Ganaste bien durante años y aun así tu tranquilidad depende del próximo depósito de planilla. | You earned well for years, and your peace of mind still depends on the next paycheck. | approved |
| `home.stakes.2.title` | Tu libertad depende de un puesto que no controlas. | Your freedom depends on a position you don't control. | approved |
| `home.stakes.2.body` | Si mañana tu puesto cambiara, no sabrías con certeza cuántos meses podrías sostenerte. | If your position changed tomorrow, you wouldn't know for sure how many months you could sustain yourself. | approved |
| `home.stakes.3.title` | Los años con tu familia pasan sin ti. | The years with your family go by without you. | approved |
| `home.stakes.3.body` | Estás en la cena, pero tu cabeza sigue en la oficina. Ese tiempo no se recupera. | You're at dinner, but your mind is still at the office. That time doesn't come back. | approved |
| `home.stakes.closing` | No tiene que ser así. Y no tienes que descubrirlo tan tarde como yo. | It doesn't have to be this way. And you don't have to find out as late as I did. | approved |
| `home.stakes.cta` | ¿Cuántos meses podrías sostenerte tú? Calcúlalo gratis | How many months could you sustain yourself? Calculate it for free | approved |

`home.stakes.cta` is a text link to the calculator (§11); the arrow is drawn by the link style, not part of the text.

### 5.4 The guide: my story (`#historia`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.story.eyebrow` | Mi historia | My story | approved |
| `home.story.title` | Yo estuve donde *estás tú.* | I was where *you are.* | approved |
| `home.story.p1` | Trabajé 18 años en el mundo corporativo, con partners de Intel, Microsoft y Oracle. Era mamá sola y, por subir la escalera, sacrifiqué mucho tiempo con mi hija. | I worked for 18 years in the corporate world, with Intel, Microsoft and Oracle partners. I was a single mother and, climbing the ladder, I gave up a lot of time with my daughter. | approved |
| `home.story.p2` | Me di cuenta tarde de la oportunidad que tenía en las manos. Hoy, después de más de 10 años construyendo mi portafolio, acompaño a ejecutivos y profesionales del mundo corporativo a convertir un buen salario en patrimonio, sin esperar tanto como yo. | I realized late the opportunity I had in my hands. Today, after more than 10 years building my portfolio, I help executives and professionals in the corporate world turn a good salary into wealth, without waiting as long as I did. | approved |
| `home.story.stat.1.value` | 18 | 18 | approved |
| `home.story.stat.1.label` | años corporativos | years in corporate | approved |
| `home.story.stat.2.value` | 10+ | 10+ | approved |
| `home.story.stat.2.label` | años invirtiendo | years investing | approved |
| `home.story.stat.3.value` | 200+ | 200+ | provisional |
| `home.story.stat.3.label` | personas acompañadas | people mentored | approved |
| `home.story.media.label` | = `story.media.label` | = `story.media.label` | approved |
| `home.story.portrait_alt` | Retrato de Gaby Kelly | Portrait of Gaby Kelly | provisional |
| `home.story.cta` | = `cta.read_story` | = `cta.read_story` | approved |

The dummy leaves the third figure as "[X]"; "200+" comes from the page gabykelly.com serves today ("Más de 200 personas") and stays provisional until Gaby confirms it (BR-011). The media row shows `story.media.1` to `story.media.3` as names until their logos are authorized (FR-029). This is the only place the studio portrait appears. The My story page (§6) keeps its own, longer text.

### 5.5 The opportunity (`#oportunidad`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.opportunity.eyebrow` | La oportunidad que tienes en las manos | The opportunity in your hands | approved |
| `home.opportunity.title` | Tu carrera ya te dio las herramientas. *Te falta el sistema.* | Your career already gave you the tools. *What's missing is the system.* | approved |
| `home.opportunity.lead` | Trabajar en una transnacional o una gran corporación te da beneficios que casi nadie aprovecha. Si no inflas tu estilo de vida, se convierten en capital para invertir. | Working at a multinational or a large corporation gives you benefits almost no one takes advantage of. If you don't inflate your lifestyle, they become capital to invest. | approved |
| `home.opportunity.1.title` | Salario alto y aumentos | A high salary and raises | approved |
| `home.opportunity.1.body` | Cada aumento puede ir a tu patrimonio. | Every raise can go to your wealth. | approved |
| `home.opportunity.2.title` | Seguros médicos y de vida | Health and life insurance | approved |
| `home.opportunity.2.body` | Gastos cubiertos que no salen de tu bolsillo. | Covered expenses that don't come out of your pocket. | approved |
| `home.opportunity.3.title` | Carro y allowances | Car and allowances | approved |
| `home.opportunity.3.body` | Flujo de caja liberado cada mes. | Cash flow freed up every month. | approved |
| `home.opportunity.4.title` | Viajes y viáticos | Travel and per diems | approved |
| `home.opportunity.4.body` | Comida y viajes fuera de tu presupuesto. | Meals and trips outside your budget. | approved |
| `home.opportunity.5.title` | Inglés y acceso a EE. UU. | English and access to the U.S. | approved |
| `home.opportunity.5.body` | Puertas a mercados de inversión internacionales. | Doors to international investment markets. | approved |
| `home.opportunity.6.title` | Roce y contactos | Exposure and contacts | approved |
| `home.opportunity.6.body` | Una red que vale oro cuando construyes algo propio. | A network worth gold when you build something of your own. | approved |

### 5.6 The plan: Método Polaris (`#metodo`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.method.eyebrow` | El Método Polaris | The Polaris Method | approved |
| `home.method.title` | Tres pasos para que tu salario *trabaje para ti.* | Three steps so your salary *works for you.* | approved |
| `home.method.1.title` | Define tu Norte | Define your North | provisional |
| `home.method.1.body` | Claridad sobre lo que quieres y sobre tu relación con el dinero. | Clarity about what you want and about your relationship with money. | provisional |
| `home.method.2.title` | Ordena tu dinero | Organize your money | provisional |
| `home.method.2.body` | Tu sistema de billeteras: cada ingreso y cada beneficio con un propósito. | Your wallet system: every income and every benefit with a purpose. | provisional |
| `home.method.3.title` | Invierte y construye patrimonio | Invest and build wealth | provisional |
| `home.method.3.body` | Decisiones conscientes, alineadas con la vida que quieres. | Deliberate decisions, aligned with the life you want. | provisional |
| `home.method.cta` | Quiero aplicar el Método Polaris con Gaby | I want to apply the Polaris Method with Gaby | approved |

The steps stay provisional until Gaby sends the official Método Polaris steps (US-028). `home.method.cta` leads to the VIP page (blue style, BR-010).

### 5.7 What you learn in Wealth Mastery (`#wealth-mastery`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.mastery.eyebrow` | = `vip_band.eyebrow` | = `vip_band.eyebrow` | approved |
| `home.mastery.title` | Lo que aprendes *en la mentoría.* | What you learn *in the mentorship.* | approved |
| `home.mastery.lead` | No es teoría: es lo mismo que aplico en mi propio portafolio desde hace más de 10 años, explicado para que tú puedas entenderlo, evaluarlo y decidir. | It isn't theory: it's what I've applied in my own portfolio for more than 10 years, explained so you can understand it, evaluate it and decide. | approved |
| `home.mastery.1.title` | Tu Norte y tu relación con el dinero | Your North and your relationship with money | provisional |
| `home.mastery.1.body` | Claridad sobre la vida que quieres y las creencias que hoy te frenan. | Clarity about the life you want and the beliefs holding you back today. | provisional |
| `home.mastery.2.title` | Sistema de billeteras | The wallet system | provisional |
| `home.mastery.2.body` | Ordenas cada ingreso y cada beneficio con un propósito. | You give every income and every benefit a purpose. | provisional |
| `home.mastery.3.title` | Beneficios corporativos y flujo | Corporate benefits and cash flow | provisional |
| `home.mastery.3.body` | Conviertes lo que tu empresa ya te da en capital para invertir. | You turn what your company already gives you into capital to invest. | provisional |
| `home.mastery.4.title` | Bolsa y ETFs | Stocks and ETFs | provisional |
| `home.mastery.4.body` | Entiendes cómo funcionan los mercados y cómo evaluar una inversión. | You understand how markets work and how to evaluate an investment. | provisional |
| `home.mastery.5.title` | Bienes raíces | Real estate | provisional |
| `home.mastery.5.body` | Cómo analizar una propiedad como inversión, no como gasto. | How to analyze a property as an investment, not an expense. | provisional |
| `home.mastery.6.title` | Commodities: oro y plata | Commodities: gold and silver | provisional |
| `home.mastery.6.body` | Su papel como protección dentro de un portafolio. | Their role as protection within a portfolio. | provisional |
| `home.mastery.7.title` | Cripto | Crypto | provisional |
| `home.mastery.7.body` | Entiendes cómo funciona y cómo pensarla con criterio y sin euforia. | You understand how it works and how to think about it with judgment and without euphoria. | provisional |
| `home.mastery.cta` | = `cta.vip_apply` | = `cta.vip_apply` | approved |

The module list is provisional: the dummy asks to confirm with Gaby whether a module is missing. The wording is educational (understand, evaluate, decide), consistent with the disclaimer (FR-028); no module promises returns (BR-003). `home.mastery.cta` uses the blue style (BR-010).

### 5.8 Before and after (`#antes-despues`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.change.title` | Así se ve tu vida *con el sistema funcionando.* | This is what your life looks like *with the system working.* | approved |
| `home.change.before.label` | Hoy | Today | approved |
| `home.change.before.1` | Cada aumento se va en un estilo de vida más caro | Every raise goes into a more expensive lifestyle | approved |
| `home.change.before.2` | No sabes cuántos meses podrías sostenerte | You don't know how many months you could sustain yourself | approved |
| `home.change.before.3` | Los beneficios corporativos se pierden sin propósito | Corporate benefits go to waste without a purpose | approved |
| `home.change.before.4` | Inviertes poco, tarde o con miedo | You invest little, late, or with fear | approved |
| `home.change.before.5` | Estás en casa, pero tu cabeza sigue en el trabajo | You're at home, but your mind is still at work | approved |
| `home.change.after.label` | Con el Método Polaris | With the Polaris Method | approved |
| `home.change.after.1` | Cada aumento va directo a tu patrimonio | Every raise goes straight to your wealth | approved |
| `home.change.after.2` | Sabes exactamente con cuánto cuentas | You know exactly what you have | approved |
| `home.change.after.3` | Tus beneficios se convierten en capital para invertir | Your benefits become capital to invest | approved |
| `home.change.after.4` | Inviertes con un plan y con claridad | You invest with a plan and with clarity | approved |
| `home.change.after.5` | Decides sobre tu carrera desde la libertad, y estás presente de verdad | You make career decisions from freedom, and you're truly present | approved |

### 5.9 Proof (`#testimonios`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.testimonials.title` | Lo que dicen quienes ya dieron el paso. | What people who already took the step say. | approved |
| `testimonial.placeholder.text` | Testimonio real: antes y resultado concreto | Real testimonial: before and a concrete result | provisional |
| `testimonial.placeholder.video` | Testimonio en video | Video testimonial | provisional |
| `testimonial.placeholder.photo` | Foto real | Real photo | provisional |
| `testimonial.placeholder.attribution` | Nombre · cargo · industria | Name · role · industry | provisional |
| `home.testimonials.cta` | Quiero resultados como estos | I want results like these | approved |

Three placeholder cards (two with photo and text, one video) until real, authorized testimonials arrive (BR-011, US-017). Gaby calls them her priority before launch, ideally each with a concrete result. `home.testimonials.cta` leads to the VIP page (blue style); while every card is still a placeholder it is hidden, since it would point at results that are not shown (BR-003).

### 5.10 Free diagnosis: the calculator (`#calculadora`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.calculator.eyebrow` | Diagnóstico gratis · 3 minutos | Free diagnosis · 3 minutes | approved |
| `home.calculator.title` | ¿Cuántos meses podrías sostenerte *si cambiara tu puesto?* | How many months could you sustain yourself *if your position changed?* | approved |
| `home.calculator.lead` | Cinco datos y descubres cuánto tiempo te da hoy tu dinero sin tu salario. | Five figures and you find out how long your money would last today without your salary. | approved |
| `home.calculator.receive` | Recibes tu resultado y tu zona al instante. | You get your result and your zone right away. | provisional |
| `home.calculator.receive_with_guide` | Recibes tu resultado, tu zona y la guía "Cómo empezar a invertir siendo ejecutivo". | You get your result, your zone and the guide "How to start investing as an executive". | approved |
| `home.calculator.cta` | Calcular mis meses gratis | Calculate my months for free | approved |
| `home.calculator.example.label` | Ejemplo de resultado | Example result | approved |
| `home.calculator.example.value` | 4,4 meses | 4.4 months | approved |
| `home.calculator.example.zone` | Zona de alerta | Alert zone | approved |
| `home.calculator.more` | Más recursos en la biblioteca: | More resources in the library: | approved |

`home.calculator.receive_with_guide` is shown only once the guide is sent by email (US-038); until then `home.calculator.receive`, so the page never promises an email that is not sent. Below `home.calculator.more`, two links to the resource library: the titles of `diagnostic-benefits` and `diagnostic-investor` (§7.3). This section replaces the free-resources teaser: the calculator is the Home's only lead magnet.

### 5.11 Work with me (`#vip`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.vip.eyebrow` | = `vip_band.eyebrow` | = `vip_band.eyebrow` | approved |
| `home.vip.title` | = `vip_band.title` | = `vip_band.title` | approved |
| `home.vip.body` | Imagina saber exactamente con cuánto cuentas, tener tu dinero trabajando a tu favor y, cuando estés con tu familia, estar ahí de verdad. | Imagine knowing exactly what you have, having your money work for you and, when you're with your family, truly being there. | approved |
| `home.vip.step.1.title` | Aplica | Apply | approved |
| `home.vip.step.1.body` | Una breve aplicación de 5 minutos. | A short, 5-minute application. | approved |
| `home.vip.step.2.title` | Llamada inicial conmigo | An initial call with me | approved |
| `home.vip.step.2.body` | Vemos dónde estás y si la mentoría es para ti. | We look at where you are and whether the mentorship is for you. | approved |
| `home.vip.step.3.title` | Empezamos tu plan | We start your plan | approved |
| `home.vip.step.3.body` | Definimos tu Norte y arrancamos con tu sistema. | We define your North and get your system going. | approved |
| `home.vip.cta` | = `cta.vip_apply` | = `cta.vip_apply` | approved |

The Home's VIP band: the blue band of §4 with `home.vip.body` and the three steps, and the gold `cta.vip_apply`.

## 6. My story (`/es/mi-historia/`, `/en/my-story/`)

| Key | Español | English | Status |
|---|---|---|---|
| `story.eyebrow` | Mi historia | My story | approved |
| `story.title` | Del mundo corporativo *a mi libertad.* | From corporate life *to my freedom.* | approved |
| `story.p1` | Trabajé 18 años en el mundo corporativo como gerente de ventas de canales de distribución, con partners de Intel, Microsoft y Oracle. Cuotas cada vez más altas, viajes, buenos beneficios. | I worked for 18 years in the corporate world as a sales manager for distribution channels, with Intel, Microsoft and Oracle partners. Ever-higher quotas, travel, good benefits. | approved |
| `story.p2` | Era mamá sola, y por subir la escalera sacrifiqué mucho tiempo con mi hija. Estaba presente en cuerpo, pero mi cabeza seguía en el trabajo. Y me di cuenta tarde de la oportunidad que tenía en las manos para construir otra cosa. | I was a single mother, and climbing the ladder cost me a lot of time with my daughter. I was there in body, but my mind was still at work. And I realized late the opportunity I had in my hands to build something else. | approved |
| `story.p3` | Hoy, después de más de 10 años construyendo mi portafolio junto a asesores especializados, acompaño a ejecutivos y profesionales corporativos a convertir un buen salario en patrimonio, sin esperar tanto como yo. | Today, after more than 10 years building my portfolio with specialized advisors, I help corporate executives and professionals turn a good salary into wealth, without waiting as long as I did. | approved |
| `story.media.label` | Me han entrevistado en | I've been interviewed on | approved |
| `story.media.1` | Canal 13 | Canal 13 | approved |
| `story.media.2` | Radio Azul | Radio Azul | approved |
| `story.media.3` | Radio Fides | Radio Fides | approved |
| `story.media.4` | Charlas | Talks | approved |
| `story.experience.label` | Experiencia corporativa | Corporate experience | provisional |
| `story.experience.logo_alt.microsoft` | Microsoft | Microsoft | approved |
| `story.experience.logo_alt.oracle` | Oracle | Oracle | approved |
| `story.experience.intel` | Intel | Intel | approved |
| `story.bio.placeholder` | Biografía y credenciales | Bio and credentials | provisional |
| `story.photo.placeholder` | Fotos de la sesión | Session photos | provisional |
| `story.resources_link` | = `cta.start_free` | = `cta.start_free` | approved |

Media are shown as names only, without logos, until their logo use is authorized (FR-029). Microsoft and Oracle are shown with logos as prior experience; Intel is named without a logo until confirmed (US-022 AC3). The page ends with the VIP band (§4: `vip_band.*`, `cta.vip_apply`).

## 7. Free resources (`/es/recursos/`, `/en/resources/`)

### 7.1 Page

| Key | Español | English | Status |
|---|---|---|---|
| `resources.eyebrow` | Biblioteca gratuita | Free library | approved |
| `resources.title` | Herramientas para ordenar, *invertir y crecer.* | Tools to organize, *invest and grow.* | approved |
| `resources.lead` | Guías, plantillas y minicursos que puedes usar hoy. Algunos se descargan directo; otros te llegan al correo. | Guides, templates and mini-courses you can use today. Some download directly; others arrive in your inbox. | approved |
| `resources.filter.label` | Filtrar por tema | Filter by topic | provisional |
| `resources.filter.all` | Todos | All | approved |
| `resources.topic.debt` | Salir de deudas | Getting out of debt | approved |
| `resources.topic.wallets` | Billeteras y presupuesto | Wallets and budget | approved |
| `resources.topic.investing` | Inversión | Investing | approved |
| `resources.topic.mindset` | Mentalidad y dinero | Mindset and money | approved |
| `resources.featured.label` | Minicurso destacado · gratis | Featured mini-course · free | approved |
| `resources.empty` | No hay recursos en este tema todavía. | There are no resources in this topic yet. | provisional |

### 7.2 Card labels and states

| Key | Español | English | Status |
|---|---|---|---|
| `resource.type.minicourse` | Minicurso | Mini-course | approved |
| `resource.type.guide` | Guía | Guide | approved |
| `resource.type.template` | Plantilla | Template | approved |
| `resource.type.checklist` | Checklist | Checklist | approved |
| `resource.type.class` | Clase grabada | Recorded class | approved |
| `resource.free` | gratis | free | approved |
| `resource.access.download` | Descarga libre | Free download | approved |
| `resource.access.email` | Con tu correo | By email | approved |
| `resource.cta.download` | Descargar gratis | Download for free | approved |
| `resource.cta.guide` | Recibir la guía | Get the guide | approved |
| `resource.cta.class` | Ver la clase | Watch the class | approved |
| `resource.cta.minicourse` | Quiero el minicurso | I want the mini-course | approved |
| `resource.pending` | Disponible pronto | Coming soon | provisional |
| `resource.email.coming_soon` | La entrega por correo estará disponible pronto. | Delivery by email will be available soon. | provisional |
| `resource.cover_alt` | Portada de {title} | Cover of {title} | provisional |

A card whose file has not been delivered shows `resource.pending` instead of its call to action, with no link (US-024 AC4). An email-delivered resource shows `resource.email.coming_soon` and no form until US-025.

### 7.3 Resource list

The code keeps this list in one typed data file (US-024 AC3). `id` is the stable identifier; `file` is filled only when the real file has been delivered.

| `id` | Type | Topic | Access | `home` | Title ES | Title EN | Description ES | Description EN | Status |
|---|---|---|---|---|---|---|---|---|---|
| `minicourse-debt` | minicourse | debt | email | yes (1st) | Cómo salir de deudas | How to get out of debt | Un minicurso para salir de deudas paso a paso. | A mini-course to get out of debt step by step. | provisional |
| `guide-wallets` | guide | wallets | email | yes (2nd) | Sistema de Billeteras | The Wallet System | Cada ingreso y cada beneficio con un propósito. | Every income and every benefit with a purpose. | provisional |
| `guide-corporate-benefits` | guide | investing | download | yes (3rd) | Cómo aprovechar tus beneficios corporativos | How to make the most of your corporate benefits | Convierte los beneficios de tu carrera en capital para invertir. | Turn your career's benefits into capital to invest. | provisional |
| `template-debt` | template | debt | download | no | Plantilla para salir de deudas | Debt payoff template | Organiza tus deudas y define el orden para pagarlas. | Organize your debts and decide the order to pay them. | provisional |
| `checklist-investing` | checklist | investing | download | no | Checklist para empezar a invertir | Checklist to start investing | Lo que conviene tener claro antes de tu primera inversión. | What to be clear about before your first investment. | provisional |
| `class-mindset` | class | mindset | email | no | Clase: tu relación con el dinero | Class: your relationship with money | Una clase grabada sobre mentalidad y dinero. | A recorded class on mindset and money. | provisional |
| `guide-investing` | guide | investing | email | no | Guía para invertir desde tu salario | Guide to investing from your salary | Primeros pasos para que tu salario trabaje para ti. | First steps so your salary works for you. | provisional |
| `template-budget` | template | wallets | download | no | Plantilla de presupuesto por billeteras | Wallet budget template | Reparte tu ingreso en billeteras con propósito. | Split your income into wallets with a purpose. | provisional |
| `diagnostic-benefits` | guide | investing | email | no | Radiografía de beneficios corporativos | Corporate benefits X-ray | Descubre cuánto valen hoy los beneficios de tu empresa y cómo convertirlos en capital. | Find out what your company's benefits are worth today and how to turn them into capital. | provisional |
| `diagnostic-investor` | guide | investing | email | no | Diagnóstico de inversionista | Investor diagnosis | Descubre qué tipo de inversionista eres hoy y por dónde empezar. | Find out what kind of investor you are today and where to start. | provisional |

All titles and descriptions are provisional: the brief marks the resource names as still to come (`PROJECT_SPEC.md` §16). `diagnostic-benefits` and `diagnostic-investor` are the two resources Gaby's review names (2026-11-08); their titles are hers, their descriptions are the team's, and both are under construction (human owner, 2026-11-08). The `home` column no longer places cards on the Home (the calculator replaced the resources teaser, §5.10); it is kept for the resource data file. `minicourse-debt` is the featured mini-course (§7.1) and the one the VIP not-ready screen offers (§8.5). The call to action of each card follows its type and access: `download` → `resource.cta.download`; `email` → `resource.cta.guide`, `resource.cta.class` or `resource.cta.minicourse` by type.

The page ends with the short VIP band (§4: `vip_band.short_title`, `cta.vip_apply`).

## 8. VIP mentorship (`/es/mentoria-vip/`, `/en/vip-mentorship/`)

### 8.1 Page intro

| Key | Español | English | Status |
|---|---|---|---|
| `vip.eyebrow` | Mentoría VIP · Wealth Mastery | VIP Mentorship · Wealth Mastery | approved |
| `vip.title` | ¿Quieres trabajar *directamente conmigo*? | Do you want to work *directly with me*? | approved |
| `vip.lead` | = `vip_band.body` | = `vip_band.body` | approved |
| `vip.steps.1` | Llena la aplicación | Fill in the application | provisional |
| `vip.steps.2` | Mira el video de Gaby | Watch Gaby's video | provisional |
| `vip.steps.3` | Agenda tu llamada inicial (si calificas) | Book your initial call (if you qualify) | provisional |

### 8.2 Video module

| Key | Español | English | Status |
|---|---|---|---|
| `vip.video.title` | Conoce la mentoría | Get to know the mentorship | provisional |
| `vip.video.placeholder` | Video de Gaby: disponible pronto | Gaby's video: coming soon | provisional |

The module holds Gaby's VSL (her sales video), which she will record again for the new audience (brief 2026-11-08, §3 note 4). Until it arrives the placeholder stays.

### 8.3 Application form (`#aplicar`)

Labels, hints, options and errors are the phase 1 form copy, unchanged except the title and the line under the submit button.

| Key | Español | English | Status |
|---|---|---|---|
| `form.title` | Aplica a la Mentoría VIP | Apply to the VIP Mentorship | approved |
| `form.name.label` | Nombre completo | Full name | approved |
| `form.name.hint` | Escribe tu nombre y apellido(s). | Enter your first and last name. | approved |
| `form.email.label` | Correo electrónico | Email | approved |
| `form.phone.label` | WhatsApp | WhatsApp | approved |
| `form.phone.hint` | Incluye el código de país. Ejemplo: +50684104791 | Include your country code. Example: +50684104791 | approved |
| `form.screening.prompt` | Si este programa encaja con lo que buscas, ¿cuál es tu disposición para invertir en mejorar tu salud financiera? | If this program fits what you're looking for, how willing are you to invest in improving your financial health? | approved |
| `form.screening.ready_to_invest` | Quiero invertir si el programa es adecuado para mí. | I want to invest if the program is right for me. | approved |
| `form.screening.needs_investment_info` | Tengo disposición, pero necesito conocer la inversión primero. | I am willing, but I need to understand the investment first. | approved |
| `form.screening.no_capacity_now` | Me interesa, pero actualmente no tengo capacidad para invertir. | I am interested, but I do not currently have the capacity to invest. | approved |
| `form.screening.exploring` | Solo estoy explorando por ahora. | I am only exploring for now. | approved |
| `form.consent` | Acepto el tratamiento de mis datos personales según el [Aviso de Privacidad]. | I agree to the processing of my personal data as described in the [Privacy Notice]. | approved |
| `form.submit` | Enviar mi aplicación | Submit my application | approved |
| `form.submitting` | Enviando… | Sending… | approved |
| `form.trust` | Llamada inicial sin costo · Tus datos protegidos (Ley 8968) | Free initial call · Your data is protected (Costa Rica Law 8968) | approved |

`[...]` in `form.consent` is the link that opens the privacy notice dialog (not a placeholder). The phone label follows the brief ("WhatsApp"); the field, its validation and its contract name (`phone`) are unchanged.

Submit label decided by the human owner (2026-10-16): "Enviar mi aplicación" replaces the brief's "Enviar y agendar mi llamada", because the scheduler appears only for the qualified answers (`ready_to_invest`, `needs_investment_info`), never for `no_capacity_now` or `exploring` (FR-010, US-023 AC4–AC5). Step 3 says the call depends on qualifying.

### 8.4 Errors

| Key | Español | English | Status |
|---|---|---|---|
| `form.error.required` | Este campo es obligatorio. | This field is required. | approved |
| `form.error.too_short` | Es demasiado corto. | This is too short. | approved |
| `form.error.too_long` | Es demasiado largo. | This is too long. | approved |
| `form.error.invalid_characters` | Usa solo letras, espacios, apóstrofos, guiones o puntos. | Use only letters, spaces, apostrophes, hyphens, or periods. | approved |
| `form.error.full_name_required` | Escribe tu nombre completo: nombre y al menos un apellido. | Please enter your full name: first name and at least one last name. | approved |
| `form.error.invalid_format.email` | Escribe un correo válido, por ejemplo nombre@dominio.com. | Enter a valid email, for example name@domain.com. | approved |
| `form.error.invalid_format.phone` | Escribe el número con código de país, por ejemplo +50684104791. | Enter the number with country code, for example +50684104791. | approved |
| `form.error.invalid_option` | Selecciona una opción. | Please select an option. | approved |
| `form.error.consent_required` | Necesitamos tu aceptación para poder guardar tus datos. | We need your consent to save your information. | approved |
| `form.error.submission` | No pudimos guardar tu información. Por favor, inténtalo de nuevo en unos minutos. Si el problema continúa, escríbenos a {contact_email}. | We couldn't save your information. Please try again in a few minutes. If the problem continues, email us at {contact_email}. | approved |
| `form.error.rate_limited` | Recibimos varios intentos seguidos desde tu conexión. Por favor, espera unos minutos e inténtalo de nuevo. Si lo prefieres, escríbenos a {contact_email}. | We received several attempts in a row from your connection. Please wait a few minutes and try again. If you prefer, email us at {contact_email}. | approved |

Field errors are keyed by the contract's error codes (`LEAD_API_CONTRACT.md`).

### 8.5 After a successful application

Qualified answers (`ready_to_invest`, `needs_investment_info`), US-023 AC4:

| Key | Español | English | Status |
|---|---|---|---|
| `thanks.qualified.title` | ¡Gracias por tu información! | Thank you for your information! | approved |
| `thanks.qualified.body` | Es posible que te contactemos por correo electrónico o WhatsApp. Si lo deseas, puedes agendar ahora tu llamada inicial: | We may reach out by email or WhatsApp. If you'd like, you can book your initial call now: | approved |
| `thanks.calendly_fallback` | No pudimos cargar el calendario. Escríbenos a {contact_email} y coordinamos tu llamada. | We couldn't load the calendar. Email us at {contact_email} and we'll arrange your call. | approved |

Not-ready answers (`no_capacity_now`, `exploring`), US-023 AC5:

| Key | Español | English | Status |
|---|---|---|---|
| `thanks.not_ready.title` | Gracias por contarnos dónde estás hoy. | Thank you for telling us where you are today. | provisional |
| `thanks.not_ready.body` | Es posible que te contactemos por correo electrónico o WhatsApp. Cuando sea tu momento, aquí estaremos. Mientras tanto, puedes empezar gratis con el minicurso: | We may reach out by email or WhatsApp. When the time is right for you, we'll be here. In the meantime, you can start for free with the mini-course: | provisional |
| `thanks.not_ready.more` | = `cta.all_resources` | = `cta.all_resources` | approved |

Below `thanks.not_ready.body` the `minicourse-debt` card (§7.3) is shown with its current state (pending until its file exists, US-024 AC4).

### 8.6 Preview mode (US-027)

| Key | Español | English | Status |
|---|---|---|---|
| `preview.badge` | Vista previa | Preview | approved |
| `preview.banner` | Vista previa del sitio en construcción. Los formularios no envían ni guardan nada. | Preview of the site under construction. Forms do not send or save anything. | approved |
| `preview.form_note` | Esto es una demostración: no se envió ni se guardó nada. | This is a demonstration: nothing was sent or saved. | approved |
| `preview.scheduler` | Aquí aparecerá el calendario para agendar la llamada. | The calendar to book the call will appear here. | approved |

## 9. Privacy notice (page `/es/privacidad/`, `/en/privacy/`, and the dialog from the consent link)

**DRAFT — requires legal review before public launch (US-018).** The page and the dialog show the same text. Starting point: the phase 1 notice (`src/i18n/{es,en}/form.ts`, `privacyNotice`), with the phase 2 changes applied (name, phone (WhatsApp), VIP mentorship, "this site"). All keys are `provisional` until US-018 replaces them with the reviewed text.

| Key | Español | English | Status |
|---|---|---|---|
| `privacy.title` | Aviso de Privacidad | Privacy Notice | provisional |
| `privacy.draft_label` | Borrador — pendiente de revisión legal | Draft — pending legal review | provisional |
| `privacy.close` | Cerrar | Close | provisional |
| `privacy.p1` | Responsable del tratamiento: Gaby Kelly (Gabriela Kelly). Contacto: {contact_email} (dato por confirmar). | Responsible party: Gaby Kelly (Gabriela Kelly). Contact: {contact_email} (to be confirmed). | provisional |
| `privacy.p2` | Datos que recopilamos: nombre completo, correo electrónico, teléfono (WhatsApp), tu respuesta a la pregunta de preselección, el idioma en el que ves el sitio, y la fecha y hora de tu envío. Si usas la calculadora, guardamos tu nombre, tu correo, tu WhatsApp si lo das, tu resultado (meses y zona), si aceptaste recibir los correos de Gaby, el idioma y la fecha y hora; las cifras que escribes en la calculadora no se guardan. | Data we collect: full name, email, phone (WhatsApp), your pre-screening answer, the language you viewed the site in, and the date and time of your submission. If you use the calculator, we store your name, your email, your WhatsApp if you give it, your result (months and zone), whether you agreed to receive Gaby's emails, the language, and the date and time; the figures you enter in the calculator are not stored. | provisional |
| `privacy.p3` | Para qué los usamos: para contactarte sobre la llamada inicial y la Mentoría VIP, para priorizar las llamadas y, si usas la calculadora, para mostrarte tu resultado y enviártelo por correo con la guía y, solo si lo aceptas, enviarte los correos de Gaby, de los que puedes darte de baja en cualquier momento. No los usamos para ningún otro fin ni los vendemos. | Purpose: to contact you about the initial call and the VIP Mentorship, to prioritize calls and, if you use the calculator, to show you your result and email it to you with the guide and, only if you agree, to send you Gaby's emails, which you can unsubscribe from at any time. We do not use it for any other purpose and do not sell it. | provisional |
| `privacy.p4` | Con quién los compartimos: con Google (almacenamiento en Google Sheets) y Calendly (agendamiento de la llamada), que pueden almacenar información fuera de Costa Rica. | Who we share it with: Google (Google Sheets storage) and Calendly (scheduling the call), which may store data outside Costa Rica. | provisional |
| `privacy.p5` | Carácter voluntario: brindar tus datos es opcional. Sin ellos no podemos procesar tu aplicación, agendar tu llamada ni mostrarte el resultado de la calculadora desde este sitio. | Voluntary nature: providing your data is optional. Without it, we cannot process your application, schedule your call or show you the calculator's result from this site. | provisional |
| `privacy.p6` | Tus derechos: puedes solicitar acceso, rectificación, cancelación (eliminación) u oposición al tratamiento de tus datos escribiendo a {contact_email}. | Your rights: you can request access, rectification, cancellation (deletion), or opposition to the processing of your data by emailing {contact_email}. | provisional |
| `privacy.p7` | Plazo de conservación: por definir; se actualizará cuando se complete la revisión legal. | Retention period: to be defined; this will be updated once legal review is complete. | provisional |
| `privacy.p8` | Cada envío queda asociado a la versión de este aviso vigente en el momento de tu envío. | Each submission is associated with the version of this notice in effect at the time you submitted it. | provisional |

v0.2 adds the calculator (US-035, US-036): `privacy.p2`, `privacy.p3` and `privacy.p5` cover its data, purpose and voluntary nature; `PRIVACY_NOTICE_VERSION` is bumped with this text. The scheduler (`privacy.p4`) changes with US-037 (GoHighLevel instead of Calendly, ADR-006).

The privacy notice shows its own DRAFT label (`privacy.draft_label`), not the pending badge. Resource requests by email (US-025) are added to the notice before phase 2b goes live (US-025 AC6).

## 10. Pending badge

| Key | Español | English | Status |
|---|---|---|---|
| `pending.badge` | Pendiente de validación | Pending validation | approved |

---

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
