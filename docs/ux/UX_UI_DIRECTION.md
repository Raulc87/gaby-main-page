# UX_UI_DIRECTION — v1.0 (phase 2)

v1.0 (2026-10-16): phase 2 — Gaby's official brand, multipage site, VIP flow with screening-based routing, resource library, GitHub Pages preview (`PROJECT_SPEC.md` v0.5; Gaby's brief, `docs/ux/BRIEF_2026-10-15.md`). All visitor-facing copy moved to `docs/ux/CONTENT.md`; this document says how the site looks and behaves and refers to copy by key. The phase 1 one-page direction (v0.8, Proposal A, and its copy) is retired by Sprint 003; it stays in the history at commit `09d6ca6` (`docs/ux/UX_UI_DIRECTION.md`).

Earlier versions: v0.8 (2026-09-30) honeypot redesign after the autofill incident; v0.4–v0.7 (2026-09-28/29) Proposal A details; see the history.

## 1. Experience goal

Calm, premium and trustworthy, for corporate professionals. Many free resources and one premium door (the VIP mentorship). Hopeful, never fear-based or "get rich"; no pressure.

## 2. Brand

Source: Gaby's brief, board 1 ("Paleta", "Tipografía", "Botones y motivo gráfico"). Implement as Tailwind `@theme` tokens in `src/styles/global.css`, replacing the Proposal A tokens; components use tokens, never hex literals (US-019 AC1).

### 2.1 Color tokens

