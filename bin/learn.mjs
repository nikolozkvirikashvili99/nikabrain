#!/usr/bin/env node
// Lesson pages for skill `teach`. Pages live in ~/.cache/nikabrain/learn/ (never in a repo);
// deleting the cache only costs a rebuild.
//   node bin/learn.mjs list                      cached lessons
//   node bin/learn.mjs assemble <topic> <src>    inline the teach kit into src → cache/<topic>.html
//   node bin/learn.mjs check <topic>             static check against kit/CONTRACT.md (exit 1 on FAIL)
//   node bin/learn.mjs open <topic>              open the page in the default browser
//   node bin/learn.mjs path <topic>              print the page's path
//   node bin/learn.mjs exams                     exam topics, variants and your last score per variant
//   node bin/learn.mjs exam <topic> [n]          open variant n (default: the next one you haven't taken)
//   node bin/learn.mjs check-exam [topic]        check exam JSON against kit/EXAMS.md (exit 1 on FAIL)
//   node bin/learn.mjs hub [topic]               the local learn page: every topic, lesson and exam
//   node bin/learn.mjs serve | stop              the 127.0.0.1 server (started on demand by exam/hub)
// `check` is static (it counts markup); it can't see layout. Look at the page yourself at
// 390 px and desktop, light and dark, before calling a lesson done.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ROOT, CACHE } from './lib.mjs';

const DIR = path.join(CACHE, 'learn');
const KIT = path.join(ROOT, 'global', 'skills', 'teach', 'kit');
const page = (topic) => path.join(DIR, `${topic.replace(/[^\w.-]/g, '-')}.html`);
const [cmd, topic, src] = process.argv.slice(2);

function need(t) { if (!t) { console.log(`usage: learn.mjs ${cmd} <topic>`); process.exit(2); } }

function list() {
  let files = [];
  try { files = fs.readdirSync(DIR).filter((f) => f.endsWith('.html')); } catch { /* none yet */ }
  if (!files.length) { console.log(`no lessons yet (cache: ${DIR}). Ask for one: "/teach <topic>"`); return; }
  for (const f of files) {
    const html = fs.readFileSync(path.join(DIR, f), 'utf8');
    const title = (/<title>([^<]*)<\/title>/i.exec(html) || [])[1] || '';
    const when = fs.statSync(path.join(DIR, f)).mtime.toISOString().slice(0, 10);
    console.log(`${f.replace(/\.html$/, '').padEnd(28)} ${when}  ${title}`);
  }
}

function assemble(t, s) {
  need(t); if (!s) { console.log('usage: learn.mjs assemble <topic> <source.html>'); process.exit(2); }
  let html = fs.readFileSync(s, 'utf8');
  const css = fs.readFileSync(path.join(KIT, 'kit.css'), 'utf8');
  const js = fs.readFileSync(path.join(KIT, 'kit.js'), 'utf8');
  for (const m of ['<!-- teach-kit:css -->', '<!-- teach-kit:js -->']) {
    if (!html.includes(m)) { console.log(`FAIL: marker ${m} missing in ${s}`); process.exit(1); }
  }
  html = html.replace('<!-- teach-kit:css -->', () => `<style data-teach-kit>\n${css}\n</style>`)
    .replace('<!-- teach-kit:js -->', () => `<script data-teach-kit>\n${js}\n</script>`);
  fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(page(t), html);
  console.log(page(t));
}

const count = (html, re) => (html.match(re) || []).length;

