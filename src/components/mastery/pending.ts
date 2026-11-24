// Pending-badge blocks of the Wealth Mastery page (docs/ux/CONTENT.md -> Metadata -> Pending
// badge, UX_UI_DIRECTION.md sections 6.5 and 7), with the shared visibility rule of
// src/lib/site/pending.ts:
//   placeholder  the guide's photo has not arrived (BR-011): badge in every build
//   provisional  Gaby confirms the FAQ answers and the three gender-neutral lines
//                (`mastery.fit.no.2`, `mastery.fit.no.3`, `mastery.how.4.body`) before they
//                are published: badge in preview and development builds only
import { currentBuildFlags, isBadgeVisible, type BuildFlags, type PendingKind } from '../../lib/site/pending';

export const MASTERY_PENDING_BLOCKS = {
  'mastery.guide_photo': 'placeholder',
  'mastery.faq': 'provisional',
  'mastery.adapted_lines': 'provisional',
} as const satisfies Record<string, PendingKind>;

export type MasteryPendingBlock = keyof typeof MASTERY_PENDING_BLOCKS;

/** Whether a block of the page shows the pending badge in this build. */
export function showsMasteryBadge(
  block: MasteryPendingBlock,
  flags: BuildFlags = currentBuildFlags(),
): boolean {
  return isBadgeVisible(MASTERY_PENDING_BLOCKS[block], flags);
}
