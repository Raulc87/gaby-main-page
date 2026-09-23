// Client handling of every relevant outcome in LEAD_API_CONTRACT.md section
// 7: 201, 422 (field errors), every other status code, and network failure.
// Per the contract, "network failure or a non-JSON response is treated by
// the frontend like 500" and the UX copy defines one generic message for any
// non-201/non-422 outcome, so this suite asserts the collapsed
// `generic_error` kind for all of them.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { submitLead } from '../../../src/lib/lead/api';
import type { LeadRequestPayload } from '../../../src/lib/lead/types';

const payload: LeadRequestPayload = {
  name: 'Ana María Pérez Soto',
  email: 'ana.perez@example.com',
  phone: '+50684104791',
  screening_answer: 'needs_investment_info',
  language: 'es',
  consent: true,
};

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('submitLead', () => {
  it('returns success on 201', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(201, { success: true, message: 'Lead saved.', error_code: null, field_errors: null }),
      ),
    );

    await expect(submitLead(payload, '/api/save-lead')).resolves.toEqual({ kind: 'success' });
  });

  it('returns validation_error with field_errors on 422', async () => {
    const fieldErrors = { name: 'full_name_required', phone: 'invalid_format' };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(422, {
          success: false,
          message: 'Validation failed.',
          error_code: 'validation_error',
          field_errors: fieldErrors,
        }),
      ),
    );

    await expect(submitLead(payload, '/api/save-lead')).resolves.toEqual({
      kind: 'validation_error',
      fieldErrors,
    });
  });

  it('returns generic_error on 503 storage_unavailable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(503, {
          success: false,
          message: 'Failed to save lead.',
          error_code: 'storage_unavailable',
          field_errors: null,
        }),
      ),
    );

    await expect(submitLead(payload, '/api/save-lead')).resolves.toEqual({ kind: 'generic_error' });
  });

  it('returns generic_error on 500 internal_error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(500, {
          success: false,
          message: 'An unexpected error occurred.',
          error_code: 'internal_error',
          field_errors: null,
        }),
      ),
    );

    await expect(submitLead(payload, '/api/save-lead')).resolves.toEqual({ kind: 'generic_error' });
  });

  it('returns generic_error on a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(submitLead(payload, '/api/save-lead')).resolves.toEqual({ kind: 'generic_error' });
  });

  it('returns generic_error on a non-JSON response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('<html>Not JSON</html>', { status: 500 })),
    );

    await expect(submitLead(payload, '/api/save-lead')).resolves.toEqual({ kind: 'generic_error' });
  });
});
