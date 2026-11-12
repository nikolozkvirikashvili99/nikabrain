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

### 2026-11-03: a big learning wish sent mid-build
- **Before:** "i want you to think best ways to build this site together and by working together learn my knowalage and skills and all and then make program wich will help me to develop more"
- **After:** "Pause the build. Before we continue: find out what I already know (a 20-min quiz is fine), then plan the photo site so each feature teaches me one concept. Done when my concepts.md has starting levels and the next 3 features each name a concept. Don't build a new tool yet."
- **Why:** sent while Claude was building, it got mixed up with the scaffold. Saying "pause" plus naming the outcome (starting levels, features mapped to concepts) makes it a separate, checkable task.

### 2026-11-05: "continue" with no pointer (Nika wrote the better version)
- **Before:** "continue the photo site"
- **After (Nika's own, later):** "continue the photo site; read ~/projects/nikabrain/memory/photo-portfolio/handoff.md, then /onboard-project (own)"
- **Why:** naming the handoff file and the next step removes the guesswork. Add a done-line too: "…done when the Header test is red and the build passes".

### 2026-11-12: "ok" to three open questions
- **Before:** "ok" (after Claude asked: keep the menu behaviour? rename "Work" to "Albums"? update CLAUDE.md?)
- **After:** "ok: keep menu, rename to Albums, update CLAUDE.md"
- **Why:** with one "ok" Claude had to guess, did 2 of 3, and the rename was still unanswered. One word per question removes the guess.

### 2026-11-12: change request with no target
- **Before:** "i want to change backgroudncolor"
- **After:** "make the background warm cream, light and dark; done when it looks right at 390 and 1280"
- **Why:** naming the colour or feel plus the proof skips a question round.

### 2026-11-12: "do it" after a reply with two next steps
- **Before:** "do it" (Claude had suggested a reword *before* pushing, and a push command)
- **After:** "reword CLAUDE.md, then push"
- **Why:** a push is public and hard to undo, so the vague "do it" cost a question round.

### 2026-11-12: a migration with its own proof (Nika wrote the done-line)
- **Before → kept:** "…baseline to this very exact build, the typescript version should output the same. done, when you have moved the entire photo-portfolio to typescript"
- **Why it worked:** "output the same" became a checkable proof (byte-identical dist). Even better: add "ask before adding deps".

### 2026-11-13: a UI request with placement, spacing and a "preview before push" gate
- **Before → kept:** "…on pc… options sorted in header as it was, on the right side not too close to center, the gap not too big not too short… send me screen, not push it, and if I like it I'll push"
- **Why it worked:** where it goes, the spacing feel, which widths, and the approval gate were all stated, so it was built in one pass and approved first try. Even better: name the switch width ("from tablet up").

### 2026-11-13: "make it little more milky"
- **Before:** "make it little more milky and push it"
- **After:** "a bit creamier (not yellow, not pure white), push it"
- **Why:** "more milky" can mean whiter or creamier. Claude guessed creamier and it held, but one word of direction removes the guess.
