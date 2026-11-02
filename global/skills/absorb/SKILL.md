---
name: absorb
description: Import or refresh outside skills (UI/UX Pro Max, Anthropic skills, Vercel agent-skills, or a new public repo) into nikabrain/library. Check the licence, triage against Nika's stack, copy with provenance, pin the upstream commit, and later diff upstream changes since the pin. Use when Nika says /absorb, "absorb X", "add the skill from <repo>", "update the library", "what changed upstream".
---

# Absorb: learn from other people's best work

`/retro` grows the brain from Nika's own sessions; `/absorb` grows the
library from outside. Library entries are textbook chapters: they only count
as earned once `brain/library-ledger.md` holds evidence. Contract:
`N/library/README.md`. `N` = `~/projects/nikabrain`.

Helper: `node N/bin/absorb.mjs status` (pins vs upstream HEAD),
`node N/bin/absorb.mjs diff <source>` (changed files since the pin),
`node N/bin/absorb.mjs pull <source> [skill…]` (copy at upstream HEAD and re-pin).
Clones live in `~/.cache/nikabrain/upstream/<source>` (untrusted: never run
their scripts while triaging).

## 1. Stack filter

Nika's stack: React, JavaScript, HTML, CSS (plus whatever `labs.md` repos use).
Cross-cutting topics are welcome too: UI/UX, accessibility, testing,
performance, review, debugging, security for web apps. Skip anything outside
it (other frameworks, backends Nika doesn't run, marketing) or put it behind a
note in `library/README.md` as "available upstream".

## 2. Triage (then one approval)

- **New source:** verify licence, stars and last push via the GitHub API or
  the cloned LICENSE ([[scout-sources-by-api-then-licence-tier]]). No licence
  or not permissive (MIT, Apache-2.0, BSD) → stop and tell Nika. Add the
  source to `library/sources.json` and its credit to `library/NOTICE.md`.
- **Update:** `absorb.mjs diff <source>`; read each changed file's diff and
  classify *take* (fix or real improvement) · *ignore* (format churn) ·
  *conflict* (contradicts a brain entry or ledger evidence: the brain wins,
  raise it). Rows marked `needs-edit` in the ledger get looked at here.
- Overlap check against `library/skills/` and `global/skills/` first.
- Present **one table**: item · take/skip/merge · why. Get one OK.

## 3. Copy, adapt, record

- `absorb.mjs pull <source> <skill…>` copies the upstream folder and re-pins.
- Adaptations are recorded as `replace` pairs in `sources.json` → the helper
  re-applies them on every pull, so updates lose nothing. Never hand-edit an
  absorbed skill without adding the matching rule.
- New entries get a ledger row: confidence **0.4**, `Added` = today.
- Run `node N/bin/doctor.mjs` (library section must be clean).

## 4. Report

Taken / skipped (with reasons) / conflicts, the new pins, and a reminder that
skills load at session start (restart Claude Code).
