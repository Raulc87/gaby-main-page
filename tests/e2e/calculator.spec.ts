// The calculator page (US-035) against the real endpoint (LEADS_STORAGE=memory, contract v1.2
// section 11): questions -> details -> 201 -> result; a failure keeps the result hidden;
// "Calculate again" stores a new row; the gold rule at the four widths; no JavaScript.
import { expect, test } from '@playwright/test';
import { calculator as enCalculator } from '../../src/i18n/en/calculator';
import { common as enCommon } from '../../src/i18n/en/common';
import { calculator as esCalculator } from '../../src/i18n/es/calculator';
import { common as esCommon } from '../../src/i18n/es/common';
import { routePath } from '../../src/i18n/routes';
import {
  ALERT_FIGURES,
  answerQuestions,
  CALC,
  CALCULATOR_ENDPOINT_GLOB,
  fillDetails,
  fillFigures,
  gotoCalculator,
  visibleGoldButtons,
} from './support/calculator';

const COPY = {
  es: { calc: esCalculator, common: esCommon, months: '4,4 meses' },
  en: { calc: enCalculator, common: enCommon, months: '4.4 months' },
} as const;

for (const lang of ['es', 'en'] as const) {
  const { calc, common, months } = COPY[lang];

  test.describe(`calculator (${lang})`, () => {
    test('details, then a 201, then the result; the five figures are never sent', async ({ page }) => {
      await gotoCalculator(page, lang);
      await expect(page.locator(CALC.stepQuestions)).toBeVisible();
      await expect(page.locator(CALC.stepResult)).toBeHidden();

      await answerQuestions(page);
      await expect(page.locator(CALC.stepDetails)).toBeVisible();
      await expect(page.locator(CALC.stepResult)).toBeHidden();
      await expect(page.locator('#calc-details-title')).toBeFocused();

      await fillDetails(page, { marketing: true });
      const [request, response] = await Promise.all([
        page.waitForRequest(CALCULATOR_ENDPOINT_GLOB),
        page.waitForResponse(CALCULATOR_ENDPOINT_GLOB),
        page.locator(CALC.submit).click(),
      ]);

      expect(response.status()).toBe(201);
      const body = request.postDataJSON();
      expect(body).toEqual({
        name: 'Ana María Pérez Soto',
        email: 'ana.perez@example.com',
        phone: null,
        language: lang,
        consent: true,
        marketing_consent: true,
        months: 4.4,
        zone: 'alert',
        website: '',
      });
      expect(request.postData()).not.toContain('4400');

      await expect(page.locator(CALC.stepResult)).toBeVisible();
      await expect(page.locator(CALC.months)).toHaveText(months);
      await expect(page.locator(CALC.zoneTitle)).toHaveText(calc.zones.alert.title);
      await expect(page.locator(CALC.zoneBody)).toHaveText(calc.zones.alert.body);
      await expect(page.locator(CALC.zonePill)).toHaveAttribute('data-zone', 'alert');
      await expect(page.locator('#calc-result-title')).toBeFocused();
      await expect(page.getByText(calc.result.disclaimer)).toBeVisible();
    });

    test('the follow-up consent starts unticked and a request without it carries marketing_consent false', async ({
      page,
    }) => {
      await gotoCalculator(page, lang);
      await answerQuestions(page);
      await expect(page.locator(CALC.consent)).not.toBeChecked();
      await expect(page.locator(CALC.marketing)).not.toBeChecked();

      await fillDetails(page); // ticks only the required consent
      await expect(page.locator(CALC.marketing)).not.toBeChecked();
      const request = page.waitForRequest(CALCULATOR_ENDPOINT_GLOB);
      await page.locator(CALC.submit).click();
      expect((await request).postDataJSON()).toMatchObject({ consent: true, marketing_consent: false });
    });

    test('the result links to the VIP page (gold) and the library (blue), and shows no email note', async ({ page }) => {
      await gotoCalculator(page, lang);
      await answerQuestions(page);
      await fillDetails(page);
      await page.locator(CALC.submit).click();
      await expect(page.locator(CALC.stepResult)).toBeVisible();

      const result = page.locator(CALC.stepResult);
      await expect(result.getByRole('link', { name: common.cta.vip_apply })).toHaveAttribute('href', routePath('vip', lang));
      await expect(result.getByRole('link', { name: common.cta.all_resources })).toHaveAttribute(
        'href',
        routePath('resources', lang),
      );
      await expect(page.getByText(calc.result.emailNote)).toHaveCount(0);
    });

    test('invalid figures show errors and keep the visitor on the questions', async ({ page }) => {
      await gotoCalculator(page, lang);
      await fillFigures(page, { ...ALERT_FIGURES, savings: '', debt: '-5' });
      await page.locator(CALC.next).click();

      await expect(page.locator('#calc-savings-error')).toHaveText(
        lang === 'es' ? 'Este campo es obligatorio.' : 'This field is required.',
      );
      await expect(page.locator('#calc-debt-error')).toHaveText(calc.errors.number);
      await expect(page.locator(CALC.stepQuestions)).toBeVisible();

      await fillFigures(page, { expenses: '0', debt: '0', savings: '10', investments: '0', other_income: '0' });
      await page.locator(CALC.next).click();
      await expect(page.locator('#calc-expenses-error')).toHaveText(calc.errors.no_outflow);
    });

    test('an absurdly large figure shows the error instead of doing nothing', async ({ page }) => {
      await gotoCalculator(page, lang);
      await fillFigures(page, { ...ALERT_FIGURES, savings: '9'.repeat(308) });
      await page.locator(CALC.next).click();
      await expect(page.locator('#calc-savings-error')).toHaveText(calc.errors.number);
      await expect(page.locator(CALC.stepQuestions)).toBeVisible();
    });

    test('a missing consent blocks the request', async ({ page }) => {
      let requests = 0;
      page.on('request', (request) => {
        if (request.url().includes('/api/')) requests += 1;
      });
      await gotoCalculator(page, lang);
      await answerQuestions(page);
      await fillDetails(page, { consent: false });
      await page.locator(CALC.submit).click();

      await expect(page.locator('#calc-consent-error')).not.toHaveText('');
      await expect(page.locator(CALC.stepResult)).toBeHidden();
      expect(requests).toBe(0);
    });

    test('a failed save keeps the result hidden and the data, and a retry shows it', async ({ page }) => {
      let failNext = true;
      await page.route(CALCULATOR_ENDPOINT_GLOB, (route) => {
        if (failNext) {
          failNext = false;
          return route.fulfill({
            status: 503,
            contentType: 'application/json',
            body: JSON.stringify({ success: false, message: 'x', error_code: 'storage_error', field_errors: null }),
          });
        }
        return route.fallback();
      });

      await gotoCalculator(page, lang);
      await answerQuestions(page);
      await fillDetails(page);
      await page.locator(CALC.submit).click();

      await expect(page.locator(CALC.submissionError)).toBeVisible();
      await expect(page.locator(CALC.stepResult)).toBeHidden();
      await expect(page.locator('#calc-name')).toHaveValue('Ana María Pérez Soto');

      await page.locator(CALC.submit).click();
      await expect(page.locator(CALC.stepResult)).toBeVisible();
      await expect(page.locator(CALC.months)).toHaveText(months);
    });

    test('"Calculate again" returns to the questions; the details come back prefilled and store a new row', async ({
      page,
    }) => {
      const bodies: Array<Record<string, unknown>> = [];
      page.on('request', (request) => {
        if (request.url().includes('/api/save-calculator-lead')) bodies.push(request.postDataJSON());
      });

      await gotoCalculator(page, lang);
      await answerQuestions(page);
      await fillDetails(page);
      await page.locator(CALC.submit).click();
      await expect(page.locator(CALC.stepResult)).toBeVisible();

      await page.locator(CALC.restart).click();
      await expect(page.locator(CALC.stepQuestions)).toBeVisible();
      await expect(page.locator(CALC.stepResult)).toBeHidden();

      await fillFigures(page, { ...ALERT_FIGURES, savings: '9000' });
      await page.locator(CALC.next).click();
      await expect(page.locator('#calc-name')).toHaveValue('Ana María Pérez Soto');
      await expect(page.locator(CALC.consent)).toBeChecked();

      const response = page.waitForResponse(CALCULATOR_ENDPOINT_GLOB);
      await page.locator(CALC.submit).click();
      expect((await response).status()).toBe(201);
      await expect(page.locator(CALC.zonePill)).toHaveAttribute('data-zone', 'building');
      expect(bodies).toHaveLength(2);
      expect(bodies[1]).toMatchObject({ months: 9, zone: 'building' });
    });

    test('other income that covers the outgoings stores months null in the freedom zone', async ({ page }) => {
      await gotoCalculator(page, lang);
      await answerQuestions(page, { ...ALERT_FIGURES, other_income: '1500' });
      await fillDetails(page);
      const request = page.waitForRequest(CALCULATOR_ENDPOINT_GLOB);
      await page.locator(CALC.submit).click();

      expect((await request).postDataJSON()).toMatchObject({ months: null, zone: 'freedom' });
      await expect(page.locator(CALC.stepResult)).toBeVisible();
      await expect(page.locator(CALC.months)).toHaveText(calc.result.covered);
      await expect(page.locator(CALC.zonePill)).toHaveAttribute('data-zone', 'freedom');
    });

    test('a result above 1,000 months has no upper limit', async ({ page }) => {
      await gotoCalculator(page, lang);
      await answerQuestions(page, { expenses: '100', debt: '0', savings: '250000', investments: '50000', other_income: '0' });
      await fillDetails(page);
      const response = page.waitForResponse(CALCULATOR_ENDPOINT_GLOB);
      await page.locator(CALC.submit).click();

      expect((await response).status()).toBe(201);
      await expect(page.locator(CALC.months)).toHaveText(lang === 'es' ? '3000,0 meses' : '3000.0 months');
    });

    test('the honeypot value is sent from the field outside the visible forms', async ({ page }) => {
      await gotoCalculator(page, lang);
      await answerQuestions(page);
      await fillDetails(page);
      await page.locator(CALC.honeypot).evaluate((el: HTMLInputElement) => {
        el.value = 'bot';
      });
      const request = page.waitForRequest(CALCULATOR_ENDPOINT_GLOB);
      await page.locator(CALC.submit).click();
      expect((await request).postDataJSON().website).toBe('bot');
    });
  });
}

test.describe('calculator without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('shows the VIP and library links instead of the calculator', async ({ page }) => {
    await gotoCalculator(page, 'es');
    await expect(page.locator('#calc-root')).toBeHidden();
    await expect(page.getByRole('link', { name: esCommon.cta.vip_apply }).last()).toBeVisible();
    await expect(page.getByRole('link', { name: esCommon.cta.all_resources }).first()).toBeVisible();
  });
});

for (const width of [360, 390, 768, 1280]) {
  test(`at ${width} px: no horizontal scroll and at most one gold button on every step`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await gotoCalculator(page, 'es');

    const noOverflow = async () =>
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await noOverflow();
    expect(await visibleGoldButtons(page)).toBe(0);

    await answerQuestions(page);
    await noOverflow();
    expect(await visibleGoldButtons(page)).toBe(0);

    await fillDetails(page);
    await page.locator(CALC.submit).click();
    await expect(page.locator(CALC.stepResult)).toBeVisible();
    await noOverflow();
    expect(await visibleGoldButtons(page)).toBe(1);
  });
}
