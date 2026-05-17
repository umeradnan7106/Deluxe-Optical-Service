# Data Model: Deluxe Opt Service

**Feature**: 001-complete-website
**Date**: 2026-05-17

---

## Entity Relationship Overview

```
User ──────────────────────────────────────────────────────┐
  │  (1:many)                                              │
  ├── Order (user_id nullable → supports guest orders)     │
  ├── WishlistItem (user_id)                               │
  └── (auth only, no review association for simplicity)    │
                                                           │
Product ────────────────────────────────────────────────────┤
  │  (1:many)                                              │
  ├── ProductImage (sort_order determines main image)       │
  ├── ProductVariant ──────────── Order (variant_id FK)    │
  ├── ProductLensOption (M:M join)── LensOption            │
  └── Review (product_id)                                  │
                                                           │
Order ──────────────────────────────────────────────────────┤
  ├── Review (order_id nullable → verified purchase badge)  │
  └── (contains lens/prescription/payment data inline)     │
                                                           │
LensCollection (standalone, homepage section)              │
AbandonedCart  (standalone, email recovery)                │
Blog           (standalone, CMS)                           │
FAQ            (standalone, content)                       │
PromoCode      (standalone, discounts)                     │
```

---

## Models

### User

| Field | Type | Constraints |
|-------|------|-------------|
| id | Integer | PK, auto-increment |
| email | String(255) | UNIQUE, NOT NULL, indexed |
| hashed_password | String(255) | NOT NULL |
| full_name | String(255) | NOT NULL |
| phone | String(20) | nullable |
| refresh_token | String(512) | nullable (for token revocation) |
| is_active | Boolean | DEFAULT True |
| is_admin | Boolean | DEFAULT False |
| created_at | DateTime | DEFAULT now() |
| updated_at | DateTime | auto-updated |

**Validation rules**: Email must be a valid email format; password minimum 8 characters
(enforced at Pydantic schema level, not DB level).

---

### Product

| Field | Type | Constraints |
|-------|------|-------------|
| id | Integer | PK |
| name | String(255) | NOT NULL |
| slug | String(255) | UNIQUE, NOT NULL, indexed |
| sku | String(50) | UNIQUE, NOT NULL |
| frame_number | String(50) | nullable (e.g. "52-18-140") |
| category | Enum | sunglasses\|prescription\|blue-cut\|screen\|transition\|kids |
| gender | Enum | men\|women\|unisex\|kids |
| frame_shape | Enum | round\|square\|oval\|cat-eye\|aviator\|wayfarer |
| material | String(100) | nullable |
| rim_type | Enum | full-rim\|half-rim\|rimless |
| weight_grams | Float | nullable |
| original_price | Float | NOT NULL |
| sale_price | Float | nullable (null = no sale) |
| description | Text | nullable (rich HTML) |
| description_image_url | String(512) | nullable |
| spec_image_url | String(512) | nullable (frame dimension diagram) |
| frame_width_mm | Integer | nullable |
| lens_width_mm | Integer | nullable |
| bridge_mm | Integer | nullable |
| temple_mm | Integer | nullable |
| lens_height_mm | Integer | nullable |
| meta_title | String(255) | nullable |
| meta_description | Text | nullable |
| is_active | Boolean | DEFAULT True |
| is_featured | Boolean | DEFAULT False |
| track_inventory | Boolean | DEFAULT True |
| low_stock_threshold | Integer | DEFAULT 5 |
| created_at | DateTime | DEFAULT now() |
| updated_at | DateTime | auto-updated |

**Computed/derived**:
- `slug`: auto-generated from `name` on creation; can be overridden in admin form
- `avg_rating` / `review_count`: computed via JOIN to Review at query time (not stored)
- `effective_price`: `sale_price` if not null, else `original_price`

---

### ProductImage

| Field | Type | Constraints |
|-------|------|-------------|
| id | Integer | PK |
| product_id | Integer | FK → Product.id, NOT NULL, indexed |
| url | String(512) | NOT NULL |
| sort_order | Integer | DEFAULT 0 (0 = main image) |
| created_at | DateTime | DEFAULT now() |

**Rule**: Image with `sort_order = 0` is the main product thumbnail everywhere on site.
On reorder, sort_order values are reassigned (0, 1, 2…).

---

### ProductVariant

