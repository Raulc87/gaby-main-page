// Gaby's calculator (US-044 AC8) against the real endpoint (LEADS_STORAGE=memory, contract v1.3
// section 11): figures -> details -> 201 -> result, in both currencies; the unanswered shares
// question blocks step 1; a failure keeps the result hidden; the concentration alert; the busy
// state; "Calculate again" stores a new row; the gold rule at the four widths; no JavaScript.
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
  chooseCurrency,
  fillDetails,
  fillFigures,
  gotoCalculator,
  visibleGoldButtons,
} from './support/calculator';

/** 4,446 available against a gap of 1,000: 4.446 months, shown as 4.4 and sent as 4.44 (rounded down). */
const ROUNDING_FIGURES = { expenses: '1000', savings: '4446', investments: '0', solidarity: '0', passive: '0' } as const;

const COPY = {
  es: { calc: esCalculator, common: esCommon, months: '4,4', money: '$20.000', gap: '$4.500' },
  en: { calc: enCalculator, common: enCommon, months: '4.4', money: '$20,000', gap: '$4,500' },
} as const;

for (const lang of ['es', 'en'] as const) {
  const { calc, common, months, money, gap } = COPY[lang];
  const alertZone = calc.result.zones.alert;

  test.describe(`calculator (${lang})`, () => {
    test('opens on Gaby\'s example figures, with the shares question unanswered', async ({ page }) => {
      await gotoCalculator(page, lang);
      await expect(page.locator('#calc-expenses')).toHaveValue(lang === 'es' ? '4.500' : '4,500');
      await expect(page.locator('#calc-savings')).toHaveValue(lang === 'es' ? '9.000' : '9,000');
      await expect(page.locator('#calc-passive')).toHaveValue('0');
      await expect(page.locator(CALC.shares)).toHaveValue('');
      await expect(page.locator(CALC.shares).locator('option').first()).toHaveText(calc.figures.shares.placeholder);
    });

    test('Backspace at the end of a formatted amount drops one digit (4.500 becomes 450)', async ({ page }) => {
      await gotoCalculator(page, lang);
      await page.locator('#calc-expenses').press('End');
      await page.locator('#calc-expenses').press('Backspace');
      await expect(page.locator('#calc-expenses')).toHaveValue('450');
    });

    test('details, then a 201, then the result; the five figures are never sent', async ({ page }) => {
      await gotoCalculator(page, lang);
      await expect(page.locator(CALC.stepQuestions)).toBeVisible();
      await expect(page.locator(CALC.stepResult)).toBeHidden();

      await answerQuestions(page, ROUNDING_FIGURES, 'from_20_to_50');
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
      expect(request.postDataJSON()).toEqual({
        name: 'Ana María Pérez Soto',
        email: 'ana.perez@example.com',
        phone: null,
        language: lang,
        consent: true,
        marketing_consent: true,
        months: 4.44,
        zone: 'alert',
        currency: 'USD',
        concentration_alert: true,
        website: '',
      });
      expect(request.postData()).not.toContain('4446');

      await expect(page.locator(CALC.stepResult)).toBeVisible();
      await expect(page.locator(CALC.number)).toHaveText(months);
      await expect(page.locator(CALC.unit)).toHaveText(calc.result.unit.many);
      await expect(page.locator(CALC.zoneLabel)).toHaveText(alertZone.label);
      await expect(page.locator(CALC.zoneTitle)).toHaveText(alertZone.title);
      await expect(page.locator(CALC.zoneBody)).toHaveText(alertZone.body);
      await expect(page.locator(CALC.zonePill)).toHaveAttribute('data-zone', 'alert');
      await expect(page.locator('#calc-result-title')).toBeFocused();
      await expect(page.getByText(calc.result.disclaimer)).toBeVisible();
    });

    test('Gaby\'s example gives 4.44 months in the alert zone, with the money and the gap in dollars', async ({ page }) => {
      await gotoCalculator(page, lang);
      await answerQuestions(page);
      await fillDetails(page);
      await page.locator(CALC.submit).click();

      await expect(page.locator(CALC.number)).toHaveText(months);
      await expect(page.locator(CALC.available)).toHaveText(money);
      await expect(page.locator(CALC.gap)).toHaveText(gap);
      await expect(page.getByText(calc.result.available)).toBeVisible();
      await expect(page.getByText(calc.result.gap)).toBeVisible();
    });

    test('in colones the figures convert at the rate, the request says CRC and the months do not change', async ({ page }) => {
      await gotoCalculator(page, lang);
      await chooseCurrency(page, 'CRC');
      await expect(page.locator('[data-currency="CRC"]')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('#calc-expenses')).toHaveValue(lang === 'es' ? '2.250.000' : '2,250,000');

      await answerQuestions(page, {}, 'from_20_to_50');
      await fillDetails(page);
      const [request] = await Promise.all([page.waitForRequest(CALCULATOR_ENDPOINT_GLOB), page.locator(CALC.submit).click()]);

      expect(request.postDataJSON()).toMatchObject({ currency: 'CRC', months: 4.44, zone: 'alert' });
      await expect(page.locator(CALC.number)).toHaveText(months);
      await expect(page.locator(CALC.available)).toHaveText(lang === 'es' ? '₡10.000.000' : '₡10,000,000');
      await expect(page.locator(CALC.gap)).toHaveText(lang === 'es' ? '₡2.250.000' : '₡2,250,000');
    });

    test('switching the currency back and forth never changes what the visitor typed', async ({ page }) => {
      await gotoCalculator(page, lang);
      await chooseCurrency(page, 'CRC');
      await page.locator('#calc-savings').fill('1250');
      await expect(page.locator('#calc-savings')).toHaveValue(lang === 'es' ? '1.250' : '1,250');
      await chooseCurrency(page, 'USD');
      await expect(page.locator('#calc-savings')).toHaveValue('3');
      await chooseCurrency(page, 'CRC');
      await expect(page.locator('#calc-savings')).toHaveValue(lang === 'es' ? '1.250' : '1,250');
    });

    test('the unanswered shares question shows its own error and blocks step 1', async ({ page }) => {
      let requests = 0;
      page.on('request', (request) => {
        if (request.url().includes('/api/')) requests += 1;
      });
      await gotoCalculator(page, lang);
      await page.locator(CALC.next).click();

      await expect(page.locator(CALC.sharesError)).toHaveText(calc.errors.shares);
      await expect(page.locator(CALC.shares)).toBeFocused();
      await expect(page.locator(CALC.stepQuestions)).toBeVisible();
      await expect(page.locator(CALC.stepDetails)).toBeHidden();
      expect(requests).toBe(0);
    });

    test('expenses of 0 or an absurdly large figure show their errors and keep the visitor on the questions', async ({ page }) => {
      await gotoCalculator(page, lang);
      await page.locator(CALC.shares).selectOption('none');
      await page.locator('#calc-expenses').fill('0');
      await page.locator(CALC.next).click();
      await expect(page.locator('#calc-expenses-error')).toHaveText(calc.errors.expenses);
      await expect(page.locator(CALC.stepQuestions)).toBeVisible();

      await fillFigures(page, { ...ALERT_FIGURES, savings: '9'.repeat(40) });
      await page.locator(CALC.next).click();
      await expect(page.locator('#calc-savings-error')).toHaveText(calc.errors.number);
      await expect(page.locator(CALC.stepQuestions)).toBeVisible();
    });

    test('the follow-up consent starts unticked and a request without it carries marketing_consent false', async ({ page }) => {
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

    test('the concentration alert shows for "between 20% and 50%" and "over 50%", and not for the other answers', async ({
      page,
    }) => {
      for (const [answer, alertShown] of [
        ['from_20_to_50', true],
        ['over_50', true],
        ['under_20', false],
        ['none', false],
      ] as const) {
        await gotoCalculator(page, lang);
        await answerQuestions(page, ALERT_FIGURES, answer);
        await fillDetails(page);
        const request = page.waitForRequest(CALCULATOR_ENDPOINT_GLOB);
        await page.locator(CALC.submit).click();

        expect((await request).postDataJSON().concentration_alert).toBe(alertShown);
        await expect(page.locator(CALC.stepResult)).toBeVisible();
        if (alertShown) {
          await expect(page.locator(CALC.alert)).toBeVisible();
          await expect(page.locator(CALC.alert)).toContainText(calc.result.alert.lead);
          await expect(page.locator(CALC.alert)).toContainText(calc.result.alert.body);
        } else {
          await expect(page.locator(CALC.alert)).toBeHidden();
        }
      }
    });

    test('the result links to the application (gold), offers "calculate again", and has no library link or email note', async ({
      page,
    }) => {
      await gotoCalculator(page, lang);
      await answerQuestions(page);
      await fillDetails(page);
      await page.locator(CALC.submit).click();
      await expect(page.locator(CALC.stepResult)).toBeVisible();

      const result = page.locator(CALC.stepResult);
      await expect(result.getByRole('link', { name: common.cta.vip_apply })).toHaveAttribute('href', routePath('vip', lang));
      await expect(result.locator(CALC.restart)).toHaveText(calc.result.restart);
      await expect(result.getByText(calc.result.nextStep.title)).toBeVisible();
      await expect(result.getByText(calc.result.nextStep.body)).toBeVisible();
      await expect(result.locator('a[href*="recursos"], a[href*="resources"]')).toHaveCount(0);
      await expect(page.getByText(calc.result.emailNote)).toHaveCount(0);
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
      await expect(page.locator(CALC.number)).toHaveText(months);
    });

    test('the button stays busy while the save runs and a second submit sends nothing (US-044 AC7)', async ({ page }) => {
      let requests = 0;
      await page.route(CALCULATOR_ENDPOINT_GLOB, async (route) => {
        requests += 1;
        await new Promise((resolve) => setTimeout(resolve, 1200)); // GoHighLevel's send can take up to 5 s
        await route.fallback();
      });

      await gotoCalculator(page, lang);
      await answerQuestions(page);
      await fillDetails(page);
      await page.locator(CALC.submit).click();

      await expect(page.locator(CALC.submit)).toBeDisabled();
      await expect(page.locator(CALC.submit)).toContainText(
        lang === 'es' ? 'Enviando' : 'Sending',
      );
      await page.locator('#calc-email').press('Enter'); // implicit submit while busy
      await expect(page.locator(CALC.stepResult)).toBeVisible();
      expect(requests).toBe(1);
      await expect(page.locator(CALC.submit)).toBeEnabled();
    });

    test('"Calculate again" returns to the questions with the figures kept; the details come back prefilled and store a new row', async ({
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
      await expect(page.locator('#calc-savings')).toHaveValue(lang === 'es' ? '9.000' : '9,000');
      await expect(page.locator(CALC.shares)).toHaveValue('from_20_to_50');

      await page.locator('#calc-savings').fill('50000');
      await page.locator(CALC.next).click();
      await expect(page.locator('#calc-name')).toHaveValue('Ana María Pérez Soto');
      await expect(page.locator(CALC.consent)).toBeChecked();

      const response = page.waitForResponse(CALCULATOR_ENDPOINT_GLOB);
      await page.locator(CALC.submit).click();
      expect((await response).status()).toBe(201);
      // 50,000 + 6,000 + 5,000 = 61,000 against 4,500: 13.55 months.
      await expect(page.locator(CALC.zonePill)).toHaveAttribute('data-zone', 'path_to_freedom');
      expect(bodies).toHaveLength(2);
      expect(bodies[1]).toMatchObject({ months: 13.55, zone: 'path_to_freedom' });
    });

    test('passive income that covers the expenses stores months null, financially free, and shows ∞', async ({ page }) => {
      await gotoCalculator(page, lang);
      await answerQuestions(page, { ...ALERT_FIGURES, passive: '4500' });
      await fillDetails(page);
      const request = page.waitForRequest(CALCULATOR_ENDPOINT_GLOB);
      await page.locator(CALC.submit).click();

      expect((await request).postDataJSON()).toMatchObject({ months: null, zone: 'financially_free' });
      await expect(page.locator(CALC.stepResult)).toBeVisible();
      await expect(page.locator(CALC.number)).toHaveText('∞');
      await expect(page.locator(CALC.unit)).toHaveText('');
      await expect(page.locator(CALC.zonePill)).toHaveAttribute('data-zone', 'financially_free');
      await expect(page.locator(CALC.zoneLabel)).toHaveText(calc.result.zones.financially_free.label);
    });

    test('a result above 1,000 months has no upper limit', async ({ page }) => {
      await gotoCalculator(page, lang);
      await answerQuestions(page, { expenses: '100', savings: '250000', investments: '50000', solidarity: '0', passive: '0' });
      await fillDetails(page);
      const response = page.waitForResponse(CALCULATOR_ENDPOINT_GLOB);
      await page.locator(CALC.submit).click();

      expect((await response).status()).toBe(201);
      await expect(page.locator(CALC.number)).toHaveText('3000');
      await expect(page.locator(CALC.zonePill)).toHaveAttribute('data-zone', 'solid_cushion');
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

  test('shows the link to apply instead of the calculator, and no library link', async ({ page }) => {
    await gotoCalculator(page, 'es');
    await expect(page.locator('#calc-root')).toBeHidden();
    await expect(page.getByRole('link', { name: esCommon.cta.vip_apply }).last()).toBeVisible();
    await expect(page.locator('main a[href*="recursos"]')).toHaveCount(0);
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
