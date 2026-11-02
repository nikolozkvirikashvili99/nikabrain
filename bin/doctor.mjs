#!/usr/bin/env node
// Health check: is nikabrain installed, within budget, and internally consistent?
//   node bin/doctor.mjs            all checks
//   node bin/doctor.mjs --repo     skip the ~/.claude install checks (repo consistency only)
// Exit 1 if any ERROR. Warnings are things /curate should look at.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, CLAUDE_DIR, readJSON, listDirs, frontmatter, walk } from './lib.mjs';

const errors = [];
const warns = [];
const infos = [];
const E = (m) => errors.push(m);
const W = (m) => warns.push(m);
const I = (m) => infos.push(m);
const read = (p) => fs.readFileSync(p, 'utf8');
const exists = (p) => { try { fs.lstatSync(p); return true; } catch { return false; } };
const same = (a, b) => path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();

const globalSkills = listDirs(path.join(ROOT, 'global', 'skills'));
const librarySkills = listDirs(path.join(ROOT, 'library', 'skills'));

// ---- install ----
function install() {
  const md = path.join(CLAUDE_DIR, 'CLAUDE.md');
  if (!exists(md)) E('~/.claude/CLAUDE.md missing: run node bin/install.mjs --apply');
  else if (!read(md).includes('nikabrain')) E('~/.claude/CLAUDE.md is not nikabrain\'s (install backs yours up and replaces it)');
  for (const n of [...globalSkills, ...librarySkills]) {
    const l = path.join(CLAUDE_DIR, 'skills', n);
    let t = null;
    try { t = fs.readlinkSync(l); } catch { /* not a link */ }
    if (!t) { E(`skill ${n} not linked into ~/.claude/skills`); continue; }
    const want = path.join(ROOT, globalSkills.includes(n) ? 'global' : 'library', 'skills', n);
    if (!same(path.resolve(path.dirname(l), t), want)) E(`skill ${n} links to ${t}, not ${want}`);
  }
  const agentsDir = path.join(CLAUDE_DIR, 'agents');
  for (const f of fs.readdirSync(path.join(ROOT, 'global', 'agents'))) {
    const p = path.join(agentsDir, f);
    if (!exists(p)) E(`agent ${f} not installed`);
    else if (read(p) !== read(path.join(ROOT, 'global', 'agents', f))) W(`agent ${f} differs from global/agents (re-run install)`);
  }
  const s = readJSON(path.join(CLAUDE_DIR, 'settings.json'), {});
  const cmds = Object.entries(s.hooks || {}).flatMap(([ev, gs]) => gs.flatMap((g) => (g.hooks || []).map((h) => [ev, h.command || ''])));
  for (const [ev, file] of [['UserPromptSubmit', 'coach.mjs'], ['PreToolUse', 'guard.mjs'], ['SessionStart', 'guard.mjs'], ['SessionEnd', 'session-log.mjs'], ['PreCompact', 'session-log.mjs']]) {
    const hit = cmds.find(([e, c]) => e === ev && c.includes(file) && c.includes('nikabrain'));
    if (!hit) { E(`hook ${ev} → ${file} not in settings.json`); continue; }
    const p = (/"([^"]+)"/.exec(hit[1]) || [])[1];
    if (p && !exists(p)) E(`hook ${ev} points at a missing file: ${p}`);
  }
}

// ---- budget ----
function budget() {
  const core = read(path.join(ROOT, 'brain', 'CORE.md'));
  const lines = core.split('\n').length;
  if (lines > 130) E(`CORE.md is ${lines} lines (budget ~100): merge or demote now`);
  else if (lines > 100) W(`CORE.md is ${lines} lines (budget ~100)`);
  const descChars = [...globalSkills.map((n) => path.join(ROOT, 'global', 'skills', n)), ...librarySkills.map((n) => path.join(ROOT, 'library', 'skills', n))]
    .reduce((sum, d) => sum + ((frontmatter(read(path.join(d, 'SKILL.md'))) || {}).description || '').length, 0);
  const agentChars = fs.readdirSync(path.join(ROOT, 'global', 'agents')).reduce((s, f) => s + ((frontmatter(read(path.join(ROOT, 'global', 'agents', f))) || {}).description || '').length, 0);
  const tok = (n) => Math.round(n / 4);
  I(`always-on context ≈ ${tok(core.length)} tok CORE (${lines} lines) + ${tok(descChars)} tok skill descriptions (${globalSkills.length + librarySkills.length} skills) + ${tok(agentChars)} tok agent descriptions`);
}

