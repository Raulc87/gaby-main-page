// US-042: the Wealth Mastery page (UX_UI_DIRECTION.md section 5.7, CONTENT.md section 12): Gaby's
// eight sections in order with their anchors, the three pillars without numbers or arrows, the
// FAQ as native <details> usable by keyboard, the marked photo placeholder, the Home's
// testimonials, no price, one gold button per viewport, and no link to the removed Método Polaris
// page. The e2e build is not a preview build, so the provisional-copy badges (FAQ answers, the
// adapted lines) are absent and only the placeholders' badges show (CONTENT.md -> Pending badge).
import { expect, test, type Page } from '@playwright/test';
import { LANGUAGES, type Language } from '../../src/i18n';
import { common as en } from '../../src/i18n/en/common';
import { common as es } from '../../src/i18n/es/common';
import { home as homeEn } from '../../src/i18n/en/home';
import { home as homeEs } from '../../src/i18n/es/home';
import { mastery as masteryEn } from '../../src/i18n/en/mastery';
import { mastery as masteryEs } from '../../src/i18n/es/mastery';
import { PAGE_IDS, routePath } from '../../src/i18n/routes';

const copy = {
  es: { common: es, home: homeEs.home, mastery: masteryEs.mastery },
  en: { common: en, home: homeEn.home, mastery: masteryEn.mastery },
} as const;

const SECTION_IDS = ['para-vos', 'metodo', 'como-funciona', 'guia', 'testimonios', 'preguntas', 'aplicar'];
const VIEWPORTS = [360, 390, 768, 1280] as const;
const GOLD = 'rgb(214, 176, 77)';

const plain = (text: string) => text.replace(/\*/g, '');

/** The most gold buttons in the viewport at any scroll position of the page (BR-010: one). */
async function maxGoldButtonsInViewport(page: Page): Promise<number> {
  return page.evaluate(
    async ([gold]) => {
      const step = Math.max(200, Math.floor(window.innerHeight / 2));
      let most = 0;
      for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
        const visible = [...document.querySelectorAll<HTMLElement>('a, button')].filter((el) => {
          if (getComputedStyle(el).backgroundColor !== gold) return false;
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
        }).length;
        most = Math.max(most, visible);
      }
      return most;
    },
    [GOLD],
  );
}

