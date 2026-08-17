# Search Desk — punch list

Status **2026-08-17**. App: https://mycareercommand.lovable.app ·
Lovable project `15048548-4c4d-4b1a-b413-0b56270c85d7` · repo synced to GitHub, pushes are manual.

**VERIFIED** = checked by querying the database or reading the source.
**DONE** = shipped and confirmed. **PAUSED** = deliberately not building it, spec retained.
**YOURS** = only Jason can do it. **BUILT, UNCHECKED** = code exists, nobody has used it.

---

## Close-out, 2026-08-17

Nothing is left half-finished. Every item below is DONE, PAUSED with its spec intact, or YOURS.

**Nothing is waiting on me.**

| | Count |
|---|---|
| Done and verified today | 19 items |
| Paused by decision, spec retained | 9 items (D6, E0b–c, E1–E6, G1–G4) |
| Yours, non-code | 4 items (A8b, A9, C10, and the replies) |
| Blocked on someone else | 1 (fork permission from your friend) |

**The one thing not on any list:** 146 Tier A contacts sit at status `New`, and 1,119 people are
owed a reply. The system is finished enough. That is the work.

---

## The finding that matters most

| Channel | Applications | Reached interview |
|---|---|---|
| Direct email to a named person | 14 | **5** |
| Recruiter | 1 | 1 |
| Company ATS | 75 | 1 |
| LinkedIn | 106 | **0** |

Self-serve channels together: **181 applications for 1 interview.** Six of seven positive outcomes
came from the 15 applications where a named human was involved. Caveat: 7 positive outcomes in 199,
so directional, not proven — 3.5%.

| Geography | Applications | Reached interview |
|---|---|---|
| South Africa | 17 | 4 |
| Offshore | 73 | 3 |

**A claim that did not survive the new data.** "151 applications Nov–Apr produced zero interviews,
the 18 in July produced six" is wrong on both halves. Actual monthly volume:

| | Nov | Dec | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug |
|---|---|---|---|---|---|---|---|---|---|---|
| Applications | 8 | 5 | 9 | 7 | 16 | 35 | 49 | 15 | 45 | 6 |
| Reached interview | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 5 | 0 |

July was the joint-heaviest month, not a restrained one. What changed in July was channel. Do not
repeat the "volume stopped, targeting started" story.

## Jason's conclusion, 2026-08-15

> "Spray and pray does not work. Less apps, more targeted, more follow through with warm reach out
> with real people. It's a dopamine trick — it feels good to apply en masse because it feels like
> progress, but clearly isn't."

Refined 2026-08-15: not "apply less" but **search wide, apply narrow.** The filter belongs at the
front, at the moment of deciding to apply, not at the back as restraint.

Recorded in `modes/_custom.md` under "Volume does not work" — user layer, survives system updates.
**Application count is no longer a progress metric.** Report instead: applications with a named human
attached, warm contacts worked, owed replies cleared. `settings.weekly_target` is **cut to null**.

---

## A. Data — all DONE

| | Item | State |
|---|---|---|
| A1 | **199 applications**, Oct 2025 → Aug 2026. 90 reconciled from four sources, 106 from the 15 Aug LinkedIn export, 3 found only in Gmail | VERIFIED |
| A2 | 247 contacts · **1,212 threads** · 6 debriefs · 9 warm touches | VERIFIED |
| A6 | Work-search log for court/unemployment — **301 rows**, 5 Nov 2025 → 13 Aug 2026. 11 same-company-same-day applications had been deduped away and are restored. Backup at `work-search-log.backup-2026-08-15.csv` | VERIFIED |
| A7 | LinkedIn Apr–Aug applications — 15 Aug export merged, 106 rows | VERIFIED |
| A10 | Thread companies — filled from `Connections.csv` by LinkedIn **URL**, not name. Went from 10 to 446 of 459. The 13 unresolved are people messaged without connecting | VERIFIED |
| A11 | **1,107 owed replies imported.** 1,212 live threads: 1,107 current + 105 originals with no newer version. 354 duplicates soft-deleted, recoverable | DONE |
| A12 | Thread rule: keep **last 2 years**, ball = who spoke last. Refresh **quarterly** | AGREED |
| A13 | **Email sweeps searched by company name, so ATS confirmations were invisible for months.** They come from `myworkday.com`, `ashbyhq.com`, `hire.lever.co`, `successfactors.com` and name the employer only in the subject. Sweep by sender domain. Fixed in the fortnightly task | VERIFIED |
| A14 | Applications found in Gmail and in **no other dataset**: Marriott (18 Jun), VF Corp / The North Face (9 Apr, rejected 11 Jun), Jacques Marie Mage (3 Jun). Ids 197–199 | VERIFIED |
| A8 | "Role TBC" — **6 of 12 named from ATS email**: Sonos, Kith, New Balance, Factorie, Athletics, Buck Mason | DONE |
| A8b | Remaining 6 "Role TBC" — not LinkedIn applications, so the export cannot name them. Wellness Warehouse 28 Apr is either "Category Manager, Clean Fitness" or "Space Planner", both applied that day | YOURS |
| A9 | 3 debriefs still contain `[Add]` — incl. Shammeera, 1 Aug | YOURS |

