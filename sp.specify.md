# Deluxe Opt Service — Complete Website Specification
# Run this with: /sp.specify (paste full content when prompted)
# Covers: Frontend + Backend + Database — entire website

---

## OVERVIEW

Build a complete Pakistani eyewear e-commerce website called **Deluxe Opt Service**.
The wireframe at `wireframe/DeluxeOpt_Wireframe_Complete.html` is the visual source of
truth — read it fully before implementing anything. This spec covers every page, every
API endpoint, and the complete database schema from scratch.

---

## SECTION 1 — DATABASE (Build First)

### 1.1 All Models (SQLAlchemy)

Create all models in `backend/models/`. Run Alembic after each model group.

#### User
```
id, email (unique), hashed_password, full_name, phone,
is_active (default True), is_admin (default False),
created_at, updated_at
```

#### Product
```
id, name, slug (unique, auto-generated), sku (unique, e.g. DOS-SG-001),
frame_number (e.g. 52-18-140), category (enum: sunglasses|prescription|blue-cut|screen|transition|kids),
gender (enum: men|women|unisex|kids), frame_shape (enum: round|square|oval|cat-eye|aviator|wayfarer),
material, rim_type (enum: full-rim|half-rim|rimless), weight_grams (float),
original_price (float), sale_price (float, nullable),
description (Text, rich HTML), description_image_url (nullable),
spec_image_url (nullable — frame dimension diagram),
frame_width_mm, lens_width_mm, bridge_mm, temple_mm, lens_height_mm (all int),
meta_title, meta_description, meta_slug,
is_active (default True), is_featured (default False),
track_inventory (default True), low_stock_threshold (default 5),
created_at, updated_at
```

#### ProductImage
```
id, product_id (FK→Product), url, sort_order (int, 0=main), created_at
```

#### ProductVariant
```
id, product_id (FK→Product),
color_name (e.g. "Gold"), color_hex (e.g. "#8B6914"),
size_label (e.g. "Medium"), size_code (e.g. "M"),
lens_width (int, e.g. 50), bridge (int, e.g. 21), temple (int, e.g. 145),
sku_variant (unique, e.g. DOS-SG-001-M-GLD),
price (float, overrides product price if set),
stock (int, default 0), is_active (default True)
```

#### LensOption
```
id, name (e.g. "Single Vision"), type (enum: lens-type|coating|addon),
sub_type (nullable, for progressives: premium|standard|mid|near),
price (float), description (Text),
is_active (default True), sort_order (int)
```

#### ProductLensOption (many-to-many join)
```
product_id (FK→Product), lens_option_id (FK→LensOption)
PRIMARY KEY (product_id, lens_option_id)
```

#### LensCollection (homepage video section)
```
id, name (e.g. "Transitions"), video_url (Cloudinary),
description (Text), bullets (JSON array of strings),
price_from (float), color_dot (hex), is_active (default True), sort_order (int)
```

#### Order
```
id, order_number (unique, format: DOS-YYYY-XXXX, generated server-side),
user_id (FK→User, nullable for guest orders),
customer_name, customer_phone, customer_email,
address, city, province, order_notes (nullable),
variant_id (FK→ProductVariant),
quantity (int, default 1),
frame_price (float),
lens_type (nullable), lens_sub_type (nullable),
coating (nullable), add_ons (JSON array, nullable),
lens_price (float, default 0), coating_price (float, default 0), addon_price (float, default 0),
prescription_method (enum: manual|upload|none, nullable),
prescription_data (JSON: {od_sph, od_cyl, od_axis, os_sph, os_cyl, os_axis, add, pd}, nullable),
rx_image_url (nullable),
payment_method (enum: cod|easypaisa|jazzcash|bank-transfer),
payment_discount_pct (float, default 0),
coupon_code (nullable), coupon_discount (float, default 0),
subtotal (float), shipping_fee (float, default 0), total (float),
status (enum: placed|processing|shipped|delivered|cancelled, default: placed),
tracking_number (nullable),
created_at, updated_at
```

#### Review
```
id, product_id (FK→Product), order_id (FK→Order, nullable),
customer_name, customer_email,
rating (int, 1–5), title, body (Text),
images (JSON array of URLs),
is_approved (default False), is_featured (default False),
created_at
```

#### Blog
```
id, title, slug (unique), cover_image_url (nullable),
category (enum: lens-guide|frame-style|eye-health|prescription-tips),
content (Text, rich HTML),
meta_title, meta_description,
is_published (default False), published_at (nullable),
created_at, updated_at
```

#### PromoCode
```
id, code (unique, uppercase), discount_type (enum: percentage|fixed),
discount_value (float), min_order (float, nullable),
max_uses (int, nullable), used_count (int, default 0),
is_active (default True), expires_at (nullable)
```

#### FAQ
```
id, question, answer (Text),
category (enum: orders|prescription|payments|fitting|general),
sort_order (int), is_active (default True)
```

#### AbandonedCart (for APScheduler)
```
id, session_id (unique), email (nullable), phone (nullable),
cart_data (JSON), email_sent (default False),
created_at, updated_at
```

---

## SECTION 2 — BACKEND API (FastAPI)

### 2.1 Auth Routes (`/api/auth`)

```
POST /api/auth/register
  Body: { full_name, email, phone, password }
  → Creates user, sends Welcome email (BackgroundTasks)
  → Returns: { access_token, refresh_token, user }

POST /api/auth/login
  Body: { email, password }
  → Returns: { access_token, refresh_token, user }

POST /api/auth/refresh
  Body: { refresh_token }
  → Returns: { access_token }

POST /api/auth/forgot-password
  Body: { email }
  → Sends password reset email (BackgroundTasks)

POST /api/auth/reset-password
  Body: { token, new_password }
```

