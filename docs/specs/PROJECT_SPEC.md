# PROJECT_SPEC — Gaby Kelly: from corporate life to financial freedom

## Metadata
- Version: 0.5
- Status: Phase 2 (brand redesign and multipage site) — proposed, pending human-owner approval
- Product: Bilingual website with free resources and one premium path (VIP mentorship application and call booking)
- Stakeholder: Gabriela Kelly ("Gaby Kelly")
- Last updated: 2026-10-15 (v0.5: phase 2 from Gabriela's visual brief of 2026-10-15 — new audience and concept, official brand, multipage site, free resource library, one VIP path with screening-based routing, GitHub Pages preview; production deployment on hold). v0.4 (2026-09-28): spam protection (ADR-004), production Google account. v0.3 (2026-09-23): bilingual ES/EN, privacy consent, lead status values, locked lead API contract, local prototype.

Phase 2 source: Gabriela's visual brief "Brief visual — sitio Gaby Kelly" (five boards: brief and palette, home, resource library, VIP flow, mobile hero), https://claude.ai/artifact/LeuEgX7HC2otdkLEhcJM5j, received 2026-10-15. A text export of the five boards is kept in `docs/ux/BRIEF_2026-10-15.md`. The brief is a reference; this spec, `UX_UI_DIRECTION.md` and `CONTENT.md` are the sources agents implement from.

## 1. Problem Statement

Executives and professionals at multinational companies often earn well and receive valuable corporate benefits, yet their money does not give them peace of mind. Each raise tends to fund a slightly more expensive lifestyle; they may not know how many months they could sustain themselves if their position changed; and their attention stays on work even when they are at home.

Their careers already give them the tools to build wealth (salary, raises, insurance, allowances, paid travel, English, international access, networks). What they lack is a system to turn those benefits into invested capital and financial freedom.

## 2. Product Vision

"Del mundo corporativo a tu libertad financiera" / "From corporate life to your financial freedom."

A calm, premium website where corporate professionals recognize their situation, learn from plenty of free resources, get to know Gaby's story and method, and, when ready, take one premium path: apply to work directly with Gaby (VIP mentorship) and book an initial call.

## 3. Goals

- G-001: Communicate the core problem and the opportunity clearly to corporate professionals.
- G-002: Present a hopeful, non-manipulative path (the Método Polaris) toward financial order and wealth.
- G-003: Generate qualified VIP applications.
- G-004: Pre-screen applicants for willingness and approximate capacity to invest.
- G-005: Make it easy for qualified applicants to book a call.
- G-006: Build trust and an audience through free resources, without pressure.
- G-007: Express Gaby Kelly's official brand (palette, typography, motif).

## 4. Non-Goals

- NG-001: Provide personalized financial advice on the site.
- NG-002: Build a full course platform (mini-courses are delivered as links, files or email, not as a learning platform).
- NG-003: Build a complex CRM.
- NG-004: Build a SQL database.
- NG-005: Guarantee financial results.
- NG-006: Run email marketing campaigns or newsletters from this project (bulk sending, sequences, analytics). The site only delivers a requested resource and records consent; campaigns, if wanted later, use a dedicated tool.

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
- a respectful path for people not ready yet (free resources)
- free resources that reach people interested in them
- a simple way to track each lead's follow-up status

## 6. Functional Requirements

### Site and navigation
- FR-017: The site has these pages, each in Spanish and English: Home; My story (Mi historia); Free resources (Recursos gratis); VIP mentorship (Mentoría VIP: application, then scheduling); Blog (phase 2b, see section 15); Privacy notice (a page linked from the footer; the consent links keep opening it in a dialog, US-018). The Método Polaris is a Home section for now; it becomes its own page when its official steps arrive (US-028). A Terms page is added only when its text exists (section 16).
- FR-018: A header on every page shows the brand name, the navigation (My story, Método Polaris, Free resources, Blog when it exists, language toggle) and one VIP link styled as an outlined (secondary) button, as in the brief's Home board. On mobile the navigation collapses into a menu; the VIP link stays reachable.
- FR-019: One premium path. Every VIP call to action leads to the VIP mentorship page. Gold is used only for in-page VIP calls to action (the Home hero button, VIP bands, the VIP application's submit button), never for the header link, and at most one gold button is visible in any viewport (BR-010). Free actions (resources, story, downloads) use the blue style.
- FR-020: A footer on every page shows the brand name and concept, the legal disclaimer (FR-028), a link to the privacy notice, and the Ley 8968 data-protection note. A Terms link is added when the Terms page exists.

### Home
- FR-001: The Home communicates the concept and value proposition above the fold, with the VIP button and a link to start free with the resources.
- FR-002: The Home explains the problem in a calm, hopeful way (the corporate ladder and the lack of freedom).
- FR-021: The Home presents the opportunity: the corporate benefits that can become investable capital.
- FR-004: The Home presents the Método Polaris as a simple three-step path.
- FR-022: The Home shows a free-resources teaser (three resource cards and a link to the library), a My story teaser (with media mentions) and a testimonials section, then a VIP band that leads to the VIP page.
- FR-005: The site includes space for proof and credibility (testimonials, media mentions, experience); placeholders are visibly marked until real, authorized content arrives.

### My story
- FR-003: The My story page presents Gaby as a guide: her corporate career, the turning point, and how she now accompanies corporate professionals; with space for photos, bio and credentials.
- FR-029: Media mentions are shown as names only (no media logos) until their logo use is authorized. Logos of companies where Gaby worked (Microsoft, Oracle) may be shown as prior experience.

### Free resources
- FR-023: The resource library page lists free resources as cards (type, access, title, topic, call to action), can be filtered by topic, and features one mini-course.
- FR-024: A resource is either a free download (direct link to a file, no data collected) or delivered by email. Only resources whose real file or content has been delivered are linked; the others are shown as pending (BR-011) without a link. Until email delivery exists (FR-025), email-delivered resources are shown as "coming soon" and collect nothing.
- FR-025 (phase 2b): For an email-delivered resource, the visitor enters an email address and accepts the privacy notice; the site stores the request and sends the resource by email from Gaby's account. Each email states why it was sent and how to opt out of further emails.

### VIP mentorship (application and scheduling)
- FR-006: The VIP page includes the application form.
- FR-007: The form collects full name, email, phone (WhatsApp), one pre-screening answer, and privacy consent.
- FR-008: The pre-screening question indicates willingness and approximate capacity to invest.
- FR-009: Submitted applications are stored.
- FR-026: The VIP page has a module for a short video from Gaby explaining the mentorship; until the video arrives, the module shows a visible placeholder.
- FR-010: After a successful save, the next step depends on the screening answer:
  - `ready_to_invest` or `needs_investment_info`: thank-you message and the Calendly scheduler embedded inline (as before).
  - `no_capacity_now` or `exploring`: a warm thank-you screen without the scheduler, offering the featured free mini-course (from phase 2b, requested by email through FR-025).
  In both cases the application is stored with its screening answer.
- FR-014: Every thank-you states that Gaby's team may reach out by email or WhatsApp.
- FR-015: If the Calendly scheduler cannot be displayed, the page offers a fallback `mailto:` link to the business contact email.
- FR-016: Each stored lead carries a follow-up status. New leads start as `started`; allowed values are `started`, `contacted`, `booked`, `not_interested_yet`, `dropped`.

### Blog (phase 2b)
- FR-027: Blog posts are written as files in the repository (Markdown) and published with the site. The blog list page exists in both languages and lists the posts of its language. A post exists in the languages it was written in; the language toggle on a post leads to its translation when there is one, and to the blog list of the other language otherwise. The navigation shows Blog only once at least one post exists.

### Cross-cutting
- FR-011: The site works correctly on mobile devices.
- FR-012: All visitor-facing content is available in Spanish and English. The initial language is Spanish when the browser's preferred language is Spanish (any `es` variant) and English otherwise. A language toggle in the header switches to the same page in the other language.
- FR-013: Any form that stores personal data requires explicit acceptance of the privacy notice before submission (Costa Rica, Ley N.° 8968).
- FR-028: The footer shows the legal disclaimer: Gaby Kelly is an investor and mentor, not a financial advisor; the content is educational and not an investment recommendation. Its text is assumed reviewed (human owner, 2026-10-15) and changes through a docs PR if legal review asks for it.
- FR-030: A preview of the site is published on GitHub Pages so Gaby can review progress. The preview is not indexed by search engines, shows a visible "preview" marker, and its forms do not store or send anything, to the site or to any third party: they show the next screen as a demonstration (including the FR-010 routing, with a static stand-in for the scheduler) and say so.

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
- BR-009: The brand name on the site is "Gaby Kelly". The method is called "Método Polaris" (English: "Polaris Method") for now; a later name change is its own story.
- BR-010: Gold is reserved for in-page VIP calls to action: at most one gold button visible in any viewport ("screen" means the viewport). The header VIP link is never gold.
- BR-011: Testimonials, media logos, photos and quantified claims are shown only when real and authorized; until then they are visibly marked placeholders. Nothing is invented.

## 9. Main Product Flows

**Free path**
1. Visitor lands on the Home in Spanish or English (browser language), and may switch language.
2. Visitor recognizes the problem and the opportunity, sees the Método Polaris and Gaby's story.
3. Visitor opens the resource library and downloads a free resource (or, from phase 2b, requests one by email).

**VIP path**
1. From any page, visitor presses the VIP button and reaches the VIP page (video module, application form).
2. Visitor submits full name, email, phone, screening answer, and accepts the privacy notice.
3. The application is stored.
4. Qualified answer: thank-you and the inline Calendly scheduler (or the email fallback); visitor books a call.
5. Not-ready answer: warm thank-you with the free mini-course (from phase 2b, requested by email).

## 10. Data and Integrations

VIP applications (exact contract: `docs/specs/LEAD_API_CONTRACT.md`, unchanged by phase 2):
- `name`, `email`, `phone` (international format), `screening_answer` (code), `language`, `consent`
- `submitted_at`, `privacy_notice_version` (server-generated); `status` (server sets `started`)

Resource requests (phase 2b; contract to be written before implementation): email, language, resource identifier, consent, server-generated timestamp and privacy notice version. They are not a subscription: the site sends only the requested resource (NG-006).

Integrations:
- Google Sheets for storage (ADR-002); resource requests go to their own tab or sheet.
- Calendly for call scheduling (inline embed).
- Email sending for resource delivery (phase 2b): from Gaby's Google account (Gmail), mechanism decided in an ADR before implementation (Google Apps Script or the existing Python backend).
- GitHub Pages for the preview (static only; no backend).

Personal data:
- Governed by Costa Rica's Ley N.° 8968.
- Processors: Google (Sheets storage; Gmail from phase 2b), Calendly (scheduling), and any video host added later.

## 11. Constraints

- Production hosting and domain are not known yet (Gaby's domain and its hosting capabilities). ADR-001 (GoDaddy cPanel, Python app at `/api`) stays the working assumption and is revisited when they are known; production deployment (US-014) is on hold until then.
- The preview runs on GitHub Pages: static files only, under the repository path.
- No relational database.
- Keep the stack lightweight.
- Final copy and imagery require Gaby's review.
- Up to 3 implementation agents may work in parallel.

## 12. Assumptions

- Gaby has or can provide a Calendly account/link.
- Production leads are stored in a Google Sheet in Gaby's Google account; development uses the project owner's sheet or memory mode.
- Gaby provides a Gmail (or Google Workspace) account to send resources from (phase 2b).
- Real photos, testimonials, credentials, resource names and the video are supplied later; placeholders stay until then.
- The legal disclaimer is acceptable as written (human owner, 2026-10-15).

## 13. Risks

- Content arrives late or changes after review.
- Email from a new Gmail account can land in spam; delivery must be tested before release (Gmail and Outlook inboxes).
- A consumer Gmail account has daily sending limits; volume beyond them needs a Workspace account or a dedicated provider.
- Parallel agent changes may conflict if shared components and contracts are not defined first.
- The preview is publicly reachable by URL; it must not be mistaken for the real site or collect data.

## 14. Success Criteria

- A corporate professional understands the concept and the offer without additional explanation, in Spanish or English.
- The site expresses the official brand on desktop and mobile.
- Free resources are easy to find and use.
- The VIP application captures all required data and is stored.
- Qualified applicants can book a call right after applying; others receive a respectful free alternative.
- Gaby can review progress on the preview at any time.

## 15. Phasing and Out of Scope

Phase 2a (next sprint): brand skin, site structure and navigation, Home with the new copy, My story, VIP page with routing and video placeholder, resource library (free downloads; email resources marked "coming soon"), footer with disclaimer, mobile, GitHub Pages preview.

Phase 2b (later sprint): email delivery of resources (FR-025), Blog (FR-027), the Método Polaris page (US-028), the video, and the content that arrives later (photos, testimonials, resource names and files, official Método Polaris steps, bio and credentials).

Out of scope:
- Online payment
- Course delivery platform
- Authentication
- Full CRM
- Email marketing campaigns and newsletters (NG-006)
- Complex analytics platform
- SQL persistence
- Languages other than Spanish and English
- Automated status updates in the sheet

## 16. Open Questions

- Production domain and hosting capabilities (human owner; US-014 on hold)
- Official Método Polaris steps and final name (Gaby)
- Names and files of the free resources and the featured mini-course (Gaby)
- Terms page: whether one is needed and its text (Gaby, legal review)
- Session photos (Gaby), testimonials with authorization (Gaby), bio and credentials (Gaby)
- The VIP explainer video and where it is hosted (Gaby, human owner)
- Permission to show media logos (Canal 13, Radio Azul, Radio Fides); Intel logo (only Microsoft and Oracle are confirmed)
- Sending account for resource emails (phase 2b)
- Exact Calendly URL; final contact email (currently `gkelly@poliartcr.com`)
- Legal review of the privacy notice, including retention (US-018); it must also cover resource requests before phase 2b goes live

Resolved: brand palette, typography and motif (Gaby's brief, 2026-10-15; replaces Proposal A of 2026-09-25); brand name "Gaby Kelly" and "Método Polaris" (Gaby, 2026-10-15); media named without logos, Microsoft and Oracle logos allowed (Gaby, 2026-10-15); disclaimer accepted as written (2026-10-15); bilingual ES/EN kept (human owner, 2026-10-15); preview on GitHub Pages (human owner, 2026-10-15); Google account for the lead sheet (2026-09-28); CAPTCHA not needed for now (ADR-004).

## 17. Approval

v0.3 approved for Sprint 001 (2026-09-23); v0.4 for Sprint 002 (2026-09-28). v0.5 (phase 2) directed by the human owner on 2026-10-15 from Gaby's brief; approved when this document's PR is merged.
