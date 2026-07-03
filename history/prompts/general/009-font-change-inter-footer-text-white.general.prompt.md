---
id: "009"
title: Font Change Inter Footer Text White
stage: green
date: 2026-07-04
surface: agent
model: claude-sonnet-4-6
feature: ui-typography
branch: main
user: umeradnan7106@gmail.com
command: change font to Inter for readability; fix gray subtext on blue/dark backgrounds to white
labels: ["ui","typography","font","footer","accessibility","readability"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/app/layout.tsx
  - frontend/app/globals.css
  - frontend/tailwind.config.ts
  - frontend/components/layout/Footer.tsx
tests:
  - npx tsc --noEmit — ✓ no errors
---

## Prompt

wishlist wala kaam to theek hogaya ab kuch UI ki changes hain jo bilkul sahi kerke do mujhe. Sabse pehle to mujhe font-family change karo kuch bhi sahi se visible hi nhi hai or sub-text to bilkul faarigh hua wa hai na hi uski font-size sahi hai or na hi font-family to mujhe koi esa font design laga ker do jo visible ho attractive ho or subtext and numbers usme achi tareeke se dikh rahe hon woh rakhna or jahan jahan bhi background blue hai usper jo subtext hai abhi uska color gray type hua wa hai to un sab ko white karo gray mai sahi visible nhi hain

## Response snapshot

**Font change (3 files):**

1. `layout.tsx`: Removed `Cormorant_Garamond` and `Outfit` imports. Added `Inter` (Google Font, the gold standard for UI readability — excellent at small sizes, perfect number rendering, used by Apple/Linear/Stripe). Kept `Playfair_Display`. CSS variables updated from `--font-outfit`/`--font-cormorant` to `--font-inter`.

2. `globals.css`:
   - Body font: `'Outfit'` → `var(--font-inter), 'Inter'`
   - Base font-size: `default` → `15px` with `line-height: 1.6`
   - Added `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale` for crisp text
   - h1–h6: `'Cormorant Garamond'` → `var(--font-playfair), 'Playfair Display'` (already used as `font-playfair` class everywhere; now consistent)
   - Also applied Inter to `input/textarea/select`

3. `tailwind.config.ts`: Removed `cormorant` and `outfit` keys (unused in components). Added `inter: ["var(--font-inter)", "'Inter'", "sans-serif"]`.

**Blue background gray text fix (Footer):**

Footer uses `bg-[#0f1829]` (very dark navy). All text that was `text-[#475569]` (slate-600, appears medium gray — invisible on dark bg) changed to `text-white/55`. All `text-[#334155]` (slate-800, nearly invisible on dark bg) changed to `text-white/40`. Footer links, description text, newsletter text, payment badge labels, copyright line, and chevron icons all updated.

AnnounceBar (`bg-[#1B2B5E]`) already had `text-white/85` — unchanged.
Navbar (`bg-[#1B2B5E]`) already had `text-white/75` — unchanged.
Header drawer header (`bg-[#1B2B5E]`) already had `text-white/60` — unchanged.

## Outcome

- ✅ Impact: Site now uses Inter for all body/subtext/numbers (crisp, readable, professional). Footer text is now clearly visible (white/55 on dark navy). All h1–h6 consistently use Playfair Display.
- 🧪 Tests: npx tsc --noEmit — no TypeScript errors
- 📁 Files: 4 files modified
- 🔁 Next prompts: Visual review of footer, product page subtexts, numbers
- 🧠 Reflection: Outfit is fine for large text but thin/unclear at 11–13px. Inter is specifically designed for screens and has excellent optical sizing. Cormorant Garamond as h1-h6 default was unnecessary since all heading elements already applied font-playfair class explicitly.

## Evaluation notes (flywheel)

- Failure modes observed: font-outfit/font-cormorant classes not used in any component; only globals.css was setting them globally
- Graders run and results (PASS/FAIL): tsc --noEmit PASS
- Prompt variant (if applicable): null
- Next experiment: Review subtext contrast ratios against WCAG AA standard