## B. App — verified working

Auth gate + RLS · soft delete with undo and recycle bin · autosave with flush-before-commit (the
data-loss fix) · fit badge computing live · loop-close preview with editable text.

## C. App — built, still unexercised

| | Item |
|---|---|
| C1–C8 | Review · Strategy · Things to work on · Effort chart · Voice notes · Refresh control · Assessments · Resolve |
| C9 | ~~CSV import~~ — **used 2026-08-17**, 1,107 threads imported successfully | DONE |

**C10 — one pass through the app, clicking everything.** Eight screens still unknown. YOURS, with me
fixing what surfaces.

## D. Scoring and design — DONE

| | Item | State |
|---|---|---|
| D1 | Fit-score matcher fix — 65 of 100 points were dead on every row. Now reads stored `holland_tags` / `archetype` set on insert, not regex at render | VERIFIED |
| D2 | Split into **Fit** (`fit_score`) and **Reachability** (`reach_score`). Both populated on all 199 with reasons. Fit 0–100, reach 15–80 | VERIFIED |
| D3 | Fractions beside rates, "too few to read" under n=10 | LANDED (agent report, not re-read) |
| D4 | ~~Push the rewritten `AGENTS.md`~~ — pushed 2026-08-17. Repo copy is now **canonical**; `output/lovable/AGENTS.md` is a stale export | DONE |
| D7 | **Batch 2 shipped 2026-08-17**: chrome tokens (dark bars no longer flip), hairline grids via `gap:1px`, disabled empty states, `COLD` relabelled `QUIET 30D+`, Actioned/Drafted chip overlap fixed, CSV importer chunked at 500, response-rate panel states its own basis | VERIFIED in source: `deck.tsx` chrome tokens + `StatGrid` gap; `csv.ts` chunking |
| D8 | **Weekly application target removed entirely** 2026-08-17, per Jason. Not nulled — deleted. `SettingsView` field, `appliedThisWeek`, `pipelineHealth`, `DEFAULT_WEEKLY_TARGET`, the Pipeline health hero banner, and the "Applications, last 14 days" process line are all gone. DB column left in place, unused and unread | VERIFIED |
| D9 | **Response rate collapsed from four cells to one.** `opener_type` is `template` on every row, so Template duplicated Overall and Custom/Warm read 0/0. Now a single "Replies across all threads" cell with the fraction, the stored baselines beside it, and a line saying why the split is absent. Per-thread `opener_type` selector kept so the split can return | VERIFIED |
| D10 | Dead-code sweep. Only `PLUM` and `liveLight` were genuinely unreferenced and are deleted. **`ImportBar.tsx` is NOT dead** — imported at `routes/index.tsx:48`, used at `:398`. `GREEN`, `SPECTRUM`, `DotTexture`, `ReelSvg`, `BarRow`, `chipStyle`, `stageInk`, `stageColor`, `STAGE_COLORS`, `STAGE_INK` all have live references. No file in `desk/**` or `lib/**` is unimported | VERIFIED |
| D11 | **Smoke test:** app loads at `mycareercommand.lovable.app` after all five passes — auth gate renders, zero console errors, no white screen. Typecheck and lint clean. Past sign-in is untested by me and needs Jason | VERIFIED |

