# IMPLEMENTATION_PLAN — Gabriela Kelly Pilot

## Metadata
- Version: 0.2
- Status: Approved for sprint planning
- Related spec: `docs/specs/PROJECT_SPEC.md`
- Related stories: `docs/specs/USER_STORIES.md`
- Tech stack: `TECH_STACK.md`

## 1. Purpose

Build a semi-functional one-page prototype that can be reviewed with Gabriela and that validates the complete lead-generation flow.

## 2. Technical Scope

- Responsive one-page frontend
- Proposed marketing content
- Lead form
- Pre-screening question
- Python endpoint
- Google Sheets persistence
- Calendly handoff
- Automated checks for critical paths

## 3. Traceability

### UI / Content
- US-001 -> Hero/value proposition
- US-002 -> 3-step transformation
- US-003 -> Gabriela-as-guide section
- US-008 -> responsive behavior
- US-009 -> stakeholder-reviewable prototype

### Lead Capture
- US-004 -> form and validation
- US-005 -> pre-screening

### Integrations
- US-006 -> Python endpoint + Google Sheets
- US-007 -> Calendly handoff

## 4. Current State

No implementation yet.

## 5. Target State

A demonstrable end-to-end prototype that:
1. presents the offer
2. captures lead data
3. persists the lead
4. directs the visitor to Calendly
5. works on mobile
6. is suitable for content/design review with Gabriela

## 6. Technical Approach

### Frontend
Astro + TypeScript + Tailwind CSS.

### Backend
Python endpoint compatible with GoDaddy/cPanel.

### Persistence
Google Sheets.

### Scheduling
Calendly.

## 7. Components

Suggested frontend sections/components:
- Hero
- Recognition
- TransformationRoadmap
- Guide
- SocialProof
- Offer
- LeadForm
- Scheduling
- ClosingCTA

Backend:
- lead submission endpoint
- server-side validation
- Google Sheets adapter/service

## 8. Data Contract

Lead payload:
- name
- email
- phone
- screeningAnswer

Server-generated:
- submittedAt
- optional status

Response contract:
- success boolean
- safe user-facing message
- optional error code for non-sensitive troubleshooting

This contract should be agreed before parallel agents begin.

## 9. Implementation Steps

1. Initialize Astro/TypeScript/Tailwind project.
2. Create page structure and responsive layout.
3. Implement meaningful proposed copy.
4. Implement form UI and client-side validation.
5. Define and lock lead submission contract.
6. Implement Python endpoint with server-side validation.
7. Implement Google Sheets persistence.
8. Connect frontend form to endpoint.
9. Show Calendly only after successful persistence.
10. Add failure states.
11. Add responsive verification.
12. Add automated tests for critical flow.
13. Run integration verification after merging parallel work.
14. Prepare prototype for Gabriela review.

## 10. Parallelization Plan

### Agent 1 — UI and content
Primary stories:
- US-001
- US-002
- US-003
- part of US-008
- part of US-009

### Agent 2 — Form and validation
Primary stories:
- US-004
- US-005
- part of US-008

### Agent 3 — Backend and integrations
Primary stories:
- US-006
- US-007

### Shared contract
Before agents 2 and 3 implement integration work, agree on:
- request payload
- response payload
- validation rules
- success/failure semantics

## 11. Merge / Integration Guidance

1. Base project structure first.
2. UI sections and form may proceed in parallel after shared layout conventions are stable.
3. Backend may proceed in parallel after the lead API contract is agreed.
4. Integration PR connects form to backend.
5. Run full regression after each merge that affects the critical flow.

## 12. Testing Strategy

- Build succeeds.
- Form validation tests.
- Endpoint validation tests.
- Persistence failure test.
- Browser test:
  landing -> form -> successful save -> Calendly available.
- Mobile viewport checks.
- Regression checks after merging parallel work.

## 13. Error Handling

- Invalid form: show field-level/clear feedback.
- Backend failure: do not show successful submission.
- Google Sheets failure: do not unlock the normal success path.
- Calendly unavailable: show a graceful message/fallback.

## 14. Rollback

Because the project is initially simple:
- use Git commits/PRs as the primary rollback mechanism
- preserve last known good deployable revision

## 15. Risks

- cPanel Python runtime limitations
- Google authentication setup
- Calendly embed/link behavior
- cross-agent merge conflicts
- provisional content changes after stakeholder review

## 16. Definition of Done

- Required user stories satisfy acceptance criteria.
- CI checks pass.
- Critical integration flow works.
- Mobile layout works.
- Review-only agent has reviewed relevant PRs.
- Human reviewer has approved.
- Prototype is ready for Gabriela review.
