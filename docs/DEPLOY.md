# Deploy TestLab 29119 to GitHub Pages

Follow these steps once to obtain your **public game URL** (Deliverable 1).

## 1. Create a GitHub repository

1. Go to [github.com/new](https://github.com/new).
2. Name it e.g. `testlab-game` (public or private with Pages enabled).
3. Do **not** add a README if you already have one locally.

## 2. Push this project

From the project folder (PowerShell):

```powershell
git init
git add .
git commit -m "TestLab 29119 — SENG 436 deliverables"
git branch -M main
git remote add origin https://github.com/ismaiidogan/TestLab-29119.git
git push -u origin main
```

## 3. Enable GitHub Pages

1. Repository → **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, choose **GitHub Actions**.
3. After the workflow **Deploy to GitHub Pages** completes (Actions tab), your site is live.

Alternatively: Source = **Deploy from branch** → `main` → `/ (root)`.

## 4. Your game URL

```
https://ismaiidogan.github.io/TestLab-29119/
```

Open in an incognito window and play through Welcome → 4 phases → Results.

## 5. Update documentation URLs

## Troubleshooting

- **404:** Wait 2–5 minutes after first deploy; ensure `index.html` is at repo root.
- **Blank page:** Check browser console; do not deploy `node_modules` (listed in `.gitignore`).
- **Workflow fails:** Ensure Settings → Pages → Source is **GitHub Actions**.
