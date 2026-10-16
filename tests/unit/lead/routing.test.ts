import { describe, expect, it } from 'vitest';
import { routeForScreeningAnswer } from '../../../src/lib/lead/routing';
import { SCREENING_ANSWER_CODES } from '../../../src/lib/lead/types';

describe('routeForScreeningAnswer (US-023 AC4, AC5)', () => {
  it('routes ready_to_invest to the qualified screen', () => {
    expect(routeForScreeningAnswer('ready_to_invest')).toBe('qualified');
  });

  it('routes needs_investment_info to the qualified screen', () => {
    expect(routeForScreeningAnswer('needs_investment_info')).toBe('qualified');
  });

  it('routes no_capacity_now to the not-ready screen', () => {
    expect(routeForScreeningAnswer('no_capacity_now')).toBe('not_ready');
  });

  it('routes exploring to the not-ready screen', () => {
    expect(routeForScreeningAnswer('exploring')).toBe('not_ready');
  });

  it('decides every contract screening code', () => {
    for (const code of SCREENING_ANSWER_CODES) {
      expect(['qualified', 'not_ready']).toContain(routeForScreeningAnswer(code));
    }
  });
});
