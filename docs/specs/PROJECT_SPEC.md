# PROJECT_SPEC — Gabriela Kelly Financial Health One-Page

## Metadata
- Version: 0.3
- Status: Approved for Sprint 001 / Stakeholder Content Review Pending
- Product: One-page lead-generation website
- Stakeholder: Gabriela Kelly
- Last updated: 2026-09-23 (v0.3: bilingual ES/EN, privacy consent, lead status values, locked lead API contract, local prototype)

## 1. Problem Statement

The target audience may already earn a good income but still experience financial disorder. They may focus on generating more money rather than first organizing, controlling, and making better decisions with the money they already receive.

This can prevent them from building a healthier financial structure and from progressing toward a situation in which investments and assets contribute more meaningfully to their financial goals.

## 2. Product Vision

Create a clear, trustworthy one-page experience that helps qualified visitors recognize the value of financial organization, understand Gabriela's proposed guidance, and take the next step by leaving their information and booking a call.

## 3. Goals

- G-001: Communicate the core financial-health problem clearly.
- G-002: Present a hopeful and non-manipulative path toward greater financial order.
- G-003: Generate qualified leads.
- G-004: Pre-screen leads for willingness and approximate capacity to invest.
- G-005: Make it easy for qualified visitors to book a call.

## 4. Non-Goals

- NG-001: Provide personalized financial advice directly on the page.
- NG-002: Build a full course platform.
- NG-003: Build a complex CRM.
- NG-004: Build a SQL database for the pilot.
- NG-005: Guarantee financial results.

## 5. Users / Actors

### Visitor / Prospective Client
A person who:
- already has sufficient income to consider financial reorganization
- feels financially disorganized
- may default to seeking more income instead of improving money management
- may have limited investment knowledge
- wants greater financial clarity and healthier financial structure
- reads Spanish or English

### Gabriela / Business Owner
Needs:
- qualified leads
- contact information
- a basic indication of lead willingness/capacity to invest
- an easy path for leads to schedule a call
- a simple way to track each lead's follow-up status

## 6. Functional Requirements

- FR-001: The page must communicate the core value proposition above the fold.
- FR-002: The page must explain the problem in a calm, hopeful way.
- FR-003: The page must present Gabriela as a guide.
- FR-004: The page must present a simple conceptual transformation path.
- FR-005: The page must include space for proof/credibility.
- FR-006: The page must include a lead form.
- FR-007: The form must collect full name, email, phone number, one pre-screening answer, and privacy consent.
- FR-008: The pre-screening question must help indicate willingness and approximate capacity to invest.
- FR-009: Submitted lead data must be stored.
- FR-010: After successful lead capture, the visitor must be able to proceed to Calendly, embedded inline on the page.
- FR-011: The experience must work correctly on mobile devices.
- FR-012: All visitor-facing content must be available in Spanish and English. The initial language is Spanish when the browser's preferred language is Spanish (any `es` variant) and English otherwise. A language toggle at the top of the page lets the visitor switch at any time.
- FR-013: The form must require explicit acceptance of a privacy notice before submission, in line with Costa Rica's personal data protection law (Ley N.° 8968).
- FR-014: After a successful submission, the page must thank the visitor and state that they may be contacted by email or WhatsApp.
- FR-015: If the Calendly scheduler cannot be displayed, the page must offer a fallback `mailto:` link to the business contact email.
- FR-016: Each stored lead must carry a follow-up status. New leads start as `started`; allowed values are `started`, `contacted`, `booked`, `not_interested_yet`, `dropped`.

## 7. Non-Functional Requirements

- NFR-001: Mobile-first responsive behavior.
- NFR-002: Fast loading for a content-focused one-page site.
- NFR-003: Clear, legible content hierarchy.
- NFR-004: Avoid unnecessary technical complexity.
- NFR-005: Form errors must be understandable, in the visitor's selected language.
- NFR-006: A failed data save must not be presented as a successful submission.
- NFR-007: Lead data and credentials must be handled server-side only; no secrets in client code or in Git.
- NFR-008: Before any public deployment, the lead endpoint must have spam/abuse protection (US-013). Not required for the local Sprint 001 prototype.

