#!/usr/bin/env node
// Upstream tracking for library/ (skill `absorb` drives this; read library/README.md first).
//   node bin/absorb.mjs status                    pinned commit vs upstream HEAD, per source (git ls-remote, no clone)
//   node bin/absorb.mjs diff <source>             files changed upstream since the pin, in the absorbed paths
//   node bin/absorb.mjs pull <source> [skill…] [--sha <sha>] [--force]
//                                                 copy the upstream folders at HEAD (or --sha), re-apply the
//                                                 sources.json replace rules, re-pin. 'frozen'/'vendored' sources
//                                                 refuse without --force (their adaptations were done by hand).
// Clones live in ~/.cache/nikabrain/upstream/<source>. They are untrusted data: this script only
// copies files, it never runs anything from them.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, CACHE, readJSON, writeJSON, today } from './lib.mjs';

const SOURCES = path.join(ROOT, 'library', 'sources.json');
const LIB = path.join(ROOT, 'library', 'skills');
const UP = path.join(CACHE, 'upstream');
const git = (args, opts = {}) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 300000, ...opts }).trim();

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const opt = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
const positional = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--sha');
const [cmd, name, ...only] = positional;
const data = readJSON(SOURCES);
const src = (n) => {
  const s = data.sources[n];
  if (!s) { console.log(`unknown source "${n}". Known: ${Object.keys(data.sources).join(', ')}`); process.exit(2); }
  return s;
};

function clone(n, s) {
  const dir = path.join(UP, n);
  if (!fs.existsSync(path.join(dir, '.git'))) {
    fs.mkdirSync(UP, { recursive: true });
    console.log(`cloning ${s.repo} → ${dir}`);
    git(['-c', 'core.autocrlf=false', 'clone', '--quiet', '--filter=blob:none', '--config', 'core.autocrlf=false', '--branch', s.branch, s.repo, dir]);
  } else {
    git(['-C', dir, 'fetch', '--quiet', 'origin', s.branch]);
  }
  return dir;
}

function status() {
  for (const [n, s] of Object.entries(data.sources)) {
    let head = '?';
    try { head = git(['ls-remote', s.repo, `refs/heads/${s.branch}`]).split(/\s+/)[0]; } catch { head = 'unreachable'; }
    const state = head === s.pinned_sha ? 'up to date' : head.length === 40 ? `upstream moved (${head.slice(0, 8)})` : head;
    console.log(`${n.padEnd(34)} pin ${s.pinned_sha.slice(0, 8)}  ${s.mode.padEnd(8)}  ${state}`);
  }
}

function diff(n) {
  const s = src(n);
  const dir = clone(n, s);
  const paths = Object.values(s.skills);
  const out = git(['-C', dir, 'diff', '--stat', `${s.pinned_sha}..origin/${s.branch}`, '--', ...paths]);
  console.log(out || `no upstream changes in ${paths.join(', ')} since ${s.pinned_sha.slice(0, 8)}`);
  if (out) console.log(`\nread a file's diff: git -C "${dir}" diff ${s.pinned_sha.slice(0, 8)}..origin/${s.branch} -- <path>`);
}

const globToRe = (g) => new RegExp(`^${g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`);

function pull(n) {
  const s = src(n);
  if (s.mode !== 'pull' && !flag('--force')) {
    console.log(`refused: ${n} is '${s.mode}' (${s.mode === 'frozen' ? 'adapted by gigabrain' : 'transformed by hand'}). Review with \`diff\`, or pass --force to overwrite with raw upstream.`);
    process.exit(1);
  }
  const dir = clone(n, s);
  const sha = opt('--sha') || git(['-C', dir, 'rev-parse', `origin/${s.branch}`]);
  git(['-C', dir, 'checkout', '--quiet', '--detach', sha]);
  const exclude = (s.exclude || []).map(globToRe);
  const skills = only.length ? only : Object.keys(s.skills);
  for (const sk of skills) {
    const from = path.join(dir, s.skills[sk]);
    if (!fs.existsSync(from)) { console.log(`  x ${sk}: ${s.skills[sk]} not found upstream at ${sha.slice(0, 8)}`); process.exitCode = 1; continue; }
    const to = path.join(LIB, sk);
    fs.rmSync(to, { recursive: true, force: true });
    fs.cpSync(from, to, { recursive: true, filter: (p) => !exclude.some((re) => re.test(path.basename(p))) && path.basename(p) !== '.git' });
    let applied = 0;
    const rules = ((s.edits || {})[sk] || {}).replace || [];
    for (const f of walkMd(to)) {
      let t = fs.readFileSync(f, 'utf8');
      const before = t;
      for (const [a, b] of rules) t = t.split(a).join(b);
      if (t !== before) { fs.writeFileSync(f, t); applied++; }
    }
    const missed = rules.filter(([a, b]) => !walkMd(to).some((f) => fs.readFileSync(f, 'utf8').includes(b)));
    console.log(`  ok ${sk} ← ${s.skills[sk]} @ ${sha.slice(0, 8)} (${rules.length} rules, ${applied} files changed)`);
    for (const [a] of missed) console.log(`  WARN ${sk}: replace rule no longer matches upstream: ${JSON.stringify(a).slice(0, 80)}`);
  }
  s.pinned_sha = sha;
  s.absorbed = today();
  writeJSON(SOURCES, data);
  console.log(`re-pinned ${n} → ${sha.slice(0, 8)}. Next: node bin/doctor.mjs, add ledger rows for new skills, restart Claude Code.`);
}

function walkMd(d) {
  const out = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) out.push(...walkMd(p));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

try {
  if (cmd === 'status') status();
  else if (cmd === 'diff' && name) diff(name);
  else if (cmd === 'pull' && name) pull(name);
  else { console.log('usage: absorb.mjs status | diff <source> | pull <source> [skill…] [--sha <sha>] [--force]'); process.exit(2); }
} catch (e) {
  console.log(`absorb: FAILED (${(e.stderr || e.message || '').toString().trim()})`);
  process.exit(1);
}
