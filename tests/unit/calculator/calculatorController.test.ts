// The calculator's three steps (US-035): the result appears only after a successful save,
// a failed save keeps it hidden, preview builds send nothing, the five figures are never
// sent, and "Calculate again" returns to the questions with the details prefilled.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initCalculator } from '../../../src/components/calculator/calculatorController';
import { submitCalculatorLead, type SubmitLeadResult } from '../../../src/lib/lead/api';

vi.mock('../../../src/lib/lead/api', () => ({ submitCalculatorLead: vi.fn() }));

const COPY = {
  language: 'es',
  endpoint: '/api/save-calculator-lead',
  contactEmail: 'gkelly@poliartcr.com',
  figureErrors: { required: 'Obligatorio.', number: 'Número.', no_outflow: 'Sin gastos.' },
  fieldErrors: { required: 'Obligatorio.', consent_required: 'Falta el consentimiento.' },
  submit: { idle: 'Ver mi resultado', submitting: 'Enviando…' },
  submissionError: { before: 'Error, escribe a ', after: '.' },
  rateLimited: { before: 'Espera, escribe a ', after: '.' },
  monthsTemplate: '{months} meses',
  zones: {
    alert: { title: 'Zona de alerta', body: 'Menos de 6 meses.' },
    building: { title: 'Zona de construcción', body: 'De 6 a menos de 12.' },
    freedom: { title: 'Zona de libertad', body: '12 meses o más.' },
  },
  covered: 'Ya cubierto.',
};

function mount(preview = false): HTMLElement {
  document.body.innerHTML = '';
  const root = document.createElement('div');
  root.hidden = true;
  root.dataset.copy = JSON.stringify({ ...COPY, preview });
  const figures = ['expenses', 'debt', 'savings', 'investments', 'other_income']
    .map((k) => `<input id="calc-${k}" /><p id="calc-${k}-error"></p>`)
    .join('');
  root.innerHTML = `
    <form id="calc-hp-form"><input id="calc-hp" /></form>
    <div id="calc-step-questions"><h1 id="calc-questions-title" tabindex="-1"></h1>
      <form id="calc-questions-form">${figures}<button type="submit">next</button></form></div>
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
      <p id="calc-result-months"></p><p id="calc-zone-pill" data-zone="alert"><span id="calc-zone-title"></span></p>
      <p id="calc-zone-body"></p><button id="calc-restart" type="button">again</button></div>`;
  document.body.append(root);
  initCalculator(root);
  return root;
}

const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const submit = (selector: string) => $<HTMLFormElement>(selector).dispatchEvent(new Event('submit', { cancelable: true }));
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function fillFigures(values: Record<string, string>) {
  for (const [key, value] of Object.entries(values)) $<HTMLInputElement>(`#calc-${key}`).value = value;
}
function fillDetails({ consent = true, marketing = false } = {}) {
  $<HTMLInputElement>('#calc-name').value = 'Ana María Pérez Soto';
  $<HTMLInputElement>('#calc-email').value = 'ana.perez@example.com';
  $<HTMLInputElement>('#calc-consent').checked = consent;
  $<HTMLInputElement>('#calc-marketing').checked = marketing;
}
const alertFigures = { expenses: '800', debt: '200', savings: '4400', investments: '0', other_income: '0' };
const visible = (selector: string) => !$(selector).hidden;

beforeEach(() => {
  vi.mocked(submitCalculatorLead).mockReset();
});

