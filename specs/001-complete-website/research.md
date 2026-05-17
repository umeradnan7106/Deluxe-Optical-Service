# Phase 0 Research: Deluxe Opt Service — Complete Website

**Feature**: 001-complete-website
**Date**: 2026-05-17
**Branch**: 001-complete-website

All technology decisions and rationale for resolved unknowns are documented here.

---

## 1. Authentication Strategy

**Decision**: JWT with short-lived access tokens (30 min) + long-lived refresh tokens (7 days).
Tokens stored in Zustand store + localStorage on the frontend.

**Rationale**: Pakistani e-commerce users expect persistent login across browser sessions.
LocalStorage persistence (via Zustand persist middleware) provides this while keeping the
implementation simple. JWTs are stateless — no session table needed.

**Alternatives considered**:
- HTTP-only cookie sessions: More secure against XSS but requires CSRF protection and
  complicates cross-origin requests with the FastAPI backend. Rejected for v1 simplicity.
- Supabase Auth: Would reduce backend auth code but couples auth to Supabase provider.
  Rejected to keep the codebase portable.

**Implementation notes**:
- `python-jose[cryptography]` for JWT encoding/decoding
- `passlib[bcrypt]` for password hashing
- Access token payload: `{ sub: user_id, is_admin: bool, exp }`
- Refresh token stored in DB (token string on User model) — allows revocation

---

## 2. Rich Text Editor (Admin)

**Decision**: Tiptap (headless rich text, React extension for Next.js).

**Rationale**: Tiptap has first-class TypeScript support, works natively with Next.js App
Router (no SSR issues), and produces clean HTML output that can be stored as-is and
rendered safely on the frontend.

**Alternatives considered**:
- Quill.js: Mature but uses a custom Delta format requiring conversion to HTML. Has known
  SSR issues with Next.js App Router. Rejected.
- React Quill: Popular but not maintained for App Router. Rejected.
- Slate.js: Very flexible but requires significant custom extension. Overkill for v1.

**Output format**: HTML string stored in `description` (Product) and `content` (Blog)
columns. Rendered client-side with `dangerouslySetInnerHTML` inside a scoped prose class.

---

## 3. Prescription Validation Thresholds

**Decision**: Show non-blocking warning when:
- `|OD_SPH - OS_SPH| > 3.00` (anisometropia threshold)
- `|OD_CYL - OS_CYL| > 2.00` (anisometropia cylinder)

**Rationale**: These thresholds align with standard optometry practice for flagging
prescriptions that may indicate data-entry errors. The warning is informational only —
customers who have high prescription differences do exist and must be able to proceed.

**Validation location**: Client-side in `LensStep2Prescription.tsx`. No server-side
validation of prescription values (server stores whatever is submitted).

---

## 4. Order Number Generation

**Decision**: Format `DOS-{YEAR}-{NNNN}` where NNNN is zero-padded to 4 digits,
sequential within the current calendar year. Generated server-side at order creation.

**Implementation**:
```python
# backend/utils/helpers.py
def generate_order_number(db: Session) -> str:
    year = datetime.now().year
    prefix = f"DOS-{year}-"
    last = db.query(Order).filter(
        Order.order_number.like(f"{prefix}%")
    ).order_by(Order.order_number.desc()).first()
    n = int(last.order_number.split("-")[2]) + 1 if last else 1
    return f"{prefix}{n:04d}"
```

**Alternatives considered**:
- UUID: Globally unique but not human-readable for order tracking. Rejected.
- Timestamp-based: Harder to zero-pad and not sequential. Rejected.

---

## 5. Shipping & Payment Discount Calculation

**Decision**: Both calculated server-side at order creation. Frontend shows a live
preview using the same formulas, but the backend is authoritative.

**Business rules (hard-coded)**:
```
Free shipping threshold:  Rs. 3,000 (subtotal after discounts)
Shipping fee:             Rs. 200
Payment discounts:
  COD          → 0%
  EasyPaisa    → 15%
  JazzCash     → 15%
  Bank Transfer → 15%

Stacking order:
  1. Apply payment discount to subtotal
  2. Apply coupon discount (to discounted subtotal)
  3. Calculate shipping on final subtotal
  4. Total = discounted_subtotal + shipping_fee
```

**Note**: Coupon discount type can be `percentage` or `fixed`. Fixed coupon reduces
by absolute Rs. amount; percentage coupon reduces by that percentage of the payment-
discounted subtotal.

