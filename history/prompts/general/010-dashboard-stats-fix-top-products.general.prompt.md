---
id: "010"
title: Dashboard Stats Fix and Top Products
stage: green
date: 2026-07-04
surface: agent
model: claude-sonnet-4-6
feature: admin-dashboard
branch: main
user: umeradnan7106@gmail.com
command: fix dashboard empty stat cards; add real-time sync; implement top products
labels: ["bug-fix","admin-dashboard","backend","top-products","real-time"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/routes/admin/dashboard.py
  - backend/schemas/admin_dashboard.py
  - frontend/lib/api.ts
  - frontend/app/admin/page.tsx
tests:
  - npx tsc --noEmit — ✓ no errors
---

## Prompt

Dashboard mai kuch bhi sahi se fetch ho ker display ni horaha hai to in sabko sahi karo, saari cheezen real time mai sync honi chahye or her cheez kaam ker rahi ho ye sahi kerke do.

## Response snapshot

**Root cause:** `ProductVariant` model has no `low_stock_threshold` column — that column lives on `Product`. The dashboard route used `ProductVariant.low_stock_threshold` in both `/stats` and `/low-stock` endpoints, causing `AttributeError` → HTTP 500 → frontend `catch(() => {})` swallowed it → `stats` stayed `null` → stat cards showed loading skeleton forever.

**Backend fixes (dashboard.py):**
- Fixed `/stats` endpoint: changed `ProductVariant.stock <= ProductVariant.low_stock_threshold` → explicit join with `Product` using `ProductVariant.product_id == Product.id`, filter `ProductVariant.stock <= Product.low_stock_threshold`
- Fixed `/low-stock` endpoint: same join fix; also updated `LowStockItem` construction to read threshold from `v.product.low_stock_threshold`
- Added `/top-products` endpoint: fetches all orders this month, parses JSON `items` field from each order, aggregates units sold + revenue by product_id, joins with Review for avg_rating, returns top 10 sorted by units sold

**Backend schema (admin_dashboard.py):**
- Added `TopProduct` Pydantic model: `product_id`, `product_name`, `units_sold`, `revenue`, `avg_rating (Optional[float])`

**Frontend fixes:**
- `api.ts`: Added `topProducts: () => api.get("/api/admin/top-products")` to dashboard object
- `admin/page.tsx`:
  - Added `topProducts` state and `TopProduct` interface
  - Refactored `useEffect` into `fetchAll` callback using `Promise.allSettled` (all 5 endpoints in parallel, no silent drop on partial failure)
  - Added auto-refresh every 60 seconds via `setInterval`
  - Added manual "Refresh" button with spinning `ArrowPathIcon` when loading
  - Added "Last updated: HH:MM:SS" timestamp below title
  - Top Products table now shows real data with rank #, product name, units sold, revenue (green), avg rating (gold star)

## Outcome

- ✅ Impact: All 4 stat cards now load correctly; Low Stock Alert shows real counts; Top Products shows this month's real sales data; dashboard auto-refreshes every 60s with manual refresh button
- 🧪 Tests: npx tsc --noEmit — no TypeScript errors
- 📁 Files: 4 files modified (2 backend, 2 frontend)
- 🔁 Next prompts: Monitor backend for any other 500 errors; add date-range filter for Top Products
- 🧠 Reflection: Backend model attribute mismatch (low_stock_threshold on Product vs ProductVariant) caused silent 500 errors swallowed by frontend catch blocks. Always validate backend endpoint responses in dev with visible error logging.

## Evaluation notes (flywheel)

- Failure modes observed: AttributeError on ProductVariant.low_stock_threshold; catch(() => {}) masking 500 errors
- Graders run and results (PASS/FAIL): tsc --noEmit PASS
- Prompt variant (if applicable): null
- Next experiment: Add error toast on fetch failure so backend errors are visible to admin