| Field | Type | Constraints |
|-------|------|-------------|
| id | Integer | PK |
| product_id | Integer | FK → Product.id, NOT NULL, indexed |
| color_name | String(100) | NOT NULL (e.g. "Gold") |
| color_hex | String(7) | NOT NULL (e.g. "#8B6914") |
| size_label | String(50) | NOT NULL (e.g. "Medium") |
| size_code | String(10) | NOT NULL (e.g. "M") |
| lens_width | Integer | NOT NULL |
| bridge | Integer | NOT NULL |
| temple | Integer | NOT NULL |
| sku_variant | String(100) | UNIQUE, NOT NULL (e.g. "DOS-SG-001-M-GLD") |
| price | Float | nullable (overrides product price if set) |
| stock | Integer | DEFAULT 0 |
| is_active | Boolean | DEFAULT True |

**Stock rule**: When an order is placed, `stock` is decremented by `order.quantity`.
If `stock` drops to 0 and `track_inventory = True`, the variant is shown as out-of-stock.

---

### LensOption

| Field | Type | Constraints |
|-------|------|-------------|
| id | Integer | PK |
| name | String(255) | NOT NULL (e.g. "Single Vision") |
| type | Enum | lens-type\|coating\|addon |
| sub_type | String(50) | nullable (progressives: premium\|standard\|mid\|near) |
| price | Float | NOT NULL |
| description | Text | nullable |
| is_active | Boolean | DEFAULT True |
| sort_order | Integer | DEFAULT 0 |

---

### ProductLensOption (join table)

| Field | Type | Constraints |
|-------|------|-------------|
| product_id | Integer | FK → Product.id, PK component |
| lens_option_id | Integer | FK → LensOption.id, PK component |

**Composite PK**: (product_id, lens_option_id).
Only lens options assigned to a product appear in its lens selection flow.

---

### LensCollection

| Field | Type | Constraints |
|-------|------|-------------|
| id | Integer | PK |
| name | String(255) | NOT NULL (e.g. "Transitions") |
| video_url | String(512) | NOT NULL (Cloudinary URL) |
| description | Text | nullable |
| bullets | JSON | array of strings |
| price_from | Float | NOT NULL |
| color_dot | String(7) | NOT NULL (hex, e.g. "#8B4513") |
| is_active | Boolean | DEFAULT True |
| sort_order | Integer | DEFAULT 0 |

---

### Order

| Field | Type | Constraints |
|-------|------|-------------|
| id | Integer | PK |
| order_number | String(20) | UNIQUE, NOT NULL (DOS-YYYY-XXXX) |
| user_id | Integer | FK → User.id, nullable (null = guest) |
| customer_name | String(255) | NOT NULL |
| customer_phone | String(20) | NOT NULL, indexed |
| customer_email | String(255) | NOT NULL |
| address | Text | NOT NULL |
| city | String(100) | NOT NULL |
| province | String(100) | NOT NULL |
| order_notes | Text | nullable |
| variant_id | Integer | FK → ProductVariant.id, NOT NULL |
| quantity | Integer | NOT NULL, DEFAULT 1 |
| frame_price | Float | NOT NULL (snapshot at order time) |
| lens_type | String(100) | nullable |
| lens_sub_type | String(100) | nullable |
| coating | String(100) | nullable |
| add_ons | JSON | nullable (array of strings) |
| lens_price | Float | DEFAULT 0 |
| coating_price | Float | DEFAULT 0 |
| addon_price | Float | DEFAULT 0 |
| prescription_method | Enum | manual\|upload\|none, nullable |
| prescription_data | JSON | nullable ({od_sph, od_cyl, od_axis, os_sph, os_cyl, os_axis, add, pd}) |
| rx_image_url | String(512) | nullable |
| payment_method | Enum | cod\|easypaisa\|jazzcash\|bank-transfer, NOT NULL |
| payment_discount_pct | Float | DEFAULT 0 |
| coupon_code | String(50) | nullable |
| coupon_discount | Float | DEFAULT 0 |
| subtotal | Float | NOT NULL |
| shipping_fee | Float | DEFAULT 0 |
| total | Float | NOT NULL |
| status | Enum | placed\|processing\|shipped\|delivered\|cancelled, DEFAULT placed |
| tracking_number | String(100) | nullable |
| review_email_sent | Boolean | DEFAULT False (APScheduler flag) |
| created_at | DateTime | DEFAULT now(), indexed |
| updated_at | DateTime | auto-updated |

**State transitions**:
```
placed → processing → shipped → delivered
placed → cancelled
processing → cancelled
shipped → cancelled
(delivered → cannot be cancelled)
```

