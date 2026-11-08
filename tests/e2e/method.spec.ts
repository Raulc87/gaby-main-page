// US-028: the Método Polaris page (UX_UI_DIRECTION.md section 5.7, CONTENT.md section 12).
// Placeholder version: the three provisional steps, the placeholder block for the
// official steps (badge in every build) and the VIP band at the end.
import { expect, test } from '@playwright/test';
import { LANGUAGES } from '../../src/i18n';
import { common as en } from '../../src/i18n/en/common';
import { common as es } from '../../src/i18n/es/common';
import { home as homeEn } from '../../src/i18n/en/home';
import { home as homeEs } from '../../src/i18n/es/home';
import { method as methodEn } from '../../src/i18n/en/method';
import { method as methodEs } from '../../src/i18n/es/method';
import { routePath } from '../../src/i18n/routes';

const copy = {
  es: { common: es, home: homeEs.home, method: methodEs.method },
  en: { common: en, home: homeEn.home, method: methodEn.method },
} as const;

for (const lang of LANGUAGES) {
  const { common, home, method } = copy[lang];

  test.describe(`Método Polaris page (${lang})`, () => {
    test('the header link leads to the page, which is marked as the current page', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(routePath('home', lang));
      await page.locator('header [data-nav="method"]').click();
      await page.waitForURL(`**${routePath('method', lang)}`);
      await expect(page.locator('header [data-nav="method"]')).toHaveAttribute('aria-current', 'page');
    });

    test('the header link leads to the page from the mobile menu', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(routePath('home', lang));
      await page.locator('[data-menu-button]').click();
      await page.locator('[data-nav="method"]').click();
      await page.waitForURL(`**${routePath('method', lang)}`);
    });

    test('title, description and the page copy', async ({ page }) => {
      await page.goto(routePath('method', lang));
      await expect(page).toHaveTitle(common.meta.method.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        common.meta.method.description,
      );
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveText(home.method.title.replace(/\*/g, ''));
      await expect(page.locator('main')).toContainText(home.method.eyebrow);
      await expect(page.locator('main')).toContainText(method.lead);
      expect(await page.locator('main').innerText()).not.toContain('*');
    });

    test('shows the three provisional steps and the placeholder block with its badge', async ({ page }) => {
      await page.goto(routePath('method', lang));
      const steps = page.locator('[data-method-step]');
      await expect(steps).toHaveCount(3);
      for (const [index, n] of (['1', '2', '3'] as const).entries()) {
        await expect(steps.nth(index)).toContainText(home.method[n].title);
        await expect(steps.nth(index)).toContainText(home.method[n].body);
      }
      // The step titles look as on the Home: Manrope 700, not the Playfair of h1-h2 (section 2.3).
      for (const title of await steps.locator('h2').all()) {
        const style = await title.evaluate((el) => {
          const { fontFamily, fontWeight } = getComputedStyle(el);
          return { fontFamily, fontWeight };
        });
        expect(style.fontFamily).toContain('Manrope');
        expect(style.fontWeight).toBe('700');
      }
      const placeholder = page.locator('[data-method-placeholder]');
      await expect(placeholder).toContainText(method.steps.placeholder);
      // The placeholder's badge shows in every build; the provisional steps' badges only in
      // preview and development builds (CONTENT.md -> Pending badge).
      await expect(placeholder.getByText(common.pending.badge)).toHaveCount(1);
      await expect(steps.getByText(common.pending.badge)).toHaveCount(0);
    });

    test('ends with the VIP band and its one gold button to the VIP page', async ({ page }) => {
      await page.goto(routePath('method', lang));
      const apply = page.getByRole('main').getByRole('link', { name: common.cta.vip_apply });
      await expect(apply).toHaveCount(1);
      await expect(apply).toHaveAttribute('href', routePath('vip', lang));
      expect(await apply.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(214, 176, 77)');
      const lastSection = page.locator('main > section').last();
      await expect(lastSection).toContainText(common.vip_band.eyebrow);
    });

    test('the language toggle leads to the same page in the other language', async ({ page }) => {
      const other = lang === 'es' ? 'en' : 'es';
      await page.goto(routePath('method', lang));
      await page.locator(`[data-language-toggle] a[data-lang="${other}"]`).click();
      await page.waitForURL(`**${routePath('method', other)}`);
    });

    for (const width of [360, 390, 768, 1280]) {
      test(`has no horizontal scroll at ${width} px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(routePath('method', lang));
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      });
    }
  });
}
