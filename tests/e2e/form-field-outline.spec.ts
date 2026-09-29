// US-015 AC6 (UX_UI_DIRECTION.md v0.7 section 2.1, "Form" and the
// `field-line` token row): form control borders must use `field-line`
// (#7D8BA0, computed rgb(125, 139, 160)) rather than the decorative `line`
// token (#D8DFE9), which only reaches 1.3:1 and is not a valid control
// boundary (WCAG 1.4.11 needs 3:1). Asserts the computed boundary color so a
// regression back to `line` fails this test rather than only showing up as
// a visual nit.
import { expect, test } from '@playwright/test';
import { fillLeadForm, gotoLang, screeningOption, SELECTORS, VALID_LEAD } from './support/lead-form';

const FIELD_LINE_RGB = 'rgb(125, 139, 160)';
const BRAND_RGB = 'rgb(60, 95, 142)';

async function borderColorOf(page: import('@playwright/test').Page, selector: string): Promise<string> {
  return page.$eval(selector, (el) => getComputedStyle(el).borderColor);
}

/**
 * Chromium's native, appearance:auto checkbox widget ignores author
 * `border-width`/`border-color` (computed border stays 0px/none
 * regardless), so ConsentField.astro gives it a field-line `outline`
 * instead (see the comment there). Checked via `outline-color`, not
 * `border-color`.
 */
async function outlineColorOf(page: import('@playwright/test').Page, selector: string): Promise<string> {
  return page.$eval(selector, (el) => getComputedStyle(el).outlineColor);
}

test.describe('form control borders use field-line (US-015 AC6)', () => {
  test('name, email and phone inputs use field-line', async ({ page }) => {
    await gotoLang(page, 'es');

    expect(await borderColorOf(page, SELECTORS.nameInput)).toBe(FIELD_LINE_RGB);
    expect(await borderColorOf(page, SELECTORS.emailInput)).toBe(FIELD_LINE_RGB);
    expect(await borderColorOf(page, SELECTORS.phoneInput)).toBe(FIELD_LINE_RGB);
  });

  test('an unselected screening option row uses field-line; the selected row uses brand', async ({ page }) => {
    await gotoLang(page, 'es');

    const unselectedRow = `${screeningOption('exploring')} >> xpath=ancestor::label`;
    await expect.poll(() => borderColorOf(page, unselectedRow)).toBe(FIELD_LINE_RGB);

    await page.locator(screeningOption(VALID_LEAD.screeningCode)).check();
    const selectedRow = `${screeningOption(VALID_LEAD.screeningCode)} >> xpath=ancestor::label`;
    // The row's `transition-colors` class animates the border between
    // field-line and brand; poll past the transition instead of racing it.
    await expect.poll(() => borderColorOf(page, selectedRow)).toBe(BRAND_RGB);

    // The row that lost selection goes back to field-line, not the
    // decorative (and under-contrast) `line` token.
    await expect.poll(() => borderColorOf(page, unselectedRow)).toBe(FIELD_LINE_RGB);
  });

  test('the consent checkbox uses a field-line outline without shrinking its 44 px touch target', async ({
    page,
  }) => {
    await gotoLang(page, 'es');

    expect(await outlineColorOf(page, SELECTORS.consentCheckbox)).toBe(FIELD_LINE_RGB);

    // The touch target is the label wrapping the checkbox (US-008 AC2), not
    // the 16 px checkbox itself.
    const labelBox = await page.locator(SELECTORS.consentCheckbox).locator('xpath=ancestor::label').boundingBox();
    expect(labelBox).not.toBeNull();
    if (labelBox) {
      expect(labelBox.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('field-line borders are visible at 390 px too', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoLang(page, 'es');
    await fillLeadForm(page);

    expect(await borderColorOf(page, SELECTORS.nameInput)).toBe(FIELD_LINE_RGB);
    expect(await outlineColorOf(page, SELECTORS.consentCheckbox)).toBe(FIELD_LINE_RGB);
  });
});
