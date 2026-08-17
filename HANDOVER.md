# Search Desk — handover

Written 2026-08-15 for whoever picks this up next, human or agent.
Read this before touching anything. It will save you a day.

> ## Superseded in places — read this first
>
> A second session on **2026-08-15 (afternoon)** changed the numbers below. **`PUNCH-LIST.md` is
> authoritative where the two disagree.** What changed:
>
> - **90 applications → 199.** A fresh LinkedIn export (15 Aug, current to 13 Aug) added 106. Three
>   more were found in Gmail and existed in no dataset at all: Marriott, VF Corporation, Jacques
>   Marie Mage.
> - **The channel table below is incomplete.** Correct: direct email 5 of 14 · recruiter 1 of 1 ·
>   company ATS 1 of 75 · **LinkedIn 0 of 106**. Self-serve channels together are 1 interview from
>   181 applications.
> - **"151 applications Nov–Apr produced zero interviews, the 18 in July produced six" is wrong.**
>   July was 45 applications, the joint-heaviest month of the search. May was 49. What changed in
>   July was channel, not restraint. Do not repeat the "volume stopped, targeting started" story.
> - **1,107 people replied on LinkedIn and never got an answer**, 432 of them substantive. This is
>   the largest unworked thing in the system. Import CSVs are in `output/app-seed/`.
> - **Work-search log is 290 → 301 rows**, not the 193 stated below. It was never stale.
> - **MBTI is resolved to INTP** (2026-08-15). Usable in documents.
> - **Jason's own conclusion:** volume applying does not work. Application count is no longer a
>   progress metric — see `modes/_custom.md`, "Volume does not work". `settings.weekly_target` is cut.
> - **Email sweeps must query by ATS sender domain**, not company name. Confirmations come from
>   `myworkday.com`, `ashbyhq.com`, `hire.lever.co`, `successfactors.com` and name the employer only
>   in the subject. Searching by company name missed them for months. Fixed in the fortnightly task.
>
> Sections 1 to 6 below (who Jason is, architecture, connections, working method, the hard-won
> rules) are unchanged and still correct. Section 7 onward is partly superseded.

---

## 1. What this is

A private job-search operations system for **Jason Coelho**, built over one long session in
August 2026. It does three jobs, in his words:

> "tracking job apps, logging results, improving the process — but I also think it can help steer
> the long term strategy."

The first two work. The third is the interesting one and is only half built.

It is **not** a generic job tracker. It is a reconstructed nine-month record of a real, ongoing,
financially consequential search, built from four evidence sources, and it doubles as a legal
document — Jason needs it for **bankruptcy court and unemployment**, both of which require proof of
job-search activity. Data accuracy is not a nice-to-have.

---

## 2. Who Jason is — you need this to do the work

Commercial operator, 15+ years in luxury and premium retail. Eight years at **Brunello Cucinelli**
in the US, finishing as Men's Buyer and Regional VM Manager across 13 boutiques and the major
wholesale accounts. Then Suitsupply West Coast VM, then an AE role at Flagship.ai. Now in **Cape
Town**, rebuilding after a US chapter. Dual US/SA citizen, Portuguese/EU in progress.

He lost the Flagship role in **November 2025** — that is why every dataset starts at 1 Nov.

**Target archetypes:** commercial/ops lead in luxury or premium craft · buying and merchandising ·
wholesale and brand partnerships · B2B sales in craft- or luxury-adjacent SaaS · chief of staff or
number-two-to-founder.

**Anti-archetypes (hard no):** personal-branding or influencer work · cold SDR/BDR with no domain ·
fast-fashion, discount or mass retail · pure IC coding or analytics · MLM or commission-only with
no base.

**Assessed profile** (see `assessments.md`): Holland code **AIR** (Artistic-Investigative-Social),
DiSC **Sd** (Steadiness), Enneagram **5w6**, high Openness and Agreeableness, CliftonStrengths
Strategic/Ideation/Futuristic/Intellection/Individualization. MBTI is **INTP** (confirmed 2026-08-15; Apt's INFJ is
recorded as a dissenting single result). Working mode: **Spiral** long-term (depth, revisiting,
layered understanding) with a current **Horizon Line** season (sustained focus on one goal).

Flagged development areas from a formal SHL assessment: commercial acumen with financial data ·
prioritisation and progress monitoring · stretch-goal setting.

**Register.** He is direct, technically literate, and does not want encouragement. Flat and factual.
No coaching voice, no exclamation marks, no em dashes. He told me about a period of depression
matter-of-factly and would not have wanted a paragraph of sympathy. Say the number, say what it is
measured against, stop.

---

## 3. Architecture — two halves