for (const lang of LANGUAGES) {
  const { common, home, mastery } = copy[lang];

  test.describe(`Wealth Mastery page (${lang})`, () => {
    test('is reached from the header, with its title, description and current-page mark', async ({ page }) => {
      await page.goto(routePath('home', lang));
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.locator('header [data-nav="mastery"]').click();
      await page.waitForURL(`**${routePath('mastery', lang)}`);
      await expect(page).toHaveTitle(common.meta.mastery.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        common.meta.mastery.description,
      );
      await expect(page.locator('header [aria-current="page"]')).toHaveText(common.nav.mastery);
    });

    test('has Gaby’s eight sections in her order with the anchors of UX section 5.7', async ({ page }) => {
      await page.goto(routePath('mastery', lang));
      const sections = page.locator('main section');
      await expect(sections).toHaveCount(SECTION_IDS.length + 1);
      await expect(sections.first()).not.toHaveAttribute('id', /.+/);
      const ids = await sections.evaluateAll((els) => els.map((el) => el.id));
      expect(ids).toEqual(['', ...SECTION_IDS]);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveText(plain(mastery.title));
      await expect(page.locator('main')).toContainText(mastery.lead);
      expect(await page.locator('main').innerText()).not.toContain('*');
    });

    test('hero: the gold apply button and the blue calculator link', async ({ page }) => {
      await page.goto(routePath('mastery', lang));
      await expect(page.locator('main section').first()).toContainText(common.vip_band.eyebrow);
      const apply = page.locator('[data-mastery-apply]');
      await expect(apply).toHaveText(common.cta.vip_apply);
      await expect(apply).toHaveAttribute('href', routePath('vip', lang));
      await expect(apply).toHaveCSS('background-color', GOLD);
      const secondary = page.locator('[data-mastery-secondary]');
      await expect(secondary).toHaveText(home.hero.secondary);
      await expect(secondary).toHaveAttribute('href', routePath('calculator', lang));
      await expect(secondary).not.toHaveCSS('background-color', GOLD);
    });

    test('is it for you: two cards with their items', async ({ page }) => {
      await page.goto(routePath('mastery', lang));
      const yes = page.locator('[data-fit-yes]');
      const no = page.locator('[data-fit-no]');
      await expect(page.locator('#para-vos h2')).toHaveText(mastery.fit.title);
      await expect(yes.locator('h3')).toHaveText(mastery.fit.yes.title);
      await expect(yes.locator('li')).toHaveCount(5);
      await expect(yes.locator('li').first()).toHaveText(mastery.fit.yes['1']);
      await expect(no.locator('h3')).toHaveText(mastery.fit.no.title);
      await expect(no.locator('li')).toHaveCount(3);
      await expect(no.locator('li').nth(2)).toHaveText(mastery.fit.no['3']);
      // The "for you" card has the 2 px heritage-blue border (UX section 5.7).
      await expect(yes).toHaveCSS('border-top-width', '2px');
    });

    test('the Método Polaris: three pillars with no numbers or arrows, then "in parallel, not in order"', async ({ page }) => {
      await page.goto(routePath('mastery', lang));
      const section = page.locator('#metodo');
      await expect(section).toContainText(home.method.eyebrow);
      await expect(section.locator('h2')).toHaveText(plain(mastery.method.title));
      await expect(section).toContainText(mastery.method.lead);

      const pillars = page.locator('[data-pillar]');
      await expect(pillars).toHaveCount(3);
      for (const [index, n] of (['1', '2', '3'] as const).entries()) {
        const pillar = pillars.nth(index);
        await expect(pillar).toContainText(mastery.method[n].label);
        await expect(pillar.locator('h3')).toHaveText(mastery.method[n].title);
        await expect(pillar.locator('li')).toHaveCount(3);
        for (const point of ['1', '2', '3'] as const) {
          await expect(pillar).toContainText(mastery.method[n].point[point]);
        }
      }
      // No numbers, no arrows: no digit in a pillar's label or title, no arrow glyph or icon
      // between or inside the pillars (UX section 5.7, Gaby's note).
      const grid = page.locator('[data-pillars]');
      for (const pillar of await pillars.all()) {
        const heading = await pillar.locator('p, h3').allInnerTexts();
        expect(heading.join(' ')).not.toMatch(/\d/);
      }
      expect(await grid.innerText()).not.toMatch(/[→➜➔⟶›»]/);
      await expect(grid.locator('svg')).toHaveCount(0);
      await expect(grid.locator('ol')).toHaveCount(0);

      // The "En paralelo, no en orden" card follows the pillars, full width, heritage-blue.
      const parallel = page.locator('[data-parallel]');
      await expect(parallel.locator('h3')).toHaveText(mastery.method.parallel.title);
      await expect(parallel).toContainText(mastery.method.parallel.body);
      await expect(parallel).toHaveCSS('background-color', 'rgb(60, 95, 141)');
      const gridBox = await grid.boundingBox();
      const parallelBox = await parallel.boundingBox();
      expect(parallelBox!.y).toBeGreaterThan(gridBox!.y + gridBox!.height - 1);
      expect(Math.round(parallelBox!.width)).toBe(Math.round(gridBox!.width));
    });

    test('how it works: four cards, no price', async ({ page }) => {
      await page.goto(routePath('mastery', lang));
      const cards = page.locator('[data-how-card]');
      await expect(cards).toHaveCount(4);
      for (const [index, n] of (['1', '2', '3', '4'] as const).entries()) {
        await expect(cards.nth(index).locator('h3')).toHaveText(mastery.how[n].title);
        await expect(cards.nth(index)).toContainText(mastery.how[n].body);
      }
    });

    test('who guides you: a marked photo placeholder (not the Home’s portrait) and the link to My story', async ({ page }) => {
      await page.goto(routePath('mastery', lang));
      const guide = page.locator('#guia');
      await expect(guide).toContainText(mastery.guide.eyebrow);
      await expect(guide.locator('h2')).toHaveText(mastery.guide.title);
      await expect(guide).toContainText(mastery.guide.p1);
      await expect(guide).toContainText(mastery.guide.p2);
      const frame = page.locator('[data-guide-photo-frame]');
      await expect(frame).toContainText(mastery.guide.photo.placeholder);
      await expect(frame).toHaveAttribute('role', 'img');
      await expect(frame).toHaveAttribute('aria-label', mastery.guide.photo_alt);
      // The placeholder's badge shows in every build (BR-011); the Home's studio portrait is not used.
      await expect(guide.getByText(common.pending.badge)).toHaveCount(1);
      await expect(page.locator('img[src*="gabriela-provisional"]')).toHaveCount(0);
      await expect(guide.locator('a')).toHaveAttribute('href', routePath('story', lang));
      await expect(guide.locator('a')).toHaveText(common.cta.read_story);
    });

    test('testimonials: the Home’s placeholder cards with their badges', async ({ page }) => {
      await page.goto(routePath('mastery', lang));
      const section = page.locator('#testimonios');
      await expect(section.locator('h2')).toHaveText(plain(home.testimonials.title));
      const cards = section.locator('[data-testimonial-card]');
      await expect(cards).toHaveCount(3);
      for (const card of await cards.all()) {
        await expect(card.getByText(common.pending.badge)).toHaveCount(1);
      }
    });

    test('FAQ: native <details>, closed at first, opened and closed by keyboard', async ({ page }) => {
      await page.goto(routePath('mastery', lang));
      const items = page.locator('[data-faq-item]');
      await expect(page.locator('#preguntas h2')).toHaveText(mastery.faq.title);
      await expect(items).toHaveCount(4);
      expect(await items.evaluateAll((els) => els.map((el) => el.tagName))).toEqual([
        'DETAILS',
        'DETAILS',
        'DETAILS',
        'DETAILS',
      ]);
      for (const [index, n] of (['1', '2', '3', '4'] as const).entries()) {
        const item = items.nth(index);
        await expect(item.locator('summary')).toHaveText(mastery.faq[n].question);
        await expect(item).not.toHaveAttribute('open', '');
        await expect(item.getByText(mastery.faq[n].answer)).toBeHidden();
      }

      const first = items.first();
      await first.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(first).toHaveAttribute('open', '');
      await expect(first.getByText(mastery.faq['1'].answer)).toBeVisible();
      await page.keyboard.press('Enter');
      await expect(first).not.toHaveAttribute('open', '');

      const second = items.nth(1);
      await second.locator('summary').focus();
      await page.keyboard.press('Space');
      await expect(second).toHaveAttribute('open', '');
      await expect(second.getByText(mastery.faq['2'].answer)).toBeVisible();
    });

    test('FAQ answers carry no badge in a build that is not a preview, and the fourth answer names no price', async ({ page }) => {
      await page.goto(routePath('mastery', lang));
      await page.locator('[data-faq-item]').nth(3).locator('summary').click();
      const answer = page.locator('[data-faq-item]').nth(3);
      await expect(answer).toContainText(mastery.faq['4'].answer);
      await expect(answer.getByText(common.pending.badge)).toHaveCount(0);
      expect(mastery.faq['4'].answer).not.toMatch(/[$₡€]|\d/);
    });

    test('apply: the heritage-blue band with the Home’s three steps and the gold apply button', async ({ page }) => {
      await page.goto(routePath('mastery', lang));
      const band = page.locator('#aplicar');
      await expect(band).toHaveCSS('background-color', 'rgb(60, 95, 141)');
      await expect(band).toContainText(common.vip_band.eyebrow);
      await expect(band.locator('h2')).toHaveText(plain(mastery.apply.title));
      const steps = band.locator('[data-apply-steps] li');
      await expect(steps).toHaveCount(3);
      for (const [index, n] of (['1', '2', '3'] as const).entries()) {
        await expect(steps.nth(index)).toContainText(home.vip.step[n].title);
        await expect(steps.nth(index)).toContainText(home.vip.step[n].body);
      }
      const apply = band.locator('a');
      await expect(apply).toHaveText(common.cta.vip_apply);
      await expect(apply).toHaveAttribute('href', routePath('vip', lang));
      await expect(apply).toHaveCSS('background-color', GOLD);
      // It is the page's only heritage-blue band (the "in parallel" card is a card).
      await expect(page.locator('main section.bg-heritage-blue')).toHaveCount(1);
    });

    test('shows no price anywhere on the page', async ({ page }) => {
      await page.goto(routePath('mastery', lang));
      for (const item of await page.locator('[data-faq-item] summary').all()) await item.click();
      const text = await page.locator('main').innerText();
      expect(text).not.toMatch(/[$₡€]|\bUSD\b|\bCRC\b|\bcolones\b|\bdólares\b|\bdollars?\b|\d{3,}/i);
    });

    test('has no form and loads no third party', async ({ page }) => {
      // Any host but the site's own (a video, a scheduler, GoHighLevel, a font host) would fail.
      const external: string[] = [];
      page.on('request', (request) => {
        const url = new URL(request.url());
        const local = ['127.0.0.1', 'localhost'].includes(url.hostname);
        if (!local && url.protocol.startsWith('http')) external.push(request.url());
      });
      await page.goto(routePath('mastery', lang));
      await expect(page.locator('main form')).toHaveCount(0);
      await expect(page.locator('main iframe')).toHaveCount(0);
      expect(external).toEqual([]);
    });
  });
}

