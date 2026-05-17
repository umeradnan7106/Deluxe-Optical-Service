# DELUXE OPT SERVICE — PROJECT CONSTITUTION
# Speckit v1 | Claude Code Source of Truth
# Last Updated: May 2026

---

## 1. PROJECT OVERVIEW

**Project Name:** Deluxe Opt Service  
**Type:** Pakistani Eyewear E-Commerce (B2C)  
**Location:** `C:\Users\Dell\Desktop\Deluxe Opt Service\`  
**Structure:**
```
Deluxe Opt Service/
├── frontend/     ← Next.js 14
├── backend/      ← FastAPI (Python)
└── wireframe/    ← DeluxeOpt_Wireframe_Complete.html (source of truth for UI)
```

---

## 2. TECH STACK

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS only — NO inline styles, NO CSS modules, NO styled-components
- **State:** Zustand
- **HTTP Client:** Axios via `frontend/lib/api.ts` (all API calls must go through this file)
- **Images:** Next.js `<Image>` component always — never `<img>` tag
- **Icons:** Heroicons SVG only — NO emoji in production UI

### Backend
- **Framework:** FastAPI (Python)
- **ORM:** SQLAlchemy
- **Migrations:** Alembic only — never modify DB schema manually
- **Database:** Supabase (PostgreSQL)
- **File Storage:** Cloudinary
- **Email:** Resend API
- **Auth:** JWT (access + refresh tokens)
- **Background Tasks:** FastAPI BackgroundTasks (emails), APScheduler (abandoned cart)
- **Scheduler:** APScheduler (already installed)

### Infrastructure
- **DB:** Supabase PostgreSQL
- **Storage:** Cloudinary
- **Deployment:** (TBD)

---

## 3. DESIGN SYSTEM (NEVER CHANGE THESE)

### Colors
```
Primary Orange:     #E8670A   → var(--or)       → Tailwind: [#E8670A]
Orange Light:       #FFF0E6   → var(--or-l)     → bg-[#FFF0E6]
Orange Dark:        #C45408   → var(--or-d)
Dark BG:            #0F0F0F   → var(--dk)       → bg-[#0F0F0F]
Dark 2:             #1a1a1a   → secondary dark
Dark 3:             #2a2a2a   → tertiary dark
Body Text:          #1a1a1a
Muted Text:         #6b7280
Border:             #e5e7eb
Background:         #ffffff   → body background (NOT cream, NOT peach)
Off-white:          #f9fafb
Green (success):    #059669
Red (error):        #dc2626
Yellow (warning):   #d97706
```

### Typography
```
Headings / Logo:    Cormorant Garamond (serif) — weights: 400, 500, 600
Body / UI:          Outfit (sans-serif) — weights: 300, 400, 500, 600

