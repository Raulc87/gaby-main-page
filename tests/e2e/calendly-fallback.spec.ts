// US-007 AC5: when the Calendly URL is not configured, the mailto fallback
// is shown instead of the widget. The container's data attribute is forced
// client-side to simulate "unset" independent of the build's actual
// PUBLIC_CALENDLY_URL (see lead-form-submission.spec.ts for why).
import { expect, test } from '@playwright/test';
import { form as enForm } from '../../src/i18n/en/form';
import { DEFAULT_CONTACT_EMAIL, fillLeadForm, gotoLang, SELECTORS } from './support/lead-form';

test('shows the mailto fallback when the Calendly URL is not configured', async ({ page }) => {
  await gotoLang(page, 'en');
  await page.evaluate(() => {
    const container = document.getElementById('calendly-container');
    if (container) container.dataset.calendlyUrl = '';
  });

  await fillLeadForm(page);
  await page.locator(SELECTORS.submitButton).click();

  await expect(page.locator(SELECTORS.successContainer)).toBeVisible();
  await expect(page.locator(SELECTORS.calendlyWidget)).toBeHidden();
  await expect(page.locator(SELECTORS.calendlyFallback)).toBeVisible();
  await expect(page.locator(SELECTORS.calendlyFallback)).toContainText(
    enForm.calendlyFallback.split('{contact_email}')[0].trim(),
  );

  const link = page.locator(`${SELECTORS.calendlyFallback} a`);
  await expect(link).toHaveAttribute('href', `mailto:${DEFAULT_CONTACT_EMAIL}`);
});
