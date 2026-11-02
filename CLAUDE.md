# nikabrain: working inside the brain repo

This repo is Nika's brain with Claude: curated habits and patterns, the
skills/agents/hooks installed globally, the UI/React library, and the record of
how Nika grows. `brain/CORE.md` is already loaded (via `~/.claude/CLAUDE.md`).

## Who writes what

| Path | What | Written by |
|---|---|---|
| `brain/CORE.md` | always-on rules, ≤ ~100 lines | `/curate` (and Nika) |
| `brain/habits/`, `brain/patterns/` | one entry per file, memory frontmatter (`name` = file name, `description`, `metadata.type`) | `/retro`, `/curate` |
| `brain/coaching.md` | ≤ 5 focus bullets with dated evidence; the coach hook injects their steering lines | `/retro` |
| `brain/library-ledger.md` | confidence + evidence per library entry | `/retro`, `/curate` |
| `library/` | absorbed skills + checklists (see `library/README.md`) | `/absorb` + `bin/absorb.mjs` only |
| `global/` | skills, agents, hooks, linked into `~/.claude` by `bin/install.mjs` | edit here, never in `~/.claude` |
| `learning/` | method (`how-giga-learned.md`, `playbook.html`), `tracks.md`, `exams/<topic>/vN.json`, `practice/` | Claude (skill `teach`), Nika |
| `me/` | profile, roadmap, concepts, scorecard, journal, `exam-log.jsonl` (written by `learn.mjs exam`) | `/retro`, `/curate`, Nika |
| `memory/<project>/` | own projects' auto-memory | auto-memory |
| `inbox/` | gitignored, untrusted: signals, session pointers, candidates | hooks, `/retro` |

## Commands

```bash
node bin/selftest.mjs        # or: node --test bin/selftest.mjs (temp dirs only, ~3 s)
node bin/doctor.mjs          # install + budget + frontmatter + library consistency
node bin/doctor.mjs --repo   # repo checks only
node bin/secret-scan.mjs --all
node bin/absorb.mjs status
node bin/learn.mjs check-exam   # after writing or changing an exam
```

## Rules for this repo

- Changing anything in `global/hooks/` or `bin/`: `node --test bin/selftest.mjs`
  must pass. A fixed bug gets a selftest case with a dated comment. Guard
  changes need both a dangerous case and an innocent lookalike.
- Changing skills, agents or library: `node bin/doctor.mjs --repo` must show 0
  errors. Skills and agents load at session start: say which sessions need a restart.
- Never hand-edit `library/skills/`: add a `replace` rule to `library/sources.json`
  and run `node bin/absorb.mjs pull <source>`.
- Tooling is Node with no dependencies, and must run on Windows (Git Bash and
  PowerShell 5.1). `brain/patterns/tooling-runs-on-windows.md`.
- Before handover: `node bin/secret-scan.mjs --all`.
- Changes to `~/.claude` go through `bin/install.mjs`, which Nika runs.
- Pruning counts as progress. A smaller CORE.md that says the same thing is better.
