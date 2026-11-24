# PROJECT_SPEC — Gaby Kelly: from corporate life to financial freedom

## Metadata
- Version: 0.7
- Status: Phase 2d (Gaby's final content: Wealth Mastery, her calculator, GoHighLevel contacts), proposed in this PR. Phase 2c (StoryBrand Home and funnel): v0.6 approved by the human owner by merging #69 (2026-11-08), v0.6.1 a clarification of FR-034; v0.5 (phase 2a) approved and delivered in Sprint 003
- Product: Bilingual website with one free diagnosis (the calculator) and one premium path (Wealth Mastery: application and call booking)
- Stakeholder: Gabriela Kelly ("Gaby Kelly")
- Last updated: 2026-11-23 (v0.7: phase 2d from Gaby's final content of 2026-11-23 — voseo across the site, "Wealth Mastery" instead of "Mentoría VIP", the new menu, a Wealth Mastery page that replaces the Método Polaris page, the Método Polaris as three pillars, the calculator as the only free resource (the resource library is withdrawn), Gaby's calculator instead of the placeholder formula, and the leads sent to GoHighLevel, which sends the funnel's emails (ADR-007 decided, ADR-008). v0.6.1 (2026-11-08: FR-034 names the largest figure accepted, as the calculator of #80 implements it, approved by the human owner. v0.6: phase 2c from Gaby's Sprint 003 review — the StoryBrand Home, a freedom-months calculator as the Home's only lead magnet, the funnel's emails as requirements (how they are sent: ADR-007, proposed), the GoHighLevel calendar instead of Calendly (ADR-006), the Método Polaris page with placeholder steps, the production domain gabykelly.com). v0.5 (2026-10-15: phase 2 from Gabriela's visual brief of 2026-10-15 — new audience and concept, official brand, multipage site, free resource library, one VIP path with screening-based routing, GitHub Pages preview; production deployment on hold). v0.4 (2026-09-28): spam protection (ADR-004), production Google account. v0.3 (2026-09-23): bilingual ES/EN, privacy consent, lead status values, locked lead API contract, local prototype.

Phase 2 source: Gabriela's visual brief "Brief visual — sitio Gaby Kelly" (five boards: brief and palette, home, resource library, VIP flow, mobile hero), https://claude.ai/artifact/LeuEgX7HC2otdkLEhcJM5j, received 2026-10-15. A text export of the five boards is kept in `docs/ux/BRIEF_2026-10-15.md`. The brief is a reference; this spec, `UX_UI_DIRECTION.md` and `CONTENT.md` are the sources agents implement from.

Phase 2c source: Gaby's review of the Sprint 003 preview, received 2026-11-08: a StoryBrand Home dummy, her funnel document ("Lógica del funnel", 2026-11-04) and review notes; text export and the human owner's decisions on them in [`docs/ux/BRIEF_2026-11-08_STORYBRAND.md`](../ux/BRIEF_2026-11-08_STORYBRAND.md). The funnel document is taken as **requirements, not a tool choice**: Gaby wrote "todo el flujo vive en GoHighLevel" because GHL was the tool she knew; the site and its backend cover every step except the calendar (human owner, 2026-11-08).

Phase 2d source: Gaby's final content, received 2026-11-23: her email, the Wealth Mastery page, the adjusted Home, her calculator prototype and her GoHighLevel calendar's embed code; text export and the human owner's decisions in [`docs/ux/BRIEF_2026-11-23_WEALTH_MASTERY.md`](../ux/BRIEF_2026-11-23_WEALTH_MASTERY.md) §8. It updates the phase 2c direction on one point: the leads also go to GoHighLevel through its API, and GoHighLevel sends the emails; the site's forms and the Google Sheet stay the record (human owner, 2026-11-23).

## 1. Problem Statement

Executives and professionals at multinational companies often earn well and receive valuable corporate benefits, yet their money does not give them peace of mind. Each raise tends to fund a slightly more expensive lifestyle; they may not know how many months they could sustain themselves if their position changed; and their attention stays on work even when they are at home.

Their careers already give them the tools to build wealth (salary, raises, insurance, allowances, paid travel, English, international access, networks). What they lack is a system to turn those benefits into invested capital and financial freedom.

## 2. Product Vision

"Del mundo corporativo a tu libertad financiera" / "From corporate life to your financial freedom."

A calm, premium website where corporate professionals recognize their situation, find out with one free diagnosis how many months their money would carry them, get to know Gaby's story and method, and, when ready, take one premium path: apply to work directly with Gaby (Wealth Mastery) and book an initial call.

## 3. Goals

- G-001: Communicate the core problem and the opportunity clearly to corporate professionals.
- G-002: Present a hopeful, non-manipulative path (the Método Polaris) toward financial order and wealth.
- G-003: Generate qualified VIP applications.
- G-004: Pre-screen applicants for willingness and approximate capacity to invest.
- G-005: Make it easy for qualified applicants to book a call.
- G-006: Build trust and an audience through one free diagnosis (the calculator) and its follow-up, without pressure (phase 2d; before, a resource library).
- G-007: Express Gaby Kelly's official brand (palette, typography, motif).
- G-008: Turn visitors who are not ready to apply into leads, with one free diagnosis (the calculator) and a follow-up by email that invites them to a call.

## 4. Non-Goals

- NG-001: Provide personalized financial advice on the site.
- NG-002: Build a full course platform (mini-courses are delivered as links, files or email, not as a learning platform).
- NG-003: Build a complex CRM.
- NG-004: Build a SQL database.
- NG-005: Guarantee financial results.
- NG-006: Build an email-marketing platform in this project (campaign editor, list management, analytics). The funnel's emails are in scope as requirements (FR-036 to FR-038); GoHighLevel sends them (ADR-007, option C), and the site's part is to send it the contacts (FR-041, ADR-008).

## 5. Users / Actors

### Visitor / Prospective Client
An executive or professional at a multinational company, man or woman, who:
- earns well and has corporate benefits
- feels that money does not yet give them peace of mind or freedom
- may let lifestyle grow with each raise
- may have limited investment knowledge
- wants clarity, order and a path to invest and build wealth
- reads Spanish or English

### Gaby Kelly / Business Owner
Needs:
- qualified VIP applications with contact information and a screening answer
- an easy path for qualified applicants to book a call
- a respectful path for people not ready yet (the free diagnosis and its follow-up emails)
- leads in her GoHighLevel account, tagged by source, for her follow-up (phase 2d)
- a simple way to track each lead's follow-up status

## 6. Functional Requirements

### Site and navigation
- FR-017: The site has these pages, each in Spanish and English: Home; My story (Mi historia); Wealth Mastery (the programme and the Método Polaris, FR-042); the free diagnosis (Diagnóstico gratis: the calculator, FR-034); the Wealth Mastery application (application, then scheduling); Blog (phase 2b, see section 15); Privacy notice (a page linked from the footer; the consent links keep opening it in a dialog, US-018). A Terms page is added only when its text exists (section 16). Phase 2d withdraws the Free resources page (FR-023) and the Método Polaris page (US-028, replaced by the Wealth Mastery page).
- FR-018: A header on every page shows the brand name, the navigation (Mi historia, Wealth Mastery, Diagnóstico gratis, Blog when it exists, language toggle) and one link to the application, "Aplicá a Wealth Mastery", styled as an outlined (secondary) button (shortened below 1024 px). On mobile the navigation collapses into a menu; the application link stays reachable.
- FR-019: One premium path. Every VIP call to action ("Aplicá a Wealth Mastery") leads to the application page. Gold is used only for in-page VIP calls to action (the Home hero button, VIP bands, the VIP application's submit button, the calculator result's VIP button), never for the header link, and at most one gold button is visible in any viewport (BR-010). Free actions (the calculator, the story, the Wealth Mastery page) use the blue style.
- FR-020: A footer on every page shows the brand name and concept, the legal disclaimer (FR-028), a link to the privacy notice, and the Ley 8968 data-protection note. A Terms link is added when the Terms page exists.

### Home
Phase 2c (US-034): the Home follows Gaby's StoryBrand dummy. Phase 2d (Gaby, 2026-11-23) drops its Wealth Mastery section, which moves to the Wealth Mastery page, so the order is: hero, problem, stakes, guide, opportunity, plan (Método Polaris), before and after, proof, calculator, and a closing section to apply. Copy: `CONTENT.md` §5 (phase 2d changes staged in `CONTENT_PHASE_2D.md`); layout: `UX_UI_DIRECTION.md` §5.1.
- FR-001: The hero says who the site is for (corporate executives and professionals) and the value proposition, with two calls to action: apply to Wealth Mastery (direct) and calculate your months of freedom (transition, to the calculator). Its photo shows the desired state (Gaby living her freedom, or a real client), not a studio portrait.
- FR-002: The Home explains the problem in a calm, hopeful way (the corporate ladder and the lack of freedom).
- FR-031: The Home shows what is at stake if nothing changes (three consequences), and links to the calculator.
- FR-040: The Home presents Gaby as the guide, before the opportunity: a short version of her story, three figures (years in corporate, years investing, people mentored), the media mentions and a link to My story. This is the only place the studio portrait appears.
- FR-021: The Home presents the opportunity: the corporate benefits that can become investable capital.
- FR-004: The Home presents the Método Polaris in short: Polaris is the North Star, and the method has three pillars (Mentalidad, Administración, Inversión, each with its official name as a label: Mentalidad Millonaria, Administración del Dinero, Inversiones e Ingresos Pasivos) worked in parallel with every income, never shown as numbered or ordered steps or joined by arrows. It ends with a call to action to apply and a text link to the Wealth Mastery page ("Conocé Wealth Mastery →").
- FR-032: Withdrawn in phase 2d. The Home no longer lists what Wealth Mastery teaches; the Wealth Mastery page explains it pillar by pillar (FR-042).
- FR-033: The Home contrasts life today with life with the Método Polaris (before and after).
- FR-005: The site includes space for proof and credibility (testimonials with photos, media mentions, experience); placeholders are visibly marked until real, authorized content arrives.
- FR-022: The Home ends with the calculator teaser (the Home's only lead magnet; no links to other resources) and a closing section with the three steps to start (apply, initial call, start the plan). It has no free-resources teaser.

### My story
- FR-003: The My story page presents Gaby as a guide: her corporate career, the turning point, and how she now accompanies corporate professionals; with space for photos, bio and credentials.
- FR-029: Media mentions are shown as names only (no media logos) until their logo use is authorized. Logos of companies where Gaby worked (Microsoft, Oracle) may be shown as prior experience.

### Free resources (withdrawn in phase 2d)
Gaby, 2026-11-23: the calculator is the site's only free resource; there is no resource library. FR-023, FR-024 and FR-025 are withdrawn, with the Free resources page, its navigation link and every link to it. Their text stays below for the history.
- FR-023: The resource library page lists free resources as cards (type, access, title, topic, call to action), can be filtered by topic, and features one mini-course.
- FR-024: A resource is either a free download (direct link to a file, no data collected) or delivered by email. Only resources whose real file or content has been delivered are linked; the others are shown as pending (BR-011) without a link. Until email delivery exists (FR-025), email-delivered resources are shown as "coming soon" and collect nothing.
- FR-025 (phase 2b): For an email-delivered resource, the visitor enters an email address and accepts the privacy notice; the site stores the request and sends the resource by email from Gaby's account. Each email states why it was sent and how to opt out of further emails.

### Calculator and the funnel (phase 2c)
- FR-034: The calculator page (the free diagnosis, "Diagnóstico gratis") answers "How many months could you sustain yourself if your position changed?" with **Gaby's calculator** (phase 2d; it replaces the placeholder formula of phase 2c). The visitor chooses the currency (US dollars or colones; switching converts the figures already typed at the configured rate, `PUBLIC_CRC_PER_USD`, default 500) and enters, in that currency: monthly expenses; money in savings accounts and wallets; investments they could sell within a month; the balance of their solidarity association (asociación solidarista); and monthly income that does not depend on working (passive income). They also choose how much of their investments is in shares of their own company (none, under 20%, 20% to 50%, over 50%). The money inputs open with Gaby's example figures, but this question opens **unanswered** ("Elegí una opción") and must be answered, so the stored `concentration_alert` is always the visitor's own answer (Ley 8968 data quality; the prototype preselects "Entre 20% y 50%"; coordinator's proposal from the review of #85, approved by merging). Each figure is 0 or more and below about 90 trillion (the calculation works in whole cents; a larger amount is rejected as not a number, `calc.error.number`), and the monthly expenses must be more than 0. Then:
  - available money = savings and wallets + liquid investments + solidarity association;
  - monthly gap = monthly expenses − passive income;
  - if the gap is 0 or less, the result is "∞" in the zone **Libre financieramente** (financially free);
  - otherwise months = available money ÷ monthly gap. Shown below 10 rounded to the nearest tenth, with a decimal comma in Spanish ("4,4"; a whole value without a decimal, "6", as in the prototype), and from 10 as a whole number rounded to the nearest (Gaby's rule, human owner 2026-11-23; brief §8 point 6). Ties round half up, computed on the exact decimal value, so the page and GoHighLevel show the same number (9.95 → "10"; 10.5 → "11"; contract §12);
  - zones, from the exact (unrounded) months: **Zona crítica** below 3; **Zona de alerta** 3 to below 6; **Base en construcción** 6 to below 12; **Camino a la libertad** 12 to below 36; **Colchón sólido** 36 or more; each with Gaby's title and message;
  - the result also shows a gauge from 0 to 36+ months, the available money and the monthly gap in the chosen currency, and, when the company-shares answer is "20% to 50%" or "over 50%", the concentration alert ("Ojo con la concentración").
  There is no upper limit on the result. The calculation runs in the browser. The result says it is an educational estimate, not financial advice. Copy: Gaby's texts, verbatim in Spanish (brief §4).
- FR-035: Before showing the result, the calculator asks for name, email, WhatsApp (optional), the required consent (FR-013; it covers storing the lead and emailing the result) and an optional, separate consent to Gaby's follow-up emails (unticked by default; two checkboxes, not the prototype's one: human owner, 2026-11-08 and 2026-11-23), and stores a calculator lead: those details, both consents, the language, the months and the zone, the currency, whether the concentration alert applies (yes or no), and the lead's source (FR-039). The figures the visitor typed are not sent or stored, to the site or to GoHighLevel (data minimization; human owner, 2026-11-23, pending Gaby's confirmation: brief §8 point 4). If the save fails, the result is not shown and the visitor can retry (NFR-006). In the preview it stores nothing (FR-030).
- FR-036: A calculator lead receives, by email and right away, their result and the ebook "Cómo empezar a invertir siendo ejecutivo" (from Gaby): email 1 of Gaby's sequence in GoHighLevel, triggered by the contact the site sends it (FR-041; ADR-007). Until that works end to end, the site does not promise an email.
- FR-037: Calculator leads who gave the follow-up consent (FR-035) and have not booked a call receive the sales sequence of Gaby's funnel: six emails over 14 days (days 0, 3, 5, 8, 11 and 14; email 1 is FR-036), then a weekly email with valuable content. Booking a call at any time stops the sequence. Every email states why it was sent and has a working unsubscribe. The texts are Gaby's. GoHighLevel runs the sequence, the weekly email, the unsubscribes and the stop on booking (ADR-007, option C); the site sends it the contact with the consent (FR-041).
- FR-038: Gaby receives a notification for each Wealth Mastery application, from GoHighLevel when the contact arrives with its tag (FR-041).
- FR-039: Each lead records its source, so the follow-up can differ by source: VIP applications by their own tab (the VIP contract is unchanged) and the GoHighLevel tag `aplicacion-vip`; calculator leads by a `source` column set to `calculator` and the tag `lead-calculadora`.
- FR-041 (phase 2d): After each successful save, the backend also creates or updates the person's contact in Gaby's GoHighLevel account through its API (ADR-008), matching on the email:
  - calculator lead: name, email, phone if given, the tags `lead-calculadora` and the language (`idioma-es` / `idioma-en`), the custom fields `meses` (the months as shown to the visitor; empty when the result is ∞), `zona` (the zone's Spanish label), `moneda` and `alerta_concentracion` (sí / no), and the consent tag `consentimiento-correos` only when the follow-up consent was given;
  - Wealth Mastery application: name, email, phone, the screening answer, the tag `aplicacion-vip` and the language tag.
  The Google Sheet stays the record. If GoHighLevel cannot be reached, the visitor still gets their result or their next screen (the lead is saved), and the row records that the contact was not sent, so it can be sent again (ADR-008). Preview builds and honeypot decoys send nothing. No figure typed into the calculator is sent (FR-035).

### Wealth Mastery page (phase 2d)
- FR-042: A Wealth Mastery page presents the programme, in this order (Gaby, 2026-11-23): hero (two calls to action: apply, and calculate your months for free); who it is for and who it is not for; the Método Polaris with its three pillars in detail (no numbers, no arrows, worked in parallel); how it works (a 3-month programme, one-to-one sessions every 15 days, a content library, a community of graduates); who guides you (Gaby, with a photo other than the Home's portrait); testimonials (the Home's); frequently asked questions as an accordion (Gaby confirms the answers before they are published); a closing section to apply with the three steps. It shows no prices. Copy: Gaby's page, verbatim in Spanish (brief §2).

### Wealth Mastery application (application and scheduling)
Phase 2d renames the VIP mentorship to Wealth Mastery everywhere the visitor sees it; the flow, the form and the contract are unchanged.
- FR-006: The application page includes the application form.
- FR-007: The form collects full name, email, phone (WhatsApp), one pre-screening answer, and privacy consent.
- FR-008: The pre-screening question indicates willingness and approximate capacity to invest.
- FR-009: Submitted applications are stored.
- FR-026: The application page has a module for Gaby's video explaining the mentorship (her VSL, which she will record again for the new audience); until the video arrives, the module shows a visible placeholder.
- FR-010: After a successful save, the next step depends on the screening answer:
  - `ready_to_invest` or `needs_investment_info`: thank-you message and the booking calendar embedded inline: Gaby's GoHighLevel calendar from phase 2c (ADR-006; Calendly before).
  - `no_capacity_now` or `exploring`: a warm thank-you screen without the scheduler, offering the free diagnosis (the calculator) instead of the withdrawn mini-course (phase 2d; coordinator's proposal, approved with this spec).
  In both cases the application is stored with its screening answer.
- FR-014: Every thank-you states that Gaby's team may reach out by email or WhatsApp.
- FR-015: If the booking calendar cannot be displayed, the page offers a fallback `mailto:` link to the business contact email.
- FR-016: Each stored lead carries a follow-up status. New leads start as `started`; allowed values are `started`, `contacted`, `booked`, `not_interested_yet`, `dropped`.

### Blog (phase 2b)
- FR-027: Blog posts are written as files in the repository (Markdown) and published with the site. The blog list page exists in both languages and lists the posts of its language. A post exists in the languages it was written in; the language toggle on a post leads to its translation when there is one, and to the blog list of the other language otherwise. The navigation shows Blog only once at least one post exists.

### Cross-cutting
- FR-011: The site works correctly on mobile devices.
- FR-012: All visitor-facing content is available in Spanish and English. The initial language is Spanish when the browser's preferred language is Spanish (any `es` variant) and English otherwise. A language toggle in the header switches to the same page in the other language.
- FR-013: Any form that stores personal data requires explicit acceptance of the privacy notice before submission (Costa Rica, Ley N.° 8968).
- FR-028: The footer shows the legal disclaimer: Gaby Kelly is an investor and mentor, not a financial advisor; the content is educational and not an investment recommendation. Its text is assumed reviewed (human owner, 2026-10-15) and changes through a docs PR if legal review asks for it.
- FR-043 (phase 2d): All Spanish copy addresses the visitor with voseo ("vos", "ganás", "aplicá"), never "tú" or "usted" (Gaby, 2026-11-23). The programme is called "Wealth Mastery" everywhere; "Mentoría VIP" is no longer used, and every apply button reads "Aplicá a Wealth Mastery" (English: "Apply to Wealth Mastery").
- FR-030: A preview of the site is published on GitHub Pages so Gaby can review progress. The preview is not indexed by search engines, shows a visible "preview" marker, and its forms do not store or send anything, to the site or to any third party: they show the next screen as a demonstration (including the FR-010 routing, with a static stand-in for the scheduler, and the calculator's result) and say so.

## 7. Non-Functional Requirements

- NFR-001: Mobile-first responsive behavior.
- NFR-002: Fast loading for a content-focused site.
- NFR-003: Clear, legible content hierarchy; text meets WCAG AA contrast.
- NFR-004: Avoid unnecessary technical complexity.
- NFR-005: Form errors are understandable, in the visitor's selected language.
- NFR-006: A failed data save is never presented as a successful submission.
- NFR-007: Personal data and credentials are handled server-side only; no secrets in client code or in Git.
- NFR-008: Before any public deployment, every endpoint that stores data has spam/abuse protection: a honeypot field and a per-IP rate limit (ADR-004).

## 8. Business Rules

- BR-001: Lead contact data is required before the scheduling step.
- BR-002: The pre-screening question is required.
- BR-003: Copy avoids guaranteed financial outcomes.
- BR-004: Proposed copy and imagery are subject to Gaby's validation.
- BR-005: Language is gender-neutral and inclusive in both Spanish and English, and the site does not target only women or only men. Photos and testimonials are mixed. (Gaby's first-person story may describe herself.)
- BR-006: Privacy consent is required before personal data is stored.
- BR-007: Code, identifiers, stored codes, and data field names are in English and use `snake_case`. Visitor-facing content is bilingual (Spanish/English).
- BR-008: The initial call is free of charge. The site may state this; it must not imply the mentorship is free.
- BR-009: The brand name on the site is "Gaby Kelly". The method is called "Método Polaris" (English: "Polaris Method") for now; a later name change is its own story. The programme's name is "Wealth Mastery" (both languages); from phase 2d "Mentoría VIP" is not used (Gaby, 2026-11-23), and the section eyebrows read "Mentoría Wealth Mastery". Its three pillars' official names are Mentalidad Millonaria, Administración del Dinero, and Inversiones e Ingresos Pasivos. Internal identifiers keep `vip` (page id, endpoint, tag `aplicacion-vip`).
- BR-010: Gold is reserved for in-page VIP calls to action: at most one gold button visible in any viewport ("screen" means the viewport). The header VIP link is never gold.
- BR-011: Testimonials, media logos, photos and quantified claims are shown only when real and authorized; until then they are visibly marked placeholders. Nothing is invented.
- BR-012: The follow-up emails (FR-037) are sent only to people who gave their separate consent to them (FR-035), whose text names them; they stop at once when the person unsubscribes or books a call. The result email (FR-036) is what the visitor asked for and is covered by the required consent. In GoHighLevel (ADR-007, ADR-008) the sequence's emails 2 to 6 and the weekly email go only to contacts that carry the consent tag (FR-041), and GoHighLevel's unsubscribe stops them. Gaby's workflows send calculator leads **email only**: no automated SMS or WhatsApp, which no consent covers (brief §8 point 1). Gaby or her team may still reply to a person by WhatsApp, as FR-014 says for applications.

## 9. Main Product Flows

**Free path**
1. Visitor lands on the Home in Spanish or English (browser language), and may switch language.
2. Visitor recognizes the problem and the opportunity, sees the Método Polaris and Gaby's story.
3. Visitor takes the free diagnosis (the calculator path below). The resource library is withdrawn in phase 2d.

**Calculator path (phase 2c)**
1. From the header ("Diagnóstico gratis") or the Home (hero, stakes or the calculator teaser), visitor opens the calculator, chooses the currency and enters the figures (FR-034).
2. Visitor gives name, email, optional WhatsApp and consent; the calculator lead is stored, and sent to GoHighLevel (FR-041).
3. Visitor sees the months, the zone and its message, with a link to apply to Wealth Mastery.
4. By email, from GoHighLevel: the result and the ebook, then (with the follow-up consent) the sales sequence until they book a call or unsubscribe, then a weekly email (FR-036, FR-037; ADR-007).

**VIP path**
1. From any page, visitor presses "Aplicá a Wealth Mastery" and reaches the application page (video module, application form).
2. Visitor submits full name, email, phone, screening answer, and accepts the privacy notice.
3. The application is stored, and sent to GoHighLevel with the tag `aplicacion-vip` (FR-041).
4. Qualified answer: thank-you and the inline booking calendar (GoHighLevel from phase 2c, ADR-006; or the email fallback); visitor books a call. Gaby is notified of the application (FR-038).
5. Not-ready answer: warm thank-you with a link to the free diagnosis (phase 2d).

## 10. Data and Integrations

VIP applications (exact contract: `docs/specs/LEAD_API_CONTRACT.md`, unchanged by phase 2):
- `name`, `email`, `phone` (international format), `screening_answer` (code), `language`, `consent`
- `submitted_at`, `privacy_notice_version` (server-generated); `status` (server sets `started`)

Calculator leads (contract `LEAD_API_CONTRACT.md` §11; v1.3 for phase 2d): `name`, `email`, `phone` (optional), `language`, `consent`, `marketing_consent`, `months` (none when the result is ∞), `zone` (`critical`, `alert`, `building`, `path_to_freedom`, `solid_cushion`, `financially_free`), `currency` (`USD`, `CRC`), `concentration_alert`; `source` = `calculator`; `submitted_at`, `privacy_notice_version` (server-generated); stored in their own tab. The figures typed into the calculator are not part of it.

GoHighLevel contacts (phase 2d, FR-041, ADR-008): for each saved lead, a contact created or updated by email with the fields of FR-041. The sheet records whether it was sent.

Resource requests: withdrawn in phase 2d with the resource library.

Integrations:
- Google Sheets for storage (ADR-002), the record of every lead.
- Call scheduling: Gaby's GoHighLevel booking calendar, inline embed (ADR-006); Calendly until then. GoHighLevel holds the bookings.
- GoHighLevel contacts API (phase 2d, ADR-008): the backend sends each saved lead as a contact, with a private integration token kept only on the server (NFR-007).
- Funnel emails (FR-036 to FR-038): sent by GoHighLevel, from Gaby's workflows (ADR-007, option C, human owner 2026-11-23).
- GitHub Pages for the preview (static only; no backend).

Personal data:
- Governed by Costa Rica's Ley N.° 8968.
- Processors: Google (Sheets storage), GoHighLevel (scheduling from phase 2c, Calendly before; from phase 2d also the contacts of FR-041 and the funnel's emails), and the video host when the VSL is published.

## 11. Constraints

- Production domain: **gabykelly.com** (human owner, 2026-11-08). Today it serves Gaby's GoHighLevel sales page, which the new site replaces at go-live, so going live includes moving the domain's DNS off GoHighLevel. Hosting is not decided: ADR-001 (GoDaddy cPanel, Python app at `/api`) stays the working assumption; production deployment (US-014) is on hold until the hosting is decided.
- The preview runs on GitHub Pages: static files only, under the repository path.
- No relational database.
- Keep the stack lightweight.
- Final copy and imagery require Gaby's review.
- Up to 3 implementation agents may work in parallel.

## 12. Assumptions

- Gaby keeps her GoHighLevel subscription for the booking calendar (ADR-006), the contacts and the funnel's emails (ADR-007, ADR-008), and sets up in it the custom fields, tags and workflows FR-041 relies on.
- The rate of `PUBLIC_CRC_PER_USD` is set by the human owner; it is not fetched from an outside service (brief §8 point 5).
- Production leads are stored in a Google Sheet in Gaby's Google account; development uses the project owner's sheet or memory mode.
- Real photos, testimonials, credentials, resource names and the video are supplied later; placeholders stay until then.
- The legal disclaimer is acceptable as written (human owner, 2026-10-15).

## 13. Risks

- Content arrives late or changes after review.
- Email from a new Gmail account can land in spam; delivery must be tested before release (Gmail and Outlook inboxes).
- A consumer Gmail account has daily sending limits; volume beyond them needs a Workspace account or a dedicated provider.
- Parallel agent changes may conflict if shared components and contracts are not defined first.
- The preview is publicly reachable by URL; it must not be mistaken for the real site or collect data.
- Marketing email without authenticated sending (SPF, DKIM, DMARC on gabykelly.com) or without a working unsubscribe lands in spam and breaks consent rules (ADR-007, BR-012).
- A lead saved in the sheet but not sent to GoHighLevel misses Gaby's emails until it is sent again (ADR-008: the row records it, and a resend step exists).

## 14. Success Criteria

- A corporate professional understands the concept and the offer without additional explanation, in Spanish or English.
- The site expresses the official brand on desktop and mobile.
- The free diagnosis is easy to find and use, and its result is clear.
- The VIP application captures all required data and is stored.
- Qualified applicants can book a call right after applying; others receive a respectful free alternative.
- Gaby can review progress on the preview at any time.

## 15. Phasing and Out of Scope

Phase 2a (next sprint): brand skin, site structure and navigation, Home with the new copy, My story, VIP page with routing and video placeholder, resource library (free downloads; email resources marked "coming soon"), footer with disclaimer, mobile, GitHub Pages preview.

Phase 2d (Sprint 005, from Gaby's final content of 2026-11-23): voseo and the Wealth Mastery name across the site, the new menu, the Wealth Mastery page (replacing the Método Polaris page), the Home's changes (the pillars; no Wealth Mastery section; no library links), Gaby's calculator, the withdrawal of the resource library, and the GoHighLevel contacts (FR-041) with which Gaby's emails start (US-038, US-039 in GoHighLevel).

Phase 2c (Sprint 004 and later, from Gaby's review of 2026-11-08): the StoryBrand Home (US-034), the calculator with its placeholder formula and its lead storage (US-035, US-036), the GoHighLevel calendar (US-037), the Método Polaris page with placeholder steps (US-028), and the funnel emails once ADR-007 is decided (US-038, US-039).

Phase 2b (later sprint): Blog (FR-027), the video, and the content that arrives later (photos, testimonials, bio and credentials). Email delivery of resources (FR-025) is withdrawn in phase 2d.

Out of scope:
- Online payment
- Course delivery platform
- Authentication
- Full CRM
- An in-house email-marketing platform (NG-006; the funnel emails are in scope, FR-036 to FR-038)
- Complex analytics platform
- SQL persistence
- Languages other than Spanish and English
- Automated status updates in the sheet

## 16. Open Questions

- Production hosting (human owner; US-014 on hold). The domain is gabykelly.com (2026-11-08).
- Gaby's confirmation that only the result goes to GoHighLevel, not the figures (FR-035; brief §8 point 4), and whether she keeps her rounding of the months or prefers rounding down (point 6).
- The GoHighLevel set-up (Gaby, ADR-008): a private integration token for the site (given through the environment's secrets, never in chat or Git), the location id, the custom fields `meses`, `zona`, `moneda`, `alerta_concentracion` and the screening answer, the tags, and the workflows (email 1 for every calculator lead; emails 2 to 6 and the weekly email only with the consent tag; her notification on `aplicacion-vip`; the stop on booking).
- The ebook "Cómo empezar a invertir siendo ejecutivo" and the six email texts, loaded by Gaby into GoHighLevel.
- The answers of the Wealth Mastery page's FAQ (Gaby confirms before publishing) and its "Quién te guía" photo (other than the Home's portrait).
- The "desired state" photo for the Home hero, the studio portrait, and the number of people mentored ("200+" from her current page, to confirm) (Gaby).
- The new VSL and where it is hosted (Gaby, human owner).
- Terms page: whether one is needed and its text (Gaby, legal review)
- Session photos (Gaby), testimonials with authorization (Gaby), bio and credentials (Gaby)
- The VIP explainer video and where it is hosted (Gaby, human owner)
- The ebook title "Cómo empezar a invertir siendo ejecutivo" is masculine singular; BR-005 asks for gender-neutral language toward the visitor (Gaby)
- Permission to show media logos (Canal 13, Radio Azul, Radio Fides); a clean, current Intel logo file and permission to use it (the file shared on 2026-11-08 has a stock-site watermark and is Intel's pre-2020 logo; Intel stays as text)
- Final contact email (currently `gkelly@poliartcr.com`)
- Legal review of the privacy notice, including retention (US-018); it must name GoHighLevel's role in contacts and email (FR-041) before phase 2d goes live

Resolved: brand palette, typography and motif (Gaby's brief, 2026-10-15; replaces Proposal A of 2026-09-25); brand name "Gaby Kelly" and "Método Polaris" (Gaby, 2026-10-15); "Wealth Mastery" is the official VIP programme name (human owner, 2026-10-15); VIP submit label "Enviar mi aplicación" / "Submit my application", the scheduler only for qualified answers (human owner, 2026-10-16); media named without logos, Microsoft and Oracle logos allowed (Gaby, 2026-10-15); disclaimer accepted as written (2026-10-15); how the funnel emails are sent (ADR-007: GoHighLevel, 2026-11-23); Gaby's calculator (2026-11-23); the Método Polaris as three pillars, not steps (Gaby, 2026-11-23); no resource library (Gaby, 2026-11-23); Gaby's GoHighLevel calendar (2026-11-23); bilingual ES/EN kept (human owner, 2026-10-15); preview on GitHub Pages (human owner, 2026-10-15); Google account for the lead sheet (2026-09-28); CAPTCHA not needed for now (ADR-004).

## 17. Approval

v0.3 approved for Sprint 001 (2026-09-23); v0.4 for Sprint 002 (2026-09-28); v0.5 (phase 2) directed by the human owner on 2026-10-15 from Gaby's brief and approved for Sprint 003. v0.6 (phase 2c) directed by the human owner on 2026-11-08 from Gaby's review; approved when its PR was merged (#69). v0.7 (phase 2d) directed by the human owner on 2026-11-23 from Gaby's final content; approved when this document's PR is merged.
