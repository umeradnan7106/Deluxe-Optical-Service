---
name: implement-11-changes-complete
description: Implement all 11 product/admin/frontend changes from fix-instructions.txt — wishlist fix, variants fix, image annotations, admin orders lens details, draft orders, abandoned carts, profile redesign, admin customers, inventory bulk edit, images by color, lens options sub-options
metadata:
  type: general
---

## Prompt

Read C:\Users\Dell\Desktop\Deluxe Opt Service\fix-instructions.txt and implement all 11 changes completely. Do not skip any change. Start with Change 5 (Wishlist) and Change 10 (Variants) first, then work through the rest in order.

## Changes Implemented

**Change 1 (Image Annotations):** Added `imageView` state to product detail page. Added Front/Side tab switcher. Added SVG measurement overlay on front image showing lens_width, bridge, lens_height dashed lines. Kept measurement caption below image.

**Change 2 (Admin Orders Lens Details):** Replaced "Prescription" card with "Lens & Prescription" card in order detail. Groups lens_option_names by item with badge chips. Renders prescription_data JSON as a proper key-value table instead of raw JSON.

**Change 3 (Draft Orders):**
- Backend: Added `DraftOrderCreate` / `DraftOrderItem` schemas to `schemas/admin_order.py`. Added `POST /api/admin/orders/draft` endpoint in `routes/admin/orders.py`.
- Frontend: Added `createDraft` to `adminApi.orders` in `api.ts`. Added "Create Draft Order" button to admin orders list. Created `/admin/orders/new/page.tsx` with 5 sections (customer, products, lens options, payment, summary).

**Change 4 (Abandoned Carts):**
- Backend: Created `routes/admin/abandoned_carts.py` with GET endpoint returning carts, stats, and pagination. Registered in `main.py`.
- Frontend: Added `adminApi.abandonedCarts.list()` to `api.ts`. Added "Abandoned Carts" sidebar link (ExclamationTriangleIcon). Created `/admin/abandoned-carts/page.tsx` with stat cards, filter tabs, and table.

**Change 5 (Wishlist Fix):**
- ProductCard: Added `usePathname` import and const. Fixed redirect to `/auth/login?redirect=[current-path]` instead of just `/auth/login`.
- Header: Added `wishlistCount` from store. Added count badge (orange, same style as cart) to desktop wishlist icon. Added count pill in mobile drawer wishlist link.

**Change 6 (Profile Redesign):** Rewrote profile page. Replaced dark `bg-[#1a1a1a]` cards with white cards. Added orange avatar circle with initials. Added Account Activity stats card (Total Orders, Total Spent, Member Since, Last Login) fetching from ordersApi.myOrders(). Added password strength indicator (5-point scoring, colored bar). Added Danger Zone card for sign out.

**Change 7 (Admin Customers):**
- Backend: Created `routes/admin/users.py` with GET `/api/admin/users` (with aggregated total_orders, total_spent, last_order_date) and GET `/api/admin/users/guests` (orders with null user_id). Registered in `main.py`.
- Frontend: Added `listGuests` to `adminApi.users`. Updated customers page guest tab to fetch real data and show a proper table of guest orders.

**Change 8 (Inventory Stock Edit):** Added checkboxes per row + select-all checkbox. Added PencilSquareIcon button per row. Added "Update Selected (N)" button in header when items selected. Added bulk update modal with stock input.

**Change 9 (Images by Color):**
- Backend: Added `color_name` column to `ProductImage` model.
- Migration: Created `a1b2c3d4e5f6_add_color_name_and_sub_options.py` (also covers Change 11).
- Frontend ProductForm: Added `variant_key` and `color_name` to ImageRow. When loading images, populates these from variant data. Added "Upload for color" dropdown above upload area. Upload now targets the selected variant. Images grouped by color_name in the display.

**Change 10 (Variants Fix):**
- Added `sku_auto: boolean` to `VariantRow` interface.
- Pre-populate `lens_width`, `bridge`, `temple` from product-level dimensions on load.
- `addVariant`: sets `sku_auto: true`.
- `updateVariant`: auto-generates `sku_variant` as `{product_sku}-{size3}-{color3}` when `sku_auto` is true and color_name or size_label changes. Manual SKU edit sets `sku_auto: false`.
- `removeVariant`: added `window.confirm()` dialog and last-variant protection.

**Change 11 (Lens Options):**
- Backend: Added `sub_options: Optional[str]` to `LensOptionCreate` and `LensOptionUpdate` schemas. Updated `_serialize` to parse and return `sub_options` as parsed JSON. Added `import json`.
- Backend model: Added `sub_options = Column(Text, nullable=True)` to `LensOption`.
- Frontend lens-options page: Removed "Add-ons" tab and `addon` type option from dropdown. Added `sub_options` to interface. Modal widened to `max-w-[600px]`. Added sub-options section (checkbox toggle + table with name/price rows + add/remove).

## Files Modified

Backend:
- `backend/models/product.py` — added color_name to ProductImage
- `backend/models/lens.py` — added sub_options to LensOption
- `backend/models/order.py` — (no change, AbandonedCart already existed)
- `backend/routes/admin/orders.py` — added POST /draft endpoint
- `backend/routes/admin/lens_options.py` — added sub_options to schemas and serialize
- `backend/schemas/admin_order.py` — added DraftOrderCreate, DraftOrderItem
- `backend/main.py` — registered abandoned_carts and users routers
- `backend/alembic/versions/a1b2c3d4e5f6_add_color_name_and_sub_options.py` — NEW migration

Backend new files:
- `backend/routes/admin/abandoned_carts.py`
- `backend/routes/admin/users.py`

Frontend:
- `frontend/lib/api.ts` — added createDraft, abandonedCarts, listGuests
- `frontend/types/index.ts` — added sub_options to LensOption
- `frontend/components/product/ProductCard.tsx` — pathname redirect fix
- `frontend/components/layout/Header.tsx` — wishlist count badge
- `frontend/components/layout/AdminSidebar.tsx` — Abandoned Carts link
- `frontend/components/admin/ProductForm.tsx` — variants fix + images by color
- `frontend/app/(store)/products/[slug]/page.tsx` — imageView state + SVG overlay
- `frontend/app/(store)/account/profile/page.tsx` — full redesign
- `frontend/app/admin/orders/_Content.tsx` — Create Draft Order button
- `frontend/app/admin/orders/[id]/page.tsx` — Lens & Prescription card
- `frontend/app/admin/inventory/page.tsx` — checkboxes + pencil + bulk modal
- `frontend/app/admin/customers/page.tsx` — guest tab with real data
- `frontend/app/admin/lens-options/page.tsx` — sub-options, removed addon tab

Frontend new files:
- `frontend/app/admin/orders/new/page.tsx` — Draft order creation page
- `frontend/app/admin/abandoned-carts/page.tsx` — Abandoned carts page

## Outcome

All 11 changes implemented. TypeScript check passed with no errors.
