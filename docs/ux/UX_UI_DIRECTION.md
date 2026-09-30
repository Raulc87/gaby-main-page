# UX_UI_DIRECTION — v0.8

v0.8 (2026-09-30): honeypot redesigned after browser autofill filled it during the human owner's local test and a real lead was dropped (section 4, Section 7; US-013 reopened).

v0.7 (2026-09-29): decisions from the review of #34 (human owner) — `field-line` token for form control borders, which must reach 3:1 (section 2.1); field errors use Tailwind `red-700`, no brand token (section 2.1).

v0.6 (2026-09-29): review fix on v0.5 — the offer band's third point used "Vemos juntos" (masculine plural), violating BR-005; reworded gender-neutral (section 4, Section 6). Also recorded that check-mark icons on navy/dark panels use `gold`, not `brand`, for contrast (section 2.1 motif rules).
v0.5 (2026-09-29): resolved open items from the US-015/US-017 review (human owner) — `gold-ink`, not `gold`, for the proof cards' quote mark (section 2.1); the eyebrow treatment is Roadmap-only for now (section 2.1); confirmed the English roadmap label "Step" (section 4, Section 3); the guide's "Approach" placeholder chip label (section 4, Section 4); the offer band's three points, proposed placeholder content pending Gabriela's review (section 4, Section 6); a distinct video-testimonial placeholder caption (section 4, Section 5).
v0.4 (2026-09-28): rate-limit message and honeypot field (section 4, Section 7, US-013); video testimonials in the proof section (Section 5, US-017).

All copy in this document is **proposed** and pending Gabriela's review (BR-004). It is written in gender-neutral language in both Spanish and English (BR-005): no gendered adjectives or participles referring to the visitor (e.g. avoid "listo/lista", "preparado/preparada"); prefer nouns ("disposición", "una persona"), verbs, and second-person constructions.

## 1. Experience Goal

The page should feel calm, clear, professional, and trustworthy.

It should communicate progress and financial organization without using aggressive "get rich" aesthetics or fear-heavy sales tactics.

## 2. Visual Direction

- Clean and modern
- Professional but approachable
- Strong spacing and hierarchy
- Short, scannable text blocks
- Neutral and inclusive language
- Avoid excessive visual clutter

## 2.1 Visual Identity — Proposal A "Institucional" (approved 2026-09-25)

Chosen by the human owner from two explorations. Reference mockup (visual reference only, not code): https://claude.ai/artifact/1HSbf43ykt2J6LphBVBH9G

Character: light, corporate, serious. Navy carries weight, gold is a sparing accent, and the half-circle from Gaby's slide deck is the one recurring motif.

### Color tokens

Brand colors sampled from Gaby's existing slide deck. Implement as Tailwind theme tokens in `src/styles/global.css`, replacing the provisional palette; components use tokens, never hex literals.

| Token | Hex | Use |
|---|---|---|
| `paper` | `#F6F8FB` | Page background (cool neutral biased toward the brand blue) |
| `surface` | `#FFFFFF` | Cards, hero copy panel, form |
| `ink` | `#15243B` | Body text, footer background |
| `navy` | `#22395A` | Headings, primary buttons, large brand panels |
| `brand` | `#3C5F8E` | Brand blue from the deck: links, italic emphasis, icons, eyebrows |
| `gold` | `#F1BE48` | Brand gold from the deck: half-circle motif, eyebrow rules, focus rings. Fill only on light backgrounds; never as text on white |
| `gold-ink` | `#7A5A0E` | Gold-family text on white (e.g. "PASO 1"), passes WCAG AA |
| `muted` | `#5A6A80` | Secondary text, hints |
| `line` | `#D8DFE9` | Decorative borders and dividers only (1.3:1, not enough for a control boundary) |
| `field-line` | `#7D8BA0` | Derived from `muted`. Borders of form controls: text inputs, screening option rows, the consent checkbox. 3.25:1 on `paper`, 3.46:1 on `surface` (WCAG 1.4.11 needs 3:1) |

### Typography

| Role | Face | Weights |
|---|---|---|
| Headings, italic emphasis, closing statement | Crimson Pro (Google Fonts) | 600; italic 500 for emphasized words |
| Body, labels, form, buttons | IBM Plex Sans (Google Fonts) | 400, 500, 600 |
| Wordmark (only until the real logo file arrives) | Playfair Display | 900 "GK", 400 "GabyKelly" |

