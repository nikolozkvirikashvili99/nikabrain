# Roadmap: get nikabrain running, then grow with it

Pace: whatever fits next to real work. `/retro` moves the `Now:` line and
marks a phase done only when its proof has been shown. The coach hook adds
`Now:` to the first prompt of every session.

**Now:** Week 0 of the 8-week path (`learning/tracks.md` → "Weekly rhythm"): finish the Phase 1 proof (new session in any folder: "what does nikabrain's CORE say about UI proof?"), create `~/projects/taskboard`, `/onboard-project` it (lab) and one own project (own). Then week 1: `/teach semantic-html-and-grid`.

## Phases

| # | Phase | Claude skill Nika practises | Done when (proof) | Status |
|---|---|---|---|---|
| 1 | Install | running a reviewed installer yourself | `node bin/install.mjs` ran; `node bin/doctor.mjs` shows 0 errors; a fresh session sees CORE | |
| 2 | First real retro | `/retro` at the end of a work session | `me/journal/` has a dated file and `me/scorecard.md` has a row, both written by `/retro` | done 2026-11-02 |
| 3 | Onboard your main React project | `/onboard-project` | that repo has a lean CLAUDE.md (commands, conventions, done-means) and a row in `labs.md` | |
| 4 | A design-system-first page | `ui-ux-pro-max --design-system` + `frontend-design` | one real page built from a generated design system, checked at 390 px and desktop, with `ui-reviewer` findings fixed | |
| 5 | Write the core yourself | `/tutor` | one custom hook or reducer written by Nika, tests green, and explained back without notes; `me/concepts.md` moves it to **build** | |
| 6 | Learn one topic properly | `/teach` | a lesson page on a weak concept from `me/concepts.md`, all quizzes answered; the concept moves to **explain** | |
| 7 | Prove it | `debug-protocol` + `verifier` | a bug reported as expected/actual/hypothesis, fixed red → green | |
| 8 | Weekly clean-up | `/curate` | the first curate run: 0–3 promotions, inherited habits confirmed or dropped, the scorecard re-scored | |
| 9 | Pull in outside knowledge | `/absorb --update` | upstream changes to the library reviewed, taken or skipped with a reason | |
| 10 | Learning loop running | exams + lab (`learning/`) | `react-core` and `css-layout` v1 taken (study, then exam mode ≥ 70%); taskboard steps 0–2 built by Nika; one practice ticket graded | |

Phase 10 can run in parallel with 2–9 from day one: open `learning/playbook.html` first.
After phase 9, `/curate` proposes the next phases from the weakest scorecard
dimensions and concepts.
