import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// The base path comes from SITE_BASE_PATH (default "/"): the GitHub Pages preview
// builds with "/gaby-main-page/" (ADR-005), production at the domain root. All
// links and assets are built from import.meta.env.BASE_URL (src/lib/site/links.ts).
const basePath = (process.env.SITE_BASE_PATH ?? '').replace(/^\/+|\/+$/g, '');

// See docs/decisions/ADR-001_BACKEND_HOSTING.md and docs/decisions/ADR-003_I18N_ROUTING.md.
export default defineConfig({
  output: 'static',
  base: basePath ? `/${basePath}/` : '/',
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        // Local dev only. In production the Python app is mounted at /api on
        // the same origin (see LEAD_API_CONTRACT.md section 9, ADR-001).
        '/api': {
          target: 'http://127.0.0.1:5000',
          changeOrigin: true,
        },
      },
    },
    preview: {
      // Same proxy for `astro preview`, so the built app also works against
      // the real backend — used by the Playwright e2e suite's webServer
      // (tests/e2e/**, playwright.config.ts) and by .github/workflows/frontend.yml.
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5000',
          changeOrigin: true,
        },
      },
    },
  },
});
