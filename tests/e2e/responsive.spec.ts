// US-008 AC1 / IMPLEMENTATION_PLAN.md section 12: no horizontal scroll at a
// 390 px viewport, through the whole flow (landing, privacy notice dialog,
// filled form, thank-you + Calendly fallback). Runs under the mobile-390
// project (playwright.config.ts), which sets the 390 px viewport.
import { expect, test, type Page } from '@playwright/test';
import { fillLeadForm, gotoLang, SELECTORS } from './support/lead-form';

async function expectNoHorizontalScroll(page: Page): Promise<void> {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
}

test('no horizontal scroll through the whole flow at 390 px', async ({ page }) => {
  await gotoLang(page, 'es');
  await expectNoHorizontalScroll(page);

  await page.locator('#privacy-notice-trigger').click();
  await expect(page.locator('#privacy-notice-dialog')).toBeVisible();
  await expectNoHorizontalScroll(page);
  await page.locator('#privacy-notice-close').click();

  // Deterministic, network-free fallback (see calendly-fallback.spec.ts) so
  // this test only checks layout width, not Calendly's own rendering.
  await page.evaluate(() => {
    const container = document.getElementById('calendly-container');
    if (container) container.dataset.calendlyUrl = '';
  });

  await fillLeadForm(page);
  await expectNoHorizontalScroll(page);

  await page.locator(SELECTORS.submitButton).click();
  await expect(page.locator(SELECTORS.successContainer)).toBeVisible();
  await expect(page.locator(SELECTORS.calendlyFallback)).toBeVisible();
  await expectNoHorizontalScroll(page);
});
