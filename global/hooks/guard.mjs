#!/usr/bin/env node
// nikabrain guard: one hook process per event. A smaller Node port of gigabrain's guard.py
// (ideas from ECC's hook set, MIT): block --no-verify, ask before destructive commands,
// inject this repo's handoff note and the inbox notice at session start.
//
//   check        event         what it does
//   no-verify    PreToolUse    hard deny: git --no-verify / commit -n, -c core.hooksPath, HUSKY=0
//   destructive  PreToolUse    ask the human: rm -r outside build dirs, reset --hard, push --force,
//                              clean -f, Remove-Item -Recurse, taskkill node, npm publish, prod deploys, DROP…
//   handoff      SessionStart  inject <project memory>/handoff.md when its `repo:` line matches this repo
//   inbox        SessionStart  mention /curate once when 5+ candidates wait in nikabrain/inbox
//
// Disable checks: NIKABRAIN_DISABLED_HOOKS=destructive,handoff. Destructive → "ask": a human
// confirms; the model can't approve itself. Never prints its input back.
// Test: node bin/selftest.mjs (table of dangerous AND innocent lookalike commands).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { ROOT, CLAUDE_DIR, INBOX, stdinJSON } from '../../bin/lib.mjs';

const DISABLED = new Set((process.env.NIKABRAIN_DISABLED_HOOKS || '').split(',').map((s) => s.trim()).filter(Boolean));
const HANDOFF_MAX = 4000;
const HANDOFF_DAYS = 14;

