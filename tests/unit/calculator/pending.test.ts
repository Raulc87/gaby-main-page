// The details step's body is a provisional copy block: its badge shows in preview and development
// builds, never in production (CONTENT.md Metadata, owner decision on #93).
import { describe, expect, it } from 'vitest';
import { CALCULATOR_PENDING_BLOCKS, showsCalculatorBadge } from '../../../src/lib/calculator/pending';

describe('calculator pending badge', () => {
  it('lists only the details step body', () => {
    expect(CALCULATOR_PENDING_BLOCKS).toEqual(['calculator.capture_body']);
  });

  it('shows in preview and development builds, not in production', () => {
    expect(showsCalculatorBadge('calculator.capture_body', { preview: true, dev: false })).toBe(true);
    expect(showsCalculatorBadge('calculator.capture_body', { preview: false, dev: true })).toBe(true);
    expect(showsCalculatorBadge('calculator.capture_body', { preview: false, dev: false })).toBe(false);
  });
});
