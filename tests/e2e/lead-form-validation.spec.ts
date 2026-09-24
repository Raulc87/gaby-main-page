// Client-side validation (LEAD_API_CONTRACT.md section 3/8, US-004,
// US-011): errors render in the active language, and consent blocks
// submission. Asserts against the real ES/EN dictionaries so the test
// tracks the app's copy instead of duplicating it.
import { expect, test } from '@playwright/test';
import { form as enForm } from '../../src/i18n/en/form';
import { form as esForm } from '../../src/i18n/es/form';
import { fillLeadForm, gotoLang, SELECTORS } from './support/lead-form';

const LANGUAGES = [
  { lang: 'es' as const, dict: esForm },
  { lang: 'en' as const, dict: enForm },
];

for (const { lang, dict } of LANGUAGES) {
  test(`shows field errors in ${lang} for invalid input`, async ({ page }) => {
    await gotoLang(page, lang);

    await page.locator(SELECTORS.nameInput).fill('A');
    await page.locator(SELECTORS.emailInput).fill('not-an-email');
    await page.locator(SELECTORS.phoneInput).fill('123');
    // screening left unselected, consent left unchecked.
    await page.locator(SELECTORS.submitButton).click();

    await expect(page.locator(SELECTORS.nameError)).toHaveText(dict.fieldErrors.too_short);
    await expect(page.locator(SELECTORS.emailError)).toHaveText(dict.fieldErrors.invalid_format_email);
    await expect(page.locator(SELECTORS.phoneError)).toHaveText(dict.fieldErrors.invalid_format_phone);
    await expect(page.locator(SELECTORS.screeningError)).toHaveText(dict.fieldErrors.required);
    await expect(page.locator(SELECTORS.consentError)).toHaveText(dict.fieldErrors.consent_required);
    await expect(page.locator(SELECTORS.successContainer)).toBeHidden();
  });
}

test('a full name with only one word is rejected (full_name_required)', async ({ page }) => {
  await gotoLang(page, 'es');
  await page.locator(SELECTORS.nameInput).fill('Ana');
  await page.locator(SELECTORS.submitButton).click();

  await expect(page.locator(SELECTORS.nameError)).toHaveText(esForm.fieldErrors.full_name_required);
});

test('an unchecked consent checkbox blocks submission and sends no request', async ({ page }) => {
  const leadRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/save-lead')) leadRequests.push(request.url());
  });

  await gotoLang(page, 'en');
  await fillLeadForm(page, { consent: false });
  await page.locator(SELECTORS.submitButton).click();

  await expect(page.locator(SELECTORS.consentError)).toHaveText(enForm.fieldErrors.consent_required);
  await expect(page.locator(SELECTORS.successContainer)).toBeHidden();
  await expect(page.locator(SELECTORS.formContainer)).toBeVisible();
  expect(leadRequests).toHaveLength(0);
});
