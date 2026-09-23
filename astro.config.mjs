import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// See docs/decisions/ADR-001_BACKEND_HOSTING.md and docs/decisions/ADR-003_I18N_ROUTING.md.
export default defineConfig({
  output: 'static',
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
  },
});
