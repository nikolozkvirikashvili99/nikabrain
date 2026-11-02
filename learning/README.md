# learning/: how Nika gets better, fast

Everything here was ported from gigabrain's learning system (lessons, exams, a
practice gym, step-by-step labs, the coaching that measurably moved giga) and
rewritten for a frontend + React developer who learns best visually.

**Start here:** open `playbook.html` in a browser (double-click it). It is the
visual version of `how-giga-learned.md`.

| File | What it is | Use it |
|---|---|---|
| `playbook.html` | one visual page: the weekly loop, the concept ladder, 12 habits, prompt shapes, a starter week | read once, come back when stuck |
| `how-giga-learned.md` | the same method in text, with the evidence behind each pattern | Claude reads it when planning your learning |
| `tracks.md` | 5 frontend tracks in order + the `taskboard` lab (13 steps, one concept each) | `/tutor taskboard step N` |
| `exams/<topic>/vN.json` | timed exams (15 scenario questions, explanations, doc links) | `node bin/learn.mjs exam react-core` |
| `practice/tickets.md` | 9 tickets with a trap: review a teammate's PR, or build it | do one, then "grade practice ticket 03" |
| `practice/keys.md` | answer keys for Claude | don't open before you answer |

Lessons themselves (`/teach <topic>`) are built on demand into
`~/.cache/nikabrain/learn/` and never stored here: the cache can be deleted, and
a lesson is rebuilt when you ask for it again.

## Commands

```powershell
node bin/learn.mjs hub                 # every lesson + exam with your last scores, in the browser
node bin/learn.mjs exams               # same, in the terminal
node bin/learn.mjs exam react-core     # next variant you haven't taken
node bin/learn.mjs exam css-layout 1   # a specific variant
node bin/learn.mjs check-exam          # validate all exam files (Claude runs this after writing one)
node bin/learn.mjs stop                # stop the local server (it also stops after 2 h idle)
```

Results are appended to `me/exam-log.jsonl`. Ask Claude "how did I do?" and it
reads the log, finds your weakest area, and picks one next step.

## Exams so far

| Topic | Variants | Covers |
|---|---|---|
| `react-core` | v1 | rendering, state snapshots, effects, keys and identity |
| `css-layout` | v1 | cascade and layers, box model and stacking, flexbox, grid and responsive sizing |

More variants (up to 5 per topic) and new topics get written when you've used
the existing ones. That's giga's "use before you collect" lesson.
