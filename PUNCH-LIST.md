# Search Desk — punch list

Status 2026-08-15 (evening). App: https://mycareercommand.lovable.app ·
Lovable project `15048548-4c4d-4b1a-b413-0b56270c85d7` · repo synced to GitHub, pushes are manual.

**VERIFIED** = I checked it, by querying the database or reading the source.
**BUILT, UNCHECKED** = the code exists but nobody has used it.
**IN FLIGHT** = queued with Lovable, not landed.
**OPEN** = not started. **YOURS** = only Jason can do it.

---

## The finding that matters most

Not a task, but it should steer the next month of work.

Restated 2026-08-15 after the August LinkedIn export added 106 applications.

| Channel | Applications | Reached interview | Rate |
|---|---|---|---|
| Direct email to a named person | 14 | 5 | **35.7%** |
| Recruiter | 1 | 1 | — |
| Company ATS | 75 | 1 | **1.3%** |
| LinkedIn | 106 | 0 | **0%** |

| Geography | Applications | Reached interview | Rate |
|---|---|---|---|
| South Africa | 17 | 4 | **23.5%** |
| Offshore | 73 | 3 | **4.1%** |

The self-serve channels together are **181 applications for 1 interview**. Every other positive
outcome came from the 15 applications where a named human was involved. Caveat: 7 positive
outcomes total, so directional, not proven.

**Two earlier claims did not survive the new data.** "151 applications Nov–Apr produced zero
interviews, the 18 sent in July produced six" is wrong on both halves. Actual monthly volume:

| | Nov | Dec | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug |
|---|---|---|---|---|---|---|---|---|---|---|
| Applications | 8 | 5 | 9 | 7 | 16 | 35 | 49 | 15 | 45 | 6 |
| Reached interview | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 5 | 0 |

July was not a low-volume month. It was the joint-heaviest. What changed in July was channel, not
restraint. The "volume stopped, targeting started" story should be dropped.

---

## A. Data

| | Item | State |
|---|---|---|
| A1 | **196** applications, Oct 2025 → Aug 2026 — 90 reconciled from four sources, plus 106 merged from the 15 Aug LinkedIn export (`channel = LinkedIn`, `Applied`, outcome not recorded) | VERIFIED |
| A2 | 247 contacts · 459 threads · 6 debriefs · 9 warm touches | VERIFIED |
| A3 | `channel` set on all 90 (was 20) | VERIFIED |
| A4 | Unresolved outcomes down to **4** (was 34) | VERIFIED |
| A5 | 6 assessments + 3 development areas seeded | VERIFIED |
| A6 | Work-search log for court/unemployment — **301 rows**, runs 5 Nov 2025 to 13 Aug 2026. Was already current to August; 11 same-company-same-day applications had been deduped away and are now restored. Backup at `work-search-log.backup-2026-08-15.csv` | VERIFIED |
| A7 | ~~LinkedIn Apr–Aug applications~~ — 15 Aug export merged, 106 rows added | VERIFIED |
| A8 | **12 applications still called "Role TBC"** — export named none of them, so these were not LinkedIn applications. One exception: Wellness Warehouse 28 Apr is either "Category Manager, Clean Fitness" or "Space Planner", both applied that day. Your recall needed | YOURS |
| A9 | **3 debriefs still contain `[Add]`** — incl. Shammeera, 1 Aug | YOURS |
| A11 | **1,107 people replied to Jason and never got an answer** — two-year window, computed from the Aug export. Import CSVs written to `output/app-seed/` | READY — import is yours |
| A12 | Thread rule settled: keep **last 2 years**, ball = who spoke last. Refresh **quarterly** from a new LinkedIn export | AGREED |
| A10 | ~~449 of 459 threads have no company~~ — filled from `Connections.csv` by LinkedIn URL, **446 of 459** now have a company; 13 left are people he messaged without connecting | VERIFIED |

## B. App — verified

| | Item | State |
|---|---|---|
| B1 | Auth gate + RLS blocking anonymous reads | VERIFIED |
| B2 | Soft delete, undo, recycle bin — tested end to end | VERIFIED |
| B3 | Autosave + flush-before-commit (the data-loss fix) — read the source | VERIFIED |
| B4 | Fit badge computes live when no score stored | VERIFIED |
| B5 | Loop-close preview with editable text before copy | VERIFIED (in source) |

