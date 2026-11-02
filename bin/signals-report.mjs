#!/usr/bin/env node
// Monthly prompt-signal rates from inbox/signals.jsonl (written by the coach hook).
// Rough regex signals: read the direction, not the decimals. ↑ higher is better, ↓ lower is better.
//   node bin/signals-report.mjs [--since YYYY-MM-DD]
import fs from 'node:fs';
import path from 'node:path';
import { INBOX } from './lib.mjs';

const since = (() => { const i = process.argv.indexOf('--since'); return i >= 0 ? process.argv[i + 1] : ''; })();
const file = path.join(INBOX, 'signals.jsonl');
let rows = [];
try {
  rows = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
} catch { console.log(`no signals yet (${file}); they appear after a few prompts with the coach hook installed`); process.exit(0); }
rows = rows.filter((r) => !since || r.t >= since);

const FLAGS = ['no_done', 'ui_no_visual', 'debug_no_hypothesis', 'asks_status', 'vague', 'multi_task', 'research'];
const byMonth = new Map();
for (const r of rows) {
  const m = r.t.slice(0, 7);
  if (!byMonth.has(m)) byMonth.set(m, []);
  byMonth.get(m).push(r);
}
const pct = (n, d) => (d ? `${Math.round((100 * n) / d)}%` : '-');
console.log(`| month | prompts | builds | done% of builds (↑) | ${FLAGS.map((f) => `${f} (↓)`).join(' | ')} |`);
console.log(`|${'---|'.repeat(4 + FLAGS.length)}`);
for (const [m, rs] of [...byMonth].sort()) {
  const builds = rs.filter((r) => r.build).length;
  const done = rs.filter((r) => r.build && !r.no_done).length;
  console.log(`| ${m} | ${rs.length} | ${builds} | ${pct(done, builds)} | ${FLAGS.map((f) => pct(rs.filter((r) => r[f]).length, rs.length)).join(' | ')} |`);
}
