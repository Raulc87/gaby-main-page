# SPRINT 001 — Planned / NOT STARTED

## Metadata
- Status: PLANNED — DO NOT START YET
- Duration: 7 business days
- Saturdays and Sundays excluded
- Start: TBD
- End: TBD
- Final reviewer: Human project owner

## Sprint Goal

Deliver the first functional end-to-end prototype of the Gabriela Kelly one-page lead-generation site.

## Required Deliverable

A demonstrable prototype that:
- communicates the proposed offer
- includes the proposed UX/content structure
- captures lead information
- stores the lead in Google Sheets
- enables Calendly scheduling after successful storage
- works on mobile

## Planned Stories

| Story | Points | Planned Owner | Status |
|---|---:|---|---|
| US-001 | 3 | Agent 1 | Planned |
| US-002 | 3 | Agent 1 | Planned |
| US-003 | 2 | Agent 1 | Planned |
| US-004 | 5 | Agent 2 | Planned |
| US-005 | 3 | Agent 2 | Planned |
| US-006 | 5 | Agent 3 | Planned |
| US-007 | 3 | Agent 3 | Planned |
| US-008 | 5 | Shared | Planned |
| US-009 | 3 | Sprint Review | Planned |

Total planned points: 32

## Parallel Workstreams

### Agent 1 — UI/content
- page shell
- hero
- problem/hope section
- roadmap
- guide section
- proof placeholder
- offer
- closing CTA
- responsive support

### Agent 2 — Form
- fields
- validation
- pre-screening UI
- loading/error/success states
- responsive form

### Agent 3 — Backend/integrations
- Python lead endpoint
- Google Sheets persistence
- secure configuration
- Calendly transition behavior

## Integration Contract Required Before Development

Lead request:
- name
- email
- phone
- screeningAnswer

Lead response:
- success
- safe message
- optional non-sensitive error code

## Review Model

- Implementation agents create focused PRs.
- Review-only agent performs technical/spec review and does not implement.
- Human project owner is the final reviewer/approver.

## Integration Safety

Parallel work is not considered complete until:
- branches are merged
- CI is green
- critical end-to-end flow is rerun
- previously accepted behavior remains working

## Sprint Definition of Done

- Selected stories satisfy acceptance criteria.
- Required automated checks pass.
- End-to-end lead flow works.
- No known critical regression remains.
- Human reviewer approves.
- Prototype is ready to show Gabriela.

## Important

This sprint must remain **NOT STARTED** until:
1. the Starter Kit repository exists in GitHub
2. this pilot repository exists in GitHub
3. repository structure is validated
4. agent bootstrap instructions are validated
5. final go-ahead is given