## C. App — built, nobody has used it

Nine screens exist as components. None have been exercised.

| | Item |
|---|---|
| C1 | Review mode (fortnightly guided pass) — `ReviewView.tsx` |
| C2 | Strategy view — `StrategyView.tsx` |
| C3 | Things to work on — `WorkOnPanel.tsx` |
| C4 | Effort-over-time chart — `EffortChart.tsx` |
| C5 | Voice-note debriefs — `VoiceNote.tsx` |
| C6 | Refresh control — `RefreshControl.tsx` |
| C7 | Assessments view — `AssessmentsView.tsx` |
| C8 | Resolve screen — `ResolveView.tsx` |
| C9 | CSV import — `ImportCsv.tsx` |

**C10 — one pass through the app, clicking everything.** Converts nine unknowns into done or a
bug list. Highest-value hour available. YOURS, with me fixing what you find.

## D. In flight

| | Item | State |
|---|---|---|
| D1 | Fit-score matcher fix — 65 of 100 points were dead on every row | VERIFIED — 63 of 90 rows now carry an archetype, 90 carry Holland tags |
| D2 | Split into **Fit** and **Reachability** scores | LANDED — `F` stored, `R` computed live; no `reachability_score` column |
| D3 | Show fractions beside rates, "too few to read" under n=10 | LANDED (per agent; not re-read in source) |
| D4 | **Push the rewritten `AGENTS.md`** — sitting in `output/lovable/` | YOURS |

## E. Not built

| | Item | Note |
|---|---|---|
| E1 | **CV builder — 10-year cut not enforced** | Still emits roles back to 2012 |
| E2 | **CV generation does not create the tracker row** | |
| E3 | **JD in → tailored CV out as a repeatable flow** | Engine exists, not wired |
| E4 | Cover letter generator in his voice | `voice-dna.md` + samples ready |
| E5 | Story bank for interviews | Debriefs would seed it |
| E6 | Google job search as pipeline source | Replaces LinkedIn scanning |
| E7 | Resolve INTP vs INFJ | Apt says INFJ, profile says INTP |
| E8 | Extract the two assessment PDFs | No text layer, no poppler installed |

## F. Cadence

| | Item | State |
|---|---|---|
| F1 | Fortnightly reconcile scheduled, Mondays 09:00 | VERIFIED |
| F2 | **Run it once manually to approve connector permissions** | YOURS — else it stalls silently |
| F3 | LinkedIn export as a standing source — **quarterly**, next due ~15 Nov 2026. Ids are `li-{sha1(conversation)}` so a re-import updates rather than duplicates | AGREED, not yet scheduled |

---

## Warm companies never applied to

From the newly filled thread companies: places where a conversation exists and was answered, but
no application was ever sent. Reply counts as of the 24 Mar 2026 export, so no later activity.

| Company | Threads | Replied |
|---|---|---|
| Old School Brand | 10 | 10 |
| Suitsupply | 4 | 4 |
| Freedom of Movement | 3 | 3 |
| AMIRI | 3 | 3 |
| Zegna | 3 | 3 |
| Asket | 3 | 3 |
| Brunello Cucinelli | 2 | 2 |
| Monocle · Endear · G-STAR · Highsnobiety · ISAIA · Alexander McQueen · RIMOWA | 2 each | 2 each |

Against a direct-email channel converting at 5 of 14 and an ATS channel at 1 of 75, this is the
list that matters.

## Next five, in order

1. **Push `AGENTS.md`** (D4) — makes every later request cheaper and stops the same regressions
2. **Run the scheduled task once** (F2) — otherwise Monday's run stalls unattended
3. **One pass through the app** (C10) — nine unknowns resolved in about an hour
4. **Fill the three open debriefs** (A9) — Shammeera was 1 Aug and is fading
5. **Act on the channel finding** — stop feeding the 1.3% channel; 75 of 90 went there

Still blocked on the LinkedIn export for A7 and F3.
