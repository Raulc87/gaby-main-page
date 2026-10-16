// US-023 AC1, AC2: the VIP page shows the steps, the video placeholder module
// (which loads nothing) and the application form; the form submit is the page's
// only gold button; the `#aplicar` anchor reaches the form.
import { expect, test } from '@playwright/test';
import { getCommon } from '../../src/i18n';
import { getForm, getVip } from '../../src/lib/lead/dictionaries';
import { fillLeadForm, gotoVip, SELECTORS } from './support/lead-form';

const SOFT_GOLD_RGB = 'rgb(214, 176, 77)';

for (const lang of ['es', 'en'] as const) {
  test(`VIP page content (${lang})`, async ({ page }) => {
    const vip = getVip(lang);
    const form = getForm(lang);
    await gotoVip(page, lang);

    await expect(page.getByRole('heading', { level: 1 })).toContainText(vip.title.replaceAll('*', ''));
    await expect(page.getByText(getCommon(lang).vip_band.body)).toBeVisible();
    const steps = page.getByTestId('vip-steps').locator('li');
    await expect(steps).toHaveCount(3);
    for (const [index, step] of vip.steps.entries()) await expect(steps.nth(index)).toContainText(step);

    await expect(page.getByTestId('vip-video')).toContainText(vip.video.placeholder);
    await expect(page.getByRole('heading', { name: form.formTitle })).toBeVisible();
    await expect(page.locator(SELECTORS.submitButton)).toContainText(form.submit.idle);
    await expect(page.getByText(form.trust)).toBeVisible();
  });
}

test('the video module loads no third-party resource and the page has one gold button', async ({ page }) => {
  const thirdParty: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (!['127.0.0.1', 'fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname)) {
      thirdParty.push(request.url());
    }
  });
  await gotoVip(page, 'es');
  await page.waitForLoadState('networkidle');
  expect(thirdParty).toEqual([]);
  expect(await page.locator('iframe').count()).toBe(0);

  const goldButtons = await page.$$eval(
    'a, button',
    (nodes, gold) => nodes.filter((node) => getComputedStyle(node).backgroundColor === gold).length,
    SOFT_GOLD_RGB,
  );
  expect(goldButtons).toBe(1);
});

test('the #aplicar anchor leads to the form in both languages', async ({ page }) => {
  for (const lang of ['es', 'en'] as const) {
    await gotoVip(page, lang, '#aplicar');
    await expect(page.locator('#aplicar')).toBeAttached();
    await expect(page.locator('#aplicar').locator(SELECTORS.leadForm)).toBeAttached();
  }
});

test('the screening options are at least 44 px high', async ({ page }) => {
  await gotoVip(page, 'es');
  const heights = await page.$$eval('#lead-screening label', (labels) =>
    labels.map((label) => label.getBoundingClientRect().height),
  );
  expect(heights).toHaveLength(4);
  for (const height of heights) expect(height).toBeGreaterThanOrEqual(44);
});

test('while submitting, the submit looks disabled: 50% opacity (UX_UI_DIRECTION.md section 2.4)', async ({ page }) => {
  await page.route('**/api/save-lead', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.continue();
  });
  await gotoVip(page, 'es');
  await fillLeadForm(page);
  await page.locator(SELECTORS.submitButton).click();

  const button = page.locator(SELECTORS.submitButton);
  await expect(button).toBeDisabled();
  // The button transitions its opacity, so wait for the computed value to settle.
  await expect(button).toHaveCSS('opacity', '0.5');
  await expect(button).toHaveCSS('pointer-events', 'none');
});
