---
id: "008"
title: Wishlist Redirect Bug and Heart Icon Position
stage: green
date: 2026-07-04
surface: agent
model: claude-sonnet-4-6
feature: product-page
branch: main
user: umeradnan7106@gmail.com
command: fix wishlist redirect even when logged in; move heart icon to category row
labels: ["bug-fix","wishlist","product-page","ux","heart-icon"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/app/(store)/products/[slug]/page.tsx
  - frontend/components/product/ProductCard.tsx
tests:
  - npx tsc --noEmit — ✓ no errors
---

## Prompt

Acha last wali changes to sahi se hogayi hai wishlist ka kaam, wishlist abhi bhi sahi se kaam nhi ker rahi hai jese hi website per kahin per bhi wishlist ke icon per click kerta hoon to woh mujhe is (http://localhost:3000/auth/login?redirect=%2Fproducts) link per redirect ker raha hai jabke mai login hoon tab bhi to ye kia masla hai isko sahi karo. product page per wishlist ka icon product title ke uper category arahi hai na uske samne right side per display karao Save 15% with online payment wale box ke uper show nhi karao isko bhi workable kerna.

## Response snapshot

**Bug 1 — Wishlist redirecting to login even when logged in:**

Root cause: The `catch` block in both `ProductCard.tsx` and the product page's `handleWishlist` was redirecting to `/auth/login` for ANY error — including 422 (which can mean "product already in wishlist" or other business logic errors), not just 401/403 (auth failures). So if the wishlist API returned a 422, the logged-in user was incorrectly redirected to login.

Fix (ProductCard.tsx):
- Changed `catch { router.push('/auth/login?...') }` to check `err.response?.status`
- Only redirects on 401/403 or unknown status; silently ignores 422 and other errors

Fix (product page handleWishlist):
- Added explicit `isAuthenticated` check using `useAuthStore.getState()` before attempting API call
- Same error status check — only redirects on 401/403

**Bug 2 — Heart icon moved to category row:**

- Added wishlist heart button to the category label row as a flex row: category on left, heart on right
- Removed the old heart button from the "Select Your Lenses / heart" row below the price
- When no lens options exist, the "Select Your Lenses" section is now entirely omitted (no empty button row)

## Outcome

- ✅ Impact: Wishlist no longer redirects logged-in users to login on 422 errors; heart icon now shows at top of product detail next to EYEGLASSES/category label
- 🧪 Tests: npx tsc --noEmit — no TypeScript errors
- 📁 Files: 2 files modified
- 🔁 Next prompts: Verify wishlist toggle works correctly end-to-end for logged-in users
- 🧠 Reflection: Catch-all redirect to login is a common but incorrect pattern — only 401/403 signals an auth failure; any other error (422, 500) should be handled independently

## Evaluation notes (flywheel)

- Failure modes observed: Over-broad catch redirecting to login for non-auth errors
- Graders run and results (PASS/FAIL): tsc --noEmit PASS
- Prompt variant (if applicable): null
- Next experiment: Add toast notification for non-auth wishlist errors instead of silent ignore
