# Technique Reference

All **15 test design techniques** used in Phase 1 (classification) are defined in ISO/IEC 29119-4. Click **i** on any card in-game for full details.

---

## Specification-Based

Derived from requirements and functional specifications.

| Abbr | Technique | ISO clause | Best for |
|------|-----------|------------|----------|
| EP | Equivalence Partitioning | 5.4 | Input validation, numeric ranges, login forms |
| BVA | Boundary Value Analysis | 5.5 | Boundaries of partitions (e.g. 4, 5, 20, 21 chars) |
| DT | Decision Table Testing | 5.7 | Multi-condition business rules |
| ST | State Transition Testing | 5.8 | Order flows, workflows, identifiable states |
| UCT | Use Case Testing | 5.9 | End-to-end user journeys |
| CTM | Classification Tree Method | 5.6 | Complex configuration / parameter spaces |
| PW | Pairwise Testing | 5.3 | Multi-parameter combination reduction |

**Common pairs:** EP + BVA; DT + ST; CTM + PW.

---

## Structure-Based

Derived from internal code or system architecture.

| Abbr | Technique | ISO clause | Best for |
|------|-----------|------------|----------|
| SC | Statement Coverage | 6.2 | Executing every statement at least once |
| BC | Branch Coverage | 6.3 | Every decision branch outcome |
| PC | Path Coverage | 6.4 | Every execution path (exhaustive) |
| MC/DC | MC/DC Coverage | 6.5 | Safety-critical systems (e.g. DO-178C) |

**Note:** Statement coverage is **weaker** than branch coverage; 100% SC does not imply 100% BC.

---

## Experience-Based

Derived from tester expertise, intuition, and domain knowledge.

| Abbr | Technique | ISO clause | Best for |
|------|-----------|------------|----------|
| EG | Error Guessing | 7.2 | Historical defect areas, payment flows |
| CBT | Checklist-Based Testing | 7.4 | Regression, compliance checklists |
| ET | Exploratory Testing | 7.3 | Undocumented systems, time-boxed charters |
| AHT | Ad Hoc Testing | 7.5 | Quick informal smoke checks |

**Note:** Exploratory Testing uses a **charter** and produces documented findings; Ad Hoc Testing does not.

---

## In-game glossary

The navbar **book icon** opens a searchable reference panel with additional terms (Clause 4, ISO 25010, equivalence class, risk-based testing, etc.).

---

## Related pages

- [ISO Standards Alignment](ISO-Standards-Alignment)  
- [Game Phases](Game-Phases)