export function checkHtml(html) {
  const fails = [];
  const want = (ok, msg) => { if (!ok) fails.push(msg); };
  want(html.includes('data-teach-kit'), 'teach kit not inlined (run assemble)');
  want(/<meta name="teach-topic"/.test(html), '<meta name="teach-topic"> missing');
  want(/data-hook/.test(html), 'hook section (data-hook) missing');
  want(/data-prereq/.test(html), 'prereq section (data-prereq) missing');
  want(/<nav[^>]*data-toc/.test(html), 'section map (nav data-toc) missing');
  const figures = html.match(/<figure[\s\S]*?<\/figure>/g) || [];
  const svgFigs = figures.filter((f) => /<svg/.test(f));
  want(svgFigs.length >= 6, `figures with SVG: ${svgFigs.length} (need 6+)`);
  want(svgFigs.every((f) => /<figcaption/.test(f)), 'every SVG figure needs a <figcaption>');
  const unlabelled = svgFigs.filter((f) => { const s = (/<svg[^>]*>/.exec(f) || [''])[0]; return !/role="img"/.test(s) || !/aria-label=/.test(s); });
  want(!unlabelled.length, `${unlabelled.length} figure SVG(s) without role="img" + aria-label`);
  want(count(html, /data-stepper/g) >= 2, `steppers: ${count(html, /data-stepper/g)} (need 2+)`);
  want(count(html, /data-sim=/g) >= 1, 'live figure (data-sim) missing');
  const quizzes = html.match(/<div[^>]*data-quiz[\s\S]*?data-feedback/g) || [];
  want(quizzes.length >= 8, `quizzes: ${quizzes.length} (need 8+)`);
  quizzes.forEach((q, i) => {
    const id = (/id="([^"]+)"/.exec(q) || [])[1] || `#${i + 1}`;
    want(/id="/.test(q.slice(0, 200)), `quiz ${id}: needs an id`);
    want(count(q, /data-correct/g) === 1, `quiz ${id}: exactly one data-correct`);
    const wrong = (q.match(/<button[^>]*data-option[^>]*>/g) || []).filter((b) => !/data-correct/.test(b));
    want(wrong.every((b) => /data-why=/.test(b)), `quiz ${id}: every wrong option needs data-why`);
  });
  want(count(html, /data-predict/g) >= 2, `predict quizzes: ${count(html, /data-predict/g)} (need 2+)`);
  want(count(html, /data-reveal/g) >= 2, 'predicts need a [data-reveal]');
  const recall = (/<section[^>]*data-recall[\s\S]*?<\/section>/.exec(html) || [''])[0];
  want(count(recall, /data-quiz/g) >= 3, `recall quizzes: ${count(recall, /data-quiz/g)} (need 3+)`);
  want(count(html, /data-order|data-fill/g) >= 1, 'order or fill exercise missing');
  want(count(html, /<dfn[^>]*data-tip/g) >= 6, `glossary terms: ${count(html, /<dfn[^>]*data-tip/g)} (need 6+)`);
  const ext = [...html.matchAll(/<(script|link|img)[^>]+(src|href)="(https?:)?\/\/([^/"]+)/g)].map((m) => m[4])
    .filter((h) => !/^fonts\.(googleapis|gstatic)\.com$/.test(h));
  want(!ext.length, `network resources other than Google Fonts: ${[...new Set(ext)].join(', ')}`);
  want(Buffer.byteLength(html) < 1.5 * 1024 * 1024, 'page is over 1.5 MB');
  return fails.filter(Boolean);
}

function check(t) {
  need(t);
  const f = page(t);
  if (!fs.existsSync(f)) { console.log(`FAIL: ${f} not built`); process.exit(1); }
  const fails = checkHtml(fs.readFileSync(f, 'utf8'));
  if (fails.length) { for (const x of fails) console.log(`  x ${x}`); console.log(`FAIL (${fails.length})`); process.exit(1); }
  console.log(`PASS (static). Now look at it at 390 px and desktop, light and dark: ${f}`);
}

function launch(target) {
  const [bin, args] = process.platform === 'win32' ? ['cmd', ['/c', 'start', '""', `"${target}"`]]
    : process.platform === 'darwin' ? ['open', [target]] : ['xdg-open', [target]];
  spawn(bin, args, { detached: true, stdio: 'ignore', windowsVerbatimArguments: process.platform === 'win32' }).unref();
}

function open(t) {
  need(t);
  const f = page(t);
  if (!fs.existsSync(f)) { console.log(`not built: ${f}. Build it with skill teach.`); process.exit(3); }
  launch(f);
  console.log(`opened ${f}`);
}

