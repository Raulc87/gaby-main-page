// The gauge of the result (UX_UI_DIRECTION.md section 6.8): a bar on the scale 0 · 6 · 12 · 24 · 36+.
// Each quarter of the bar is one stretch of that scale, so the marker is piecewise linear.

/** The scale's stops, in months; each is a quarter of the bar further on. */
export const GAUGE_STOPS = [0, 6, 12, 24, 36] as const;

/**
 * Where the marker sits, from 0 (left end) to 1 (right end). 36 months or more, and "∞" (`null`),
 * sit at the end.
 */
export function gaugePosition(months: number | null): number {
  const last = GAUGE_STOPS.length - 1;
  if (months === null || months >= GAUGE_STOPS[last]) return 1;
  const value = Math.max(months, 0);
  for (let i = 0; i < last; i += 1) {
    const from = GAUGE_STOPS[i];
    const to = GAUGE_STOPS[i + 1];
    if (value < to) return (i + (value - from) / (to - from)) / last;
  }
  return 1;
}
