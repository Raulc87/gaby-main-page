// Pending-badge blocks (docs/ux/CONTENT.md -> Metadata -> Pending badge,
// UX_UI_DIRECTION.md sections 6.5 and 7). The list says which content blocks
// carry a badge and why; visibility follows the block's kind and the build:
//   placeholder  content that has not arrived (BR-011): badge in every build
//   provisional  copy awaiting approval: badge in preview and development builds
// Navigation, labels, alt text, metadata and state messages never get a badge.
import { IS_PREVIEW } from './preview';

export type PendingKind = 'placeholder' | 'provisional';

export const PENDING_BLOCKS = {
  // Placeholders
  'home.testimonials': 'placeholder',
  'story.photo': 'placeholder',
  'story.bio': 'placeholder',
  'vip.video': 'placeholder',
  'resource.file_pending': 'placeholder',
  // Provisional copy blocks
  'home.method': 'provisional',
  'vip.steps': 'provisional',
  'thanks.not_ready': 'provisional',
  'resource.provisional_title': 'provisional',
  // Phase 1 one-page blocks, removed with the phase 1 sections in GK-021-home;
  // they keep showing their badge in every build until then.
  'phase1.hero_photo': 'placeholder',
  'phase1.guide': 'placeholder',
  'phase1.proof': 'placeholder',
} as const satisfies Record<string, PendingKind>;

export type PendingBlockId = keyof typeof PENDING_BLOCKS;

export interface BuildFlags {
  preview: boolean;
  dev: boolean;
}

export function currentBuildFlags(): BuildFlags {
  return { preview: IS_PREVIEW, dev: import.meta.env.DEV };
}

export function isBadgeVisible(kind: PendingKind, flags: BuildFlags): boolean {
  return kind === 'placeholder' || flags.preview || flags.dev;
}

/** Whether a block shows the pending badge in this build. */
export function showsPendingBadge(
  block: PendingBlockId,
  flags: BuildFlags = currentBuildFlags(),
): boolean {
  return isBadgeVisible(PENDING_BLOCKS[block], flags);
}
