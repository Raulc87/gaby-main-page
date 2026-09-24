import { defineConfig, devices } from '@playwright/test';

// tests/e2e/** exercises the real Flask backend (LEADS_STORAGE=memory) per
// LEAD_API_CONTRACT.md section 10 and IMPLEMENTATION_PLAN.md section 12.
// This webServer only starts the frontend (build + preview): the backend is
// started separately (docs/runbooks/LOCAL_DEVELOPMENT.md section 7,
// .github/workflows/frontend.yml's e2e job), matching how the same job
// already manages the backend process independently of Playwright.
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      // Runs every spec except responsive.spec.ts, which needs the 390px
      // mobile project below instead.
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: '**/responsive.spec.ts',
    },
    {
      // US-008 AC1 / IMPLEMENTATION_PLAN.md section 12: 390 px viewport,
      // no horizontal scroll through the full flow. Forces chromium
      // (devices['iPhone 13'] defaults to webkit) so this project runs
      // wherever chromium is installed, without requiring webkit too.
      name: 'mobile-390',
      use: { ...devices['iPhone 13'], browserName: 'chromium' },
      testMatch: '**/responsive.spec.ts',
    },
  ],
  webServer: {
    // Not `npm run preview`: see scripts/e2e-preview-server.mjs for why.
    command: 'npm run build && node scripts/e2e-preview-server.mjs',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
  },
});
