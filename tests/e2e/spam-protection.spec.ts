// US-013 client-side spam protection (LEAD_API_CONTRACT.md v1.1 sections 3.1
// and 3.2; UX_UI_DIRECTION.md v0.8 section 4, Section 7). Four independent
// things:
//
// 1. The honeypot field `website` (AC1): verified in Chromium at desktop and
//    390 px — not a descendant of #lead-form-form, not visible, not
//    reachable with Tab, empty after load and after filling the visible
//    fields (including a simulated autofill of the whole lead form), and
//    its own form's submit is always prevented. This spec runs under the
//    `desktop-chromium` Playwright project by default; the 390 px checks
//    below use `test.use({ viewport })` to get that width without touching
//    playwright.config.ts (owned by Agent 1).
// 2. The honeypot's value still reaches the server as `website` on the
//    outgoing request, and autofill keeps working for the visible fields
//    (AC1) — both reopened after browser autofill filled the old
//    in-lead-form honeypot on 2026-09-30 and silently dropped a real lead.
// 3. The honeypot decoy against the real backend (AC2): a filled `website`
//    still returns 201 and looks identical to a real submission from the
//    visitor's side.
// 4. `429` / `rate_limited` (AC3/AC4), forced via route mocking (deliberately
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

  // Lives in its own <form>, entirely outside #lead-form-form (US-013 AC1):
  // browser autofill fills one form at a time, so filling the lead form
  // never reaches it.
  await expect(page.locator(SELECTORS.leadForm).locator(SELECTORS.honeypotInput)).toHaveCount(0);
  await expect(page.locator(SELECTORS.honeypotForm).locator(SELECTORS.honeypotInput)).toHaveCount(1);
  await expect(page.locator(SELECTORS.honeypotForm)).toHaveAttribute('aria-hidden', 'true');

  // Off-screen, not `display: none`: still in the layout, but its box sits
  // fully outside the viewport's left edge.
  const box = await honeypot.boundingBox();
  expect(box).not.toBeNull();
  if (box) {
    expect(box.x + box.width).toBeLessThanOrEqual(0);
  }

  await expect(honeypot).toHaveAttribute('type', 'text');
  // `id`/`name` avoid autofill-recognized words (website, url, company,
  // name, email, phone, tel, address, city) — the old `website` name was
  // exactly what let autofill find and fill it.
  await expect(honeypot).toHaveAttribute('id', 'lead-hp');
  await expect(honeypot).toHaveAttribute('name', 'hp_field');
  await expect(honeypot).toHaveAttribute('tabindex', '-1');
  await expect(honeypot).toHaveAttribute('autocomplete', 'off');
  // Password-manager opt-outs.
  await expect(honeypot).toHaveAttribute('data-1p-ignore');
  await expect(honeypot).toHaveAttribute('data-lpignore', 'true');
  await expect(honeypot).toHaveAttribute('data-bwignore', 'true');
  await expect(honeypot).toHaveAttribute('data-form-type', 'other');

  // No visible label, placeholder, or title.
  const labelCount = await page.locator(`label[for="${await honeypot.getAttribute('id')}"]`).count();
  expect(labelCount).toBe(0);
  expect(await honeypot.getAttribute('placeholder')).toBeNull();
  expect(await honeypot.getAttribute('title')).toBeNull();
}

/**
 * The honeypot's `<form>` has no submit button, but pressing Enter inside
 * its input still fires a `submit` event; leadFormController.ts must always
 * prevent it so that can never reload the page.
 */
async function expectHoneypotFormSubmitIsPrevented(page: Page): Promise<void> {
  const prevented = await page.evaluate((formSelector) => {
    const form = document.querySelector(formSelector);
    if (!form) return null;
    const event = new Event('submit', { cancelable: true, bubbles: true });
    form.dispatchEvent(event);
    return event.defaultPrevented;
  }, SELECTORS.honeypotForm);
  expect(prevented).toBe(true);
}

