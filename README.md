# nikabrain

Nika's brain for working with Claude Code: a small, frontend-focused version
of a friend's `gigabrain`. It keeps gigabrain's *operating system* (the
learning loop, the coaching, the guard rails, the habits that proved
themselves) and drops everything that was about another person's projects,
clients and backend stack. On top of that it adds the React / HTML / CSS / UI
knowledge Nika works with every day.

It does three jobs:

1. **Makes every Claude session smarter**, in any project, by loading a short
   set of habits (`brain/CORE.md`) and a library of UI and React skills everywhere.
2. **Learns from every session** without collecting junk. `/retro` turns real
   corrections into brain entries; `/curate` keeps the brain small.
3. **Teaches and measures growth**: `/tutor` (you write the core), `/teach`
   (interactive lesson pages), timed exams with a results log, a practice gym,
   a step-by-step React lab, a concept ladder, a scorecard and a journal.
   **Start with `learning/playbook.html`** (how giga learned fast, as a visual page).

## Install (once per machine)

```powershell
cd ~/projects/nikabrain
node bin/install.mjs            # dry run: shows exactly what would change
node bin/install.mjs --apply    # do it (backs up anything it replaces)
node bin/doctor.mjs             # should say 0 errors
```

Then restart Claude Code. To undo: `node bin/install.mjs --uninstall --apply`.
Requires Node (any recent version) and Git; Python 3 only for `ui-ux-pro-max`'s search script.

## How it fits together

| When | What runs | What it does |
|---|---|---|
| Every session | `~/.claude/CLAUDE.md` → `@brain/CORE.md` | the always-on habits (≤ ~100 lines) |
| Every prompt | coach hook (`global/hooks/coach.mjs`, regex only, no model call) | cues: missing done-line, UI change without a visual check, bug report without a hypothesis, research → `researcher`; your coaching focus once per session |
| Every Bash/PowerShell call | guard hook (`global/hooks/guard.mjs`) | blocks `--no-verify`; asks before `rm -rf src`, `reset --hard`, force push, `taskkill /IM node.exe`, `npm publish`, prod deploys |
| Session start | guard hook | injects this repo's `handoff.md` (what worked, what failed, next step) |
| Session end / compaction | session-log hook | records where the transcript is, so `/retro` can catch up on sessions you didn't retro |
| End of a session: `/retro` | skill | lessons → `brain/`, coaching, concepts, scorecard, journal; secret scan; commits nikabrain |
| Weekly: `/curate` | skill | prune, merge, confirm or drop inherited habits, re-score monthly, health checks |
| Outside knowledge: `/absorb` | skill + `bin/absorb.mjs` | refresh the public skills from upstream, pinned and licence-checked |

## Commands you'll use

| Command | When |
|---|---|
| `/retro` | end of any meaningful session (2 minutes) |
| `/curate` | weekly |
| `/build-loop` | "build this until it works, don't keep asking me" |
| `/debug-protocol` | anything broken |
| `/tutor` | you want to write the core yourself (a hook, a reducer, a layout) |
| `/teach <topic>` | "teach me how X really works": an interactive lesson page |
| `node bin/learn.mjs exam <topic>` | a timed exam; then ask "how did I do?" |
| "grade practice ticket NN" | Claude scores your answer to a `learning/practice` ticket |
| `/onboard-project` | first session in a repo without a CLAUDE.md |
| `/absorb` | pull upstream improvements into `library/` |
| agents `reviewer`, `ui-reviewer`, `verifier`, `researcher` | code review · design/a11y review of a visible change · prove a fix by rerunning it · cited answers from live docs |

UI work routes through the library: `ui-ux-pro-max` (design systems via a
local search script), `frontend-design`, `web-design-guidelines`,
`react-best-practices`, `composition-patterns`, `react-patterns`,
`react-testing`, `e2e-testing`, `accessibility`, `make-interfaces-feel-better`,
`react-view-transitions`. The full table is in `library/README.md`.

## Layout

| Path | Purpose |
|---|---|
| `brain/` | curated knowledge: `CORE.md` (always loaded), `habits/` (how we work), `patterns/` (technical gotchas), `coaching.md`, `library-ledger.md` |
| `global/` | installed into `~/.claude`: skills, agents, hooks |
| `library/` | public skills + review checklists, pinned upstream (`sources.json`, `NOTICE.md`) |
| `learning/` | the learning system: `playbook.html`, `how-giga-learned.md`, `tracks.md` (+ the taskboard lab), `exams/`, `practice/` |
| `me/` | you: `profile.md`, `roadmap.md` (the `Now:` step), `concepts.md`, `scorecard.md`, `journal/`, `exam-log.jsonl` |
| `ai-craft/` | working-with-Claude drills and the prompt log |
| `memory/` | auto-memory of your *own* projects (`autoMemoryDirectory`), versioned here |
| `labs.md` | every connected project and where its memory lives |
| `inbox/` | gitignored: coach signals, session pointers, lesson candidates |
| `bin/` | `install`, `doctor`, `selftest`, `secret-scan`, `brain-commit`, `learn`, `absorb`, `signals-report` (all Node, no dependencies) |

## What came from gigabrain, and what didn't

| Kept (adapted) | Dropped |
|---|---|
| the learning loop: `/retro`, `/curate`, the four-part bar, soft pruning, the library confidence ledger | all project memory, client/employer notes, the journal, scorecard and coaching evidence (they're about your friend's work) |
| *how* giga learned (journal, coaching evidence, prompt log, measurements) distilled into `learning/how-giga-learned.md` + `playbook.html` | the backend study topics and their 1,225 exam questions (Kafka, AWS, Nest, Postgres…) |
| exams (runner, contract, checker, results log), the practice gym idea (trap tickets, review mode), labs-as-tracks | Python `bin/learn`, `bin/practice`, `bin/proof` (re-done in Node where useful) |
| skills `build-loop`, `debug-protocol`, `tutor`, `teach` (+ its interactive kit), `onboard-project`, `absorb` | backend/infra/AWS/Kafka/Go/Python/homelab/video skills, 1,300 eval fixtures, the knowledge exams |
| agents `reviewer`, `verifier`, `researcher` (+ new `ui-reviewer`) | `intent-reviewer` and its evals, the per-stack `kit` system, the statusline |
| hooks: coach, guard, session-log (rewritten in Node for Windows) | the Python/bash/zsh tooling and macOS-specific patterns |
| 8 habits (marked `inherited` until your sessions confirm them), 35 technical patterns relevant to JS/npm/frontend/Claude tooling | patterns about databases, deploy pipelines, VPNs, APM tools |

Evidence inside inherited entries is gigabrain's, and is labelled that way.
Your own evidence starts with your first `/retro`.

## Privacy

nikabrain has no remote yet. If you push it to GitHub, keep it **private**: it
will hold your journal and project notes. Employer and client facts never go
in (CORE rule); add their names, one per line, to `.githooks/private-terms`
(gitignored), and the pre-commit scan will block any commit that mentions them.
