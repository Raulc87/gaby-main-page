# TECH_STACK — Gabriela Kelly Pilot

## Metadata
- Version: 0.1
- Status: Approved for planning
- Complexity: Simple

## 1. Complexity Assessment

This is a content-heavy one-page site with:
- lead form
- one lightweight backend endpoint
- Google Sheets persistence
- Calendly integration

A heavy application framework or relational database is not justified.

## 2. Hosting and Environment Constraints

- Hosting provider: GoDaddy
- Expected environment: cPanel
- Cloud migration target: None required
- AWS: Not required
- Preference: technologies that are straightforward to deploy on conventional hosting

## 3. Selection Principle

Use the least-complex stack that satisfies the requirements and works reliably in the target hosting environment.

## 4. Frontend

### Selected
- Astro
- TypeScript
- Tailwind CSS

### Why
- Excellent fit for a mostly static one-page site
- Low runtime complexity
- Fast delivery
- Easy responsive styling
- Keeps JavaScript payload small

### Not selected for current scope
- React SPA
- Next.js
- Angular

Reason: unnecessary complexity for the current requirements.

## 5. Backend

### Selected
- Python 3.11
- Minimal endpoint compatible with the available cPanel Python environment

### Responsibility
- accept form submission
- validate server-side input
- write lead to Google Sheets
- return success/failure response
- never expose Google credentials client-side

### Framework
Keep framework choice minimal and compatible with the exact GoDaddy/cPanel runtime available at deployment time.

If a lightweight WSGI framework is needed, Flask is acceptable.

## 6. Persistence

### Selected
Google Sheets

Expected columns:
- submitted_at
- name
- email
- phone
- screening_answer
- status

No SQL database for the pilot.

## 7. Scheduling

Calendly.

The visitor proceeds to scheduling only after successful lead persistence.

## 8. Testing

- Vitest for relevant frontend logic
- Playwright for the critical browser flow
- Python tests for endpoint validation and integration boundaries where practical

## 9. CI/CD

GitHub Actions.

Checks should include:
- build
- automated tests
- lint/type checks as configured

Deployment to GoDaddy may initially be manual or scripted depending on cPanel capabilities.

## 10. Security and Secrets

- Google credentials must remain server-side.
- Do not commit secrets to Git.
- Use hosting environment variables or protected configuration.
- Validate and sanitize incoming form data.

## 11. Scaling Path

Re-evaluate the stack if future requirements introduce:
- authenticated users
- payments
- course delivery
- large-scale CRM needs
- complex workflows
- significant reporting
- high write volume
- multi-tenant behavior
