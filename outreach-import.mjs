#!/usr/bin/env node
// outreach-import.mjs — build the personal-outreach archive + target list from a
// LinkedIn data export (user-layer tool; not part of the system manifest).
//
//   node outreach-import.mjs <path-to-unzipped-linkedin-export>
//
// Writes (never overwrites decisions already banked — see MERGE below):
//   data/outreach.md          archive of real conversations since the cutoff
//   data/outreach-targets.md  hiring-relevant connections at target companies
//
// MERGE: rows already carrying a status other than `New` keep it. Re-running
// after a fresh export adds new people and refreshes last-contact dates only.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SRC = process.argv[2];
if (!SRC) { console.error('Usage: node outreach-import.mjs <linkedin-export-dir>'); process.exit(1); }

const CUTOFF = new Date('2025-11-01');
const ME = 'Jason Coelho';

// ---------- tiny CSV reader (quoted fields, embedded newlines) ----------
function parseCSV(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
function readTable(path, headerStartsWith) {
  if (!existsSync(path)) return [];
  const rows = parseCSV(readFileSync(path, 'utf8').replace(/^﻿/, ''));
  const h = rows.findIndex(r => (r[0] ?? '').trim() === headerStartsWith);
  if (h < 0) return [];
  const cols = rows[h].map(c => c.trim());
  return rows.slice(h + 1).filter(r => r.length >= cols.length - 1 && r.some(c => c.trim()))
    .map(r => Object.fromEntries(cols.map((c, i) => [c, (r[i] ?? '').trim()])));
}
// Pipes are REPLACED, not backslash-escaped: these tables are re-read by a naive
// split('|') here and in desk.mjs, which would treat "\|" as a column break.
const esc = s => String(s ?? '').replace(/\|/g, '·').replace(/\r?\n/g, ' ').trim();
const iso = d => d.toISOString().slice(0, 10);

// ---------- 1. conversation archive ----------
const TEMPLATE = /just wanted to take a moment to introduce myself/i;
const msgs = readTable(join(SRC, 'messages.csv'), 'CONVERSATION ID');
const convos = new Map();
for (const m of msgs) {
  if (m['IS MESSAGE DRAFT'] === 'Yes') continue;
  const d = new Date((m.DATE || '').slice(0, 19).replace(' ', 'T') + 'Z');
  if (isNaN(d)) continue;
  const id = m['CONVERSATION ID'];
  if (!convos.has(id)) convos.set(id, []);
  convos.get(id).push({
    d, from: m.FROM, to: m.TO, txt: m.CONTENT || '',
    url: ((m.FROM !== ME ? m['SENDER PROFILE URL'] : m['RECIPIENT PROFILE URLS']) || '').split(',')[0],
  });
}

const threads = [];
for (const list of convos.values()) {
  list.sort((a, b) => a.d - b.d);
  const mine = list.filter(m => m.from === ME && m.d >= CUTOFF);
  const theirs = list.filter(m => m.from !== ME && m.d >= CUTOFF);
  if (!mine.length && !theirs.length) continue;
  // signal: they replied, or Jason wrote something that isn't the mass template
  const custom = mine.filter(m => !TEMPLATE.test(m.txt) && m.txt.length > 40);
  if (!theirs.length && !custom.length) continue;
  const other = list.find(m => m.from === ME && m.to && m.to !== ME)?.to
             ?? list.find(m => m.from !== ME)?.from;
  if (!other) continue;
  const last = list[list.length - 1];
  threads.push({
    name: other,
    url: list.find(m => m.url)?.url ?? '',
    first: iso(new Date(Math.min(...(mine.length ? mine : theirs).map(m => +m.d)))),
    last: iso(last.d),
    inbound: theirs.length, outbound: mine.length,
    ballWithMe: last.from !== ME,
    substantive: theirs.some(m => m.txt.length > 120) || custom.length > 0,
    snippet: last.txt.replace(/\s+/g, ' ').slice(0, 120),
  });
}
threads.sort((a, b) => b.last.localeCompare(a.last));

// ---------- 2. target contacts ----------
const SENIOR = /\b(head of|director|vp|vice president|chief|founder|owner|c[eo]o|general manager|partner|principal)\b/i;
const RELEVANT = /\b(head of|director|vp|vice president|chief|founder|owner|general manager|talent|recruit|people|hr|buying|buyer|merchandis|wholesale|commercial|retail|brand)\b/i;

// companies worth a warm approach: portals targets + live applications + alma maters
const TARGET_COMPANIES = [
  ['Brunello Cucinelli', 'A', 'Alma mater — 8 years, strongest relationship equity'],
  ['Suitsupply', 'A', 'Alma mater — Regional VM, West Coast'],
  ['adidas', 'A', 'Live interview process (Space & VM Planning EM)'],
  ['Nike', 'A', 'Live applications (3 Global VM roles)'],
  ['Walmart', 'A', 'Live interview (VM Manager, Fashion)'],
  ['Zegna', 'B', 'Portals target — Italian luxury menswear'],
  ['Ralph Lauren', 'B', 'Portals target — large wholesale + buying org'],
  ['Loro Piana', 'B', 'Portals target — quiet-luxury peer of Cucinelli'],
  ['Moncler', 'B', 'Portals target — luxury outerwear'],
  ['Faire', 'B', 'Portals target — wholesale marketplace'],
  ['Rebag', 'B', 'Portals target — luxury resale, live roles'],
  ['StockX', 'B', 'Portals target — marketplace commercial roles'],
  ['Grailed', 'B', 'Portals target — menswear marketplace'],
  ['JOOR', 'B', 'Portals target — wholesale SaaS'],
  ['Mytheresa', 'B', 'Portals target — luxury e-comm buying org'],
  ['Aesop', 'B', 'Portals target — premium design-led retail'],
  ['The RealReal', 'B', 'Portals target — luxury consignment'],
  ['1stDibs', 'B', 'Portals target — luxury marketplace'],
  ['Sotheby', 'B', 'Portals target — luxury client development'],
  ['Levi', 'B', 'Live applications (Brand Manager, Merchant SSA)'],
  ['Gucci', 'B', 'Live applications (Store Manager CPT, Merchandising)'],
  ['Kering', 'B', 'Live application via Gucci'],
  ['Woolworths', 'B', 'Premium SA retailer — Cape Town buying org'],
  ['TFG', 'C', 'SA retail group — Foschini'],
  ['Superbalist', 'C', 'Live applications (Buyer roles)'],
  ['lululemon', 'C', 'Premium athletic — adjacent VM/commercial'],
  ['Audemars Piguet', 'C', 'Luxury watches — client development'],
  ['Calvin Klein', 'C', 'PVH — wholesale/merchandising'],
  ['Gap', 'C', 'Live application'],
  ['Represent', 'C', 'Live application (US Specialty Sales Manager)'],
];

const conns = readTable(join(SRC, 'Connections.csv'), 'First Name');
const targets = [];
for (const c of conns) {
  const company = c.Company, title = c.Position;
  if (!company || !title || !RELEVANT.test(title)) continue;
  const match = TARGET_COMPANIES.find(([n]) => company.toLowerCase().includes(n.toLowerCase()));
  if (!match) continue;
  const [, tier, why] = match;
  if (tier !== 'A' && !SENIOR.test(title)) continue;   // B/C: senior contacts only
  targets.push({
    name: `${c['First Name']} ${c['Last Name']}`.trim(),
    title, company, why, tier,
    url: c.URL || '', email: c['Email Address'] || '',
    connected: (c['Connected On'] || '').trim(),
  });
}
const rank = { A: 0, B: 1, C: 2 };
targets.sort((a, b) => rank[a.tier] - rank[b.tier] || a.company.localeCompare(b.company) || a.name.localeCompare(b.name));

// ---------- 3. preserve banked decisions ----------
// Column indices are 0-based over the cells BETWEEN the outer pipes, matching
// how desk.mjs reads these same tables.
function existingStatus(file, nameIdx, statusIdx) {
  const map = new Map();
  if (!existsSync(file)) return map;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map(c => c.trim());
    if (cells.length <= statusIdx || cells[0] === '#' || /^-+$/.test(cells[0])) continue;
    const raw = cells[nameIdx] ?? '', status = cells[statusIdx] ?? '';
    const name = (raw.match(/^\[(.+?)\]\(/) ?? [, raw])[1];   // unwrap [Name](url)
    if (name && status && status !== 'New') map.set(name.toLowerCase(), status);
  }
  return map;
}
// targets: 0=# 1=Tier 2=Name 3=Title 4=Company 5=Status
const keptTargets = existingStatus('data/outreach-targets.md', 2, 5);
// archive: 0=# 1=Name 2=Ball 3=First 4=Last 5=In/Out 6=Status
const keptArchive = existingStatus('data/outreach.md', 1, 6);

// ---------- 4. write ----------
const today = iso(new Date());
const link = (name, url) => url ? `[${esc(name)}](${url})` : esc(name);

writeFileSync('data/outreach-targets.md', `# Outreach Targets

Hiring-relevant LinkedIn connections at target companies. Tier A = live process or alma mater,
B = portals target, C = adjacent. Statuses: \`New\` · \`Drafted\` · \`Reached out\` · \`Replied\` ·
\`Meeting\` · \`Skipped\` · \`Not a fit\`.

Generated ${today} from the LinkedIn export by \`node outreach-import.mjs\`.
Decisions already banked here are preserved on re-import.

| # | Tier | Name | Title | Company | Status | Why | Connected |
|---|------|------|-------|---------|--------|-----|-----------|
${targets.map((t, i) => `| ${i + 1} | ${t.tier} | ${link(t.name, t.url)} | ${esc(t.title)} | ${esc(t.company)} | ${keptTargets.get(t.name.toLowerCase()) ?? 'New'} | ${esc(t.why)} | ${esc(t.connected)} |`).join('\n')}
`);

writeFileSync('data/outreach.md', `# Outreach Archive

Real LinkedIn conversations since ${iso(CUTOFF)} — threads where someone replied or where a
genuine message was written (the mass connection-note blast is filtered out).
\`Ball\` = who owes the next message.

Generated ${today} by \`node outreach-import.mjs\`. Banked statuses are preserved on re-import.

| # | Name | Ball | First | Last | In/Out | Status | Last message |
|---|------|------|-------|------|--------|--------|--------------|
${threads.map((t, i) => `| ${i + 1} | ${link(t.name, t.url)} | ${t.ballWithMe ? '**Me**' : 'Them'} | ${t.first} | ${t.last} | ${t.inbound}/${t.outbound} | ${keptArchive.get(t.name.toLowerCase()) ?? 'New'} | ${esc(t.snippet)} |`).join('\n')}
`);

console.log(JSON.stringify({
  targets: targets.length,
  tierA: targets.filter(t => t.tier === 'A').length,
  threads: threads.length,
  ballWithMe: threads.filter(t => t.ballWithMe).length,
  substantive: threads.filter(t => t.substantive).length,
  preserved: keptTargets.size + keptArchive.size,
}, null, 1));
