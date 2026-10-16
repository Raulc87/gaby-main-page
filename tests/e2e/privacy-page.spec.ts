// US-020 AC1: the privacy notice page exists in both languages with the keyed text of
// CONTENT.md section 9 and the DRAFT label; the consent dialog shows the same text and
// the consent link keeps opening it in place (US-011 AC2: form data kept).
import { expect, test } from '@playwright/test';
import { getCommon, type Language } from '../../src/i18n';
import { routePath } from '../../src/i18n/routes';
import { getPrivacy } from '../../src/lib/lead/dictionaries';
import { DEFAULT_CONTACT_EMAIL, gotoVip, SELECTORS, VALID_LEAD } from './support/lead-form';

const withEmail = (text: string): string => text.replaceAll('{contact_email}', DEFAULT_CONTACT_EMAIL);

for (const lang of ['es', 'en'] as Language[]) {
  const { privacy } = getPrivacy(lang);

  test(`privacy page (${lang}): title, DRAFT label, the eight paragraphs and the contact link`, async ({ page }) => {
    await page.goto(routePath('privacy', lang));

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(privacy.title);
    await expect(page.locator('main')).toContainText(privacy.draft_label);
    const paragraphs = page.locator('[data-privacy-text] p');
    await expect(paragraphs).toHaveCount(8);
    for (const [index, key] of (['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'] as const).entries()) {
      await expect(paragraphs.nth(index)).toHaveText(withEmail(privacy[key]));
    }
    await expect(page.locator('[data-privacy-text] a[href^="mailto:"]')).toHaveCount(2);
    await expect(page).toHaveTitle(getCommon(lang).meta.privacy.title);
  });

  test(`privacy page (${lang}): no horizontal scroll at 360 px and the footer link leads here`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(routePath('home', lang));
    await page.getByRole('link', { name: getCommon(lang).footer.privacy_link }).click();
    await expect(page).toHaveURL(new RegExp(`${routePath('privacy', lang)}$`));
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test(`consent dialog (${lang}): same text as the page, opens in place and keeps the form data`, async ({ page }) => {
    await gotoVip(page, lang);
    await page.locator(SELECTORS.nameInput).fill(VALID_LEAD.name);

    await page.locator('#privacy-notice-trigger').click();
    const dialog = page.locator('#privacy-notice-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: privacy.title })).toBeVisible();
    await expect(dialog).toContainText(privacy.draft_label);
    const paragraphs = dialog.locator('[data-privacy-text] p');
    await expect(paragraphs).toHaveCount(8);
    for (const [index, key] of (['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'] as const).entries()) {
      await expect(paragraphs.nth(index)).toHaveText(withEmail(privacy[key]));
    }
    await expect(dialog.getByRole('button', { name: privacy.close })).toBeVisible();

    await page.locator('#privacy-notice-close').click();
    await expect(dialog).toBeHidden();
    await expect(page.locator(SELECTORS.nameInput)).toHaveValue(VALID_LEAD.name);
  });
}