### 2.2 Product Routes (`/api/products`)

```
GET /api/products
  Query params:
    category, gender, frame_shape, material, rim_type
    min_price, max_price
    is_featured, search (text search on name/sku)
    page (default 1), per_page (default 20)
    sort: newest|price_asc|price_desc|best_selling|top_rated
  → Returns paginated product list with variants summary

GET /api/products/{slug}
  → Returns full product detail:
    product fields + all variants + all images (sorted by sort_order)
    + avg_rating + review_count + lens_options for this product

GET /api/products/{slug}/lens-options
  → Returns lens options assigned to this product (from ProductLensOption join)
  → Grouped by type: lens-types, coatings, addons

GET /api/products/{slug}/related
  → Returns 4 related products (same category, different product)
```

### 2.3 Reviews Routes (`/api/reviews`)

```
POST /api/reviews
  Body: { product_id, order_id (optional), customer_name, customer_email, rating, title, body, images[] }
  → Creates review with is_approved=False
  → Returns: { review }

GET /api/reviews/product/{product_id}
  → Returns approved reviews for a product with pagination
  Query: page, per_page (default 10)
```

### 2.4 Cart Routes (`/api/cart`)

```
POST /api/cart/validate-coupon
  Body: { code, subtotal }
  → Validates promo code
  → Returns: { valid, discount_type, discount_value, message }

POST /api/cart/calculate-shipping
  Body: { subtotal }
  → Returns: { shipping_fee } (0 if subtotal >= 3000, else 200)
```

### 2.5 Order Routes (`/api/orders`)

```
POST /api/orders
  Body: {
    customer_name, customer_phone, customer_email,
    address, city, province, order_notes,
    variant_id, quantity,
    lens_type, lens_sub_type, coating, add_ons,
    prescription_method, prescription_data, rx_image_url,
    payment_method, coupon_code
  }
  Auth: optional (guest or logged-in)
  → Calculates totals server-side (frame price + lens + coating + addons - discounts)
  → Generates order_number (DOS-YYYY-XXXX)
  → Decrements stock on variant
  → Sends Order Confirmation email (BackgroundTasks)
  → Returns: { order }

GET /api/orders/track
  Query: order_number OR phone
  → Returns order status + timeline (no auth required)

GET /api/orders/my-orders
  Auth: required
  → Returns logged-in user's order history

GET /api/orders/{order_number}
  Auth: required (own order) or admin
  → Returns full order detail
```

### 2.6 Wishlist Routes (`/api/wishlist`)

```
GET    /api/wishlist          Auth: required → user's wishlist
POST   /api/wishlist/{product_id}   Auth: required → add to wishlist
DELETE /api/wishlist/{product_id}   Auth: required → remove from wishlist
```

### 2.7 Upload Route (`/api/upload`)

```
POST /api/upload/image
  Multipart: file
  → Uploads to Cloudinary
  → Returns: { url, public_id }

POST /api/upload/prescription
  Multipart: file
  → Uploads prescription photo to Cloudinary (folder: prescriptions/)
  → Returns: { url, public_id }
```

### 2.8 Blogs Routes (`/api/blogs`)

```
GET /api/blogs
  Query: category, page, per_page
  → Returns published blogs only

GET /api/blogs/{slug}
  → Returns full blog detail (published only)
```

### 2.9 FAQs Route (`/api/faqs`)

```
GET /api/faqs
  Query: category (optional)
  → Returns active FAQs ordered by sort_order
```

### 2.10 Lens Collection Route (`/api/lens-collection`)

```
GET /api/lens-collection
  → Returns active lens collections ordered by sort_order
  → Used for homepage video section
```

---

## SECTION 3 — ADMIN API (FastAPI, all require is_admin=True)

### 3.1 Admin Dashboard (`/api/admin/dashboard`)

```
GET /api/admin/dashboard/stats
  → Returns:
    today_orders (count), today_revenue (sum),
    pending_orders (count), low_stock_items (count),
    total_orders_7d (array by day for chart),
    total_revenue_7d (array by day for chart),
    orders_by_status (dict: placed|processing|shipped|delivered|cancelled counts)

GET /api/admin/dashboard/recent-orders
  → Returns last 10 orders with customer + status

GET /api/admin/dashboard/pending-reviews
  → Returns reviews where is_approved=False

GET /api/admin/dashboard/low-stock
  → Returns variants where stock <= product.low_stock_threshold
```

### 3.2 Admin Products (`/api/admin/products`)

```
GET    /api/admin/products          → all products (including inactive), paginated
POST   /api/admin/products          → create product + variants + lens options
GET    /api/admin/products/{id}     → full product detail for edit form (pre-filled)
PUT    /api/admin/products/{id}     → update product
DELETE /api/admin/products/{id}     → soft delete (is_active=False)

POST   /api/admin/products/{id}/variants        → add variant
PUT    /api/admin/products/{id}/variants/{vid}  → update variant (stock, price, active)
DELETE /api/admin/products/{id}/variants/{vid}  → delete variant

POST   /api/admin/products/{id}/images          → upload image (Cloudinary)
DELETE /api/admin/products/{id}/images/{img_id} → delete image
PUT    /api/admin/products/{id}/images/reorder  → update sort_order

PUT    /api/admin/products/{id}/lens-options    → set lens options for product
  Body: { lens_option_ids: [1, 2, 3] }
```

### 3.3 Admin Orders (`/api/admin/orders`)