---

## 6. File Upload Strategy (Cloudinary)

**Decision**: All image and prescription uploads go through the backend
(`POST /api/upload/image`, `POST /api/upload/prescription`). The frontend never
calls Cloudinary directly.

**Rationale**: Keeps Cloudinary credentials server-side only. Allows server-side
validation of file type and size before uploading.

**Folder structure in Cloudinary**:
```
deluxe-opt/
├── products/          ← product images
├── prescriptions/     ← customer prescription photos
├── blogs/             ← blog cover images
└── lens-collections/  ← lens collection videos
```

**File size limits**: Images ≤ 10MB, videos ≤ 100MB (enforced in FastAPI route).

---

## 7. Abandoned Cart + Review Request Scheduling (APScheduler)

**Decision**: APScheduler (in-process) running alongside FastAPI. Two scheduled jobs:

**Job 1 — Abandoned Cart Email** (runs every 30 minutes):
```
SELECT * FROM abandoned_carts
WHERE email_sent = False
  AND email IS NOT NULL
  AND created_at <= NOW() - INTERVAL '2 hours'
  AND session_id NOT IN (SELECT cart_session_id FROM orders)
→ For each: send abandoned cart email, set email_sent = True
```

**Job 2 — Review Request Email** (runs every 15 minutes):
```
SELECT * FROM orders
WHERE status = 'delivered'
  AND review_email_sent = False     ← add this flag to Order model
  AND updated_at <= NOW() - INTERVAL '3 days'
→ For each: send review request email, set review_email_sent = True
```

**Tradeoff**: In-process APScheduler is reset on server restart. Mitigated by:
1. Persisting `email_sent` / `review_email_sent` flags in the DB (idempotent)
2. Re-queuing on app startup via `lifespan` event handler

**Alternative considered**: Celery + Redis — correct architecture for scale, but adds
operational complexity. Not needed for v1 traffic. Can be migrated later.

---

## 8. Admin Charts Library

**Decision**: Recharts (React charting library).

**Rationale**: Recharts is the most widely used charting library for React, has good
TypeScript types, and renders client-side (compatible with Next.js `'use client'`
components). Required for admin dashboard: 7-day revenue/orders line chart and orders-
by-status donut chart.

**Alternative considered**: Chart.js via react-chartjs-2 — also valid but Recharts
has better React integration (declarative components vs. imperative config).

---

## 9. Pakistani City/Province Constants

**Decision**: Store as static constants in `frontend/lib/constants.ts` (NOT in the DB).

**Rationale**: City/province data is stable, does not require admin configuration, and
is faster to serve from static code than a DB lookup on every checkout page load.

**Province list**: Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Islamabad Capital
Territory, Azad Kashmir, Gilgit-Baltistan.

**Major cities per province** (50+ cities total) stored as a map keyed by province.

---

## 10. Next.js App Router Data Fetching Strategy

**Decision**: Use Server Components for initial data fetching where SEO matters
(product listing, product detail, blogs); use Client Components (`'use client'`) for
interactive pages (cart, checkout, admin, account, lens selection).

**Rationale**: Product and blog pages benefit from SSR for SEO. The shopping flow
and admin panel require client-side interactivity and access to Zustand stores.

**Auth guard for admin**: Middleware (`middleware.ts`) checks for a valid access token
cookie/header and redirects `/admin/*` routes to `/login` if unauthenticated.

---

## 11. Wishlist Persistence

**Decision**: Wishlist stored server-side in a `wishlist_items` join table
(user_id + product_id). No client-side wishlist for guests.

**Rationale**: Spec requires wishlist to persist across sessions (FR-018). Server-side
storage is the only way to achieve cross-device persistence. Guest wishlist is not
in scope for v1.

---

## Resolved NEEDS CLARIFICATION Items

All unknowns from Technical Context are resolved:

| Item | Resolution |
|------|-----------|
| Testing framework | pytest + httpx for backend; no frontend tests in v1 |
| Rich text editor | Tiptap |
| Prescription warning thresholds | OD/OS SPH diff > 3.00, CYL diff > 2.00 |
| Scheduler technology | APScheduler in-process |
| Admin charts | Recharts |
| City/province data | Static constants (not DB) |
| Wishlist guest support | Not supported in v1 (registered users only) |
| Non-Rx lens step behaviour | Steps 2 (Prescription) is hidden entirely when Non-Rx selected |
