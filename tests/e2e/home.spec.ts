// US-020 (site shell) on the Home and the stub pages: header, navigation, mobile
// menu, language toggle across pages, footer, skip link and per-page metadata.
// The Home sections (US-021) are covered further down.
import { expect, test, type Page } from '@playwright/test';
import { common as en } from '../../src/i18n/en/common';
import { common as es } from '../../src/i18n/es/common';
import { RESOURCES } from '../../src/data/resources';
import { LANGUAGES } from '../../src/i18n';
import { home as homeEn } from '../../src/i18n/en/home';
import { home as homeEs } from '../../src/i18n/es/home';
import { story as storyEn } from '../../src/i18n/en/story';
import { story as storyEs } from '../../src/i18n/es/story';
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
        for (const link of await footer.getByRole('link').all()) {
          expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
        }

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

  test('a Ctrl-click that keeps the page open does not pile the anchor up on the next click', async ({ page }) => {
    await page.goto(`${routePath('home', 'es')}#lead-form`);
    const toEnglish = page.locator('[data-language-toggle] a[data-lang="en"]');
    await toEnglish.click({ modifiers: ['Control'] });
    await expect(toEnglish).toHaveAttribute('href', `${routePath('home', 'en')}#lead-form`);
    await toEnglish.click();
    await page.waitForURL(`**${routePath('home', 'en')}#lead-form`);
    expect(page.url().match(/#/g)).toHaveLength(1);
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

  test('following a same-page link closes the panel and moves focus to the link target', async ({ page }) => {
    await page.goto(routePath('home', 'es'));
    const button = page.locator('[data-menu-button]');
    await button.click();
    await page.locator('[data-nav="method"]').click();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#metodo')).toBeFocused();
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

// ---------------------------------------------------------------------------
// The Home (US-021, UX_UI_DIRECTION.md section 5.1, CONTENT.md section 5)
// ---------------------------------------------------------------------------
const SECTION_ORDER = ['hero', 'escalera', 'oportunidad', 'metodo', 'recursos', 'historia', 'testimonios', 'vip'];

const homeCopy = {
  es: { home: homeEs, story: storyEs },
  en: { home: homeEn, story: storyEn },
} as const;

/**
 * Whether any viewport of the given height can show two gold (Oro Suave) buttons at
 * once. Exact and instant: two buttons share a viewport only when the gap between
 * the lower edge of the upper one and the upper edge of the lower one is smaller
 * than the viewport height, so no scrolling through the page is needed.
 */
async function goldButtonsShareAViewport(page: Page, viewportHeight: number): Promise<{ count: number; minGap: number }> {
  return page.evaluate((height) => {
    const gold = [...document.querySelectorAll<HTMLElement>('a, button')]
      .filter((el) => getComputedStyle(el).backgroundColor === 'rgb(214, 176, 77)')
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return { top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY };
      })
      .sort((x, y) => x.top - y.top);
    let minGap = Infinity;
    for (let i = 1; i < gold.length; i++) minGap = Math.min(minGap, gold[i].top - gold[i - 1].bottom);
    return { count: gold.length, minGap: minGap === Infinity ? height : minGap };
  }, viewportHeight);
}

for (const lang of LANGUAGES) {
  const common = dictionaries[lang];
  const { home, story } = homeCopy[lang];

  test.describe(`Home (${lang})`, () => {
    test('has the sections in order and no application form', async ({ page }) => {
      await page.goto(routePath('home', lang));
      const ids = await page.$$eval('main > section', (sections) => sections.map((section) => section.id));
      expect(ids).toEqual(SECTION_ORDER);
      await expect(page.locator('#lead-form, #lead-form-form, #lead-submit')).toHaveCount(0);
      await expect(page.locator('h1')).toHaveCount(1);
    });

    test('hero: copy verbatim, the gold call to action leads to the VIP page, the text link to the resources', async ({ page }) => {
      await page.goto(routePath('home', lang));
      const hero = page.locator('#hero');
      await expect(hero.locator('h1')).toHaveText(home.home.hero.title.replace(/\*/g, ''));
      await expect(hero).toContainText(home.home.hero.eyebrow);
      await expect(hero).toContainText(home.home.hero.lead);
      await expect(hero).toContainText(home.home.hero.trust);
      const vip = hero.getByRole('link', { name: common.cta.vip_long });
      await expect(vip).toHaveAttribute('href', routePath('vip', lang));
      expect(await vip.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(214, 176, 77)');
      await expect(hero.getByRole('link', { name: common.cta.start_free })).toHaveAttribute('href', routePath('resources', lang));
      await expect(hero.getByRole('img', { name: home.home.hero.photo_alt })).toBeVisible();
    });

    test('ladder, opportunity and method copy is verbatim, with no emphasis markers on screen', async ({ page }) => {
      await page.goto(routePath('home', lang));
      const text = await page.locator('main').innerText();
      expect(text).not.toContain('*');
      const ladder = page.locator('#escalera');
      await expect(ladder.locator('h2')).toHaveText(home.home.ladder.title.replace(/\*/g, ''));
      await expect(ladder).toContainText(home.home.ladder.closing);
      await expect(page.locator('#oportunidad [data-opportunity-card]')).toHaveCount(6);
      for (const n of ['1', '2', '3', '4', '5', '6'] as const) {
        await expect(page.locator('#oportunidad')).toContainText(home.home.opportunity[n].title);
        await expect(page.locator('#oportunidad')).toContainText(home.home.opportunity[n].body);
      }
      await expect(page.locator('#metodo [data-method-step]')).toHaveCount(3);
      await expect(page.locator('#metodo')).toContainText(home.home.method['1'].title);
    });

    test('resources teaser: the three home resources in order, from the data file, and the library link', async ({ page }) => {
      await page.goto(routePath('home', lang));
      const cards = page.locator('#recursos [data-resource-id]');
      await expect(cards).toHaveCount(3);
      const ids = await cards.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-resource-id')));
      expect(ids).toEqual(RESOURCES.filter((r) => r.homeOrder).sort((a, b) => a.homeOrder! - b.homeOrder!).map((r) => r.id));
      await expect(cards.first()).toContainText(RESOURCES.find((r) => r.homeOrder === 1)!.title[lang]);
      const library = page.locator('#recursos').getByRole('link', { name: common.cta.all_resources });
      await expect(library).toHaveAttribute('href', routePath('resources', lang));
      expect(await library.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(60, 95, 141)');
    });

    test('story teaser: the three paragraphs, the media names, terracotta only as an accent, link to the story page', async ({ page }) => {
      await page.goto(routePath('home', lang));
      const teaser = page.locator('#historia');
      await expect(teaser.locator('h2')).toHaveText(home.home.story.title.replace(/\*/g, ''));
      for (const p of [story.p1, story.p2, story.p3]) await expect(teaser).toContainText(p);
      for (const n of ['1', '2', '3', '4'] as const) await expect(teaser).toContainText(story.media[n]);
      await expect(teaser.getByRole('link', { name: common.cta.read_story })).toHaveAttribute('href', routePath('story', lang));
      const backgrounds = await teaser.evaluate((section) =>
        [section, ...section.querySelectorAll<HTMLElement>('*')].map((el) => getComputedStyle(el).backgroundColor),
      );
      expect(backgrounds).not.toContain('rgb(201, 131, 104)');
    });

    test('testimonials: two text cards and one video card, all placeholders with the pending badge', async ({ page }) => {
      await page.goto(routePath('home', lang));
      const cards = page.locator('#testimonios [data-testimonial-card]');
      await expect(cards).toHaveCount(3);
      await expect(page.locator('#testimonios [data-testimonial-card="text"]')).toHaveCount(2);
      await expect(page.locator('#testimonios [data-testimonial-card="video"]')).toHaveCount(1);
      await expect(page.locator('#testimonios').getByText(common.pending.badge)).toHaveCount(3);
      await expect(page.locator('#testimonios iframe, #testimonios video')).toHaveCount(0);
    });

    test('pending badges follow the block list: placeholders show, provisional method copy does not in a normal build', async ({ page }) => {
      await page.goto(routePath('home', lang));
      await expect(page.locator('#metodo').getByText(common.pending.badge)).toHaveCount(0);
      await expect(page.locator('#recursos').getByText(common.pending.badge)).toHaveCount(3);
    });

    test('the VIP band and every VIP call to action lead to the VIP page', async ({ page }) => {
      await page.goto(routePath('home', lang));
      const band = page.locator('#vip');
      await expect(band).toContainText(common.vip_band.eyebrow);
      await expect(band).toContainText(common.vip_band.body);
      await expect(band.getByRole('link', { name: common.cta.vip_apply })).toHaveAttribute('href', routePath('vip', lang));
      for (const link of await page.locator('a[data-nav="vip"], #hero a[href$="/"]:has-text("VIP")').all()) {
        expect(await link.getAttribute('href')).toBe(routePath('vip', lang));
      }
      await page.getByRole('main').getByRole('link', { name: common.cta.vip_apply }).click();
      await page.waitForURL(`**${routePath('vip', lang)}`);
      await expect(page.locator('#lead-form-form')).toBeVisible();
    });
  });
}

test.describe('never two gold buttons in one viewport (BR-010)', () => {
  for (const width of [360, 390, 768, 1280]) {
    for (const lang of LANGUAGES) {
      test(`${lang} at ${width} px`, async ({ page }) => {
        await page.setViewportSize({ width, height: width >= 1280 ? 800 : 844 });
        await page.goto(routePath('home', lang));
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        const height = width >= 1280 ? 800 : 844;
        const { count, minGap } = await goldButtonsShareAViewport(page, height);
        expect(count).toBe(2); // the hero call to action and the VIP band
        expect(minGap).toBeGreaterThanOrEqual(height);
      });
    }
  }
});

test.describe('Home anchors', () => {
  test('the Método Polaris link of the header reaches its section', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(routePath('home', 'es'));
    await page.locator('header [data-nav="method"]').click();
    await expect(page).toHaveURL(/#metodo$/);
    await expect(page.locator('#metodo')).toBeInViewport();
  });

  test('the toggle keeps a Home section anchor', async ({ page }) => {
    await page.goto(`${routePath('home', 'es')}#oportunidad`);
    await page.locator('[data-language-toggle] a[data-lang="en"]').click();
    await page.waitForURL(`**${routePath('home', 'en')}#oportunidad`);
  });
});
