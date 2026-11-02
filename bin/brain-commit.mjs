#!/usr/bin/env node
// Commit (and push, when safe) ONLY the files /retro wrote, never anything else Nika has
// uncommitted. Refuses paths outside brain/ me/ ai-craft/ memory/.
//   node bin/brain-commit.mjs "brain: <what was learned>" brain/habits/x.md me/scorecard.md ...
// Exit: 0 committed (push may still have been skipped: see output), 1 refused/scan failed, 2 nothing to commit.
import { execFileSync, spawnSync } from 'node:child_process';
import { ROOT } from './lib.mjs';

const ALLOWED = /^(brain|me|ai-craft|memory)\//;
const git = (...args) => execFileSync('git', ['-C', ROOT, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const tryGit = (...args) => { try { return git(...args); } catch { return null; } };

const [msg, ...files] = process.argv.slice(2);
if (!msg) { console.log('usage: brain-commit.mjs <message> <file>...'); process.exit(1); }
if (!files.length) { console.log('no files given'); process.exit(2); }
const rel = files.map((f) => f.replace(/\\/g, '/'));
for (const f of rel) {
  if (!ALLOWED.test(f) || f.includes('..')) { console.log(`refused: ${f} is outside brain/ me/ ai-craft/ memory/`); process.exit(1); }
}

// Anything already staged that isn't ours would ride along. Stop instead.
const staged = (tryGit('diff', '--cached', '--name-only') || '').split(/\r?\n/).filter(Boolean);
const others = staged.filter((f) => !rel.includes(f));
if (others.length) { console.log(`refused: other files already staged:\n${others.join('\n')}`); process.exit(1); }

try { git('add', '--', ...rel); } catch (e) { console.log(`git add failed: ${e.stderr || e.message}`); process.exit(1); }
if (spawnSync('git', ['-C', ROOT, 'diff', '--cached', '--quiet']).status === 0) { console.log('nothing to commit'); process.exit(2); }

// Nika's own unpushed commits must not ride along on our push (gigabrain 2026-10-15: a retro
// push published the user's local commit). Count them before committing.
const ahead = tryGit('rev-list', '--count', '@{u}..HEAD');
const c = spawnSync('git', ['-C', ROOT, 'commit', '-q', '-m', msg], { encoding: 'utf8' });
if (c.status !== 0) {
  console.log(`commit blocked (pre-commit secret scan?):\n${(c.stdout || '') + (c.stderr || '')}Fix the wording; never --no-verify.`);
  tryGit('reset', '-q', '--', ...rel);
  process.exit(1);
}
console.log(`committed ${git('rev-parse', '--short', 'HEAD')}: ${msg}`);
if (!tryGit('remote', 'get-url', 'origin')) console.log('not pushed: no remote (local-only brain)');
else if (ahead === null) console.log('not pushed: the branch has no upstream; push it yourself once (git push -u origin main)');
else if (Number(ahead) > 0) console.log(`not pushed: ${ahead} earlier commit(s) of yours are unpushed; review them, then git push`);
else {
  const p = spawnSync('git', ['-C', ROOT, 'push', '-q'], { encoding: 'utf8' });
  console.log(p.status === 0 ? 'pushed' : 'push failed (offline/auth?); the next retro will push it');
}
