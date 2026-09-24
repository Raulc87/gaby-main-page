// Serves the built dist/ directory with the same /api proxy as
// astro.config.mjs, for the Playwright suite's webServer
// (playwright.config.ts, tests/e2e/**).
//
// `npm run preview` (astro preview) is not used here: this Astro version's
// preview command self-daemonizes (prints "Preview server running... pid
// N" and exits 0 immediately), which Playwright's webServer treats as the
// process exiting early rather than as a live server to track. Calling
// Vite's own preview() API directly gives a plain, foreground, blocking
// server instead, with no daemon involved.
import { preview } from 'vite';

const server = await preview({
  root: process.cwd(),
  build: { outDir: 'dist' },
  preview: {
    // Explicit IPv4 loopback, not the default `localhost`: on some CI
    // runners `localhost` resolves to `::1` first, so the server would
    // bind IPv6-only while Playwright's webServer health check hits
    // `http://127.0.0.1:4321` (playwright.config.ts) — a silent bind
    // mismatch that manifests as a 60s "waiting for webServer" timeout
    // with no error from either side.
    host: '127.0.0.1',
    port: 4321,
    strictPort: true,
    proxy: {
      // Mirrors astro.config.mjs's vite.preview.proxy (LEAD_API_CONTRACT.md
      // section 9: local dev proxies to the Flask server on 127.0.0.1:5000).
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
});

server.printUrls();
