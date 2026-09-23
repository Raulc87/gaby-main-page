// API client for POST /api/save-lead, mapping every status code in
// docs/specs/LEAD_API_CONTRACT.md section 7 plus network errors.
//
// Per the contract: "Network failure or a non-JSON response is treated by
// the frontend like 500", and the UX copy defines a single generic
// submission-error message for "any non-201 result, network failure"
// (UX_UI_DIRECTION.md section 7) — the only outcome with distinct handling
// besides success is 422 with field errors. So every other status
// (400/404/405/413/415/429/500/503, network failure, or a non-JSON body)
// collapses into `generic_error`.
import { LEAD_ENDPOINT } from './config';
import type { LeadApiResponseBody, LeadFieldErrors, LeadRequestPayload } from './types';

export type SubmitLeadResult =
  | { kind: 'success' }
  | { kind: 'validation_error'; fieldErrors: LeadFieldErrors }
  | { kind: 'generic_error' };

function isLeadApiResponseBody(value: unknown): value is LeadApiResponseBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    typeof (value as { success: unknown }).success === 'boolean'
  );
}

export async function submitLead(
  payload: LeadRequestPayload,
  endpoint: string = LEAD_ENDPOINT,
): Promise<SubmitLeadResult> {
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    return { kind: 'generic_error' };
  }

  if (response.status === 201) {
    return { kind: 'success' };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return { kind: 'generic_error' };
  }

  if (!isLeadApiResponseBody(body)) {
    return { kind: 'generic_error' };
  }

  if (response.status === 422 && body.field_errors) {
    return { kind: 'validation_error', fieldErrors: body.field_errors };
  }

  return { kind: 'generic_error' };
}
