// Wires the calculator markup (CalculatorPage.astro) to the formula, the validation
// and the API client (US-035). Three steps in place; focus moves to each step's title.
// The five figures stay in the browser: only the details, the months and the zone are
// sent, and only after the visitor's details are valid. The result appears only after
// a 201 (NFR-006); preview builds send nothing and go straight to the result (FR-030).
import { submitCalculatorLead, type SubmitLeadResult } from '../../lib/lead/api';
import { calculateFreedom, type CalculatorResult, type CalculatorZone } from '../../lib/calculator/formula';
import { formatMonths } from '../../lib/calculator/format';
import {
  FIGURE_KEYS,
  type CalculatorDetailsField,
  type FigureKey,
} from '../../lib/calculator/types';
import {
  buildCalculatorPayload,
  validateDetails,
  validateFigures,
  type DetailsValidation,
  type FigureErrorCode,
} from '../../lib/calculator/validation';

interface CalculatorCopy {
  preview?: boolean;
  language: 'es' | 'en';
  endpoint: string;
  contactEmail: string;
  figureErrors: Record<FigureErrorCode, string>;
  fieldErrors: Partial<Record<string, string>>;
  submit: { idle: string; submitting: string };
  submissionError: { before: string; after: string };
  rateLimited: { before: string; after: string };
  /** `calc.result.months`, with `{months}`. */
  monthsTemplate: string;
  zones: Record<CalculatorZone, { title: string; body: string }>;
  covered: string;
}

const DETAIL_FIELDS: CalculatorDetailsField[] = ['name', 'email', 'phone', 'consent'];

export type Step = 'questions' | 'details' | 'result';

function detailErrorMessage(copy: CalculatorCopy, field: CalculatorDetailsField, code: string): string {
  const fallback = copy.fieldErrors.required ?? '';
  if (code === 'invalid_format') {
    if (field === 'email') return copy.fieldErrors.invalid_format_email ?? fallback;
    if (field === 'phone') return copy.fieldErrors.invalid_format_phone ?? fallback;
    return fallback;
  }
  if (code === 'invalid_type') return fallback;
  return copy.fieldErrors[code] ?? fallback;
}

