// US-013 client-side spam protection (LEAD_API_CONTRACT.md v1.1 sections 3.1
// and 3.2; UX_UI_DIRECTION.md section 4, Section 7). Three independent
// things:
//
// 1. The honeypot field `website` (AC1): verified in Chromium at desktop and
//    390 px — not visible, not reachable with Tab, empty after load and
//    after filling the visible fields. This spec runs under the
//    `desktop-chromium` Playwright project by default; the 390 px checks
//    below use `test.use({ viewport })` to get that width without touching
//    playwright.config.ts (owned by Agent 1).
// 2. The honeypot decoy against the real backend (AC2, GK-013-spam-protection
//    merged): a filled `website` still returns 201 and looks identical to a
//    real submission from the visitor's side.
// 3. `429` / `rate_limited` (AC3/AC4), forced via route mocking (deliberately
//    independent of the real rate limiter's timing/window, which pytest
//    already covers): the localized "too many attempts" message is shown,
//    the entered data stays, and neither success nor Calendly appear.
import { expect, test, type Page } from '@playwright/test';
import { form as enForm } from '../../src/i18n/en/form';
import { form as esForm } from '../../src/i18n/es/form';
import { fillLeadForm, gotoLang, SELECTORS, VALID_LEAD } from './support/lead-form';

async function expectHoneypotMitigations(page: Page): Promise<void> {
  const honeypot = page.locator(SELECTORS.honeypotInput);
  await expect(honeypot).toHaveCount(1);

  // Off-screen, not `display: none` (US-013 AC1): still in the layout, but
  // its box sits fully outside the viewport's left edge.
  const box = await honeypot.boundingBox();
  expect(box).not.toBeNull();
  if (box) {
    expect(box.x + box.width).toBeLessThanOrEqual(0);
  }

  await expect(honeypot).toHaveAttribute('type', 'text');
  await expect(honeypot).toHaveAttribute('name', 'website');
  await expect(honeypot).toHaveAttribute('tabindex', '-1');
  await expect(honeypot).toHaveAttribute('autocomplete', 'off');

  const wrapper = page.locator('[aria-hidden="true"]', { has: honeypot });
  await expect(wrapper).toHaveCount(1);

  // No visible label: no <label> should be associated with it.
  const labelCount = await page.locator(`label[for="${await honeypot.getAttribute('id')}"]`).count();
  expect(labelCount).toBe(0);
}

/**
 * The honeypot `<div>` is the first control inside `<form>` (LeadForm.astro),
 * immediately before `#lead-name` in DOM order. That makes Shift+Tab from
 * `#lead-name` the one direct probe of `tabindex="-1"`: without it, that
 * exact key press would land on the honeypot (verified by hand against this
 * build with `tabindex` removed). A forward Tab walk from `#lead-name`
 * cannot reach it regardless of `tabindex` — the honeypot precedes that
 * field — so it proves nothing about the mitigation on its own; kept here
 * only as defense-in-depth against a future reordering of the form fields.
 */
async function expectHoneypotUnreachableByTab(page: Page): Promise<void> {
  await page.locator(SELECTORS.nameInput).focus();
  await page.keyboard.press('Shift+Tab');
  const shiftTabTargetId = await page.evaluate(() => document.activeElement?.id ?? '');
  expect(shiftTabTargetId).not.toBe('lead-website');

  await page.locator(SELECTORS.nameInput).focus();
  const forwardFocusedIds: string[] = [];
  for (let i = 0; i < 8; i += 1) {
    await page.keyboard.press('Tab');
    forwardFocusedIds.push(await page.evaluate(() => document.activeElement?.id ?? ''));
  }
  expect(forwardFocusedIds).not.toContain('lead-website');
}

async function expectHoneypotEmpty(page: Page): Promise<void> {
  await expect(page.locator(SELECTORS.honeypotInput)).toHaveValue('');
  await fillLeadForm(page);
  await expect(page.locator(SELECTORS.honeypotInput)).toHaveValue('');
}

