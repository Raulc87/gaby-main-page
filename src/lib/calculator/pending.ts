// Pending-badge blocks of the calculator (docs/ux/CONTENT.md -> Metadata -> Pending badge,
// UX_UI_DIRECTION.md sections 6.5 and 7): the details step's body, `calc.capture.body`, is team-written
// copy Gaby has not approved (owner decision on #93), so its badge shows in preview and development
// builds only. The shares placeholder and error are a form control and a state message: no badge.
// Uses the shared visibility rule of src/lib/site/pending.ts.
import { currentBuildFlags, isBadgeVisible, type BuildFlags } from '../site/pending';

export const CALCULATOR_PENDING_BLOCKS = ['calculator.capture_body'] as const;
export type CalculatorPendingBlock = (typeof CALCULATOR_PENDING_BLOCKS)[number];

export function showsCalculatorBadge(
  _block: CalculatorPendingBlock,
  flags: BuildFlags = currentBuildFlags(),
): boolean {
  return isBadgeVisible('provisional', flags);
}
