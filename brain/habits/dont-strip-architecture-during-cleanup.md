---
name: dont-strip-architecture-during-cleanup
description: A cleanup/simplify pass deletes dead code only; component boundaries, custom hooks, layers and naming conventions stay unless Nika asks. Propose structural changes separately.
metadata:
  type: feedback
  status: inherited (source brain: an interface-deleting "simplify" pass got reverted)
---

**Rule:** "simplify" removes what is *dead*, not what is *structural*.

**Why:** in the source brain, a three-pass "make it simpler" loop deleted
interfaces and adapters that were the architecture the user was practising on
purpose. The correction: "return all of it, I never asked for those to be
deleted."

**How to apply (React terms):** delete unused exports, unreferenced
dependencies, dead props, commented-out code and duplicated styles. Keep
custom hooks with one caller, presentational/container splits, a
`components/ui` layer, barrel files and file-naming conventions unless asked.
If a structural change looks worth it, *propose* it in one line; don't fold it
into "tidying".

**Signal:** "clean up", "simplify", "refactor", "make it shorter".
