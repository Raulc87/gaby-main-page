/// <reference types="astro/client" />

// PUBLIC_* build-time variables consumed by src/lib/lead/config.ts
// (docs/specs/LEAD_API_CONTRACT.md section 9).
interface ImportMetaEnv {
  readonly PUBLIC_LEAD_ENDPOINT?: string;
  readonly PUBLIC_CALENDLY_URL?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
}