// Folders that are always safe to delete: build output and caches, never source.
const SAFE_DIRS = new Set(['node_modules', 'dist', 'build', '.next', 'out', 'coverage', '.vite', '.cache', '.turbo',
  '.parcel-cache', 'storybook-static', '.vercel', '.netlify', '.svelte-kit', '.nuxt', '.expo', 'tmp', '.tmp',
  'playwright-report', 'test-results', '.eslintcache', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']);

// ---- tokenising: quote-aware split into segments on && || ; | & and newlines ----
export function segments(cmd) {
  const segs = [];
  let cur = [];
  let tok = '';
  let has = false;
  let q = null;
  const push = () => { if (has) cur.push(tok); tok = ''; has = false; };
  const end = () => { push(); if (cur.length) segs.push(cur); cur = []; };
  for (let i = 0; i < cmd.length; i++) {
    const c = cmd[i];
    if (q) {
      if (c === q) q = null;
      else if (c === '\\' && q === '"' && i + 1 < cmd.length) { tok += cmd[++i]; }
      else tok += c;
      continue;
    }
    if (c === '"' || c === "'") { q = c; has = true; continue; }
    if (c === '\\' && i + 1 < cmd.length && cmd[i + 1] !== '\n') { tok += cmd[++i]; has = true; continue; }
    if (c === ' ' || c === '\t') { push(); continue; }
    if (c === '\n' || c === ';' || c === '&' || c === '|') {
      end();
      if ((c === '&' || c === '|') && cmd[i + 1] === c) i++;
      continue;
    }
    if (c === '(' || c === ')' || c === '{' || c === '}') { if (!has) { end(); continue; } }
    tok += c; has = true;
  }
  end();
  return segs;
}

const WRAPPERS = new Set(['sudo', 'env', 'nohup', 'time', 'command', 'exec', 'npx', 'call', 'cmd', '&']);
const SHELLS = new Set(['bash', 'sh', 'zsh', 'powershell', 'pwsh', 'powershell.exe', 'pwsh.exe', 'cmd.exe']);

/** Strip env assignments and wrappers; return { envs, toks }. Nested shells are re-analysed by the caller. */
function strip(toks) {
  const envs = {};
  let i = 0;
  while (i < toks.length) {
    const t = toks[i];
    const m = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(t);
    if (m) { envs[m[1].toUpperCase()] = m[2]; i++; continue; }
    if (/^\$env:([A-Za-z_]\w*)$/i.test(t) && toks[i + 1] === '=') { envs[t.slice(5).toUpperCase()] = toks[i + 2] || ''; i += 3; continue; }
    if (WRAPPERS.has(t.toLowerCase())) { i++; while (toks[i] && toks[i].startsWith('-')) i++; continue; }
    break;
  }
  return { envs, toks: toks.slice(i) };
}

function nestedScript(toks) {
  const tool = (toks[0] || '').toLowerCase();
  if (!SHELLS.has(tool)) return null;
  const flag = toks.findIndex((t, k) => k > 0 && /^(-c|-lc|-command|\/c|\/k)$/i.test(t));
  return flag > 0 && toks[flag + 1] ? toks.slice(flag + 1).join(' ') : null;
}

/** Skip git's global options (-C dir, -c k=v, --git-dir=…) to find the subcommand. */
function gitSub(toks) {
  let i = 1;
  const opts = [];
  while (i < toks.length && toks[i].startsWith('-')) {
    opts.push(toks[i]);
    if (['-C', '-c', '--git-dir', '--work-tree', '--namespace'].includes(toks[i])) { opts.push(toks[i + 1] || ''); i += 2; } else i++;
  }
  return { opts, sub: toks[i] || '', args: toks.slice(i + 1) };
}

const isSafeTarget = (t) => {
  const clean = t.replace(/[\\/]+$/, '');
  const base = clean.split(/[\\/]/).pop();
  if (SAFE_DIRS.has(base)) return true;
  if (/^(\/tmp\/|\/var\/folders\/|[A-Za-z]:[\\/].*[\\/](temp|tmp)[\\/])/i.test(t)) return true;
  if (/[\\/]AppData[\\/]Local[\\/]Temp[\\/]/i.test(t) || /\/AppData\/Local\/Temp\//i.test(t)) return true;
  return false;
};

/** Returns { decision: 'deny'|'ask', reason } or null for one command (string). */
export function analyse(cmd, depth = 0) {
  if (!cmd || depth > 3) return null;
  let ask = null;
  for (const seg of segments(cmd.slice(0, 64000))) {
    const { envs, toks } = strip(seg);
    if (!toks.length) continue;
    const nested = nestedScript(toks);
    if (nested) {
      const r = analyse(nested, depth + 1);
      if (r && r.decision === 'deny') return r;
      if (r) ask = ask || r;
      continue;
    }
    const tool = toks[0].replace(/\.exe$/i, '').toLowerCase();
    const args = toks.slice(1);
    const lower = args.map((a) => a.toLowerCase());

    // ---- no-verify (hard deny) ----
    if (!DISABLED.has('no-verify')) {
      if (envs.HUSKY === '0' || envs.HUSKY_SKIP_HOOKS) return deny('skipping git hooks (HUSKY=0)');
      if (tool === 'git') {
        const { opts, sub, args: ga } = gitSub(toks);
        if (opts.some((o) => /^core\.hookspath=/i.test(o))) return deny('overriding core.hooksPath');
        if (['commit', 'push', 'merge', 'rebase', 'am', 'cherry-pick'].includes(sub)) {
          if (ga.includes('--no-verify')) return deny(`git ${sub} --no-verify`);
          if (sub === 'commit' && ga.some((a) => /^-[a-zA-Z]*n[a-zA-Z]*$/.test(a) && !a.startsWith('--'))) return deny('git commit -n (= --no-verify)');
        }
      }
    }

    if (DISABLED.has('destructive')) continue;
    const r = destructive(tool, args, lower);
    if (r) ask = ask || r;
  }
  return ask;
}

function deny(what) {
  return { decision: 'deny', reason: `nikabrain guard: ${what} bypasses the repo's hooks. Fix what the hook reports instead.` };
}
function askFor(what) {
  return { decision: 'ask', reason: `nikabrain guard: ${what}. Confirm only if you meant it.` };
}

function destructive(tool, args, lower) {
  const hasFlag = (re) => lower.some((a) => re.test(a));
  if (tool === 'rm') {
    const recursive = args.some((a) => /^-[a-zA-Z]*[rR]/.test(a) || a === '--recursive');
    const targets = args.filter((a) => !a.startsWith('-'));
    if (recursive && targets.some((t) => !isSafeTarget(t))) return askFor(`recursive delete of ${targets.filter((t) => !isSafeTarget(t)).join(' ')}`);
    if (targets.some((t) => t === '/' || t === '~' || t === '*' || t === '.')) return askFor('delete of a root/home/wildcard path');
  }
  if (['remove-item', 'ri', 'rmdir', 'rd', 'del', 'erase'].includes(tool)) {
    const recursive = hasFlag(/^[-/](r|recurse|s)$/i);
    const targets = args.filter((a) => !/^[-/]/.test(a));
    if (recursive && targets.some((t) => !isSafeTarget(t))) return askFor(`recursive delete of ${targets.filter((t) => !isSafeTarget(t)).join(' ')}`);
  }
  if (tool === 'git') {
    const { sub, args: ga } = gitSub([tool, ...args]);
    const gl = ga.map((a) => a.toLowerCase());
    if (sub === 'reset' && gl.includes('--hard')) return askFor('git reset --hard throws away uncommitted work');
    if (sub === 'clean' && gl.some((a) => /^-[a-z]*f/.test(a))) return askFor('git clean -f deletes untracked files');
    if (sub === 'push' && gl.some((a) => a === '--force' || a === '-f' || a.startsWith('--force-with-lease') || /^\+/.test(a))) return askFor('force push rewrites the remote branch');
    if ((sub === 'checkout' || sub === 'restore') && ga.includes('.')) return askFor(`git ${sub} . discards all local changes`);
    if (sub === 'branch' && (ga.includes('-D') || (gl.includes('--delete') && gl.includes('--force')))) return askFor('force-deleting a branch');
    if (sub === 'stash' && ['drop', 'clear'].includes(gl[0])) return askFor(`git stash ${gl[0]}`);
  }
  if (tool === 'taskkill' && (hasFlag(/^\/im$/) && lower.some((a) => /^node(\.exe)?$/.test(a)))) return askFor('taskkill /IM node.exe also kills Claude Code and every dev server; kill by PID/port');
  if (tool === 'stop-process' && lower.some((a) => /^node$/.test(a)) && hasFlag(/^-name$/)) return askFor('Stop-Process -Name node kills every node process; kill by PID/port');
  if (['pkill', 'killall'].includes(tool) && lower.some((a) => /node/.test(a))) return askFor(`${tool} node matches more than your server; kill by PID/port`);
  if (['npm', 'pnpm', 'yarn'].includes(tool) && ['publish', 'unpublish', 'deprecate'].includes(lower[0])) return askFor(`${tool} ${lower[0]} is outward-facing`);
  if (tool === 'vercel' && hasFlag(/^--prod$/)) return askFor('production deploy');
  if (tool === 'netlify' && lower[0] === 'deploy' && hasFlag(/^--prod$/)) return askFor('production deploy');
  if (tool === 'firebase' && lower[0] === 'deploy') return askFor('firebase deploy');
  if (tool === 'gh' && (lower[0] === 'repo' && lower[1] === 'delete' || lower[0] === 'release' && lower[1] === 'delete')) return askFor(`gh ${lower[0]} delete`);
  const sqlish = ['psql', 'mysql', 'sqlite3', 'mongosh', 'supabase', 'prisma'];
  if (sqlish.includes(tool)) {
    const text = args.join(' ');
    if (/\b(drop\s+(table|database|schema)|truncate\s+)/i.test(text)) return askFor('DROP/TRUNCATE');
    if (/\bdelete\s+from\s+[\w."`]+\s*(;|$)/i.test(text)) return askFor('DELETE without WHERE');
    if (tool === 'prisma' && lower.includes('reset')) return askFor('prisma migrate reset wipes the database');
  }
  return null;
}

function out(obj) { process.stdout.write(JSON.stringify(obj) + '\n'); }

// ---- SessionStart: handoff + inbox ----
function gitCommonDir(cwd) {
  try {
    return execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], { cwd, encoding: 'utf8', timeout: 3000, stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch { return null; }
}

/** Claude Code's per-project folder name: every non-alphanumeric character becomes '-'. */
export const projectSlug = (dir) => path.resolve(dir).replace(/[^A-Za-z0-9]/g, '-');

export function memoryDirs(cwd) {
  const dirs = [];
  const local = path.join(cwd, '.claude', 'settings.local.json');
  try {
    const s = JSON.parse(fs.readFileSync(local, 'utf8'));
    if (s.autoMemoryDirectory) dirs.push(s.autoMemoryDirectory.replace(/^~(?=[\\/])/, process.env.USERPROFILE || process.env.HOME || ''));
  } catch { /* none */ }
  dirs.push(path.join(CLAUDE_DIR, 'projects', projectSlug(cwd), 'memory'));
  return dirs;
}

const norm = (p) => path.resolve(p).replace(/\\/g, '/').toLowerCase();

function handoff(cwd) {
  const repo = gitCommonDir(cwd);
  if (!repo) return '';
  for (const d of memoryDirs(cwd)) {
    const f = path.join(d, 'handoff.md');
    let st;
    try { st = fs.statSync(f); } catch { continue; }
    const text = fs.readFileSync(f, 'utf8');
    const first = (text.split(/\r?\n/)[0] || '').replace(/^repo:\s*/, '').trim();
    if (!first || norm(first) !== norm(repo)) continue;
    const ageDays = (Date.now() - st.mtimeMs) / 86400000;
    const head = ageDays > HANDOFF_DAYS
      ? `nikabrain: a handoff note for this repo exists but is ${Math.round(ageDays)} days old (${f}). Mention it once; it may be stale.`
      : `nikabrain handoff from the last session in this repo (${f}). Use it: don't retry what it lists under "Failed".`;
    return `${head}\n${text.slice(0, HANDOFF_MAX)}`;
  }
  return '';
}

function inboxNotice() {
  try {
    const n = fs.readdirSync(INBOX).filter((f) => f.endsWith('.md')).length;
    if (n >= 5) return `nikabrain: ${n} candidate lessons are waiting in ${INBOX}. Mention once, briefly, that /curate would promote or discard them. Don't run it unasked.`;
  } catch { /* no inbox */ }
  return '';
}

async function main() {
  const inp = await stdinJSON();
  const ev = inp.hook_event_name;
  if (ev === 'PreToolUse') {
    const tool = inp.tool_name;
    if (tool !== 'Bash' && tool !== 'PowerShell') return;
    const r = analyse(String((inp.tool_input || {}).command || ''));
    if (r) out({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: r.decision, permissionDecisionReason: r.reason } });
  } else if (ev === 'SessionStart') {
    const parts = [];
    if (!DISABLED.has('handoff') && inp.cwd) parts.push(handoff(inp.cwd));
    if (!DISABLED.has('inbox') && path.resolve(inp.cwd || '.') !== ROOT) parts.push(inboxNotice());
    const text = parts.filter(Boolean).join('\n\n');
    if (text) process.stdout.write(text + '\n');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => { /* never block a tool call because the guard itself broke */ });
}
