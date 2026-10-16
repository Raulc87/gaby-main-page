// US-020 (site shell) on the Home and the stub pages: header, navigation, mobile
// menu, language toggle across pages, footer, skip link and per-page metadata.
// The Home sections themselves are covered by this file in GK-021-home.
import { expect, test, type Page } from '@playwright/test';
import { common as en } from '../../src/i18n/en/common';
import { common as es } from '../../src/i18n/es/common';
import { LANGUAGES } from '../../src/i18n';
import { PAGE_IDS, routePath, type PageId } from '../../src/i18n/routes';

const dictionaries = { es, en };

test.describe('header and footer on every page', () => {
  for (const lang of LANGUAGES) {
    for (const id of PAGE_IDS) {
      test(`${id} in ${lang}: title, description, header, footer`, async ({ page }) => {
        const common = dictionaries[lang];
        await page.goto(routePath(id, lang));

        // AC7: its own title and meta description, in its language.
        await expect(page).toHaveTitle(common.meta[id].title);
        await expect(page.locator('meta[name="description"]')).toHaveAttribute(
          'content',
          common.meta[id].description,
        );
        await expect(page.locator('html')).toHaveAttribute('lang', lang);

        // AC2: brand, navigation, toggle and the outlined VIP link.
        const header = page.locator('header');
        await expect(header.getByRole('link', { name: common.nav.brand })).toHaveAttribute(
          'href',
          routePath('home', lang),
        );
        await expect(header.getByRole('link', { name: common.nav.story })).toHaveAttribute(
          'href',
          routePath('story', lang),
        );
        await expect(header.getByRole('link', { name: common.nav.method })).toHaveAttribute(
          'href',
          `${routePath('home', lang)}#metodo`,
        );
        await expect(header.getByRole('link', { name: common.nav.resources })).toHaveAttribute(
          'href',
          routePath('resources', lang),
        );
        await expect(header.locator('[data-nav="vip"]')).toHaveAttribute(
          'href',
          routePath('vip', lang),
        );
        await expect(page.locator('[data-language-toggle] a')).toHaveCount(2);

        // AC5: footer content and the privacy link; no Terms link.
        const footer = page.locator('footer');
        await expect(footer).toContainText(common.footer.concept);
        await expect(footer).toContainText(common.footer.disclaimer);
        await expect(footer).toContainText(common.footer.data_note);
        await expect(footer.getByRole('link', { name: common.footer.privacy_link })).toHaveAttribute(
          'href',
          routePath('privacy', lang),
        );
        await expect(footer.getByRole('link')).toHaveCount(2); // brand + privacy only

        // AC1: no blog or method page in phase 2a.
        await expect(page.locator('a[href*="/blog"], a[href*="metodo-polaris"], a[href*="polaris-method"]')).toHaveCount(0);
      });
    }
  }

  test('the current page is marked in the navigation', async ({ page }) => {
    await page.goto(routePath('story', 'es'));
    await expect(page.locator('header [aria-current="page"]')).toHaveText(es.nav.story);
    await page.goto(routePath('resources', 'en'));
    await expect(page.locator('header [aria-current="page"]')).toHaveText(en.nav.resources);
  });
});

test.describe('language toggle (AC4)', () => {
  for (const id of PAGE_IDS) {
    test(`${id}: switches to the same page in the other language and back`, async ({ page }) => {
      await page.goto(routePath(id, 'es'));
      await page.locator('[data-language-toggle] a[data-lang="en"]').click();
      await page.waitForURL(`**${routePath(id, 'en')}`);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await page.locator('[data-language-toggle] a[data-lang="es"]').click();
      await page.waitForURL(`**${routePath(id, 'es')}`);
      await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    });
  }

  test('keeps the section anchor and remembers the choice', async ({ page }) => {
    await page.goto(`${routePath('home', 'es')}#lead-form`);
    await page.locator('[data-language-toggle] a[data-lang="en"]').click();
    await page.waitForURL(`**${routePath('home', 'en')}#lead-form`);
    expect(await page.evaluate(() => localStorage.getItem('preferred_language'))).toBe('en');
  });

  test('the saved choice decides where "/" leads (AC6)', async ({ page }) => {
    await page.goto(routePath('home', 'en'));
    await page.locator('[data-language-toggle] a[data-lang="es"]').click();
    await page.waitForURL(`**${routePath('home', 'es')}`);
    await page.goto('/');
    await page.waitForURL(`**${routePath('home', 'es')}`);
  });
});

