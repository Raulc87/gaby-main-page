// Preview builds (ADR-005, UX_UI_DIRECTION.md section 6.6): `PUBLIC_PREVIEW=true`
// at build time. A preview is noindex, shows the preview bar and the pending
// badges, and its forms never call an endpoint or load a third party (US-027).
export function isPreviewBuild(env: { PUBLIC_PREVIEW?: string } = import.meta.env): boolean {
  return env.PUBLIC_PREVIEW === 'true';
}

export const IS_PREVIEW: boolean = isPreviewBuild();