| Token | Brand name | Hex | Use |
|---|---|---|---|
| `heritage-blue` | Azul Patrimonio | `#3C5F8D` | Bands, the blue (free-action) button, links, focus rings, eyebrows, icons on light backgrounds |
| `ivory` | Marfil | `#F5F1EA` | Main page background |
| `sand` | Arena | `#D8C5B1` | Decorative borders, soft cards, dividers, thin arcs of the motif. Never text, never a control boundary |
| `soft-gold` | Oro Suave | `#D6B04D` | The gold VIP button (with `charcoal` text) and accents of the motif. Never text on light backgrounds |
| `terracotta` | Terracota | `#C98368` | Human moments (My story, testimonials): background panels or accents with `charcoal` text only |
| `charcoal` | Carbón | `#2B2B2B` | Main text, footer background |
| `surface` | (derived) | `#FFFFFF` | Cards and the form card on `ivory` |
| `muted` | (derived) | `#5A5148` | Secondary text, hints, captions (the brief's own secondary text color) |
| `field-line` | (derived) | `#8C7B6B` | Borders of form controls (inputs, screening option cards, the consent checkbox) |

Error text keeps Tailwind `red-700` (as in phase 1; no brand token).

### 2.2 Allowed color pairs (WCAG AA)

Text (4.5:1, or 3:1 for large text of at least 24 px, or 18.66 px bold):

| Text | Background | Ratio | Allowed for |
|---|---|---|---|
| `charcoal` | `ivory` | 12.58 | All text |
| `charcoal` | `surface` | 14.16 | All text |
| `charcoal` | `sand` | 8.46 | All text |
| `charcoal` | `soft-gold` | 6.86 | All text (the VIP button) |
| `charcoal` | `terracotta` | 4.67 | All text |
| `heritage-blue` | `ivory` | 5.80 | All text (links, eyebrows, italic emphasis) |
| `heritage-blue` | `surface` | 6.53 | All text |
| `muted` | `ivory` | 6.89 | All text |
| `muted` | `surface` | 7.76 | All text |
| `ivory` or `surface` | `heritage-blue` | 5.80 / 6.53 | All text (blue bands, the blue button) |
| `ivory` | `charcoal` | 12.58 | All text (footer) |
| `soft-gold` | `charcoal` | 6.86 | All text (footer accents) |
| `red-700` | `ivory` / `surface` | 5.70 / 6.42 | Error text |

Never: `soft-gold` (1.83), `terracotta` (2.69) or `sand` (1.49) as text on `ivory`; `heritage-blue` text on `sand` (3.90) below large text; any text on `terracotta` other than `charcoal`; `soft-gold` text on `heritage-blue` (3.17) except large text.

Non-text (3:1, WCAG 1.4.11): form control borders use `field-line` (3.61 on `ivory`, 4.07 on `surface`); focus rings use `heritage-blue` (5.80 on `ivory`), and on `heritage-blue` bands `ivory`. The motif in `soft-gold` on `heritage-blue` (3.17) passes as a graphic; in `sand` on `ivory` it is decorative only and carries no meaning.

### 2.3 Typography

| Role | Face | Notes |
|---|---|---|
| Headings H1–H2, editorial phrases, italic emphasis | Playfair Display (Google Fonts), 500; italic 500 | Replaces Crimson Pro. The `*...*` parts of a heading in `CONTENT.md` are italic `heritage-blue` |
| Everything functional: body, buttons, forms, navigation, labels, H3 | Manrope (Google Fonts), 400, 600, 700 | Replaces IBM Plex Sans; body 17–18 px on desktop, 16–17 px on mobile |
| Wordmark | Playfair Display 500, "Gaby Kelly" | Until a logo file arrives |

- Scale: hero headline 40–64 px fluid; section titles 30–44 px; card titles (H3, Manrope 700) 19–20 px; eyebrows 13 px uppercase, 0.16em tracking, `heritage-blue`.
- Headings use `text-wrap: balance`; running text at most ~65 characters wide.

### 2.4 Buttons and links

| Style | Look | Used for |
|---|---|---|
| Gold (VIP) | `soft-gold` fill, `charcoal` text, Manrope 700, arrow, min height 52 px, 2 px radius | In-page VIP calls to action only: the Home hero (`cta.vip_long`), VIP bands (`cta.vip_apply`), the VIP form submit. At most one visible per viewport (BR-010) |
| Blue | `heritage-blue` fill, `surface` text, same shape | Free actions: downloads, "see the library", resource calls to action |
| Outlined | 1.5 px `heritage-blue` border, `heritage-blue` text, transparent | The header VIP link (`nav.vip`) on every page |
| Text link | `heritage-blue`, underlined on hover and focus, arrow where the brief shows one | "Read my full story", "Or start free with the resources" |

Hover: the gold button darkens slightly and lifts 2 px; the blue button shifts toward `charcoal`. Focus: 2 px `heritage-blue` ring with 2 px offset (on blue bands, `ivory` ring). Disabled: 50% opacity, no lift.

Viewport rule (BR-010): a layout must not place two gold buttons in one viewport at 360, 390, 768 or 1280 px wide (e.g. the VIP band never sits directly under the hero). The VIP page has one gold button: the form submit; its intro has no gold button.

### 2.5 Motif: the polar star

- A thin line star (4 long and 4 short points, 1.25–1.5 px stroke, no fill) with thin concentric arcs, in `soft-gold` or `sand`. It replaces the large yellow circles (brief, board 1): smaller and more elegant.
- At most one per section, beside or behind a heading or the portrait, never behind body text, never larger than ~240 px on desktop (~140 px on mobile).
- On `heritage-blue` bands: `soft-gold`. On `ivory`: `sand` (decorative) or `soft-gold` (accent, not carrying meaning).
- Inline SVG, `aria-hidden="true"`.
- Icons elsewhere: simple line icons (1.5 px), `heritage-blue` on light backgrounds, `soft-gold` on blue bands. No emoji, no 3D, no cash imagery.

### 2.6 Shape and depth

2 px corners on buttons and inputs, 4 px on cards; cards are `surface` with a 1 px `sand` border and no shadow, or `sand` fill for soft cards. No gradients, glows or grain.

## 3. Site map, routes and language (FR-017, FR-012, ADR-003)

| Page id | Spanish path | English path | Phase |
|---|---|---|---|
| `home` | `/es/` | `/en/` | 2a |
| `story` | `/es/mi-historia/` | `/en/my-story/` | 2a |
| `resources` | `/es/recursos/` | `/en/resources/` | 2a |
| `vip` | `/es/mentoria-vip/` | `/en/vip-mentorship/` | 2a |
| `privacy` | `/es/privacidad/` | `/en/privacy/` | 2a |
| `blog` | `/es/blog/` | `/en/blog/` | 2b (US-026) |
| `method` | `/es/metodo-polaris/` | `/en/polaris-method/` | 2b (US-028) |

- `/` keeps the ADR-003 detection (saved choice, else browser language) and sends the visitor to the Home in their language.
- The language toggle (`ES | EN`) switches to the same page id in the other language and keeps the section anchor; it saves the choice.
- Section anchors are shared by both languages (they are identifiers, not copy): Home `#hero`, `#escalera`, `#oportunidad`, `#metodo`, `#recursos`, `#historia`, `#testimonios`, `#vip`; VIP page `#aplicar`.
- All internal links and assets are built from the site's base path, so the same build works at the domain root (production) and under `/gaby-main-page/` (GitHub Pages preview, ADR-005).
- Every page has its own `<title>` and meta description (`CONTENT.md` §1).

## 4. Shared layout

### 4.1 Header (every page)

- Sticky, `ivory` background, 1 px `sand` bottom border; content max width 1160 px.
- Left: wordmark (`nav.brand`, Playfair 26 px, `charcoal`), linking to the Home.
- Desktop (≥ 1024 px): navigation `nav.story`, `nav.method`, `nav.resources` (Manrope 600, `charcoal`, `heritage-blue` underline for the current page with `aria-current="page"`), the `ES | EN` toggle, then the outlined `nav.vip` link.
- Below 1024 px: wordmark, the outlined `nav.vip` link and a menu button (`nav.menu_open` / `nav.menu_close`); the menu opens as a panel under the header with the navigation and the toggle. Escape and the close button close it; focus moves into the panel when it opens and back to the button when it closes; the page behind does not scroll while it is open (US-020 AC3).
- A skip link (`skip_link`) is the first focusable element.

### 4.2 Footer (every page)

`charcoal` background, `ivory` text: wordmark and `footer.concept`; `footer.disclaimer` and `footer.data_note` in `ivory` at 15 px; `footer.privacy_link` (to the privacy page). A small `soft-gold` polar star. No Terms link (FR-020).

### 4.3 Sections

Alternate `ivory` and `surface` bands, with one `heritage-blue` band (the VIP band) per page at most. Section padding 96 px desktop, 64 px mobile. Each section: optional eyebrow, Playfair title, content.

### 4.4 VIP band

Full-width `heritage-blue` band, `ivory` text: eyebrow `vip_band.eyebrow` in `ivory` (13 px: `soft-gold` on blue is only 3.17:1), Playfair title `vip_band.title` (italic part in `soft-gold`, large text, 3.17:1 allowed for large text), `vip_band.body`, and the gold `cta.vip_apply` button to the VIP page. A `soft-gold` polar star at one side. The resource library uses the short variant (`vip_band.short_title`, no eyebrow, no body).

## 5. Pages

### 5.1 Home (US-021)

Order and anchors (copy: `CONTENT.md` §5):

1. **Hero `#hero`** (`ivory`): two columns on desktop. Left: eyebrow, H1 (italic second half), lead, the gold `home.hero.cta`, the text link `home.hero.secondary` to the resources, and the trust line `home.hero.trust` in `muted`. Right: Gaby's round portrait (provisional photo) inside thin `sand` arcs with a `soft-gold` polar star. Mobile: copy first, then the portrait at 160 px; the gold button and the text link stack full width.
2. **Ladder `#escalera`** (`surface`): narrow text column; `home.ladder.closing` as an editorial Playfair italic line with a `terracotta` left rule.
3. **Opportunity `#oportunidad`** (`ivory`): eyebrow, title, lead; six benefit cards (`surface`, `sand` border, line icon) in 3 columns on desktop, 2 at 768 px, 1 on mobile.
4. **Método Polaris `#metodo`** (`surface`): eyebrow, title; three numbered steps ("01", "02", "03" in Playfair `heritage-blue`) in a row on desktop, stacked on mobile; the polar star beside the title. Steps show the pending badge (provisional).
5. **Resources teaser `#recursos`** (`ivory`): eyebrow, title, the blue `home.resources.cta` link-button; three resource cards (§6.1).
6. **Story teaser `#historia`** (`ivory` background; `terracotta` used only as an accent: a 4 px left rule on the title block and the portrait frame — no text on `terracotta`): eyebrow, title, the three story paragraphs (all three at every width), the media names row (§5.2), and the text link `home.story.cta`.
7. **Testimonials `#testimonios`** (`surface`): title; three placeholder cards (two text, one video) with the pending badge (§6.3).
8. **VIP band `#vip`** (§4.4). Keep at least one non-gold section between the hero and the VIP band at every width (it is the last section, so this always holds).

### 5.2 My story (US-022)

Copy: `CONTENT.md` §6. Layout: hero with eyebrow and title and a photo placeholder (`story.photo.placeholder`, pending); the three paragraphs in a narrow column; "media" row: `story.media.label` then the names as text chips in a row that can hold logos later without a redesign (same height boxes, 56 px); "experience" row: Microsoft and Oracle logos (monochrome `charcoal`, max height 28 px, from files committed with their source noted in the PR) and the name "Intel" as text; a bio/credentials placeholder card (pending); the text link to the resources; the VIP band.

### 5.3 Free resources (US-024)

Copy: `CONTENT.md` §7.

- Header block: eyebrow, title, lead.
- Featured mini-course: a wide card (cover placeholder left, text right) with `resources.featured.label`, the title and description of `minicourse-debt`, and its state (§6.1).
- Topic filters: a row of toggle buttons (`resources.filter.all` and the four topics) with `aria-pressed`; the list updates without reloading; without JavaScript all resources are shown and the filters are hidden. Wraps to two lines on mobile.
- Grid of resource cards (§6.1): 3 columns desktop, 2 at 768 px, 1 on mobile; `resources.empty` when a topic has none.
- Short VIP band at the end.

### 5.4 VIP mentorship (US-023)

Copy: `CONTENT.md` §8.

1. Intro (`ivory`): eyebrow, title, lead, and the three steps as a numbered row (no button: the only gold button on this page is the form submit).
2. Video module: 16:9 frame with a `heritage-blue` background, a `soft-gold` polar star and `vip.video.placeholder`, with the pending badge. Nothing is loaded from a third party.
3. Application form `#aplicar` (§6.2).
4. After a successful save (§6.4): the form card is replaced in place by the qualified or not-ready screen.

### 5.5 Privacy notice page

Plain reading page: title, the notice text (`CONTENT.md` §9) in a narrow column, the DRAFT badge until US-018.

## 6. Components

### 6.1 Resource card

`surface`, 1 px `sand` border, 4 px radius. Cover area (4:3, `sand` fill with the type label and a small polar star, until real covers exist), type label + `resource.free` (eyebrow style), access label (`resource.access.*`, `muted`), title (Manrope 700), description, topic (small, `muted`), and the action:
- file delivered: blue button (`download`) or blue button with the email CTA label (email resources show `resource.email.coming_soon` until US-025, without a form);
- file not delivered: `resource.pending` as plain text, no link, plus the pending badge.

### 6.2 Application form (unchanged behavior, new skin)

- `surface` card with a 4 px `heritage-blue` top border on `ivory`; title `form.title`.
- Inputs: `ivory` fill, 1 px `field-line` border (US-019 AC7), 2 px radius, min height 48 px; focus: `heritage-blue` border and ring.
- Screening options: large selectable cards, at least 44 px high (comfortable on mobile), `field-line` border; selected: `heritage-blue` border and a light `heritage-blue` tint with `charcoal` text.
- Consent checkbox with the privacy-dialog link (§6.3 of phase 1 behavior: opens in a dialog, form data kept).
- Gold submit (`form.submit`), the only gold button in its viewport; below it `form.trust` in `muted`.
- Errors in `red-700` next to the field; submission errors above the submit button.
- Honeypot: unchanged from v0.8 (US-013, contract §3.1): a `type="text"` input inside its own separate `<form>` outside the lead form, with a non-autofill `id`/`name` (e.g. `id="lead-hp" name="hp_field"`), no label, placeholder or title, `autocomplete="off"` and the password-manager opt-outs (`data-1p-ignore`, `data-lpignore="true"`, `data-bwignore="true"`, `data-form-type="other"`), off-screen (not `display: none`) with `tabindex="-1"` and `aria-hidden="true"` on its wrapper; its value is sent as JSON `website`. The visible fields keep their autofill hints (`name`, `email`, `tel`).

### 6.3 Testimonial card (placeholder)

`surface` card with a `terracotta` opening quote mark (large, decorative, `aria-hidden`), the placeholder caption and attribution in `muted`, and the pending badge. The video variant shows a 16:9 `sand` poster with a decorative play icon; it loads nothing until a real video and its host are decided (US-017).

### 6.4 Thank-you screens (US-023 AC4, AC5)

- Qualified: `thanks.qualified.title` and `.body`, then the inline Calendly (full width of the content column, name and email pre-filled), with the `thanks.calendly_fallback` message if the URL is unset, the script fails, or nothing appears within 10 seconds (US-007).
- Not ready: `thanks.not_ready.title` and `.body`, then the `minicourse-debt` resource card (§6.1, in its current state), then the blue `thanks.not_ready.more` link to the library. Calendly is not loaded. No gold button.
- Focus moves to the screen's title when it appears.

### 6.5 Pending badge

Small pill: `sand` fill, `charcoal` text, 12 px Manrope 600, `pending.badge`, at block level (a section heading, a card), never inside running text. Which blocks get one is listed in `CONTENT.md` → Metadata → Pending badge: placeholders (BR-011) show it in **every** build, production included, until the real content arrives; provisional copy blocks show it in preview and development builds only. Visibility follows the content's state (a typed list next to the strings), not only the build type.

### 6.6 Preview marker (US-027)

In preview builds only: a slim `charcoal` bar above the header with `preview.badge` (a `soft-gold` pill) and `preview.banner` in `ivory`. Forms show `preview.form_note` on the next screen; the scheduler is replaced by a `sand` box with `preview.scheduler`.

## 7. Provisional copy in code

The code keeps, next to the strings, the list of badge blocks from `CONTENT.md` → Metadata → Pending badge, each tagged `placeholder` or `provisional`; the pending badge reads from it. Provisional keys outside that list (navigation, labels, metadata, alt text, state messages) never show a badge. English provisional status (all English) does not add badges.

## 8. Imagery

- Sí (brief): real session photos with natural light, `ivory` or green backgrounds; Gaby working, reading, in session, with coffee or a notebook. Mixed people (men and women) in any image of clients.
- No: stock photos, banknotes or cash, cars, stiff corporate poses, luxury symbols.
- Until the session photos arrive: the provisional portrait from phase 1 in the Home hero, and marked placeholders elsewhere.
- Portrait: round, `ivory` 6 px ring; alt text from `CONTENT.md`.

## 9. Responsive

Mobile first. Verify at 360, 390, 768 and 1280 px, with no horizontal scroll. Touch targets at least 44×44 px. The header menu below 1024 px (§4.1). Grids: 3 → 2 → 1 columns. The VIP rule of §2.4 at every width. The brief's mobile board (board 5) sets the mobile hero: brand header, headline, lead, the calls to action stacked; the copy is the same as on desktop (one set of keys).

## 10. Stakeholder validation

Approved by Gaby in her brief (2026-10-15): palette, typography, motif, structure, the Spanish copy marked `approved` in `CONTENT.md`. Still to validate with Gaby: the English copy, the provisional keys, the layouts as built (on the preview). Deliberate departures from the brief are listed in `docs/ux/BRIEF_2026-10-15.md` → Decisions.
