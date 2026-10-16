// Wires the LeadForm markup to the shared validation/API-client modules.
// Field-by-field UI is built incrementally (GK-004-lead-form: name/email/
// phone; GK-005-pre-screening: screening_answer; GK-011-privacy-consent:
// consent) but this controller already knows the full contract shape
// (LEAD_API_CONTRACT.md section 3) so later branches only need to add
// markup, not touch this file: a field with no matching DOM slot yet simply
// falls back to the generic submission error (see `applyFieldErrors`).
import { submitLead } from '../../lib/lead/api';
import { detectPageLanguage } from '../../lib/lead/language';
import { routeForScreeningAnswer } from '../../lib/lead/routing';
import type { FieldErrorCode, LeadFieldErrors, LeadFormField, LeadRequestPayload } from '../../lib/lead/types';
import { validateLeadForm, type RawLeadFormInput } from '../../lib/lead/validation';

interface LeadFormCopy {
  submit: { idle: string; submitting: string };
  fieldErrors: Partial<Record<string, string>>;
  submissionError: { before: string; after: string };
  /** `429` / `rate_limited` message (contract section 3.2, US-013 AC4). */
  rateLimited: { before: string; after: string };
  contactEmail: string;
}

/** DOM id for each field's input/fieldset and its `${id}-error` sibling. Undefined until that field's branch adds markup. */
const FIELD_SLOT_IDS: Partial<Record<LeadFormField, string>> = {
  name: 'lead-name',
  email: 'lead-email',
  phone: 'lead-phone',
  screening_answer: 'lead-screening',
  consent: 'lead-consent',
};

function fieldErrorMessage(copy: LeadFormCopy, field: LeadFormField, code: FieldErrorCode): string {
  const fallback = copy.fieldErrors.required ?? '';
  if (code === 'invalid_format') {
    if (field === 'email') return copy.fieldErrors.invalid_format_email ?? fallback;
    if (field === 'phone') return copy.fieldErrors.invalid_format_phone ?? fallback;
    return fallback;
  }
  if (code === 'invalid_type') return fallback;
  return copy.fieldErrors[code] ?? fallback;
}

/** Opens/closes the privacy notice <dialog> in place (US-011 AC2: no navigation, form data kept). */
function initPrivacyNoticeDialog(root: HTMLElement): void {
  const dialog = root.querySelector<HTMLDialogElement>('#privacy-notice-dialog');
  const trigger = root.querySelector<HTMLButtonElement>('#privacy-notice-trigger');
  const closeButton = root.querySelector<HTMLButtonElement>('#privacy-notice-close');
  if (!dialog || !trigger) return;

  trigger.addEventListener('click', () => dialog.showModal());
  closeButton?.addEventListener('click', () => dialog.close());
}

/**
 * The honeypot (US-013 AC1) lives in its own <form>, outside #lead-form-form,
 * so browser autofill never reaches it. That form has no submit button, but
 * pressing Enter inside its input still fires a `submit` event, which must
 * never be allowed to actually submit (it would reload the page).
 */
function preventHoneypotFormSubmit(root: HTMLElement): void {
  const honeypotForm = root.querySelector<HTMLFormElement>('#lead-hp-form');
  honeypotForm?.addEventListener('submit', (event) => event.preventDefault());
}

/**
 * Sets the button's text without removing its arrow icon: the `[data-submit-label]`
 * span when the markup has one, otherwise the first text node (the shared Button
 * component renders its label as a text node followed by the icon).
 */
function setButtonLabel(button: HTMLElement, text: string): void {
  const span = button.querySelector<HTMLElement>('[data-submit-label]');
  if (span) {
    span.textContent = text;
    return;
  }
  const textNode = Array.from(button.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() !== '',
  );
  if (textNode) textNode.textContent = text;
  else button.prepend(document.createTextNode(text));
}

