// US-046 AC2, AC3: the resource library is withdrawn. No internal link on any page points at its
// old paths, the build has no page there, and the not-ready screen and My story lead to the calculator.
import { expect, test } from '@playwright/test';
import { LANGUAGES } from '../../src/i18n';
import { PAGE_IDS, routePath } from '../../src/i18n/routes';

const OLD_PATHS = ['/es/recursos/', '/en/resources/'] as const;
/** Hrefs that would lead to the library, by path or by the old section anchor. */
const LIBRARY_HREF = /\/(recursos|resources)(\/|#|$)|#recursos$/;

for (const lang of LANGUAGES) {
  for (const id of PAGE_IDS) {
    test(`no internal link on ${id} (${lang}) points to the library`, async ({ page }) => {
      await page.goto(routePath(id, lang));
      const hrefs = await page.locator('a[href]').evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.getAttribute('href') ?? ''),
      );
      expect(hrefs.length).toBeGreaterThan(0);
      expect(hrefs.filter((href) => LIBRARY_HREF.test(href))).toEqual([]);
    });
  }
}

for (const path of OLD_PATHS) {
  test(`the build has no page at ${path}`, async ({ page }) => {
    const response = await page.goto(path);
    // The old pages are gone: not served as pages, whatever the server answers for an unknown path.
    const isPage = response?.ok() === true && (await page.locator('[data-resource-id], #resource-filters').count()) > 0;
    expect(isPage).toBe(false);
    expect(await page.getByRole('heading', { level: 1 }).allTextContents()).not.toContain('Biblioteca gratuita');
  });
}

for (const lang of LANGUAGES) {
  test(`My story's free link leads to the calculator (${lang})`, async ({ page }) => {
    await page.goto(routePath('story', lang));
    const link = page.getByTestId('story-resources-link');
    await expect(link).toHaveAttribute('href', routePath('calculator', lang));
  });
}
