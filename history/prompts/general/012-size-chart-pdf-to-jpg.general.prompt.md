---
id: "012"
title: Size Chart PDF to JPG Image
stage: green
date: 2026-07-04
surface: agent
model: claude-sonnet-4-6
feature: product-page
branch: main
user: umeradnan7106@gmail.com
command: replace size chart iframe/pdf with size-guide.jpg image
labels: ["size-chart","product-page","image","popup"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/app/(store)/products/[slug]/page.tsx
tests:
  - visual check — no tsc errors
---

## Prompt

acha product page per Size Chart ka button hai mene pehle bola tha ke popup mai size-guide.pdf show karana to ab usko hata ker size-guide.jpg image show karana ye image public ke folder mai hai

## Response snapshot

The modal was already using `src="/size-guide.jpg"` but inside an `<iframe>` — which is the wrong element for a JPG (iframes are for documents/HTML). Replaced with a proper `<img>` tag inside a scrollable `div` so the image scales naturally and the user can scroll if it's taller than the viewport.

**Change at line 716–721 of `page.tsx`:**
- Before: `<iframe src="/size-guide.jpg" style={{ minHeight: "70vh" }} />`
- After: `<div className="overflow-y-auto rounded-b-xl"><img src="/size-guide.jpg" className="w-full h-auto block" /></div>`

## Outcome

- ✅ Impact: Size Guide popup now renders the JPG image correctly instead of trying to load it in an iframe
- 🧪 Tests: tsc --noEmit — no errors
- 📁 Files: 1 file modified
- 🔁 Next prompts: none
- 🧠 Reflection: The image was already correctly referenced; only the container element was wrong (iframe vs img).

## Evaluation notes (flywheel)

- Failure modes observed: iframe used for image — renders poorly or blank in some browsers
- Graders run and results (PASS/FAIL): visual only
- Prompt variant (if applicable): null
- Next experiment: null
