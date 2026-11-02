#!/usr/bin/env node
// Secret + private-term scan. Prints file:line and the pattern NAME only, never the matched value.
//   node bin/secret-scan.mjs            staged files (what the pre-commit hook runs)
//   node bin/secret-scan.mjs --all      every tracked + untracked-not-ignored file in nikabrain
//   node bin/secret-scan.mjs <files…>   just these files (works in any repo, e.g. before a handover)
// Private terms (employer/client names that must never reach nikabrain) go one per line in
// .githooks/private-terms. That file is gitignored on purpose: a committed list would itself leak
// the names (gigabrain pattern pushed-repo-tooling-keeps-private-state-in-a-sibling).
// Reviewed false positives: .githooks/secret-allowlist, lines "<path> <sha256 of the line, first 16 hex>".
// Exit 0 clean, 1 findings or internal error (an error never reports "clean").
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { ROOT } from './lib.mjs';

const PATTERNS = {
  'aws-access-key': /(AKIA|ASIA)[A-Z0-9]{16}/,
  'private-key': /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  'github-token': /gh[pousr]_[A-Za-z0-9]{30,}/,
  'anthropic-key': /sk-ant-[A-Za-z0-9_-]{20,}/,
  'openai-key': /sk-(proj-)?[A-Za-z0-9]{32,}/,
  'stripe-key': /(sk|rk)_live_[A-Za-z0-9]{16,}/,
  'google-api-key': /AIza[0-9A-Za-z_-]{35}/,
  'slack-token': /xox[baprs]-[A-Za-z0-9-]{10,}/,
  'jwt': /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
  'assigned-secret': /(password|passwd|secret|api_?key|token|client_secret)\s*[:=]\s*["']?[A-Za-z0-9/+_-]{12,}/i,
};

const git = (args, cwd = ROOT) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

function filesToScan(argv) {
  const explicit = argv.filter((a) => !a.startsWith('--'));
  if (explicit.length) return { base: process.cwd(), files: explicit };
  let inRepo = true;
  try { git(['rev-parse', '--git-dir']); } catch { inRepo = false; }
  if (!inRepo) throw new Error('nikabrain is not a git repo; pass file paths explicitly');
  const list = argv.includes('--all')
    ? git(['ls-files', '-co', '--exclude-standard'])
    : git(['diff', '--cached', '--name-only', '--diff-filter=ACM']);
  return { base: ROOT, files: list.split(/\r?\n/).filter((f) => f && !f.startsWith('inbox/')) };
}

function readLines(file) {
  let buf;
  try { buf = fs.readFileSync(file); } catch { return null; }
  if (buf.subarray(0, 8192).includes(0)) return null; // binary
  return buf.toString('utf8').split('\n');
}

function loadList(name) {
  try {
    return fs.readFileSync(path.join(ROOT, '.githooks', name), 'utf8').split(/\r?\n/)
      .map((l) => l.split('#')[0].trim()).filter(Boolean);
  } catch { return []; }
}

export function scanLines(rel, lines, { allow = new Set(), terms = [] } = {}) {
  const hits = [];
  for (const [name, rx] of Object.entries(PATTERNS)) {
    const nums = [];
    lines.forEach((line, i) => {
      if (!rx.test(line)) return;
      const h = crypto.createHash('sha256').update(line.replace(/\r$/, '') + '\n').digest('hex').slice(0, 16);
      if (!allow.has(`${rel} ${h}`)) nums.push(i + 1);
    });
    if (nums.length) hits.push(`${rel} lines ${nums.join(',')}: ${name}`);
  }
  for (const t of terms) {
    const nums = [];
    lines.forEach((line, i) => { if (line.toLowerCase().includes(t.toLowerCase())) nums.push(i + 1); });
    if (nums.length) hits.push(`${rel} lines ${nums.join(',')}: private term`);
  }
  return hits;
}

function main() {
  const { base, files } = filesToScan(process.argv.slice(2));
  const allow = new Set(loadList('secret-allowlist'));
  const terms = loadList('private-terms');
  let hits = [];
  let n = 0;
  for (const f of files) {
    const rel = f.replace(/\\/g, '/');
    if (rel === '.githooks/private-terms') continue;
    const lines = readLines(path.resolve(base, f));
    if (!lines) continue;
    n++;
    hits = hits.concat(scanLines(rel, lines, { allow, terms }));
  }
  if (hits.length) {
    for (const h of hits) console.log(`  x ${h}`);
    console.log('secret-scan: possible secrets or private terms found (values not shown). Redact or generalise the wording.');
    return 1;
  }
  console.log(`secret-scan: clean (${n} files${terms.length ? `, ${terms.length} private terms` : ', no private-terms list'})`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { process.exit(main()); } catch (e) { console.log(`secret-scan: FAILED to run (${e.message}); treating as dirty`); process.exit(1); }
}
