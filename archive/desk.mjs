#!/usr/bin/env node
// desk.mjs — Search Desk generator (user-layer tool, not part of the system manifest).
// Mirrors the Flagship Referral Desk (~/Downloads/flagship-pilot-hub.html) but reads
// live pipeline data instead of localStorage. Regenerate any time with: node desk.mjs
// Output: output/search-desk.html

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);
const WINDOW_DAYS = 30;          // touch window before an application reads as cold
const WARN_DAYS = 7;

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function parseDate(s) {
  const m = String(s).trim().match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
  if (!m) return null;
  return new Date(+m[1], +m[2] - 1, +(m[3] ?? 1));
}
const daysSince = d => d ? Math.round((TODAY - d) / 86400000) : null;
const fmt = d => d ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—';

// ---------- applications.md ----------
const trackerRaw = readFileSync('data/applications.md', 'utf8');
const activeSection = trackerRaw.split(/^## /m).find(s => s.startsWith('Active')) ?? '';
const rows = [];
for (const line of activeSection.split('\n')) {
  const cells = line.split('|').map(c => c.trim());
  if (cells.length < 10 || !/^\d+$/.test(cells[1])) continue;
  const [, num, date, company, role, score, status, , , notes] = cells;
  rows.push({ num: +num, date: parseDate(date), rawDate: date, company, role, score, status, notes });
}

// last-touch refinement: a "Follow-up sent {Mon} {D}" or "{action} ~{Mon} {D}" note beats the applied date
const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
function lastTouch(r) {
  let best = r.date;
  const re = /(?:follow-up sent|met|feedback[^.]*?|interview[^.]*?)\s~?\s?([A-Z][a-z]{2})\s(\d{1,2})/gi;
  let m;
  while ((m = re.exec(r.notes ?? ''))) {
    const mon = MONTHS[m[1].toLowerCase().slice(0, 3)];
    if (mon == null) continue;
    let d = new Date(TODAY.getFullYear(), mon, +m[2]);
    if (d > TODAY) d = new Date(TODAY.getFullYear() - 1, mon, +m[2]);
    if (!best || d > best) best = d;
  }
  return best;
}

const STATUS_RANK = { Offer: 0, Interview: 1, Responded: 2, Applied: 3 };
const active = rows
  .filter(r => STATUS_RANK[r.status] !== undefined)
  .map(r => {
    const touch = lastTouch(r);
    const since = daysSince(touch);
    const left = WINDOW_DAYS - since;
    return { ...r, touch, since, left };
  })
  .sort((a, b) => (STATUS_RANK[a.status] - STATUS_RANK[b.status]) || (b.left - a.left ? a.left - b.left : 0));

// ---------- pipeline.md ----------
let pending = [];
try {
  const pipeRaw = readFileSync('data/pipeline.md', 'utf8');
  const pendSection = pipeRaw.split(/^## /m).find(s => s.startsWith('Pending')) ?? '';
  pending = [...pendSection.matchAll(/^- \[ \] (\S+)(?:\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*(.+))?$/gm)]
    .map(m => ({ url: m[1], company: (m[2] ?? '').trim(), role: (m[3] ?? '').trim(), loc: (m[4] ?? '').trim() }));
} catch { /* no pipeline file */ }

// ---------- outreach targets + archive ----------
function readPipeTable(file) {
  if (!existsSync(file)) return [];
  const out = [];
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map(c => c.trim());
    if (!cells.length || cells[0] === '#' || /^-+$/.test(cells[0])) continue;
    out.push(cells);
  }
  return out;
}
const mdLink = s => {
  const m = String(s).match(/^\[(.+?)\]\((.+?)\)$/);
  return m ? { text: m[1], url: m[2] } : { text: String(s), url: '' };
};

// targets: # | Tier | Name | Title | Company | Status | Why | Connected
const targets = readPipeTable('data/outreach-targets.md').map(c => {
  const n = mdLink(c[2]);
  return { tier: c[1], name: n.text, url: n.url, title: c[3], company: c[4],
           status: c[5] || 'New', why: c[6], connected: c[7] };
});
// archive: # | Name | Ball | First | Last | In/Out | Status | Last message
const archive = readPipeTable('data/outreach.md').map(c => {
  const n = mdLink(c[1]);
  return { name: n.text, url: n.url, ball: c[2], first: c[3], last: c[4],
           inout: c[5], status: c[6], snippet: c[7] };
});
const ballWithMe = archive.filter(a => /\bMe\b/.test(a.ball));
const openTargets = targets.filter(t => t.status === 'New');

// ---------- stats ----------
const offers = active.filter(r => r.status === 'Offer');
const interviews = active.filter(r => r.status === 'Interview');
const warm = active.filter(r => r.status === 'Responded');
const applied = active.filter(r => r.status === 'Applied');
const overdue = active.filter(r => r.left <= 0).length;
const everApplied = rows.length;
const everResponded = interviews.length + warm.length;
const respRate = everApplied ? Math.round((everResponded / everApplied) * 1000) / 10 : 0;

const clockRow = r => {
  const pct = Math.max(0, Math.min(100, (r.left / WINDOW_DAYS) * 100));
  const cls = r.left <= 0 ? 'dead' : r.left <= WARN_DAYS ? 'warn' : '';
  const label = r.left <= 0 ? `${-r.left}d cold` : `${r.left}d`;
  const note = (r.notes ?? '').length > 110 ? esc(r.notes.slice(0, 107)) + '…' : esc(r.notes ?? '');
  return `<div class="row">
    <span><span class="rname">${esc(r.company)}</span><br><span class="rsub">${esc(r.role)}</span></span>
    <span class="c-contact rsub">${note}</span>
    <span class="mono rsub">${fmt(r.touch)}</span>
    <span class="track"><span class="fill ${cls}" style="width:${r.left <= 0 ? 100 : pct}%"></span><span class="days">${label}</span></span>
    <span class="stat-pill">${esc(r.status)}</span>
  </div>`;
};

const group = (title, note, list) => list.length ? `
  <div class="row rowhead"><span>${title}</span><span class="c-contact">Latest</span><span>Last touch</span><span>${note}</span><span></span></div>
  ${list.map(clockRow).join('\n')}` : '';

const html = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Search Desk — Jason Coelho</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Archivo+Narrow:wght@600;700&family=Roboto+Mono:wght@400;500;700&display=swap">
<style>
  /* Search Desk VHS — tokens carried from Jason's Claude Design system */
  :root{
    --sd-ground:#E9EBE6; --sd-panel:#F3F4F0; --sd-ink:#16181A; --sd-soft:#5B615F;
    --sd-rule:#C6CAC2; --sd-blueprint:#1F3D6B; --sd-accent:#A8451C; --sd-burn:#A8451C;
    --sd-live:#2F6B4F; --sd-live-l:#6FAE8B; --sd-amber:#E0A32E; --sd-plum:#7A3B62;
    --sd-scan:.3; --sd-tex:.4;
    /* aliases so existing rules keep working */
    --ground:var(--sd-ground); --panel:var(--sd-panel); --ink:var(--sd-ink);
    --ink-soft:var(--sd-soft); --rule:var(--sd-rule); --blueprint:var(--sd-blueprint);
    --live:var(--sd-live); --burn:var(--sd-burn);
    --gap:clamp(20px,3vw,34px);
    --mono:'Roboto Mono',ui-monospace,'SF Mono',Menlo,monospace;
    --sans:Archivo,system-ui,-apple-system,sans-serif;
    --cond:'Archivo Narrow',Archivo,system-ui,sans-serif;
  }
  *{box-sizing:border-box}
  /* dark deck surrounding a light tape label */
  html,body{background:var(--sd-ink)}
  body{margin:0;color:var(--ink);font-family:var(--sans);
    font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased}
  .wrap{max-width:1080px;margin:0 auto;padding:var(--gap);background:var(--ground);
    position:relative;min-height:100vh}
  /* scanline overlay — the signature */
  .wrap::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:2;
    opacity:var(--sd-scan);
    background:repeating-linear-gradient(180deg,rgba(22,24,26,.05) 0 1px,transparent 1px 3px)}
  .wrap>*{position:relative;z-index:1}
  a{color:var(--blueprint)}
  ::selection{background:var(--sd-accent);color:#fff}
  button:focus-visible,a:focus-visible{outline:2px solid var(--sd-accent);outline-offset:2px}
  h1,h2,h3{font-weight:800;margin:0;text-transform:uppercase;letter-spacing:.01em;line-height:1.02}
  h1{font-family:var(--cond)}
  .eyebrow{font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.16em;
    text-transform:uppercase;color:var(--ink-soft)}
  .mono{font-family:var(--mono);font-variant-numeric:tabular-nums}
  /* deck header bar with cassette glyph */
  .deck{display:flex;align-items:center;gap:9px;background:var(--sd-ink);
    margin:calc(var(--gap)*-1) calc(var(--gap)*-1) var(--gap);padding:9px var(--gap);
    border-bottom:2px solid var(--sd-ink)}
  .deck .glyph{width:22px;height:22px;background:var(--sd-accent);display:flex;
    align-items:center;justify-content:center;flex:none}
  .deck .glyph i{width:8px;height:8px;border:2px solid #fff;display:block}
  .deck .wm{font:900 15px/1 var(--sans);letter-spacing:.01em;color:var(--sd-ground);
    text-transform:uppercase}
  .deck .rec{margin-left:auto;display:flex;align-items:center;gap:6px;
    font:500 10px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--sd-ground)}
  .deck .rec b{width:7px;height:7px;border-radius:50%;background:var(--sd-accent);
    display:block;animation:sdblink 1.6s steps(1,end) infinite}
  @keyframes sdblink{0%,55%{opacity:1}56%,100%{opacity:.2}}
  @keyframes sdreel{to{transform:rotate(360deg)}}
  .mast{border-top:3px solid var(--ink);padding-top:14px;margin-bottom:var(--gap)}
  .mast h1{font-size:clamp(34px,6.5vw,64px);letter-spacing:-.02em}
  .mast .sub{display:flex;flex-wrap:wrap;gap:22px;margin-top:14px;border-top:1px solid var(--rule);padding-top:12px}
  .stat .k{display:block;font-family:var(--mono);font-size:10px;letter-spacing:.16em;
    text-transform:uppercase;color:var(--ink-soft)}
  .stat .v{font-weight:700;font-size:19px;text-transform:uppercase}
  .stat .v.burn{color:var(--burn)}
  .stat .v.live{color:var(--live)}
  section{margin-bottom:var(--gap)}
  .head{display:flex;align-items:baseline;gap:12px;border-bottom:1px solid var(--ink);
    padding-bottom:7px;margin-bottom:16px}
  .head h2{font-size:16px}
  .head .note{margin-left:auto;font-family:var(--mono);font-size:10px;letter-spacing:.12em;
    text-transform:uppercase;color:var(--ink-soft)}
  .clockbar{background:var(--panel);border:1px solid var(--rule);padding:16px}
  .row{display:grid;grid-template-columns:1.5fr 1.4fr 78px 1fr 84px;gap:10px;
    align-items:center;padding:9px 0;border-bottom:1px solid var(--rule)}
  .row:last-child{border-bottom:none}
  .rowhead{font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;
    color:var(--ink-soft);border-bottom:1px solid var(--ink);padding-bottom:5px;margin-top:14px}
  .rowhead:first-child{margin-top:0}
  .rname{font-weight:600}
  .rsub{font-size:12px;color:var(--ink-soft)}
  /* tape counter: 10% tick ruler as the track, diagonal hatch when flagged */
  .track{position:relative;height:16px;background:#DEE1DA;overflow:hidden;
    border:1px solid var(--sd-rule)}
  .track::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:2;
    background:repeating-linear-gradient(90deg,transparent 0 calc(10% - 1px),
      rgba(22,24,26,.28) calc(10% - 1px) 10%)}
  .fill{position:absolute;inset:0 auto 0 0;background:var(--sd-live-l)}
  .fill.warn{background:var(--sd-burn)}
  .fill.dead{background:#9AA09C}
  /* flagged rows get the damaged-tape hatch */
  .fill.warn::before,.fill.dead::before{content:"";position:absolute;inset:0;
    opacity:var(--sd-tex);
    background:repeating-linear-gradient(115deg,rgba(22,24,26,.35) 0 4px,transparent 4px 9px)}
  .days{position:absolute;right:5px;top:0;line-height:14px;font-family:var(--mono);
    font-size:10px;color:#fff;letter-spacing:.06em;z-index:3}
  .empty{padding:22px 0;color:var(--ink-soft);font-size:13.5px}
  .stat-pill{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;
    border:1px solid var(--rule);padding:2px 6px;display:inline-block;text-align:center}
  .steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:1px;
    background:var(--rule);border:1px solid var(--rule)}
  .step{background:var(--panel);padding:13px}
  .step .n{font-family:var(--mono);font-size:10px;letter-spacing:.14em;color:var(--blueprint)}
  .step h3{font-size:13px;margin:5px 0 5px}
  .step p{margin:0;font-size:12.5px;color:var(--ink-soft);line-height:1.45}
  .gate{border-left:3px solid var(--burn)}
  .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:var(--gap)}
  .links{list-style:none;margin:0;padding:0}
  .links li{border-bottom:1px solid var(--rule)}
  .links a{display:flex;gap:10px;align-items:baseline;padding:8px 0;text-decoration:none;color:var(--ink)}
  .links a:hover{color:var(--blueprint)}
  .links a:hover .lbl{text-decoration:underline}
  .links .idx{font-family:var(--mono);font-size:10px;color:var(--ink-soft);min-width:20px}
  .links .lbl{font-weight:500}
  .links .desc{margin-left:auto;font-size:11.5px;color:var(--ink-soft);text-align:right}
  dl{margin:0}
  dt{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;
    color:var(--ink-soft);margin-top:12px}
  dt:first-child{margin-top:0}
  dd{margin:2px 0 0;font-size:13.5px}
  .pend li{font-size:13.5px;padding:6px 0;border-bottom:1px solid var(--rule);
    list-style:none;display:flex;gap:9px}
  .pend{margin:0;padding:0}
  .pend .dot{color:var(--burn);font-family:var(--mono)}
  footer{border-top:1px solid var(--rule);padding-top:12px;font-size:11.5px;color:var(--ink-soft)}

  /* ---------- outreach ---------- */
  .deskbar{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:10px}
  .filters{display:flex;flex-wrap:wrap;gap:6px}
  .bankbar{margin-left:auto;display:flex;align-items:center;gap:10px}
  .chip{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;
    padding:6px 11px;border:1px solid var(--rule);background:var(--panel);color:var(--ink-soft);
    cursor:pointer;border-radius:0}
  .chip:hover{border-color:var(--ink);color:var(--ink)}
  .chip.on{background:var(--ink);border-color:var(--ink);color:var(--ground)}
  .bank{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;
    padding:6px 14px;border:1px solid var(--blueprint);background:var(--blueprint);color:#fff;cursor:pointer}
  .bank:hover{background:#17305a;border-color:#17305a}
  .bank[disabled]{opacity:.4;cursor:not-allowed}
  .tally{font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-soft)}
  .hint{font-size:12px;color:var(--ink-soft);margin:0 0 14px;max-width:70ch;line-height:1.5}
  #cards{display:grid;gap:1px;background:var(--rule);border:1px solid var(--rule)}
  .card{background:var(--panel);padding:14px 16px}
  .card[hidden]{display:none}
  .card.actioned{background:#EDEFEA}
  .card.actioned .who,.card.actioned .meta{opacity:.55}
  .cardhead{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .co{font-weight:700;font-size:15px;letter-spacing:.01em}
  .tier{font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;
    border:1px solid currentColor;padding:1px 6px}
  .tier.tA{color:var(--burn)}
  .tier.tB{color:var(--blueprint)}
  .tier.tC{color:var(--ink-soft)}
  .state{margin-left:auto;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--live)}
  .who{margin-top:5px;font-size:13.5px}
  .who a{color:var(--ink);text-decoration:none;border-bottom:1px solid var(--rule)}
  .who a:hover{color:var(--blueprint);border-color:var(--blueprint)}
  .meta{margin-top:3px;font-size:12px;color:var(--ink-soft)}
  .acts{display:flex;flex-wrap:wrap;gap:7px;margin-top:11px}
  .acts button{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;
    padding:7px 13px;border:1px solid var(--rule);background:#fff;color:var(--ink);cursor:pointer;border-radius:0}
  .acts button:hover{border-color:var(--ink)}
  .acts .primary{background:var(--ink);border-color:var(--ink);color:var(--ground)}
  .acts .primary:hover{background:var(--blueprint);border-color:var(--blueprint)}
  .acts .solid{background:var(--ink);border-color:var(--ink);color:var(--ground)}
  .acts .solid:hover{background:var(--live);border-color:var(--live)}
  .acts button[aria-pressed="true"]{background:var(--live);border-color:var(--live);color:#fff}
  .toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:var(--ink);
    color:var(--ground);font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;
    padding:11px 20px;opacity:0;pointer-events:none;transition:opacity .18s;z-index:9}
  .toast.show{opacity:1}
  @media(prefers-reduced-motion:reduce){.toast{transition:none}}
  @media(max-width:720px){
    .row{grid-template-columns:1fr 70px 84px;gap:6px 10px}
    .row .c-contact{grid-column:1/-1;order:3}
    .rowhead{display:none}
  }
</style>

<div class="wrap">

  <div class="deck">
    <span class="glyph"><i></i></span>
    <span class="wm">Search Desk</span>
    <span class="rec"><b></b> Rec</span>
  </div>

  <div class="mast">
    <span class="eyebrow">Career Ops · Job Search Pipeline · Jason Coelho</span>
    <h1>Search Desk</h1>
    <div class="sub">
      <div class="stat"><span class="k">Date</span><span class="v">${fmt(TODAY)} ${TODAY.getFullYear()}</span></div>
      <div class="stat"><span class="k">Live / committed</span><span class="v live">${offers.length}</span></div>
      <div class="stat"><span class="k">Interviews live</span><span class="v live">${interviews.length}</span></div>
      <div class="stat"><span class="k">Warm threads</span><span class="v">${warm.length}</span></div>
      <div class="stat"><span class="k">Awaiting response</span><span class="v">${applied.length}</span></div>
      <div class="stat"><span class="k">Gone cold</span><span class="v burn">${overdue}</span></div>
      <div class="stat"><span class="k">To evaluate</span><span class="v">${pending.length}</span></div>
      <div class="stat"><span class="k">Response rate</span><span class="v">${respRate}%</span></div>
    </div>
  </div>

  <section>
    <div class="head">
      <h2>Follow-up clock</h2>
      <span class="note">${WINDOW_DAYS}-day touch window · green = warm · grey = gone cold</span>
    </div>
    <div class="clockbar">
      ${active.length ? [
        group('Live / committed', 'Window', offers),
        group('In interview', 'Window', interviews),
        group('Warm — responded', 'Window', warm),
        group('Applied — awaiting response', 'Window', applied),
      ].join('\n') : '<div class="empty">Nothing tracked yet. Run a scan, evaluate, apply — rows appear here from data/applications.md.</div>'}
    </div>
  </section>

  <section>
    <div class="head">
      <h2>The gate</h2>
      <span class="note">Order is binding · nothing is submitted without Jason's hand on it</span>
    </div>
    <div class="steps">
      <div class="step"><span class="n">01</span><h3>Scan</h3><p>Zero-token sweep of ${'2'}0 tracked luxury/premium portals plus BoF and FashionUnited queries. New matches land in the pipeline inbox.</p></div>
      <div class="step gate"><span class="n">02</span><h3>Score — the 4.0 gate</h3><p>Every role is evaluated against the profile, scored /5. Below 4.0 the system recommends against applying. Quality over volume.</p></div>
      <div class="step"><span class="n">03</span><h3>Tailor</h3><p>CV and letter reformulated from cv.md and proof points. Keywords get reformulated, never fabricated.</p></div>
      <div class="step gate"><span class="n">04</span><h3>Review &amp; submit</h3><p>Jason reviews everything and clicks submit himself. The system never sends an application.</p></div>
      <div class="step"><span class="n">05</span><h3>Follow up</h3><p>Follow-up cadence tracked per application. The clock above shows who is going cold and who to chase this week.</p></div>
    </div>
  </section>

  <section>
    <div class="head">
      <h2>Personal outreach</h2>
      <span class="note">${targets.length} contacts at target companies · decisions bank locally</span>
    </div>

    <div class="deskbar">
      <div class="filters" role="group" aria-label="Filter contacts">
        <button class="chip on" data-f="open">To work${openTargets.length ? ` (${openTargets.length})` : ''}</button>
        <button class="chip" data-f="A">Tier A</button>
        <button class="chip" data-f="B">Tier B</button>
        <button class="chip" data-f="C">Tier C</button>
        <button class="chip" data-f="done">Actioned</button>
        <button class="chip" data-f="all">All</button>
      </div>
      <div class="bankbar">
        <span class="tally mono" id="tally">—</span>
        <button class="bank" id="bank">Bank results</button>
        <button class="chip" id="reset" title="Clear locally banked decisions">Reset</button>
      </div>
    </div>
    <p class="hint">
      <strong>Draft message</strong> copies a ready-to-paste instruction and marks the card drafted — paste it into
      Claude Code and the message gets written in your voice from <span class="mono">voice-dna.md</span>.
      Decisions save in this browser; <strong>Bank results</strong> downloads them as a JSON ledger — hand that
      file back to Claude Code to merge into <span class="mono">data/outreach-targets.md</span>.
    </p>

    <div id="cards">
${targets.map((t, i) => `      <article class="card" data-i="${i}" data-tier="${t.tier}" data-name="${esc(t.name)}" data-title="${esc(t.title)}" data-company="${esc(t.company)}" data-why="${esc(t.why)}">
        <div class="cardhead">
          <span class="co">${esc(t.company)}</span>
          <span class="tier t${t.tier}">Tier ${t.tier}</span>
          <span class="state mono" data-state></span>
        </div>
        <div class="who">${t.url ? `<a href="${esc(t.url)}" target="_blank" rel="noopener">${esc(t.name)}</a>` : esc(t.name)} · ${esc(t.title)}</div>
        <div class="meta">${esc(t.why)}${t.connected ? ` · connected ${esc(t.connected)}` : ''}</div>
        <div class="acts">
          <button class="primary" data-a="draft">Draft message</button>
          <button class="solid" data-a="Reached out">Mark reached out</button>
          <button data-a="Skipped">Skip for later</button>
          <button data-a="Not a fit">Not a fit</button>
        </div>
      </article>`).join('\n')}
    </div>
    <div class="empty" id="noneShown" hidden>Nothing in this view. Try another filter.</div>
  </section>

  <section>
    <div class="head">
      <h2>Conversation archive</h2>
      <span class="note">${archive.length} real threads since Nov 2025 · ${ballWithMe.length} awaiting your reply</span>
    </div>
    <div class="clockbar">
      <div class="row rowhead"><span>Person</span><span class="c-contact">Last message</span><span>Last</span><span>Ball</span><span></span></div>
      ${ballWithMe.slice(0, 14).map(a => `<div class="row">
        <span><span class="rname">${a.url ? `<a href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.name)}</a>` : esc(a.name)}</span></span>
        <span class="c-contact rsub">${esc(a.snippet)}</span>
        <span class="mono rsub">${esc(a.last)}</span>
        <span class="rsub">${esc(a.inout)} msgs</span>
        <span class="stat-pill">Reply due</span>
      </div>`).join('\n      ')}
      ${ballWithMe.length > 14 ? `<div class="empty">+ ${ballWithMe.length - 14} more awaiting a reply — full archive in <span class="mono">data/outreach.md</span>.</div>` : ''}
    </div>
  </section>

  <div class="cols">
    <section>
      <div class="head"><h2>Links</h2></div>
      <ul class="links">
        <li><a href="https://jobs.businessoffashion.com" target="_blank" rel="noopener"><span class="idx">01</span><span class="lbl">BoF Careers</span><span class="desc">The luxury board</span></a></li>
        <li><a href="https://fashionunited.com/jobs" target="_blank" rel="noopener"><span class="idx">02</span><span class="lbl">FashionUnited</span><span class="desc">Global fashion roles</span></a></li>
        <li><a href="https://www.linkedin.com/jobs" target="_blank" rel="noopener"><span class="idx">03</span><span class="lbl">LinkedIn Jobs</span><span class="desc">Saved searches</span></a></li>
        <li><a href="https://www.faire.com/careers" target="_blank" rel="noopener"><span class="idx">04</span><span class="lbl">Faire careers</span><span class="desc">Wholesale marketplace</span></a></li>
        <li><a href="https://www.joor.com/careers" target="_blank" rel="noopener"><span class="idx">05</span><span class="lbl">JOOR careers</span><span class="desc">Wholesale SaaS</span></a></li>
        <li><a href="https://jobs.businessoffashion.com/jobs/chief-of-staff" target="_blank" rel="noopener"><span class="idx">06</span><span class="lbl">Chief of Staff roles</span><span class="desc">Founder-adjacent</span></a></li>
        <li><a href="https://parallelstudio.africa/about" target="_blank" rel="noopener"><span class="idx">07</span><span class="lbl">Parallel Studio</span><span class="desc">The portfolio</span></a></li>
        <li><a href="https://linkedin.com/in/jason-coelho" target="_blank" rel="noopener"><span class="idx">08</span><span class="lbl">LinkedIn profile</span><span class="desc">Keep it current</span></a></li>
      </ul>
    </section>

    <section>
      <div class="head"><h2>Waiting on them</h2><span class="note">Chase list</span></div>
      <ul class="pend">
        ${interviews.concat(warm).map(r => `<li><span class="dot">▸</span><span><strong>${esc(r.company)}</strong> — ${esc((r.notes ?? '').split('.').slice(-2).join('.').trim().replace(/^["'”\s]+/, '') || r.role)}</span></li>`).join('\n        ')}
        ${pending.length ? `<li><span class="dot">▸</span><span><strong>Pipeline inbox</strong> — ${pending.length} scanned role${pending.length === 1 ? '' : 's'} awaiting evaluation: ${esc([...new Set(pending.map(p => p.company).filter(Boolean))].join(', '))}. Run the pipeline.</span></li>` : ''}
      </ul>
    </section>
  </div>

  <div class="cols">
    <section>
      <div class="head"><h2>What qualifies</h2></div>
      <dl>
        <dt>Primary archetypes</dt>
        <dd>Commercial / ops lead in luxury or premium craft · buying &amp; merchandising · wholesale &amp; brand partnerships · B2B sales in craft- or luxury-adjacent SaaS · chief of staff to a founder.</dd>
        <dt>Markets</dt>
        <dd>Cape Town / hybrid · USA (dual citizen, on-site or remote) · remote EMEA. Portuguese/EU work rights in progress.</dd>
        <dt>Blocked</dt>
        <dd>Fast-fashion, discount and mass retail · cold SDR/BDR with no domain · personal-branding or influencer work · pure IC coding · MLM, hustle, commission-only-no-base.</dd>
        <dt>Positioning</dt>
        <dd>Commercial operator in luxury and premium retail. Engine room, not on stage. Domain fluency in fashion, craft and luxury is the moat.</dd>
        <dt>Proof</dt>
        <dd>$23M menswear portfolio at Brunello Cucinelli, 5% profit growth across 23+ locations · 13 stores + 25 wholesale accounts as West Coast Regional VM · 2 pilots closed in 4 months at Flagship.ai.</dd>
      </dl>
    </section>

    <section>
      <div class="head"><h2>The toolkit</h2><span class="note">Skills · values · attributes</span></div>
      <dl>
        <dt>Core skills</dt>
        <dd>Visual merchandising &amp; brand strategy · retail buying &amp; assortment planning · store operations · wholesale account management · luxury clienteling · new store openings · team training · B2B SaaS sales (HubSpot).</dd>
        <dt>Strengths (externally assessed)</dt>
        <dd>Adaptability and change resilience · relationship-building across functions · sound judgement under ambiguity · persuading through logical argument · emotional intelligence · strategic, integrative thinking.</dd>
        <dt>Values</dt>
        <dd>Craft, quality and long-term thinking · mentorship, apprenticeship, hospitality · autonomy and trust · warm, direct communication.</dd>
        <dt>Working style</dt>
        <dd>Introverted, analytical, integrative. Draft-first, processes then acts. Engine room, not on stage.</dd>
      </dl>
    </section>

    <section>
      <div class="head"><h2>Scoreboard</h2><span class="note">Lifetime funnel</span></div>
      <dl>
        <dt>Funnel</dt>
        <dd class="mono">${everApplied} tracked → ${everResponded} responded (${respRate}%) → ${interviews.length} in interview → 0 offers</dd>
        <dt>Most advanced</dt>
        <dd>${interviews.length ? esc(interviews[0].company) + ' — ' + esc(interviews[0].role) : '—'}</dd>
        <dt>Comp stance</dt>
        <dd>Open — priority is landing the right role, not maximising comp. Never anchor first. Commission-only is a red flag, not a negotiation.</dd>
        <dt>Notice</dt>
        <dd>30 days.</dd>
        <dt>Refresh this desk</dt>
        <dd class="mono">node scan.mjs && node desk.mjs</dd>
      </dl>
    </section>
  </div>

  <footer>
    Generated ${fmt(TODAY)} ${TODAY.getFullYear()} from data/applications.md · data/pipeline.md ·
    data/outreach-targets.md · data/outreach.md ·
    Mirrors the Flagship Referral Desk · Regenerate: node desk.mjs
  </footer>
</div>

<div class="toast" id="toast" role="status" aria-live="polite"></div>

<script>
(function(){
  const KEY = 'career-ops-outreach-v1';
  const cards = [...document.querySelectorAll('.card')];
  const toastEl = document.getElementById('toast');
  let state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { state = {}; }

  let toastTimer;
  function toast(msg){
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(()=>toastEl.classList.remove('show'), 2000);
  }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){} };
  const keyOf = c => c.dataset.name + '|' + c.dataset.company;

  function paint(){
    let shown = 0;
    const f = document.querySelector('.chip.on')?.dataset.f || 'open';
    for (const c of cards){
      const st = state[keyOf(c)];
      const done = !!st && st.status !== 'Drafted';
      c.classList.toggle('actioned', done);
      c.querySelector('[data-state]').textContent = st ? st.status : '';
      for (const b of c.querySelectorAll('.acts button')){
        const a = b.dataset.a;
        b.setAttribute('aria-pressed', String(!!st && (st.status === a || (a === 'draft' && st.drafted))));
      }
      const vis = f === 'all' ? true
        : f === 'open' ? !done
        : f === 'done' ? done
        : c.dataset.tier === f;
      c.hidden = !vis;
      if (vis) shown++;
    }
    document.getElementById('noneShown').hidden = shown > 0;
    const n = Object.keys(state).length;
    const drafted = Object.values(state).filter(s => s.drafted).length;
    document.getElementById('tally').textContent = n ? n + ' banked · ' + drafted + ' drafted' : 'nothing banked yet';
    document.getElementById('bank').disabled = n === 0;
  }

  document.getElementById('cards').addEventListener('click', function(ev){
    const btn = ev.target.closest('button[data-a]'); if (!btn) return;
    const card = btn.closest('.card'), k = keyOf(card), a = btn.dataset.a;
    const d = card.dataset;
    const entry = state[k] || { name: d.name, company: d.company, title: d.title, tier: d.tier, status: '', drafted: false };
    entry.date = new Date().toISOString().slice(0,10);

    if (a === 'draft'){
      const prompt = 'Draft a LinkedIn outreach message to ' + d.name + ', ' + d.title + ' at ' + d.company +
        ' (' + d.why + '). Use my voice from voice-dna.md, keep it under 300 characters.';
      entry.drafted = true;
      if (!entry.status) entry.status = 'Drafted';
      navigator.clipboard?.writeText(prompt)
        .then(()=>toast('Prompt copied — paste into Claude Code'))
        .catch(()=>toast('Marked drafted (clipboard blocked)'));
    } else {
      entry.status = (entry.status === a) ? '' : a;
      if (!entry.status && !entry.drafted) { delete state[k]; save(); paint(); return; }
      toast(entry.status ? d.name + ' → ' + entry.status : 'Cleared');
    }
    state[k] = entry; save(); paint();
  });

  document.querySelector('.filters').addEventListener('click', function(ev){
    const c = ev.target.closest('.chip'); if (!c) return;
    document.querySelectorAll('.filters .chip').forEach(x=>x.classList.toggle('on', x === c));
    paint();
  });

  document.getElementById('reset').addEventListener('click', function(){
    if (!Object.keys(state).length) return;
    if (!confirm('Clear all locally banked decisions? Bank them first if you want to keep them.')) return;
    state = {}; save(); paint(); toast('Cleared');
  });

  document.getElementById('bank').addEventListener('click', async function(){
    const rows = Object.values(state);
    if (!rows.length) return;
    const payload = JSON.stringify({
      exported: new Date().toISOString().slice(0,10),
      merge_into: 'data/outreach-targets.md',
      decisions: rows,
    }, null, 1);
    const filename = 'outreach-ledger-' + new Date().toISOString().slice(0,10) + '.json';
    if (window.claude && window.claude.downloads){
      try {
        await window.claude.downloads.save({ filename: filename, data: payload });
        toast('Banked ' + rows.length + ' decisions');
      } catch (e) {
        const code = e && e.code;
        if (code === 'declined') toast('Save declined');
        else if (code === 'rate_limited') toast('Try again in a moment');
        else { try { await navigator.clipboard.writeText(payload); toast('Copied instead — paste to Claude'); }
               catch (e2) { toast('Could not save the ledger'); } }
      }
    } else {
      try { await navigator.clipboard.writeText(payload); toast('Ledger copied — paste into Claude Code'); }
      catch (e) { toast('Download unavailable in this view'); }
    }
  });

  paint();
})();
</script>
`;

mkdirSync('output', { recursive: true });
writeFileSync('output/search-desk.html', html);
console.log(JSON.stringify({
  written: 'output/search-desk.html',
  active: active.length, interviews: interviews.length, warm: warm.length,
  applied: applied.length, cold: overdue, pending: pending.length,
}));
