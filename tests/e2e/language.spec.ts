// ADR-003 / US-010: browser-language detection on `/`, and the toggle
// switching language while keeping the in-page anchor.
import { expect, test } from '@playwright/test';

test.describe('browser-language detection on /', () => {
  test.use({ locale: 'es-CR' });
  test('redirects an es-CR visitor to /es/', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL('**/es/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });
});

test.describe('browser-language detection on /', () => {
  test.use({ locale: 'en-US' });
  test('redirects an en-US visitor to /en/', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL('**/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});

test('the toggle switches language and keeps the current anchor', async ({ page }) => {
  await page.goto('/es/#roadmap');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');

  await page.locator('[data-language-toggle] a[data-lang="en"]').click();

  await page.waitForURL('**/en/#roadmap');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.locator('[data-language-toggle] a[data-lang="es"]').click();

  await page.waitForURL('**/es/#roadmap');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});
