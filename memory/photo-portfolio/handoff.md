repo: C:/Users/qartv/projects/photo-portfolio/.git
updated: 2026-11-12
## Worked
- Gallery grid (Nika wrote `repeat(auto-fill, minmax(16rem, 1fr))`), committed a3ff087. Confirmed by screenshots 390/1280 light+dark.
- Albums: covers (first photo + title + count) → `#album/<slug>` page; Back / "All albums" return with focus on the origin card; malformed hash falls back to gallery. Committed 510960c. Confirmed by 39 tests, lint, build, Edge keyboard run.
- Camera favicon (light/dark) + warm paper background tokens + CLAUDE.md refreshed. Committed dd90c4d. Confirmed by screenshots + contrast ≥ 6.5.
## Failed: do not retry
- `--` inside an SVG comment: breaks the SVG (XML).
- picsum placeholders: HTTP 522; photos are local files now.
- Playwright `networkidle` on the Vite dev server: times out (HMR socket). Use `load`.
## Not tried yet
- Nika swaps in real photos: overwrite `public/albums/<slug>/NN.jpg`, real alt text in `src/data/albums.js`.
- Full-screen photo viewer (Nika deferred: "later").
- Rename menu "Work" → "Albums"? (asked, no answer yet). Menu links on an album page return to the main page (accepted for now).
- `/teach semantic-html-and-grid` (week 1 still needs the lesson + quiz).
- Nothing pushed yet (no remote push asked).
## Next step
Ask Nika: real photos now, or the full-screen viewer (offer one 1–3 line piece for Nika to write).
