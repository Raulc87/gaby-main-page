// US-007 AC5, US-037 AC3: when the scheduler URL is not configured, the embed script
// fails, or the calendar does not appear within 10 seconds, the mailto fallback
// is shown instead of the widget. (First case:) The container's data attribute is forced
// client-side to simulate "unset" independent of the build's actual
// PUBLIC_SCHEDULER_URL (see lead-form-submission.spec.ts for why).
import { expect, test } from '@playwright/test';
import { form as enForm } from '../../src/i18n/en/form';
import {
  DEFAULT_CONTACT_EMAIL,
  fillLeadForm,
  gotoVip,
  SELECTORS,
  setSchedulerUrl,
  STUB_SCHEDULER_URL,
  stubScheduler,
} from './support/lead-form';

test('shows the mailto fallback when the scheduler URL is not configured', async ({ page }) => {
  await gotoVip(page, 'en');
  await page.evaluate(() => {
    const container = document.getElementById('scheduler-container');
    if (container) container.dataset.schedulerUrl = '';
  });

  await fillLeadForm(page);
  await page.locator(SELECTORS.submitButton).click();

  await expect(page.locator(SELECTORS.successContainer)).toBeVisible();
  await expect(page.locator(SELECTORS.schedulerWidget)).toBeHidden();
  await expect(page.locator(SELECTORS.schedulerFallback)).toBeVisible();
  await expect(page.locator(SELECTORS.schedulerFallback)).toContainText(
    enForm.schedulerFallback.split('{contact_email}')[0].trim(),
  );

  const link = page.locator(`${SELECTORS.schedulerFallback} a`);
  await expect(link).toHaveAttribute('href', `mailto:${DEFAULT_CONTACT_EMAIL}`);
});

test('shows the fallback when the embed script cannot be loaded', async ({ page }) => {
  await page.route('https://api.leadconnectorhq.com/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<script>parent.postMessage(["highlevel.setHeight",{height:830}],"*")</script>',
    }),
  );
  await page.route('https://link.msgsndr.com/**', (route) => route.abort());
  await gotoVip(page, 'en');
  await setSchedulerUrl(page, STUB_SCHEDULER_URL);

  await fillLeadForm(page);
  await page.locator(SELECTORS.submitButton).click();

  await expect(page.locator(SELECTORS.schedulerFallback)).toBeVisible();
  await expect(page.locator(SELECTORS.schedulerWidget)).toBeHidden();
  await expect(page.locator(`${SELECTORS.schedulerFallback} a`)).toHaveAttribute('href', `mailto:${DEFAULT_CONTACT_EMAIL}`);
});

test('shows the fallback when nothing appears within 10 seconds, and not before', async ({ page }) => {
  await page.clock.install();
  await stubScheduler(page);
  // The calendar never answers.
  await page.route('https://api.leadconnectorhq.com/**', () => {});
  await gotoVip(page, 'en');
  await setSchedulerUrl(page, STUB_SCHEDULER_URL);

  await fillLeadForm(page);
  await page.locator(SELECTORS.submitButton).click();
  await expect(page.locator(SELECTORS.schedulerWidget)).toBeVisible();

  await page.clock.fastForward(9_000);
  await expect(page.locator(SELECTORS.schedulerFallback)).toBeHidden();

  await page.clock.fastForward(2_000);
  await expect(page.locator(SELECTORS.schedulerFallback)).toBeVisible();
  await expect(page.locator(SELECTORS.schedulerWidget)).toBeHidden();
});

test('shows the fallback for a calendar URL that is not https', async ({ page }) => {
  const stubbed = await stubScheduler(page);
  await gotoVip(page, 'en');
  await setSchedulerUrl(page, 'http://api.leadconnectorhq.com/widget/booking/TESTWIDGETID');

  await fillLeadForm(page);
  await page.locator(SELECTORS.submitButton).click();

  await expect(page.locator(SELECTORS.schedulerFallback)).toBeVisible();
  expect(stubbed).toEqual([]);
});

test('shows the fallback when the calendar page is an error page, although the iframe fires load', async ({ page }) => {
  await page.clock.install();
  await stubScheduler(page);
  // The widget answers with an error page that never posts a message. The browser fires the
  // iframe's load for it, which the first version of the readiness check took for success.
  await page.route('https://api.leadconnectorhq.com/**', (route) =>
    route.fulfill({ status: 404, contentType: 'text/html', body: '<!doctype html><title>Not found</title><p>404</p>' }),
  );
  await gotoVip(page, 'en');
  await setSchedulerUrl(page, STUB_SCHEDULER_URL);

  await fillLeadForm(page);
  await page.locator(SELECTORS.submitButton).click();
  await expect(page.locator(SELECTORS.schedulerWidget)).toBeVisible();

  await page.clock.fastForward(11_000);
  await expect(page.locator(SELECTORS.schedulerFallback)).toBeVisible();
  await expect(page.locator(SELECTORS.schedulerWidget)).toBeHidden();
  await expect(page.locator(`${SELECTORS.schedulerFallback} a`)).toHaveAttribute('href', `mailto:${DEFAULT_CONTACT_EMAIL}`);
});
