/// <reference types="astro/client" />

// PUBLIC_* build-time variables consumed by src/lib/lead/config.ts
// (docs/specs/LEAD_API_CONTRACT.md section 9) and by src/lib/site/preview.ts
// (`PUBLIC_PREVIEW=true` marks a preview build, ADR-005).
interface ImportMetaEnv {
  readonly PUBLIC_LEAD_ENDPOINT?: string;
  readonly PUBLIC_CALCULATOR_ENDPOINT?: string;
  readonly PUBLIC_SCHEDULER_URL?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
  readonly PUBLIC_PREVIEW?: string;
}
