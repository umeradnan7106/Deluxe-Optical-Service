---
description: "Task list for Deluxe Opt Service complete e-commerce website implementation"
---

# Tasks: Deluxe Opt Service — Complete E-Commerce Website

**Input**: Design documents from `/specs/001-complete-website/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

**Tests**: Not requested — no test tasks generated (no TDD specified in spec).

**Total tasks**: 121 | **User stories**: 8 | **Phases**: 14

## Format: `[ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story this task belongs to (US1–US8 from spec.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and environment configuration

- [X] T001 Initialize Python virtual environment and install all backend dependencies in `backend/requirements.txt` (fastapi, uvicorn, sqlalchemy, alembic, psycopg2-binary, python-jose, passlib, python-multipart, cloudinary, resend, apscheduler, httpx, python-dotenv)
- [X] T002 Bootstrap Next.js 14 App Router project in `frontend/` with TypeScript, install npm dependencies (axios, zustand, @heroicons/react, @tiptap/react, @tiptap/starter-kit, recharts)
- [X] T003 [P] Configure Tailwind CSS in `frontend/tailwind.config.ts` with custom font families (cormorant, outfit) and project colour tokens
- [X] T004 [P] Create `frontend/app/globals.css` with Tailwind base directives only; add Google Fonts `<link>` to `frontend/app/layout.tsx`
- [X] T005 [P] Configure `frontend/tsconfig.json` with `strict: true` and path aliases (`@/` → `./`)
- [X] T006 [P] Initialise Alembic in `backend/alembic/` and configure `alembic.ini` to read `DATABASE_URL` from environment (never hardcoded)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Core

- [X] T007 Create all 14 SQLAlchemy models in `backend/models/` — `user.py` (User), `product.py` (Product, ProductImage, ProductVariant), `lens.py` (LensOption, ProductLensOption join table, LensCollection), `order.py` (Order, AbandonedCart), `review.py` (Review), `blog.py` (Blog), `promo.py` (PromoCode, FAQ) — include all enums, constraints, and relationships per `data-model.md`
- [ ] T008 Run initial Alembic migration against Supabase: `alembic revision --autogenerate -m "initial_schema"` then `alembic upgrade head`; verify all 14 tables created with correct columns and foreign keys
- [X] T009 Create `backend/database.py` (SQLAlchemy engine from `DATABASE_URL`, `SessionLocal`, `get_db` dependency)
- [X] T010 Create `backend/main.py` (FastAPI app instance, CORS middleware allowing `FRONTEND_URL`, router mounts placeholder, APScheduler lifespan stub)
- [X] T011 Create `backend/utils/auth.py` (JWT `create_access_token`, `create_refresh_token`, `verify_token`, bcrypt `hash_password`, `verify_password`, `get_current_user` FastAPI dependency, `get_current_admin` dependency)
- [X] T012 Create `backend/utils/helpers.py` (`generate_order_number(db)`, `calculate_shipping(subtotal)`, `calculate_payment_discount(subtotal, method)`, `generate_slug(name)`)
- [X] T013 [P] Create `backend/services/cloudinary.py` (configure Cloudinary from env vars, `upload_image(file, folder)`, `delete_image(public_id)` helpers)

### Frontend Foundation

- [X] T014 Create `frontend/types/index.ts` — all TypeScript interfaces: `Product`, `ProductVariant`, `ProductImage`, `LensOption`, `LensCollection`, `Order`, `PrescriptionData`, `Review`, `Blog`, `PromoCode`, `FAQ`, `User`, `CartItem`, `AuthStore`, `CartStore` (per `data-model.md` + contracts)
- [X] T015 Create `frontend/lib/api.ts` — Axios instance with `baseURL = NEXT_PUBLIC_API_URL`, request interceptor adding `Authorization: Bearer <token>` from authStore, response interceptor for 401 handling; export all API functions grouped by domain (auth, products, orders, cart, wishlist, reviews, blogs, faqs, lensCollection, upload, admin)
- [X] T016 [P] Create `frontend/lib/constants.ts` — Pakistani provinces array, cities-by-province map, payment method options with discount rates, design tokens (brand colours, max-width, border-radius)
- [X] T017 [P] Create `frontend/lib/utils.ts` — `formatPrice(n)` (Rs. X,XXX), `formatDate(d)`, `getDiscountPercent(orig, sale)`, `generateSlug(str)`, `truncate(str, n)`
- [X] T018 Create `frontend/store/cartStore.ts` — Zustand store with persist middleware: `items: CartItem[]`, `paymentMethod`, `couponCode`, `couponDiscount`; actions: `addItem`, `removeItem`, `updateQuantity`, `setPaymentMethod`, `applyCoupon`, `clearCart`; computed: `getSubtotal`, `getShippingFee`, `getPaymentDiscount`, `getTotal`
- [X] T019 [P] Create `frontend/store/authStore.ts` — Zustand store with persist: `user`, `accessToken`, `isAuthenticated`, `isAdmin`; actions: `login`, `logout`, `setTokens`, `setUser`

### Shared UI Components

- [X] T020 Create `frontend/components/ui/Button.tsx` (variants: primary orange, dark, outline, WhatsApp green, white — all `rounded-[5px]`), `Badge.tsx`, `StarRating.tsx`, `Placeholder.tsx`
- [X] T021 Create `frontend/components/layout/AnnounceBar.tsx` — `bg-[#E8670A]` bar with delivery text; scrolling marquee on mobile (`< md`)
- [X] T022 Create `frontend/components/layout/Header.tsx` — `bg-[#0F0F0F]` with orange bottom border; logo "Deluxe**Opt**" (Cormorant Garamond, Opt in orange); search bar centre; right: WhatsApp `bg-[#25d366]` button, cart icon + badge, wishlist icon, account icon; mobile: hamburger + logo centre + cart + search
- [X] T023 [P] Create `frontend/components/layout/Navbar.tsx` — `bg-[#1a1a1a]`; nav links (All Products, Men, Women, Sunglasses, Prescription, Blue Cut, Screen, Transition, Sale in orange); Track Order right; active orange underline
- [X] T024 [P] Create `frontend/components/layout/Footer.tsx` — dark bg, 5-column grid (logo+desc+socials, shop links, help links, company links, newsletter+payment icons); copyright bar; `max-w-[1500px] mx-auto px-6`
- [X] T025 Create `frontend/app/layout.tsx` — root layout: Google Fonts link, Zustand provider wrapper, AnnounceBar + Header + Navbar (customer) or AdminSidebar (admin route group); `frontend/app/globals.css` (Tailwind base only)

**Checkpoint**: Foundation complete — backend DB + utilities ready; frontend types + API client + stores + layout ready. User story implementation can now begin.

---

## Phase 3: User Story 1 — Guest Customer Completes a Purchase (Priority: P1) 🎯 MVP

**Goal**: A guest visitor can browse products, customise lenses with a prescription, add to cart, select a payment method, check out, and receive an order confirmation with a DOS-YYYY-XXXX order number.

**Independent Test**: Place a complete guest order from `/products` through to `/order/[id]/confirmation`. Verify order appears in Supabase `orders` table with correct server-side totals and the variant's `stock` is decremented.

### Backend — Product & Order APIs

- [X] T026 [P] [US1] Create `backend/schemas/product.py` — Pydantic models: `ProductListItem`, `ProductDetail`, `VariantResponse`, `ImageResponse`, `LensOptionGrouped`, `ProductListResponse`
- [X] T027 [P] [US1] Create `backend/schemas/order.py` — `OrderCreate`, `OrderResponse`, `CouponValidateRequest`, `CouponValidateResponse`, `ShippingRequest`, `ShippingResponse`
- [X] T028 [US1] Create `backend/routes/products.py` — `GET /api/products` (filters: category, gender, frame_shape, material, rim_type, min_price, max_price, is_featured, search; sort: newest|price_asc|price_desc|best_selling|top_rated; page, per_page); `GET /api/products/{slug}`; `GET /api/products/{slug}/lens-options` (grouped by type); `GET /api/products/{slug}/related` (4 same-category products)
- [X] T029 [US1] Create `backend/routes/cart.py` — `POST /api/cart/validate-coupon` (validate PromoCode: active, not expired, min_order, max_uses); `POST /api/cart/calculate-shipping` (0 if subtotal >= 3000 else 200)
- [X] T030 [US1] Create `backend/routes/upload.py` — `POST /api/upload/image` (admin-only; Cloudinary `deluxe-opt/products/`); `POST /api/upload/prescription` (no auth; Cloudinary `deluxe-opt/prescriptions/`; max 10MB)
- [X] T031 [US1] Create `backend/routes/orders.py` — `POST /api/orders` (optional auth; server-side: fetch variant price, fetch lens/coating/addon prices from LensOption, calculate totals using `helpers.py` functions, generate `order_number`, decrement `variant.stock`, increment `promo_code.used_count`, create Order record; return `order_number` + `total`)
- [X] T032 [US1] Mount routes in `backend/main.py`: include `products_router`, `cart_router`, `upload_router`, `orders_router` with prefix `/api`

### Frontend — Browse & Purchase Flow

- [X] T033 [P] [US1] Create `frontend/components/product/ProductCard.tsx` — 4:3 aspect image (`<Image>`), discount badge top-left, wishlist heart top-right, category badge bottom-left; body: SKU, name, star rating, size pills, price (orange) + strikethrough original, "Add to Cart" button
- [X] T034 [P] [US1] Create `frontend/components/product/ProductGallery.tsx` — vertical thumbnails left, main image right; click thumbnail → change main; click main → lightbox zoom; `<Image>` throughout
- [X] T035 [P] [US1] Create `frontend/components/product/WidthGuide.tsx` — "Width guide for: [name]"; Frame Widths tab + Other Measurements tab; spec diagram image; width table (Narrow|Medium|Wide in mm); active size highlighted in `#E8670A`
- [X] T036 [US1] Create `frontend/app/(store)/products/page.tsx` — 2-column layout (220px sidebar + main); sidebar: Sort By dropdown, Category/Gender/Frame Shape/Material checkboxes, Price Range inputs, active filter tags, Clear All; main: result count, product grid (`auto-fill min-220px`), pagination; calls `api.getProducts(params)` from `lib/api.ts`
- [X] T037 [P] [US1] Create `frontend/components/product/StickyBar.tsx` — `fixed bottom-0`, `bg-[#0F0F0F]`; left: thumbnail + name + variant + price; right: "Select Lenses" orange button + "Add to Cart" dark button; appears after scrolling past hero
- [X] T038 [US1] Create `frontend/app/(store)/products/[slug]/page.tsx` — 2-column: ProductGallery + WidthGuide (left sticky); right: breadcrumb, star rating, H1 (Cormorant Garamond), SKU+frame number, prices, color swatches, size buttons, "Select Lenses" orange CTA, payment info box, quantity selector, "Add to Cart" dark button, WhatsApp button, USP 2×2 grid; below: 3 tabs (Features & Size | Description | Lens Recommendation), related products (4 cards), reviews placeholder; StickyBar component
- [X] T039 [P] [US1] Create `frontend/components/lenses/LensStep1Usage.tsx` — lens type cards from API (icon, name, desc, price); progressives expand sub-options (premium|standard|mid|near); Non-Rx selected → step 2 skipped (hidden); single select
- [X] T040 [P] [US1] Create `frontend/components/lenses/LensStep2Prescription.tsx` — 2 option cards (Upload | Manual); Upload: drag-drop zone calling `api.uploadPrescription(file)`; Manual: OD/OS grid with SPH (-20 to +20, 0.25 step), CYL (-10 to +10, 0.25 step), Axis (1-180, 1-step), ADD (+0.75 to +3.50, 0.25 step), PD (52-76, 1mm step) — ALL dropdowns, no free text; warning box if |OD_SPH-OS_SPH|>3 or |OD_CYL-OS_CYL|>2 (non-blocking); "I'll enter later" skip button
- [X] T041 [P] [US1] Create `frontend/components/lenses/LensStep3Coating.tsx` — coating cards from API; single select; Standard Clear default (Rs. 0)
- [X] T042 [P] [US1] Create `frontend/components/lenses/LensStep4Addons.tsx` — add-on checkboxes from API; multiple select; UV400 shown as "Included Free" badge
- [X] T043 [US1] Create `frontend/components/lenses/LensPriceSummary.tsx` — sticky left sidebar: frame image, title, variant; live price rows (Frame | Lens | Coating | Add-ons | Total in orange); "Add to Cart" button (dark, enabled only after step 1 complete)
- [X] T044 [US1] Create `frontend/app/(store)/products/[slug]/select-lenses/page.tsx` — 2-column (LensPriceSummary left sidebar 320px + step content right); 5 step tabs (Usage|Prescription|Lens|Coatings|Add-Ons); Back + Continue buttons; step counter "Step X of 5"; completed steps show green checkmark; step 5: order review + "Add to Cart" + "Order via WhatsApp"; writes to `cartStore` on completion
- [X] T045 [P] [US1] Create `frontend/components/cart/CartItem.tsx` — frame image 60×60, name/color/size/SKU, lens info box, prescription summary, quantity −/+, item total (orange), remove link
- [X] T046 [P] [US1] Create `frontend/components/cart/CartSummary.tsx` — coupon input + Apply (calls `api.validateCoupon`), payment method 4 cards with 15% badge on 3, subtotal|coupon discount (green)|shipping|total, "Proceed to Checkout" button
- [X] T047 [US1] Create `frontend/app/(store)/cart/page.tsx` — shipping progress bar ("Rs. X away from free delivery"); CartItem list; CartSummary sticky sidebar; empty cart state (illustration + "Browse Frames" button)
- [X] T048 [US1] Create `frontend/app/(store)/checkout/page.tsx` — 3-step progress bar; Step 1: full name, phone (2-col), email, street address, city dropdown (`constants.ts`), province dropdown, order notes (optional); Step 2: 4 payment method cards (COD, EasyPaisa, JazzCash, Bank Transfer) with account details for EasyPaisa/JazzCash/Bank; Step 3: order summary review + "Place Order" button (orange, large); right sidebar: sticky order items + price breakdown (live); on success: `router.push('/order/[orderNumber]/confirmation')`
- [X] T049 [US1] Create `frontend/app/(store)/order/[orderId]/confirmation/page.tsx` — green checkmark, "Order Placed Successfully!", order ID in dark box (`#DOS-2026-0042`), order details card (customer, address, payment), items card (lens details + prescription summary), "Track My Order" + "Continue Shopping" buttons

**Checkpoint**: US1 fully functional — guest can complete end-to-end purchase. Verify with Supabase.

---

## Phase 4: User Story 2 — Customer Tracks an Order (Priority: P1)

**Goal**: Any user can enter an order number or phone number and see real-time order status with timeline.

**Independent Test**: Place a guest order then immediately look it up on `/tracking` by order number. Verify 4-step timeline shows "Placed" as completed.

- [X] T050 [US2] Add `GET /api/orders/track` to `backend/routes/orders.py` — query by `order_number` OR `phone`; return order status, 4-step timeline array (status, completed bool, timestamp), items summary, tracking_number; no auth required; 404 if not found
- [X] T051 [US2] Create `frontend/app/(store)/tracking/page.tsx` — search input (order number OR phone) + "Track" button; on result: order number + date, items summary (frame + lens info), status badge, 4-step timeline (green dot=completed, orange dot=current, grey dot=pending; each with date/time if completed); "not found" empty state

**Checkpoint**: US2 complete — order tracking works independently without account.

---

## Phase 5: User Story 3 — Registered Customer Manages Account (Priority: P2)

**Goal**: Customers can register, log in, view order history, manage wishlists, and update profiles.

**Independent Test**: Register a new account, place an order while logged in, verify it appears in `/account/orders` with correct status. Add a product to wishlist, verify it persists across page reload.

### Backend — Auth & Wishlist APIs

- [ ] T052 [P] [US3] Create `backend/schemas/auth.py` — `UserCreate`, `UserResponse`, `TokenResponse`, `LoginRequest`, `PasswordResetRequest`, `ProfileUpdate`, `ChangePasswordRequest`
- [ ] T053 [US3] Create `backend/routes/auth.py` — `POST /api/auth/register` (hash password, create User, return tokens); `POST /api/auth/login`; `POST /api/auth/refresh`; `POST /api/auth/forgot-password` (generate reset token, trigger email via BackgroundTasks); `POST /api/auth/reset-password` (verify token expiry); `GET /api/auth/me` (auth required); `PUT /api/auth/me` (update name/phone); `PUT /api/auth/change-password`
- [ ] T054 [P] [US3] Create `backend/schemas/wishlist.py` and `backend/routes/wishlist.py` — `GET /api/wishlist` (auth required, return product summaries); `POST /api/wishlist/{product_id}` (add, deduplicate); `DELETE /api/wishlist/{product_id}`
- [ ] T055 [P] [US3] Add `GET /api/orders/my-orders` and `GET /api/orders/{order_number}` (own order, auth required) to `backend/routes/orders.py`
- [ ] T056 [US3] Mount auth + wishlist routes in `backend/main.py`

### Frontend — Auth & Account Pages

- [ ] T057 [US3] Create `frontend/middleware.ts` — protect `/account/*` routes (redirect to `/login` if no valid `accessToken` in cookie/store); protect `/admin/*` routes (redirect to `/login` if not `isAdmin`)
- [ ] T058 [P] [US3] Create `frontend/app/(store)/login/page.tsx` — email + password fields, "Forgot password?" link, submit calls `api.login()` + `authStore.setTokens()`, redirect to previous page or `/`
- [ ] T059 [P] [US3] Create `frontend/app/(store)/register/page.tsx` — full name, email, phone, password, confirm password; submit calls `api.register()`, auto-login, redirect to `/`
- [ ] T060 [US3] Create `frontend/app/(store)/account/orders/page.tsx` — table: Order ID (link to detail) | Date | Items summary | Total | Status pill (yellow=Placed, orange=Processing, blue=Shipped, green=Delivered, red=Cancelled) | Action button (Track | Reorder); calls `api.getMyOrders()`
- [ ] T061 [P] [US3] Create `frontend/app/(store)/account/wishlist/page.tsx` — ProductCard grid with remove button overlay; calls `api.getWishlist()` and `api.removeFromWishlist(productId)`
- [ ] T062 [P] [US3] Create `frontend/app/(store)/account/profile/page.tsx` — Edit form (full name, phone, email — read-only); save calls `api.updateProfile()`; change password section (current + new + confirm); account sidebar nav (Orders | Wishlist | Profile | Change Password | Logout)

**Checkpoint**: US3 complete — registration, login, order history, wishlist, profile all independently testable.

---

## Phase 6: User Story 4 — Admin Manages Products & Inventory (Priority: P2)

**Goal**: Admin can create, edit, manage variants, upload images, assign lens options, and adjust stock without leaving the admin panel.

**Independent Test**: Create a product in `/admin/products/new`, set to Active, verify it appears on `/products`. Edit stock in `/admin/inventory`, verify the listing page reflects updated availability.

### Backend — Admin Product & Inventory APIs

- [ ] T063 [P] [US4] Create `backend/schemas/admin_product.py` — `ProductCreate`, `ProductUpdate`, `VariantCreate`, `VariantUpdate`, `ImageReorder`, `LensOptionAssign`
- [ ] T064 [US4] Create `backend/routes/admin/products.py` — `GET /api/admin/products` (all including inactive, paginated, with search + category + status filters); `POST /api/admin/products` (create product); `GET /api/admin/products/{id}`; `PUT /api/admin/products/{id}`; `DELETE /api/admin/products/{id}` (soft: `is_active=False`); `POST/PUT/DELETE /api/admin/products/{id}/variants`; `POST/DELETE /api/admin/products/{id}/images`; `PUT /api/admin/products/{id}/images/reorder` (update sort_order by array position); `PUT /api/admin/products/{id}/lens-options` (replace all ProductLensOption entries)
- [ ] T065 [P] [US4] Create `backend/routes/admin/inventory.py` — `GET /api/admin/inventory` (all variants with stock, product name, threshold, status: in_stock|low_stock|out_of_stock; filter by status); `PUT /api/admin/inventory/{variant_id}` (update stock directly)
- [ ] T066 [US4] Mount admin product + inventory routes in `backend/main.py` (all under `/api/admin` prefix, all require `get_current_admin` dependency)

### Frontend — Admin Product & Inventory Pages

- [ ] T067 [US4] Create `frontend/components/layout/AdminSidebar.tsx` — 220px dark `bg-[#0F0F0F]`; logo "DeluxeOpt Admin Panel"; nav sections with icons: Dashboard, Orders (pending count badge), Products, Reviews (unapproved count badge), Inventory, Promo Codes, Blogs, Lens Options, Lens Collection, FAQs; active: left orange border
- [ ] T068 [US4] Create `frontend/app/admin/layout.tsx` — AdminSidebar + top bar (page title Cormorant Garamond 20px + action buttons right); wraps all `/admin/*` pages
- [ ] T069 [US4] Create `frontend/app/admin/products/page.tsx` — search bar + category/status filters; table (image|name|SKU|category|price|stock status|active|edit/delete actions); "Add Product" button → `/admin/products/new`
- [ ] T070 [US4] Create `frontend/app/admin/products/new/page.tsx` and `frontend/app/admin/products/[id]/edit/page.tsx` — main column sections: (1) Basic Info (name, SKU auto-suggest, category, gender, frame number, frame shape, material, weight), (2) Pricing (original price, sale price), (3) Product Images (drag-drop multi-upload, thumbnails with reorder drag + delete ×, first=main), (4) Variants Table (inline edit: color name, color hex with color picker + dot, size label, lens□bridge-temple, SKU auto, price, stock, active; "+ Add Row" button), (5) Description (Tiptap rich text toolbar: B|I|U|H1|H2|H3|•|1.|Link|Image|Quote; description image upload), (6) Frame Specs (frame/lens/bridge/temple/lens-height mm inputs, rim type, spec diagram upload), (7) Lens Options checkboxes (lens types, coatings, add-ons from API); right sidebar: Status dropdown (Active/Draft), Featured checkbox, SEO (meta title, meta desc, URL slug auto-generated)
- [ ] T071 [US4] Create `frontend/app/admin/inventory/page.tsx` — table (product name|color|size|SKU variant|stock|status badge); status: green=In Stock, orange=Low Stock (≤ threshold), red=Out of Stock (0); click stock number → inline input → save; filter toggle (show all | low stock only | out of stock only)

**Checkpoint**: US4 complete — admin can fully manage products and inventory independently.

---

## Phase 7: User Story 5 — Admin Processes Orders (Priority: P2)

**Goal**: Admin can view all orders, update statuses, add tracking numbers, and the customer receives automated email at each change.

**Independent Test**: Place an order, open `/admin/orders`, update status to "Shipped" with a tracking number, verify the order status updates and the Shipped email is triggered (check Resend dashboard).

### Backend — Admin Dashboard & Order APIs

- [ ] T072 [P] [US5] Create `backend/schemas/admin_order.py` and `backend/schemas/admin_dashboard.py`
- [ ] T073 [US5] Create `backend/routes/admin/dashboard.py` — `GET /api/admin/dashboard/stats` (today_orders, today_revenue, pending_orders, low_stock_items, orders_7d array, orders_by_status dict); `GET /api/admin/dashboard/recent-orders` (last 10); `GET /api/admin/dashboard/pending-reviews`; `GET /api/admin/dashboard/low-stock`
- [ ] T074 [US5] Create `backend/routes/admin/orders.py` — `GET /api/admin/orders` (filter by status|payment_method|search, paginated); `GET /api/admin/orders/{id}` (full detail: customer+frame+lens+prescription+payment); `PUT /api/admin/orders/{id}/status` (validate transition; update status; trigger email via BackgroundTasks based on new status)
- [ ] T075 [US5] Mount admin dashboard + order routes in `backend/main.py`

### Frontend — Admin Dashboard & Orders Pages

- [ ] T076 [US5] Create `frontend/app/admin/page.tsx` — quick action buttons (Add Product | View Pending Orders | Approve Reviews with count); 4 stat cards (Today's Orders, Today's Revenue, Pending Orders, Low Stock Items with sub-text); 2 Recharts charts: LineChart (revenue+orders last 7 days) + PieChart (orders by status); 2-column grid: Recent Orders table + Pending Reviews table (with inline Approve/Reject actions); Low Stock Alerts table
- [ ] T077 [US5] Create `frontend/app/admin/orders/page.tsx` — filter tabs: All|Pending|Processing|Shipped|Delivered|Cancelled; search bar (order number, customer name, phone); table: Order ID|Customer|Date|Items summary|Payment method|Total|Status pill|"View" action link
- [ ] T078 [US5] Create `frontend/app/admin/orders/[id]/page.tsx` — 3 info blocks: (1) Customer (name, phone, email, address), (2) Frame (product name, color, size, SKU, quantity), (3) Lens (type, sub-type, coating, add-ons, prescription method + all values if manual); payment strip (method|frame|lens|coating|addon|coupon|discount|shipping|TOTAL); status update dropdown + "Update Status" button; tracking number input (visible when status=shipped); status change validates allowed transitions

**Checkpoint**: US5 complete — admin can fully manage order lifecycle; email triggers wired (but email service implemented in US8).

---

## Phase 8: User Story 6 — Admin Moderates Reviews (Priority: P3)

**Goal**: Customer-submitted reviews queue for admin approval; approved reviews appear publicly; featured reviews show on homepage.

**Independent Test**: Submit a review on a product detail page. Open `/admin/reviews` and verify it appears in Pending tab. Approve it and verify it appears on the product page.

### Backend — Review APIs

- [ ] T079 [P] [US6] Create `backend/schemas/review.py` — `ReviewCreate`, `ReviewResponse`, `ReviewListResponse`
- [ ] T080 [US6] Create `backend/routes/reviews.py` — `POST /api/reviews` (create with `is_approved=False`); `GET /api/reviews/product/{product_id}` (approved only, paginated); `GET /api/reviews/featured` (`is_featured=True`, approved only)
- [ ] T081 [US6] Create `backend/routes/admin/reviews.py` — `GET /api/admin/reviews` (all, filter by `is_approved`); `PUT /api/admin/reviews/{id}/approve`; `PUT /api/admin/reviews/{id}/reject` (delete); `PUT /api/admin/reviews/{id}/feature` (toggle `is_featured`)
- [ ] T082 [US6] Mount review + admin review routes in `backend/main.py`

### Frontend — Reviews on Product Page & Admin

- [ ] T083 [US6] Extend `frontend/app/(store)/products/[slug]/page.tsx` — add Reviews section below tabs: overall rating + 5-star breakdown bars; "Write a Review" button → modal/form (name, email, rating stars, title, body, image upload); individual review cards (name, verified badge if `order_id`, stars, title, body, images, date); "Load more" pagination; calls `api.getProductReviews(productId, page)` and `api.submitReview(data)`
- [ ] T084 [US6] Create `frontend/app/admin/reviews/page.tsx` — filter tabs: Pending (default)|Approved|All; table: Customer|Product|Rating stars|Review excerpt|Date|Actions (Approve green btn|Reject red btn|View full opens modal); full review modal: complete text + images + customer info + product link; Approve/Reject/Feature toggle actions

**Checkpoint**: US6 complete — review pipeline (submit → moderate → publish → homepage) fully functional.

---

## Phase 9: User Story 7 — Admin Creates and Publishes Blog Content (Priority: P3)

**Goal**: Admin can write, save as draft, and publish blog articles; published blogs appear publicly with category filtering.

**Independent Test**: Create a blog in admin CMS, save as Draft — verify it does NOT appear on `/blogs`. Click Publish — verify it appears on `/blogs` with correct category.

### Backend — Blog APIs

- [ ] T085 [P] [US7] Create `backend/schemas/blog.py`
- [ ] T086 [US7] Create `backend/routes/blogs.py` — `GET /api/blogs` (published only, category filter, paginated with `read_time_minutes`); `GET /api/blogs/{slug}` (published only, 404 if unpublished)
- [ ] T087 [US7] Create `backend/routes/admin/blogs.py` — full CRUD; `POST /api/admin/blogs/{id}/publish` (set `is_published=True`, `published_at=now()`); `POST /api/admin/blogs/{id}/unpublish`
- [ ] T088 [US7] Mount blog + admin blog routes in `backend/main.py`

### Frontend — Blog Pages & Admin CMS

- [ ] T089 [P] [US7] Create `frontend/app/(store)/blogs/page.tsx` — dark hero ("Optical Blog"); category filter pills (All|Lens Guide|Frame Style|Eye Health|Prescription Tips); blog card grid (`auto-fill min-280px`); each card: cover image, category badge, title, excerpt, date + read time; calls `api.getBlogs(category, page)`
- [ ] T090 [P] [US7] Create `frontend/app/(store)/blogs/[slug]/page.tsx` — full-width cover image; category + title + date; `dangerouslySetInnerHTML` for rich HTML `content` inside scoped prose styles; related blogs (3 cards from same category)
- [ ] T091 [US7] Create `frontend/app/admin/blogs/page.tsx` — table: title|category|status (Draft/Published badge)|published date|edit/delete actions; "New Blog" button
- [ ] T092 [US7] Create `frontend/app/admin/blogs/new/page.tsx` and `frontend/app/admin/blogs/[id]/edit/page.tsx` — 2-column layout: editor (Blog Title input Cormorant Garamond; Cover Image upload; Tiptap rich text content) + settings sidebar (category dropdown, URL slug auto-generated from title, meta description, status Draft/Published); action buttons: "Save Draft" + "Publish"

**Checkpoint**: US7 complete — blog CMS pipeline (draft → publish → public) fully functional.

---

## Phase 10: User Story 8 — System Recovers Abandoned Carts (Priority: P4)

**Goal**: When a cart with an email is abandoned for 2 hours, the system automatically sends a reminder email. All transactional emails fire on correct triggers.

**Independent Test**: Verify all 8 email templates render correctly in Resend dashboard. Trigger an abandoned cart scenario and confirm email sends within 5 minutes of the 2-hour window.

- [ ] T093 [US8] Create `backend/services/email.py` — configure Resend client from `RESEND_API_KEY`; implement all 8 email template functions: `send_welcome_email(user)`, `send_order_confirmation(order, items)`, `send_order_processing(order)`, `send_order_shipped(order, tracking_number)`, `send_order_delivered(order)`, `send_abandoned_cart(email, cart_items)`, `send_review_request(order)`, `send_password_reset(email, reset_token, expires_in_hours=1)`; all use HTML templates with brand colours (`#E8670A`, `#0F0F0F`)
- [ ] T094 [US8] Create `backend/services/scheduler.py` — APScheduler `BackgroundScheduler`; Job 1: every 30 minutes, query `abandoned_carts` where `email_sent=False` AND `email IS NOT NULL` AND `created_at <= now()-2h` AND session not in orders → send abandoned cart email, set `email_sent=True`; Job 2: every 15 minutes, query `orders` where `status=delivered` AND `review_email_sent=False` AND `updated_at <= now()-3d` → send review request email, set `review_email_sent=True`
- [ ] T095 [US8] Wire email triggers into existing auth + order routes: in `backend/routes/auth.py` register → `BackgroundTasks.add_task(send_welcome_email, user)`; forgot-password → `BackgroundTasks.add_task(send_password_reset, email, token)`
- [ ] T096 [US8] Wire order status emails into `backend/routes/admin/orders.py` status update handler: processing → `send_order_processing`; shipped → `send_order_shipped(order, tracking_number)`; delivered → `send_order_delivered` + schedule review request via APScheduler one-time job or set `review_email_sent=False` for scheduler to pick up; order creation → `send_order_confirmation`
- [ ] T097 [US8] Initialize APScheduler in `backend/main.py` lifespan (`@asynccontextmanager`): start scheduler on startup, shut down on shutdown; re-queue on startup by resetting `email_sent=False` for carts older than 2h that haven't been emailed (scheduler will catch them in first tick)

**Checkpoint**: US8 complete — all 8 email templates wired; abandoned cart and review request auto-triggered.

---

## Phase 11: Homepage & Content Routes

**Purpose**: Homepage sections and supporting content routes (no dedicated user story — serves overall product discovery)

- [ ] T098 [P] Create `backend/routes/lens_collection.py` — `GET /api/lens-collection` (active, ordered by sort_order); mount in `backend/main.py`
- [ ] T099 [P] Create `backend/schemas/faq.py` and `backend/routes/faqs.py` — `GET /api/faqs` (active, optional category filter, ordered by sort_order); mount in `backend/main.py`
- [ ] T100 [P] Create `frontend/components/home/HeroSlider.tsx` — 3 slides, auto-play 5s, manual dot navigation; dark bg; left: eyebrow + H1 (Cormorant Garamond) + subtitle + 2 CTA buttons + 4 stats (2,400+ Customers|500+ Styles|3–5 Day Delivery|7-Day Returns); right: main image + 2 thumbnails; all `<Image>` components
- [ ] T101 [P] Create `frontend/components/home/GenderCards.tsx` (2-col: Men's|Women's Collection; dark overlay image, title, CTA button) and `frontend/components/home/CategoryGrid.tsx` (6 category cards auto-fill; icon + name + product count from API)
- [ ] T102 [P] Create `frontend/components/home/LensCollectionSection.tsx` — left: video player + lens type pills (click pill → change video + highlight); right: active lens detail box + other lenses list rows; calls `api.getLensCollection()`; first item active by default
- [ ] T103 [P] Create `frontend/components/home/ReviewsStrip.tsx` — overall "4.8 ★" + 3 featured review cards; calls `api.getFeaturedReviews()`
- [ ] T104 Create `frontend/app/(store)/page.tsx` — homepage: 13 sections in order (AnnounceBar via layout, Hero Slider, Trust Strip, Gender Cards, Category Grid, Bestsellers 4 cards from API, Prescription CTA static banner, New Arrivals 4 cards from API, Lens Collection Section, Reviews Strip, Newsletter CTA orange bg, footer via layout)

---

## Phase 12: Info Pages

**Purpose**: Informational customer-facing pages

- [ ] T105 [P] Create `frontend/app/(store)/about/page.tsx` — dark hero; stats grid (2,400+|500+|4.8★|3–5 Day); 2-col story section (text + image placeholder); mission statement
- [ ] T106 [P] Create `frontend/app/(store)/contact/page.tsx` — dark hero; 2-col: contact form (name, phone, email, subject dropdown, message, submit) + info blocks (WhatsApp|Email|Location|Working Hours)
- [ ] T107 Create `frontend/app/(store)/faq/page.tsx` — dark hero; 2-col: category nav left (All|Orders & Delivery|Prescription & Lenses|Payments & Returns|Frame Fitting) + accordion FAQ right; calls `api.getFaqs(category)`; expand/collapse answer
- [ ] T108 [P] Create `frontend/app/(store)/lens-guide/page.tsx` — dark hero; content sections per lens type; CTA "Shop Blue Cut Frames"
- [ ] T109 [P] Create `frontend/app/(store)/shipping-returns/page.tsx` — dark hero; delivery policy card with numbered timeline; returns policy card; free shipping info box (orange-tinted, `bg-[#FFF0E6]`)

---

## Phase 13: Admin Remaining (Promo Codes, Lens Options, FAQs, Lens Collection)

**Purpose**: Complete admin panel for content and product configuration management

- [ ] T110 Create `backend/routes/admin/promo_codes.py` (full CRUD), `backend/routes/admin/faqs.py` (CRUD + reorder), `backend/routes/admin/lens_options.py` (CRUD + reorder), `backend/routes/admin/lens_collection.py` (CRUD + reorder + video upload via Cloudinary); mount all in `backend/main.py`
- [ ] T111 [P] Create `frontend/app/admin/promo-codes/page.tsx` — table: code|type|value|min order|used/max|active|expires|actions; Create/Edit form in modal with all PromoCode fields; code auto-uppercased
- [ ] T112 [P] Create `frontend/app/admin/faqs/page.tsx` — table with drag-to-reorder rows; Create/Edit modal (question, answer, category, sort_order, active toggle); `PUT /api/admin/faqs/reorder` on drop
- [ ] T113 [P] Create `frontend/app/admin/lens-options/page.tsx` — 3 tabs (Lens Types|Coatings|Add-ons); table per tab (name|price|description|active|sort order|actions); drag-to-reorder; Create/Edit modal
- [ ] T114 [P] Create `frontend/app/admin/lens-collection/page.tsx` — table (name|video|price_from|active|sort|actions); Create/Edit modal with video file upload (Cloudinary `deluxe-opt/lens-collections/`) + all fields + color dot picker; drag-to-reorder

---

## Phase 14: Polish & Cross-Cutting Concerns

**Purpose**: Mobile responsiveness, loading states, error states, SEO

- [ ] T115 [P] Mobile responsive pass — open all 19 customer pages at 365px viewport; fix any horizontal overflow, font sizes, padding, grid collapses; verify `Header.tsx` hamburger menu works; verify sidebar filter in products page is drawer on mobile
- [ ] T116 [P] Add loading skeleton components — `frontend/components/ui/Placeholder.tsx` skeletons for: ProductCard (use in listing while loading), OrderRow (use in account orders), AdminTableRow (use in all admin tables); implement with Tailwind `animate-pulse bg-[#f3f4f6]`
- [ ] T117 [P] Add error and empty states — Empty cart (`/cart` with no items), No products found (listing with filters that return 0 results), Order not found (tracking page), 404 page (`frontend/app/not-found.tsx`), generic API error toast (implement via simple `useState` toast in `frontend/components/ui/Toast.tsx`)
- [ ] T118 [P] Add SEO meta tags to all customer-facing pages — use Next.js `generateMetadata()` in each page file: product detail (title=product name, description=meta_description), blog detail (title=blog title), product listing (title="Shop Eyewear — DeluxeOpt"), homepage (title="Deluxe Opt Service — Pakistani Eyewear")
- [ ] T119 Run TypeScript compiler check across entire frontend: `tsc --noEmit` — resolve all type errors until zero remain
- [ ] T120 Run final backend route audit — test all 50+ endpoints via `http://localhost:8000/docs`; verify correct status codes, response shapes match contracts, auth guards work on all `/api/admin/*` routes
- [ ] T121 Final commit — `git commit -m "[PHASE-9] Polish complete — zero TS errors, all routes validated, mobile responsive"`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Phase 2 — primary MVP, start first
- **Phase 4 (US2)**: Depends on Phase 2 + `backend/routes/orders.py` from Phase 3 (T031)
- **Phase 5 (US3)**: Depends on Phase 2 — independent of US1/US2
- **Phase 6 (US4)**: Depends on Phase 2 — independent of US1–US3
- **Phase 7 (US5)**: Depends on Phase 2 + admin layout from Phase 6 (T067/T068)
- **Phase 8 (US6)**: Depends on Phase 2; frontend depends on product detail page (T038/T083)
- **Phase 9 (US7)**: Depends on Phase 2 — independent of all other stories
- **Phase 10 (US8)**: Depends on Phase 2; email wiring depends on auth routes (T053) + order routes (T031, T074)
- **Phase 11 (Homepage)**: Depends on Phase 3 (product API needed for bestsellers/new arrivals)
- **Phase 12 (Info Pages)**: Depends on Phase 2 (FAQ API needed)
- **Phase 13 (Admin Remaining)**: Depends on admin layout (Phase 6, T067/T068)
- **Phase 14 (Polish)**: Depends on all previous phases

### User Story Dependencies

| Story | Depends on | Can start after |
|-------|-----------|----------------|
| US1 (P1) | Phase 2 | Foundation complete |
| US2 (P1) | Phase 2 + T031 | US1 order creation route |
| US3 (P2) | Phase 2 | Foundation complete (parallel with US1) |
| US4 (P2) | Phase 2 | Foundation complete (parallel with US1–US3) |
| US5 (P2) | Phase 2 + T067/T068 | Admin layout (US4 first) |
| US6 (P3) | Phase 2 + T038 | Product detail page (US1 first) |
| US7 (P3) | Phase 2 | Foundation complete (parallel with others) |
| US8 (P4) | T053 + T031 + T074 | Auth + order creation + admin order update routes |

### Within Each User Story

1. Backend schemas ([P] parallelizable with each other)
2. Backend routes (depends on schemas)
3. Mount routes in main.py
4. Frontend components ([P] parallelizable with each other)
5. Frontend pages (depends on components)

---

## Parallel Opportunities

```bash
# Phase 1: All setup tasks can run in parallel
T001 | T002 | T003 | T004 | T005 | T006

# Phase 2: Backend and frontend foundational tasks can run in parallel
T007 → T008 → T009 → T010 → T011   (sequential: model → migration → app)
T013                                  (parallel: cloudinary service)
T014 | T015 | T016 | T017            (parallel: frontend foundation)
T018 | T019                           (parallel: Zustand stores)
T020 | T021 | T022 | T023 | T024    (parallel: layout components)

# Phase 3 (US1): Schemas and components run in parallel
T026 | T027   (backend schemas in parallel)
T033 | T034 | T035 | T037  (frontend components in parallel)
T039 | T040 | T041 | T042  (lens step components in parallel)
T045 | T046                (cart components in parallel)

# Phase 11: Homepage components run in parallel
T098 | T099 | T100 | T101 | T102 | T103

# Phase 12: Info pages run in parallel
T105 | T106 | T108 | T109
```

---

## Implementation Strategy

### MVP First (US1 + US2 Only)

1. Complete **Phase 1**: Setup (~1 day)
2. Complete **Phase 2**: Foundational (~2-3 days)
3. Complete **Phase 3**: US1 — Guest Purchase (~5-7 days)
4. Complete **Phase 4**: US2 — Order Tracking (~1 day)
5. **STOP and VALIDATE**: Place a complete guest order, track it. Core e-commerce loop works.
6. Add products via Supabase directly for testing (admin panel comes later)

### Incremental Delivery

| Milestone | User Stories | What's Live |
|-----------|-------------|------------|
| MVP | US1 + US2 | Browse → buy → track |
| M2 | + US3 | Account login + order history |
| M3 | + US4 + US5 | Full admin panel (products + orders) |
| M4 | + US6 + US7 | Reviews + blog CMS |
| M5 | + US8 | Email automation |
| Full | + Homepage + Info + Polish | Complete website |

---

## Notes

- **[P]** = different files, no incomplete dependencies — safe to parallelize
- **[USN]** maps each task to the user story it delivers
- Commit after each task or logical group: `git commit -m "[TASK-TXxx] description"`
- Check wireframe at `wireframe/DeluxeOpt_Wireframe_Complete.html` before coding each page (desktop AND mobile toggle)
- Run `tsc --noEmit` after every 5–10 frontend tasks to catch type errors early
- All `<img>` → `<Image>` from next/image; no exceptions
- All styles → Tailwind classes only; no inline styles, no CSS modules
- All API calls → through `frontend/lib/api.ts`; no direct axios/fetch in components
