#!/usr/bin/env node
// PreCompact + SessionEnd hook: one pointer row per event in inbox/sessions.jsonl.
// Why (gigabrain, 2026-10-17): 13 of 18 sessions ended without /retro and their lessons
// were never harvested. Transcripts stay on disk (cleanupPeriodDays 365), so this hook only
// records *where* they are; /retro reads the rows since its last run and mines the sessions
// it missed. A SessionEnd hook gets ~1.5 s, so this is a plain append. Never blocks.
// Test: echo '{"hook_event_name":"SessionEnd","session_id":"s","transcript_path":"t.jsonl","cwd":"C:/x"}' | NIKABRAIN_SESSION_LOG=./s.jsonl node session-log.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { INBOX, stdinJSON, nowISO } from '../../bin/lib.mjs';

const LOG = process.env.NIKABRAIN_SESSION_LOG || path.join(INBOX, 'sessions.jsonl');

function project(cwd) {
  const head = cwd.split(/[\\/]\.claude[\\/]worktrees[\\/]/)[0];
  let d = path.resolve(head);
  for (;;) {
    if (fs.existsSync(path.join(d, '.git'))) return path.basename(d);
    const up = path.dirname(d);
    if (up === d) return path.basename(path.resolve(head));
    d = up;
  }
}

try {
  const d = await stdinJSON();
  const cwd = String(d.cwd || '');
  const tmp = path.resolve(os.tmpdir()).toLowerCase();
  const skip = !cwd || path.resolve(cwd).toLowerCase().startsWith(tmp) || (process.env.CLAUDE_CODE_ENTRYPOINT || '').startsWith('sdk');
  if (!skip) {
    const row = {
      t: nowISO(),
      event: d.hook_event_name || '?',
      session_id: d.session_id || '',
      project: project(cwd),
      cwd,
      transcript: d.transcript_path || '',
      why: d.reason || d.trigger || '',
    };
    fs.mkdirSync(path.dirname(LOG), { recursive: true });
    fs.appendFileSync(LOG, JSON.stringify(row) + '\n');
  }
} catch { /* a hook must never break session end or compaction */ }
