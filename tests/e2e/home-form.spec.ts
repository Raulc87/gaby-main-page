// The phase 1 Home keeps its application form until GK-021-home moves it to the
// VIP page (SPRINT_003.md): the same form must keep working there. Delete this
// spec together with the Home's form in GK-021-home.
import { expect, test } from '@playwright/test';
import { getForm } from '../../src/lib/lead/dictionaries';
import { fillLeadForm, gotoHomeForm, SELECTORS } from './support/lead-form';

test('the Home form still validates and saves (qualified answer)', async ({ page }) => {
  const form = getForm('es');
  await gotoHomeForm(page, 'es');
  await page.evaluate(() => {
    const container = document.getElementById('calendly-container');
    if (container) container.dataset.calendlyUrl = '';
  });

  await page.locator(SELECTORS.submitButton).click();
  await expect(page.locator(SELECTORS.nameError)).toHaveText(form.fieldErrors.required);

  await fillLeadForm(page, { screeningCode: 'needs_investment_info' });
  await page.locator(SELECTORS.submitButton).click();
  await expect(page.getByRole('heading', { name: form.thankYou.title })).toBeVisible();
});

test('the Home form routes a not-ready answer to the not-ready screen', async ({ page }) => {
  const form = getForm('en');
  await gotoHomeForm(page, 'en');
  await fillLeadForm(page, { screeningCode: 'exploring' });
  await page.locator(SELECTORS.submitButton).click();
  await expect(page.getByRole('heading', { name: form.notReady.title })).toBeVisible();
});