- Scale: hero headline 38–60px fluid, section titles 30–42px, body 17–19px, eyebrow labels 12px uppercase with 0.16em tracking.
- Headings use `text-wrap: balance`; running text at most ~65 characters wide.
- Replaces the provisional Inter font.

### Components and layout

- **Header:** sticky, light background with a bottom border; wordmark left, `ES | EN` toggle right (active language as a navy fill).
- **Eyebrow:** 28px gold rule + uppercase `brand` label. Applied only to the Roadmap's step markers ("PASO 1–3" / "STEP 1–3", in `gold-ink` — see Roadmap below) for now; no other section carries a top-of-section eyebrow (human owner decision, 2026-09-29).
- **Hero:** two columns on desktop. Left: white panel with headline (italic `brand` emphasis on the second half), lead text, navy CTA, and the trust row from section 4, Section 1 (free initial call per BR-008; data protection per FR-013). Right: navy panel with a large gold circle bleeding off the right edge and Gabriela's round portrait (white 8px ring, soft shadow) over it. Stacks on mobile (copy first).
- **Buttons:** navy fill, white text, 2px radius, min height 52px, arrow icon; hover shifts to `brand` and lifts 2px.
- **Roadmap:** one bordered row of three cells ("PASO 1–3" in Spanish / "STEP 1–3" in English, both in `gold-ink`, line icon, Crimson Pro step name); stacks with horizontal dividers on mobile.
- **Guide:** round portrait (white ring + thin gold outline) beside the text; pending-validation chips for bio, credentials, and approach.
- **Proof:** dashed-border placeholder cards with a `gold-ink` opening quote mark (not `gold`, to stay off the "never as text on white" rule) until real testimonials exist.
- **Offer:** full-width navy band with a gold circle in the bottom-right corner and three check-marked points.
- **Form:** white card with a 4px navy top border; `paper` input fills with a 1px `field-line` border; screening options as `field-line` bordered rows that highlight in `brand` when selected. Field and submission error text uses the `red-700` utility of the pinned Tailwind 4 (`oklch(50.5% 0.213 27.518)`, about `#C10007`; 6.0:1 on `paper`, 6.4:1 on `surface`); no brand error token (human owner, 2026-09-29).
- **Closing:** white band, Crimson Pro italic statement plus the CTA.
- **Footer:** `ink` background, wordmark with the gold "GabyKelly".
- Corners: 2px everywhere (sharp, corporate). No glow effects, gradients, or grain.

### Motif rules

