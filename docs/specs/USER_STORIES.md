# USER_STORIES

Backlog source until Jira is available.

## US-001 — Communicate the value proposition
- Priority: High
- Story Points: 3
- Status: Ready

**User Story**

As a visitor,
I want to understand quickly what financial problem the program addresses,
so that I can decide whether the page is relevant to me.

**Acceptance Criteria**
1. The first visible section communicates that good income does not automatically create financial order.
2. The section includes a clear headline, supporting text, and CTA.
3. The content is readable on mobile.
4. The language does not target only one gender.

---

## US-002 — Understand the transformation approach
- Priority: High
- Story Points: 3
- Status: Ready

**User Story**

As a visitor,
I want to understand the proposed path toward better financial health,
so that I can visualize a practical way forward.

**Acceptance Criteria**
1. A simple 3-step conceptual roadmap is visible.
2. The roadmap avoids unnecessary financial jargon.
3. The tone is hopeful rather than fear-based.
4. The roadmap remains clear on mobile.

---

## US-003 — Understand Gabriela's role as guide
- Priority: High
- Story Points: 2
- Status: Ready

**User Story**

As a visitor,
I want to understand who Gabriela is and how she can guide the process,
so that I can decide whether I trust the next step.

**Acceptance Criteria**
1. Gabriela is presented as the guide, not the hero of the story.
2. A space exists for photo, biography, and credentials.
3. Provisional content is clearly treated as pending stakeholder validation.

---

## US-004 — Submit lead information
- Priority: Critical
- Story Points: 5
- Status: Ready

**User Story**

As a visitor,
I want to submit my contact information,
so that I can continue toward a conversation about the program.

**Acceptance Criteria**
1. Form contains name, email, phone, and pre-screening answer.
2. Required fields are enforced.
3. Email format is validated.
4. Validation errors are understandable.
5. Successful submission only occurs after the lead is safely persisted.

---

## US-005 — Complete pre-screening
- Priority: Critical
- Story Points: 3
- Status: Ready

**User Story**

As the business owner,
I want a simple indication of the lead's willingness and approximate capacity to invest,
so that calls can be better prioritized.

**Acceptance Criteria**
1. The question is required.
2. The language is respectful and non-invasive.
3. The answer is stored with the lead.
4. Proposed answer options include:
   - I am ready to invest if the program is right for me.
   - I am willing, but I need to understand the investment first.
   - I am interested, but I do not currently have the capacity to invest.
   - I am only exploring for now.

---

## US-006 — Store lead in Google Sheets
- Priority: Critical
- Story Points: 5
- Status: Ready

**User Story**

As the business owner,
I want submitted leads stored in a simple shared repository,
so that I can review and follow up without a complex CRM.

**Acceptance Criteria**
1. A successful form submission creates a new row in Google Sheets.
2. Name, email, phone, pre-screening answer, and timestamp are stored.
3. The user is not shown success if the save fails.
4. Secrets/credentials are not exposed in client-side code.

---

## US-007 — Schedule through Calendly
- Priority: Critical
- Story Points: 3
- Status: Ready

**User Story**

As a qualified visitor,
I want to schedule a call after submitting my information,
so that I can continue the process immediately.

**Acceptance Criteria**
1. Calendly is presented only after successful lead capture.
2. The Calendly experience works on mobile.
3. The page handles unavailable/failed scheduling integration gracefully.

---

## US-008 — Mobile-friendly experience
- Priority: High
- Story Points: 5
- Status: Ready

**User Story**

As a mobile visitor,
I want the page and form to be easy to use on my phone,
so that I can complete the flow without friction.

**Acceptance Criteria**
1. No horizontal scrolling is required.
2. Form fields are usable on common mobile widths.
3. Content hierarchy remains clear.
4. The 3-step roadmap adapts appropriately to narrow screens.

---

## US-009 — Stakeholder content review
- Priority: High
- Story Points: 3
- Status: Planned for Review

**User Story**

As Gabriela,
I want to review a coherent semi-functional prototype,
so that I can refine the proposed copy, imagery, proof, and positioning without starting from a blank page.

**Acceptance Criteria**
1. Every major section contains meaningful proposed content.
2. Areas requiring final stakeholder input are identifiable.
3. The prototype is navigable and representative enough to discuss content and design.