```
GET /api/admin/orders
  Query: status, payment_method, search (order_number/customer name/phone), page, per_page
  → Full order list with all details

GET /api/admin/orders/{id}
  → Full order detail: customer + frame + lens + prescription + payment

PUT /api/admin/orders/{id}/status
  Body: { status, tracking_number (optional) }
  → Updates status
  → If status=shipped: sends Shipped email with tracking (BackgroundTasks)
  → If status=delivered: sends Delivered email (BackgroundTasks), schedules review request (3 days)
  → If status=processing: sends Processing email (BackgroundTasks)
```

### 3.4 Admin Reviews (`/api/admin/reviews`)

```
GET /api/admin/reviews
  Query: is_approved (true|false|all), page
  → All reviews

PUT /api/admin/reviews/{id}/approve  → is_approved=True
PUT /api/admin/reviews/{id}/reject   → delete review
PUT /api/admin/reviews/{id}/feature  → is_featured=True/False
```

### 3.5 Admin Blogs (`/api/admin/blogs`)

```
GET    /api/admin/blogs
POST   /api/admin/blogs          → create blog (draft)
GET    /api/admin/blogs/{id}
PUT    /api/admin/blogs/{id}     → update blog
DELETE /api/admin/blogs/{id}

POST /api/admin/blogs/{id}/publish   → is_published=True, sets published_at
POST /api/admin/blogs/{id}/unpublish → is_published=False
```

### 3.6 Admin Lens Options (`/api/admin/lens-options`)

```
GET    /api/admin/lens-options
POST   /api/admin/lens-options
PUT    /api/admin/lens-options/{id}
DELETE /api/admin/lens-options/{id}
PUT    /api/admin/lens-options/reorder  → update sort_order in bulk
```

### 3.7 Admin Lens Collection (`/api/admin/lens-collection`)

```
GET    /api/admin/lens-collection
POST   /api/admin/lens-collection          → includes video upload to Cloudinary
PUT    /api/admin/lens-collection/{id}
DELETE /api/admin/lens-collection/{id}
PUT    /api/admin/lens-collection/reorder
```

### 3.8 Admin Promo Codes (`/api/admin/promo-codes`)

```
GET    /api/admin/promo-codes
POST   /api/admin/promo-codes
PUT    /api/admin/promo-codes/{id}
DELETE /api/admin/promo-codes/{id}
```

### 3.9 Admin FAQs (`/api/admin/faqs`)

```
GET    /api/admin/faqs
POST   /api/admin/faqs
PUT    /api/admin/faqs/{id}
DELETE /api/admin/faqs/{id}
PUT    /api/admin/faqs/reorder
```

### 3.10 Admin Inventory (`/api/admin/inventory`)

```
GET /api/admin/inventory
  → All variants with stock levels, grouped by product
  → Highlights low_stock and out_of_stock

PUT /api/admin/inventory/{variant_id}
  Body: { stock }
  → Direct stock update
```

---

## SECTION 4 — EMAIL SYSTEM (8 Templates)

All emails via Resend API, sent via BackgroundTasks from `backend/services/email.py`.

```
1. Welcome Email
   Trigger: POST /api/auth/register
   To: new user
   Content: Welcome message, WhatsApp link, browse link

2. Order Confirmation
   Trigger: POST /api/orders (success)
   To: customer_email
   Content:
     - Order number (DOS-YYYY-XXXX)
     - Frame: name, color, size, price
     - Lens: type, sub-type, coating, add-ons
     - Prescription: method + data
     - Payment method + total
     - Estimated delivery: 3–5 days

3. Order Processing
   Trigger: Admin sets status → processing
   Content: Order being prepared, expected dispatch date

4. Order Shipped
   Trigger: Admin sets status → shipped
   Content: Tracking number, courier name, tracking link

5. Order Delivered
   Trigger: Admin sets status → delivered
   Content: Delivery confirmation, review request link

6. Abandoned Cart
   Trigger: APScheduler — 2 hours after cart_data saved with no order
   Content: Items left in cart, direct link back to cart

7. Review Request
   Trigger: APScheduler — 3 days after status → delivered
   Content: Request to leave a review, direct link to product

8. Password Reset
   Trigger: POST /api/auth/forgot-password
   Content: Reset link (valid 1 hour)
```

---

## SECTION 5 — FRONTEND PAGES

> Layout reference: `wireframe/DeluxeOpt_Wireframe_Complete.html`
> Open wireframe, check Desktop AND Mobile view for every page before coding.

### 5.1 Shared Layout Components

