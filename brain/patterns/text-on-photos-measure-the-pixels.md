---
name: text-on-photos-measure-the-pixels
description: Contrast of text laid over a photo can't be read off the colour tokens; hide the text, screenshot, and measure the brightest pixel behind it, and re-measure after any size or layout change.
metadata:
  type: project
---

**Rule:** for text on a photo (hero banner, card overlay), measure contrast
against the real pixels: hide the text, screenshot, read the brightest pixel
inside each text box, compute the WCAG ratio. Re-run it after *any* change to
the box size, crop or text position, not only after colour changes.

**Why:** 2026-11-13, a portfolio hero. White text over a bridal photo
(white gowns) measured 5:1 in a tall banner with a bottom fade. Shrinking the
banner on phones pushed the title up into the bright gowns where the fade was
weak: **1.64:1**, unreadable, with no colour changed. Only the pixel check
caught it; the fix was a stronger shade on phones (back to 10.5:1).

**How to apply:**
- Playwright: `addStyleTag('.content{visibility:hidden}')`, screenshot, draw
  it to a canvas in the page, `getImageData` over each text rect, take the max
  luminance. Compare with the text colour.
- Know when the check doesn't apply: on a layout where the text moved off the
  photo (desktop side-by-side), the script compares the wrong pair; say so
  instead of reporting a scary number.
- A darker scrim on small screens is normal: the shorter the banner, the more
  of it is text.

**Signal:** text over an image, plus any change to height, `object-fit`, crop
or breakpoint. [[outward-claims-carry-their-proof]]
