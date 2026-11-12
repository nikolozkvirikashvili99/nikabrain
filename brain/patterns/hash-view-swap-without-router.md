---
name: hash-view-swap-without-router
description: Swapping whole views on `#hash` in React without a router needs three things done by hand - a decode that can't throw, scroll after render, and focus restored to where the user came from.
metadata:
  type: feedback
---

**In short:** a `useSyncExternalStore` hook on `hashchange` is enough routing for a small
site, but you now own what a router did for you.

1. **Decode safely.** `decodeURIComponent('%')` throws `URIError`. Thrown during render with
   no error boundary, a truncated shared link blanks the whole page. Wrap it in try/catch and
   fall back to the default view.
2. **Scroll after render.** The browser's jump-to-`#anchor` fires before React swaps the
   content in, so it misses. In an effect keyed on the view id: `scrollTo(0, 0)` when a
   detail view opens, `getElementById(id)?.scrollIntoView()` when returning to a section.
   Guard the id first (`'' && …` returns `''`, not a function call).
3. **Move focus both ways.** Opening: focus the new view's `h1` (`tabIndex={-1}`).
   Returning: the h1 unmounts and focus drops to `<body>`, so the next Tab starts at the top
   of the page. Remember the last view in a ref and focus its card/link on the way back
   (`focus()` also scrolls it into view).

**Why:** 2026-11-12, an album gallery built this way. A background `reviewer` caught 1 and 3
before commit; a test caught the `''` crash in 2. All three got a failing test first.

**How to apply:** jsdom has no scrolling. Stub `scrollTo`/`scrollIntoView` in test setup,
then `vi.spyOn` them in the routing test, or deleting the effect still passes. Test focus
with `toHaveFocus()` after dispatching a `HashChangeEvent` inside `act`.

**Signal:** "open as its own page", "make the link shareable", "Back should work", and no router installed.

**Next time:** write the malformed-hash test and the focus-on-return test together with the hook.

Related: [[steer-parallelism-and-agent-roles]], [[test-guards-against-innocent-lookalikes]]