#### AnnounceBar (`components/layout/AnnounceBar.tsx`)
- Orange background (#E8670A), white text
- Text: "Free Delivery on Orders Above Rs. 3,000 | All Over Pakistan | Cash on Delivery Available"
- Scrolling marquee on mobile

#### Header (`components/layout/Header.tsx`)
- Dark background (#0F0F0F), orange bottom border
- Logo: "Deluxe**Opt**" (Cormorant Garamond, Opt in orange)
- Search bar (center, full-width on desktop)
- Right: WhatsApp button (green), Cart icon + badge, Wishlist icon, Account icon
- Mobile: hamburger menu, logo center, cart + search icons right

#### Navbar (`components/layout/Navbar.tsx`)
- Dark background (#1a1a1a)
- Links: All Products | Men | Women | Sunglasses | Prescription | Blue Cut | Screen | Transition | Sale (orange)
- Right: "Track Order" link
- Active state: orange underline border

#### Footer (`components/layout/Footer.tsx`)
- Dark background, 5-column grid
- Col 1: Logo + description + social icons (Instagram, Facebook, TikTok)
- Col 2: Shop links
- Col 3: Help links
- Col 4: Company links
- Col 5: Newsletter signup + payment methods (COD, JazzCash, EasyPaisa, Bank Transfer)
- Bottom bar: copyright + "Made with care in Pakistan"

### 5.2 Homepage (`/`)

Sections in order (check wireframe for exact layout):

1. **AnnounceBar**
2. **Header**
3. **Navbar**
4. **Hero Slider**
   - Full-width, dark background
   - Left: eyebrow text + H1 + subtitle + 2 CTA buttons + 4 stats
   - Right: main image + 2 thumbnail images
   - 3 slides, auto-play 5s, manual dots navigation
   - Images from admin (LensCollection or separate banner model — store in DB)
   - Stats: 2,400+ Customers | 500+ Styles | 3–5 Day Delivery | 7-Day Returns

5. **Trust Strip**
   - White background, 5 items in a row
   - Free Delivery | 100% Authentic | 7-Day Returns | WhatsApp Support | Cash on Delivery

6. **Shop by Gender**
   - 2-column grid: Men's Collection | Women's Collection
   - Each: dark background image with overlay, title, subtitle, CTA button
   - API: filter products by gender

7. **Shop by Category**
   - 6 category cards in a grid (auto-fill)
   - Each card: icon placeholder + category name + product count
   - API: GET /api/products?category=X&per_page=0 (for count only)

8. **Bestsellers Section**
   - Section header + "View All" link
   - 4 ProductCards in a grid
   - API: GET /api/products?sort=best_selling&per_page=4&is_featured=true

9. **Prescription CTA Banner**
   - Dark background, full-width
   - Left: text + CTA button
   - Right: 3 frame images
   - Static content (no API needed)

10. **New Arrivals Section**
    - Section header + "View All" link
    - 4 ProductCards
    - API: GET /api/products?sort=newest&per_page=4

11. **Lens Collection Section**
    - Left: video player + lens type pills (clicking pill changes video)
    - Right: active lens detail box + other lens list rows
    - API: GET /api/lens-collection
    - Default: first item active

12. **Customer Reviews Strip**
    - Overall rating (4.8 ★) + 3 review cards
    - API: GET /api/reviews/featured (is_featured=True)

13. **Newsletter / Final CTA**
    - Orange background
    - "Ready to Find Your Perfect Frames?"
    - 2 CTA buttons

14. **Footer**

### 5.3 Product Listing Page (`/products`)

Layout: 2-column (sidebar + grid)

**Left Sidebar (220px):**
- Sort By dropdown
- Category filter (checkboxes)
- Gender filter (checkboxes)
- Frame Shape filter (checkboxes)
- Material filter (checkboxes)
- Price Range (min/max number inputs)
- Active filters shown as removable tags
- "Clear All" button
- Mobile: hidden by default, toggle button shows it as drawer

**Main Area:**
- Page title + result count
- Active filter tags
- Product grid (auto-fill, min 220px per card)
- Pagination (prev/next + page numbers)
- API: GET /api/products with all filter params

**ProductCard (`components/product/ProductCard.tsx`):**
- Aspect ratio 4:3 image
- Top-left: discount badge (e.g. -20%) or NEW badge
- Top-right: wishlist heart icon (filled if in wishlist)
- Bottom-left: category badge
- Body: SKU | product name | stars + count | size pills | price (main + strikethrough old) | Add to Cart button
- Hover: subtle shadow + border color change

### 5.4 Product Detail Page (`/products/[slug]`)

**Layout:** 2-column grid (gallery left, info right)

**Left Column (sticky on desktop):**

Gallery:
- Vertical thumbnails (left) + main image (right, zoom on click)
- Thumbnails: up to 6, first = main
- Click thumbnail → change main image

Width Guide (below gallery):
- Title: "Width guide for: [product name]"
- 2 tabs: Frame Widths | Other Measurements
- Frame diagram image (spec_image_url)
- Width table: Narrow | Medium | Wide with mm values
- Active size highlighted in orange
- "Don't have glasses? Measure using a credit card" link

**Right Column:**

- Category breadcrumb (orange, clickable)
- Stars + review count + "Write a review" link
- Product H1 (Cormorant Garamond)
- SKU + Frame Number (muted text)
- Price: sale price (orange, large) + original price (strikethrough) + discount badge
- Divider
- Color selector: label "Frame Color — [active color name]" + color swatches (dots)
- Size selector: label + size buttons showing full code (e.g. "Medium (50□21-145)")
  - Size guide link
  - Clicking size updates Width Guide active state
- Divider
- **"Select Your Lenses" button** (full-width, orange) → navigates to `/products/[slug]/select-lenses`
- "No prescription? Add to cart directly below" (small muted text, centered)
- Payment info box (orange-tinted): Bank/EasyPaisa/JazzCash 15% off | Free delivery Rs. 3,000+
- Quantity selector (−/value/+)
- **"Add to Cart" button** (full-width, dark)
- WhatsApp order button (green outline)
- USP grid (2×2): 100% Authentic | 7-Day Returns | Fast Delivery | WhatsApp Support

**Product Tabs (below main layout):**

Tab 1: Features & Size
- Left: spec rows table (Size, Color, Weight, Material, Shape, Rim, Frame Width, Lens Width, Bridge, Temple)
- Right: frame dimension diagram image + face width guide text

Tab 2: Description
- Left: rich text HTML (product.description)
- Right: description image (product.description_image_url)

Tab 3: Lens Recommendation
- 3-column grid of lens type cards
- Each: image/icon + name + description + "Select These Lenses" link

**Below Tabs:**
- Related Products (4 cards, same category)
- Reviews Section:
  - Overall rating + star bars breakdown
  - "Write a Review" button
  - Individual reviews (name, verified badge, stars, title, body, images, date)
  - Pagination (load more)

**Sticky Bottom Bar (on scroll, bottom of page):**
- Dark background
- Left: frame thumbnail + name + selected variant + price
- Right: "Select Lenses" button (orange) + "Add to Cart" button (dark)

### 5.5 Select Lenses Page (`/products/[slug]/select-lenses`)

**Layout:** 2-column (320px sidebar left, main right)

**Left Sidebar (sticky):**
- "← Back to Frame" link (returns to product page)
- Frame image (main product image)
- Frame title + selected color/size
- Live Price Summary box:
  - Frame: Rs. X
  - Lens type: Rs. X (or — if not selected)
  - Coating: Rs. X (or —)
  - Add-ons: Rs. X (or —)
  - Total (bold, orange)
  - "Add to Cart" button (dark, full-width) — enabled only when step 1 complete

**Right Main (step tabs):**

5 step tabs: Usage | Prescription | Lens | Coatings | Add-Ons

Step 1 — Usage (Lens Type):
- Options from API (lens-type options for this product)
- Each option: icon + name + description + price
- Progressives option: when selected, shows sub-option cards (premium/standard/mid/near)
- Single selection only
- Non-Rx option: skips to step 3 (no prescription needed)

Step 2 — Prescription:
- 2 option cards: "Upload a Photo" | "Fill it out myself"
- Upload: drag-drop zone → uploads to Cloudinary via POST /api/upload/prescription
- Manual: dropdown grid
  - Row headers: OD (Right), OS (Left)
  - Col headers: SPH, CYL, Axis
  - Bottom row: ADD, PD (both as dropdowns)
  - SPH range: -20.00 to +20.00 in 0.25 steps
  - CYL range: -10.00 to +10.00 in 0.25 steps
  - Axis: 1 to 180 in 1-degree steps
  - ADD: +0.75 to +3.50 in 0.25 steps
  - PD: 52 to 76 in 1mm steps
- Validation: if |OD_SPH - OS_SPH| > 3 OR |OD_CYL - OS_CYL| > 2 → show orange warning box
  - Warning is non-blocking: user can still continue
- Skip button: "I'll enter prescription later (contact via WhatsApp)"

Step 3 — Coating:
- Options from API (coating options for this product)
- Each: icon + name + description + price
- Single selection (default: Standard Clear = free)

Step 4 — Add-Ons:
- Options from API (addon options for this product)
- Each: icon + name + description + price + checkbox
- Multiple selection allowed
- UV400 Protection: shown as "Included Free" badge

Step 5 — Order Review:
- Summary of all selections
- Final price breakdown
- "Add to Cart" button (large, dark, full-width)
- Next to it: "Order via WhatsApp" button

Step Navigation:
- Back + Continue buttons at bottom of each step
- Step counter: "Step X of 5"
- Completed steps shown with green checkmark in tab

### 5.6 Cart Page (`/cart`)

Layout: 2-column (items left, summary right)

**Cart Items:**
- Shipping progress bar: "Rs. X away from free delivery" (if < Rs. 3,000)
- Each cart item card:
  - Frame image (60×60)
  - Frame name, color, size, SKU
  - Lens info box (if customized): lens type + coating + add-ons
  - Prescription summary (if entered)
  - Quantity controls (−/value/+)
  - Item total price (orange)
  - Remove link

**Cart Summary (sticky sidebar):**
- "Order Summary" heading
- Coupon input + Apply button
  - Success: green text showing discount amount
  - Error: red text "Invalid or expired code"
- Subtotal | Coupon discount (green) | Shipping | Total
- Payment Method selector (4 options with 15% discount badge on 3)
  - Selecting EasyPaisa/JazzCash/Bank recalculates total immediately
- "Proceed to Checkout" button (dark, full-width)

**Empty Cart state:**
- Centered message + illustration + "Browse Frames" button

### 5.7 Checkout Page (`/checkout`)

Layout: 2-column (form left, summary right)

**3-step progress:** 1. Address → 2. Payment → 3. Review

Step 1 — Delivery Address:
- Full Name, Phone Number (2-col)
- Email Address
- Street Address
- City (dropdown: major Pakistani cities), Province (dropdown)
- Order Notes (textarea, optional)

Step 2 — Payment:
- 4 payment method cards (same as cart)
- Selected method shows detail (e.g. "Pay when you receive" for COD)
- EasyPaisa/JazzCash/Bank: shows account details for transfer

Step 3 — Review:
- Order items summary
- Address summary
- Payment method summary
- Final total
- "Place Order" button (orange, large, full-width)
- After placing: redirect to `/order/[orderNumber]/confirmation`

**Right Sidebar (sticky):**
- Order items (compact)
- Price breakdown same as cart
- Updates live as payment method changes

### 5.8 Order Confirmation Page (`/order/[orderNumber]/confirmation`)

- Green checkmark icon
- "Order Placed Successfully!"
- Order ID in dark box: `#DOS-2026-0042`
- Order details card: customer info, address, payment
- Items ordered card: each item with lens details + prescription summary
- 2 buttons: "Track My Order" + "Continue Shopping"

### 5.9 Order Tracking Page (`/tracking`)

- Search input: order number OR phone number + "Track" button
- On result:
  - Order number + date + item count
  - Items summary (frame + lens info)
  - Status badge
  - Timeline: 4 steps (Placed / Processing / Shipped / Delivered)
    - Green dot = completed
    - Orange dot = current
    - Grey dot = pending
    - Each step: date/time if completed

### 5.10 My Account (`/account/*`)

Layout: sidebar nav + main content

**Sidebar:**
- Avatar (initials), name, email
- Nav links: My Orders | Wishlist | Profile | Addresses | Change Password | Logout

**Orders Tab (`/account/orders`):**
- Table: Order ID (link) | Date | Items summary | Total | Status pill | Action button
- Status pills: Pending (yellow) | Processing (orange) | Shipped (blue) | Delivered (green) | Cancelled (red)
- Action: "Track" for active orders, "Reorder" for delivered

**Wishlist Tab (`/account/wishlist`):**
- Product grid (same cards as listing)
- Remove from wishlist button on each card

**Profile Tab (`/account/profile`):**
- Edit form: full name, phone, email
- Save button

**Change Password:**
- Current password + new password + confirm new password

### 5.11 Auth Pages

**Login (`/login`):**
- Email + password
- "Forgot password?" link
- Submit → store tokens in Zustand + localStorage
- Redirect to previous page or homepage

**Register (`/register`):**
- Full name, email, phone, password, confirm password
- Submit → auto-login after registration

### 5.12 About Us (`/about`)

- Dark hero: "About DeluxeOpt" + subtitle
- Stats grid: 2,400+ Customers | 500+ Styles | 4.8★ Rating | 3–5 Day Delivery
- Story section: 2-column (text + image placeholder)
- Mission statement
- Team/values section (optional, can be placeholder)

### 5.13 Contact Us (`/contact`)

- Dark hero: "Contact Us"
- 2-column: contact form (left) + contact info blocks (right)
- Form: name, phone, email, subject (dropdown), message, submit
- Info blocks: WhatsApp | Email | Location | Working Hours

### 5.14 FAQ Page (`/faq`)

- Dark hero
- 2-column: category nav (left) + FAQ accordion (right)
- Categories: All | Orders & Delivery | Prescription & Lenses | Payments & Returns | Frame Fitting
- Accordion: question + expand/collapse answer
- API: GET /api/faqs

### 5.15 Blogs Page (`/blogs`)

- Dark hero: "Optical Blog"
- Category filter pills
- Blog card grid (auto-fill, min 280px)
- Each card: cover image | category badge | title | excerpt | date + read time
- API: GET /api/blogs

### 5.16 Blog Detail (`/blogs/[slug]`)

- Full-width cover image
- Category + title + date
- Rich text content
- Related blogs (3 cards)

### 5.17 Lens Guide (`/lens-guide`)

- Dark hero with title + description
- Content sections per lens type
- CTA at end: "Shop Blue Cut Frames"
- (Content is static or can come from a Blog with category=lens-guide)

### 5.18 Shipping & Returns (`/shipping-returns`)

- Dark hero
- Delivery policy card with numbered timeline
- Returns policy card
- Free shipping info box (orange-tinted)

---

## SECTION 6 — ADMIN PANEL PAGES (`/admin/*`)

### 6.1 Admin Layout

**Sidebar (220px, dark #0F0F0F):**
- Logo: "DeluxeOpt Admin Panel"
- Nav sections: Main (Dashboard, Orders, Products, Customers, Reviews, Inventory, Promo Codes, Blogs, Lens Options) | Settings (Store Settings, Email Templates, Static Pages)
- Active link: left orange border + slightly lighter background
- Badges: Orders (pending count), Reviews (unapproved count)

**Top Bar:**
- Page title (Cormorant Garamond, 20px)
- Action buttons (right)

### 6.2 Admin Dashboard (`/admin`)

- Quick action buttons: Add Product | View Pending Orders | Approve Reviews (count)
- 4 stat cards: Today's Orders | Today's Revenue | Pending Orders | Low Stock Items
  - Sub-text: +X from yesterday / X urgent / restock needed
- 2 charts (recharts):
  - Line chart: revenue + orders last 7 days
  - Donut chart: orders by status
- 2-column grid:
  - Recent Orders table (last 10)
  - Pending Reviews table (approve/reject actions)
- Low Stock Alerts table

### 6.3 Admin Products (`/admin/products`)

**List view:**
- Search + filter (category, status)
- Table: image | name | SKU | category | price | stock | status | actions (edit/delete)
- "Add Product" button → `/admin/products/new`

**Add/Edit Product Form (`/admin/products/new` and `/admin/products/[id]/edit`):**

Layout: main column (left) + sidebar (right, 320px)

Main column sections:

1. **Basic Information**
   - Product Name, SKU (auto-suggestion from name)
   - Category (dropdown), Gender (dropdown), Frame Number
   - Frame Shape (dropdown), Material (text), Weight (number)

2. **Pricing**
   - Original Price, Sale Price (leave blank = no sale)

3. **Product Images**
   - Drag-drop multi-upload
   - Uploaded images shown as thumbnails with reorder (drag) + delete (×)
   - First image = main product image

4. **Variants Table (Shopify-style inline edit)**
   - Table columns: Color Name | Color Hex (color picker) | Size Label | Lens□Bridge-Temple | SKU Variant (auto) | Price | Stock | Active
   - Each row is fully editable inline
   - "+ Add Variant Row" button
   - Delete row (×) button per row
   - Color hex cell shows a color dot preview

5. **Description (Rich Text)**
   - Toolbar: B | I | U | H1 | H2 | H3 | • List | 1. List | Link | Image | Quote
   - Editable content area
   - Below: "Description Image" upload (shown right-side on product page Description tab)

6. **Frame Specifications**
   - Frame Width, Lens Width, Bridge, Temple, Lens Height (all in mm, number inputs)
   - Rim Type (dropdown)
   - Frame Dimension Diagram upload (shown in Features & Size tab)

7. **Lens Options for this Product**
   - Two groups of checkboxes:
     - Lens Types: Single Vision | Progressives | Bifocal | Readers | Non-Rx
     - Coatings: Standard | Anti-Reflective | Blue Cut | Transition | Polarized
     - Add-ons: (from LensOption where type=addon)

Right Sidebar:
- Status & Visibility: Status dropdown (Active/Draft) | Featured checkbox | On Sale checkbox
- SEO: Meta Title | Meta Description | URL Slug

**Edit form:** all fields pre-populated from API GET /api/admin/products/{id}

### 6.4 Admin Orders (`/admin/orders`)

**List view:**
- Filter tabs: All | Pending | Processing | Shipped | Delivered | Cancelled
- Search: order number, customer name, phone
- Table: Order ID | Customer | Date | Items | Payment | Total | Status | Action

**Order Detail (`/admin/orders/[id]`):**
- 3-column info blocks:
  1. Customer: name, phone, email, address
  2. Frame: product name, color, size, SKU, quantity
  3. Lens: type, sub-type, coating, add-ons, prescription (method + all values)
- Payment strip: method | frame price | lens price | coating | addon | coupon | discount | shipping | TOTAL
- Status update dropdown + "Update Status" button
- Tracking number input (appears when status = shipped)
- "Export Order PDF" button (optional)

### 6.5 Admin Reviews (`/admin/reviews`)

- Filter tabs: Pending (default) | Approved | All
- Table: Customer | Product | Rating (stars) | Review excerpt | Date | Actions
- Actions: Approve (green) | Reject (red) | View Full (opens modal)
- View modal: full review text + images + customer info

### 6.6 Admin Blogs CMS (`/admin/blogs`)

**List view:**
- Table: title | category | status | published date | actions

**Editor (`/admin/blogs/new` and `/admin/blogs/[id]/edit`):**
- 2-column: editor (left) + settings sidebar (right)
- Editor:
  - Blog Title (large input, Cormorant Garamond font)
  - Cover Image upload
  - Rich text content (same toolbar as product description)
- Settings sidebar:
  - Category dropdown
  - URL Slug (auto-generated from title)
  - Status (Draft/Published)
  - Meta Description
- Action buttons: Save Draft | Publish

### 6.7 Admin Inventory (`/admin/inventory`)

- Table grouped by product: product name | variant (color/size) | SKU | current stock | status
- Status badges: In Stock (green) | Low Stock (orange, ≤ threshold) | Out of Stock (red, 0)
- Inline stock edit: click stock number → input field → save
- Filter: show only low stock / out of stock

### 6.8 Admin Promo Codes (`/admin/promo-codes`)

- Table: code | type | value | min order | used/max | active | expires | actions
- Create/Edit form modal: all promo code fields

### 6.9 Admin Lens Options (`/admin/lens-options`)

- Tabs: Lens Types | Coatings | Add-ons
- Table per tab: name | price | description | active | sort order | actions
- Drag-to-reorder rows
- Create/Edit modal

---

## SECTION 7 — ZUSTAND STATE MANAGEMENT

### cartStore (`frontend/store/cartStore.ts`)
```typescript
interface CartItem {
  variantId: number
  productSlug: string
  productName: string
  imageUrl: string
  colorName: string
  sizeLabel: string
  sizeCode: string
  price: number
  quantity: number
  // lens customization (optional)
  lensType?: string
  lensSubType?: string
  coating?: string
  addOns?: string[]
  lensPrice?: number
  coatingPrice?: number
  addonPrice?: number
  prescriptionMethod?: 'manual' | 'upload' | 'none'
  prescriptionData?: PrescriptionData
  rxImageUrl?: string
}

interface CartStore {
  items: CartItem[]
  paymentMethod: 'cod' | 'easypaisa' | 'jazzcash' | 'bank-transfer'
  couponCode: string | null
  couponDiscount: number
  addItem: (item: CartItem) => void
  removeItem: (variantId: number) => void
  updateQuantity: (variantId: number, quantity: number) => void
  setPaymentMethod: (method: string) => void
  applyCoupon: (code: string, discount: number) => void
  clearCart: () => void
  // computed
  getSubtotal: () => number
  getShippingFee: () => number
  getPaymentDiscount: () => number
  getTotal: () => number
}
```

### authStore (`frontend/store/authStore.ts`)
```typescript
interface AuthStore {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setTokens: (access: string, refresh: string) => void
}
```

---

## SECTION 8 — TYPESCRIPT TYPES (`frontend/types/index.ts`)

Define all shared types here. Key types:

```typescript
interface Product { id, name, slug, sku, frame_number, category, gender, frame_shape, material, rim_type, weight_grams, original_price, sale_price, description, description_image_url, spec_image_url, frame_width_mm, lens_width_mm, bridge_mm, temple_mm, lens_height_mm, meta_title, meta_description, is_active, is_featured, images: ProductImage[], variants: ProductVariant[], avg_rating: number, review_count: number }
interface ProductVariant { id, product_id, color_name, color_hex, size_label, size_code, lens_width, bridge, temple, sku_variant, price, stock, is_active }
interface ProductImage { id, url, sort_order }
interface LensOption { id, name, type, sub_type, price, description }
interface Order { id, order_number, customer_name, customer_phone, customer_email, address, city, province, variant_id, quantity, frame_price, lens_type, lens_sub_type, coating, add_ons, lens_price, coating_price, addon_price, prescription_method, prescription_data, rx_image_url, payment_method, payment_discount_pct, coupon_code, coupon_discount, subtotal, shipping_fee, total, status, tracking_number, created_at }
interface PrescriptionData { od_sph: number, od_cyl: number, od_axis: number, os_sph: number, os_cyl: number, os_axis: number, add: number, pd: number }
interface Review { id, product_id, customer_name, rating, title, body, images, is_approved, created_at }
interface Blog { id, title, slug, cover_image_url, category, content, is_published, published_at }
interface LensCollection { id, name, video_url, description, bullets, price_from, color_dot }
interface User { id, email, full_name, phone, is_admin }
```

---

## SECTION 9 — BUSINESS LOGIC HELPERS

### Order Number Generator (`backend/utils/helpers.py`)
```python
def generate_order_number(db) -> str:
    year = datetime.now().year
    # Get last order number for this year, increment
    # Format: DOS-{year}-{4-digit-zero-padded}
    # Example: DOS-2026-0042
```

### Payment Discount Calculator
```python
PAYMENT_DISCOUNTS = {
    'cod': 0,
    'easypaisa': 0.15,
    'jazzcash': 0.15,
    'bank-transfer': 0.15,
}
def calculate_payment_discount(subtotal: float, method: str) -> float:
    return subtotal * PAYMENT_DISCOUNTS.get(method, 0)
```

### Shipping Calculator
```python
FREE_SHIPPING_THRESHOLD = 3000
SHIPPING_FEE = 200

def calculate_shipping(subtotal: float) -> float:
    return 0 if subtotal >= FREE_SHIPPING_THRESHOLD else SHIPPING_FEE
```

---

## SECTION 10 — IMPLEMENTATION ORDER

Build in this exact sequence to avoid dependency issues:

```
Phase 1 — Foundation
  1. Backend: models + Alembic migrations (all models at once)
  2. Backend: database.py, main.py, CORS setup
  3. Backend: auth routes + JWT utils
  4. Frontend: Next.js project setup, Tailwind config, fonts
  5. Frontend: types/index.ts (all TypeScript types)
  6. Frontend: lib/api.ts (Axios instance + all API functions)
  7. Frontend: Zustand stores (cart + auth)

Phase 2 — Shared Layout
  8. Frontend: AnnounceBar, Header, Navbar, Footer components
  9. Frontend: Root layout.tsx with all providers

Phase 3 — Core Shopping Flow
  10. Backend: product routes (GET list + detail + related + lens-options)
  11. Frontend: Product Listing page + filters
  12. Frontend: ProductCard component
  13. Frontend: Product Detail page (gallery + info + tabs + reviews + sticky bar)
  14. Frontend: Width Guide component
  15. Backend: lens-options routes
  16. Frontend: Select Lenses page (5 steps)
  17. Backend: upload routes (Cloudinary)
  18. Backend: cart/validate-coupon + calculate-shipping
  19. Frontend: Cart page
  20. Backend: order creation route
  21. Frontend: Checkout page
  22. Frontend: Order Confirmation page

Phase 4 — Account & Tracking
  23. Backend: order tracking route
  24. Frontend: Order Tracking page
  25. Frontend: Login + Register pages
  26. Backend: wishlist routes
  27. Frontend: My Account pages (orders, wishlist, profile)

Phase 5 — Homepage
  28. Backend: lens-collection route
  29. Frontend: Homepage (all sections)

Phase 6 — Info Pages
  30. Backend: blogs + FAQs routes
  31. Frontend: Blogs list + detail
  32. Frontend: FAQ, About, Contact, Lens Guide, Shipping & Returns

Phase 7 — Admin Panel
  33. Backend: all admin routes (dashboard, products, orders, reviews, blogs, lens-options, inventory, promo-codes, faqs)
  34. Frontend: Admin layout (sidebar + topbar)
  35. Frontend: Admin Dashboard (stats + charts + tables)
  36. Frontend: Admin Products (list + add/edit form with variants table)
  37. Frontend: Admin Orders (list + detail)
  38. Frontend: Admin Reviews (approve/reject)
  39. Frontend: Admin Blogs CMS (editor)
  40. Frontend: Admin Inventory, Promo Codes, Lens Options

Phase 8 — Email System
  41. Backend: Resend email service (all 8 templates)
  42. Backend: APScheduler (abandoned cart 2hr + review request 3day)

Phase 9 — Polish
  43. Frontend: Mobile responsive pass (all pages, 365px min)
  44. Frontend: Loading states (skeletons)
  45. Frontend: Error states (empty states, 404)
  46. Frontend: SEO meta tags (next/head per page)
  47. Backend: final testing all routes
```

---

## SECTION 11 — CONSTRAINTS & RULES

1. Always check `wireframe/DeluxeOpt_Wireframe_Complete.html` before building any page
2. DATABASE_URL — never change, never hardcode
3. All migrations via Alembic only
4. All images via `<Image>` from next/image
5. Tailwind only — no inline styles
6. All API calls through `frontend/lib/api.ts`
7. Heroicons SVG only in UI — no emoji
8. TypeScript strict — no `any`
9. Emails via BackgroundTasks — non-blocking
10. Commit after each phase: `git commit -m "[PHASE-X] description"`
11. Min-width 365px for mobile responsive
12. No hardcoded Pakistani city/province lists — store in constants.ts
13. Prescription dropdowns — dropdown only, no free text ever
14. Review approval — all reviews start as is_approved=False

---

*End of Complete Specification — Deluxe Opt Service v1.0*