**Half one: `career-ops` (local, this repo).** An open-source AI job-search system, heavily
customised. Holds the source-of-truth markdown, the CV tailoring engine, portal scanners and
analysis scripts. Run by an agent in Claude Code, not self-serve.

**Half two: the Lovable app** — `https://mycareercommand.lovable.app`, project
`15048548-4c4d-4b1a-b413-0b56270c85d7`. React + Tailwind + Postgres. This is now the **canonical
surface**. The old static HTML desk is retired to `archive/` — do not regenerate it.

They are connected only by CSV export and by an agent writing to both. There is no live sync.

### Where everything lives

| Path | What |
|---|---|
| `data/applications.md` | The 90-application master record |
| `data/reconstruction-nov2025.md` | Audit trail of how it was rebuilt, with sources |
| `data/outreach-targets.md` / `data/outreach.md` | 247 contacts / 459 LinkedIn threads |
| `cv.md` | Master CV. Full history back to 2012 — the *generated* CV trims to 10 years |
| `assessments.md` | Psychometrics and formal assessments, with a type-divergence flag |
| `modes/_profile.md` | Archetypes, strengths, constraints. **User layer — survives updates** |
| `modes/_custom.md` | House rules: CV format, outreach, workflow. **User layer** |
| `modes/pdf.md` | The CV tailoring engine spec (system layer, do not put user data here) |
| `templates/cv-template.html` | ATS-safe CV template |
| `output/legal/work-search-log.csv` | Court / unemployment record, 290 rows. Predates the Aug LinkedIn merge — regenerate against 196 applications |
| `output/app-seed/*.csv` | Exports for the Lovable importer |
| `output/lovable/AGENTS.md` | Rewritten agent rules — **needs pushing to the repo** |
| `PUNCH-LIST.md` | Current state, four-state model |
| `archive/` | Retired static desk |
| `VHS-Inspired Job Tracker Design/` | **The design source of truth** |

**Design.** `Search Desk VHS.dc.html` in that folder is the authored design — six sections, full
component layout, VHS/tape-deck aesthetic. Tokens and treatment are documented in `AGENTS.md`.
If a design change is needed, **work from that file**. I once restyled from a description of it and
got it badly wrong.

---

## 4. Connections and credentials

Working in this session: **Gmail**, **Google Drive**, **Google Calendar**, **Lovable**,
**Claude-in-Chrome** (his real browser, logged into LinkedIn), **Claude Design**.

Not connected: **GitHub MCP** (needs OAuth). The Lovable repo *is* GitHub-synced, but **Jason
pushes manually** — he has hit sync problems before.

**Apollo** is connected but on a free plan: people-search returns `API_INACCESSIBLE`, so contact
discovery at companies where he has no connection is unavailable. Do not burn the ~198 credits.

**Node** is at `~/.local/node/bin` — prefix shell commands with
`export PATH="$HOME/.local/node/bin:$PATH"`. It is not on the system PATH.

---

## 5. How to work effectively

**Data work → direct SQL** via the Lovable `query_database` tool. Fast, precise, verifiable, and it
costs no Lovable credits. All 90 applications, the status corrections and the debriefs went in this
way. Never delegate data manipulation to the Lovable agent.

**Code changes → `send_message`**, then **verify by reading the source** with `read_file`. You can
list and read every file in the project. Use it — do not report a feature as working because the
schema changed.

**Lovable credits are limited.** Jason prefers giving instructions in Claude Code and pushing
himself. Write files locally for him to push rather than spending credits on the agent.

**UX verification is his.** Neither you nor the agent can judge whether a flow feels right on a
phone. Nine screens are currently built and unclicked.

**Keep `AGENTS.md` current.** It carries the rules so you stop re-explaining them and the agent
stops regressing.

---

## 6. Rules that were learned the hard way

Each of these has an incident behind it. They are in `AGENTS.md` too.

**Never fabricate data.** The agent once invented Gucci, Superbalist and WHOOP application rows from
figures I quoted as benchmarks. They had to be deleted.

**Never invent what a person said.** Debrief fields marked `[Add]` are Jason's recall. Facts from
email can be recorded; words in a room cannot.

**Never auto-close or auto-ghost.** An application at `Applied` with no outcome means *missing
data*. He gets responses by WhatsApp, LinkedIn and phone that never touch email. He raised this
himself and he was right.

**Never silently downgrade a status.** `Interview` became `Applied` on four live processes,
zeroing the board. Only an explicit dropdown choice moves a status backwards.

**Never lose typed text.** Free text autosaves debounced and on blur; any collapse must `await` the
pending save. See `useAutosaveField` and the `flush()` calls in `OutcomeControl.tsx`.

