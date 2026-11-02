#!/usr/bin/env node
// Self-test for nikabrain's hooks and tooling. Temp dirs only; never touches ~/.claude.
//   node bin/selftest.mjs
// Run it after changing anything in global/hooks or bin/. A fixed bug gets a case with a dated comment.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, frontmatter } from './lib.mjs';
import { analyse, projectSlug } from '../global/hooks/guard.mjs';
import { cues, compact, isMachine } from '../global/hooks/coach.mjs';
import { scanLines } from './secret-scan.mjs';
import { checkHtml, checkExam, validResult, variants, EXAMS } from './learn.mjs';

const node = (file, args = [], input = '', env = {}) =>
  spawnSync(process.execPath, [path.join(ROOT, file), ...args], { input, encoding: 'utf8', env: { ...process.env, ...env } });

// ---------- guard: dangerous commands ----------
const DANGEROUS = [
  ['git commit --no-verify -m "x"', 'deny'],
  ['git commit -nm "wip"', 'deny'],
  ['git -c core.hooksPath=/dev/null commit -m x', 'deny'],
  ['HUSKY=0 git commit -m x', 'deny'],
  ['git push --no-verify', 'deny'],
  ['bash -c "git commit --no-verify -m x"', 'deny'],
  ['rm -rf src', 'ask'],
  ['rm -rf ./src/components', 'ask'],
  ['rm -r ~', 'ask'],
  ['cd app && rm -rf .', 'ask'],
  ['git reset --hard HEAD~1', 'ask'],
  ['git -C ../other reset --hard', 'ask'],
  ['git clean -fd', 'ask'],
  ['git push --force origin main', 'ask'],
  ['git push -f', 'ask'],
  ['git push origin +main', 'ask'],
  ['git checkout -- .', 'ask'],
  ['git restore .', 'ask'],
  ['git branch -D feature/x', 'ask'],
  ['git stash clear', 'ask'],
  ['Remove-Item -Recurse -Force src', 'ask'],
  ['Remove-Item src -Recurse', 'ask'],
  ['taskkill /F /IM node.exe', 'ask'],
  ['Stop-Process -Name node -Force', 'ask'],
  ['npm publish', 'ask'],
  ['npx vercel --prod', 'ask'],
  ['netlify deploy --prod', 'ask'],
  ['firebase deploy', 'ask'],
  ['psql -c "DROP TABLE users"', 'ask'],
  ['npx prisma migrate reset', 'ask'],
  ['powershell -Command "Remove-Item -Recurse C:/work/app"', 'ask'],
];
// ---------- guard: innocent lookalikes (gigabrain pattern test-guards-against-innocent-lookalikes) ----------
const INNOCENT = [
  'git commit -m "docs: explain why we never use --no-verify"',
  'git commit -m "rm -rf the old build step"',
  'echo "git reset --hard is dangerous"',
  'grep -rn "rm -rf" scripts/',
  'rm -rf node_modules dist',
  'rm -rf .next coverage',
  'rm -rf "C:/Users/qartv/AppData/Local/Temp/claude/x"',
  'Remove-Item -Recurse -Force node_modules',
  'rm file.txt',
  'git reset HEAD file.js',
  'git push origin main',
  'git push -u origin feature/login',
  'git checkout -b feature/x',
  'git checkout main',
  'git branch -d merged-branch',
  'git stash pop',
  'npm run build',
  'npm install react-router',
  'npx vercel',
  'Stop-Process -Id 1234',
  'taskkill /PID 1234 /F',
  'node bin/selftest.mjs',
  'psql -c "SELECT * FROM users WHERE id = 1"',
];

test('guard flags dangerous commands', () => {
  for (const [cmd, want] of DANGEROUS) {
    const r = analyse(cmd);
    assert.ok(r, `expected ${want} for: ${cmd}`);
    assert.equal(r.decision, want, `wrong decision for: ${cmd} (${r.reason})`);
  }
});

