// Pending-badge blocks of the calculator (docs/ux/CONTENT.md -> Metadata -> Pending badge,
// UX_UI_DIRECTION.md sections 6.5 and 7): the questions and the result (which holds the zones) are
// provisional copy (placeholder formula, US-035 AC7), so their badge shows in preview and
// development builds only. Uses the shared visibility rule of src/lib/site/pending.ts.
import { currentBuildFlags, isBadgeVisible, type BuildFlags } from '../site/pending';

export const CALCULATOR_PENDING_BLOCKS = ['calculator.questions', 'calculator.result'] as const;
export type CalculatorPendingBlock = (typeof CALCULATOR_PENDING_BLOCKS)[number];

export function showsCalculatorBadge(
  _block: CalculatorPendingBlock,
  flags: BuildFlags = currentBuildFlags(),
): boolean {
  return isBadgeVisible('provisional', flags);
}
