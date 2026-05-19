# Game Phases

TestLab 29119 consists of **four scored phases** plus a results screen. Each phase targets a different competency from ISO/IEC 29119-4.

| Phase | Name | Max points | Competency |
|-------|------|------------|------------|
| 1 | Classify | 110 | Recognize technique categories |
| 2 | Apply | 195 | Choose techniques for scenarios |
| 3 | Strategize | 110 | Select technique mix under constraints |
| 4 | Test Cases | 85 | Design EP + BVA coverage |

---

## Phase 1 — Classify the Techniques

**Goal:** Drag each of **15 technique cards** into the correct category.

| Drop zone | Category |
|-----------|----------|
| Blue | Specification-Based |
| Green | Structure-Based |
| Red | Experience-Based |

### Actions

1. Drag cards from the pool into a zone.  
2. Click **i** on a card for ISO details (clause, description, best use).  
3. Optional: **Hint** (costs 4 points per card, first use only).  
4. When all cards are placed, click **Check Answers**.  
5. Review feedback on incorrect cards, then **Continue to Phase 2**.

### Scoring (Phase 1)

- 6 points per correct classification  
- +20 bonus if all 15 are correct  
- Hint penalties subtracted from phase total  

See [Technique Reference](Technique-Reference) for the full list of techniques.

---

## Phase 2 — Apply to Scenarios

**Goal:** Complete **9 multiple-choice scenarios** by selecting the best technique or combination.

### Features

- Real-world contexts (login forms, e-commerce, insurance, legacy systems, coverage traps).  
- **ISO/IEC 25010** quality badge on each scenario header.  
- Some scenarios use **comparison mode** (e.g. EP vs BVA, Exploratory vs Ad Hoc, Statement vs Branch coverage).  
- Keyboard shortcuts: **A**, **B**, **C**, **D** to select; **Escape** to close modals.

### Flow

1. Read the scenario and question.  
2. Select an option; read correct/wrong feedback.  
3. Note any **misconception** highlighted—these appear again on the results screen.  
4. Click **Next Scenario** until all nine are done.

### Scoring (Phase 2)

20–25 points per scenario (maximum **195** for the phase).

---

## Phase 3 — Build Your Test Strategy

**Goal:** For each of **three projects**, select up to **five** test techniques that best fit the stated constraints.

| Project | Context |
|---------|---------|
| MedSafe | Safety-critical healthcare system |
| QuickMVP | Time-boxed startup food delivery app |
| MigrateX | Legacy ERP migration with poor documentation |

### Constraints displayed

Each project shows Clause 4–style factors: risk, budget, timeline, team, and documentation availability.

### Actions

1. Read the project description and constraints.  
2. Click techniques to select (maximum 5).  
3. Click **Submit Strategy**.  
4. Review your score, optimal selection, expert analysis, and key insight.  
5. Proceed to the next project or **Continue to Phase 4**.

### Important

There is **no single fixed algorithm** for the “correct” strategy—professional judgment matters. Partial credit is awarded based on technique suitability values.

---

## Phase 4 — Write Your Test Cases

**Goal:** For **two exercises**, select all **required** equivalence-partitioning and boundary-value test cases.

| Exercise | Topic |
|----------|--------|
| 1 | Username field (5–20 characters) |
| 2 | Age field (18–65 inclusive) |

### Actions

1. Click rows to toggle selection.  
2. Click **Submit**.  
3. Review coverage feedback (correct, missed, or unnecessary items).  
4. **Next Exercise** or **See Final Results**.

### Scoring (Phase 4)

- 6 points per required item selected  
- Small penalty for selecting out-of-scope items  
- Maximum **42** and **43** points per exercise (85 total)

---

## Results screen

After Phase 4 you receive:

- Total score and **grade tier** (see [Scoring and Certification](Scoring-and-Certification))  
- Per-phase breakdown  
- List of **misconceptions** encountered  
- **Phase 3 key insights**  
- Hint usage summary  
- **Download Certificate** (PNG)  
- **Play Again** to restart  

---

## Related pages

- [Getting Started](Getting-Started)  
- [ISO Standards Alignment](ISO-Standards-Alignment)  
- [Screenshot Walkthrough](Screenshot-Walkthrough)
