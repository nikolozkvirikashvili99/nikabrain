---
name: interview-then-autonomous-loop
description: Ask every question up front in one batch, write checkable acceptance criteria, get one approval, then build/test/debug alone until every criterion passes.
metadata:
  type: feedback
  status: confirmed 2026-11-02 (batch → one approval worked; question format adapted, see below)
---

**Rule:** front-load all interaction. One question batch (`AskUserQuestion`,
up to 4 per round), acceptance criteria that a command can check, one OK.
Then iterate silently until green. Skill `build-loop` runs this end to end.

**Why:** in the source brain, clicking "yes" 20–30 times per feature was the
single most disliked thing about working with Claude; it makes the human the
bottleneck for decisions Claude could make.

**How to apply:** never spend a question on something the code can answer
(package manager, test runner, existing component). Interrupt mid-loop only
for something destructive or outward-facing that wasn't approved, a criterion
that turns out impossible, or a hard outside blocker (login, credential).
Never weaken a check to make it pass.
**Exception:** a same-day deadline: skip the batch, open with
"Done when …; assumed …" and build; Nika corrects afterwards.

**Question format for Nika:** if the `AskUserQuestion` dialog is rejected,
don't re-open it. Ask the same batch as a numbered plain-text list with
lettered options and one "use defaults" escape. Nika answers in one line.

**Evidence:** 2026-11-02, learning-plan session: the dialog was rejected twice
("go back"); the same 3 questions as a plain list got a one-line answer
("1 … 2 b 3 b"), then one plan approval and the edits ran without further asks.

**Signal:** "build", "make", "until it works", "just get it done".
**Next time:** first reply = question batch + proposed "Done when" as the recommended option.

Related: [[argued-recommendations]]
