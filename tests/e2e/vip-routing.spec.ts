// US-023 AC4, AC5, AC6: the screening answer decides the screen after a 201.
// Qualified answers (ready_to_invest, needs_investment_info) get the thank-you and
// the scheduler; the others (no_capacity_now, exploring) get the not-ready screen
// with the mini-course card and never load Calendly. One of each, in both languages,
// against the real backend (LEADS_STORAGE=memory).
import { expect, test } from '@playwright/test';
import { getCommon } from '../../src/i18n';
import { getForm } from '../../src/lib/lead/dictionaries';
import { fillLeadForm, gotoVip, SELECTORS } from './support/lead-form';

for (const lang of ['es', 'en'] as const) {
  const form = getForm(lang);
  const common = getCommon(lang);

  test(`qualified answer (${lang}): thank-you and the scheduler fallback, no not-ready screen`, async ({ page }) => {
    await gotoVip(page, lang);
    // Deterministic, network-free scheduler outcome (see calendly-fallback.spec.ts).
    await page.evaluate(() => {
      const container = document.getElementById('calendly-container');
      if (container) container.dataset.calendlyUrl = '';
    });

    await fillLeadForm(page, { screeningCode: 'ready_to_invest' });
    await page.locator(SELECTORS.submitButton).click();

    await expect(page.locator(SELECTORS.formContainer)).toBeHidden();
    await expect(page.getByRole('heading', { name: form.thankYou.title })).toBeVisible();
    await expect(page.getByRole('heading', { name: form.thankYou.title })).toBeFocused();
    await expect(page.locator(SELECTORS.calendlyFallback)).toBeVisible();
    await expect(page.locator('#lead-not-ready-container')).toBeHidden();
  });

  test(`not-ready answer (${lang}): not-ready screen with the mini-course card, no Calendly`, async ({ page }) => {
    const calendlyRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('calendly.com')) calendlyRequests.push(request.url());
    });
    await gotoVip(page, lang);

    await fillLeadForm(page, { screeningCode: 'no_capacity_now' });
    await page.locator(SELECTORS.submitButton).click();

    const title = page.getByRole('heading', { name: form.notReady.title });
    await expect(page.locator(SELECTORS.formContainer)).toBeHidden();
    await expect(title).toBeVisible();
    await expect(title).toBeFocused();
    await expect(page.locator(SELECTORS.successContainer)).toBeHidden();

    // The mini-course card in its current state: pending (no file yet), no link to a file.
    const card = page.locator('#lead-not-ready-container [data-resource-id="minicourse-debt"]');
    await expect(card).toBeVisible();
    await expect(card).not.toContainText('{');
    await expect(card.locator('a')).toHaveCount(0);

    // The blue link to the library; no gold button on this screen.
    await expect(
      page.locator('#lead-not-ready-container').getByRole('link', { name: common.cta.all_resources }),
    ).toBeVisible();
    expect(calendlyRequests).toEqual([]);
    expect(await page.locator('script[src*="calendly.com"]').count()).toBe(0);
  });

  test(`exploring answer (${lang}) also gets the not-ready screen`, async ({ page }) => {
    await gotoVip(page, lang);
    await fillLeadForm(page, { screeningCode: 'exploring' });
    await page.locator(SELECTORS.submitButton).click();
    await expect(page.getByRole('heading', { name: form.notReady.title })).toBeVisible();
  });
}