test('guard leaves innocent lookalikes alone', () => {
  for (const cmd of INNOCENT) assert.equal(analyse(cmd), null, `false positive: ${cmd} → ${JSON.stringify(analyse(cmd))}`);
});

test('guard hook end to end: PreToolUse JSON in, decision JSON out', () => {
  const ask = node('global/hooks/guard.mjs', [], JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command: 'git reset --hard' } }));
  assert.equal(ask.status, 0);
  assert.equal(JSON.parse(ask.stdout).hookSpecificOutput.permissionDecision, 'ask');
  const ps = node('global/hooks/guard.mjs', [], JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'PowerShell', tool_input: { command: 'git commit --no-verify -m x' } }));
  assert.equal(JSON.parse(ps.stdout).hookSpecificOutput.permissionDecision, 'deny');
  const ok = node('global/hooks/guard.mjs', [], JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command: 'npm test' } }));
  assert.equal(ok.stdout.trim(), '');
  const junk = node('global/hooks/guard.mjs', [], 'not json');
  assert.equal(junk.status, 0, 'a broken payload must never block');
});

test('guard SessionStart injects a matching handoff, ignores another repo\'s', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nb-handoff-'));
  const repo = path.join(tmp, 'app');
  fs.mkdirSync(repo);
  spawnSync('git', ['init', '-q', repo]);
  const common = spawnSync('git', ['-C', repo, 'rev-parse', '--path-format=absolute', '--git-common-dir'], { encoding: 'utf8' }).stdout.trim();
  const claude = path.join(tmp, 'claude');
  const mem = path.join(claude, 'projects', projectSlug(repo), 'memory');
  fs.mkdirSync(mem, { recursive: true });
  fs.writeFileSync(path.join(mem, 'handoff.md'), `repo: ${common}\nupdated: 2026-11-01\n## Next step\n- finish the navbar\n`);
  const hit = node('global/hooks/guard.mjs', [], JSON.stringify({ hook_event_name: 'SessionStart', cwd: repo }), { NIKABRAIN_CLAUDE_DIR: claude });
  assert.match(hit.stdout, /finish the navbar/);
  fs.writeFileSync(path.join(mem, 'handoff.md'), 'repo: C:/somewhere/else/.git\n## Next step\n- other repo\n');
  const miss = node('global/hooks/guard.mjs', [], JSON.stringify({ hook_event_name: 'SessionStart', cwd: repo }), { NIKABRAIN_CLAUDE_DIR: claude });
  assert.doesNotMatch(miss.stdout, /other repo/);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('projectSlug matches Claude Code folder names', () => {
  if (process.platform === 'win32') assert.equal(projectSlug('C:\\Users\\qartv\\projects'), 'C--Users-qartv-projects');
});

// ---------- coach ----------
test('coach cues', () => {
  assert.ok(cues('add a dark mode toggle to the navbar').flags.no_done);
  assert.ok(cues('add a dark mode toggle to the navbar').flags.ui_no_visual);
  assert.ok(!cues('add a dark mode toggle to the navbar, done when the screenshot at 390px shows it').flags.no_done);
  assert.ok(!cues('add a dark mode toggle, show me screenshots at mobile and desktop').flags.ui_no_visual);
  assert.ok(cues('the modal is broken, help me fix this').flags.debug_no_hypothesis);
  assert.ok(!cues('expected the modal to close on Escape, it reopens since yesterday; I suspect the effect').flags.debug_no_hypothesis);
  assert.ok(cues('which library is best for forms, react-hook-form vs formik?').flags.research);
  assert.ok(cues('is it done?').flags.asks_status);
  assert.ok(cues("that's it for today").flags.wrapup);
  assert.ok(!cues('what does useEffect cleanup do?').flags.build, 'a question is not a build');
  assert.ok(cues('build the page:\n- header\n- hero\n- pricing\n- footer').flags.multi_task);
});

test('coach ignores machine messages and keeps only steering lines of the focus', () => {
  assert.ok(isMachine('<task-notification>agent done</task-notification>'));
  assert.ok(!isMachine('add a button'));
  const c = compact('- **Done-criteria** (seeded). evidence\n  - 2026-11-01: long evidence line\n  - Ask for: "Done when …"\n  - Claude: propose one\n');
  assert.match(c, /Done-criteria/);
  assert.match(c, /Ask for/);
  assert.doesNotMatch(c, /long evidence line/);
});

test('coach hook end to end prints cues and the focus, writes no signals in test mode', () => {
  const r = node('global/hooks/coach.mjs', [], JSON.stringify({ prompt: 'restyle the pricing cards', cwd: ROOT, session_id: 'selftest' }), { NIKABRAIN_NO_SIGNALS: '1', NIKABRAIN_FORCE_FOCUS: '1' });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /\[nikabrain coach\]/);
  assert.match(r.stdout, /Visible UI change/);
  assert.match(r.stdout, /current coaching focus/);
  assert.equal(node('global/hooks/coach.mjs', [], JSON.stringify({ prompt: '/retro' }), { NIKABRAIN_NO_SIGNALS: '1' }).stdout, '');
});