// ---------------------------------------------------------------- exams
// Ported from gigabrain's bin/learn + bin/check-exam. Exams are source data in learning/exams/<topic>/vN.json
// (contract: global/skills/teach/kit/EXAMS.md); results are Nika's record in me/exam-log.jsonl.
export const EXAMS = path.join(ROOT, 'learning', 'exams');
export const EXAM_LOG = process.env.NIKABRAIN_EXAM_LOG || path.join(ROOT, 'me', 'exam-log.jsonl');
const PORT = +(process.env.NIKABRAIN_LEARN_PORT || 47616);
const URL_BASE = `http://127.0.0.1:${PORT}`;
const safeTopic = (t) => /^[a-z0-9][a-z0-9-]*$/.test(t || '');

export function variants(t) {
  if (!safeTopic(t)) return [];
  try {
    return fs.readdirSync(path.join(EXAMS, t)).map((f) => /^v(\d+)\.json$/.exec(f)).filter(Boolean).map((m) => +m[1]).sort((a, b) => a - b);
  } catch { return []; }
}
const examTopics = () => { try { return fs.readdirSync(EXAMS).filter((t) => variants(t).length); } catch { return []; } };
const readExam = (t, n) => JSON.parse(fs.readFileSync(path.join(EXAMS, t, `v${n}.json`), 'utf8'));

export function readLog(file = EXAM_LOG) {
  try { return fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean); }
  catch { return []; }
}

const words = (s) => String(s).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
function similar(a, b) { // Jaccard over words: near-identical stems count as repeats
  const A = new Set(words(a)), B = new Set(words(b));
  const inter = [...A].filter((w) => B.has(w)).length;
  return inter / (new Set([...A, ...B]).size || 1);
}

/** Check one variant against EXAMS.md. `others` = questions of the topic's other variants (for repeats). */
export function checkExam(ex, others = []) {
  const f = [];
  const want = (ok, msg) => { if (!ok) f.push(msg); };
  for (const k of ['topic', 'variant', 'title', 'minutes', 'pass', 'domains', 'questions']) want(ex[k] !== undefined, `missing "${k}"`);
  if (f.length) return f;
  const qs = ex.questions;
  want(qs.length === 15, `questions: ${qs.length} (need 15)`);
  want(ex.minutes === 20, `minutes: ${ex.minutes} (need 20)`);
  want(ex.pass === 0.7, `pass: ${ex.pass} (need 0.7)`);
  const ids = new Set(ex.domains.map((d) => d.id));
  want(ex.domains.length >= 3 && ex.domains.length <= 5, `domains: ${ex.domains.length} (need 3–5)`);
  const wsum = ex.domains.reduce((s, d) => s + (d.weight || 0), 0);
  want(Math.abs(wsum - 1) < 0.011, `domain weights sum to ${wsum.toFixed(2)} (need 1)`);
  for (const d of ex.domains) want(qs.filter((q) => q.domain === d.id).length >= 2, `domain ${d.id}: needs 2+ questions`);
  const seen = new Set();
  let multi = 0, longestRight = 0, single = 0, defs = 0;
  for (const q of qs) {
    const id = q.id || '(no id)';
    want(q.id && !seen.has(q.id), `${id}: id missing or repeated`); seen.add(q.id);
    want(ids.has(q.domain), `${id}: unknown domain ${q.domain}`);
    want(typeof q.stem === 'string' && q.stem.length >= 30, `${id}: stem too short`);
    const opts = q.options || [];
    const right = opts.filter((o) => o.correct).length;
    if (right > 1) {
      multi++;
      want(opts.length >= 5 && opts.length <= 6 && right <= 3, `${id}: multiple response needs 5–6 options, 2–3 correct`);
      const m = /\(Choose (two|three)\.\)\s*$/.exec(q.stem);
      want(m && { two: 2, three: 3 }[m[1]] === right, `${id}: stem must end with "(Choose ${right === 2 ? 'two' : 'three'}.)"`);
    } else {
      single++;
      want(opts.length === 4 && right === 1, `${id}: single answer needs 4 options, exactly 1 correct`);
      const lens = opts.map((o) => String(o.text).length), max = Math.max(...lens);
      if (opts.find((o) => o.correct) && String(opts.find((o) => o.correct).text).length === max && lens.filter((l) => l === max).length === 1) longestRight++;
    }
    for (const o of opts) {
      want(String(o.why || '').length >= 20, `${id}: every option needs a why (20+ chars)`);
      want(!/(all|none) of the above|both [a-d] and [a-d]|^option [a-d]\b/i.test(o.text), `${id}: banned option wording "${o.text}"`);
    }
    want(String(q.explain || '').length >= 60, `${id}: explain needs 60+ chars`);
    want(Array.isArray(q.refs) && q.refs.length >= 1, `${id}: needs 1+ ref`);
    if (/^\s*(what is|what are|which (hook|property|method|attribute) is)\b/i.test(q.stem)) defs++;
    for (const o of others) if (similar(q.stem, o.stem) > 0.8) f.push(`${id}: stem repeats ${o.id}`);
  }
  for (let i = 0; i < qs.length; i++) for (let j = i + 1; j < qs.length; j++) if (similar(qs[i].stem, qs[j].stem) > 0.8) f.push(`${qs[i].id}: stem repeats ${qs[j].id}`);
  want(multi <= 3, `multiple-response questions: ${multi} (max 3)`);
  want(!single || longestRight / single <= 0.4, `correct option is the longest in ${longestRight}/${single} single-answer questions (max 40%)`);
  want(defs / qs.length <= 0.2, `definition-style stems: ${defs} (max 20%)`);
  return f;
}

