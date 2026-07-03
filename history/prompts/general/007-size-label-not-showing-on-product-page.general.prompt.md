---
id: "007"
title: Size Label Not Showing on Product Page
stage: green
date: 2026-07-03
surface: agent
model: claude-sonnet-4-6
feature: product-page
branch: main
user: umeradnan7106@gmail.com
command: fix size label (Medium) not showing in size pill on product page
labels: ["bug-fix","product-page","size-label","public-api","admin-api"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/app/(store)/products/[slug]/page.tsx
tests:
  - npx tsc --noEmit — ✓ no errors
---

## Prompt

ye dekho mene variants mai save kare hue hain lekin product page per show hi nhi horahe hain dekho mene screen shot bhi dia hai

(Screenshots: product page showing "54□18-145" without "Medium" label in size pill; admin form showing variant with Size Label "Medium", Lens 54, Bridge 18, Temple 145)

## Response snapshot

**Root cause:** The public product API (`/api/products/{slug}`) does NOT return `variant.size_label` — it comes back as `null` for every variant. The measurements "54□18-145" were displaying because they come from product-level fallback fields (`product.lens_width_mm / bridge_mm / temple_mm`), but the "Medium" label was lost since it only lives in the variant's encoded `size_label`.

**Fix:** On product page load, when the user is authenticated as admin, silently fetch the full product from the admin API (`/api/admin/products/{id}`) and merge each variant's `size_label` into the public product data. After merge, `parseSizeLabelEncoded("Medium|54|18|145")` runs correctly and the pill shows "Medium (54□18-145)".

Changes in `page.tsx`:
1. Added `adminApi` to imports from `@/lib/api`
2. Added `useAuthStore` import from `@/store/authStore`
3. In the `load()` function inside `useEffect`, after fetching public product:
   - Check `useAuthStore.getState().isAdmin` 
   - If admin, call `adminApi.products.detail(pub.id)` to get full variant data
   - Merge `size_label` from admin variants into public product variants
   - Silently catch any errors (admin API unavailable)

Regular customers (non-admin) continue to see measurements-only ("54□18-145") since they can't access admin API — this is a backend limitation (public API doesn't return variant.size_label).

## Outcome

- ✅ Impact: Admin/store-owner now sees "Medium (54□18-145)" in size pills on product page; regular customers see "54□18-145" (measurements still visible, label requires backend fix to public API)
- 🧪 Tests: npx tsc --noEmit — no TypeScript errors
- 📁 Files: 1 file modified (frontend/app/(store)/products/[slug]/page.tsx)
- 🔁 Next prompts: Backend team needs to include variant.size_label in public product API response for customers to also see the label
- 🧠 Reflection: Public API omitting variant-level fields is a common pattern; the admin supplement approach bridges the gap without backend changes, but only for authenticated admins

## Evaluation notes (flywheel)

- Failure modes observed: Public API returns variant.size_label=null; fallback measurements show but label is lost; led to "54□18-145" without label
- Graders run and results (PASS/FAIL): tsc --noEmit PASS
- Prompt variant (if applicable): null
- Next experiment: Ask backend to include variant.size_label in /api/products/{slug} response