**Contacts amplify an application; they never generate one.** Jason was explicit: connections at a
company are only relevant *when he applies to a role there*. The flow is apply → surface possible
reach-outs → research the company → find a route to the hiring manager → seek a recommendation.
Some of that is irreducibly manual. Never suggest applying somewhere because he knows people there.

**Nothing is ever sent on his behalf.** Draft, preview, copy to clipboard. Never send, submit or
message.

**Check row-level evidence before mass edits.** I once saw 35 rows marked Ghosted, concluded it was
an automated sweep, and nearly reverted 30 of his own decisions. Per-row timestamps showed human
pacing. Aggregates lie; check timestamps.

---

## 7. What the data actually says

This is the analytical payload. It took the whole session to establish.

**Channel dominates everything.**

| | Applications | Reached interview | Rate |
|---|---|---|---|
| Direct email to a named person | 14 | 5 | **35.7%** |
| Company ATS | 75 | 1 | **1.3%** |

**Geography is second.** South Africa 23.5% (17 apps, 4 interviews) versus offshore 4.1% (73, 3).

**Volume does not work; targeting does.** 151 applications Nov–Apr produced **zero** interviews.
The 18 sent in July produced six. Every live process came from July.

**LinkedIn is a network, not a job board.** 315 applications through it, ~10% ever opened by a
human. But 6,689 connections including **52 Tier-A contacts at Brunello Cucinelli and 20 at
Suitsupply — both alma maters, neither applied to.**

**The fit score is currently inverted** — Poor band converts at 9.4%, Good at 0%. Two causes: the
matchers were literal and 65 of 100 points never fired, and the model measured role-fit when the
binding constraint is reachability. A fix splitting Fit from Reachability is in flight.

**Caveat on all of it: 7 positive outcomes in 90 applications.** Directional, not proven. Always
show the fraction beside the rate.

---

## 8. State of the build

See `PUNCH-LIST.md` for the live version. Summary:

**Verified working:** the data (90 applications, 247 contacts, 459 threads, 6 debriefs), auth gate
and RLS, soft delete with undo, the autosave race fix, the loop-close preview.

**Built but never used:** Review mode, Strategy, Things to work on, effort chart, voice notes,
refresh control, Assessments, Resolve, CSV import. Nine screens.

**Not built:** the CV builder is the big one. The tailoring engine exists and is good — ATS-safe,
ligatures disabled so text extracts cleanly, keyword injection with a never-invent rule — but it
still emits roles back to 2012 despite the 10-year rule, does not create the tracker row, and is
not self-serve. Also missing: cover-letter generator, story bank, Google job search as a source.

**Blocked:** a fresh LinkedIn data export. It fills April–August applications, refreshes 6,689 →
8,000+ connections, and updates the response-rate baselines. Jason has requested it.

---

## 9. Traps that cost me time

**Use the LinkedIn data export, never scrape the tracker.** `Jobs/Job Applications.csv` in the
export has date, company, title and URL, properly structured. I lost an hour scraping the web UI
before finding it. Exports live in `~/Desktop/03_PERSONAL/Linkedin Data/`. The current one stops
**2026-03-23** — always state its staleness.

**Sweep Gmail SENT mail, not just inbox, with a wide window.** The query that works:
`in:sent newer_than:120d (application OR applying OR "my CV" OR role OR position OR opportunity)`.
A narrow inbox query missed most of the pipeline and left adidas showing as a live interview a month
after it was rejected.

**Markdown tables here are parsed with naive `split('|')`.** Never escape a pipe as `\|` in a field
— replace it with `·`. Job titles containing `|` silently corrupted nine rows.

**`merge-tracker.mjs` rejects `—` as a score.** The existing rows all use it. Edit
`data/applications.md` directly for status updates; that is explicitly allowed.

**Lovable's `javascript_tool` returns `{}` for async functions** but the work completes — poll
`window` state in a follow-up call. And browser state is wiped by navigation; persist as you go.

**Two assessment PDFs have no text layer** and `poppler` is not installed, so they cannot be read.
Ask Jason to paste the relevant findings.

**The sandbox broke mid-session**, losing filesystem access entirely. Restarting Claude Code fixed
it. If `Read` starts returning EPERM on files you were just editing, restart rather than debug.

---

## 10. If you do nothing else

1. **Push `output/lovable/AGENTS.md`** to the Lovable repo root
2. **Run the fortnightly task once** from the Scheduled panel, so connector permissions get approved
3. **Walk the app**, fixing what surfaces — nine screens have never been clicked
4. **Merge the LinkedIn export** when it lands
5. **Shift volume out of the ATS channel.** 75 of 90 applications went into the route that
   converts at 1.3%; the 14 sent directly to a named person converted at 35.7%. The contacts at
   Cucinelli and Suitsupply are **not** a reason to apply there — they are an amplifier to use
   *once a real role exists*. See the outreach rule below.