**Price fields are snapshots**: `frame_price`, `lens_price`, `coating_price`,
`addon_price` store the price at the time of order, not live product prices.
This preserves order history accuracy if prices change later.

---

### WishlistItem

| Field | Type | Constraints |
|-------|------|-------------|
| id | Integer | PK |
| user_id | Integer | FK → User.id, NOT NULL, indexed |
| product_id | Integer | FK → Product.id, NOT NULL |

**Composite unique constraint**: (user_id, product_id) — prevents duplicate wishlist entries.

---

### Review

| Field | Type | Constraints |
|-------|------|-------------|
| id | Integer | PK |
| product_id | Integer | FK → Product.id, NOT NULL, indexed |
| order_id | Integer | FK → Order.id, nullable (for verified purchase badge) |
| customer_name | String(255) | NOT NULL |
| customer_email | String(255) | NOT NULL |
| rating | Integer | NOT NULL, CHECK 1 ≤ rating ≤ 5 |
| title | String(255) | NOT NULL |
| body | Text | NOT NULL |
| images | JSON | nullable (array of Cloudinary URLs) |
| is_approved | Boolean | DEFAULT False |
| is_featured | Boolean | DEFAULT False |
| created_at | DateTime | DEFAULT now() |

**Rule**: Only reviews with `is_approved = True` are returned by public-facing endpoints.
Featured reviews (`is_featured = True`) appear on the homepage reviews strip.

---

### Blog

| Field | Type | Constraints |
|-------|------|-------------|
| id | Integer | PK |
| title | String(255) | NOT NULL |
| slug | String(255) | UNIQUE, NOT NULL |
| cover_image_url | String(512) | nullable |
| category | Enum | lens-guide\|frame-style\|eye-health\|prescription-tips |
| content | Text | NOT NULL (rich HTML) |
| meta_title | String(255) | nullable |
| meta_description | Text | nullable |
| is_published | Boolean | DEFAULT False |
| published_at | DateTime | nullable (set when published) |
| created_at | DateTime | DEFAULT now() |
| updated_at | DateTime | auto-updated |

---

### PromoCode

| Field | Type | Constraints |
|-------|------|-------------|
| id | Integer | PK |
| code | String(50) | UNIQUE, NOT NULL, uppercase |
| discount_type | Enum | percentage\|fixed |
| discount_value | Float | NOT NULL |
| min_order | Float | nullable |
| max_uses | Integer | nullable |
| used_count | Integer | DEFAULT 0 |
| is_active | Boolean | DEFAULT True |
| expires_at | DateTime | nullable |

**Validation at coupon application**:
1. code exists and is_active = True
2. expires_at is null or > now()
3. max_uses is null or used_count < max_uses
4. min_order is null or order subtotal >= min_order

---

### FAQ

| Field | Type | Constraints |
|-------|------|-------------|
| id | Integer | PK |
| question | String(512) | NOT NULL |
| answer | Text | NOT NULL |
| category | Enum | orders\|prescription\|payments\|fitting\|general |
| sort_order | Integer | DEFAULT 0 |
| is_active | Boolean | DEFAULT True |

---

### AbandonedCart

| Field | Type | Constraints |
|-------|------|-------------|
| id | Integer | PK |
| session_id | String(255) | UNIQUE, NOT NULL |
| email | String(255) | nullable (email only if user provided it) |
| phone | String(20) | nullable |
| cart_data | JSON | NOT NULL (CartItem array snapshot) |
| email_sent | Boolean | DEFAULT False |
| created_at | DateTime | DEFAULT now() |
| updated_at | DateTime | auto-updated |

---

## Alembic Migration Order

Create models and run migrations in this dependency order:

1. `users` table (no FK dependencies)
2. `products` table (no FK dependencies)
3. `product_images` table (FK: products)
4. `product_variants` table (FK: products)
5. `lens_options` table (no FK dependencies)
6. `product_lens_options` table (FK: products + lens_options)
7. `lens_collections` table (no FK dependencies)
8. `wishlist_items` table (FK: users + products)
9. `orders` table (FK: users + product_variants)
10. `reviews` table (FK: products + orders)
11. `blogs` table (no FK dependencies)
12. `promo_codes` table (no FK dependencies)
13. `faqs` table (no FK dependencies)
14. `abandoned_carts` table (no FK dependencies)

**All in one initial migration**: Create all 14 tables in a single `alembic revision
--autogenerate -m "initial_schema"` run to avoid partial-state issues.
