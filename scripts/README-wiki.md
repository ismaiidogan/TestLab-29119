# GitHub Wiki — Maintainer Guide

Wiki source files live in the [`wiki/`](../wiki/) folder. The published wiki is at:

**https://github.com/ismaiidogan/TestLab-29119/wiki**

## First-time setup

1. Open https://github.com/ismaiidogan/TestLab-29119/settings  
2. Under **Features**, enable **Wikis**  
3. Optionally create the first page on GitHub (any title) so the wiki git repository exists  

## Publish updates

After editing files in `wiki/`:

```powershell
.\scripts\push-wiki.ps1
```

Or:

```bash
npm run wiki
```

The script clones `TestLab-29119.wiki.git`, copies all `wiki/*.md` files, commits, and pushes.

## Page structure

| File | Role |
|------|------|
| `Home.md` | Wiki home page |
| `_Sidebar.md` | Left navigation |
| `_Footer.md` | Page footer |
| Other `*.md` | Content pages (link without `.md` extension) |

## Editing tips

- Use absolute wiki URLs in tables: `https://github.com/ismaiidogan/TestLab-29119/wiki/Page-Name`  
- Or wikilinks outside tables: `[[Page-Name]]`  
- Screenshots on the wiki use `raw.githubusercontent.com` URLs pointing to `docs/screenshots/` on `main`  

## Sync with main repo

When you change wiki content, commit `wiki/` to the main repository **and** run `push-wiki.ps1` so the GitHub Wiki UI stays in sync.
