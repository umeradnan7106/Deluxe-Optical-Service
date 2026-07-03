---
id: "001"
title: Eight Live Site Bug Fixes
stage: green
date: 2026-06-30
surface: agent
model: claude-sonnet-4-6
feature: product-page-and-admin
branch: main
user: umeradnan7106@gmail.com
command: fix all 8 live site issues
labels: ["bug-fix","product-page","admin","wishlist","cart","categories"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/app/(store)/products/[slug]/page.tsx
  - frontend/store/wishlistStore.ts
  - frontend/components/layout/Header.tsx
  - frontend/app/admin/categories/page.tsx
tests:
  - npm run build — ✓ Compiled successfully
---

## Prompt

website mai abhi kuch masle arahe hain woh sab solve hone chahye:
1. Lens Height product page per show nhi horaha + Frame Width aur Lens Width Frame Specifications se hata do.
2. Black color ke 2 sizes nhi dikh rahe + size format galat tha (52□10-144 instead of Large (55□10-144)).
3. Wishlist 422 error POST /api/wishlist.
4. Size chart popup mein size-guide.pdf dikhao (public folder mein hai).
5. Features & Size aur Description tab image mein top/bottom whitespace hai — crop karo.
6. Add to Cart cart page pe redirect karta hai — nhi karana. Cart badge 9+ dikhata hai — actual number dikhao.
7. Select Your Lenses button sab products pe dikhta hai — sirf tab dikhao jab lens options hon.
8. Admin Categories reset hoti hain reload pe — localStorage se persist karo.

## Response snapshot

Fixed all 8 issues:

1. **Frame Specs**: Removed `Frame Width` row, kept `Lens Width`, added `Lens Height` row sourced from `product.lens_height_mm`.
2. **Size pills**: Updated `sizedVariants` filter to include variants with any measurement (lw/br/tm), not just those with a text label. Pill now shows `Large (55□10-144)` when label exists, or just `55□10-144` when it doesn't, ensuring both sizes for same color appear.
3. **Wishlist**: `add()` and `remove()` in `wishlistStore.ts` now re-throw after rollback so the product page catch block can redirect to `/account/login`.
4. **Size chart PDF**: Replaced `<SizeChartSVG />` inline SVG with `<iframe src="/size-guide.pdf">` in a wider modal (max-w-3xl, 70vh height). Also deleted the now-unused `SizeChartSVG` component to keep build clean.
5. **Image fit**: Changed `object-contain` → `object-cover` and `paddingTop: 50%` → `60%` in the Features tab image box; same `object-cover` change for Description tab image.
6. **Cart redirect**: Removed `router.push("/cart")` from `handleAddToCart`. Badge changed from `{itemCount > 9 ? "9+" : itemCount}` to `{itemCount}` (both desktop + mobile), badge class updated to `min-w-[16px] px-[3px]` for 2-digit counts.
7. **Select Your Lenses**: Added `hasLensOptions` check (`lens_type | coating | addon length > 0`). Button only renders when true; wishlist heart expands to full width when button is hidden.
8. **Categories persist**: `useState` initializer reads from `localStorage.getItem(STORAGE_KEY)`. `useEffect` saves to `localStorage` on every `customCategories` change. Removed hardcoded seed data so fresh localStorage starts empty.

## Outcome

- ✅ Impact: All 8 live site bugs fixed; build passes clean (✓ Compiled successfully)
- 🧪 Tests: npm run build — no TypeScript or ESLint errors
- 📁 Files: 4 files modified
- 🔁 Next prompts: User to confirm visual results on live site
- 🧠 Reflection: Wishlist fix required re-throw pattern; size pill fix required decoupling label presence from variant inclusion
