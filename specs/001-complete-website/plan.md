# Implementation Plan: Deluxe Opt Service — Complete E-Commerce Website

**Branch**: `001-complete-website` | **Date**: 2026-05-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-complete-website/spec.md`

## Summary

Build a complete Pakistani eyewear e-commerce platform (Deluxe Opt Service) from scratch,
covering 19 customer-facing pages, 11 admin panel pages, a full REST API with 50+ endpoints,
a 13-model PostgreSQL database, and an 8-template automated email system. The visual source
of truth is `wireframe/DeluxeOpt_Wireframe_Complete.html`. The platform supports guest
checkout, a multi-step lens selection flow with prescription entry, payment-method-based
discounts (15% for EasyPaisa/JazzCash/Bank Transfer), and automated post-purchase
communication via APScheduler-triggered emails.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript 5.x in strict mode (frontend)
**Primary Dependencies**:
- Backend: FastAPI, SQLAlchemy 2.x, Alembic, python-jose (JWT), python-multipart, APScheduler,
  resend (Resend SDK), cloudinary
- Frontend: Next.js 14 (App Router), Tailwind CSS, Zustand, Axios, Heroicons,
  Tiptap (rich text editor for admin), Recharts (admin dashboard charts)

**Storage**: Supabase PostgreSQL (relational data), Cloudinary (images + prescription uploads)
**Testing**: pytest + httpx (backend integration tests), no frontend test suite in v1
**Target Platform**: Web — desktop + mobile (minimum 365px viewport width)
**Project Type**: Web application (separate frontend/ and backend/ projects)
**Performance Goals**:
- Customer-facing pages load within 3 seconds on a standard mobile connection
- Order tracking results appear within 10 seconds of query submission
- Transactional emails delivered within 2 minutes of trigger event
**Constraints**:
- No live payment gateway in v1 (payment method selection only)
- All email sending is non-blocking (BackgroundTasks — never inline)
- DATABASE_URL read from environment; never hardcoded
- All DB schema changes via Alembic only
- Minimum 365px mobile width for all pages
**Scale/Scope**: Small-to-medium Pakistani e-commerce; 19 customer pages + 11 admin pages;
38 functional requirements; 13 database models; 8 email templates

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. Wireframe Fidelity | All 19 customer pages and 11 admin pages are built referencing `wireframe/DeluxeOpt_Wireframe_Complete.html`. No layout decisions deviate from it. | ✅ PASS |
| II. API-Only Communication | All frontend HTTP calls route through `frontend/lib/api.ts`. No component imports axios directly. | ✅ PASS |
| III. Database Migration Discipline | All schema changes via `alembic revision --autogenerate` + `alembic upgrade head`. DATABASE_URL always read from `backend/.env`. | ✅ PASS |
| IV. Design System Immutability | Tailwind CSS only; no inline styles; `<Image>` from next/image always; Heroicons SVG only. | ✅ PASS |
| V. Strict Type Safety | TypeScript strict mode; all types in `frontend/types/index.ts`; no `any`. | ✅ PASS |
| VI. Background Email Processing | All 8 email templates sent via FastAPI `BackgroundTasks`; APScheduler for timed triggers. | ✅ PASS |

**Gate result**: All 6 principles satisfied. No violations. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-complete-website/
├── plan.md              # This file
├── research.md          # Phase 0: technology decisions
├── data-model.md        # Phase 1: entity model + relationships
├── quickstart.md        # Phase 1: dev environment setup
├── contracts/
│   ├── api-auth.md
│   ├── api-products.md
│   ├── api-orders.md
│   ├── api-cart-reviews.md
│   ├── api-content.md
│   └── api-admin.md
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── main.py                    ← FastAPI app init, CORS, router mounts
├── database.py                ← SQLAlchemy engine, SessionLocal, get_db
├── models/
│   ├── user.py
│   ├── product.py             ← Product, ProductImage, ProductVariant
│   ├── lens.py                ← LensOption, LensCollection, ProductLensOption
│   ├── order.py               ← Order, AbandonedCart
│   ├── review.py
│   ├── blog.py
│   └── promo.py               ← PromoCode, FAQ
├── routes/
│   ├── auth.py
│   ├── products.py
│   ├── orders.py
│   ├── reviews.py
│   ├── cart.py
│   ├── wishlist.py
│   ├── upload.py
│   ├── blogs.py
│   ├── faqs.py
│   ├── lens_collection.py
│   └── admin/
│       ├── dashboard.py
│       ├── products.py
│       ├── orders.py
│       ├── reviews.py
│       ├── blogs.py
│       ├── lens_options.py
│       ├── lens_collection.py
│       ├── inventory.py
│       ├── promo_codes.py
│       └── faqs.py
├── schemas/                   ← Pydantic request/response models
├── services/
│   ├── email.py               ← Resend API, all 8 templates
│   ├── cloudinary.py          ← file upload helper
│   └── scheduler.py           ← APScheduler: abandoned cart + review request
├── utils/
│   ├── auth.py                ← JWT encode/decode, password hashing
│   └── helpers.py             ← order number generator, shipping/discount calc
├── alembic/
│   └── versions/
├── alembic.ini
├── .env                       ← DATABASE_URL, SECRET_KEY, RESEND_API_KEY, etc.
└── requirements.txt

frontend/
├── app/
│   ├── (store)/               ← customer-facing route group
│   │   ├── page.tsx           ← homepage
│   │   ├── products/
│   │   │   ├── page.tsx       ← listing + filters
│   │   │   └── [slug]/
│   │   │       ├── page.tsx   ← product detail
│   │   │       └── select-lenses/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── order/[orderId]/confirmation/page.tsx
│   │   ├── tracking/page.tsx
│   │   ├── account/
│   │   │   ├── orders/page.tsx
│   │   │   ├── wishlist/page.tsx
│   │   │   └── profile/page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── blogs/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── lens-guide/page.tsx
│   │   └── shipping-returns/page.tsx
│   ├── admin/                 ← admin route group
│   │   ├── page.tsx           ← dashboard
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── reviews/page.tsx
│   │   ├── blogs/
│   │   │   ├── page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── lens-options/page.tsx
│   │   ├── lens-collection/page.tsx
│   │   ├── inventory/page.tsx
│   │   ├── promo-codes/page.tsx
│   │   └── faqs/page.tsx
│   ├── layout.tsx             ← root layout: fonts, providers
│   └── globals.css            ← Tailwind base only
├── components/
│   ├── layout/
│   │   ├── AnnounceBar.tsx
│   │   ├── Header.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
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
│       ├── LensCollectionSection.tsx
│       └── ReviewsStrip.tsx
├── lib/
│   ├── api.ts                 ← Axios instance + all API functions
│   ├── utils.ts
│   └── constants.ts           ← city/province lists, payment methods
├── store/
│   ├── cartStore.ts
│   └── authStore.ts
└── types/
    └── index.ts               ← all TypeScript interfaces

wireframe/
└── DeluxeOpt_Wireframe_Complete.html   ← visual source of truth (READ ONLY)
```

