// US-023 AC4, AC5, AC6: the screening answer decides the screen after a 201.
// Qualified answers (ready_to_invest, needs_investment_info) get the thank-you and
// the scheduler; the others (no_capacity_now, exploring) get the not-ready screen
// with a blue button to the calculator (no mini-course card, the library is withdrawn)
// and never load the calendar. One of each, in both languages,
// against the real backend (LEADS_STORAGE=memory).
import { expect, test } from '@playwright/test';
import { getHome } from '../../src/i18n';
import { routePath } from '../../src/i18n/routes';
import { getForm } from '../../src/lib/lead/dictionaries';
import { fillLeadForm, gotoVip, SELECTORS } from './support/lead-form';

for (const lang of ['es', 'en'] as const) {
  const form = getForm(lang);

  test(`qualified answer (${lang}): thank-you and the scheduler fallback, no not-ready screen`, async ({ page }) => {
    await gotoVip(page, lang);
    // Deterministic, network-free scheduler outcome (see scheduler-fallback.spec.ts).
    await page.evaluate(() => {
      const container = document.getElementById('scheduler-container');
      if (container) container.dataset.schedulerUrl = '';
    });

    await fillLeadForm(page, { screeningCode: 'ready_to_invest' });
    await page.locator(SELECTORS.submitButton).click();

    await expect(page.locator(SELECTORS.formContainer)).toBeHidden();
    await expect(page.getByRole('heading', { name: form.thankYou.title })).toBeVisible();
    await expect(page.getByRole('heading', { name: form.thankYou.title })).toBeFocused();
    await expect(page.locator(SELECTORS.schedulerFallback)).toBeVisible();
    await expect(page.locator('#lead-not-ready-container')).toBeHidden();
  });

  test(`not-ready answer (${lang}): not-ready screen with a link to the calculator, no calendar, no gold button`, async ({ page }) => {
    const schedulerRequests: string[] = [];
    page.on('request', (request) => {
      if (/leadconnectorhq|msgsndr/.test(request.url())) schedulerRequests.push(request.url());
    });
    await gotoVip(page, lang);

    await fillLeadForm(page, { screeningCode: 'no_capacity_now' });
    await page.locator(SELECTORS.submitButton).click();

    const title = page.getByRole('heading', { name: form.notReady.title });
    await expect(page.locator(SELECTORS.formContainer)).toBeHidden();
    await expect(title).toBeVisible();
    await expect(title).toBeFocused();
    await expect(page.locator(SELECTORS.successContainer)).toBeHidden();

    // The library is withdrawn (US-046): no mini-course card; a blue button leads to the calculator,
    // and there is no gold button on this screen.
    const notReady = page.locator('#lead-not-ready-container');
    await expect(notReady.locator('[data-resource-id]')).toHaveCount(0);
    const more = notReady.getByRole('link', { name: getHome(lang).home.hero.secondary });
    await expect(more).toBeVisible();
    await expect(more).toHaveAttribute('href', routePath('calculator', lang));
    await expect(notReady.locator('a[href*="recursos"], a[href*="resources"]')).toHaveCount(0);
    // Gold is #D6B04D (rgb(214, 176, 77)): none of the not-ready screen's buttons or links may use it.
    const gold = await notReady.evaluate((root) =>
      [...root.querySelectorAll<HTMLElement>('a, button')].filter(
        (el) => getComputedStyle(el).backgroundColor === 'rgb(214, 176, 77)',
      ).length,
    );
    expect(gold).toBe(0);
    expect(schedulerRequests).toEqual([]);
    expect(await page.locator('script[src*="msgsndr"], iframe').count()).toBe(0);
  });

  test(`exploring answer (${lang}) also gets the not-ready screen`, async ({ page }) => {
    await gotoVip(page, lang);
    await fillLeadForm(page, { screeningCode: 'exploring' });
    await page.locator(SELECTORS.submitButton).click();
    await expect(page.getByRole('heading', { name: form.notReady.title })).toBeVisible();
  });
}