for (const width of VIEWPORTS) {
  test.describe(`at ${width} px`, () => {
    test.use({ viewport: { width, height: width >= 768 ? 800 : 844 } });

    for (const lang of LANGUAGES) {
      test(`${lang}: no horizontal scroll and at most one gold button in any viewport (BR-010)`, async ({ page }) => {
        await page.goto(routePath('mastery', lang));
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
        // The page has exactly two gold buttons (the hero's and the closing band's), never together.
        const gold = await page.evaluate(
          (color) =>
            [...document.querySelectorAll<HTMLElement>('main a, main button')].filter(
              (el) => getComputedStyle(el).backgroundColor === color,
            ).length,
          GOLD,
        );
        expect(gold).toBe(2);
        expect(await maxGoldButtonsInViewport(page)).toBeLessThanOrEqual(1);
      });
    }
  });
}

test('the pillars, the FAQ and the fit cards stack in one column at 390 px and sit side by side at 1280 px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(routePath('mastery', 'es'));
  const left = async (selector: string, index: number) =>
    (await page.locator(selector).nth(index).boundingBox())!.x;
  expect(await left('[data-pillar]', 0)).toBe(await left('[data-pillar]', 1));
  expect(await left('[data-fit-yes]', 0)).toBe(await left('[data-fit-no]', 0));
  await page.setViewportSize({ width: 1280, height: 800 });
  expect(await left('[data-pillar]', 0)).toBeLessThan(await left('[data-pillar]', 1));
  expect(await left('[data-fit-yes]', 0)).toBeLessThan(await left('[data-fit-no]', 0));
});

test('the toggle keeps the page in the other language', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(routePath('mastery', 'es'));
  await page.locator('[data-language-toggle] a[data-lang="en"]').click();
  await page.waitForURL(`**${routePath('mastery', 'en')}`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toHaveText(plain(masteryEn.mastery.title));
  await page.locator('[data-language-toggle] a[data-lang="es"]').click();
  await page.waitForURL(`**${routePath('mastery', 'es')}`);
  await expect(page.locator('h1')).toHaveText(plain(masteryEs.mastery.title));
});

test('no page links to the removed Método Polaris page (US-042 AC6)', async ({ page }) => {
  for (const lang of LANGUAGES as readonly Language[]) {
    for (const id of PAGE_IDS) {
      await page.goto(routePath(id, lang));
      await expect(page.locator('a[href*="metodo-polaris"], a[href*="polaris-method"]'), `${lang} ${id}`).toHaveCount(0);
    }
  }
});