**Structure Decision**: Web application (Option 2). `backend/` is a standalone FastAPI
project; `frontend/` is a standalone Next.js 14 App Router project. They communicate
exclusively via HTTP through `frontend/lib/api.ts`. The wireframe directory is read-only
reference material.

## Implementation Phases

### Phase 1 — Foundation (Backend Core)

Build the data layer and API skeleton that all later phases depend on.

**Deliverables:**
- All 13 SQLAlchemy models created in `backend/models/` with correct relationships
- Initial Alembic migration run successfully against Supabase
- `database.py`, `main.py` (CORS, router mounts), `utils/auth.py` (JWT + password hashing)
- Auth routes: register, login, refresh, forgot-password, reset-password
- Frontend: Next.js project bootstrapped with Tailwind, Google Fonts, and Heroicons
- `frontend/types/index.ts` — all shared TypeScript types
- `frontend/lib/api.ts` — Axios instance with auth interceptor
- Zustand stores: cartStore and authStore

**Acceptance criteria:**
- `POST /api/auth/register` creates a user and returns tokens
- `POST /api/auth/login` returns tokens for valid credentials
- Alembic migration applies without errors to Supabase
- TypeScript compiler reports zero errors on types/index.ts

### Phase 2 — Shared Layout

**Deliverables:** AnnounceBar, Header, Navbar, Footer, AdminSidebar components.
Root `layout.tsx` wrapping all pages with font providers.

