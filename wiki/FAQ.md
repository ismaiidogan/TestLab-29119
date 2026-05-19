# FAQ

Frequently asked questions about TestLab 29119.

---

## General

### Do I need to install anything?

No. Open the [live game](https://ismaiidogan.github.io/TestLab-29119/) in a modern browser.

### How long does a full playthrough take?

Approximately **25–40 minutes** on first attempt, depending on reading speed and hint usage.

### Can I skip the tutorial?

Yes. Click **Skip** on the tutorial screen to go directly to Phase 1.

---

## Scoring and progress

### What is the maximum score?

**500 points** across four phases. See [Scoring and Certification](Scoring-and-Certification).

### Do hints affect my score?

Yes. Each hint in Phase 1 costs **4 points** (first use per card only).

### Can I replay without losing my best score?

**Play Again** resets the current run but keeps your **Best** score in `localStorage` if the new run is lower.

### Why is my leaderboard empty?

Scores are stored **only in your browser**. Another device or cleared browser data will not show previous entries.

---

## Gameplay

### Can I use the keyboard in Phase 2?

Yes. Press **A**, **B**, **C**, or **D** to select options. **Escape** closes modals.

### Is there one correct strategy in Phase 3?

There is an **optimal** selection per project, but the game teaches that real-world choice depends on context. Partial credit reflects suitability, not only exact matches.

### What happens if I select extra items in Phase 4?

Out-of-scope selections incur a small **penalty** (−2 per extra item).

---

## Technical

### Does the game work offline?

Partially. Core gameplay works offline after the first load, but **Google Fonts** may fall back to system fonts without internet.

### Is my data sent to a server?

No. Name, scores, and leaderboard data stay in **localStorage** on your device. The certificate is generated locally.

### The site shows 404 on GitHub Pages

Wait 2–5 minutes after deployment. Ensure repository **Settings → Pages** uses **GitHub Actions** and the workflow completed successfully.

---

## Course and standards

### Which standards does the game cover?

**ISO/IEC 29119-4** (test techniques) and **ISO/IEC 25010** (quality characteristics in Phase 2). See [ISO Standards Alignment](ISO-Standards-Alignment).

### Where is the PDF user manual?

In the repository: `docs/USER_MANUAL.pdf` (also linked from the main README).

---

## Related pages

- [Getting Started](Getting-Started)  
- [Game Phases](Game-Phases)  
- [For Developers](For-Developers)
