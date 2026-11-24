// The calculator's three steps (US-044): the result appears only after a successful save, a failed
// save keeps it hidden, preview builds send nothing, the five figures are never sent, the busy state
// stops a double submit, the currency switch converts from the typed amounts, and "Calculate again"
// returns to the questions with the figures and the details kept.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initCalculator } from '../../../src/components/calculator/calculatorController';
import { submitCalculatorLead, type SubmitLeadResult } from '../../../src/lib/lead/api';

vi.mock('../../../src/lib/lead/api', () => ({ submitCalculatorLead: vi.fn() }));

const ZONES = {
  critical: { label: 'Zona crítica', title: 'Crítica.', body: 'Menos de tres meses.' },
  alert: { label: 'Zona de alerta', title: 'Tenés un colchón, pero es delgado.', body: 'Unos meses.' },
  building: { label: 'Base en construcción', title: 'Vas bien.', body: 'Una base real.' },
  path_to_freedom: { label: 'Camino a la libertad', title: 'Margen.', body: 'Libertad.' },
  solid_cushion: { label: 'Colchón sólido', title: 'Años.', body: 'Más de tres años.' },
  financially_free: { label: 'Libre financieramente', title: 'Cubierto.', body: 'Ganaste el juego.' },
};

const COPY = {
  language: 'es',
  endpoint: '/api/save-calculator-lead',
  contactEmail: 'gkelly@poliartcr.com',
  crcPerUsd: 500,
  figureErrors: { expenses: 'Escribí los gastos.', number: 'Número.', shares: 'Elegí una opción de acciones.' },
  fieldErrors: { required: 'Obligatorio.', consent_required: 'Falta el consentimiento.' },
  submit: { idle: 'Ver mi resultado', submitting: 'Enviando…' },
  submissionError: { before: 'Error, escribé a ', after: '.' },
  rateLimited: { before: 'Esperá, escribí a ', after: '.' },
  zones: ZONES,
  unit: { one: 'mes', many: 'meses' },
};

const FIGURES = ['expenses', 'savings', 'investments', 'solidarity', 'passive'];

function mount(preview = false): HTMLElement {
  document.body.innerHTML = '';
  const root = document.createElement('div');
  root.hidden = true;
  root.dataset.copy = JSON.stringify({ ...COPY, preview });
  const figures = FIGURES.map(
    (k) => `<span data-currency-symbol></span><input id="calc-${k}" /><p id="calc-${k}-error"></p>`,
  ).join('');
  root.innerHTML = `
    <form id="calc-hp-form"><input id="calc-hp" /></form>
    <div id="calc-step-questions"><h2 id="calc-questions-title" tabindex="-1"></h2>
      <button type="button" data-currency="USD" aria-pressed="true">USD</button>
      <button type="button" data-currency="CRC" aria-pressed="false">Colones</button>
      <form id="calc-questions-form">${figures}
        <select id="calc-shares"><option value="">Elegí una opción</option>
          <option value="none">none</option><option value="under_20">under_20</option>
          <option value="from_20_to_50">from_20_to_50</option><option value="over_50">over_50</option></select>
        <p id="calc-shares-error"></p>
        <button type="submit">next</button></form></div>
    <div id="calc-step-details" hidden><h2 id="calc-details-title" tabindex="-1"></h2>
      <form id="calc-details-form">
        <input id="calc-name" /><p id="calc-name-error"></p>
        <input id="calc-email" /><p id="calc-email-error"></p>
        <input id="calc-phone" /><p id="calc-phone-error"></p>
        <input id="calc-consent" type="checkbox" /><p id="calc-consent-error"></p>
        <input id="calc-marketing" type="checkbox" />
        <p id="calc-submission-error" hidden></p>
        <button id="calc-submit" type="submit">Ver mi resultado</button>
      </form></div>
    <div id="calc-step-result" hidden><h2 id="calc-result-title" tabindex="-1"></h2>
      <p id="calc-result-months"><span id="calc-result-number"></span><span id="calc-result-unit"></span></p>
      <p id="calc-zone-pill" data-zone="alert"><span id="calc-zone-label"></span></p>
      <span id="calc-gauge-marker"></span>
      <h3 id="calc-zone-title"></h3><p id="calc-zone-body"></p>
      <span id="calc-available-amount"></span><span id="calc-gap-amount"></span>
      <p id="calc-alert" hidden></p>
      <button id="calc-restart" type="button">again</button></div>`;
  document.body.append(root);
  initCalculator(root);
  return root;
}