// ---------- secret scan ----------
test('secret scan finds secrets by name and never prints the value', () => {
  const fakeKey = 'AKIA' + 'Q'.repeat(16); // built at runtime so this file itself stays clean
  const hits = scanLines('x.md', ['ok line', `aws = ${fakeKey}`]);
  assert.equal(hits.length, 1);
  assert.match(hits[0], /x\.md lines 2: aws-access-key/);
  assert.ok(!hits[0].includes(fakeKey));
  assert.deepEqual(scanLines('x.md', ['VITE_API_URL=https://api.example.com', 'const token = useToken()']), []);
  assert.equal(scanLines('x.md', ['we used AcmeCorp here'], { terms: ['acmecorp'] }).length, 1);
});

// ---------- learn checker ----------
test('lesson checker passes the kit example and fails a gutted copy', () => {
  const kit = path.join(ROOT, 'global', 'skills', 'teach', 'kit');
  const ex = fs.readFileSync(path.join(kit, 'example.html'), 'utf8')
    .replace('<!-- teach-kit:css -->', '<style data-teach-kit></style>').replace('<!-- teach-kit:js -->', '<script data-teach-kit></script>');
  assert.deepEqual(checkHtml(ex), []);
  const gutted = ex.replace(/<div[^>]*data-quiz[\s\S]*?data-feedback/, '<div>').replace(/data-stepper/g, 'x');
  const fails = checkHtml(gutted);
  assert.ok(fails.some((f) => /steppers/.test(f)), fails.join('; '));
  assert.ok(checkHtml(ex.replace('</head>', '<script src="https://cdn.example.com/x.js"></script></head>')).some((f) => /network/.test(f)));
});

// ---------- exam checker (2026-11-02: exams ported from gigabrain) ----------
test('every shipped exam passes the checker; a broken copy fails it', () => {
  const topics = fs.readdirSync(EXAMS).filter((t) => variants(t).length);
  assert.ok(topics.length >= 1, 'at least one exam ships');
  for (const t of topics) for (const n of variants(t)) {
    const ex = JSON.parse(fs.readFileSync(path.join(EXAMS, t, `v${n}.json`), 'utf8'));
    assert.deepEqual(checkExam(ex), [], `${t} v${n}`);
  }
  const ex = JSON.parse(fs.readFileSync(path.join(EXAMS, topics[0], 'v1.json'), 'utf8'));
  const broken = structuredClone(ex);
  broken.questions[0].options.forEach((o) => { o.correct = false; });
  broken.questions[1].options[0].why = 'short';
  broken.questions[2].options[1].text = 'All of the above';
  const fails = checkExam(broken);
  assert.ok(fails.some((x) => /exactly 1 correct/.test(x)), fails.join(' | '));
  assert.ok(fails.some((x) => /needs a why/.test(x)));
  assert.ok(fails.some((x) => /banned option wording/.test(x)));
  assert.ok(checkExam(ex, [{ id: 'other-q', stem: ex.questions[3].stem }]).some((x) => /repeats other-q/.test(x)), 'cross-variant repeat caught');
});

