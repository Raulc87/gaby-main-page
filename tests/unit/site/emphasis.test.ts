// CONTENT.md: `*text*` marks the italic emphasis inside a heading.
import { describe, expect, it } from 'vitest';
import { parseEmphasis } from '../../../src/lib/site/emphasis';

describe('parseEmphasis', () => {
  it('splits a heading into plain and emphasized parts without the asterisks', () => {
    expect(parseEmphasis('¿Quieres trabajar *directamente conmigo*?')).toEqual([
      { text: '¿Quieres trabajar ', emphasis: false },
      { text: 'directamente conmigo', emphasis: true },
      { text: '?', emphasis: false },
    ]);
  });

  it('handles emphasis at the end and text without emphasis', () => {
    expect(parseEmphasis('Do you want to work *directly with me*?').map((s) => s.emphasis)).toEqual([
      false,
      true,
      false,
    ]);
    expect(parseEmphasis('No emphasis')).toEqual([{ text: 'No emphasis', emphasis: false }]);
  });
});