test.describe('skip link', () => {
  test('is the first focusable element and moves focus to the content', async ({ page }) => {
    await page.goto(routePath('home', 'en'));
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: en.skip_link });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });
});

test.describe('desktop navigation', () => {
  test('shows the navigation inline and no menu button at 1280 px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(routePath('home', 'es'));
    await expect(page.getByRole('navigation', { name: es.nav.label })).toBeVisible();
    await expect(page.locator('[data-menu-button]')).toBeHidden();
    await expect(page.locator('[data-nav="vip"]')).toBeVisible();
  });
});

test.describe('mobile menu (AC3)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  async function openMenu(page: Page) {
    await page.goto(routePath('story', 'es'));
    return page.locator('[data-menu-button]');
  }

  test('the VIP link and the menu button show; the navigation is collapsed', async ({ page }) => {
    const button = await openMenu(page);
    await expect(page.locator('[data-nav="vip"]')).toBeVisible();
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toHaveAccessibleName(es.nav.menu_open);
    await expect(page.getByRole('navigation', { name: es.nav.label })).toBeHidden();
    const box = await button.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test('opens with the button, moves focus into the panel, and locks the page scroll', async ({ page }) => {
    const button = await openMenu(page);
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(button).toHaveAccessibleName(es.nav.menu_close);
    await expect(page.getByRole('navigation', { name: es.nav.label })).toBeVisible();
    await expect(page.locator('[data-nav="story"]')).toBeFocused();
    await expect(page.locator('html')).toHaveClass(/overflow-hidden/);
    await expect(page.locator('[data-language-toggle]')).toBeVisible();
  });

  test('closes with Escape and returns focus to the button', async ({ page }) => {
    const button = await openMenu(page);
    await button.click();
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toBeFocused();
    await expect(page.getByRole('navigation', { name: es.nav.label })).toBeHidden();
    await expect(page.locator('html')).not.toHaveClass(/overflow-hidden/);
  });

  test('closes with the close button and works from the keyboard', async ({ page }) => {
    const button = await openMenu(page);
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toBeFocused();
  });

  test('following a same-page link closes the panel and returns focus to the button', async ({ page }) => {
    await page.goto(routePath('home', 'es'));
    const button = page.locator('[data-menu-button]');
    await button.click();
    await page.locator('[data-nav="method"]').click();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toBeFocused();
    await expect(page.locator('html')).not.toHaveClass(/overflow-hidden/);
  });

  test('the language toggle inside the panel switches to the same page', async ({ page }) => {
    const button = await openMenu(page);
    await button.click();
    await page.locator('[data-language-toggle] a[data-lang="en"]').click();
    await page.waitForURL(`**${routePath('story', 'en')}`);
  });

  test('has no horizontal scroll with the menu closed or open', async ({ page }) => {
    const button = await openMenu(page);
    const scrollWidth = () => page.evaluate(() => document.documentElement.scrollWidth);
    expect(await scrollWidth()).toBeLessThanOrEqual(390);
    await button.click();
    expect(await scrollWidth()).toBeLessThanOrEqual(390);
  });
});

test.describe('360 px', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test('the header fits: no horizontal scroll, VIP link and menu button visible', async ({ page }) => {
    await page.goto(routePath('home', 'es'));
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
    await expect(page.locator('[data-nav="vip"]')).toBeVisible();
    await expect(page.locator('[data-menu-button]')).toBeVisible();
  });
});

test('the page ids are exactly the phase 2a pages', () => {
  const ids: PageId[] = ['home', 'story', 'resources', 'vip', 'privacy'];
  expect([...PAGE_IDS]).toEqual(ids);
});
