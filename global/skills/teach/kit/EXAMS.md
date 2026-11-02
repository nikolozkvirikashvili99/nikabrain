# Exams: data contract (teach kit)

Ported from gigabrain, where timed exams plus a results log were what turned
"I read the lesson" into "I can predict it". Each topic has up to five variants:
`learning/exams/<topic>/v1.json` … `v5.json`. They are source data, so they live
in the repo. `node bin/learn.mjs exam <topic> [n]` starts a local server
(127.0.0.1 only), renders the variant with `exam.html`, and appends every
finished attempt to `me/exam-log.jsonl`. `node bin/learn.mjs check-exam <topic>`
enforces everything below. A variant that fails the check does not ship.

## Purpose

Exams test **whether Nika can predict and choose**: what renders, where the
box lands, which hook, what breaks first, what to change. A short snippet
(≤ 25 lines, in `code`) is welcome and usually the point: "what does this
component show after the click?" Never syntax trivia or API names for their
own sake.

## Shape

```json
{
  "topic": "react-core", "variant": 1, "of": 5,
  "title": "React core: rendering, state and effects (variant 1)",
  "description": "One sentence: what this variant leans on.",
  "minutes": 20, "pass": 0.7,
  "domains": [{"id": "rendering", "name": "When and why components render", "weight": 0.3}],
  "questions": [{
    "id": "react-core-v1-q01", "domain": "rendering",
    "stem": "Scenario in 2–6 sentences. `inline code` and **bold** allowed. Ends with the question.",
    "code": "optional snippet, plain text",
    "options": [
      {"text": "…", "correct": true,  "why": "Why this is right, 1–2 sentences."},
      {"text": "…", "correct": false, "why": "Why it is tempting, and why it is wrong here."}
    ],
    "explain": "The principle behind the answer, 2–5 sentences; what to remember.",
    "refs": ["https://react.dev/…"]
  }]
}
```

## Rules (checked)

- **Counts.** 15 questions, `minutes` 20, `pass` 0.7.
- **Domains.** 3–5, weights sum to 1; every question's `domain` is one of them; each domain has 2+ questions.
- **Single answer:** exactly 4 options, 1 correct. **Multiple response:** 5–6 options, 2–3 correct,
  and the stem ends with "(Choose two.)" or "(Choose three.)" matching the count. 0–3 per variant.
- **Every option has a `why`** (20+ characters). `explain` is 60+ characters. `refs`: 1+ per question,
  official docs (react.dev, MDN, web.dev, w3.org) first.
- No "all of the above", "none of the above", "both A and B". Options don't refer to letters (the runner shuffles).
- **No giveaways:** the correct option is the longest one in at most 40% of single-answer questions.
- **No repeats:** ids unique; no stem shared with another question in any variant of the topic.
- **Scenarios, not recall:** at most 20% of stems may be definition questions ("What is…").
- Facts come from official docs. If unsure, drop the question
  ([[fact-check-generated-knowledge]]: in gigabrain 5–17% of generated claims were wrong
  until a checker pass fixed them).
