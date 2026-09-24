// Server-side outcomes forced via route interception (LEAD_API_CONTRACT.md
// section 7): a 422 the client couldn't have produced itself, and a 503
// that must never show success and must keep the entered data (NFR-006,
// BR-001), with a retry that then succeeds against the real backend.
import { expect, test } from '@playwright/test';
import { form as enForm } from '../../src/i18n/en/form';
import { form as esForm } from '../../src/i18n/es/form';
import { fillLeadForm, gotoLang, SELECTORS, VALID_LEAD } from './support/lead-form';

test('a server-side 422 is shown in the active language', async ({ page }) => {
  await page.route('**/api/save-lead', (route) =>
    route.fulfill({
      status: 422,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        message: 'Validation failed.',
        error_code: 'validation_error',
        field_errors: { name: 'too_short' },
      }),
    }),
  );

  await gotoLang(page, 'en');
  await fillLeadForm(page);
  await page.locator(SELECTORS.submitButton).click();

  await expect(page.locator(SELECTORS.nameError)).toHaveText(enForm.fieldErrors.too_short);
  await expect(page.locator(SELECTORS.successContainer)).toBeHidden();
  await expect(page.locator(SELECTORS.formContainer)).toBeVisible();
});

test('a 503 shows no success, keeps the entered data, and a retry succeeds', async ({ page }) => {
  let failNextRequest = true;
  await page.route('**/api/save-lead', (route) => {
    if (failNextRequest) {
      failNextRequest = false;
      return route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Failed to save lead.',
          error_code: 'storage_unavailable',
          field_errors: null,
        }),
      });
    }
    return route.continue();
  });

  await gotoLang(page, 'es');
  await fillLeadForm(page);
  await page.locator(SELECTORS.submitButton).click();

  await expect(page.locator(SELECTORS.submissionError)).toBeVisible();
  await expect(page.locator(SELECTORS.submissionError)).toContainText(
    esForm.submissionError.split('{contact_email}')[0].trim(),
  );
  await expect(page.locator(SELECTORS.formContainer)).toBeVisible();
  await expect(page.locator(SELECTORS.successContainer)).toBeHidden();
  await expect(page.locator(SELECTORS.calendlyWidget)).toBeHidden();

  // Data kept for retry (NFR-006 / BR-001).
  await expect(page.locator(SELECTORS.nameInput)).toHaveValue(VALID_LEAD.name);
  await expect(page.locator(SELECTORS.emailInput)).toHaveValue(VALID_LEAD.email);
  await expect(page.locator(SELECTORS.phoneInput)).toHaveValue(VALID_LEAD.phone);
  await expect(page.locator(SELECTORS.consentCheckbox)).toBeChecked();

  await page.locator(SELECTORS.submitButton).click();

  await expect(page.locator(SELECTORS.successContainer)).toBeVisible();
  await expect(page.locator(SELECTORS.formContainer)).toBeHidden();
});
