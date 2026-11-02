---
name: retro
description: End-of-session learning. While the whole session is still in context, extract what's reusable, apply it to the nikabrain brain (habits, patterns, coaching focus, concepts, scorecard, journal, prompt log, library ledger), secret-scan, commit nikabrain, and give Nika one concrete thing to do better next time. Use when Nika says /retro, "wrap up", "what did we learn", "save session knowledge", or signs off ("that's it for today", "done for today", "good session"), even in a fresh session, since sessions.jsonl lists the sessions it missed.
---

# Retro: learn from this session, update the brain, commit

This skill is the learner. It runs in-session, so it has the full context,
and Nika is present when it commits. `N` = `~/projects/nikabrain`.

## 1. Gather (silently)

- **This session:** Nika's prompts, corrections, frictions, what worked, any
  concept Nika engaged with (asked "why", wrote code in `/tutor`, answered a
  `/teach` quiz).
- `N/inbox/*.md`: older candidates; fold them in.
- `N/inbox/signals.jsonl`: coach-hook flags per prompt (`no_done`,
  `debug_no_hypothesis`, `multi_task`, `research`, `big_spec`, `vague`,
  `ui_no_visual`). Count only rows newer than the last row of the
  `me/scorecard.md` session table. `node N/bin/signals-report.mjs` gives the
  monthly rates.
- `N/inbox/sessions.jsonl` (hook `session-log.mjs`): sessions since the last
  retro commit (`git -C N log -1 --format=%cI -- me/journal`). For each one
  with no `/retro` of its own, skim its `transcript` for Nika's corrections
  and failures only (Nika's prompts plus `is_error` tool results; never the
  whole file; see [[reading-claude-transcripts]]). Say "caught up on N missed
  sessions". Skip any whose transcript is gone.

## 2. Apply the bar, then write

Each lesson must be **reusable · evidenced · behaviour-changing · new** (CORE).
Usually 0–3 survive. If none do, still do steps 3–5.

**Prove "new" before writing.** For each candidate run
`grep -ril '<2-3 key terms>' N/brain N/library/checklists` and show the hits.
Then one verdict per candidate: **Save** (new file) · **Absorb into
[[existing]]** (add the new evidence under that entry; same root cause = same
entry) · **Drop** (one-off, already covered, or not evidenced). Absorb beats
Save whenever the root cause matches.

**Inherited entries** (`status: inherited` / `origin: gigabrain`): when this
session confirms one, change its status to `confirmed <date>` and add the
evidence line. When Nika contradicts it, rewrite it to Nika's way or move it
to `brain/_attic/` (soft prune, see `/curate`), and say so.

**Entry shape** (memory frontmatter: `name`, `description`, `metadata.type`):
the rule, `**Why:**`, `**How to apply:**`, `**Signal:**` (what shows it
applies), `**Next time:**` (the concrete action), `[[links]]`.

| Lesson | Write to |
|---|---|
| how Nika and Claude should work | `brain/habits/<slug>.md`; one CORE line only if it should shape *every* session |
| reusable technical decision / gotcha (a React, CSS or tooling trap) | `brain/patterns/<slug>.md` |
| a prompt that went notably badly or well | `ai-craft/prompt-log.md` (before → after → why) |
| a concept Nika engaged with | `me/concepts.md` (raise a level only on evidence: built it = build, explained it unaided = explain) |
| something about Nika as a developer (preference, strength, gap) | `me/profile.md` |
| project-only fact | that project's memory (see below), not the brain |
| a library skill or checklist was used | `brain/library-ledger.md` (below) |

**Library evidence.** For each `library/` skill used, or checklist a reviewer
loaded, append one dated, generalised line to its ledger row and move its
confidence: advice held up **+0.1**; wrong or outdated **−0.2** and append
`needs-edit: <what>`; the project's own convention rightly won **0**
(evidence line only). Used but not really tested by the work: no line.

**Project memory and handoff.** Project facts go to the project's memory dir:
its `.claude/settings.local.json` `autoMemoryDirectory` if set (own projects:
`N/memory/<project>/`), else `~/.claude/projects/<slug>/memory/`. **Work
(employer/client) projects always stay local.** When work is unfinished, write
`handoff.md` there (overwrite your own), first line the repo id:

```
repo: <output of `git rev-parse --path-format=absolute --git-common-dir`>
updated: YYYY-MM-DD
## Worked (each with: confirmed by <test/build/screenshot>)
## Failed: do not retry (each with the exact reason)
## Not tried yet
## Next step (one, concrete)
```

The guard hook injects it at the next session start in the same repo. Unproven
items go under "Not tried". ≤ 40 lines. Delete it when the work is finished.

**Never write into nikabrain:** secrets, personal data, or employer/client
internals (product names, URLs, schemas, code). Generalise ("a stale closure
in a `setInterval` callback kept the first value") or drop it.

## 3. Update the coaching loop

- `me/scorecard.md`: append one row to the session table (date, project kind,
  the signal counts).
- `brain/coaching.md` is what the coach hook injects. Keep **≤ 5 bullets**,
  each a weakness Nika is working on, with dated evidence lines. Add a dated
  evidence line to the bullet this session touched. Retire a bullet once Nika
  has shown the better behaviour ~3 sessions running (say so: that's a win);
  add one when a new weakness repeats. A bullet that never moves means the
  coaching isn't working, so change its wording.
- `me/roadmap.md`: if this session showed a phase's proof, set Status to
  `done <date>` and move `**Now:**` to the next concrete step. No proof, no tick.
- `me/journal/YYYY-MM-DD.md`: append one line: what Nika learned or decided.

## 4. Commit nikabrain (pre-approved; nikabrain only)

Commit **exactly the files you wrote in this retro**:

```bash
node ~/projects/nikabrain/bin/brain-commit.mjs "brain: <what was learned, ≤ 60 chars>" brain/habits/x.md me/scorecard.md ...
```

The helper refuses paths outside `brain/ me/ ai-craft/ memory/`, refuses if
anything else is already staged, runs the secret scan, and pushes only if the
branch has an upstream and nothing else of Nika's is unpushed. Exit 1 =
blocked: fix the wording, never `--no-verify`. Exit 2 = nothing to commit.

## 5. Coach Nika (the reply, ≤ 12 lines)

1. **Learned:** one line per thing that went into the brain (path).
2. **Went well:** one concrete thing Nika did that helped. Keep doing it.
3. **One upgrade:** rewrite one of Nika's *actual* prompts from this session.
4. **Feature you could have used:** the exact moment a subagent, worktree,
   plan mode, `/tutor`, a screenshot check or a hook would have paid off.
5. **Concept:** if one moved in `me/concepts.md`, say which and why.
6. The commit hash, and whether it was pushed.