describe('calculator controller', () => {
  it('reveals the card and starts on the questions', () => {
    const root = mount();
    expect(root.hidden).toBe(false);
    expect(visible('#calc-step-questions')).toBe(true);
    expect(visible('#calc-step-details')).toBe(false);
  });

  it('shows field errors and stays on the questions when a figure is invalid', () => {
    mount();
    fillFigures({ ...alertFigures, savings: '', debt: 'abc' });
    submit('#calc-questions-form');
    expect($('#calc-savings-error').textContent).toBe('Obligatorio.');
    expect($('#calc-debt-error').textContent).toBe('Número.');
    expect(visible('#calc-step-questions')).toBe(true);
  });

  it('goes to the details step, then shows the result only after a 201', async () => {
    mount();
    vi.mocked(submitCalculatorLead).mockResolvedValue({ kind: 'success' });
    fillFigures(alertFigures);
    submit('#calc-questions-form');
    expect(visible('#calc-step-details')).toBe(true);
    expect(visible('#calc-step-result')).toBe(false);

    fillDetails({ marketing: true });
    submit('#calc-details-form');
    expect(visible('#calc-step-result')).toBe(false); // not yet: the save is pending
    await flush();

    expect(visible('#calc-step-result')).toBe(true);
    expect($('#calc-result-months').textContent).toBe('4,4 meses');
    expect($('#calc-zone-pill').dataset.zone).toBe('alert');
    expect($('#calc-zone-title').textContent).toBe('Zona de alerta');
  });

  it('sends the details, the months, the zone and the consents, never the five figures', async () => {
    mount();
    vi.mocked(submitCalculatorLead).mockResolvedValue({ kind: 'success' });
    fillFigures(alertFigures);
    submit('#calc-questions-form');
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
      months: 4.4,
      zone: 'alert',
      website: '',
    });
  });

  it('sends the honeypot value from the field outside the visible forms', async () => {
    mount();
    vi.mocked(submitCalculatorLead).mockResolvedValue({ kind: 'success' });
    $<HTMLInputElement>('#calc-hp').value = 'bot';
    fillFigures(alertFigures);
    submit('#calc-questions-form');
    fillDetails();
    submit('#calc-details-form');
    await flush();
    expect(vi.mocked(submitCalculatorLead).mock.calls[0][0].website).toBe('bot');
  });

  it('shows the covered text and no zone body, with months null, when other income covers the outflow', async () => {
    mount();
    vi.mocked(submitCalculatorLead).mockResolvedValue({ kind: 'success' });
    fillFigures({ ...alertFigures, other_income: '1000' });
    submit('#calc-questions-form');
    fillDetails();
    submit('#calc-details-form');
    await flush();

    expect(vi.mocked(submitCalculatorLead).mock.calls[0][0]).toMatchObject({ months: null, zone: 'freedom' });
    expect($('#calc-result-months').textContent).toBe('Ya cubierto.');
    expect($('#calc-zone-pill').dataset.zone).toBe('freedom');
    expect(visible('#calc-zone-body')).toBe(false);
  });

  it.each<[string, SubmitLeadResult, string]>([
    ['a generic error', { kind: 'generic_error' }, 'Error, escribe a '],
    ['a rate limit', { kind: 'rate_limited' }, 'Espera, escribe a '],
  ])('keeps the result hidden and shows the message on %s', async (_name, outcome, text) => {
    mount();
    vi.mocked(submitCalculatorLead).mockResolvedValue(outcome);
    fillFigures(alertFigures);
    submit('#calc-questions-form');
    fillDetails();
    submit('#calc-details-form');
    await flush();

    expect(visible('#calc-step-result')).toBe(false);
    expect(visible('#calc-step-details')).toBe(true);
    expect($('#calc-submission-error').hidden).toBe(false);
    expect($('#calc-submission-error').textContent).toContain(text);
    expect($<HTMLButtonElement>('#calc-submit').disabled).toBe(false);
  });

  it('maps a 422 to the fields and still hides the result', async () => {
    mount();
    vi.mocked(submitCalculatorLead).mockResolvedValue({ kind: 'validation_error', fieldErrors: { email: 'required' } });
    fillFigures(alertFigures);
    submit('#calc-questions-form');
    fillDetails();
    submit('#calc-details-form');
    await flush();
    expect($('#calc-email-error').textContent).toBe('Obligatorio.');
    expect(visible('#calc-step-result')).toBe(false);
  });

  it('does not call the API when the consent is missing', async () => {
    mount();
    fillFigures(alertFigures);
    submit('#calc-questions-form');
    fillDetails({ consent: false });
    submit('#calc-details-form');
    await flush();
    expect(submitCalculatorLead).not.toHaveBeenCalled();
    expect($('#calc-consent-error').textContent).toBe('Falta el consentimiento.');
  });

  it('preview builds show the result and send nothing', async () => {
    mount(true);
    fillFigures(alertFigures);
    submit('#calc-questions-form');
    fillDetails();
    submit('#calc-details-form');
    await flush();
    expect(submitCalculatorLead).not.toHaveBeenCalled();
    expect(visible('#calc-step-result')).toBe(true);
  });

  it('"Calculate again" returns to the questions; the details come back prefilled and store a new row', async () => {
    mount();
    vi.mocked(submitCalculatorLead).mockResolvedValue({ kind: 'success' });
    fillFigures(alertFigures);
    submit('#calc-questions-form');
    fillDetails();
    submit('#calc-details-form');
    await flush();

    $('#calc-restart').click();
    expect(visible('#calc-step-questions')).toBe(true);
    expect(visible('#calc-step-result')).toBe(false);

    fillFigures({ savings: '9000' });
    submit('#calc-questions-form');
    expect(visible('#calc-step-details')).toBe(true);
    expect($<HTMLInputElement>('#calc-name').value).toBe('Ana María Pérez Soto');
    expect($<HTMLInputElement>('#calc-consent').checked).toBe(true);

    submit('#calc-details-form');
    await flush();
    expect(submitCalculatorLead).toHaveBeenCalledTimes(2);
    expect(vi.mocked(submitCalculatorLead).mock.calls[1][0]).toMatchObject({ months: 9, zone: 'building' });
    expect($('#calc-result-months').textContent).toBe('9,0 meses');
  });
});