export function initLeadForm(root: HTMLElement): void {
  const copy = JSON.parse(root.dataset.copy ?? '{}') as LeadFormCopy;
  const form = root.querySelector<HTMLFormElement>('#lead-form-form');
  const submitButton = root.querySelector<HTMLButtonElement>('#lead-submit');
  const submissionErrorEl = root.querySelector<HTMLElement>('#lead-submission-error');
  const formContainer = root.querySelector<HTMLElement>('#lead-form-container');
  const successContainer = root.querySelector<HTMLElement>('#lead-success-container');
  const notReadyContainer = root.querySelector<HTMLElement>('#lead-not-ready-container');

  if (!form || !submitButton || !submissionErrorEl) {
    return;
  }
  const formEl: HTMLFormElement = form;
  const submitButtonEl: HTMLButtonElement = submitButton;
  const submissionErrorElement: HTMLElement = submissionErrorEl;

  initPrivacyNoticeDialog(root);
  preventHoneypotFormSubmit(root);

  function readRawInput(): RawLeadFormInput {
    const nameEl = root.querySelector<HTMLInputElement>('#lead-name');
    const emailEl = root.querySelector<HTMLInputElement>('#lead-email');
    const phoneEl = root.querySelector<HTMLInputElement>('#lead-phone');
    const screeningEl = root.querySelector<HTMLInputElement>('input[name="screening_answer"]:checked');
    const consentEl = root.querySelector<HTMLInputElement>('#lead-consent');
    // Lives outside #lead-form-form (US-013 AC1) — see LeadForm.astro.
    const websiteEl = root.querySelector<HTMLInputElement>('#lead-hp');

    return {
      name: nameEl?.value ?? '',
      email: emailEl?.value ?? '',
      phone: phoneEl?.value ?? '',
      screening_answer: screeningEl?.value ?? '',
      language: detectPageLanguage(window.location.pathname),
      consent: consentEl ? consentEl.checked : false,
      website: websiteEl?.value ?? '',
    };
  }

  function clearErrors(): void {
    for (const slotId of Object.values(FIELD_SLOT_IDS)) {
      const errorEl = root.querySelector<HTMLElement>(`#${slotId}-error`);
      if (errorEl) errorEl.textContent = '';
      root.querySelector(`#${slotId}`)?.removeAttribute('aria-invalid');
    }
    submissionErrorElement.hidden = true;
    submissionErrorElement.replaceChildren();
  }

  /** Renders a `{before} mailto-link {after}` message into the submission-error banner (data stays in the form; caller never shows success or Calendly). */
  function renderBannerMessage(parts: { before: string; after: string }): void {
    submissionErrorElement.replaceChildren();
    submissionErrorElement.append(document.createTextNode(parts.before));
    const link = document.createElement('a');
    link.href = `mailto:${copy.contactEmail}`;
    link.textContent = copy.contactEmail;
    submissionErrorElement.append(link);
    submissionErrorElement.append(document.createTextNode(parts.after));
    submissionErrorElement.hidden = false;
  }

  function renderSubmissionError(): void {
    renderBannerMessage(copy.submissionError);
  }

  /** `429` / `rate_limited` (US-013 AC4): its own localized message; form data stays, no success, no Calendly. */
  function renderRateLimitedError(): void {
    renderBannerMessage(copy.rateLimited);
  }

  /** Applies every field error it has a DOM slot for; returns whether any error had no slot (caller should also show the generic banner). */
  function applyFieldErrors(fieldErrors: LeadFieldErrors): boolean {
    let hasUnmappedError = false;
    for (const field of Object.keys(fieldErrors) as LeadFormField[]) {
      const code = fieldErrors[field];
      if (!code) continue;
      const slotId = FIELD_SLOT_IDS[field];
      const errorEl = slotId ? root.querySelector<HTMLElement>(`#${slotId}-error`) : null;
      if (!slotId || !errorEl) {
        hasUnmappedError = true;
        continue;
      }
      errorEl.textContent = fieldErrorMessage(copy, field, code);
      root.querySelector(`#${slotId}`)?.setAttribute('aria-invalid', 'true');
    }
    return hasUnmappedError;
  }

  function setPending(pending: boolean): void {
    submitButtonEl.disabled = pending;
    const text = pending ? copy.submit.submitting : copy.submit.idle;
    setButtonLabel(submitButtonEl, text);
  }

  /**
   * US-023 AC4, AC5: the screening answer decides the next screen. Qualified
   * answers get the thank-you and the scheduler (`lead:success` starts it);
   * the others get the not-ready screen and the scheduler is never started.
   * Focus moves to the new screen's title (UX_UI_DIRECTION.md section 6.4).
   */
  function onSuccess(payload: LeadRequestPayload): void {
    if (formContainer) formContainer.hidden = true;
    if (routeForScreeningAnswer(payload.screening_answer) === 'qualified') {
      if (!successContainer) return;
      successContainer.hidden = false;
      successContainer.dispatchEvent(new CustomEvent('lead:success', { detail: payload }));
      successContainer.querySelector<HTMLElement>('#lead-success-title')?.focus();
      return;
    }
    if (!notReadyContainer) return;
    notReadyContainer.hidden = false;
    notReadyContainer.querySelector<HTMLElement>('#lead-not-ready-title')?.focus();
  }

  formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();

    const { fieldErrors, values } = validateLeadForm(readRawInput());

    if (Object.keys(fieldErrors).length > 0) {
      if (applyFieldErrors(fieldErrors)) renderSubmissionError();
      return;
    }

    setPending(true);
    submitLead(values as LeadRequestPayload)
      .then((result) => {
        if (result.kind === 'success') {
          onSuccess(values as LeadRequestPayload);
          return;
        }
        if (result.kind === 'validation_error') {
          if (applyFieldErrors(result.fieldErrors)) renderSubmissionError();
          return;
        }
        if (result.kind === 'rate_limited') {
          renderRateLimitedError();
          return;
        }
        renderSubmissionError();
      })
      .finally(() => setPending(false));
  });
}
