# UX_UI_DIRECTION — v0.2

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

### Section 5 — Proof / Social Validation (`#proof`)

Use real proof only when provided. Never invent testimonials or outcomes.

Placeholder structure (marked "pending validation"):
- testimonial cards
- quantified outcomes only if verifiable
- credibility statements
- client stories

### Section 6 — Initial Call Offer (`#offer`)

**Español**

> En una llamada inicial revisaremos tu situación a un nivel general, conversaremos sobre lo que buscas y veremos si el programa tiene sentido para ti.

**English**

> In an initial call, we'll review your situation at a general level, talk about what you're looking for, and see whether the program makes sense for you.

Avoid guaranteed results.

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
- Real photography of Gabriela
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

To be validated with Gabriela:
- final copy (both languages)
- photography
- credentials
- testimonials
- brand palette
- visual tone
- privacy notice (plus legal review)
