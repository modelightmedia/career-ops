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

## The conclusion Jason reached, 2026-08-15

> "Spray and pray does not work. Less apps, more targeted, more follow through with warm reach out
> with real people. It's a dopamine trick — it feels good to apply en masse because it feels like
> progress, but clearly isn't."

Recorded in `modes/_custom.md` under "Volume does not work", which is user layer and survives system
updates. It changes what gets reported: **application count is no longer a progress metric.** The
numbers to report are applications with a named human attached, warm contacts worked, and owed
replies cleared. `settings.weekly_target = 5` now contradicts this and needs a decision.

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
| A13 | **Email sweeps searched by company name, so ATS confirmations were invisible for months.** Those mails come from `myworkday.com`, `ashbyhq.com`, `hire.lever.co`, `successfactors.com` and never name the employer in the sender — only the subject. Sweep by sender domain. Fixed in the fortnightly task spec 2026-08-15 | VERIFIED |
| A14 | Applications found in Gmail and **in no other dataset**: Marriott (Cape Town EDITION, 18 Jun), VF Corp / The North Face (9 Apr, rejected 11 Jun), Jacques Marie Mage (3 Jun). Now ids 197–199 | VERIFIED |
| A8 | ~~12 applications still called "Role TBC"~~ — **6 named from ATS email**: Sonos, Kith, New Balance, Factorie, Athletics, Buck Mason. Six remain | PART DONE |
| A8b | Remaining 6 "Role TBC" — export named none of them, so these were not LinkedIn applications. One exception: Wellness Warehouse 28 Apr is either "Category Manager, Clean Fitness" or "Space Planner", both applied that day. Your recall needed | YOURS |
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

## D5. The gate — ask a question, do not score seniority

Jason's framing is **search wide, apply narrow**. The gate needs to separate a genuinely good match
from a job that is merely "cool", and today it cannot.

**Corrected 2026-08-15.** An earlier version of this item proposed penalising junior titles. Jason
rejected it and the data agrees: his two most advanced processes are **FrontlineIQ "AI Solutions
Specialist"** (real upskill in AI and B2B SaaS) and **Hertex "Product Knowledge Coordinator"** (title
understates a multi-door training and enablement job). A title penalty downgrades both. The
discriminator is what the role *adds*, which lives in the description, not the title. Raise it as a
**question at review time**, never as a score. Detail in `modes/_custom.md`.

Evidence, 17 June 2026, one day, all scored **83 of 100**:

| Company | Role | Fit |
|---|---|---|
| TOM FORD FASHION | Client Advisor | 83 |
| Officine Générale | Sales Associates, Pacific Palisades | 83 |
| Casablanca Paris | Team Lead | 83 |
| FARO | Area Manager | 83 |
| Confidential | Director of Private Client Experience | 83 |

A shop-floor Client Advisor post scores the same as a Director role. The classifier sees luxury
menswear retail, returns "Retail or boutique leadership", awards 83. It has no concept of level.

**Fix:** infer seniority from the title, compare against his last three roles (Men's Buyer and
Regional VM Manager at Brunello Cucinelli across 13 boutiques, Suitsupply West Coast VM, AE at
Flagship.ai), and penalise more than one step below. Also flags: `Intern`, `Associate`, `Assistant`,
`Casual`, `Ambassador`, `Floor`.

Also worth knowing: a DB trigger classifies on insert. The 106 rows added 2026-08-15 came back
classified the same day without being asked, 80 of 106 with an archetype. That part is already built.

## E0. Record linkage — the join between what you send and what comes back

Backfill done 2026-08-15: `applications.req_id` and `applications.job_url` are now real columns.
**122 of 199 carry a hard key** (106 job URLs, 16 requisition numbers). adidas 6 of 7, Paul Smith
3 of 3, Loewe 2 of 2, plus Berluti, Louis Vuitton, Marriott, Walmart, Factorie.

83 of 199 applications sit at the 29 companies where Jason applied more than once, so matching
inbound mail by company name alone is unsafe. The resolution ladder, in order:

1. Requisition or reference number in subject or body — exact
2. Role title matched within that company's applications — handles Nike, New Balance, Levi's
3. Elimination — if only one application at that company is unresolved, it is the one
4. Thread inheritance — once a thread is anchored, later replies inherit it
5. Nothing resolves it — attach to the **company**, resolve no row, queue it for Jason

