---
name: interview-then-autonomous-loop
description: Ask every question up front in one batch, write checkable acceptance criteria, get one approval, then build/test/debug alone until every criterion passes.
metadata:
  type: feedback
  status: confirmed 2026-11-02, re-confirmed 2026-11-03 (plain-text batch is now the default for Nika)
---

**Rule:** front-load all interaction. One question batch (plain text for Nika,
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

**Question format for Nika: plain text first.** Don't open the
`AskUserQuestion` dialog at all; ask the batch as a numbered plain-text list
with lettered options, the recommended one marked, and a "defaults" escape.
Nika answers in one line.

**Mid-loop redirect:** when Nika sends a new direction while the loop runs,
stop making tool calls and answer it first (or ask "pause or keep going?").
Don't carry on building alongside it.

**Evidence:** 2026-11-02, learning-plan session: the dialog was rejected twice
("go back"); the same 3 questions as a plain list got a one-line answer
("1 … 2 b 3 b"), then one plan approval and the edits ran without further asks.

2026-11-03, photo-portfolio session: the dialog was rejected a 3rd time; the
same 4 questions in plain text got "1 a 2a 3a 4a" plus the real goal ("a
photograph web site for my wife"). Later, Claude kept building after a long
mid-turn message about learning; the next tool call was rejected and Nika
asked to pause ("remember this and do it later").

**Signal:** "build", "make", "until it works", "just get it done".
**Next time:** first reply = question batch + proposed "Done when" as the recommended option.

Related: [[argued-recommendations]]
