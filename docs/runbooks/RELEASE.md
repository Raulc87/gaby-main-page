# RELEASE — Gabriela Kelly website

- Version: 0.1 (preview section only)
- Last updated: 2026-10-16
- Related: `docs/decisions/ADR-005_BRANCHING_AND_RELEASE_MODEL.md`, `docs/specs/USER_STORIES.md` (US-027), `docs/process/RUNBOOK_STYLE.md`

This runbook has one section today: the **preview**. The production release, smoke-test and rollback sections come with the hosting decision (ADR-005 decision 4) and are added before the first production release.

## Values to have ready

| Name | Value |
|---|---|
| Preview URL | `https://raulc87.github.io/gaby-main-page/` |
| Spanish Home | `https://raulc87.github.io/gaby-main-page/es/` |
| English Home | `https://raulc87.github.io/gaby-main-page/en/` |
| Workflow runs | `https://github.com/Raulc87/gaby-main-page/actions/workflows/preview.yml` |
| Pages settings | `https://github.com/Raulc87/gaby-main-page/settings/pages` |

## 1. What the preview is

- A copy of `main`, built in preview mode and published to GitHub Pages by `.github/workflows/preview.yml`.
- It updates by itself after every merge to `main`, usually within a few minutes. You can also run it by hand (section 4).
- It is for Gaby and the team to follow progress. It is not the production site.

## 2. What the preview does not do

- No backend: nothing is saved, no lead reaches the Google Sheet, no email is sent.
- Forms send nothing. After the visitor's answers are checked in the browser, the form shows the next screen as a demonstration with the note "This is a demonstration: nothing was sent or saved." (Spanish: "Esto es una demostración: no se envió ni se guardó nada.").
- The scheduler is a static box, never the real Calendly.
- Search engines are asked not to index it (`noindex` on every page).
- Pending content (placeholders, provisional copy) shows the pending badge. That is expected.
- It has no password: the address is public to anyone who has it. Do not put private material in the repository.

## 3. One-time setting (human owner)

Do this once, before the first publish. Without it the deploy job fails.

1. Open the Pages settings link from the values table.
2. Under **Build and deployment**, open the **Source** dropdown and choose **GitHub Actions**.

Success: the page shows "Your site is ready to be published" or, after the first run, "Your site is live at" with the preview URL. No other setting is needed, and no secret is added.

If the dropdown shows "Deploy from a branch", choose **GitHub Actions** and leave the rest as it is.

## 4. Publish by hand (optional)

A merge to `main` publishes by itself. To republish without a merge:

1. Open the workflow runs link from the values table.
2. Click **Run workflow** (top right of the run list).
3. Leave the branch as `main`, then click the green **Run workflow** button.

Success: a new run named **Preview** appears at the top within a few seconds and ends with a green check.

## 5. Check a publish

### 5.1 The workflow run

1. Open the workflow runs link from the values table.
2. Open the newest run.

Success: both jobs, **build** and **deploy**, have a green check. The **deploy** job shows the preview URL.

### 5.2 The commit shown

Each run is titled with the commit it published. It must be the latest commit on `main`.

1. Open `https://github.com/Raulc87/gaby-main-page/commits/main`.
2. Compare its newest commit with the commit named in the newest **Preview** run.

Success: both show the same commit.

### 5.3 In the browser (no terminal)

1. Open the preview URL.
2. Check that the page loads in Spanish or English (the browser language decides) and that a slim dark bar with "Vista previa" or "Preview" is above the header.
3. Click the **ES | EN** toggle, a menu link and the VIP link.

Success: the preview bar is visible on every page, the toggle shows the same page in the other language, and no link or image is broken or sends you outside the `/gaby-main-page/` path.

### 5.4 In the terminal: `noindex`

On macOS or Linux:

```bash
curl -s https://raulc87.github.io/gaby-main-page/es/ | grep -i noindex
```

On Windows (PowerShell):

```powershell
(Invoke-WebRequest -UseBasicParsing https://raulc87.github.io/gaby-main-page/es/).Content | Select-String -Pattern noindex
```

Success: one line containing `<meta name="robots" content="noindex` appears. No output means the page is missing `noindex`: go to the troubleshooting table.

### 5.5 In the browser: the forms send nothing

1. Open the Spanish VIP page: `https://raulc87.github.io/gaby-main-page/es/mentoria-vip/`.
2. Open the browser's developer tools and select the **Network** tab.
3. Fill the application form with made-up data (no real person's data) and submit it.

Success: the demonstration screen with the "nothing was sent" note appears, and the Network tab lists no request to `/api` and none to `calendly.com`.

## 6. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| The **deploy** job fails with an error about Pages not being enabled, or a 404 | The one-time setting (section 3) was not done | Do section 3, then run section 4 |
| The preview URL shows a GitHub 404 page | No successful publish yet, or the Pages source is not **GitHub Actions** | Check section 3, then section 5.1 |
| The page loads but is unstyled, or images and links are broken | The build did not use the base path `/gaby-main-page/` | Open the **build** job log and check that the build step ran with the preview settings. Ask the agent that owns the workflow to fix it |
| The preview shows older content than `main` | The newest run failed or has not finished, or an older run finished after a newer one | Open the workflow runs, wait for the newest run, or run section 4 again |
| No preview bar | The build did not run in preview mode | Open the **build** job log and check the preview settings; do not share the link until fixed |
| `noindex` missing | Same as above | Same as above |
| The form sends a request to `/api` or loads Calendly | Forms are not in preview mode | Stop sharing the link and tell the project owner and the agent that owns the form: this is a blocker for the preview |
| The workflow does not start after a merge | Actions are disabled, or the workflow file is not on `main` | Open the repository's **Actions** tab and enable workflows; check that `.github/workflows/preview.yml` exists on `main` |
