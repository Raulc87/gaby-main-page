// US-041 AC3, AC6: the header on every width and in both languages. Mi historia,
// Wealth Mastery and Diagnóstico gratis lead to their pages; the outlined
// "Aplicá a Wealth Mastery" link leads to the application; there is no link to the
// Método Polaris page or the library, no Blog link, and no gold link (BR-010).
import { expect, test, type Page } from '@playwright/test';
import { LANGUAGES, type Language } from '../../src/i18n';
import { common as en } from '../../src/i18n/en/common';
import { common as es } from '../../src/i18n/es/common';
import { routePath, type PageId } from '../../src/i18n/routes';

const dictionaries = { es, en };
const VIEWPORTS = [
  { name: '390 px', width: 390, height: 844, menuButton: true },
  { name: '1280 px', width: 1280, height: 800, menuButton: false },
] as const;

/** The three navigation links of the header, in order (UX_UI_DIRECTION.md section 4.1). */
function navigationLinks(lang: Language): Array<{ id: string; page: PageId; label: string }> {
  const { nav } = dictionaries[lang];
  return [
    { id: 'story', page: 'story', label: nav.story },
    { id: 'mastery', page: 'mastery', label: nav.mastery },
    { id: 'calculator', page: 'calculator', label: nav.diagnosis },
  ];
}

async function openMenuIfCollapsed(page: Page, collapsed: boolean) {
  if (collapsed) await page.locator('[data-menu-button]').click();
}

for (const viewport of VIEWPORTS) {
  test.describe(`header at ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const lang of LANGUAGES) {
      const { nav } = dictionaries[lang];

      test(`shows the three links in order, the toggle and the outlined apply link (${lang})`, async ({ page }) => {
        await page.goto(routePath('home', lang));
        await openMenuIfCollapsed(page, viewport.menuButton);

        const links = navigationLinks(lang);
        const items = page.locator('header nav:not([data-language-toggle]) a');
        await expect(items).toHaveCount(links.length);
        for (const [index, link] of links.entries()) {
          await expect(items.nth(index)).toHaveText(link.label);
          await expect(items.nth(index)).toHaveAttribute('href', routePath(link.page, lang));
          await expect(items.nth(index)).toBeVisible();
        }
        await expect(page.locator('[data-language-toggle] a')).toHaveCount(2);

        const apply = page.locator('header [data-nav="vip"]');
        await expect(apply).toBeVisible();
        await expect(apply).toHaveAttribute('href', routePath('vip', lang));
        await expect(apply).toHaveText(viewport.menuButton ? nav.vip_short : nav.vip, { useInnerText: true });
      });

      test(`each link leads to its page (${lang})`, async ({ page }) => {
        for (const link of navigationLinks(lang)) {
          await page.goto(routePath('home', lang));
          await openMenuIfCollapsed(page, viewport.menuButton);
          await page.locator(`header [data-nav="${link.id}"]`).click();
          await page.waitForURL(`**${routePath(link.page, lang)}`);
          await expect(page).toHaveTitle(dictionaries[lang].meta[link.page].title);
          await expect(page.locator('header [aria-current="page"]')).toHaveText(link.label);
        }
      });

      test(`the apply link leads to the application page (${lang})`, async ({ page }) => {
        await page.goto(routePath('home', lang));
        await page.locator('header [data-nav="vip"]').click();
        await page.waitForURL(`**${routePath('vip', lang)}`);
        await expect(page).toHaveTitle(dictionaries[lang].meta.vip.title);
      });

      test(`has no gold link, and no link to the Método Polaris page, the library or the blog (${lang})`, async ({ page }) => {
        await page.goto(routePath('home', lang));
        await openMenuIfCollapsed(page, viewport.menuButton);
        const header = page.locator('header');
        // BR-010: gold is the in-page call to apply, never the header.
        await expect(header.locator('[class*="bg-soft-gold"]')).toHaveCount(0);
        const apply = header.locator('[data-nav="vip"]');
        await expect(apply).toHaveClass(/border-heritage-blue/);
        await expect(apply).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        for (const gone of ['method', 'blog'] as const) {
          const path = gone === 'blog' ? `/${lang}/blog/` : routePath(gone as PageId, lang);
          await expect(header.locator(`a[href$="${path}"]`)).toHaveCount(0);
        }
      });
    }

    test('the header names Wealth Mastery, never "Mentoría VIP" / "VIP Mentorship"', async ({ page }) => {
      for (const lang of LANGUAGES) {
        await page.goto(routePath('home', lang));
        await expect(page.locator('header')).not.toContainText(/Mentoría VIP|VIP Mentorship/);
      }
    });
  });
}

test.describe('the Wealth Mastery stub (US-041 AC5)', () => {
  for (const lang of LANGUAGES) {
    test(`has its own title and description (${lang})`, async ({ page }) => {
      const { meta } = dictionaries[lang];
      await page.goto(routePath('mastery', lang));
      await expect(page).toHaveTitle(meta.mastery.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', meta.mastery.description);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
    });
  }
});
