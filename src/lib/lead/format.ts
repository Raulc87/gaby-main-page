// Splits a copy string containing one `{token}` placeholder into the text
// before and after it, so callers can render the placeholder as a real
// element (a mailto link, the privacy notice trigger) instead of plain text.
export interface TemplateParts {
  before: string;
  after: string;
}

export function splitTemplate(template: string, token: string): TemplateParts {
  const placeholder = `{${token}}`;
  const index = template.indexOf(placeholder);
  if (index === -1) {
    return { before: template, after: '' };
  }
  return {
    before: template.slice(0, index),
    after: template.slice(index + placeholder.length),
  };
}