for (const [description, viewportOptions] of [
  ['desktop', undefined],
  ['at 390 px', { viewport: { width: 390, height: 844 } }],
] as const) {
  test.describe(`honeypot field (${description})`, () => {
    if (viewportOptions) test.use(viewportOptions);

    test('is off-screen, unlabeled, and carries the required mitigations', async ({ page }) => {
      await gotoLang(page, 'es');
      await expectHoneypotMitigations(page);
    });

    test('is not reachable with Tab', async ({ page }) => {
      await gotoLang(page, 'es');
      await expectHoneypotUnreachableByTab(page);
    });

    test('is empty after load and stays empty after filling the visible fields', async ({ page }) => {
      await gotoLang(page, 'es');
      await expectHoneypotEmpty(page);
    });
  });
}

test.describe('honeypot decoy against the real backend (memory mode)', () => {
  test('a filled website still returns the normal success response, indistinguishable from a real submission', async ({
    page,
  }) => {
    await gotoLang(page, 'es');
    await fillLeadForm(page);
    // A bot fills every field it can reach in the DOM, ignoring the CSS that
    // keeps this one off-screen for people (contract section 3.1).
    await page.locator(SELECTORS.honeypotInput).fill('https://bot.example');
    await page.locator(SELECTORS.submitButton).click();

    await expect(page.locator(SELECTORS.formContainer)).toBeHidden();
    await expect(page.locator(SELECTORS.successContainer)).toBeVisible();
    await expect(page.getByRole('heading', { name: esForm.thankYou.title })).toBeVisible();

    // Nothing is stored for this decoy request (contract section 3.1); that
    // the server does not persist it is covered by api/tests/test_spam_protection.py
    // — there is no HTTP-observable way to assert it from here.
  });
});

test.describe('429 / rate_limited (mocked)', () => {
  test('shows the localized "too many attempts" message, keeps form data, and never shows success', async ({
    page,
  }) => {
    await page.route('**/api/save-lead', (route) =>
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        headers: { 'Retry-After': '60' },
        body: JSON.stringify({
          success: false,
          message: 'Too many requests.',
          error_code: 'rate_limited',
          field_errors: null,
        }),
      }),
    );

    await gotoLang(page, 'en');
    await fillLeadForm(page);
    await page.locator(SELECTORS.submitButton).click();

    await expect(page.locator(SELECTORS.submissionError)).toBeVisible();
    await expect(page.locator(SELECTORS.submissionError)).toContainText(
      enForm.rateLimited.split('{contact_email}')[0].trim(),
    );

    await expect(page.locator(SELECTORS.formContainer)).toBeVisible();
    await expect(page.locator(SELECTORS.successContainer)).toBeHidden();
    await expect(page.locator(SELECTORS.calendlyWidget)).toBeHidden();

    // Data kept for retry (US-013 AC4).
    await expect(page.locator(SELECTORS.nameInput)).toHaveValue(VALID_LEAD.name);
    await expect(page.locator(SELECTORS.emailInput)).toHaveValue(VALID_LEAD.email);
    await expect(page.locator(SELECTORS.phoneInput)).toHaveValue(VALID_LEAD.phone);
    await expect(page.locator(SELECTORS.consentCheckbox)).toBeChecked();
  });

  test('shows the Spanish message when submitted in Spanish', async ({ page }) => {
    await page.route('**/api/save-lead', (route) =>
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        headers: { 'Retry-After': '30' },
        body: JSON.stringify({
          success: false,
          message: 'Too many requests.',
          error_code: 'rate_limited',
          field_errors: null,
        }),
      }),
    );

    await gotoLang(page, 'es');
    await fillLeadForm(page);
    await page.locator(SELECTORS.submitButton).click();

    await expect(page.locator(SELECTORS.submissionError)).toContainText(
      esForm.rateLimited.split('{contact_email}')[0].trim(),
    );
    await expect(page.locator(SELECTORS.successContainer)).toBeHidden();
  });
});
