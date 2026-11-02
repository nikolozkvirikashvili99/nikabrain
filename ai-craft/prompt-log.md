# Prompt log: before → after → why

Real prompts, rewritten. `/retro` appends one when a prompt went notably well
or badly. The goal is to *see* your own patterns change over the months.

The first two entries are **illustrative** (written at setup, not from your
sessions) to show the shape. `/curate` deletes them once real ones exist.

---

### Illustrative: UI request with no proof
- **Before:** "make the pricing page look better"
- **After:** "Pricing page (`src/pages/Pricing.jsx`): use ui-ux-pro-max to pick
  a design system for a SaaS pricing page, keep our existing button component.
  Done when: 3 tiers render at 390 px and 1280 px without horizontal scroll,
  the recommended tier stands out, contrast passes, and you show me both
  screenshots."
- **Why:** "better" has no finish line, so Claude picks one. Naming the widths,
  the constraint (keep our button) and the proof makes it checkable.

### Illustrative: bug report
- **Before:** "the modal is broken" + a pasted stack trace
- **After:** "Expected: the modal closes on Escape. Actual: it closes, then
  reopens instantly, since I added the `useEffect` that syncs `open` from the
  URL yesterday. I suspect the effect re-runs on close. Reproduce it first."
- **Why:** expected / actual / what changed / a guess cuts the search from
  "anything" to "check one effect first".

### 2026-11-02: big port with no finish line
- **Before:** "use giga brains info struct learning skills and all absolutely everything … i need only useful info for me"
- **After:** "Port gigabrain's learning system into nikabrain/learning for me (frontend + React, visual learner). Keep only what I'll use in the next 2 weeks. Done when: one visual page I can open explains the method, I can start one React exam and one CSS exam from the terminal, and doctor + selftest pass."
- **Why:** "everything, but only useful" asks Claude to set the scope. Naming the time window, the first two things to use and the proof makes the result checkable and stops over-building.

### 2026-11-02: skill request with no stack or version
- **Before:** "im font edn developer and i need skills that will be connected to react and next js and everything related to them"
- **After:** "I'm starting a Next.js 15 App Router app with server actions and Tailwind. Which skills am I missing compared to what nikabrain already has? Recommend at most 5, and absorb only after I approve."
- **Why:** "everything related" can't be checked against anything. The official Next.js skills turned out to need Next 16.3+, and naming the version would have shown up front whether they fit.

### 2026-11-02: a learning plan with no constraints
- **Before:** "from the start i want to plan how you and me are going to work together so i become better programer in short time"
- **After:** "Plan how we work together so I grow fast. I'm a React beginner, I have 1 hour a day, 5 days a week, and my own projects to build. Done when: a weekly rhythm and an 8-week path are written into nikabrain, with a proof per week."
- **Why:** level, time and "short time" = how many weeks were the three things Claude had to ask for, which cost two rounds of questions.
