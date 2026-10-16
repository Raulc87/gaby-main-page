// Headings in docs/ux/CONTENT.md mark italic emphasis with `*text*` (rendered in
// Playfair italic, heritage-blue). The asterisks are not part of the text.
export interface HeadingSegment {
  text: string;
  emphasis: boolean;
}

export function parseEmphasis(value: string): HeadingSegment[] {
  return value
    .split(/\*([^*]+)\*/)
    .map((text, index) => ({ text, emphasis: index % 2 === 1 }))
    .filter((segment) => segment.text !== '');
}