async function expectHoneypotUnreachableByTab(page: Page): Promise<void> {
  await page.locator(SELECTORS.nameInput).focus();
  await page.keyboard.press('Shift+Tab');
  const shiftTabTargetId = await page.evaluate(() => document.activeElement?.id ?? '');
  expect(shiftTabTargetId).not.toBe('lead-hp');

  await page.locator(SELECTORS.nameInput).focus();
  const forwardFocusedIds: string[] = [];
  for (let i = 0; i < 8; i += 1) {
    await page.keyboard.press('Tab');
    forwardFocusedIds.push(await page.evaluate(() => document.activeElement?.id ?? ''));
  }
  expect(forwardFocusedIds).not.toContain('lead-hp');
}

async function expectHoneypotEmpty(page: Page): Promise<void> {
  await expect(page.locator(SELECTORS.honeypotInput)).toHaveValue('');
  await fillLeadForm(page);
  await expect(page.locator(SELECTORS.honeypotInput)).toHaveValue('');
}

/**
 * Mimics a browser/password-manager autofill pass over the lead form: sets a
 * value (or checked state) on every input it contains and fires the events
 * autofill dispatches, without ever touching anything outside that form.
 * This is exactly the scenario that dropped a real lead on 2026-09-30, back
 * when the honeypot lived inside #lead-form-form.
 */
async function simulateAutofillInsideLeadForm(page: Page): Promise<void> {
  await page.evaluate((formSelector) => {
    const form = document.querySelector(formSelector);
    if (!form) return;
    form.querySelectorAll('input').forEach((el) => {
      const input = el as HTMLInputElement;
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = true;
      } else {
        input.value = 'AUTOFILLED';
      }
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }, SELECTORS.leadForm);
}

for (const [description, viewportOptions] of [
  ['desktop', undefined],
  ['at 390 px', { viewport: { width: 390, height: 844 } }],
] as const) {
  test.describe(`honeypot field (${description})`, () => {
    if (viewportOptions) test.use(viewportOptions);

    test('is off-screen, outside the lead form, unlabeled, and carries the required mitigations', async ({
      page,
    }) => {
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

    test("a simulated autofill of every field inside the lead form leaves it untouched (US-013 AC1, regression)", async ({
      page,
    }) => {
      await gotoLang(page, 'es');
      await simulateAutofillInsideLeadForm(page);
      await expect(page.locator(SELECTORS.honeypotInput)).toHaveValue('');
    });

    test("its own form's submit is always prevented", async ({ page }) => {
      await gotoLang(page, 'es');
      await expectHoneypotFormSubmitIsPrevented(page);
    });
  });
}

test.describe('autofill keeps working for the visible fields (US-013 AC1)', () => {
  test('name, email and phone keep their autocomplete hints', async ({ page }) => {
    await gotoLang(page, 'es');

    await expect(page.locator(SELECTORS.nameInput)).toHaveAttribute('autocomplete', 'name');
    await expect(page.locator(SELECTORS.emailInput)).toHaveAttribute('autocomplete', 'email');
    await expect(page.locator(SELECTORS.phoneInput)).toHaveAttribute('autocomplete', 'tel');
  });
});

test.describe('the honeypot value reaches the server as `website` (US-013 AC1, real backend)', () => {
  test('filling the honeypot directly puts that value on the outgoing request body', async ({ page }) => {
    await gotoLang(page, 'es');
    await fillLeadForm(page);
    await page.locator(SELECTORS.honeypotInput).fill('http://bot.example');

    const [request] = await Promise.all([
      page.waitForRequest((req) => req.url().includes('/api/save-lead') && req.method() === 'POST'),
      page.locator(SELECTORS.submitButton).click(),
    ]);

    const body = request.postDataJSON() as { website?: string };
    expect(body.website).toBe('http://bot.example');
  });

  test('a real visitor (honeypot left empty) sends an empty `website`', async ({ page }) => {
    await gotoLang(page, 'es');
    await fillLeadForm(page);

    const [request] = await Promise.all([
      page.waitForRequest((req) => req.url().includes('/api/save-lead') && req.method() === 'POST'),
      page.locator(SELECTORS.submitButton).click(),
    ]);

    const body = request.postDataJSON() as { website?: string };
    expect(body.website).toBe('');
  });
});

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
