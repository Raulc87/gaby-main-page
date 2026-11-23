// Happy path against the real backend (LEADS_STORAGE=memory): 201 ->
// thank-you -> inline booking calendar (US-004, US-007, US-037). Both GoHighLevel
// hosts are stubbed (stubScheduler) so the calendar's "loaded" state is deterministic
// and CI never makes a request to GoHighLevel.
import { expect, test } from '@playwright/test';
import { form as esForm } from '../../src/i18n/es/form';
import { fillLeadForm, gotoVip, GHL_HOSTS, SELECTORS, setSchedulerUrl, STUB_SCHEDULER_URL, stubScheduler } from './support/lead-form';

test('the calendar is not loaded before a successful submission', async ({ page }) => {
  const stubbed = await stubScheduler(page);
  await gotoVip(page, 'es');

  await expect(page.locator(SELECTORS.schedulerWidget)).toBeHidden();
  expect(await page.locator('iframe').count()).toBe(0);
  for (const host of GHL_HOSTS) expect(await page.locator(`script[src*="${host}"]`).count()).toBe(0);
  expect(stubbed).toEqual([]);
});

test('a valid submission saves, shows the thank-you message, and reveals the calendar with the details prefilled', async ({
  page,
}) => {
  const stubbed = await stubScheduler(page);
  await gotoVip(page, 'es');
  await setSchedulerUrl(page, STUB_SCHEDULER_URL);

  await fillLeadForm(page);
  await page.locator(SELECTORS.submitButton).click();

  await expect(page.locator(SELECTORS.formContainer)).toBeHidden();
  await expect(page.locator(SELECTORS.successContainer)).toBeVisible();
  await expect(page.getByRole('heading', { name: esForm.thankYou.title })).toBeVisible();

  await expect(page.locator(SELECTORS.schedulerWidget)).toBeVisible();
  await expect(page.locator(SELECTORS.schedulerWidget).locator('iframe')).toHaveCount(1);
  await expect(page.locator(SELECTORS.schedulerFallback)).toBeHidden();
  await expect(page.locator('script[src="https://link.msgsndr.com/js/form_embed.js"]')).toHaveCount(1);

  // US-037 AC2: the details go to the calendar as the query parameters it reads (verified against
  // the live widget): first and last name, email and phone. Nothing else.
  const src = await page.locator(`${SELECTORS.schedulerWidget} iframe`).getAttribute('src');
  const url = new URL(src ?? '');
  expect(url.origin + url.pathname).toBe(STUB_SCHEDULER_URL);
  expect(Object.fromEntries(url.searchParams)).toEqual({
    first_name: 'Ana María',
    last_name: 'Pérez Soto',
    email: 'ana.perez@example.com',
    phone: '+50684104791',
  });
  expect(stubbed.some((u) => u.includes('/widget/booking/'))).toBe(true);
});