const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const submit = (selector: string) => $<HTMLFormElement>(selector).dispatchEvent(new Event('submit', { cancelable: true }));
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const visible = (selector: string) => !$(selector).hidden;
const value = (selector: string) => $<HTMLInputElement>(selector).value;

/** Types into a field the way a visitor does: sets the value and fires `input`. */
function type(id: string, text: string) {
  const field = $<HTMLInputElement>(id);
  field.value = text;
  field.dispatchEvent(new Event('input', { bubbles: true }));
}
function chooseShares(answer: string) {
  $<HTMLSelectElement>('#calc-shares').value = answer;
}
function fillDetails({ consent = true, marketing = false } = {}) {
  $<HTMLInputElement>('#calc-name').value = 'Ana María Pérez Soto';
  $<HTMLInputElement>('#calc-email').value = 'ana.perez@example.com';
  $<HTMLInputElement>('#calc-consent').checked = consent;
  $<HTMLInputElement>('#calc-marketing').checked = marketing;
}
/** Gaby's example figures stay in the fields; the visitor only answers the shares question. */
function calculateWithExamples(shares = 'from_20_to_50') {
  chooseShares(shares);
  submit('#calc-questions-form');
}
async function saveResult(shares?: string, details?: Parameters<typeof fillDetails>[0]) {
  calculateWithExamples(shares);
  fillDetails(details);
  submit('#calc-details-form');
  await flush();
}

beforeEach(() => {
  vi.mocked(submitCalculatorLead).mockReset();
  vi.mocked(submitCalculatorLead).mockResolvedValue({ kind: 'success' });
});

describe('the questions step', () => {
  it('reveals the card and opens on Gaby\'s example figures, in USD, with the shares question unanswered', () => {
    const root = mount();
    expect(root.hidden).toBe(false);
    expect(visible('#calc-step-questions')).toBe(true);
    expect(visible('#calc-step-details')).toBe(false);
    expect([...FIGURES].map((k) => value(`#calc-${k}`))).toEqual(['4.500', '9.000', '6.000', '5.000', '0']);
    expect($('[data-currency-symbol]').textContent).toBe('$');
    expect($<HTMLSelectElement>('#calc-shares').value).toBe('');
  });

  it('the unanswered shares question shows its own error and nothing goes on', () => {
    mount();
    submit('#calc-questions-form');
    expect($('#calc-shares-error').textContent).toBe('Elegí una opción de acciones.');
    expect($('#calc-shares').getAttribute('aria-invalid')).toBe('true');
    expect(visible('#calc-step-questions')).toBe(true);
    expect(submitCalculatorLead).not.toHaveBeenCalled();
  });

  it.each(['', '0'])('expenses of "%s" show the expenses error', (text) => {
    mount();
    chooseShares('none');
    type('#calc-expenses', text);
    submit('#calc-questions-form');
    expect($('#calc-expenses-error').textContent).toBe('Escribí los gastos.');
    expect(visible('#calc-step-questions')).toBe(true);
  });

  it('shows an error, and does not stall silently, for an absurdly large figure', () => {
    mount();
    chooseShares('none');
    type('#calc-savings', '9'.repeat(30));
    submit('#calc-questions-form');
    expect($('#calc-savings-error').textContent).toBe('Número.');
    expect(visible('#calc-step-questions')).toBe(true);
  });

  it('shows thousands separators while the visitor types, and keeps only digits', () => {
    mount();
    type('#calc-savings', '1234567');
    expect(value('#calc-savings')).toBe('1.234.567');
    type('#calc-savings', 'abc12');
    expect(value('#calc-savings')).toBe('12');
    type('#calc-savings', '');
    expect(value('#calc-savings')).toBe('');
  });

  it('an empty field other than the expenses counts as 0', async () => {
    mount();
    type('#calc-savings', '');
    type('#calc-investments', '');
    type('#calc-solidarity', '');
    await saveResult('none');
    // available 0, gap 4,500: critical, 0 months.
    expect(vi.mocked(submitCalculatorLead).mock.calls[0][0]).toMatchObject({ months: 0, zone: 'critical' });
  });
});