**Hard rule: a rejection that names no role must close at most one application, and if the ladder
cannot pick one, it closes none.** Bulk status changes already zeroed four live processes once.

| | Item | State |
|---|---|---|
| E0a | Extract `req_id` / `job_url` into fields | VERIFIED |
| E0b | Attach logic + evidence trail (each inbound records how it matched) | NOT BUILT — app change |
| E0c | Ambiguity prompt so Jason picks the row in one click. He asked for this, explicitly **not yet** | DEFERRED at his request |
| E0d | Most exposed: **TikTok** 6 open applications, no req numbers, near-identical titles. Crossing Hurdles same shape at 5 | KNOWN LIMIT |

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

## D6. Sourcing crawler — replaces the weekly volume target

`settings.weekly_target` cut to null 2026-08-15. Replaced by sourcing into the review cadence:
surface N candidates, Jason decides. **Not applying is a valid recorded outcome.**

| | Item | State |
|---|---|---|
| D6a | Actor chosen: `fantastic-jobs/career-site-job-listing-api` — 175k+ career sites, 54 ATS platforms, ~$0.012/job | DECIDED |
| D6b | Wire it up, store candidates, feed the review screen | NOT BUILT |
| D6c | Config must use `descriptionSearch` (catches the Hertex case), `titleExclusionSearch` (Client Advisor, Sales Associate, Intern, Assistant, Casual, Ambassador, Floor), `locationSearch` SA-first | SPEC'D in `_custom.md` |

Sources the ATS layer directly rather than LinkedIn, where the record is 0 of 106.

## G. The apply loop — the big build, deferred by Jason 2026-08-15

Four stages. Sourcing without a way to apply and be tracked is half a system, so these ship together
or not at all. Jason explicitly deferred building this; the spec is here so it survives.

| Stage | What it does | State |
|---|---|---|
| G1 **Source** | Apify `fantastic-jobs/career-site-job-listing-api`, ATS layer not LinkedIn. See D6 | NOT BUILT |
| G2 **Decide** | Review screen surfaces N candidates. Junior-reading titles raise the scope **question**, never a penalty (see D5). Not applying is a recorded outcome | NOT BUILT |
| G3 **Apply** | JD in → tailored CV and cover out. Engine exists in `modes/pdf.md`, is not self-serve (E1–E4) | PARTIAL |
| G4 **Track** | The application row is created **at the moment of CV generation**, capturing `req_id` and `job_url` as fields. That is the cheapest capture point and it makes G4 automatic rather than a chore | NOT BUILT (E2) |

G4 is the keystone. `req_id` and `job_url` now exist as columns (E0a), so if they are populated at
creation, every later inbound email joins by hard key instead of fuzzy name matching. The loop closes
on itself.

### Fork candidate — `myatsscore.lovable.app` (Jason's friend's app)

Reviewed 2026-08-15. Takes a resume plus a job link, returns a 0–100 ATS score, strengths,
opportunities and a covered/missing keyword list. Paid tier adds a PDF report and a keyword-optimised
rewrite.

**Worth lifting:** job-link → parsed description (this is G3's missing front half, and it is what
reads scope out of a description when the title misleads); the paste-the-description fallback for
blocked boards; resume file parsing (PDF/DOCX/TXT); JD-to-resume keyword gap analysis.

**Not wanted:** Stripe flow, anonymous no-account path (this app has auth + RLS), marketing page.

**Does not exist there:** any tracking. It is a one-shot tool. G4 is Jason's build either way.

**Risk if the rewriter is forked:** it generates a "keyword-optimized resume". Career-ops forbids
fabrication and authorship inflation, and the CV feeds a record used for bankruptcy court. Any
rewrite code must be constrained by the source-of-truth boundary in `CLAUDE.md` before it touches a
real application.

**Blocked on:** the friend's permission. Needs a Lovable remix, collaborator access, or GitHub repo
access. Not reachable from this workspace until then.

## F. Cadence

| | Item | State |
|---|---|---|
| F1 | Fortnightly reconcile scheduled, Mondays 09:00 | VERIFIED |
| F2 | ~~Run it once manually to approve connector permissions~~ — run 2026-08-15. Gmail, Drive and Calendar all returned data. Found nothing new; the database was already current to 14 Aug | VERIFIED |
| F4 | `settings.last_reviewed_at` was **null**, so the task's own 12-day guard could never fire. Now stamped 2026-08-15, which means Monday 17 Aug correctly no-ops | VERIFIED |
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
