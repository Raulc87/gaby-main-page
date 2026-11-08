// Frontend build-time configuration (docs/specs/LEAD_API_CONTRACT.md section 9).
// Falls back to documented defaults so the prototype works locally without a
// `.env` file (PROJECT_CONTEXT.md: current placeholder contact email).

export const LEAD_ENDPOINT: string = import.meta.env.PUBLIC_LEAD_ENDPOINT || '/api/save-lead';

export const CALCULATOR_ENDPOINT: string =
  import.meta.env.PUBLIC_CALCULATOR_ENDPOINT || '/api/save-calculator-lead';

export const CALENDLY_URL: string = import.meta.env.PUBLIC_CALENDLY_URL || '';

export const CONTACT_EMAIL: string =
  import.meta.env.PUBLIC_CONTACT_EMAIL || 'gkelly@poliartcr.com';