describe('the currency switch', () => {
  const crc = () => $<HTMLButtonElement>('[data-currency="CRC"]');
  const usd = () => $<HTMLButtonElement>('[data-currency="USD"]');

  it('converts the example figures at the rate and changes the symbol and the pressed button', () => {
    mount();
    crc().click();
    expect([...FIGURES].map((k) => value(`#calc-${k}`))).toEqual(['2.250.000', '4.500.000', '3.000.000', '2.500.000', '0']);
    expect($('[data-currency-symbol]').textContent).toBe('₡');
    expect(crc().getAttribute('aria-pressed')).toBe('true');
    expect(usd().getAttribute('aria-pressed')).toBe('false');
  });

  it('₡1,250 → USD → CRC gives ₡1,250 again: it converts from what was typed, not from the rounded value', () => {
    mount();
    crc().click();
    type('#calc-savings', '1250');
    usd().click();
    expect(value('#calc-savings')).toBe('3');
    crc().click();
    expect(value('#calc-savings')).toBe('1.250');
    usd().click();
    crc().click();
    expect(value('#calc-savings')).toBe('1.250');
  });

  it('calculates and sends the chosen currency, from the amounts the fields show', async () => {
    mount();
    crc().click(); // the example figures, in colones: the same months
    await saveResult('from_20_to_50');
    expect(vi.mocked(submitCalculatorLead).mock.calls[0][0]).toMatchObject({ currency: 'CRC', months: 4.44, zone: 'alert' });
    expect($('#calc-available-amount').textContent).toBe('₡10.000.000');
    expect($('#calc-gap-amount').textContent).toBe('₡2.250.000');
  });
});

