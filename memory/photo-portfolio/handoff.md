repo: C:/Users/qartv/projects/photo-portfolio/.git
updated: 2026-11-13
## Worked (all pushed; HEAD 0d05361 = origin/master, each push live on maiagabunia.com in ~20-40 s, proven by grepping the hashed /assets file)
- Warm palette in tokens.css only: linen #efe6d8 page, espresso #2b211c text + header/footer (contrast 5.3-12.7:1 measured). CLAUDE.md design note updated.
- Header: espresso band, sticky (scroll-padding = --header-height), logo-only (name visually hidden), phone 72px / desktop 88px via --logo-size/--header-pad/--header-height tokens.
- About: whole photo left + Bodoni Moda name/tagline right on desktop; phone = slim banner with a stronger warm scrim (text 8:1, measured on pixels). About text + Selected Work (Credits.tsx, after the grid) centred; 1px espresso lines around the grid.
- 4 albums (fashion, brands, weddings, portraits), 1 real cover each (2000px web copies, EXIF stripped); placeholders removed.
- Album cards: lift + warm shadow on hover (`@media (hover: hover)`), no fade. Full-screen viewer: native <dialog> (PhotoViewer.tsx), × hidden visually (shows on keyboard focus), tap beside to close, prev/next + arrows when >1 photo. 55/55 tests.
- Footer: centred socials, mail/phone icons. Tab icon = bold aperture, light/dark switching; apple-touch-icon = full logo.
- Publish: Ctrl+Shift+B (scripts/ship.mjs: lint+tests+build then commit+push); "Publish on save" task exists (autoship) but Nika hasn't turned it on.
## Failed: do not retry
- Text-only question dialogs for visual choices: rejected 5x. Render previews first ([[visual-choices-get-rendered-previews]]).
- Overwriting a PNG that's open in the Windows viewer: EBUSY. Use a new filename.
- Playwright eval right after an index.html edit: "context destroyed" (Vite full reload). Rerun.
- `--`, picsum, networkidle, LF-assuming edits: see earlier (still true).
## Not tried yet
- Phone Back closes only the viewer (push a history entry on open).
- Swipe between photos (Nika chose "later").
- Index.html meta description still has the old tagline; nav "Selected Work" vs heading "Selected Work" clash; favicon/apple icon still cool black, not espresso.
- More photos per album (Nika sends Quick Share links; scratchpad qsget.cjs + webcopy.cjs did download → 2000px → strip EXIF).
- `/tutor` one line: the viewer's `useState` (Nika: "learn this later").
## Next step
Ask Nika which album gets more photos first, then add them (02.jpg…) with alt text.