## D5. The gate — ask a question, never score seniority

**Search wide, apply narrow.** The gate must separate a good match from a job that is merely "cool".

Evidence, 17 June 2026, one day, all scored **83 of 100**:

| Company | Role | Fit |
|---|---|---|
| TOM FORD FASHION | Client Advisor | 83 |
| Officine Générale | Sales Associates, Pacific Palisades | 83 |
| Casablanca Paris | Team Lead | 83 |
| FARO | Area Manager | 83 |
| Confidential | Director of Private Client Experience | 83 |

A shop-floor Client Advisor scores the same as a Director. The classifier sees luxury menswear retail
and awards 83. **Fit measures domain, not level.**

**Do NOT fix this with a seniority penalty on the title.** Jason rejected that and the data agrees:
his two most advanced processes have junior-sounding titles — **FrontlineIQ "AI Solutions
Specialist"** (real upskill) and **Hertex "Product Knowledge Coordinator"** (title understates a
multi-door training and enablement job). A title penalty downgrades both.

The discriminator is what the role *adds*, which lives in the description, never the title. So raise
it as a **question at review time**: *is the scope bigger than it sounds, or is this brand appeal?*

| Pattern | Example | Verdict |
|---|---|---|
| Down in title, up in learning | FrontlineIQ | Good |
| Title understates real scope | Hertex | Good |
| Down in title, nothing added, brand appeal | TOM FORD Client Advisor | The trap |

Also: a DB trigger classifies on insert. The 106 rows added 15 Aug came back classified the same day
unasked, 80 of 106 with an archetype. That part is already built.

## E0. Record linkage

`applications.req_id` and `job_url` are real columns. **122 of 199 carry a hard key** — 106 job URLs,
16 requisition numbers. adidas 6 of 7, Paul Smith 3 of 3, Loewe 2 of 2, plus Berluti, Louis Vuitton,
Marriott, Walmart, Factorie.

**83 of 199 applications sit at the 29 companies where Jason applied more than once**, so matching
inbound mail by company name is unsafe. Resolution ladder, in order:

1. Requisition or reference number in subject or body — exact
2. Role title matched within that company's applications — handles Nike, New Balance, Levi's
3. Elimination — if only one application at that company is unresolved, it is the one
4. Thread inheritance — once a thread is anchored, later replies inherit it
5. Nothing resolves it — attach to the **company**, resolve no row, queue it

**Hard rule: a rejection naming no role closes at most one application, and if the ladder cannot pick
one, it closes none.** Bulk status changes already zeroed four live processes once.

| | Item | State |
|---|---|---|
| E0a | Extract `req_id` / `job_url` into fields | VERIFIED |
| E0b | Attach logic + evidence trail | PAUSED |
| E0c | Ambiguity prompt so Jason picks the row in one click | PAUSED at his request |
| E0d | Most exposed: **TikTok**, 6 open applications, no req numbers, near-identical titles. Crossing Hurdles the same at 5 | KNOWN LIMIT |

## PAUSED — specs retained, nothing being built

Jason's call, 2026-08-17: the app is finished enough. These cost nothing to leave.

| | Item | Note |
|---|---|---|
| D6 | **Sourcing crawler.** Actor decided: `fantastic-jobs/career-site-job-listing-api`, 175k+ career sites, 54 ATS platforms, ~$0.012/job. Config must use `descriptionSearch` (catches the Hertex case), `titleExclusionSearch` (Client Advisor, Sales Associate, Intern, Assistant, Casual, Ambassador, Floor), `locationSearch` SA-first. Spec in `_custom.md` | PAUSED |
| E1 | CV builder — 10-year cut not enforced, still emits roles back to 2012 | PAUSED |
| E2 | CV generation does not create the tracker row — see G4 | PAUSED |
| E3 | JD in → tailored CV out as a repeatable flow. Engine exists, not wired | PAUSED |
| E4 | Cover letter generator in his voice. `voice-dna.md` + samples ready | PAUSED |
| E5 | Story bank for interviews. Debriefs would seed it | PAUSED |
| E6 | Google job search as a pipeline source | PAUSED |
| E7 | ~~Resolve INTP vs INFJ~~ | DONE — INTP, 2026-08-15 |
| E8 | Two assessment PDFs have no text layer, no poppler | DONE — summarised by Jason |