### Phase 3 — Core Shopping Flow

The critical path from browsing to checkout.

**Deliverables:**
- Product listing page with filters (category, gender, frame_shape, material, price range,
  sort) + pagination
- ProductCard component
- Product detail page (gallery, variant selector, width guide, tabs, sticky bar)
- Backend: product routes (list, detail, related, lens-options)
- Select Lenses page (5-step flow)
- Backend: upload routes (Cloudinary image + prescription)
- Cart page with coupon validation, payment method selector, shipping calculator
- Checkout page (3-step: address → payment → review)
- Backend: order creation route (server-side total calculation, stock decrement)
- Order Confirmation page

### Phase 4 — Account & Tracking

**Deliverables:** Order tracking page (no auth), Login/Register pages, My Account
(orders, wishlist, profile, change password), Backend wishlist and tracking routes.

### Phase 5 — Homepage

**Deliverables:** All 13 homepage sections (Hero Slider, Trust Strip, Gender Cards,
Category Grid, Bestsellers, Prescription CTA, New Arrivals, Lens Collection Section,
Reviews Strip, Newsletter CTA). Backend: lens-collection route.

### Phase 6 — Info Pages

**Deliverables:** Blogs list + detail, FAQ page, About, Contact, Lens Guide,
Shipping & Returns. Backend: blogs and FAQs routes.

### Phase 7 — Admin Panel

**Deliverables:** All admin routes + all admin pages (dashboard with charts, products
add/edit form with inline variants table, orders list/detail, reviews moderation, blogs
CMS, inventory, promo codes, lens options, FAQs, lens collection).

### Phase 8 — Email System

**Deliverables:** All 8 Resend email templates in `backend/services/email.py`.
APScheduler setup in `backend/services/scheduler.py` (abandoned cart 2hr + review
request 3-day triggers). AbandonedCart model hooks.

### Phase 9 — Polish

**Deliverables:** Mobile responsive pass (all pages, 365px min), loading skeletons,
error/empty states, SEO meta tags per page, final backend route testing.

## Key Architectural Decisions

### Decision 1: Server-Side Total Calculation
All order totals MUST be calculated on the backend. The frontend displays the breakdown
but the authoritative total is set at order creation. This prevents price tampering.

### Decision 2: Guest Checkout + Optional Auth
Orders accept an optional `user_id`. Guest orders store full customer info inline on the
Order model (name, phone, email, address) rather than referencing a User record.

### Decision 3: Soft Delete for Products
Products are never hard-deleted (`DELETE` sets `is_active=False`). This preserves order
history references to products that are no longer sold.

### Decision 4: APScheduler for Timed Emails
APScheduler runs inside the FastAPI process (not a separate worker). For v1 scale this
is sufficient. The tradeoff is that restarts reset in-memory scheduled jobs — mitigated
by storing `email_sent=False` on AbandonedCart and re-queuing on startup.

### Decision 5: Tiptap for Admin Rich Text
Tiptap (headless rich text) is used in the admin product description and blog editor.
Output is stored as HTML. Chosen over Quill for better TypeScript support and Next.js
App Router compatibility.

📋 Architectural decision detected: Server-side-only total calculation vs. client-side
preview — Document reasoning and tradeoffs? Run `/sp.adr server-side-total-calculation`

📋 Architectural decision detected: APScheduler in-process vs. Celery/separate worker
for timed emails — Document reasoning and tradeoffs? Run `/sp.adr email-scheduler-strategy`
