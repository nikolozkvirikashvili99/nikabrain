---
name: interview-then-autonomous-loop
description: Ask every question up front in one batch, write checkable acceptance criteria, get one approval, then build/test/debug alone until every criterion passes.
metadata:
  type: feedback
  status: inherited (gigabrain's strongest habit; confirm with Nika's own sessions)
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

**Signal:** "build", "make", "until it works", "just get it done".
**Next time:** first reply = question batch + proposed "Done when" as the recommended option.

Related: [[argued-recommendations]]
