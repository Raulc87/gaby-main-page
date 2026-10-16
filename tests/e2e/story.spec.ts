// US-022: the My story page in both languages, the toggle keeps the page, the VIP
// band leads to the VIP page.
import { expect, test } from '@playwright/test';
import { common as en } from '../../src/i18n/en/common';
import { common as es } from '../../src/i18n/es/common';
import { story as storyEn } from '../../src/i18n/en/story';
import { story as storyEs } from '../../src/i18n/es/story';
import { routePath } from '../../src/i18n/routes';

const pages = {
  es: { common: es, story: storyEs },
  en: { common: en, story: storyEn },
} as const;

for (const lang of ['es', 'en'] as const) {
  const { common, story } = pages[lang];

  test.describe(`My story page (${lang})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(routePath('story', lang));
    });

    test('shows the story copy, the media names and the experience row', async ({ page }) => {
      await expect(page.locator('h1')).toContainText(story.title.replace(/\*/g, ''));
      for (const paragraph of [story.p1, story.p2, story.p3]) {
        await expect(page.getByText(paragraph, { exact: true })).toBeVisible();
      }

      const media = page.getByTestId('story-media');
      await expect(media).toContainText(story.media.label);
      for (const name of [story.media['1'], story.media['2'], story.media['3'], story.media['4']]) {
        await expect(media.getByText(name, { exact: true })).toBeVisible();
      }

      const experience = page.getByTestId('story-experience');
      await expect(experience.getByRole('img', { name: story.experience.logo_alt.microsoft })).toBeVisible();
      await expect(experience.getByRole('img', { name: story.experience.logo_alt.oracle })).toBeVisible();
      await expect(experience.getByText(story.experience.intel, { exact: true })).toBeVisible();
      await expect(experience.locator('img')).toHaveCount(2);
    });

    test('logo images load', async ({ page }) => {
      const loaded = await page
        .getByTestId('story-experience')
        .locator('img')
        .evaluateAll((images) =>
          images.map((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0),
        );
      expect(loaded).toEqual([true, true]);
    });

    test('marks the photo and bio spaces as pending', async ({ page }) => {
      for (const id of ['story-photo-placeholder', 'story-bio-placeholder']) {
        await expect(page.getByTestId(id).getByText(common.pending.badge)).toBeVisible();
      }
      await expect(page.getByText(story.photo.placeholder)).toBeVisible();
      await expect(page.getByText(story.bio.placeholder)).toBeVisible();
    });

    test('links to the resources', async ({ page }) => {
      const link = page.getByTestId('story-resources-link');
      await expect(link).toHaveText(common.cta.start_free);
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${routePath('resources', lang)}$`));
    });

    test('the VIP band leads to the VIP page', async ({ page }) => {
      await page.locator('main').getByRole('link', { name: common.cta.vip_apply }).click();
      await expect(page).toHaveURL(new RegExp(`${routePath('vip', lang)}$`));
    });

    test('has no horizontal scroll', async ({ page }) => {
      for (const width of [360, 390, 768, 1280]) {
        await page.setViewportSize({ width, height: 800 });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${width}px`).toBeLessThanOrEqual(0);
      }
    });
  });
}

test('the toggle keeps the page in the other language', async ({ page }) => {
  await page.goto(routePath('story', 'es'));
  await page.locator('[data-language-toggle] a[data-lang="en"]').click();
  await page.waitForURL(`**${routePath('story', 'en')}`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toContainText(storyEn.title.replace(/\*/g, ''));

  await page.locator('[data-language-toggle] a[data-lang="es"]').click();
  await page.waitForURL(`**${routePath('story', 'es')}`);
  await expect(page.locator('h1')).toContainText(storyEs.title.replace(/\*/g, ''));
});
