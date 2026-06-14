---
name: fix-measurement-annotations
description: Fix 4 measurement annotation issues on Features & Size tab product images — side line missing, lens height label cut off, labels invisible on dark backgrounds, null size_label
metadata:
  type: general
---

## Prompt

Read C:\Users\Dell\Desktop\Deluxe Opt Service\fix-instructions.txt and fix all changes.

## Fixes Implemented

**Problem 1 — Front View Lens Height Label Cut Off:**
- `lens_height_mm` vertical line was at x=385 in a 400-wide viewBox; label at x=393 was clipped by `overflow-hidden` parent container
- Fixed: moved vertical line inward to x=350, label pill placed at x=296-344 (center x=320) to the LEFT of the line — fully inside the viewBox

**Problem 2 — Side View No Measurement Line:**
- Side view image had no SVG overlay at all
- Added: `{imageView === "side" && product.temple_mm && (<svg>...)}` with a horizontal dashed line at y=80 (40% of 200-height viewBox), spanning x=40 to x=280, with orange pill label centered above the line

**Problem 3 — Labels Invisible on Dark/Grey Backgrounds:**
- Plain `<text>` elements with orange fill were invisible on grey/dark product images
- Fixed for ALL labels (lens_width, bridge, lens_height, temple):
  - Each label is now a `<rect>` + `<text>` pair: white fill rect, orange border (strokeWidth=0.75), orange bold text
  - Each measurement line gets a white underline stroke (strokeWidth=2.5) drawn behind the orange dashed line for contrast

**Bonus Fix — Size Shows "Null" Prefix:**
- `frameSizeStr` checked `variant?.size_label` (truthy) but string "null" is truthy
- Fixed: `const sl = variant?.size_label; if (sl && sl.toLowerCase() !== "null") { ... }`

## Files Modified

- `frontend/app/(store)/products/[slug]/page.tsx` — SVG overlay (lines 466-510) and frameSizeStr (line 165-166)

## Commit

`f57ad75` — fix: measurement annotations - side line, label visibility, null size

## Outcome

TypeScript check passed with no errors. All 4 annotation problems fixed. Pushed to main.