## 8. Business Rules

- BR-001: Lead contact data is required before proceeding to the scheduling step.
- BR-002: The pre-screening question is required.
- BR-003: Marketing copy must avoid guaranteed financial outcomes.
- BR-004: Proposed copy and imagery are subject to Gabriela's validation.
- BR-005: The page must use gender-neutral, inclusive language in both Spanish and English, and must not target only women or only men.
- BR-006: Privacy consent is required before a lead is stored.
- BR-007: Code, identifiers, stored codes, and data field names are in English and use `snake_case`. Visitor-facing content is bilingual (Spanish/English).

## 9. Main Product Flow

1. Visitor lands on the page; it opens in Spanish or English based on the browser language.
2. Visitor may switch language with the toggle at the top.
3. Visitor understands the value proposition.
4. Visitor recognizes the financial-health problem.
5. Visitor sees a simple path toward greater clarity and organization.
6. Visitor learns who Gabriela is and why she can guide the process.
7. Visitor sees the proposed offer/call.
8. Visitor submits full name, email, phone, pre-screening answer, and accepts the privacy notice.
9. Lead is stored successfully.
10. Visitor sees a thank-you message and the inline Calendly scheduler (or the email fallback if Calendly is unavailable).
11. Visitor books a call.

## 10. Data and Integrations

Data to capture (exact contract: `docs/specs/LEAD_API_CONTRACT.md`):
- `name` (full name)
- `email`
- `phone` (international format, e.g. `+50684104791`)
- `screening_answer` (code)
- `language` (`es` / `en`)
- `consent`
- `submitted_at` (server-generated, `DD/MM/YYYY HH:mm:ss`, `America/Costa_Rica`)
- `privacy_notice_version` (server-generated)
- `status` (server sets `started`; business owner updates manually)

Integrations:
- Google Sheets for lead storage (service account; see ADR-002)
- Calendly for call scheduling (inline embed)

Personal data:
- Governed by Costa Rica's Ley N.° 8968 (Protección de la Persona frente al Tratamiento de sus Datos Personales).
- Processors: Google (Sheets storage), Calendly (scheduling).

## 11. Constraints

- Hosting is GoDaddy with cPanel for both the static frontend and the Python endpoint (see ADR-001).
- Pilot should avoid a relational database.
- The stack should remain lightweight.
- The final copy and imagery require stakeholder review.
- Up to 3 implementation agents may work in parallel.
- Sprint 001 targets a locally runnable prototype; production deployment is a later story (US-014).

## 12. Assumptions

- Gabriela has or can provide a Calendly account/link.
- A Google Sheet can be created for lead storage, owned by the project owner's or Gabriela's Google account (TBD).
- Real photos/testimonials/credentials may be supplied later.
- A provisional visual direction is acceptable for the first prototype.
- The GoDaddy cPanel plan provides "Setup Python App" (to be confirmed before US-014; see ADR-001).

## 13. Risks

- Final content may change after stakeholder review.
- Google credentials and Calendly configuration may delay integration.
- Parallel agent changes may conflict if shared contracts are not defined first.
- Privacy notice text requires legal review before public launch.

## 14. Success Criteria

- The visitor can understand the offer without additional explanation, in Spanish or English.
- The lead form captures all required data.
- Leads are stored successfully.
- The visitor can proceed to Calendly after successful capture.
- The page is usable on desktop and mobile.
- The prototype is strong enough for Gabriela to review copy, imagery, and positioning.

## 15. Out of Scope

- Online payment
- Course delivery
- Authentication
- Full CRM
- Complex analytics platform
- SQL persistence
- Languages other than Spanish and English
- Automated status updates in the sheet

## 16. Open Questions

- Final brand palette
- Final images
- Final proof/testimonials
- Final Gabriela bio/credentials
- Exact Calendly URL
- Google account that owns the lead sheet (project owner or Gabriela)
- Final contact email (currently `gkelly@poliartcr.com`)
- Legal review of the privacy notice, including the data-retention period

## 17. Approval

Approved for planning, prototyping, and Sprint 001 by the human project owner (v0.3 revisions directed on 2026-09-23).
Final marketing content remains pending Gabriela's review.
