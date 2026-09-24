import base from './playwright.config';
export default {
  ...base,
  use: { ...(base.use ?? {}), launchOptions: { executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' } },
  projects: (base.projects ?? []).map((p: any) => ({ ...p, use: { ...(p.use ?? {}), launchOptions: { executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' } } })),
};