test('exam results: only well-formed results for a real topic/variant reach the log', () => {
  const t = fs.readdirSync(EXAMS).find((x) => variants(x).length);
  const ok = { topic: t, variant: variants(t)[0], mode: 'exam', score: 0.8, correct: 12, total: 15, misses: [] };
  assert.ok(validResult(ok));
  assert.ok(!validResult({ ...ok, topic: '../me' }), 'path-like topic rejected');
  assert.ok(!validResult({ ...ok, variant: 99 }), 'unknown variant rejected');
  assert.ok(!validResult({ ...ok, score: 7 }), 'score outside 0..1 rejected');
  assert.ok(!validResult({ ...ok, mode: 'cheat' }));
});

// ---------- brain-commit ----------
test('brain-commit refuses paths outside brain/ me/ ai-craft/ memory/', () => {
  const r = node('bin/brain-commit.mjs', ['brain: x', 'bin/install.mjs']);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /refused/);
  assert.equal(node('bin/brain-commit.mjs', ['brain: x', 'brain/../bin/x']).status, 1);
});

// ---------- install → doctor → uninstall, in a temp ~/.claude ----------
test('install --apply into a temp claude dir passes doctor; uninstall removes it again', () => {
  const claude = fs.mkdtempSync(path.join(os.tmpdir(), 'nb-claude-'));
  fs.writeFileSync(path.join(claude, 'settings.json'), JSON.stringify({ theme: 'dark', hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo mine' }] }] } }));
  fs.writeFileSync(path.join(claude, 'CLAUDE.md'), 'my old global notes\n');
  const env = { NIKABRAIN_CLAUDE_DIR: claude };
  const dry = node('bin/install.mjs', [], '', env);
  assert.equal(dry.status, 0, dry.stdout + dry.stderr);
  assert.equal(fs.readFileSync(path.join(claude, 'CLAUDE.md'), 'utf8'), 'my old global notes\n', 'dry run must change nothing');
  const inst = node('bin/install.mjs', ['--apply'], '', env);
  assert.equal(inst.status, 0, inst.stdout + inst.stderr);
  const again = node('bin/install.mjs', ['--apply'], '', env);
  assert.equal(again.status, 0);
  const s = JSON.parse(fs.readFileSync(path.join(claude, 'settings.json'), 'utf8'));
  assert.equal(s.theme, 'dark', 'existing settings are kept');
  assert.equal(s.hooks.Stop[0].hooks[0].command, 'echo mine', 'existing hooks are kept');
  assert.equal(s.hooks.UserPromptSubmit.length, 1, 're-running install must not duplicate hooks');
  assert.ok(fs.readdirSync(path.join(claude, 'backups')).some((f) => f.startsWith('CLAUDE.md.pre-nikabrain')), 'old CLAUDE.md backed up');
  const doc = node('bin/doctor.mjs', [], '', env);
  assert.equal(doc.status, 0, doc.stdout);
  const fm = frontmatter(fs.readFileSync(path.join(claude, 'skills', 'ui-ux-pro-max', 'SKILL.md'), 'utf8'));
  assert.equal(fm.name, 'ui-ux-pro-max', 'skill readable through the junction');
  const un = node('bin/install.mjs', ['--uninstall', '--apply'], '', env);
  assert.equal(un.status, 0, un.stdout + un.stderr);
  const s2 = JSON.parse(fs.readFileSync(path.join(claude, 'settings.json'), 'utf8'));
  assert.ok(!JSON.stringify(s2.hooks || {}).includes('nikabrain'), 'nikabrain hooks removed');
  assert.equal(s2.hooks.Stop[0].hooks[0].command, 'echo mine');
  assert.ok(!fs.existsSync(path.join(claude, 'skills', 'ui-ux-pro-max')), 'skill links removed');
  assert.ok(fs.existsSync(path.join(ROOT, 'library', 'skills', 'ui-ux-pro-max', 'SKILL.md')), 'uninstall must never touch the repo');
  fs.rmSync(claude, { recursive: true, force: true });
});