// ---- frontmatter ----
function entries() {
  for (const kind of ['habits', 'patterns']) {
    for (const f of fs.readdirSync(path.join(ROOT, 'brain', kind)).filter((x) => x.endsWith('.md'))) {
      const fm = frontmatter(read(path.join(ROOT, 'brain', kind, f)));
      if (!fm) { E(`brain/${kind}/${f}: no frontmatter`); continue; }
      if (fm.name !== f.replace(/\.md$/, '')) E(`brain/${kind}/${f}: name "${fm.name}" ≠ file name`);
      if (!fm.description) E(`brain/${kind}/${f}: no description`);
    }
  }
  for (const [base, names] of [['global', globalSkills], ['library', librarySkills]]) {
    for (const n of names) {
      const p = path.join(ROOT, base, 'skills', n, 'SKILL.md');
      if (!exists(p)) { E(`${base}/skills/${n}: no SKILL.md`); continue; }
      const fm = frontmatter(read(p)) || {};
      if (fm.name !== n) E(`${base}/skills/${n}: frontmatter name "${fm.name}" ≠ folder (the skill would load under another name)`);
      if (!fm.description) E(`${base}/skills/${n}: no description (it would never trigger)`);
    }
  }
  // [[links]] that point nowhere: fine by convention, but worth listing
  const names = new Set(walk(path.join(ROOT, 'brain')).filter((f) => f.endsWith('.md')).map((f) => path.basename(f, '.md')));
  const dangling = new Set();
  for (const f of walk(path.join(ROOT, 'brain')).concat(walk(path.join(ROOT, 'global')), walk(path.join(ROOT, 'library'))).filter((x) => x.endsWith('.md'))) {
    for (const m of read(f).matchAll(/\[\[([^\]]+)\]\]/g)) if (!names.has(m[1]) && !['existing', 'links', 'name', 'their-name'].includes(m[1])) dangling.add(m[1]);
  }
  if (dangling.size) I(`[[links]] with no entry yet (worth writing when evidence appears): ${[...dangling].sort().join(', ')}`);
}

// ---- library ----
function library() {
  const src = readJSON(path.join(ROOT, 'library', 'sources.json')).sources;
  const notice = read(path.join(ROOT, 'library', 'NOTICE.md'));
  const ledger = read(path.join(ROOT, 'brain', 'library-ledger.md'));
  const mapped = new Map();
  for (const [name, s] of Object.entries(src)) {
    for (const sk of Object.keys(s.skills || {})) mapped.set(sk, name);
    if (!notice.includes(s.repo.replace(/^https:\/\//, ''))) E(`source ${name}: ${s.repo} has no NOTICE.md entry`);
    if (!/^[0-9a-f]{40}$/.test(s.pinned_sha || '')) E(`source ${name}: pinned_sha is not a full commit hash`);
  }
  for (const n of librarySkills) {
    if (!mapped.has(n)) E(`library/skills/${n}: not in sources.json (where did it come from?)`);
    if (!ledger.includes(`skill \`${n}\``)) W(`library/skills/${n}: no row in brain/library-ledger.md`);
  }
  for (const f of fs.readdirSync(path.join(ROOT, 'library', 'checklists'))) {
    if (!ledger.includes(`checklist \`${f}\``)) W(`checklist ${f}: no ledger row`);
  }
  for (const [sk, s] of mapped) if (!librarySkills.includes(sk)) E(`sources.json maps ${sk} (${s}) but library/skills/${sk} is missing`);
}

try {
  if (!process.argv.includes('--repo')) install();
  budget(); entries(); library();
} catch (e) {
  E(`doctor crashed: ${e.message}`);
}
for (const m of errors) console.log(`ERROR ${m}`);
for (const m of warns) console.log(`warn  ${m}`);
for (const m of infos) console.log(`info  ${m}`);
console.log(`doctor: ${errors.length} error(s), ${warns.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
