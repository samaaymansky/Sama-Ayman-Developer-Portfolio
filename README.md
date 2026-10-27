# Sama Ayman — Developer Portfolio

This repository contains the React, TypeScript, and Vite source code for my portfolio.

## Preview on your computer

1. Install [Node.js 22](https://nodejs.org/) if it is not already installed.
2. Open this folder in VS Code.
3. If this is a fresh checkout, open the Command Palette (`Ctrl+Shift+P`), choose **Tasks: Run Task**, then choose **Install dependencies**. You only need to do this once (or again after dependencies change).
4. Press **F5** and choose **Launch portfolio in Chrome** if VS Code asks. VS Code starts the development server on port 3000 and opens the site in Chrome.

You can also open the VS Code terminal and run `npm run dev`. Open the local address shown by Vite, usually <http://localhost:3000/Sama-Ayman-Developer-portfolio/>.

## Publish the site

Publishing is automatic after the one-time GitHub setup below:

1. Save your changes in VS Code.
2. Open **Source Control** in VS Code, enter a commit message, and select **Commit**.
3. Select **Sync Changes** (or push the commit to the `main` branch).
4. GitHub Actions builds and publishes the site. Check the **Actions** tab in the repository to see when deployment finishes.

The published site will be at <https://samaaymansky.github.io/Sama-Ayman-Developer-portfolio/>.

## One-time GitHub setup

In the repository on GitHub, open **Settings → Pages**. Under **Build and deployment**, set **Source** to **GitHub Actions**. The workflow in `.github/workflows/deploy.yml` handles the build and deployment on each push to `main`.

If the workflow cannot deploy, open **Settings → Actions → General → Workflow permissions** and allow workflows to have read and write permissions. Save the setting, then push to `main` again or rerun the failed workflow from **Actions**.

## Common problems

### PowerShell says that running scripts is disabled

Open PowerShell and run this once for your Windows account:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Confirm the prompt with **Y**. This allows locally installed developer tools such as npm to run without changing the policy for other users on your computer. The VS Code tasks use `npm.cmd` and do not depend on this PowerShell policy.

### The local page is a white or blank screen

- Make sure the Vite server is running. Press **F5** again, or check the VS Code **Terminal** panel for errors.
- Try a full browser refresh with `Ctrl+Shift+R`.
- If dependencies are missing, run the **Install dependencies** VS Code task, then press **F5** again.
- Check the browser developer tools (**F12 → Console**) for a red error message.

### The deployed page is blank

- Check **Actions** on GitHub and confirm the latest **Deploy to GitHub Pages** workflow succeeded.
- Confirm the repository's Pages source is **GitHub Actions** under **Settings → Pages**.
- Open the exact project site URL above, including `/Sama-Ayman-Developer-portfolio/`. The Vite build uses this repository path so its scripts and assets load from the right location.
- After a successful deployment, wait a minute and refresh the page with `Ctrl+Shift+R`.