function checkExams(t) {
  const topics = t ? [t] : examTopics();
  if (!topics.length) { console.log(`no exams yet (${EXAMS})`); return; }
  let bad = 0;
  for (const tp of topics) {
    const vs = variants(tp);
    if (!vs.length) { console.log(`FAIL ${tp}: no variants`); bad++; continue; }
    for (const n of vs) {
      let ex, fails;
      try { ex = readExam(tp, n); } catch (e) { console.log(`FAIL ${tp} v${n}: ${e.message}`); bad++; continue; }
      const others = vs.filter((m) => m !== n).flatMap((m) => { try { return readExam(tp, m).questions; } catch { return []; } });
      fails = checkExam(ex, others);
      if (ex.topic !== tp || ex.variant !== n) fails.push(`topic/variant fields must say ${tp} v${n}`);
      if (fails.length) { bad++; console.log(`FAIL ${tp} v${n} (${fails.length})`); for (const x of fails) console.log(`  x ${x}`); }
      else console.log(`PASS ${tp} v${n}`);
    }
  }
  if (bad) process.exit(1);
}

function lastScores() {
  const out = {};
  for (const r of readLog()) out[`${r.topic} v${r.variant}`] = r;
  return out;
}

function examsList() {
  const topics = examTopics();
  if (!topics.length) { console.log(`no exams yet (${EXAMS})`); return; }
  const last = lastScores();
  for (const t of topics) {
    const cells = variants(t).map((n) => { const r = last[`${t} v${n}`]; return r ? `v${n} ${Math.round(r.score * 100)}%${r.pass ? '✓' : ''}` : `v${n} —`; });
    console.log(`${t.padEnd(24)} ${cells.join('  ')}   lesson: ${fs.existsSync(page(t)) ? 'built' : 'not built'}`);
  }
}

