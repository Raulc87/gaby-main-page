// US-024 AC1, AC2, AC4, AC5, AC6: the library page, in both languages: header, the
// featured mini-course, topic filters that work without reloading and with the keyboard,
// the card grid (every card pending: no file has been delivered), the short VIP band at
// the end, and every resource shown (filters hidden) without JavaScript.
import { expect, test } from '@playwright/test';
import { getCommon, type Language } from '../../src/i18n';
import { routePath } from '../../src/i18n/routes';
import { RESOURCES, RESOURCE_TOPICS } from '../../src/data/resources';
import { getResources } from '../../src/lib/lead/dictionaries';

const SOFT_GOLD_RGB = 'rgb(214, 176, 77)';
const cardsOf = (page: import('@playwright/test').Page) => page.locator('[data-resource-grid] > article');

for (const lang of ['es', 'en'] as Language[]) {
  const t = getResources(lang);
  const common = getCommon(lang);

  test(`library (${lang}): header, featured mini-course and the whole list`, async ({ page }) => {
    await page.goto(routePath('resources', lang));

    await expect(page.getByRole('heading', { level: 1 })).toContainText(t.resources.title.replaceAll('*', ''));
    await expect(page.getByText(t.resources.eyebrow, { exact: true })).toBeVisible();
    await expect(page.getByText(t.resources.lead)).toBeVisible();

    const featured = page.locator('[data-featured] article');
    await expect(featured).toContainText(t.resources.featured.label);
    await expect(featured.getByRole('heading', { level: 2 })).toHaveText(
      RESOURCES.find((resource) => resource.id === 'minicourse-debt')!.title[lang],
    );

    await expect(cardsOf(page)).toHaveCount(RESOURCES.length);
    for (const resource of RESOURCES) {
      await expect(page.locator(`[data-resource-grid] [data-resource-id="${resource.id}"] h3`)).toHaveText(
        resource.title[lang],
      );
    }
  });

  test(`library (${lang}): every card is pending, with no link, and the page ends with the short VIP band`, async ({ page }) => {
    await page.goto(routePath('resources', lang));

    // No file has been delivered (US-024 AC4, BR-011): email-delivered resources say
    // `resource.email.coming_soon`, downloads say `resource.pending`; never a link,
    // always a pending badge.
    for (const resource of RESOURCES) {
      for (const card of await page.locator(`[data-resource-library] [data-resource-id="${resource.id}"]`).all()) {
        if (resource.access === 'email') {
          await expect(card).toContainText(t.resource.email.coming_soon);
          await expect(card).not.toContainText(t.resource.pending);
        } else {
          await expect(card).toContainText(t.resource.pending);
          await expect(card).not.toContainText(t.resource.email.coming_soon);
        }
        await expect(card.locator('a')).toHaveCount(0);
        await expect(card).toContainText(common.pending.badge);
      }
    }

    const band = page.locator('[data-resource-library] > section').last();
    await expect(band).toContainText(common.vip_band.short_title.replaceAll('*', ''));
    await expect(band.getByRole('link', { name: common.cta.vip_apply })).toHaveAttribute(
      'href',
      new RegExp(`${routePath('vip', lang)}$`),
    );

    // One gold button on the page: the band's.
    const gold = await page.$$eval(
      'a, button',
      (nodes, color) => nodes.filter((node) => getComputedStyle(node).backgroundColor === color).length,
      SOFT_GOLD_RGB,
    );
    expect(gold).toBe(1);
  });

  test(`library (${lang}): filters work without reloading and by keyboard`, async ({ page }) => {
    await page.goto(routePath('resources', lang));
    await page.evaluate(() => {
      (window as unknown as { marker: string }).marker = 'same-page';
    });

    const group = page.getByRole('group', { name: t.resources.filter.label });
    await expect(group).toBeVisible();
    const buttons = group.getByRole('button');
    await expect(buttons).toHaveCount(1 + RESOURCE_TOPICS.length);
    await expect(group.getByRole('button', { name: t.resources.filter.all, exact: true })).toHaveAttribute('aria-pressed', 'true');

    for (const topic of RESOURCE_TOPICS) {
      const button = group.getByRole('button', { name: t.resources.topic[topic], exact: true });
      await button.focus();
      await page.keyboard.press('Enter');

      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(group.getByRole('button', { name: t.resources.filter.all, exact: true })).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      const expected = RESOURCES.filter((resource) => resource.topic === topic);
      await expect(cardsOf(page).locator(':scope:visible')).toHaveCount(expected.length);
      for (const resource of expected) {
        await expect(page.locator(`[data-resource-grid] [data-resource-id="${resource.id}"]`)).toBeVisible();
      }
    }

    await group.getByRole('button', { name: t.resources.filter.all, exact: true }).click();
    await expect(cardsOf(page).locator(':scope:visible')).toHaveCount(RESOURCES.length);
    expect(await page.evaluate(() => (window as unknown as { marker: string }).marker)).toBe('same-page');
  });
}

test('without JavaScript every resource is shown and the filters are hidden', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(routePath('resources', 'es'));

  await expect(page.locator('[data-filter-group]')).toBeHidden();
  await expect(cardsOf(page)).toHaveCount(RESOURCES.length);
  await expect(cardsOf(page).locator(':scope:visible')).toHaveCount(RESOURCES.length);
  await context.close();
});

test('the grid has 3 columns at 1280 px, 2 at 768 px and 1 at 390 px, with no horizontal scroll at 360 px', async ({ page }) => {
  const columns = async (width: number): Promise<number> => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(routePath('resources', 'en'));
    return page.locator('[data-resource-grid]').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length);
  };
  expect(await columns(1280)).toBe(3);
  expect(await columns(768)).toBe(2);
  expect(await columns(390)).toBe(1);

  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(routePath('resources', 'es'));
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});
