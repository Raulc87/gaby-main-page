// US-013 client-side spam protection (LEAD_API_CONTRACT.md v1.1 sections 3.1
// and 3.2; UX_UI_DIRECTION.md section 4, Section 7). Two independent things:
//
// 1. The honeypot field `website` (AC1): verified in Chromium at desktop and
//    390 px — not visible, not reachable with Tab, empty after load and
//    after filling the visible fields. This spec runs under the
//    `desktop-chromium` Playwright project by default; the 390 px checks
//    below use `test.use({ viewport })` to get that width without touching
//    playwright.config.ts (owned by Agent 1).
// 2. `429` / `rate_limited` (AC3/AC4), forced via route mocking (the real
//    backend's rate limiter is Agent 3's GK-013-spam-protection, not yet
//    merged): the localized "too many attempts" message is shown, the
//    entered data stays, and neither success nor Calendly appear.
//
// Once GK-013-spam-protection (server) is merged, a further e2e test fills
// the honeypot against the real backend in memory mode and checks that the
// success path shows while nothing is stored (per SPRINT_002.md).
import { expect, test } from '@playwright/test';
import { form as enForm } from '../../src/i18n/en/form';
import { form as esForm } from '../../src/i18n/es/form';
import { fillLeadForm, gotoLang, SELECTORS, VALID_LEAD } from './support/lead-form';

async function expectHoneypotOffScreen(page: import('@playwright/test').Page): Promise<void> {
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

test.describe('honeypot field (desktop)', () => {
  test('is off-screen, unlabeled, and carries the required mitigations', async ({ page }) => {
    await gotoLang(page, 'es');
    await expectHoneypotOffScreen(page);
  });

  test('is empty after load and stays empty after filling the visible fields', async ({ page }) => {
    await gotoLang(page, 'es');
    await expect(page.locator(SELECTORS.honeypotInput)).toHaveValue('');

    await fillLeadForm(page);
    await expect(page.locator(SELECTORS.honeypotInput)).toHaveValue('');
  });

  test('is skipped by Tab navigation', async ({ page }) => {
    await gotoLang(page, 'es');
    await page.locator(SELECTORS.nameInput).focus();

    const focusedIds: string[] = [];
    for (let i = 0; i < 8; i += 1) {
      await page.keyboard.press('Tab');
      focusedIds.push(await page.evaluate(() => document.activeElement?.id ?? ''));
    }

    expect(focusedIds).not.toContain('lead-website');
  });
});

test.describe('honeypot field at 390 px', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('is off-screen at 390 px', async ({ page }) => {
    await gotoLang(page, 'es');
    await expectHoneypotOffScreen(page);
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
