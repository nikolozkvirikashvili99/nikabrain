#!/usr/bin/env node
// UserPromptSubmit hook: cheap, deterministic coaching cues for every prompt.
// Port of gigabrain's coach.py. No model call, no network: regex heuristics only.
// Its stdout is added to Claude's context for this turn; Claude decides whether a
// cue is real and, if so, ends the reply with one 💡 line.
//
// It also appends anonymous signal flags (never prompt text) to inbox/signals.jsonl.
// /retro and /curate turn those into scorecard trends and update brain/coaching.md,
// which this hook injects (once per session) as the current focus, together with the
// roadmap's `Now:` line. So the coaching changes as Nika does.
//
// Test: echo '{"prompt":"add a navbar","cwd":"C:/x","session_id":"t"}' | NIKABRAIN_NO_SIGNALS=1 node coach.mjs
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, INBOX, stdinJSON, nowISO } from '../../bin/lib.mjs';

const FOCUS = path.join(ROOT, 'brain', 'coaching.md');
const ROADMAP = path.join(ROOT, 'me', 'roadmap.md');
const SIGNALS = path.join(INBOX, 'signals.jsonl');
const SEEN = path.join(INBOX, '.coach-sessions');

// 2026-11-01 (selftest): "restyle the pricing cards" was not a build, so the UI cue never fired.
const BUILD = /\b(add|create|implement|build|make|fix|update|refactor|change|extend|remove|migrate|write|(re)?style|(re)?design|polish|tweak|improve|convert)\b/i;
const DONE = /done when|should (return|respond|show|fail|pass|look)|expect|verify|prove|test|criteria|so that|must (return|fail|pass|show)|screenshot/i;
const BROKEN = /dis+ap+e+a?r|not (being )?reflected|isn'?t (showing|working|updating|rendering)|does ?n[o']?t (show|load|work|appear|save|update|render)|not (showing|loading|saving|rendering)|stopped working|not working|doesn'?t work|broken|fails?|failing|error|exception|stack ?trace|help me fix|still not|why is this|blank (page|screen)|white screen|renders? twice|infinite (loop|re-?render)/i;
const EXPECTED = /expected|should (be|have|return)|instead of|used to|since (yesterday|the|i)|i suspect|hypothes|yesterday|it was (all )?fine|worked (before|until)/i;
const RESEARCH = /best (way|practice|approach)|which (library|lib|tool|framework|version)|\bvs\.?\s|\bversus\b|latest (version|release)|up to date|still maintained|production ready|alternatives? (to|for)/i;
const STATUS = /^(so )?(is )?(it|everything|all)( good| set| done| working| works| fine)?( to go| now| up)?\s*\?$|works now\?|all good( to go)?\?|everything (is )?set( up)?\?|that'?s it\?|is it done\?/i;
const SHORT_COMMAND = /\b(fix|do|run|adjust|implement|change|update|make)\b( it| this| that| them)?\W*$/i;
const LIST_ITEM = /(^|\n)\s*(\d+[.)]|[-*])\s+\S/g;
const ALSO = /\b(also|another|additionally|as well)\b/gi;
const WRAPUP = /(that'?s (it|all)( for today)?|done for (today|now|the day)|wrap(ping)? up|good ?night|bye|see you|let'?s stop|i'?m done|calling it)/i;
const ASKING = /^\s*(show me|explain|teach me|tell me|what|where|why|how|which|is|are|was|were|will|would|so)\b/i;
const REQUEST = /\b(help me|can you|could you|could we|please|i need|i want|let'?s)\b/i;
const TERMINAL_PASTE = /drwx|^\S*otal \d+|^PS [A-Z]:\\|\$ \w+/m;
const TRIVIAL = /^(y|yes|no|ok|okay|exit|continue|go|thanks|thank you|nice|perfect|allright|alright)\W*$/i;
// UI work: a visible change. Proof for these is looking at the page.
const UI = /\b(ui|ux|page|component|layout|css|style|styling|button|modal|navbar|nav bar|header|footer|sidebar|card|form|landing|hero|dashboard|responsive|mobile|theme|dark mode|animation|tailwind|design)s?\b/i;
const VISUAL_PROOF = /screenshot|look(s)? (right|good)|show me|at \d+ ?px|mobile and desktop|390|viewport|visual(ly)?|in the browser/i;

const MACHINE_PREFIXES = ['Another Claude session sent a message', '[SYSTEM NOTIFICATION', '<task-notification',
  '<system-reminder', '[Subagent hand-back]', '[Request interrupted'];
const MACHINE_MARKERS = ['<agent-message', '[Subagent hand-back]', '<task-notification',
  'Another Claude session sent a message', '[SYSTEM NOTIFICATION'];

function gitRoot(cwd) {
  let d = path.resolve(cwd || '.');
  for (;;) {
    if (fs.existsSync(path.join(d, '.git'))) return d;
    const up = path.dirname(d);
    if (up === d) return null;
    d = up;
  }
}

function worktreeHint(cwd) {
  const root = gitRoot(cwd);
  if (root) return `in a 2nd terminal: \`cd "${root}"; claude -w <task-name>\``;
  return 'worktrees need a git repo (`git init` first)';
}

export function cues(p, cwd = '') {
  const out = [];
  const flags = {};
  const question = ASKING.test(p) || (p.trimEnd().endsWith('?') && !REQUEST.test(p));
  const building = BUILD.test(p) && !question && !TERMINAL_PASTE.test(p);
  flags.build = building;
  const broken = BROKEN.test(p);
  if (building && !broken && !DONE.test(p)) {
    flags.no_done = true;
    if (p.length > 200) {
      out.push("Substantial build with no done-criterion. Put 'done when / where / allowed-or-ask-first' into "
        + 'your one up-front question batch (offer your proposed proof as the recommended option) before '
        + 'building. One question, no lecture.');
    } else {
      out.push("Build/change request with no done-criterion. Before starting, state how you will prove it's done; "
        + "tip: add 'Done when: <observable result>'.");
    }
  }
  if (building && UI.test(p) && !VISUAL_PROOF.test(p)) {
    flags.ui_no_visual = true;
    out.push('Visible UI change. Proof is looking at the running page: check it at 390 px and desktop width '
      + '(and dark mode if the app has one) before saying done, and consider the `ui-reviewer` agent. '
      + "Tip for Nika: '…and show me screenshots at mobile and desktop'.");
  }
  if (broken && !EXPECTED.test(p)) {
    flags.debug_no_hypothesis = true;
    out.push('Bug report without expected/actual/hypothesis. Follow debug-protocol (reproduce first); '
      + "tip: 'Expected X, got Y, changed since Z, I suspect W'.");
  }
  const items = (p.match(LIST_ITEM) || []).length + (p.match(ALSO) || []).length;
  if (building && items >= 3) {
    flags.multi_task = true;
    out.push(`~${items} separable parts. Use subagents for independent research/review; for an independent code `
      + `change suggest a parallel session, ${worktreeHint(cwd)}. Say which, in one line, before starting.`);
  }
  if (RESEARCH.test(p) && (!building || p.includes('?'))) {
    flags.research = true;
    out.push('Research/comparison question. Delegate to the `researcher` agent (live, cited sources) '
      + 'instead of answering from training memory.');
  }
  if (building && p.length > 600) {
    flags.big_spec = true;
    out.push('Large spec. Propose a short plan (or suggest plan mode) and get one OK before writing code.');
  }
  if (STATUS.test(p.trim())) {
    flags.asks_status = true;
    out.push("Nika is asking whether it's done/working. Answer with PROOF (command + output, test result, "
      + "screenshot), not assurance; tip: next time put 'Done when: …' in the original request.");
  } else if (p.length < 25 && SHORT_COMMAND.test(p) && !TRIVIAL.test(p.trim())) {
    flags.vague = true;
    out.push('Very short prompt. If scope is ambiguous, ask ONE batched question rather than guessing.');
  }
  if (WRAPUP.test(p) && p.length < 80 && !p.trimEnd().endsWith('?')) {
    flags.wrapup = true;
    out.push("Nika seems to be wrapping up. If /retro hasn't run yet, load the `retro` skill now and run it "
      + "(its nikabrain commit is pre-approved; it finds missed sessions itself). Don't just offer it.");
  }
  return { out, flags };
}

// Sub-bullets of coaching.md that steer behaviour; the dated evidence lines stay in the
// file for /curate (gigabrain measured ~1.6k tokens per firing when it injected them all).
const KEEP = ['Ask for', 'Next', 'Claude:', 'Nika:'];

export function compact(focus) {
  const out = [];
  for (const line of focus.split(/\r?\n/)) {
    if (line.startsWith('- **')) {
      const m = /^- \*\*(.+?)\*\*/.exec(line);
      out.push(m ? `- **${m[1].replace(/\.$/, '')}**` : line.slice(0, 80));
    } else {
      const t = line.trimStart();
      if (t.startsWith('- ') && KEEP.some((k) => t.slice(2).startsWith(k))) out.push(line);
    }
  }
  out.push('(Evidence per focus: brain/coaching.md.)');
  return out.join('\n');
}

function milestone() {
  try {
    for (const line of fs.readFileSync(ROADMAP, 'utf8').split(/\r?\n/)) {
      if (line.startsWith('**Now:**')) return line.slice('**Now:**'.length).trim();
    }
  } catch { /* no roadmap */ }
  return '';
}

export function isMachine(p) {
  const head = p.slice(0, 400);
  return MACHINE_PREFIXES.some((x) => p.startsWith(x)) || MACHINE_MARKERS.some((m) => head.includes(m));
}

async function main() {
  // Headless runs (`claude -p`, evals) are not Nika typing: no cues, no signal rows.
  if (process.env.CLAUDE_CODE_SESSION_ATTENDED === '0' || (process.env.CLAUDE_CODE_ENTRYPOINT || '').startsWith('sdk')) return;
  const data = await stdinJSON();
  const p = String(data.prompt || '').trim();
  if (!p || p.startsWith('/') || p.startsWith('!') || isMachine(p)) return;
  const { out, flags } = cues(p, data.cwd || '');
  const testRun = Boolean(process.env.NIKABRAIN_NO_SIGNALS);

  if (!testRun) {
    try {
      fs.mkdirSync(INBOX, { recursive: true });
      fs.appendFileSync(SIGNALS, JSON.stringify({ t: nowISO(), project: path.basename(data.cwd || ''), len: p.length, ...flags }) + '\n');
    } catch { /* never block a prompt */ }
  }

  // Focus + milestone once per session (gigabrain: re-injecting it on every prompt cost ~330 tokens each).
  let first = false;
  const sid = data.session_id || '';
  if (sid && !testRun) {
    try {
      const seen = fs.existsSync(SEEN) ? fs.readFileSync(SEEN, 'utf8').split(/\s+/).filter(Boolean) : [];
      if (!seen.includes(sid)) {
        first = true;
        fs.writeFileSync(SEEN, [...seen, sid].slice(-200).join('\n') + '\n');
      }
    } catch { /* ignore */ }
  }
  if (testRun && process.env.NIKABRAIN_FORCE_FOCUS) first = true;
  const focus = first && fs.existsSync(FOCUS) ? compact(fs.readFileSync(FOCUS, 'utf8').trim()) : '';
  if (!out.length && !focus) return;

  const lines = ["[nikabrain coach] Hidden context, don't quote it."];
  if (out.length) {
    lines.push('Cues for this prompt:');
    for (const c of out) lines.push(`- ${c}`);
  }
  if (focus) {
    lines.push("Nika's current coaching focus (from brain/coaching.md):", focus);
    const now = milestone();
    if (now) lines.push(`Roadmap milestone (me/roadmap.md): ${now} If this session can advance it, say so in one line; don't hijack an unrelated task.`);
  }
  lines.push('Act on real cues (plan, agent, worktree, proof) as part of the work. If one would have materially '
    + "improved the prompt or workflow, end the reply with exactly one line: '💡 <tip with a short example>'. "
    + 'Skip it when the prompt was already good. Never lecture.');
  process.stdout.write(lines.join('\n') + '\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => { /* a hook must never break a prompt */ });
}
