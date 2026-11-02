// Shared helpers for nikabrain's bin/ scripts and hooks. Node built-ins only.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HOME = os.homedir();
export const CLAUDE_DIR = process.env.NIKABRAIN_CLAUDE_DIR || path.join(HOME, '.claude');
export const CACHE = path.join(HOME, '.cache', 'nikabrain');
export const INBOX = path.join(ROOT, 'inbox');

/** Forward-slash path: safe inside hook commands and in both Git Bash and PowerShell. */
export const fwd = (p) => p.replace(/\\/g, '/');

export function readJSON(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    if (fallback !== undefined && (e.code === 'ENOENT')) return fallback;
    throw new Error(`cannot read ${file}: ${e.message}`);
  }
}

export function writeJSON(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

/** Parse the YAML-ish frontmatter of a markdown file: top-level `key: value` lines only. */
export function frontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return null;
  const out = {};
  let lastKey = null;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (kv) {
      lastKey = kv[1];
      out[lastKey] = kv[2].replace(/^["']|["']$/g, '');
    } else if (lastKey && /^\s+\S/.test(line) && out[lastKey] === '') {
      // folded multi-line value (e.g. `description:` followed by indented lines)
      out[lastKey] = line.trim();
      lastKey = null;
    }
  }
  return out;
}

export function listDirs(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  } catch {
    return [];
  }
}

export function walk(dir, skip = new Set(['.git', 'node_modules', 'inbox'])) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    let entries;
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      if (skip.has(e.name)) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.isFile()) out.push(p);
    }
  }
  return out;
}

/** Read stdin fully (hooks get their JSON payload there). */
export async function stdinJSON() {
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

export function today() {
  const d = new Date();
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

export function nowISO() {
  const d = new Date();
  const z = (n) => String(n).padStart(2, '0');
  return `${today()}T${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`;
}
