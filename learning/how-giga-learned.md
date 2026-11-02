# How giga learned fast, and how Nika uses it

Distilled from gigabrain's journal (about 70 session lines, 2026-10-02 → 10-30), its coaching
evidence, prompt log, roadmap and measurements. Client and employer facts are left
out; only the *method* is kept, translated to frontend and React. The visual version
of this page is `learning/playbook.html` (open it in a browser).

**The one-sentence version:** giga learned fastest when real work was the
classroom, Claude explained with a picture first, he was quizzed until he could
*predict* the behaviour, and every claim had to be proven, not believed.

---

## 1. The loop that worked (do this every week)

```
 real task ──► lesson (visual) ──► exam / quiz ──► you write the core ──► proof ──► /retro
     ▲                                                                              │
     └──────────── next task picks the weakest concept from me/concepts.md ◄────────┘
```

| Step | What giga did | Nika's version |
|---|---|---|
| 1. Real task | Every lesson came from a ticket he was actually working on. | Pick the concept from today's React/CSS task, not from a tutorial list. |
| 2. Lesson | `/teach` page: a hook question, a diagram, steppers, a live figure. | `/teach react-rendering`, `/teach css-grid`. Visual first, words second. |
| 3. Exam | Timed exams, 5 variants per topic, results logged; Claude read the log to pick what to study next. | `node bin/learn.mjs exam react-core`. Study mode first, exam mode a few days later. |
| 4. Write the core | `/tutor`: Claude scaffolds and tests, *you* write the important lines. Hints, not code. | Write the hook, the reducer, the grid yourself. |
| 5. Proof | Red test → green, before/after numbers, screenshots. | Screenshot at 390 px + desktop, a passing test, a profiler number. |
| 6. Retro | 2 minutes: one journal line, concept level moved only on evidence. | `/retro` at the end of every real session. |

## 2. Patterns that made him faster (each one seen in his sessions)

### Learning

1. **The concept ladder: seen → explain → build → teach.** A level goes up only
   with evidence ("explained unaided on 10-20", "wrote it, tests green"). Reading
   about something is only *seen*. This stopped him fooling himself.
2. **One analogy, then the real thing.** Networking finally clicked through *one*
   building analogy (rooms = private IPs, front door = port forward), after which he
   reasoned on his own ("won't we need port 22 for CI?"). One analogy per idea,
   never a different one for every section.
   *Nika:* "the render is a photo, the commit is printing only the changed parts".
3. **Predict, then reveal.** Lessons ask "what happens?" *before* showing it. A
   wrong guess teaches more than a right answer read off the page.
4. **Spaced review: 1, 3, 7, 21, 60 days.** The teach kit's review box schedules
   missed questions. Five minutes of review beats an hour of rereading.
5. **Plain words first.** His standing request: "simplify and help me
   understand". Ask for the 3-line version before the detailed one.
6. **Learn from the bug you just had.** His best lessons were things that broke at
   work (a UI-only permission check, a race between two requests). The bug is the
   hook question of the next lesson.
7. **Write the core yourself.** gigabrain's own audit found "Giga hasn't coded in
   any logged session" and made it a roadmap phase. Letting Claude write everything
   feels fast and teaches nothing. Rule: the 5–20 lines that *are* the concept,
   you type.

### Working with Claude (this is where most of his measured gain came from)

8. **The done-line.** The biggest measured win: prompts with "done when…" went
   from 10% to 62%. Shape: *"Done when <what you'll see> on <where>; allowed / ask
   first: …"*. Without it Claude picks the finish line.
9. **"Are you 100% sure?"** His best challenge question. Several times it turned
   a guess into a 3-minute measurement and changed the answer. Variant: *"how did
   you assume that?"* when Claude sounds confident. Ask it before you trust anything
   outward (a PR, a message to your lead).
10. **Bug reports in four parts.** Expected / actual / what changed / my guess.
    "What changed" alone found bugs fastest.
11. **State the boundaries up front.** "Local only", "don't push", "don't touch
    X's files". Each one said in the first prompt removed whole rounds of questions.
12. **Ask for the gate's text, don't guess.** Two wasted commits came from guessing
    what a CI check wanted. Paste the real error or the real lint rule.
13. **A background reviewer catches what tests can't.** Reviews found a
    privilege-escalation path, leaked URLs and false README claims, all with green
    tests. For UI: `ui-reviewer` after every visible change.
14. **One goal per session.** Unrelated work got its own session (and repo). Mixed
    sessions produced worse answers and messier memory.
15. **Match the team's format.** PR and ticket text written in the team's length
    and style, not AI essays. Show Claude a real PR from your team as the template.

### Measuring

16. **Measure, don't feel.** Monthly scorecard (11 dimensions, 0–10), filled from
    real prompts. A finding that changed his plan: he'd installed 54 library skills
    and used 0 in real work, so the rule became *add knowledge on demand only*.
17. **Claude already knows the facts; your edge is judgement and proof.** His
    biggest experiment (414 graded runs): plain Claude already answered 159/162
    stack-knowledge questions. The brain's value was *process*: reproduce first and
    review lifted results from 0/3 to 3/3. So don't memorise APIs: train predicting,
    choosing, debugging and verifying.
18. **Generated knowledge needs checking.** Fact-checking AI-written study material
    fixed 5–17% of claims. Every lesson keeps its sources; exams cite docs.
19. **A rule that failed twice becomes a hook.** Reminders don't hold; automation
    does (format on save, no `--no-verify`, a screenshot before "done").
20. **Pruning is progress.** His always-on context went from 5.4k to 3.2k tokens
    with nothing lost. A shorter note you actually read beats a long one you don't.

### Pace

21. **A small, fixed budget with due dates.** ~3 h/week outside work, phases with
    a date and a proof, one `Now:` line shown at the start of every session.
22. **Firm coaching.** He asked to be pushed. The coach hook adds one cue per
    prompt (missing done-line, no visual check, no hypothesis). One cue, not a lecture.

## 3. What giga got wrong (skip these)

- **Collecting instead of using.** 54 skills, 1,225 exam questions, 9 lessons:
  much of it unused for weeks. Build a lesson or exam only when a real task needs it.
- **Letting Claude code everything.** See pattern 7.
- **Big autonomous runs with no stop rule.** One overnight run cost $54 for a 5%
  gain. Give long jobs a budget and a done-line.
- **Asking for certainty again and again.** "100% sure?" asked five times rebuilt
  the same answer five times. The fix was a *scope rule* in the first prompt
  ("every caller across all repos"), then one check.
- **Theory without a lab.** Concepts stayed at *seen* until he built the step.

## 4. Nika's starter week (about 3 hours)

| Day | 30–45 min |
|---|---|
| 1 | Open `learning/playbook.html`. Take `react-core` v1 in **study** mode. |
| 2 | `/teach` the concept you missed most (Claude reads `me/exam-log.jsonl`). |
| 3 | Lab step 0 from `learning/tracks.md` with `/tutor` (you write the core). |
| 4 | Real work: one prompt with a done-line + "show me 390 px and desktop". `/retro`. |
| 5 | One practice ticket from `learning/practice/tickets.md`. |
| 7 | `css-layout` v1 in **exam** mode. Review box due items. |

Then repeat with the next weakest concept. After ~2 weeks, `/curate` gives the
first scorecard numbers.