export function initCalculator(root: HTMLElement): void {
  const copy = JSON.parse(root.dataset.copy ?? '{}') as CalculatorCopy;
  const q = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector);

  const steps: Record<Step, HTMLElement | null> = {
    questions: q('#calc-step-questions'),
    details: q('#calc-step-details'),
    result: q('#calc-step-result'),
  };
  const titles: Record<Step, string> = {
    questions: '#calc-questions-title',
    details: '#calc-details-title',
    result: '#calc-result-title',
  };
  const questionsForm = q<HTMLFormElement>('#calc-questions-form');
  const detailsForm = q<HTMLFormElement>('#calc-details-form');
  const submitButton = q<HTMLButtonElement>('#calc-submit');
  const submissionErrorEl = q<HTMLElement>('#calc-submission-error');
  if (!questionsForm || !detailsForm || !submitButton || !submissionErrorEl) return;

  // The card is rendered hidden: without JavaScript it stays hidden (US-035 AC8).
  root.hidden = false;

  const dialog = q<HTMLDialogElement>('#privacy-notice-dialog') ?? document.querySelector<HTMLDialogElement>('#privacy-notice-dialog');
  q('#privacy-notice-trigger')?.addEventListener('click', () => dialog?.showModal());
  document.querySelector('#privacy-notice-close')?.addEventListener('click', () => dialog?.close());
  // The honeypot form has no submit button; Enter inside it must never reload the page.
  q('#calc-hp-form')?.addEventListener('submit', (event) => event.preventDefault());

  /** The result of the last valid questions step; the details step sends it. */
  let current: CalculatorResult | null = null;

  function show(step: Step): void {
    for (const key of Object.keys(steps) as Step[]) {
      const el = steps[key];
      if (el) el.hidden = key !== step;
    }
    q<HTMLElement>(titles[step])?.focus();
  }

  function setText(selector: string, text: string): void {
    const el = q(selector);
    if (el) el.textContent = text;
  }

  function showResult(result: CalculatorResult): void {
    const zone = copy.zones[result.zone];
    setText(
      '#calc-result-months',
      result.covered || result.months === null
        ? copy.covered
        : copy.monthsTemplate.replace('{months}', formatMonths(result.months, copy.language)),
    );
    q('#calc-zone-pill')?.setAttribute('data-zone', result.zone);
    setText('#calc-zone-title', zone.title);
    // The covered text replaces the months; the zone body is replaced too (CONTENT.md 11.3).
    const body = q('#calc-zone-body');
    if (body) {
      body.textContent = result.covered ? '' : zone.body;
      body.hidden = result.covered;
    }
    show('result');
  }

  function clearFigureErrors(): void {
    for (const key of FIGURE_KEYS) {
      setText(`#calc-${key}-error`, '');
      q(`#calc-${key}`)?.removeAttribute('aria-invalid');
    }
  }

  function clearDetailErrors(): void {
    for (const field of DETAIL_FIELDS) {
      setText(`#calc-${field}-error`, '');
      q(`#calc-${field}`)?.removeAttribute('aria-invalid');
    }
    submissionErrorEl!.hidden = true;
    submissionErrorEl!.replaceChildren();
  }

  function renderBanner(parts: { before: string; after: string }): void {
    const el = submissionErrorEl!;
    el.replaceChildren();
    el.append(document.createTextNode(parts.before));
    const link = document.createElement('a');
    link.href = `mailto:${copy.contactEmail}`;
    link.textContent = copy.contactEmail;
    el.append(link, document.createTextNode(parts.after));
    el.hidden = false;
  }

  function applyDetailErrors(errors: Record<string, string | undefined>): boolean {
    let unmapped = false;
    for (const [field, code] of Object.entries(errors)) {
      if (!code) continue;
      const errorEl = q(`#calc-${field}-error`);
      if (!DETAIL_FIELDS.includes(field as CalculatorDetailsField) || !errorEl) {
        unmapped = true;
        continue;
      }
      errorEl.textContent = detailErrorMessage(copy, field as CalculatorDetailsField, code);
      q(`#calc-${field}`)?.setAttribute('aria-invalid', 'true');
    }
    return unmapped;
  }

  function setPending(pending: boolean): void {
    submitButton!.disabled = pending;
    const label = pending ? copy.submit.submitting : undefined;
    if (label !== undefined) {
      submitButton!.dataset.idleLabel ??= submitButton!.textContent?.trim() ?? '';
      replaceLabel(submitButton!, label);
    } else if (submitButton!.dataset.idleLabel) {
      replaceLabel(submitButton!, submitButton!.dataset.idleLabel);
    }
  }

  function replaceLabel(button: HTMLElement, text: string): void {
    const node = Array.from(button.childNodes).find(
      (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim() !== '',
    );
    if (node) node.textContent = text;
  }

  function readFigures(): Record<FigureKey, unknown> {
    const out = {} as Record<FigureKey, unknown>;
    for (const key of FIGURE_KEYS) out[key] = q<HTMLInputElement>(`#calc-${key}`)?.value ?? '';
    return out;
  }

  function readDetails(): Parameters<typeof validateDetails>[0] {
    return {
      name: q<HTMLInputElement>('#calc-name')?.value ?? '',
      email: q<HTMLInputElement>('#calc-email')?.value ?? '',
      phone: q<HTMLInputElement>('#calc-phone')?.value ?? '',
      consent: q<HTMLInputElement>('#calc-consent')?.checked ?? false,
      marketing: q<HTMLInputElement>('#calc-marketing')?.checked ?? false,
      // Lives outside the visible forms, like the VIP form's honeypot.
      website: q<HTMLInputElement>('#calc-hp')?.value ?? '',
    };
  }

  questionsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearFigureErrors();
    const { errors, figures } = validateFigures(readFigures());
    if (!figures) {
      let first: HTMLElement | null = null;
      for (const key of FIGURE_KEYS) {
        const code = errors[key];
        if (!code) continue;
        setText(`#calc-${key}-error`, copy.figureErrors[code]);
        const input = q<HTMLElement>(`#calc-${key}`);
        input?.setAttribute('aria-invalid', 'true');
        first ??= input;
      }
      first?.focus();
      return;
    }
    // The figures are used here and not kept: only the result goes on to the next step.
    current = calculateFreedom(figures);
    clearDetailErrors();
    show('details');
  });

  detailsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearDetailErrors();
    if (!current) {
      show('questions');
      return;
    }
    const result = current;
    const validation: DetailsValidation = validateDetails(readDetails());
    if (!validation.values) {
      if (applyDetailErrors(validation.errors)) renderBanner(copy.submissionError);
      return;
    }

    // Preview builds never call an endpoint: the result is a demonstration.
    if (copy.preview) {
      showResult(result);
      return;
    }

    const payload = buildCalculatorPayload(validation.values, result, copy.language);
    setPending(true);
    submitCalculatorLead(payload, copy.endpoint)
      .then((outcome: SubmitLeadResult) => {
        if (outcome.kind === 'success') {
          showResult(result);
          return;
        }
        if (outcome.kind === 'validation_error') {
          if (applyDetailErrors(outcome.fieldErrors as Record<string, string | undefined>)) {
            renderBanner(copy.submissionError);
          }
          return;
        }
        renderBanner(outcome.kind === 'rate_limited' ? copy.rateLimited : copy.submissionError);
      })
      .finally(() => setPending(false));
  });

  // "Calculate again": back to the questions (still filled in); the details step then
  // shows again, prefilled, and submitting it stores a new row (US-035 AC6).
  q('#calc-restart')?.addEventListener('click', () => {
    current = null;
    clearFigureErrors();
    show('questions');
  });
}
