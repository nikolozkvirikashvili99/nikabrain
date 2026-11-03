repo: C:/Users/qartv/projects/photo-portfolio/.git
updated: 2026-11-03
## Worked
- Scaffolded with create-vite 9.3.3 (template react): vite 8.3.5, react 19.3.1; confirmed by `npm install` reporting 0 vulnerabilities.
- Dev deps added: vitest 5.1.0, @testing-library/react 16.3.3, @testing-library/jest-dom 7.0.1, jsdom 30.1.3; confirmed by npm install. `git init` done, nothing committed.
## Failed: do not retry
- (none)
## Not tried yet
- Removing the Vite demo (src/App.css, src/assets/, demo tokens in src/index.css). Nika stopped the turn before the cleanup ran.
- Vitest config (`test: { environment: 'jsdom', setupFiles }` in vite.config.js); check that the jest-dom 7 vitest entry exists before importing it.
- tokens.css: photo-first neutral (zinc / black-white), Space Grotesk for headings + Archivo for body (ui-ux-pro-max), light + dark via prefers-color-scheme. Skip the tool's "scroll storytelling" pattern; it doesn't suit a gallery.
- App frame + Intro/Gallery/Footer, placeholder picsum photos (fixed seeds, alt/width/height/lazy), placeholder name in one place.
- Failing Header RTL test + stub Header; Nika writes Header.jsx and the gallery grid-template-columns (/tutor).
- /onboard-project (own) → CLAUDE.md + labs.md row; build, test, screenshots at 390/1280 in light and dark, ui-reviewer.
- Learning idea (not agreed yet): baseline exams (react-core, css-layout) to fill me/concepts.md, then build the site one concept per feature; maybe use it as the lab instead of taskboard.
## Next step
Ask Nika in plain text: "baseline exam first, or continue the scaffold?" Then clean out the Vite demo.
Plan: C:\Users\qartv\.claude\plans\ok-i-want-to-cozy-pizza.md
