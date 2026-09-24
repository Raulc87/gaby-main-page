// Happy path against the real backend (LEADS_STORAGE=memory): 201 ->
// thank-you -> inline Calendly (US-004, US-007). The Calendly CDN script is
// mocked so the widget's "rendered" state is deterministic and offline-safe
// (see startScheduling's MutationObserver in schedulingController.ts),
// rather than depending on real network access to assets.calendly.com.
import { expect, test } from '@playwright/test';
import { form as esForm } from '../../src/i18n/es/form';
import { fillLeadForm, gotoLang, SELECTORS } from './support/lead-form';

/** Makes the mocked Calendly script populate every widget with a fake iframe, simulating a successful embed. */
async function mockCalendlyScript(page: import('@playwright/test').Page): Promise<void> {
  await page.route('https://assets.calendly.com/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `
        document.querySelectorAll('.calendly-inline-widget').forEach((el) => {
          const iframe = document.createElement('iframe');
          iframe.src = 'about:blank';
          el.appendChild(iframe);
        });
      `,
    }),
  );
}

/** Forces a specific Calendly URL on the container regardless of the build's PUBLIC_CALENDLY_URL, so this suite is independent of that env var. */
async function setCalendlyUrl(page: import('@playwright/test').Page, url: string): Promise<void> {
  await page.evaluate((value) => {
    const container = document.getElementById('calendly-container');
    if (container) container.dataset.calendlyUrl = value;
  }, url);
}

test('Calendly is not loaded before a successful submission', async ({ page }) => {
  await gotoLang(page, 'es');

  await expect(page.locator(SELECTORS.calendlyWidget)).toBeHidden();
  expect(await page.locator('script[src*="calendly.com"]').count()).toBe(0);
});

test('a valid submission saves, shows the thank-you message, and reveals Calendly', async ({ page }) => {
  await gotoLang(page, 'es');
  await mockCalendlyScript(page);
  await setCalendlyUrl(page, 'https://calendly.com/test-account/intro-call');

  await fillLeadForm(page);
  await page.locator(SELECTORS.submitButton).click();

  await expect(page.locator(SELECTORS.formContainer)).toBeHidden();
  await expect(page.locator(SELECTORS.successContainer)).toBeVisible();
  await expect(page.getByRole('heading', { name: esForm.thankYou.title })).toBeVisible();

  await expect(page.locator(SELECTORS.calendlyWidget)).toBeVisible();
  await expect(page.locator(SELECTORS.calendlyWidget).locator('iframe')).toHaveCount(1);
  await expect(page.locator(SELECTORS.calendlyFallback)).toBeHidden();

  // US-007 AC3: name/email pre-filled into the Calendly URL.
  const widgetUrl = await page
    .locator(`${SELECTORS.calendlyWidget} .calendly-inline-widget`)
    .getAttribute('data-url');
  const prefilled = new URL(widgetUrl ?? '', 'https://example.invalid');
  expect(prefilled.searchParams.get('email')).toBe('ana.perez@example.com');
  expect(prefilled.searchParams.get('name')).toBe('Ana María Pérez Soto');
});
