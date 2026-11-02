---
name: teach
description: Teach Nika a technical subject as an interactive lesson page (hook question, mental model, SVG mechanism diagrams, steppers with code in sync, live figures to play with, predict-then-reveal quizzes, worked example then your turn, spaced recall), built into ~/.cache/nikabrain/learn and opened in the browser; run timed exams with a results log, grade practice tickets, and plan the next study step. Use when Nika asks to learn or understand a topic ("teach me X", "explain X to the core", "how does X really work", "make a lesson on X", "/teach", "/learn", "what lessons do I have"), wants to be tested ("exam", "test me", "quiz me on X"), asks "how did I do" / "what should I study next", or says "grade practice ticket NN".
---

# Teach: turn a subject into understanding

One lesson page per subject, built so Nika can *predict* the behaviour
(when will this re-render? where will this grid item land?), not just recite
it. Figures carry the explanation (skill `visual-explainer` draws them), the
teach kit makes them interactive, and the quizzes make Nika apply it.
`tutor` is for code Nika writes; `teach` builds the understanding first.

Helper: `node ~/projects/nikabrain/bin/learn.mjs` with `list`, `assemble <topic> <src>`,
`check <topic>`, `open <topic>`, `path <topic>`, and for exams `exams`, `exam <topic> [n]`,
`check-exam [topic]`, `hub`. Nika's learning method (from gigabrain) is
`learning/how-giga-learned.md`; the study order and the lab are `learning/tracks.md`.

## 0. No topic given

Run `learn.mjs list` (cached lessons) and suggest 3 topics from
`me/concepts.md` where Nika is at `—` or `seen`. Wait for the pick.

## 1. What to teach (one question batch, only if unclear)

Topic and depth ("first contact", "working knowledge", "to the core"), why now
(a bug Nika hit, an upcoming task: the examples come from that), and the
current level in `me/concepts.md`. Default: working knowledge, React/web context.

## 2. Facts first

- Send the `researcher` agent to current docs (react.dev, MDN, web.dev, the
  library's own docs) for anything version-sensitive. A lesson that teaches an
  outdated API is worse than none.
- **Fact pass:** list every claim the page will make, each with its source. A
  claim with no source is cut or marked "illustrative". Sources stay visible at
  the end of the page ([[fact-check-generated-knowledge]]).

## 3. Shape (the order is the point)

1. **Hook** (`data-hook`): one concrete question from real work plus a picture
   of the problem ("You type in the search box and the list flickers. Why?").
2. **Before you start** (`data-prereq`): what you need, 2–3 outcomes as verbs
   (predict, choose, debug), time needed, the review box.
3. **Mental model:** 5–8 plain sentences, each with its figure. Label moving
   parts with verbs (`renders`, `commits`, `schedules`, `cascades`).
4. **Mechanism step by step:** 2+ steppers where state visibly changes each
   step; real code beside the figure with the running lines lit.
5. **Play with it:** 1+ live figure (`data-sim`) with 1–3 controls (items in a
   list, viewport width, delay in ms) and a picture plus a number that react.
6. **Predict, then reveal** (`data-predict`) before each failure mode.
7. **Quizzes test use, not memory:** 8+ scenarios ("you see X in the
   profiler, what is the cause?"), decisions, tracing. Every wrong option is a
   real misconception with a `data-why`.
8. **Where it breaks:** the traps as small multiples (wrong code → symptom → fix).
9. **Worked example → your turn** (`data-fill` or `data-order`), then offer a
   `/tutor` exercise in Nika's real project.
10. **Recall** (`data-recall`): 3+ mixed quizzes, the review box, ≤ 7 lines to
    remember, the glossary, the sources.

For a CSS topic, the live figure can be real HTML/CSS inside the figure (a
flex container whose `gap` and `flex-wrap` the controls change), not only SVG.

## 4. Build and check

- Read `kit/CONTRACT.md` (the markup contract) and copy parts from
  `kit/example.html` (a small lesson that works). Write no stepper, quiz or
  tooltip code of your own; the kit has them. Write only the `teachSims` functions.
- Draw with `visual-explainer` (Paper register by default).
- Write the source to `~/.cache/nikabrain/learn/src/<topic>.html` (never into
  a repo), then `learn.mjs assemble <topic> <that file>` → `learn.mjs check <topic>`.
  Fix until it says PASS. Then look at it yourself: open the page with
  Playwright or `claude-in-chrome` at 390 px and desktop, light and dark, and
  check that labels are readable and nothing is clipped. Then `learn.mjs open <topic>`.
- Publish as an Artifact only when Nika asks (for example, to read it on a phone).

## 5. After the lesson

Update `me/concepts.md`: the topic moves to `seen`; to `explain` once Nika
answers the recall quizzes and explains it back unaided. A question that kept
tripping Nika → note it for `/retro`.

## 6. Exams ("test me", "exam", "/learn exam <topic>")

Exams are source data in `learning/exams/<topic>/vN.json` (contract `kit/EXAMS.md`).
- `learn.mjs exams` lists topics, variants and Nika's last score per variant.
- `learn.mjs exam <topic> [n]` opens the next variant Nika hasn't taken (local
  server on 127.0.0.1; results go to `me/exam-log.jsonl`). `learn.mjs hub` opens
  the page with every lesson and exam.
- No exams for the topic yet: write v1 (15 questions, scenario-based, snippets
  welcome, every wrong option a real misconception, refs to official docs), in
  the background if possible, then `learn.mjs check-exam <topic>` must PASS.
  Write more variants only after Nika has taken the earlier ones (use before collecting).
- Suggest **study** mode first (answers after each question), **exam** mode 3+
  days later (timed, scored at the end).

## 7. "How did I do?" / "what should I study next?"

Read `me/exam-log.jsonl`. Per topic: last score per variant, the weakest domain,
and the missed question ids (look up their `stem` and `explain` in the exam JSON).
Recommend **one** next step: a `/teach` section on the missed principle, a lab step
from `learning/tracks.md`, a practice ticket from `learning/practice/tickets.md`,
or the next variant. A passed exam in **exam** mode supports `explain` in
`me/concepts.md` for the concepts its domains cover; record it as evidence.

## 8. Practice tickets ("grade practice ticket NN")

Grade Nika's answer against `learning/practice/keys.md`: found / missed / false
alarms, and whether the most serious item was ranked first. Explain each miss in
≤ 5 lines with a small example. Never show the key before Nika has answered.

## Rules

- Correct beats pretty. Every claim traces to a doc or a run.
- One idea per figure, a verb on every arrow, state shown by shape and position, not colour alone.
- Never pad: 4 things taught well beat 20 listed.
