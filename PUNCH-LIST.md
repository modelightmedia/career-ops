# Search Desk — punch list

Status as at 2026-08-15. App: https://mycareercommand.lovable.app ·
Lovable project `15048548-4c4d-4b1a-b413-0b56270c85d7`

Three states are used deliberately:
**DONE** = I verified it. **SHIPPED, UNVERIFIED** = built and queued, not tested by me.
**OPEN** = not started.

---

## A. Data (the foundation)

| | Item | State |
|---|---|---|
| A1 | 90 applications loaded, Oct 2025 → Aug 2026 | DONE |
| A2 | 247 contacts, 459 LinkedIn threads loaded | DONE |
| A3 | Six debriefs seeded (Hertex ×2, FrontlineIQ ×3, Gucci) | DONE |
| A4 | Ghost threshold 30 days, read from settings | DONE |
| A5 | Work-search log exported for court / unemployment (193 rows) | DONE |
| A6 | **Fresh LinkedIn export → merge Apr–Aug applications** | OPEN — waiting on the export |
| A7 | **Backfill `channel` on applications** — only 20 of 90 set | OPEN |
| A8 | **Resolve remaining unknown outcomes** — 6 left | OPEN — Jason |
| A9 | **Fill the `[Add]` fields in the six debriefs** — recall only he has | OPEN — Jason |
| A10 | **Rename "Role TBC" entries** — 8 applications lack a real job title | OPEN — Jason |
| A11 | Thread → company backfill only matched 10 of 459 | OPEN |

## B. App behaviour

| | Item | State |
|---|---|---|
| B1 | Auth gate + RLS verified blocking anonymous reads | DONE |
| B2 | Soft delete, undo, recycle bin — tested end to end | DONE |
| B3 | Loop-closing message preview before copy | SHIPPED, UNVERIFIED |
| B4 | Debrief autosave + no-collapse on save (the data-loss fix) | SHIPPED, UNVERIFIED |
| B5 | Status never silently downgrades (the Interview → Applied bug) | SHIPPED, UNVERIFIED |
| B6 | Cohort-based conversion maths (replacing the 2700%) | SHIPPED, UNVERIFIED |
| B7 | Board cards clickable, last-touch shown on card | SHIPPED, UNVERIFIED |
| B8 | Warm column honest states (`—` / No contact / Due / Sent / Missed) | SHIPPED, UNVERIFIED |
| B9 | Voice-note debriefs with transcription | SHIPPED, UNVERIFIED |
| B10 | Stated response windows + `Silent close` type | SHIPPED, UNVERIFIED |
| B11 | Fortnightly Review mode, with last-reviewed / next-due | SHIPPED, UNVERIFIED |
| B12 | Effort-over-time chart + work-search CSV export on Feedback | SHIPPED, UNVERIFIED |
| B13 | **Verify B3–B12 by using them** | OPEN — one pass through the app |
| B14 | **Re-run the RLS check now real data is loaded** | OPEN |

## C. CV builder and tailoring — NOT BUILT

The tailoring engine exists in career-ops (`modes/pdf.md`, `templates/cv-template.html`,
`generate-pdf.mjs`) and is genuinely good: ATS-safe single column, ligatures disabled so text
extracts cleanly, photo off by default, JD keyword extraction, recruiter-side risk map, and a hard
never-invent rule. It is not wired into the app and it is not self-serve.

| | Item | State |
|---|---|---|
| C1 | Plain-format + 10-year rules written into `modes/_custom.md` | DONE |
| C2 | **Enforce the 10-year cut in generation** — currently emits roles back to 2012 | OPEN |
| C3 | **CV generation writes the application row to the app DB** | OPEN |
| C4 | **JD in → tailored CV out, as a repeatable flow** (paste JD, get PDF) | OPEN |
| C5 | Decide long-term home: stay in career-ops, or port into the app | DEFERRED — Jason's call |
| C6 | Cover-letter generator in his voice, using `voice-dna.md` + writing samples | OPEN |
| C7 | Seed `interview-prep/story-bank.md` from the debriefs and proof points | OPEN |

## D. Strategy layer — the third job of the app

| | Item | State |
|---|---|---|
| D1 | "Warm ground, unworked" panel — companies with contacts, no application | SHIPPED, UNVERIFIED |
| D2 | Conversion by segment, channel, and company type | SHIPPED, UNVERIFIED |
| D3 | Repeat-application yield (adidas ×7 all rejected, Nike ×5, Gucci ×5) | SHIPPED, UNVERIFIED |
| D4 | Aggregate `questions_asked` across debriefs into a prep list | SHIPPED, UNVERIFIED |
| D5 | **Act on the Cucinelli / Suitsupply finding** — 72 Tier-A contacts, no application | OPEN — Jason |

## E. Cadence

| | Item | State |
|---|---|---|
| E1 | Fortnightly reconcile scheduled, Mondays 09:00 | DONE |
| E2 | **Run it once manually to pre-approve connector permissions** | OPEN |
| E3 | Add LinkedIn export as a standing source in the reconcile | OPEN |
| E4 | Static desk retired, `desk.mjs` archived | DONE |

---

## The short version — next five things

1. Run the fortnightly task once, so permissions are approved before it fires unattended (E2)
2. One pass through the app to verify B3–B12 actually work (B13)
3. Request the LinkedIn export; it unblocks A6, A11 and E3 in one go
4. Fill the six debriefs while FrontlineIQ/Shammeera is still fresh (A9)
5. Decide on Cucinelli and Suitsupply — 72 Tier-A contacts, zero applications (D5)
