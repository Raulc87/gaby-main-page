// Covers the submitting state of leadFormController.ts's setPending
// (UX_UI_DIRECTION.md section 2.1, "Buttons": submit button label swaps to
// "Enviando…"/"Sending…" while disabled). Added per the review-only agent's
// nit N2 on GK-015-form-style: nothing previously asserted that the
// `[data-submit-label]` swap in setPending leaves the button's arrow icon
// in place, so a future markup change could silently lose either.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initLeadForm } from '../../../src/components/lead/leadFormController';
import { submitLead, type SubmitLeadResult } from '../../../src/lib/lead/api';

vi.mock('../../../src/lib/lead/api', () => ({
  submitLead: vi.fn(),
}));

const COPY = {
  submit: { idle: 'Send and book my call', submitting: 'Sending…' },
  fieldErrors: {},
  submissionError: { before: '', after: '' },
  rateLimited: { before: '', after: '' },
  contactEmail: 'gkelly@poliartcr.com',
};

/** Minimal DOM matching what leadFormController.ts queries, with valid field values so validateLeadForm passes and submitLead is reached. */
function mountFormFixture(): HTMLElement {
  const root = document.createElement('div');
  root.id = 'lead-form';
  root.dataset.copy = JSON.stringify(COPY);
  root.innerHTML = `
    <div id="lead-form-container">
      <form id="lead-form-form">
        <input id="lead-website" value="" />
        <input id="lead-name" value="Ana María Pérez Soto" />
        <input id="lead-email" value="ana.perez@example.com" />
        <input id="lead-phone" value="+50684104791" />
        <input type="radio" name="screening_answer" value="exploring" checked />
        <input id="lead-consent" type="checkbox" checked />
        <p id="lead-submission-error" hidden></p>
        <button id="lead-submit" type="submit">
          <span data-submit-label>${COPY.submit.idle}</span>
          <svg data-testid="submit-arrow"></svg>
        </button>
      </form>
    </div>
    <div id="lead-success-container" hidden></div>
  `;
  document.body.appendChild(root);
  return root;
}

function flushMicrotasksAndTimers(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('leadFormController setPending (submitting state)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.mocked(submitLead).mockReset();
  });

  it('disables the button and swaps the label to the submitting copy while keeping the arrow icon, then restores it', async () => {
    let resolveSubmit!: (value: SubmitLeadResult) => void;
    const pending = new Promise<SubmitLeadResult>((resolve) => {
      resolveSubmit = resolve;
    });
    vi.mocked(submitLead).mockReturnValue(pending);

    const root = mountFormFixture();
    initLeadForm(root);

    const form = root.querySelector('#lead-form-form') as HTMLFormElement;
    const button = root.querySelector('#lead-submit') as HTMLButtonElement;
    const label = button.querySelector('[data-submit-label]') as HTMLElement;
    const icon = button.querySelector('svg');

    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    expect(vi.mocked(submitLead)).toHaveBeenCalledTimes(1);
    expect(button.disabled).toBe(true);
    expect(label.textContent).toBe(COPY.submit.submitting);
    expect(button.contains(icon)).toBe(true);

    resolveSubmit({ kind: 'success' });
    await flushMicrotasksAndTimers();

    expect(button.disabled).toBe(false);
    expect(label.textContent).toBe(COPY.submit.idle);
    expect(button.contains(icon)).toBe(true);
  });
});