describe('the details step and the save', () => {
  it('goes to the details step, then shows the result only after a 201', async () => {
    mount();
    calculateWithExamples();
    expect(visible('#calc-step-details')).toBe(true);
    expect(visible('#calc-step-result')).toBe(false);
    expect(document.activeElement).toBe($('#calc-details-title'));

    fillDetails({ marketing: true });
    submit('#calc-details-form');
    expect(visible('#calc-step-result')).toBe(false); // not yet: the save is pending
    await flush();

    expect(visible('#calc-step-result')).toBe(true);
    expect(document.activeElement).toBe($('#calc-result-title'));
    expect($('#calc-result-number').textContent).toBe('4,4');
    expect($('#calc-result-unit').textContent).toBe('meses');
    expect($('#calc-zone-pill').dataset.zone).toBe('alert');
    expect($('#calc-zone-label').textContent).toBe('Zona de alerta');
    expect($('#calc-zone-title').textContent).toBe('Tenés un colchón, pero es delgado.');
    expect($('#calc-available-amount').textContent).toBe('$20.000');
    expect($('#calc-gap-amount').textContent).toBe('$4.500');
    expect($('#calc-gauge-marker').style.left).toBe('18.5%'); // 4.44 months, on the first stretch (0 to 6) of the scale
  });

  it('sends exactly the fields of contract v1.3 section 11.2, never the figures', async () => {
    mount();
    calculateWithExamples();
    fillDetails({ marketing: true });
    submit('#calc-details-form');
    await flush();

    const [payload, endpoint] = vi.mocked(submitCalculatorLead).mock.calls[0];
    expect(endpoint).toBe('/api/save-calculator-lead');
    expect(payload).toEqual({
      name: 'Ana María Pérez Soto',
      email: 'ana.perez@example.com',
      phone: null,
      language: 'es',
      consent: true,
      marketing_consent: true,
      months: 4.44,
      zone: 'alert',
      currency: 'USD',
      concentration_alert: true,
      website: '',
    });
    const body = JSON.stringify(payload);
    for (const figure of ['4500', '9000', '6000', '5000', '20000']) expect(body).not.toContain(figure);
  });

  it('starts with the optional follow-up consent unticked and sends marketing_consent false by default', async () => {
    mount();
    expect($<HTMLInputElement>('#calc-marketing').checked).toBe(false);
    await saveResult();
    expect(vi.mocked(submitCalculatorLead).mock.calls[0][0].marketing_consent).toBe(false);
  });

  it.each([
    ['none', false],
    ['under_20', false],
    ['from_20_to_50', true],
    ['over_50', true],
  ])('the shares answer "%s" sends concentration_alert %s and shows the alert accordingly', async (answer, alert) => {
    mount();
    await saveResult(answer);
    expect(vi.mocked(submitCalculatorLead).mock.calls[0][0].concentration_alert).toBe(alert);
    expect($('#calc-alert').hidden).toBe(!alert);
  });

  it('sends the honeypot value from the field outside the visible forms', async () => {
    mount();
    $<HTMLInputElement>('#calc-hp').value = 'bot';
    await saveResult();
    expect(vi.mocked(submitCalculatorLead).mock.calls[0][0].website).toBe('bot');
  });

  it('shows ∞, no unit and the financially free zone, with months null, when passive income covers the expenses', async () => {
    mount();
    type('#calc-passive', '4500');
    await saveResult();
    expect(vi.mocked(submitCalculatorLead).mock.calls[0][0]).toMatchObject({ months: null, zone: 'financially_free' });
    expect($('#calc-result-number').textContent).toBe('∞');
    expect($('#calc-result-unit').textContent).toBe('');
    expect($('#calc-zone-pill').dataset.zone).toBe('financially_free');
    expect($('#calc-gap-amount').textContent).toBe('$0');
    expect($('#calc-gauge-marker').style.left).toBe('100%');
  });

  it('writes "mes" for exactly one month', async () => {
    mount();
    type('#calc-savings', '4500');
    type('#calc-investments', '0');
    type('#calc-solidarity', '0');
    await saveResult();
    expect($('#calc-result-number').textContent).toBe('1');
    expect($('#calc-result-unit').textContent).toBe('mes');
  });

  it('keeps the button busy while the save runs, and cannot submit twice (US-044 AC7)', async () => {
    mount();
    let finish!: (outcome: SubmitLeadResult) => void;
    vi.mocked(submitCalculatorLead).mockReturnValue(new Promise((resolve) => (finish = resolve)));
    calculateWithExamples();
    fillDetails();
    submit('#calc-details-form');

    const button = $<HTMLButtonElement>('#calc-submit');
    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe('Enviando…');
    expect($('#calc-details-form').hasAttribute('aria-busy')).toBe(true);
    submit('#calc-details-form'); // Enter in a field, or a second click
    expect(submitCalculatorLead).toHaveBeenCalledTimes(1);

    finish({ kind: 'success' });
    await flush();
    expect(button.disabled).toBe(false);
    expect(button.textContent).toBe('Ver mi resultado');
    expect(visible('#calc-step-result')).toBe(true);
  });

  it.each<[string, SubmitLeadResult, string]>([
    ['a generic error', { kind: 'generic_error' }, 'Error, escribé a '],
    ['a rate limit', { kind: 'rate_limited' }, 'Esperá, escribí a '],
  ])('keeps the result hidden and shows the message on %s', async (_name, outcome, text) => {
    mount();
    vi.mocked(submitCalculatorLead).mockResolvedValue(outcome);
    await saveResult();

    expect(visible('#calc-step-result')).toBe(false);
    expect(visible('#calc-step-details')).toBe(true);
    expect($('#calc-submission-error').hidden).toBe(false);
    expect($('#calc-submission-error').textContent).toContain(text);
    expect($<HTMLButtonElement>('#calc-submit').disabled).toBe(false);
  });

  it('maps a 422 to the fields and still hides the result', async () => {
    mount();
    vi.mocked(submitCalculatorLead).mockResolvedValue({ kind: 'validation_error', fieldErrors: { email: 'required' } });
    await saveResult();
    expect($('#calc-email-error').textContent).toBe('Obligatorio.');
    expect(visible('#calc-step-result')).toBe(false);
  });

  it('does not call the API when the consent is missing', async () => {
    mount();
    await saveResult(undefined, { consent: false });
    expect(submitCalculatorLead).not.toHaveBeenCalled();
    expect($('#calc-consent-error').textContent).toBe('Falta el consentimiento.');
  });

  it('preview builds show the result and send nothing', async () => {
    mount(true);
    await saveResult();
    expect(submitCalculatorLead).not.toHaveBeenCalled();
    expect(visible('#calc-step-result')).toBe(true);
  });
});

describe('"Calculate again"', () => {
  it('returns to the questions with the figures kept; the details come back prefilled and store a new row', async () => {
    mount();
    type('#calc-savings', '12345');
    await saveResult('under_20');

    $('#calc-restart').click();
    expect(visible('#calc-step-questions')).toBe(true);
    expect(visible('#calc-step-result')).toBe(false);
    expect(value('#calc-savings')).toBe('12.345');
    expect($<HTMLSelectElement>('#calc-shares').value).toBe('under_20');

    type('#calc-savings', '9000');
    chooseShares('over_50');
    submit('#calc-questions-form');
    expect(visible('#calc-step-details')).toBe(true);
    expect(value('#calc-name')).toBe('Ana María Pérez Soto');
    expect($<HTMLInputElement>('#calc-consent').checked).toBe(true);

    submit('#calc-details-form');
    await flush();
    expect(submitCalculatorLead).toHaveBeenCalledTimes(2);
    // 9,000 + 6,000 + 5,000 = 20,000 against 4,500: 4.44 months again, now with the alert.
    expect(vi.mocked(submitCalculatorLead).mock.calls[1][0]).toMatchObject({ months: 4.44, concentration_alert: true });
    expect($('#calc-result-number').textContent).toBe('4,4');
  });
});
