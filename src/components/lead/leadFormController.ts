// Wires the LeadForm markup to the shared validation/API-client modules.
// Field-by-field UI is built incrementally (GK-004-lead-form: name/email/
// phone; GK-005-pre-screening: screening_answer; GK-011-privacy-consent:
// consent) but this controller already knows the full contract shape
// (LEAD_API_CONTRACT.md section 3) so later branches only need to add
// markup, not touch this file: a field with no matching DOM slot yet simply
// falls back to the generic submission error (see `applyFieldErrors`).
import { submitLead } from '../../lib/lead/api';
import { detectPageLanguage } from '../../lib/lead/language';
import type { FieldErrorCode, LeadFieldErrors, LeadFormField, LeadRequestPayload } from '../../lib/lead/types';
import { validateLeadForm, type RawLeadFormInput } from '../../lib/lead/validation';

interface LeadFormCopy {
  submit: { idle: string; submitting: string };
  fieldErrors: Partial<Record<string, string>>;
  submissionError: { before: string; after: string };
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

export function initLeadForm(root: HTMLElement): void {
  const copy = JSON.parse(root.dataset.copy ?? '{}') as LeadFormCopy;
  const form = root.querySelector<HTMLFormElement>('#lead-form-form');
  const submitButton = root.querySelector<HTMLButtonElement>('#lead-submit');
  const submissionErrorEl = root.querySelector<HTMLElement>('#lead-submission-error');
  const formContainer = root.querySelector<HTMLElement>('#lead-form-container');
  const successContainer = root.querySelector<HTMLElement>('#lead-success-container');

  if (!form || !submitButton || !submissionErrorEl) {
    return;
  }
  const formEl: HTMLFormElement = form;
  const submitButtonEl: HTMLButtonElement = submitButton;
  const submissionErrorElement: HTMLElement = submissionErrorEl;

  function readRawInput(): RawLeadFormInput {
    const nameEl = root.querySelector<HTMLInputElement>('#lead-name');
    const emailEl = root.querySelector<HTMLInputElement>('#lead-email');
    const phoneEl = root.querySelector<HTMLInputElement>('#lead-phone');
    const screeningEl = root.querySelector<HTMLInputElement>('input[name="screening_answer"]:checked');
    const consentEl = root.querySelector<HTMLInputElement>('#lead-consent');

    return {
      name: nameEl?.value ?? '',
      email: emailEl?.value ?? '',
      phone: phoneEl?.value ?? '',
      screening_answer: screeningEl?.value ?? '',
      language: detectPageLanguage(window.location.pathname),
      consent: consentEl ? consentEl.checked : false,
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

  function renderSubmissionError(): void {
    submissionErrorElement.replaceChildren();
    submissionErrorElement.append(document.createTextNode(copy.submissionError.before));
    const link = document.createElement('a');
    link.href = `mailto:${copy.contactEmail}`;
    link.textContent = copy.contactEmail;
    submissionErrorElement.append(link);
    submissionErrorElement.append(document.createTextNode(copy.submissionError.after));
    submissionErrorElement.hidden = false;
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
    submitButtonEl.textContent = pending ? copy.submit.submitting : copy.submit.idle;
  }

  function onSuccess(payload: LeadRequestPayload): void {
    if (formContainer) formContainer.hidden = true;
    if (successContainer) {
      successContainer.hidden = false;
      successContainer.dispatchEvent(new CustomEvent('lead:success', { detail: payload }));
    }
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
        renderSubmissionError();
      })
      .finally(() => setPending(false));
  });
}
