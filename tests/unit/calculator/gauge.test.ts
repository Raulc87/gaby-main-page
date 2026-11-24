// UX_UI_DIRECTION.md section 6.8: the marker is piecewise on the scale 0 · 6 · 12 · 24 · 36+.
import { describe, expect, it } from 'vitest';
import { gaugePosition } from '../../../src/lib/calculator/gauge';

describe('gaugePosition', () => {
  it.each([
    [0, 0],
    [3, 0.125], // half of the first quarter
    [6, 0.25],
    [9, 0.375],
    [12, 0.5],
    [18, 0.625],
    [24, 0.75],
    [30, 0.875],
    [35.99, 0.99979],
  ])('%s months sits at %s of the bar', (months, position) => {
    expect(gaugePosition(months)).toBeCloseTo(position, 4);
  });

  it('puts 36 months or more, and ∞, at the end', () => {
    expect(gaugePosition(36)).toBe(1);
    expect(gaugePosition(1234.5)).toBe(1);
    expect(gaugePosition(null)).toBe(1);
  });

  it('never goes below the start', () => {
    expect(gaugePosition(-1)).toBe(0);
  });
});
