# TestLab 29119

Browser-based educational game for **ISO/IEC 29119-4** test design techniques and **ISO/IEC 25010** quality characteristics. No build step or backend required.

**Live demo:** https://ismaiidogan.github.io/TestLab-29119/

## Documentation

| Resource | Description |
|----------|-------------|
| [GitHub Wiki](https://github.com/ismaiidogan/TestLab-29119/wiki) | Full player guide, standards reference, FAQ |
| [User Manual (PDF)](docs/USER_MANUAL.pdf) | Course submission — player guide with screenshots |
| [Teaching effectiveness (PDF)](docs/TEACHING_EFFECTIVENESS.pdf) | One-page pedagogical rationale |
| [docs/README.md](docs/README.md) | Document index and PDF regeneration |

## Quick start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Alternative (no npm)

```bash
python -m http.server 3000
# or: npx serve . -p 3000
```

Then open `http://localhost:3000/index.html`.

## Game flow

1. **Welcome** — Enter name and school (optional).
2. **Tutorial** — Six slides on technique categories and Clause 4 selection criteria.
3. **Phase 1 — Classify** — Drag 15 techniques into Specification / Structure / Experience categories.
4. **Phase 2 — Apply** — Nine scenario-based multiple-choice questions.
5. **Phase 3 — Strategize** — Choose test techniques for three project simulations.
6. **Phase 4 — Test cases** — Select required EP and BVA test cases.
7. **Results** — Score breakdown, misconceptions, certificate download, local leaderboard.

Maximum score: **500** points (110 + 195 + 110 + 85).

## Project structure

| Path | Description |
|------|-------------|
| `index.html` | App shell and screen markup |
| `js/data.js` | Techniques, scenarios, scoring constants |
| `js/main.js` | Game logic, UI, persistence |
| `css/style.css` | Themes and layout |
| `tests/smoke.spec.js` | Playwright end-to-end smoke tests |

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Serve the app on port 3000 |
| `npm test` | Run Playwright smoke tests |
| `npm run pdf` | Regenerate course PDFs from `docs/*.md` |
| `npm run screenshots` | Capture UI screenshots for the user manual |
| `npm run wiki` | Publish `wiki/` to GitHub Wiki |

## Persistence

Scores and theme are stored in `localStorage` (`testlab-best`, `testlab_leaderboard`, `testlab_theme`). Leaderboard data is client-side only and not validated on a server.

## License

ISC (see `package.json`).