### G. The apply loop — the big build

Source → decide → apply → track. Sourcing without a way to apply and be tracked is half a system.

| Stage | What it does | State |
|---|---|---|
| G1 **Source** | Apify actor, ATS layer not LinkedIn. See D6 | PAUSED |
| G2 **Decide** | Review screen surfaces N candidates. Junior-reading titles raise the scope **question**, never a penalty. Not applying is a recorded outcome | PAUSED |
| G3 **Apply** | JD in → tailored CV and cover out | PAUSED |
| G4 **Track** | Application row created **at CV generation**, capturing `req_id` and `job_url` | PAUSED |

**G4 is the keystone and it works without the crawler.** `req_id` and `job_url` exist as columns, so
if they are populated at creation, every later inbound email joins by hard key rather than fuzzy name
match. If only one item in G ever gets built, build this one.

### Fork candidate — `myatsscore.lovable.app`

Reviewed 2026-08-17. Resume + job link → 0–100 ATS score, strengths, opportunities, keyword gaps.
Paid tier adds a PDF report and a keyword-optimised rewrite.

**Worth lifting:** job-link → parsed description (G3's missing front half, and what reads scope out of
a description when the title misleads); paste-the-description fallback for blocked boards; resume file
parsing; JD-to-resume keyword gap analysis.

**Not wanted:** Stripe flow, anonymous no-account path, marketing page. **Has no tracking at all** —
it is a one-shot tool, so G4 is Jason's build regardless.

**Risk:** the "keyword-optimized resume" rewriter will invent to fill gaps. Career-ops forbids
fabrication and authorship inflation, and the CV feeds a record used for bankruptcy court. Any rewrite
code must be constrained by the source-of-truth boundary in `CLAUDE.md` first.

**Blocked on** the friend's permission — Lovable remix, collaborator access, or repo access.

## F. Cadence

| | Item | State |
|---|---|---|
| F1 | Fortnightly reconcile scheduled, Mondays 09:00 | VERIFIED |
| F2 | Run once manually — done 2026-08-15. Gmail, Drive, Calendar all returned data. Found nothing new; database was already current | VERIFIED |
| F4 | `settings.last_reviewed_at` was **null**, so the 12-day guard could never fire. Now stamped, so Monday 17 Aug correctly no-ops | VERIFIED |
| F5 | Reconcile now reports **Coverage** every run: placeholder roles, applications with no channel, threads awaiting reply, age of newest LinkedIn export | VERIFIED |
| F3 | LinkedIn export as a standing quarterly source, next due **~15 Nov 2026**. Ids are `li-{sha1(conversation)}` so re-import updates rather than duplicates | AGREED, not scheduled |

---

## Warm companies never applied to

Conversations that exist and were answered, where no application was ever sent. As of the 24 Mar 2026
export, so no later activity.

| Company | Threads | Replied |
|---|---|---|
| Old School Brand | 10 | 10 |
| Suitsupply | 4 | 4 |
| Freedom of Movement · AMIRI · Zegna · Asket | 3 each | 3 each |
| Brunello Cucinelli | 2 | 2 |
| Monocle · Endear · G-STAR · Highsnobiety · ISAIA · Alexander McQueen · RIMOWA | 2 each | 2 each |

Against direct email converting 5 of 14 and ATS 1 of 75, this is the list that matters.

---

## What's actually next

Not build items. These are the job.

1. **Reply to the 59 fresh substantive messages.** People who answered you, under 30 days old. Network page → Archive → "Awaiting my reply".
2. **Hertex** at final round, **CAPREO** training 31 August, **FrontlineIQ** at final round.
3. **146 Tier A contacts at status `New`.** None worked. Old School Brand is 10 conversations, 10 replies, no application.
4. **Walk the app** (C10) — eight screens still unclicked. I fix what you find.
5. **Fill the three debriefs** (A9) — Shammeera was 1 Aug and fading.

101 of 119 live applications have heard nothing in over 30 days. That is not a task, it is the
reason the first three items matter more than anything in the build list.
