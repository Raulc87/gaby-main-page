# CONTENT — Gaby Kelly website (Spanish source → English)

Every visitor-facing string of the phase 2 site lives here, keyed, in both languages. `UX_UI_DIRECTION.md` says how the site looks and behaves; this file says what it says. It is the **only** source of visitor-facing copy for phase 2 (`PROJECT_CONTEXT.md`). Implementation copies each string verbatim into the translation files (`src/i18n/<lang>/*`). Changing copy means changing this file first (`AGENTS.md` → Change management), then the code.

## Metadata
- Version: 0.1
- Status: Proposed for Sprint 003 (this PR)
- Owner: Gaby Kelly approves copy; the human owner records it here
- Source language: Spanish. Later changes start in Spanish and are translated in the same PR.
- Sources: Gaby's brief (`docs/ux/BRIEF_2026-10-15.md`) for the Spanish copy she wrote, quoted verbatim; the phase 1 form copy (`UX_UI_DIRECTION.md` v0.8 §4, sections 7–8, kept unchanged); proposals by the project team where the brief has no copy.
- Rules: no guaranteed outcomes (BR-003); gender-neutral, inclusive language toward the visitor in both languages (BR-005; Gaby's first-person story may describe herself); the initial call is free, the mentorship is not (BR-008); "Gaby Kelly", "Método Polaris" / "Polaris Method", "Wealth Mastery" (BR-009); no invented testimonials, logos, files or figures (BR-011).
- **Status column:**
  - `approved`: the Spanish is Gaby's (from her brief) or was approved earlier; the English is a translation.
  - `provisional`: proposed by the team, or a placeholder in the brief itself (`[...]` there); shown with the pending badge in preview builds.
  - **All English values are provisional** until Gaby validates them (one review of the English as a whole); that does not add badges.
- Values are copied verbatim and never contain markers. The code keeps the list of provisional keys next to the strings (`UX_UI_DIRECTION.md` §7).
- **Pending badge (which keys show one):** only content blocks, never navigation, accessibility labels, alt text, metadata or state messages. Two kinds (`UX_UI_DIRECTION.md` §6.5):
  - **Placeholders** (content that has not arrived; BR-011), badge in **every** build, production included, until the real content replaces them: the testimonial cards (§5.7), the story photo and bio placeholders (§6), the VIP video module (§8.2), and every resource card whose file has not been delivered (§7.3).
  - **Provisional copy blocks**, badge in preview and development builds only: the Método Polaris steps (§5.4), the VIP steps (§8.1), the not-ready screen (§8.5), and resource cards with provisional titles. Before any production release, each of these is approved or the human owner decides per block whether it ships (as the phase 1 go-live gate did).
  - No badge: `nav.*`, `skip_link`, `lang.*`, `meta.*`, `*_alt`, `resource.cover_alt`, `resources.filter.label`, `resources.empty`, `resource.pending`, `resource.email.coming_soon`, `story.media.label`, `story.experience.label`, `preview.*`, `privacy.*` (the notice has its own DRAFT label).
- `*text*` marks the italic emphasis (Playfair italic, `UX_UI_DIRECTION.md` §2) inside a heading; the asterisks are not part of the text.
- `{contact_email}` is replaced with a `mailto:` link to `PUBLIC_CONTACT_EMAIL`.

---

## 1. Site metadata (per page)

| Key | Español | English | Status |
|---|---|---|---|
| `meta.site_name` | Gaby Kelly | Gaby Kelly | approved |
| `meta.home.title` | Gaby Kelly — Del mundo corporativo a tu libertad financiera | Gaby Kelly — From corporate life to your financial freedom | approved |
| `meta.home.description` | Mentoría financiera para ejecutivos y profesionales de transnacionales: ordena tu dinero, aprovecha los beneficios de tu carrera e invierte para construir patrimonio. | Financial mentorship for executives and professionals at multinational companies: organize your money, make the most of your career's benefits and invest to build wealth. | provisional |
| `meta.story.title` | Mi historia — Gaby Kelly | My story — Gaby Kelly | provisional |
| `meta.story.description` | Del mundo corporativo a mi libertad: la historia de Gaby Kelly. | From corporate life to my freedom: Gaby Kelly's story. | provisional |
| `meta.resources.title` | Recursos gratis — Gaby Kelly | Free resources — Gaby Kelly | provisional |
| `meta.resources.description` | Guías, plantillas y minicursos gratuitos para ordenar, invertir y crecer. | Free guides, templates and mini-courses to organize, invest and grow. | provisional |
| `meta.vip.title` | Mentoría VIP · Wealth Mastery — Gaby Kelly | VIP Mentorship · Wealth Mastery — Gaby Kelly | provisional |
| `meta.vip.description` | Aplica para trabajar directamente con Gaby y agenda tu llamada inicial sin costo. | Apply to work directly with Gaby and book your free initial call. | provisional |
| `meta.privacy.title` | Aviso de privacidad — Gaby Kelly | Privacy notice — Gaby Kelly | provisional |
| `meta.privacy.description` | Cómo tratamos tus datos personales según la Ley 8968. | How we handle your personal data under Costa Rica Law 8968. | provisional |

## 2. Header, navigation and language

| Key | Español | English | Status |
|---|---|---|---|
| `nav.brand` | Gaby Kelly | Gaby Kelly | approved |
| `nav.story` | Mi historia | My story | approved |
| `nav.method` | Método Polaris | Polaris Method | approved |
| `nav.resources` | Recursos gratis | Free resources | approved |
| `nav.blog` | Blog | Blog | approved |
| `nav.vip` | Mentoría VIP | VIP Mentorship | approved |
| `nav.menu_open` | Abrir menú | Open menu | provisional |
| `nav.menu_close` | Cerrar menú | Close menu | provisional |
| `nav.label` | Navegación principal | Main navigation | provisional |
| `lang.toggle_label` | Cambiar idioma | Change language | approved |
| `skip_link` | Saltar al contenido | Skip to content | provisional |

`nav.blog` is not shown until US-026. `nav.method` links to the Home section `#metodo` until US-028.

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

The Home and My story use `vip_band.title` and `vip_band.body`; the resource library uses `vip_band.short_title`. All bands use `cta.vip_apply` (the gold button).

## 5. Home (`/es/`, `/en/`)

### 5.1 Hero (`#hero`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.hero.eyebrow` | Del mundo corporativo a tu libertad financiera | From corporate life to your financial freedom | approved |
| `home.hero.title` | Ganas bien, pero tu dinero *no te está dando tranquilidad.* | You earn well, but your money *isn't giving you peace of mind.* | approved |
| `home.hero.lead` | Mentoría financiera para ejecutivos y profesionales de transnacionales. Te acompaño a ordenar tu dinero, aprovechar los beneficios de tu carrera e invertir para construir patrimonio y libertad. | Financial mentorship for executives and professionals at multinational companies. I help you organize your money, make the most of your career's benefits, and invest to build wealth and freedom. | approved |
| `home.hero.cta` | = `cta.vip_long` | = `cta.vip_long` | approved |
| `home.hero.secondary` | = `cta.start_free` | = `cta.start_free` | approved |
| `home.hero.trust` | 18 años en el mundo corporativo · Más de 10 años invirtiendo | 18 years in the corporate world · More than 10 years investing | approved |
| `home.hero.photo_alt` | Gaby Kelly sonriendo | Gaby Kelly smiling | provisional |

### 5.2 The corporate ladder (`#escalera`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.ladder.title` | Subiste la escalera corporativa. *¿Y tu libertad?* | You climbed the corporate ladder. *What about your freedom?* | approved |
| `home.ladder.p1` | Más rango, más gente a cargo, cuotas cada vez más altas, aumentos, viajes. Por fuera, todo va bien. | A higher rank, more people reporting to you, ever-higher quotas, raises, travel. From the outside, everything is going well. | approved |
| `home.ladder.p2` | Pero aunque trabajes desde casa, tu mente no está ahí. Está en la cuota, en el equipo, en la próxima reunión. Cada vez más cosas dependen de ti, y sientes que *todo depende de ti*. | But even when you work from home, your mind isn't there. It's on the quota, the team, the next meeting. More and more things depend on you, and you feel that *everything depends on you*. | approved |
| `home.ladder.p3` | Mientras tanto, cada aumento se va en un estilo de vida un poco más caro y, si mañana tu puesto cambiara, no sabrías con certeza cuántos meses podrías sostenerte. | Meanwhile, every raise goes into a slightly more expensive lifestyle, and if your position changed tomorrow, you wouldn't know for sure how many months you could sustain yourself. | approved |
| `home.ladder.closing` | Nadie debería tener que elegir entre su carrera y estar presente para su familia. | No one should have to choose between their career and being present for their family. | approved |

### 5.3 The opportunity (`#oportunidad`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.opportunity.eyebrow` | La oportunidad que tienes en las manos | The opportunity in your hands | approved |
| `home.opportunity.title` | Tu carrera ya te dio las herramientas. *Te falta el sistema.* | Your career already gave you the tools. *What's missing is the system.* | approved |
| `home.opportunity.lead` | Si no inflas tu estilo de vida, los beneficios corporativos se convierten en capital para invertir. Casi nadie te enseña a verlos así. | If you don't inflate your lifestyle, corporate benefits become capital to invest. Almost no one teaches you to see them that way. | approved |
| `home.opportunity.1.title` | Salario alto y aumentos | A high salary and raises | approved |
| `home.opportunity.1.body` | Cada aumento puede ir a tu patrimonio, no a un estilo de vida más caro. | Every raise can go to your wealth, not to a more expensive lifestyle. | approved |
| `home.opportunity.2.title` | Seguros médicos y de vida | Health and life insurance | approved |
| `home.opportunity.2.body` | Gastos que ya están cubiertos y no tienes que pagar de tu bolsillo. | Expenses already covered that you don't pay out of pocket. | approved |
| `home.opportunity.3.title` | Carro y allowances | Car and allowances | approved |
| `home.opportunity.3.body` | Beneficios que liberan flujo de caja cada mes. | Benefits that free up cash flow every month. | approved |
| `home.opportunity.4.title` | Viajes y viáticos | Travel and per diems | approved |
| `home.opportunity.4.body` | Comida y viajes pagados que no salen de tu presupuesto. | Paid meals and trips that don't come out of your budget. | approved |
| `home.opportunity.5.title` | Inglés y acceso a Estados Unidos | English and access to the United States | approved |
| `home.opportunity.5.body` | Puertas a plataformas y mercados de inversión internacionales. | Doors to international investment platforms and markets. | approved |
| `home.opportunity.6.title` | Roce y contactos | Exposure and contacts | approved |
| `home.opportunity.6.body` | Una red que vale oro cuando decides construir algo propio. | A network worth gold when you decide to build something of your own. | approved |

### 5.4 Método Polaris (`#metodo`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.method.eyebrow` | El Método Polaris | The Polaris Method | approved |
| `home.method.title` | Tres pasos para que tu salario *trabaje para ti.* | Three steps so your salary *works for you.* | approved |
| `home.method.1.title` | Define tu Norte | Define your North | provisional |
| `home.method.1.body` | Claridad sobre lo que quieres y sobre tu relación con el dinero. | Clarity about what you want and about your relationship with money. | provisional |
| `home.method.2.title` | Ordena tu dinero | Organize your money | provisional |
| `home.method.2.body` | Tu sistema de billeteras: cada ingreso y cada beneficio con un propósito. | Your wallet system: every income and every benefit with a purpose. | provisional |
| `home.method.3.title` | Invierte y construye patrimonio | Invest and build wealth | provisional |
| `home.method.3.body` | Decisiones de inversión conscientes, alineadas con la vida que quieres. | Deliberate investment decisions, aligned with the life you want. | provisional |

The three steps are Gaby's words from the brief, but the brief lists the official Método Polaris steps as still to come, so they are provisional (`PROJECT_SPEC.md` §16, US-028). The brief says "Sistema Polaris" here; the name is "Método Polaris" (BR-009).

### 5.5 Free resources teaser (`#recursos`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.resources.eyebrow` | Recursos gratuitos | Free resources | approved |
| `home.resources.title` | Empieza hoy, *sin costo.* | Start today, *at no cost.* | approved |
| `home.resources.cta` | = `cta.all_resources` | = `cta.all_resources` | approved |

The three cards are the resources marked `home: yes` in §7.3, in that order.

### 5.6 My story teaser (`#historia`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.story.eyebrow` | Mi historia | My story | approved |
| `home.story.title` | Del mundo corporativo *a mi libertad.* | From corporate life *to my freedom.* | approved |
| `home.story.p1` | = `story.p1` | = `story.p1` | approved |
| `home.story.p2` | = `story.p2` | = `story.p2` | approved |
| `home.story.p3` | = `story.p3` | = `story.p3` | approved |
| `home.story.cta` | = `cta.read_story` | = `cta.read_story` | approved |

Media names below the text: §6, `story.media.*`.

### 5.7 Testimonials (`#testimonios`)

| Key | Español | English | Status |
|---|---|---|---|
| `home.testimonials.title` | Lo que dicen quienes ya dieron el paso. | What people who already took the step say. | approved |
| `testimonial.placeholder.text` | Testimonio de una clienta o cliente | Client testimonial | provisional |
| `testimonial.placeholder.video` | Testimonio en video de una clienta o cliente | Video testimonial from a client | provisional |
| `testimonial.placeholder.attribution` | Nombre · cargo · empresa o industria | Name · role · company or industry | provisional |

Three placeholder cards (two text, one video) until real, authorized testimonials arrive (BR-011, US-017). The brief asks for a mix, ideally including a man or a couple.

### 5.8 VIP band (`#vip`)

`vip_band.eyebrow`, `vip_band.title`, `vip_band.body`, `cta.vip_apply` (§4).

## 6. My story (`/es/mi-historia/`, `/en/my-story/`)

| Key | Español | English | Status |
|---|---|---|---|
| `story.eyebrow` | Mi historia | My story | approved |
| `story.title` | Del mundo corporativo *a mi libertad.* | From corporate life *to my freedom.* | approved |
| `story.p1` | Trabajé 18 años en el mundo corporativo como gerente de ventas de canales de distribución, con partners de Intel, Microsoft y Oracle. Cuotas cada vez más altas, viajes, buenos beneficios. | I worked for 18 years in the corporate world as a sales manager for distribution channels, with Intel, Microsoft and Oracle partners. Ever-higher quotas, travel, good benefits. | approved |
| `story.p2` | Era mamá sola, y por subir la escalera sacrifiqué mucho tiempo con mi hija. Estaba presente en cuerpo, pero mi cabeza seguía en el trabajo. Y me di cuenta tarde de la oportunidad que tenía en las manos para construir otra cosa. | I was a single mother, and climbing the ladder cost me a lot of time with my daughter. I was there in body, but my mind was still at work. And I realized late the opportunity I had in my hands to build something else. | approved |
| `story.p3` | Hoy, después de más de 10 años construyendo mi portafolio junto a asesores especializados, acompaño a ejecutivos y profesionales corporativos a convertir un buen salario en patrimonio, sin esperar tanto como yo. | Today, after more than 10 years building my portfolio with specialized advisors, I help corporate executives and professionals turn a good salary into wealth, without waiting as long as I did. | approved |
| `story.media.label` | Me han entrevistado en | I've been interviewed on | provisional |
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

All titles and descriptions are provisional: the brief marks the resource names as still to come (`PROJECT_SPEC.md` §16). `minicourse-debt` is the featured mini-course (§7.1) and the one the VIP not-ready screen offers (§8.5). The call to action of each card follows its type and access: `download` → `resource.cta.download`; `email` → `resource.cta.guide`, `resource.cta.class` or `resource.cta.minicourse` by type.

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
| `privacy.p2` | Datos que recopilamos: nombre completo, correo electrónico, teléfono (WhatsApp), tu respuesta a la pregunta de preselección, el idioma en el que ves el sitio, y la fecha y hora de tu envío. | Data we collect: full name, email, phone (WhatsApp), your pre-screening answer, the language you viewed the site in, and the date and time of your submission. | provisional |
| `privacy.p3` | Para qué los usamos: para contactarte sobre la llamada inicial y la Mentoría VIP, y para priorizar las llamadas. No los usamos para ningún otro fin ni los vendemos. | Purpose: to contact you about the initial call and the VIP Mentorship, and to prioritize calls. We do not use it for any other purpose and do not sell it. | provisional |
| `privacy.p4` | Con quién los compartimos: con Google (almacenamiento en Google Sheets) y Calendly (agendamiento de la llamada), que pueden almacenar información fuera de Costa Rica. | Who we share it with: Google (Google Sheets storage) and Calendly (scheduling the call), which may store data outside Costa Rica. | provisional |
| `privacy.p5` | Carácter voluntario: brindar tus datos es opcional. Sin ellos no podemos procesar tu aplicación ni agendar tu llamada desde este sitio. | Voluntary nature: providing your data is optional. Without it, we cannot process your application or schedule your call from this site. | provisional |
| `privacy.p6` | Tus derechos: puedes solicitar acceso, rectificación, cancelación (eliminación) u oposición al tratamiento de tus datos escribiendo a {contact_email}. | Your rights: you can request access, rectification, cancellation (deletion), or opposition to the processing of your data by emailing {contact_email}. | provisional |
| `privacy.p7` | Plazo de conservación: por definir; se actualizará cuando se complete la revisión legal. | Retention period: to be defined; this will be updated once legal review is complete. | provisional |
| `privacy.p8` | Cada envío queda asociado a la versión de este aviso vigente en el momento de tu envío. | Each submission is associated with the version of this notice in effect at the time you submitted it. | provisional |

The privacy notice shows its own DRAFT label (`privacy.draft_label`), not the pending badge. Resource requests by email (US-025) are added to the notice before phase 2b goes live (US-025 AC6).

## 10. Pending badge

| Key | Español | English | Status |
|---|---|---|---|
| `pending.badge` | Pendiente de validación | Pending validation | approved |