Google Fonts import:
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet"/>
```

### Spacing & Layout
```
Max width:          max-w-[1500px] mx-auto
Border radius:      rounded-[5px] for ALL buttons, inputs, cards
Container padding:  px-6 (desktop), px-4 (mobile)
Section padding:    py-16 (desktop), py-10 (mobile)
```

### Buttons
```
Primary:    bg-[#E8670A] text-white rounded-[5px]
Dark:       bg-[#0F0F0F] text-white rounded-[5px]
Outline:    border border-[#E8670A] text-[#E8670A] rounded-[5px] bg-transparent
WhatsApp:   bg-[#25d366] text-white rounded-[5px]
White:      bg-white text-[#1a1a1a] border border-[#e5e7eb] rounded-[5px]
```

---

## 4. BUSINESS RULES (HARD-CODED LOGIC)

### Pricing & Discounts
- **Free Shipping threshold:** Rs. 3,000+
- **Payment discounts:** EasyPaisa / JazzCash / Bank Transfer = **15% off** (COD = no discount)
- **Coupon codes:** Applied at cart level
- **Discount stacking:** Payment discount + coupon can stack

### Order ID Format
- Pattern: `DOS-YYYY-XXXX` (e.g., `DOS-2026-0042`)
- Sequential, zero-padded to 4 digits
- Generated server-side on order creation

### Order Status Flow
```
Placed → Processing → Shipped → Delivered
                              → Cancelled (from any step except Delivered)
```

### Lens Prescription
- **Manual entry:** Dropdowns only — SPH, CYL, Axis, ADD, PD (no free text fields)
- **Upload:** Photo of prescription card (Cloudinary)
- **Validation:** Show warning if OD/OS difference is unusually large — but non-blocking (user can proceed)

### Payment Methods (at Cart + Checkout)
1. Cash on Delivery — no discount
2. EasyPaisa — 15% off
3. JazzCash — 15% off
4. Bank Transfer — 15% off

---

## 5. PAGE STRUCTURE (WIREFRAME SOURCE OF TRUTH)

> Always refer to `wireframe/DeluxeOpt_Wireframe_Complete.html` for exact layout.
> Mobile view toggle is built into the wireframe file.

### Frontend Pages
| Page | Route |
|------|-------|
| Home | `/` |
| Product Listing | `/products` |
| Product Detail | `/products/[slug]` |
| Select Lenses | `/products/[slug]/select-lenses` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Order Confirmation | `/order/[orderId]/confirmation` |
| Order Tracking | `/tracking` |
| My Account — Orders | `/account/orders` |
| My Account — Wishlist | `/account/wishlist` |
| My Account — Profile | `/account/profile` |
| Login | `/login` |
| Register | `/register` |
| About Us | `/about` |
| Contact Us | `/contact` |
| FAQ | `/faq` |
| Blogs | `/blogs` |
| Blog Detail | `/blogs/[slug]` |
| Lens Guide | `/lens-guide` |
| Shipping & Returns | `/shipping-returns` |

### Admin Pages (prefix: `/admin`)
| Page | Route |
|------|-------|
| Dashboard | `/admin` |
| Products List | `/admin/products` |
| Add Product | `/admin/products/new` |
| Edit Product | `/admin/products/[id]/edit` |
| Orders | `/admin/orders` |
| Order Detail | `/admin/orders/[id]` |
| Reviews | `/admin/reviews` |
| Blogs CMS | `/admin/blogs` |
| Blog Editor | `/admin/blogs/[id]/edit` |
| Lens Options | `/admin/lens-options` |
| Inventory | `/admin/inventory` |
| Promo Codes | `/admin/promo-codes` |
| Store Settings | `/admin/settings` |

---

## 6. DATABASE MODELS

### Core Models

```python
# Product
class Product:
    id: int
    name: str
    slug: str  # auto-generated from name
    sku: str   # e.g. DOS-SG-001
    frame_number: str  # e.g. 52-18-140
    category: str  # sunglasses | prescription | blue-cut | screen | transition | kids
    gender: str  # men | women | unisex | kids
    frame_shape: str  # round | square | oval | cat-eye | aviator | wayfarer
    material: str
    rim_type: str  # full-rim | half-rim | rimless
    weight_grams: float
    # Pricing
    original_price: float
    sale_price: float | None  # if None, no discount
    # Specs (for Features & Size tab)
    frame_width_mm: int
    lens_width_mm: int
    bridge_mm: int
    temple_mm: int
    lens_height_mm: int
    # Content
    description: str  # rich text HTML
    description_image_url: str | None
    spec_image_url: str | None  # frame diagram
    # SEO
    meta_title: str
    meta_description: str
    # Config
    is_active: bool
    is_featured: bool
    track_inventory: bool
    low_stock_threshold: int  # default: 5
    created_at: datetime

# ProductVariant
class ProductVariant:
    id: int
    product_id: int  # FK
    color_name: str  # e.g. "Gold"
    color_hex: str   # e.g. "#8B6914"
    size_label: str  # e.g. "Medium"
    size_code: str   # e.g. "M"
    lens_width: int  # e.g. 50
    bridge: int      # e.g. 21
    temple: int      # e.g. 145
    sku_variant: str # e.g. DOS-SG-001-M-GLD
    price: float     # can override product price
    stock: int
    is_active: bool

# Order
class Order:
    id: int
    order_number: str  # DOS-YYYY-XXXX
    customer_id: int | None  # FK (None if guest)
    # Customer Info (duplicated for history)
    customer_name: str
    customer_phone: str
    customer_email: str
    # Address
    address: str
    city: str
    province: str
    order_notes: str | None
    # Items
    variant_id: int  # FK
    quantity: int
    frame_price: float
    # Lens Info
    lens_type: str | None  # single-vision | progressive | bifocal | readers | non-rx
    lens_sub_type: str | None  # for progressives: premium | standard | mid | near
    coating: str | None  # standard | anti-reflective | blue-cut | transition | polarized
    add_ons: list[str]  # JSON array
    lens_price: float
    coating_price: float
    addon_price: float
    # Prescription
    prescription_method: str | None  # manual | upload | none
    prescription_data: dict | None   # JSON: {od_sph, od_cyl, od_axis, os_sph, os_cyl, os_axis, add, pd}
    rx_image_url: str | None
    # Payment
    payment_method: str  # cod | easypaisa | jazzcash | bank-transfer
    payment_discount_pct: float  # 0 or 15
    coupon_code: str | None
    coupon_discount: float
    # Totals
    subtotal: float
    shipping_fee: float  # 0 if above threshold
    total: float
    # Status
    status: str  # placed | processing | shipped | delivered | cancelled
    tracking_number: str | None
    created_at: datetime
    updated_at: datetime

# Review
class Review:
    id: int
    product_id: int  # FK
    order_id: int | None  # FK (for verified purchase badge)
    customer_name: str
    customer_email: str
    rating: int  # 1-5
    title: str
    body: str
    images: list[str]  # JSON array of URLs
    is_approved: bool  # default False — admin must approve
    is_featured: bool
    created_at: datetime

# Blog
class Blog:
    id: int
    title: str
    slug: str
    cover_image_url: str | None
    category: str  # lens-guide | frame-style | eye-health | prescription-tips
    content: str  # rich text HTML
    meta_title: str
    meta_description: str
    is_published: bool
    published_at: datetime | None
    created_at: datetime

# LensOption
class LensOption:
    id: int
    name: str           # e.g. "Single Vision"
    type: str           # lens-type | coating | addon
    sub_type: str | None  # for progressives: premium | standard | mid | near
    price: float
    description: str
    is_active: bool
    sort_order: int

# LensCollection (for homepage video section)
class LensCollection:
    id: int
    name: str           # e.g. "Transitions"
    video_url: str      # Cloudinary URL
    description: str
    bullets: list[str]  # JSON array
    price_from: float
    color_dot: str      # hex color for pill dot
    is_active: bool
    sort_order: int

# FAQ
class FAQ:
    id: int
    question: str
    answer: str
    category: str  # orders | prescription | payments | fitting | general
    sort_order: int
    is_active: bool

# PromoCode
class PromoCode:
    id: int
    code: str           # e.g. "SAVE10"
    discount_type: str  # percentage | fixed
    discount_value: float
    min_order: float | None
    max_uses: int | None
    used_count: int
    is_active: bool
    expires_at: datetime | None

# ProductLensOption (many-to-many — which lenses show per product)
class ProductLensOption:
    product_id: int  # FK
    lens_option_id: int  # FK
```

---

## 7. API CONVENTIONS

### Base URL
```
Development: http://localhost:8000
Frontend calls via: frontend/lib/api.ts (Axios instance)
```

### Auth Headers
```
Authorization: Bearer <access_token>
Admin routes: require is_admin=True on user
```

### Response Format (always consistent)
```json
// Success
{ "data": { ... }, "message": "success" }

// List
{ "data": [...], "total": 100, "page": 1, "per_page": 20 }

// Error
{ "detail": "Error message here" }
```

### Key Endpoints
```
GET    /api/products              ← listing with filters + pagination
GET    /api/products/{slug}       ← product detail
GET    /api/products/{slug}/lens-options  ← lens options for this product
POST   /api/cart/add
GET    /api/cart
POST   /api/orders                ← create order (guest or logged in)
GET    /api/orders/{order_number} ← tracking by order number or phone
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/refresh

# Admin (all require is_admin)
GET/POST/PUT/DELETE  /api/admin/products
GET/POST/PUT/DELETE  /api/admin/orders
GET/PUT              /api/admin/reviews
GET/POST/PUT/DELETE  /api/admin/blogs
GET/POST/PUT/DELETE  /api/admin/lens-options
GET/POST/PUT/DELETE  /api/admin/promo-codes
```

---

## 8. EMAIL SYSTEM (8 Templates via Resend)

All emails sent via `BackgroundTasks`. Templates:

| Trigger | Template |
|---------|----------|
| New registration | Welcome email |
| Order placed | Order confirmation (includes order number, items, lens details, prescription) |
| Status → Processing | Processing update |
| Status → Shipped | Shipped (with tracking number) |
| Status → Delivered | Delivered confirmation |
| Cart abandoned (2hr) | Abandoned cart (APScheduler) |
| 3 days after delivery | Review request email |
| Password reset | Password reset link |

---

## 9. FRONTEND FOLDER STRUCTURE

```
frontend/
├── app/
│   ├── (store)/          ← customer-facing pages
│   │   ├── page.tsx      ← homepage
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       └── select-lenses/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── order/[orderId]/confirmation/page.tsx
│   │   ├── tracking/page.tsx
│   │   ├── account/
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── blogs/
│   │   ├── lens-guide/page.tsx
│   │   └── shipping-returns/page.tsx
│   ├── admin/            ← admin panel
│   │   ├── page.tsx      ← dashboard
│   │   ├── products/
│   │   ├── orders/
│   │   ├── reviews/page.tsx
│   │   ├── blogs/
│   │   ├── lens-options/page.tsx
│   │   ├── inventory/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx        ← root layout (fonts, providers)
│   └── globals.css       ← Tailwind base only
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── AnnounceBar.tsx
│   │   └── AdminSidebar.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── WidthGuide.tsx
│   │   └── StickyBar.tsx
│   ├── lenses/
│   │   ├── LensStep1Usage.tsx
│   │   ├── LensStep2Prescription.tsx
│   │   ├── LensStep3Coating.tsx
│   │   ├── LensStep4Addons.tsx
│   │   └── LensPriceSummary.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── StarRating.tsx
│   │   └── Placeholder.tsx
│   └── home/
│       ├── HeroSlider.tsx
│       ├── GenderCards.tsx
│       ├── CategoryGrid.tsx
│       ├── LensCollection.tsx
│       └── ReviewsStrip.tsx
├── lib/
│   ├── api.ts            ← Axios instance + all API functions
│   ├── utils.ts
│   └── constants.ts
├── store/
│   ├── cartStore.ts      ← Zustand cart
│   └── authStore.ts      ← Zustand auth
└── types/
    └── index.ts          ← all TypeScript types
```

---

## 10. BACKEND FOLDER STRUCTURE

```
backend/
├── main.py               ← FastAPI app init, CORS, router includes
├── database.py           ← SQLAlchemy engine, SessionLocal, get_db
├── models/
│   ├── product.py
│   ├── order.py
│   ├── user.py
│   ├── review.py
│   ├── blog.py
│   ├── lens.py
│   └── promo.py
├── routes/
│   ├── products.py
│   ├── orders.py
│   ├── auth.py
│   ├── reviews.py
│   ├── blogs.py
│   └── admin/
│       ├── products.py
│       ├── orders.py
│       ├── reviews.py
│       ├── blogs.py
│       ├── lens_options.py
│       └── inventory.py
├── schemas/              ← Pydantic models
├── services/
│   ├── email.py          ← Resend API templates
│   ├── cloudinary.py     ← file upload
│   └── scheduler.py      ← APScheduler abandoned cart
├── utils/
│   ├── auth.py           ← JWT helpers
│   └── helpers.py        ← order number generator etc
├── alembic/
│   └── versions/         ← all migrations here
├── alembic.ini
├── .env
└── requirements.txt
```

---

## 11. ENVIRONMENT VARIABLES

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql://...   ← NEVER CHANGE THIS
SECRET_KEY=your_jwt_secret
ALGORITHM=HS256
RESEND_API_KEY=re_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 12. CODING RULES (ABSOLUTE — NEVER VIOLATE)

1. **DATABASE_URL** — Never change, never hardcode, always read from `.env`
2. **Migrations** — Always use `alembic revision --autogenerate -m "description"` then `alembic upgrade head`
3. **Images** — Always `<Image>` from `next/image`, never `<img>`
4. **Styling** — Tailwind classes only. No inline styles. No CSS modules.
5. **API calls** — Always through `frontend/lib/api.ts`. Never direct fetch/axios in components.
6. **No emoji in UI** — Heroicons SVG only in production components
7. **Emails** — Always use `BackgroundTasks` for email sending
8. **Commits** — After each task: `git commit -m "[TASK-XX] description"`
9. **TypeScript** — Strict mode. No `any` types.
10. **Wireframe** — Always check `wireframe/DeluxeOpt_Wireframe_Complete.html` before building any page

---

## 13. START COMMANDS

### Backend
```bash
cd "C:\Users\Dell\Desktop\Deluxe Opt Service\backend"
.venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd "C:\Users\Dell\Desktop\Deluxe Opt Service\frontend"
npm run dev
```

### New Migration (when models change)
```bash
alembic revision --autogenerate -m "describe_what_changed"
alembic upgrade head
```

---

## 14. WIREFRAME REFERENCE

**File:** `wireframe/DeluxeOpt_Wireframe_Complete.html`

This HTML file contains all 20 pages in a single file with:
- Desktop layout (default)
- Mobile toggle (390px viewport)
- Tab navigation between all pages
- Placeholder content exactly matching real data structure

**Before building any page or component — open this file and check the layout.**

---

*End of Constitution — This file is the single source of truth for the entire project.*
