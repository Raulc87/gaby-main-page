# AGENTS.md

## Purpose

This repository follows Spec-Driven Development (SDD).

The goal is not to write code as quickly as possible. The goal is to deliver software that conforms to approved specifications and acceptance criteria.

## Mandatory workflow

Requirement -> Discovery -> Specs -> User Stories -> Architecture/UX/Stack -> Plan -> Sprint -> Implementation -> Review -> Verification

Do not skip required stages.

## Source-of-truth priority

When sources conflict, use this order:

1. Approved specification
2. Approved ADR
3. Approved implementation plan
4. Sprint plan
5. User story and acceptance criteria
6. Existing code
7. Informal comments or assumptions

If code conflicts with an approved spec, the spec wins unless the spec is explicitly changed.

## Before implementing

Read:

- `PROJECT_CONTEXT.md`
- relevant `PROJECT_SPEC`
- relevant `FEATURE_SPEC`
- `USER_STORIES.md`
- `TECH_STACK.md`
- relevant ADRs
- `IMPLEMENTATION_PLAN.md`
- active `SPRINT_PLAN.md`

Do not invent business requirements.

If ambiguity materially changes behavior, scope, security, cost, data handling, or architecture, stop and request clarification.

Small implementation details may be decided autonomously when they do not alter the approved behavior.

## Parallel agent rules

- Maximum recommended implementation agents in parallel: 3.
- Agents must not knowingly modify the same responsibility without an explicit integration plan.
- Shared interfaces/contracts must be defined before parallel implementation.
- Each agent owns only its assigned scope.
- Integration must be verified after merging parallel work.
- A change is not complete merely because its own tests pass; it must not break already accepted functionality.

## Pull requests

Each implementation agent should:

1. Work on an isolated branch.
2. Reference the related user stories and acceptance criteria.
3. Keep the PR focused.
4. Include verification evidence.
5. Call out risks, assumptions, and unresolved items.
6. Avoid unrelated refactors.

## Review-only agent

A review-only agent may inspect PRs but must not implement features.

It should verify:

- spec compliance
- acceptance criteria
- code quality
- regressions
- security concerns
- stack compliance
- tests
- integration risks

The human reviewer remains the final approver.

## Testing

Tests must derive from the spec and acceptance criteria.

At minimum, verify:

- happy path
- validation/error path
- critical integration behavior
- regression risk for touched areas

## Definition of Done

Work is done only when:

- implementation matches approved specs
- acceptance criteria pass
- tests pass
- integration remains healthy
- documentation is updated if needed
- review-only agent has completed review when configured
- final human reviewer approves

## Change management

If implementation reveals a requirement change:

1. Update the spec first.
2. Update user stories/acceptance criteria if required.
3. Update plan/sprint scope if required.
4. Then update code.

Never silently change product behavior in code.