export function validResult(r) {
  return !!r && typeof r === 'object' && safeTopic(r.topic) && Number.isInteger(r.variant) && variants(r.topic).includes(r.variant)
    && ['exam', 'study'].includes(r.mode) && Number.isFinite(r.score) && r.score >= 0 && r.score <= 1
    && Number.isInteger(r.correct) && Number.isInteger(r.total) && Array.isArray(r.misses ?? []);
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const shell = (title, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title>
<style>:root{--bg:#f7f4ee;--s:#fffdf8;--b:#ddd6c8;--t:#22201b;--d:#6b6458;--a:#2f5d8a;--ok:#2e7d4f;color-scheme:light}
@media (prefers-color-scheme:dark){:root{--bg:#17161a;--s:#1f1e23;--b:#37353d;--t:#ebe8e1;--d:#a29d93;--a:#7fb0e0;--ok:#6cc28f;color-scheme:dark}}
body{margin:0;background:var(--bg);color:var(--t);font:16px/1.55 system-ui,"Segoe UI",sans-serif}main{max-width:760px;margin:0 auto;padding:24px 16px 64px;display:grid;gap:16px}
.card{background:var(--s);border:1px solid var(--b);border-radius:10px;padding:16px 18px;display:grid;gap:8px}a{color:var(--a)}.dim{color:var(--d)}.ok{color:var(--ok);font-weight:600}
ul{margin:0;padding-left:1.2em}</style></head><body><main>${body}</main></body></html>`;

function topicPage(t) {
  const last = lastScores();
  const vs = variants(t).map((n) => {
    let title = `variant ${n}`; try { title = readExam(t, n).title; } catch { /* broken file: still listed */ }
    const r = last[`${t} v${n}`];
    return `<li><a href="/exam/${t}/${n}">${esc(title)}</a> <span class="dim">${r ? `last: ${Math.round(r.score * 100)}% (${esc(r.mode)}, ${esc(String(r.finished || '').slice(0, 10))})` : 'not taken'}</span>${r?.pass ? ' <span class="ok">pass</span>' : ''}</li>`;
  }).join('');
  const lesson = fs.existsSync(page(t)) ? `<p><a href="/lesson/${t}">Open the lesson</a></p>` : '<p class="dim">No lesson page yet: ask Claude <code>/teach ' + esc(t) + '</code>.</p>';
  return shell(t, `<p><a href="/">← all topics</a></p><h1>${esc(t)}</h1><div class="card">${lesson}</div><div class="card"><b>Exams</b>${vs ? `<ul>${vs}</ul>` : '<p class="dim">none yet</p>'}<p class="dim">Study mode shows the answer after each question; exam mode is timed and only scores at the end. Both are saved to me/exam-log.jsonl.</p></div>`);
}

function indexPage() {
  let lessons = [];
  try { lessons = fs.readdirSync(DIR).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5)); } catch { /* none */ }
  const topics = [...new Set([...examTopics(), ...lessons])].sort();
  const items = topics.map((t) => `<li><a href="/topic/${esc(t)}">${esc(t)}</a> <span class="dim">${variants(t).length} exam(s)${lessons.includes(t) ? ' · lesson' : ''}</span></li>`).join('');
  return shell('nikabrain learn', `<h1>nikabrain: learn</h1><div class="card">${items ? `<ul>${items}</ul>` : '<p class="dim">Nothing yet. Ask Claude: /teach &lt;topic&gt;</p>'}</div>`);
}

async function serve() {
  const http = await import('node:http');
  const idle = +(process.env.NIKABRAIN_SERVE_IDLE || 7200) * 1000;
  let last = Date.now();
  const okHost = (req) => [`127.0.0.1:${PORT}`, `localhost:${PORT}`].includes(req.headers.host); // DNS rebinding
  const okOrigin = (req) => !req.headers.origin || [`http://127.0.0.1:${PORT}`, `http://localhost:${PORT}`].includes(req.headers.origin);
  const send = (res, code, body, type = 'text/html; charset=utf-8') => { res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' }); res.end(body); };
  const srv = http.createServer((req, res) => {
    last = Date.now();
    if (!okHost(req)) return send(res, 403, 'wrong host', 'text/plain');
    const parts = req.url.split('?')[0].split('/').filter(Boolean).map(decodeURIComponent);
    if (req.method === 'GET') {
      if (parts[0] === 'health') return send(res, 200, 'nikabrain-learn', 'text/plain');
      if (!parts.length) return send(res, 200, indexPage());
      if (parts.length === 2 && parts[0] === 'topic' && safeTopic(parts[1])) return send(res, 200, topicPage(parts[1]));
      if (parts.length === 2 && parts[0] === 'lesson' && safeTopic(parts[1]) && fs.existsSync(page(parts[1]))) {
        let html = fs.readFileSync(page(parts[1]), 'utf8');
        if (variants(parts[1]).length) {
          const sec = `<section id="exams"><h2>Exams</h2><p>Test yourself: <a href="/topic/${parts[1]}">${variants(parts[1]).length} exam variant(s)</a>.</p></section>`;
          const i = html.lastIndexOf('</main>');
          html = i >= 0 ? html.slice(0, i) + sec + html.slice(i) : html + sec;
        }
        return send(res, 200, html);
      }
      if (parts.length === 3 && parts[0] === 'exam' && variants(parts[1]).includes(+parts[2])) {
        const data = fs.readFileSync(path.join(EXAMS, parts[1], `v${+parts[2]}.json`), 'utf8');
        JSON.parse(data); // refuse to serve a broken file
        const runner = fs.readFileSync(path.join(KIT, 'exam.html'), 'utf8');
        return send(res, 200, runner.replace('/*EXAM_DATA*/', () => data.replace(/</g, '\\u003c')));
      }
      return send(res, 404, 'not found', 'text/plain');
    }
    if (req.method !== 'POST' || !okOrigin(req)) return send(res, 403, 'cross-origin', 'text/plain');
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 256000) req.destroy(); });
    req.on('end', () => {
      if (req.url === '/api/stop') { send(res, 200, 'bye', 'text/plain'); srv.close(); setTimeout(() => process.exit(0), 50); return; }
      if (req.url !== '/api/result') return send(res, 404, 'not found', 'text/plain');
      let r; try { r = JSON.parse(body); } catch { return send(res, 400, 'bad json', 'text/plain'); }
      if (!validResult(r)) return send(res, 400, 'bad result', 'text/plain');
      r.logged = new Date().toISOString().slice(0, 19) + 'Z';
      fs.mkdirSync(path.dirname(EXAM_LOG), { recursive: true });
      fs.appendFileSync(EXAM_LOG, JSON.stringify(r) + '\n');
      send(res, 200, '{"ok":true}', 'application/json');
    });
  });
  srv.listen(PORT, '127.0.0.1', () => console.log(`serving ${URL_BASE} (stops after ${idle / 60000} min idle)`));
  setInterval(() => { if (Date.now() - last > idle) process.exit(0); }, 30000).unref();
}

async function alive() {
  try { const r = await fetch(`${URL_BASE}/health`, { signal: AbortSignal.timeout(800) }); return (await r.text()) === 'nikabrain-learn'; }
  catch { return false; }
}

async function ensureServer() {
  if (await alive()) return;
  spawn(process.execPath, [fileURLToPath(import.meta.url), 'serve'], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
  for (let i = 0; i < 25; i++) { await new Promise((r) => setTimeout(r, 200)); if (await alive()) return; }
  console.log(`FAIL: the learn server did not start on ${URL_BASE} (port busy? set NIKABRAIN_LEARN_PORT)`); process.exit(1);
}

async function exam(t, n) {
  need(t);
  const vs = variants(t);
  if (!vs.length) { console.log(`no exams for ${t} yet (${path.join(EXAMS, t)}). Ask Claude to write them (kit/EXAMS.md).`); process.exit(3); }
  let v = n ? +n : null;
  if (!v) { const done = new Set(readLog().filter((r) => r.topic === t).map((r) => r.variant)); v = vs.find((x) => !done.has(x)) || vs[0]; }
  if (!vs.includes(v)) { console.log(`${t} has variants ${vs.join(', ')}`); process.exit(2); }
  await ensureServer();
  launch(`${URL_BASE}/exam/${t}/${v}`);
  console.log(`opened ${URL_BASE}/exam/${t}/${v}  (results → ${EXAM_LOG})`);
}

async function hub(t) { await ensureServer(); const u = t ? `${URL_BASE}/topic/${t}` : URL_BASE; launch(u); console.log(`opened ${u}`); }

async function stop() {
  if (!(await alive())) { console.log('not running'); return; }
  await fetch(`${URL_BASE}/api/stop`, { method: 'POST' }).catch(() => {});
  console.log('stopped');
}

const USAGE = `usage: learn.mjs list | assemble <topic> <src> | check <topic> | open <topic> | path <topic>
                 exams | exam <topic> [variant] | check-exam [topic] | hub [topic] | serve | stop`;

if (process.argv[1] && path.resolve(process.argv[1]).endsWith(path.join('bin', 'learn.mjs'))) {
  ({ list, assemble: () => assemble(topic, src), check: () => check(topic), open: () => open(topic),
    path: () => { need(topic); console.log(page(topic)); },
    exams: examsList, exam: () => exam(topic, src), 'check-exam': () => checkExams(topic), hub: () => hub(topic), serve, stop,
  }[cmd] || (() => { console.log(USAGE); process.exit(2); }))();
}
