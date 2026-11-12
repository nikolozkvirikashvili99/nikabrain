repo: C:/Users/qartv/projects/photo-portfolio/.git
updated: 2026-11-12
## Worked
- Repo re-initialised by Nika on 2026-11-12 (older history gone on purpose); root commit 6cc57c7 + 57e753f, pushed to origin/master. Confirmed by `git rev-parse HEAD origin/master` (equal).
- Strict TypeScript 7 (`tsc -b` runs before every build). Confirmed by byte-identical dist vs the JS build.
- Cleanup: shared photo CSS, header on `.container`, `--tap-target`, `EAGER_PHOTOS`, one reduced-motion block. Confirmed by 12/12 pixel-identical screenshots (incl. open menu, hover) + reviewer.
- Vitest `pool: 'vmThreads'` + `maxWorkers: 1`: 60s → 13s, 39/39.
- Home tab title = real site name; README is a short project guide; `.claude/settings.local.json` gitignored.
## Failed: do not retry
- `--` inside an SVG comment: breaks the SVG (XML).
- picsum placeholders: HTTP 522; photos are local files now.
- Playwright `networkidle` on the Vite dev server: times out (HMR socket). Use `load` (fine on `vite preview`).
- Multi-line string edits assuming LF: files are CRLF after checkout (autocrlf).
## Not tried yet
- Real photos: overwrite `public/albums/<slug>/NN.jpg`, real alt text in `src/data/albums.ts`.
- Full-screen photo viewer (Nika deferred: "later").
- Rename menu "Work" → "Albums"? (asked earlier, no answer yet).
- `/teach semantic-html-and-grid` (week 1 still needs the lesson + quiz).
- TS lab Day 1 (`js-to-typescript` lesson), then `/tutor` the next new component in TS.
## Next step
Ask Nika: real photos now, or the full-screen viewer, written in TS via `/tutor` (Nika types the props interface).
