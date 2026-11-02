---
name: debug-protocol
description: Structured debugging. Reproduce first, state expected vs actual, rank hypotheses, test the cheapest discriminating one, make the smallest fix, prove it. Use whenever Nika reports something broken ("not working", "help me fix this", "still failing", a pasted error, console output or stack trace, "it worked yesterday", "the page is blank", "it renders twice"), before proposing any fix.
---

# Debug protocol

Fixing before reproducing is how a session turns into five rounds of "still
not working".

1. **Restate** in two lines: *expected* vs *actual*, and what changed since it
   last worked. Ask only if you can't find out yourself (`git log/diff`,
   `package.json` and lockfile changes, env files, the dev server output).
2. **Reproduce** it yourself with something you can rerun: a failing test,
   `npm run build`, a Playwright script that loads the page and prints console
   errors, or a `curl` for the API underneath. If you can't reproduce it, that
   is the finding: say what differs between your environment and Nika's.
3. **Hypotheses:** list 2–4, ranked by likelihood and cost to test. Pick the
   test that *distinguishes* between them, not the one that confirms your
   favourite. Common frontend suspects, to check rather than assume:
   - stale closure (effect, interval or handler holding an old value)
   - effect dependencies (missing → stale; object/array literal → loops)
   - StrictMode double-invoke in dev (effects without cleanup)
   - key problems (index keys, keys that change every render)
   - state mutated in place instead of replaced
   - hydration mismatch (SSR: `Date`, `Math.random`, `window` in render)
   - CSS: specificity or cascade-layer order, a stacking context trapping `z-index`, `overflow: hidden` clipping, a flex item missing `min-width: 0`
   - the network: CORS, a wrong env var (`VITE_` prefix missing), a cached response
4. **Smallest fix** at the root cause. If the root cause is upstream (API,
   config, a library bug), say so; don't patch the symptom.
5. **Prove it:** rerun the step-2 reproduction and show it green. Then check one
   neighbour the fix could have broken (another caller, the mobile layout,
   the empty or error state).
6. **Leave a trace** if it was non-obvious: a `/retro` candidate line
   ("pattern: <symptom>, caused by <cause>, fixed by <fix>").

When Nika's report is a bare "help me fix this" plus a paste, still run the
protocol, and end with one 💡 line showing what a hypothesis-led report would
look like ("Expected X, got Y, since Z changed; I suspect W").