- The gold circle or half-circle appears at most once per section, always bleeding off an edge or sitting behind the portrait, never behind body text.
- Icons are simple line icons (1.6px stroke) in `brand` on light backgrounds; on navy or other dark panels, use `gold` instead — `brand` on `navy` is 1.79:1, `gold` on `navy` is 6.77:1 (e.g. the offer band's check-marks). No emoji, no 3D illustrations.

## 3. Language Behavior (FR-012, ADR-003)

- Two versions of the page: Spanish at `/es/`, English at `/en/`.
- `/` picks the version: saved toggle choice first; otherwise Spanish if the browser's first preferred language starts with `es`, else English.
- A compact `ES | EN` toggle sits at the top right of a slim header that stays visible while scrolling. The active language is highlighted. The toggle has an accessible label ("Cambiar idioma" / "Change language").
- Switching language keeps the visitor on the same section (same anchor IDs in both versions).
- Section anchor IDs are English and identical in both versions: `#hero`, `#recognition`, `#roadmap`, `#guide`, `#proof`, `#offer`, `#lead-form`, `#closing`.

## 4. Page Structure and Proposed Copy

### Section 1 — Hero / Opening (`#hero`)

| | Español | English |
|---|---|---|
| Headline | Ganas bien, pero tu dinero no te está dando tranquilidad. | You earn well, but your money isn't giving you peace of mind. |
| Supporting line | No siempre se trata de generar más. A veces, el siguiente paso es ordenar mejor lo que ya tienes. | It's not always about earning more. Sometimes the next step is to better organize what you already have. |
| CTA (scrolls to `#lead-form`) | Quiero dar el primer paso | I want to take the first step |
| Trust row (below the CTA) | Llamada inicial sin costo · Tus datos protegidos (Ley 8968) | Free initial call · Your data is protected (Costa Rica Law 8968) |

### Section 2 — Recognition / Hopeful Problem Framing (`#recognition`)

**Español**

> Tener buenos ingresos no garantiza sentir claridad con el dinero. Cuando no existe una estructura clara, es fácil trabajar cada vez más sin sentir que realmente avanzas.
>
> La buena noticia es que no necesitas convertirte en una persona experta en finanzas de la noche a la mañana. Puedes empezar por ordenar, entender y tomar mejores decisiones paso a paso.

**English**

> A good income doesn't guarantee clarity with money. Without a clear structure, it's easy to keep working harder without feeling that you're really moving forward.
>
> The good news is that you don't need to become a finance expert overnight. You can start by organizing, understanding, and making better decisions step by step.

### Section 3 — Transformation Roadmap (`#roadmap`)

| Step | Español | English |
|---|---|---|
| 1 | **Ordena** — entiende con claridad dónde estás hoy. | **Organize** — understand clearly where you are today. |
| 2 | **Decide** — prioriza mejor cómo usar tus recursos. | **Decide** — prioritize how to use your resources. |
| 3 | **Construye** — empieza a crear una estructura en la que tu dinero también pueda trabajar a favor de tus objetivos. | **Build** — start creating a structure where your money can also work toward your goals. |

Step-number label (section 2.1): "Paso" in Spanish, "Step" in English (confirmed, human owner, 2026-09-29).

### Section 4 — Gabriela as Guide (`#guide`)

**Español**

> No necesitas recorrer este proceso a solas.
>
> Gabriela acompaña a personas que quieren construir una relación más clara y estratégica con sus finanzas, empezando por el orden y avanzando hacia decisiones de inversión más conscientes.

**English**

> You don't have to go through this process alone.
>
> Gabriela works with people who want to build a clearer, more strategic relationship with their finances, starting with order and moving toward more deliberate investment decisions.

Placeholders (marked "pending validation"):
- Real photo of Gabriela
- Short bio
- Relevant credentials
- Experience / approach

Chip labels (ES / EN): "Biografía breve" / "Short bio"; "Credenciales y experiencia" / "Credentials and experience"; "Enfoque" / "Approach" (confirmed, human owner, 2026-09-29).

### Section 5 — Proof / Social Validation (`#proof`)

Use real proof only when provided. Never invent testimonials or outcomes.

Placeholder structure (marked "pending validation"):
- testimonial cards
- quantified outcomes only if verifiable
- credibility statements
- client stories

Testimonial formats (US-017): text cards and video cards. Placeholders stay until real, approved testimonials are supplied (human owner, 2026-09-28). A video card shows a poster image with a play button and loads the video (and anything from its host) only when the visitor presses play; it has captions or a short text summary in the page language. The video host (self-hosted or YouTube/Vimeo) is decided before the first video is added — until that decision, the video card stays a placeholder with a decorative (non-functional) play icon, which the human owner has confirmed is fine to ship as-is (2026-09-29); when a third-party host is chosen, add it to the privacy notice's processors list (US-018).

Placeholder captions (ES / EN, confirmed human owner, 2026-09-29): text card — "Testimonio de una clienta o cliente" / "Client testimonial"; video card — "Testimonio en video de una clienta o cliente" / "Video testimonial from a client".

### Section 6 — Initial Call Offer (`#offer`)

**Español**

> En una llamada inicial revisaremos tu situación a un nivel general, conversaremos sobre lo que buscas y veremos si el programa tiene sentido para ti.

**English**

> In an initial call, we'll review your situation at a general level, talk about what you're looking for, and see whether the program makes sense for you.

Avoid guaranteed results.

Three check-marked points (section 2.1). Draft/suggested placeholder content the human owner asked for, to be refined once Gabriela reviews it (2026-09-29) — not yet validated with her, same as the rest of this document's copy (BR-004):

| Español | English |
|---|---|
| Revisamos tu situación financiera actual, sin juicios. | We review your current financial situation, without judgment. |
| Conversamos sobre tus metas y lo que buscas lograr. | We talk about your goals and what you're looking to achieve. |
| Vemos en conjunto si el programa es el siguiente paso adecuado para ti. | We see together whether the program is the right next step for you. |

### Section 7 — Lead Form (`#lead-form`)

| Element | Español | English |
|---|---|---|
| Form title | Da el primer paso | Take the first step |
| Name label | Nombre completo | Full name |
| Name hint | Escribe tu nombre y apellido(s). | Enter your first and last name. |
| Email label | Correo electrónico | Email |
| Phone label | Teléfono (WhatsApp) | Phone (WhatsApp) |
| Phone hint | Incluye el código de país. Ejemplo: +50684104791 | Include your country code. Example: +50684104791 |
| Screening prompt | Si este programa encaja con lo que buscas, ¿cuál es tu disposición para invertir en mejorar tu salud financiera? | If this program fits what you're looking for, how willing are you to invest in improving your financial health? |
| Option `ready_to_invest` | Quiero invertir si el programa es adecuado para mí. | I want to invest if the program is right for me. |
| Option `needs_investment_info` | Tengo disposición, pero necesito conocer la inversión primero. | I am willing, but I need to understand the investment first. |
| Option `no_capacity_now` | Me interesa, pero actualmente no tengo capacidad para invertir. | I am interested, but I do not currently have the capacity to invest. |
| Option `exploring` | Solo estoy explorando por ahora. | I am only exploring for now. |
| Consent checkbox | Acepto el tratamiento de mis datos personales según el [Aviso de Privacidad]. | I agree to the processing of my personal data as described in the [Privacy Notice]. |
| Submit button | Enviar y agendar mi llamada | Send and book my call |
| Submitting state | Enviando… | Sending… |

Honeypot (US-013, contract section 3.1). Browser autofill and password managers ignore `autocomplete="off"` and fill hidden fields they recognize; on 2026-09-30 this filled the old field (`name="website"` inside the lead form) and a real lead was silently dropped. The honeypot therefore:
- is a `type="text"` input inside **its own separate `<form>` element, outside the lead form** (autofill fills one form at a time, so filling the lead form never reaches it); that form has no submit button, and its `submit` event is always prevented (pressing Enter in it must not reload the page);
- has a DOM `id` and `name` that autofill heuristics do not recognize: no words such as website, url, homepage, company, name, email, phone, tel, address, or city (e.g. `id="lead-hp" name="hp_field"`), and no label, placeholder, or `title`;
- carries `autocomplete="off"` plus the password-manager opt-outs `data-1p-ignore`, `data-lpignore="true"`, `data-bwignore="true"`, and `data-form-type="other"`;
- stays off-screen (not `display: none`), with `tabindex="-1"` and `aria-hidden="true"` on its wrapper.

On submit, the lead form's script reads that input's value and sends it as the JSON field `website`; the contract (section 3.1) is unchanged. People never see or fill it.

Autofill stays a supported way to fill the form. The visible fields keep their autofill hints (`autocomplete="name"`, `"email"`, `"tel"`) and stay inside the lead form, so a browser or password manager can fill them in one step. The fix isolates the honeypot from autofill; it never disables autofill for the visible fields.

Field error messages (keyed by the contract's field error codes):

| Code | Español | English |
|---|---|---|
| `required` | Este campo es obligatorio. | This field is required. |
| `too_short` | Es demasiado corto. | This is too short. |
| `too_long` | Es demasiado largo. | This is too long. |
| `invalid_characters` | Usa solo letras, espacios, apóstrofos, guiones o puntos. | Use only letters, spaces, apostrophes, hyphens, or periods. |
| `full_name_required` | Escribe tu nombre completo: nombre y al menos un apellido. | Please enter your full name: first name and at least one last name. |
| `invalid_format` (email) | Escribe un correo válido, por ejemplo nombre@dominio.com. | Enter a valid email, for example name@domain.com. |
| `invalid_format` (phone) | Escribe el número con código de país, por ejemplo +50684104791. | Enter the number with country code, for example +50684104791. |
| `invalid_option` | Selecciona una opción. | Please select an option. |
| `consent_required` | Necesitamos tu aceptación para poder guardar tus datos. | We need your consent to save your information. |

Submission error (any non-`201` result, network failure):

| Español | English |
|---|---|
| No pudimos guardar tu información. Por favor, inténtalo de nuevo en unos minutos. Si el problema continúa, escríbenos a {contact_email}. | We couldn't save your information. Please try again in a few minutes. If the problem continues, email us at {contact_email}. |

Too many attempts (`429` / `rate_limited`, US-013; proposed copy):

| Español | English |
|---|---|
| Recibimos varios intentos seguidos desde tu conexión. Por favor, espera unos minutos e inténtalo de nuevo. Si lo prefieres, escríbenos a {contact_email}. | We received several attempts in a row from your connection. Please wait a few minutes and try again. If you prefer, email us at {contact_email}. |

### Section 8 — Thank You + Calendly (`#lead-form`, after `201`)

Shown only after a successful save. The form is replaced by:

| Element | Español | English |
|---|---|---|
| Thank-you title | ¡Gracias por tu información! | Thank you for your information! |
| Thank-you text | Es posible que te contactemos por correo electrónico o WhatsApp. Si lo deseas, puedes agendar ahora tu llamada inicial: | We may reach out by email or WhatsApp. If you'd like, you can book your initial call now: |
| Calendly fallback | No pudimos cargar el calendario. Escríbenos a {contact_email} y coordinamos tu llamada. | We couldn't load the calendar. Email us at {contact_email} and we'll arrange your call. |

- Calendly is embedded inline, full width of the content column, with name and email pre-filled.
- `{contact_email}` is a `mailto:` link to `PUBLIC_CONTACT_EMAIL` (currently `gkelly@poliartcr.com`).

### Section 9 — Closing CTA (`#closing`)

**Español**

> Si esto resuena contigo, puedes dar el primer paso con calma. Déjanos tus datos y agenda una conversación para entender si este proceso encaja contigo.

**English**

> If this resonates with you, you can take the first step at your own pace. Leave your details and book a conversation to see whether this process is a good fit for you.

### Privacy Notice (dialog opened from the consent checkbox link)

Draft structure following Costa Rica's Ley N.° 8968. **DRAFT — requires legal review before public launch.** Shown in a dialog on the same page so form data is not lost.

Required elements (ES and EN versions):
1. Responsible party: Gabriela Kelly, contact `gkelly@poliartcr.com` (placeholder until confirmed).
2. Data collected: full name, email, phone, pre-screening answer, page language, date and time of submission.
3. Purpose: contacting the person about the initial call and the program, and prioritizing calls. No other use; data is not sold.
4. Recipients / processors: Google (Google Sheets storage) and Calendly (scheduling), which may store data outside Costa Rica.
5. Voluntary nature: providing data is optional; without it, the form cannot be submitted and the call cannot be scheduled through this page.
6. Rights: access, rectification, cancellation (deletion), and opposition, exercised by email to the contact address.
7. Retention period: TBD (to be defined in legal review).
8. Version identifier matching `PRIVACY_NOTICE_VERSION`.

## 5. Pending-Validation Markers (US-009)

In the prototype, every placeholder or provisional block (photo, bio, credentials, proof, privacy notice) shows a small, clearly styled label: "Pendiente de validación" / "Pending validation". The markers are controlled by a single flag so they can be turned off for production.

## 6. Imagery

Preferred:
- Real photography of Gabriela: displayed as a round portrait (see section 2.1). Provisional source: her Instagram profile picture (352px, too small for production). Final: original photo at least 800×800px, ideally with a plain or softly blurred background, with Gabriela's consent for web use.
- Calm, real-world financial planning imagery
- Professional environments
- People of different genders and ages making deliberate decisions

Avoid:
- cash piles
- luxury-car imagery
- exaggerated wealth symbolism
- "quick money" visuals

## 7. Responsive Direction

Mobile first. Verify at 360 px, 390 px, 768 px, and desktop (≥1280 px).

Requirements:
- strong headline legibility
- touch-friendly CTA and controls (≥44×44 px)
- stacked roadmap on narrow screens
- form usable without horizontal scrolling
- language toggle always visible
- Calendly usable on mobile

## 8. Stakeholder Validation

Brand palette and visual tone: approved by the human owner on 2026-09-25 (section 2.1, Proposal A); still to be shown to Gabriela.

Open for decision:
- Gaby's slide deck uses 3D banknote artwork. Section 6 says to avoid cash imagery; keep that rule for the website?
- Some slides address employers (staff turnover, KPIs, retention). The current spec targets individuals. Is a corporate audience in scope? If yes, it is a spec change first.

To be validated with Gabriela:
- final copy (both languages)
- photography
- credentials
- testimonials
- brand palette
- visual tone
- privacy notice (plus legal review)
