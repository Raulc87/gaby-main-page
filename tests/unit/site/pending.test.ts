// UX_UI_DIRECTION.md sections 6.5 and 7, CONTENT.md -> Metadata -> Pending badge:
// placeholders show the badge in every build; provisional copy blocks in preview
// and development builds only.
import { describe, expect, it } from 'vitest';
import { isPreviewBuild } from '../../../src/lib/site/preview';
import {
  PENDING_BLOCKS,
  isBadgeVisible,
  showsPendingBadge,
  type PendingBlockId,
} from '../../../src/lib/site/pending';

const production = { preview: false, dev: false };
const preview = { preview: true, dev: false };
const development = { preview: false, dev: true };

describe('pending badge visibility', () => {
  it('shows a placeholder in every build, production included', () => {
    for (const flags of [production, preview, development]) {
      expect(isBadgeVisible('placeholder', flags)).toBe(true);
    }
  });

  it('shows provisional copy only in preview and development builds', () => {
    expect(isBadgeVisible('provisional', production)).toBe(false);
    expect(isBadgeVisible('provisional', preview)).toBe(true);
    expect(isBadgeVisible('provisional', development)).toBe(true);
  });

  it('tags the blocks listed in CONTENT.md', () => {
    const placeholders: PendingBlockId[] = [
      'home.testimonials',
      'story.photo',
      'story.bio',
      'vip.video',
      'resource.file_pending',
    ];
    const provisional: PendingBlockId[] = [
      'home.method',
      'vip.steps',
      'thanks.not_ready',
      'resource.provisional_title',
    ];
    for (const block of placeholders) expect(PENDING_BLOCKS[block]).toBe('placeholder');
    for (const block of provisional) expect(PENDING_BLOCKS[block]).toBe('provisional');
  });

  it('resolves a block through its kind', () => {
    expect(showsPendingBadge('vip.video', production)).toBe(true);
    expect(showsPendingBadge('home.method', production)).toBe(false);
    expect(showsPendingBadge('home.method', preview)).toBe(true);
  });
});

describe('preview flag', () => {
  it('is on only for PUBLIC_PREVIEW=true', () => {
    expect(isPreviewBuild({ PUBLIC_PREVIEW: 'true' })).toBe(true);
    expect(isPreviewBuild({ PUBLIC_PREVIEW: 'false' })).toBe(false);
    expect(isPreviewBuild({ PUBLIC_PREVIEW: '' })).toBe(false);
    expect(isPreviewBuild({})).toBe(false);
  });
});
