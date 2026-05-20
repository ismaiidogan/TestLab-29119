# Deployment

TestLab 29119 is hosted on **GitHub Pages** as a static site.

---

## Live URL

**https://ismaiidogan.github.io/TestLab-29119/**

---

## How deployment works

1. Source files (`index.html`, `js/`, `css/`) live on the `main` branch.  
2. GitHub Actions workflow [`.github/workflows/pages.yml`](https://github.com/ismaiidogan/TestLab-29119/blob/main/.github/workflows/pages.yml) deploys on push to `main`.  
3. `.nojekyll` at the repository root disables Jekyll processing.  

### Enable Pages (one-time)

Repository → **Settings** → **Pages** → **Build and deployment** → Source: **GitHub Actions**.

After the workflow completes, the site is public within a few minutes.

---

## Updating the live game

```bash
git add .
git commit -m "Your change description"
git push origin main
```

Wait for the **Deploy to GitHub Pages** action to finish (Actions tab).

---

## Wiki

Extended documentation: **https://github.com/ismaiidogan/TestLab-29119/wiki**

Wiki pages can be edited on GitHub under the repository **Wiki** tab.

---

## Local preview before deploy

```bash
npm start
# open http://localhost:3000
npm test
```

---

## Related pages

- [For Developers](For-Developers)  
- [Home](Home)
