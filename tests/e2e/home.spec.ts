// US-020 (site shell) on the Home and the stub pages: header, navigation, mobile
// menu, language toggle across pages, footer, skip link and per-page metadata.
// The Home sections (US-021) are covered further down.
import { expect, test, type Page } from '@playwright/test';
import { common as en } from '../../src/i18n/en/common';
import { common as es } from '../../src/i18n/es/common';
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

        // AC1: no blog link, and no link to the Método Polaris page until GK-028-method-page.
        // (The Método Polaris stub's own language toggle links to its other-language path.)
        if (id !== 'method') {
          await expect(
            page.locator('a[href*="/blog"], a[href*="metodo-polaris"], a[href*="polaris-method"]'),
          ).toHaveCount(0);
        }
      });
    }
  }

  for (const lang of LANGUAGES) {
    test(`the outlined VIP link shows the long label from 1024 px and the short one below (${lang})`, async ({ page }) => {
      const { nav } = dictionaries[lang];
      const link = page.locator('header [data-nav="vip"]');
      await page.setViewportSize({ width: 1024, height: 800 });
      await page.goto(routePath('home', lang));
      await expect(link).toHaveText(nav.vip, { useInnerText: true });
      await page.setViewportSize({ width: 1023, height: 800 });
      await expect(link).toHaveText(nav.vip_short, { useInnerText: true });
      await page.setViewportSize({ width: 360, height: 800 });
      await expect(link).toHaveText(nav.vip_short, { useInnerText: true });
      await expect(link).toBeVisible();
    });
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

test('the page ids are the phase 2a pages plus method and calculator (phase 2c)', () => {
  const ids: PageId[] = ['home', 'story', 'resources', 'vip', 'privacy', 'method', 'calculator'];
  expect([...PAGE_IDS]).toEqual(ids);
});

// ---------------------------------------------------------------------------
// The Home (US-034, UX_UI_DIRECTION.md section 5.1, CONTENT.md section 5)
// ---------------------------------------------------------------------------
const SECTION_ORDER = [
  'hero',
  'escalera',
  'en-juego',
  'historia',
  'oportunidad',
  'metodo',
  'wealth-mastery',
  'antes-despues',
  'testimonios',
  'calculadora',
  'vip',
];
const BLUE = 'rgb(60, 95, 141)';
const GOLD = 'rgb(214, 176, 77)';

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
  const { home } = homeCopy[lang];
  const plain = (text: string) => text.replace(/\*/g, '');

  test.describe(`Home (${lang})`, () => {
    test('has the eleven sections in order, one h1, no application form and no #recursos', async ({ page }) => {
      await page.goto(routePath('home', lang));
      const ids = await page.$$eval('main > section', (sections) => sections.map((section) => section.id));
      expect(ids).toEqual(SECTION_ORDER);
      await expect(page.locator('#lead-form, #lead-form-form, #lead-submit')).toHaveCount(0);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('#recursos')).toHaveCount(0);
      await expect(page.locator('a[href*="#recursos"]')).toHaveCount(0);
    });

    test('hero: copy verbatim, gold call to action to the VIP page, blue one to the calculator, photo placeholder with its badge', async ({ page }) => {
      await page.goto(routePath('home', lang));
      const hero = page.locator('#hero');
      await expect(hero.locator('h1')).toHaveText(plain(home.home.hero.title));
      await expect(hero).toContainText(home.home.hero.eyebrow);
      await expect(hero).toContainText(home.home.hero.lead);
      await expect(hero).toContainText(home.home.hero.trust);
      const vip = hero.getByRole('link', { name: home.home.hero.cta });
      await expect(vip).toHaveAttribute('href', routePath('vip', lang));
      expect(await vip.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(GOLD);
      const calculator = hero.getByRole('link', { name: home.home.hero.secondary });
      await expect(calculator).toHaveAttribute('href', routePath('calculator', lang));
      expect(await calculator.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(BLUE);
      // The "desired state" photo has not arrived: a placeholder with the badge, in every build.
      const frame = hero.locator('[data-hero-photo-frame]');
      await expect(frame).toContainText(home.home.hero.photo.placeholder);
      await expect(frame.getByText(common.pending.badge)).toHaveCount(1);
      await expect(hero.locator('img')).toHaveCount(0);
    });

    test('sections show their copy verbatim, with no emphasis markers on screen', async ({ page }) => {
      await page.goto(routePath('home', lang));
      expect(await page.locator('main').innerText()).not.toContain('*');
      const { ladder, stakes, opportunity, method, mastery, change } = home.home;
      await expect(page.locator('#escalera h2')).toHaveText(plain(ladder.title));
      await expect(page.locator('#escalera')).toContainText(ladder.p2.replace(/\*/g, ''));
      await expect(page.locator('#escalera')).not.toContainText('Cada vez más cosas dependen de ti');
      await expect(page.locator('#escalera')).toContainText(ladder.closing);
      await expect(page.locator('#en-juego [data-stakes-card]')).toHaveCount(3);
      await expect(page.locator('#en-juego')).toContainText(stakes['1'].title);
      await expect(page.locator('#en-juego')).toContainText(stakes.closing);
      await expect(page.locator('#oportunidad [data-opportunity-card]')).toHaveCount(6);
      for (const n of ['1', '2', '3', '4', '5', '6'] as const) {
        await expect(page.locator('#oportunidad')).toContainText(opportunity[n].title);
        await expect(page.locator('#oportunidad')).toContainText(opportunity[n].body);
      }
      await expect(page.locator('#metodo [data-method-step]')).toHaveCount(3);
      await expect(page.locator('#metodo')).toContainText(method['3'].body);
      await expect(page.locator('#wealth-mastery [data-mastery-module]')).toHaveCount(7);
      await expect(page.locator('#wealth-mastery')).toContainText(mastery.lead);
      await expect(page.locator('#antes-despues [data-change-column="before"] li')).toHaveCount(5);
      await expect(page.locator('#antes-despues [data-change-column="after"] li')).toHaveCount(5);
      await expect(page.locator('#antes-despues')).toContainText(change.before.label);
    });

    test('the guide: the studio portrait only here, three figures, media names as text, link to the story page', async ({ page }) => {
      await page.goto(routePath('home', lang));
      await expect(page.locator('main img')).toHaveCount(1);
      const guide = page.locator('#historia');
      await expect(guide.getByRole('img', { name: home.home.story.portrait_alt })).toBeVisible();
      await expect(guide.locator('h2')).toHaveText(plain(home.home.story.title));
      await expect(guide).toContainText(home.home.story.p1);
      await expect(guide).toContainText(home.home.story.p2);
      await expect(guide.locator('[data-guide-stat]')).toHaveCount(3);
      await expect(guide).toContainText(home.home.story.stat['3'].value);
      await expect(guide.locator('[data-home-media] li')).toHaveCount(3);
      await expect(guide.locator('img')).toHaveCount(1); // no media logos (FR-029)
      await expect(guide.getByRole('link', { name: common.cta.read_story })).toHaveAttribute('href', routePath('story', lang));
    });

    test('testimonials: three placeholder cards with the badge and no call to action while all are placeholders', async ({ page }) => {
      await page.goto(routePath('home', lang));
      await expect(page.locator('#testimonios [data-testimonial-card]')).toHaveCount(3);
      await expect(page.locator('#testimonios [data-testimonial-card="text"]')).toHaveCount(2);
      await expect(page.locator('#testimonios [data-testimonial-card="video"]')).toHaveCount(1);
      await expect(page.locator('#testimonios').getByText(common.pending.badge)).toHaveCount(3);
      await expect(page.locator('#testimonios iframe, #testimonios video')).toHaveCount(0);
      await expect(page.locator('#testimonios a')).toHaveCount(0);
      await expect(page.getByText(home.home.testimonials.cta)).toHaveCount(0);
    });

    test('the calculator teaser: example result, "receive" without the guide, links to the calculator and the library', async ({ page }) => {
      await page.goto(routePath('home', lang));
      const teaser = page.locator('#calculadora');
      await expect(teaser).toContainText(home.home.calculator.receive);
      await expect(teaser).not.toContainText(home.home.calculator.receive_with_guide);
      const cta = teaser.getByRole('link', { name: home.home.calculator.cta });
      await expect(cta).toHaveAttribute('href', routePath('calculator', lang));
      expect(await cta.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(BLUE);
      const example = teaser.locator('[data-calculator-example]');
      await expect(example).toContainText(home.home.calculator.example.label);
      await expect(example).toContainText(home.home.calculator.example.value);
      await expect(example).toContainText(home.home.calculator.example.zone);
      await expect(teaser).toContainText(home.home.calculator.more);
      const links = teaser.locator('[data-library-link]');
      await expect(links).toHaveCount(2);
      for (const link of await links.all()) await expect(link).toHaveAttribute('href', routePath('resources', lang));
    });

    test('the other VIP calls to action are blue and lead to the VIP page', async ({ page }) => {
      await page.goto(routePath('home', lang));
      const method = page.locator('#metodo').getByRole('link', { name: home.home.method.cta });
      const mastery = page.locator('#wealth-mastery').getByRole('link', { name: common.cta.vip_apply });
      for (const link of [method, mastery]) {
        await expect(link).toHaveAttribute('href', routePath('vip', lang));
        expect(await link.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(BLUE);
      }
    });

    test('pending badges follow the block list: the hero photo and testimonials show, provisional blocks do not in a normal build', async ({ page }) => {
      await page.goto(routePath('home', lang));
      for (const id of ['escalera', 'historia', 'metodo', 'wealth-mastery']) {
        await expect(page.locator(`#${id}`).getByText(common.pending.badge)).toHaveCount(0);
      }
      await expect(page.getByRole('main').getByText(common.pending.badge)).toHaveCount(4); // hero photo + 3 testimonials
    });

    test('the closing band: shared title, its own body and three steps, gold call to action to the VIP page', async ({ page }) => {
      await page.goto(routePath('home', lang));
      const band = page.locator('#vip');
      await expect(band).toContainText(common.vip_band.eyebrow);
      await expect(band).toContainText(home.home.vip.body);
      await expect(band.locator('[data-vip-steps] li')).toHaveCount(3);
      const apply = band.getByRole('link', { name: common.cta.vip_apply });
      await expect(apply).toHaveAttribute('href', routePath('vip', lang));
      expect(await apply.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(GOLD);
      await apply.click();
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
        expect(count).toBe(2); // the hero call to action and the closing band
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

  for (const id of SECTION_ORDER) {
    test(`#${id} reaches its section`, async ({ page }) => {
      await page.goto(`${routePath('home', 'es')}#${id}`);
      await expect(page.locator(`main > section#${id}`)).toBeInViewport();
    });
  }

  test('the toggle keeps a Home section anchor', async ({ page }) => {
    await page.goto(`${routePath('home', 'es')}#oportunidad`);
    await page.locator('[data-language-toggle] a[data-lang="en"]').click();
    await page.waitForURL(`**${routePath('home', 'en')}#oportunidad`);
  });
});
