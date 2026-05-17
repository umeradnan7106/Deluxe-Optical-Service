# API Contract: Orders, Cart Utilities, Wishlist (`/api/orders`, `/api/cart`, `/api/wishlist`)

---

## POST /api/cart/validate-coupon

**Purpose**: Validate a promo code against a subtotal before applying it.

**Request body**: `{ "code": "SAVE10", "subtotal": 4500.0 }`

**Response 200**:
```json
{
  "data": {
    "valid": true,
    "discount_type": "percentage",
    "discount_value": 10.0,
    "discount_amount": 450.0,
    "message": "10% off applied"
  }
}
```

**Response 200 (invalid)**:
```json
{ "data": { "valid": false, "message": "Invalid or expired code" } }
```

---

## POST /api/cart/calculate-shipping

**Purpose**: Calculate shipping fee for a given subtotal.

**Request body**: `{ "subtotal": 2800.0 }`

**Response 200**:
```json
{ "data": { "shipping_fee": 200.0, "is_free": false, "threshold": 3000.0 } }
```

---

## POST /api/orders

**Purpose**: Create a new order (guest or logged-in customer).
Auth is optional — if Bearer token provided and valid, `user_id` is set on the order.

**Request body**:
```json
{
  "customer_name": "Ahmed Khan",
  "customer_phone": "03001234567",
  "customer_email": "ahmed@example.com",
  "address": "House 5, Street 10, DHA Phase 6",
  "city": "Lahore",
  "province": "Punjab",
  "order_notes": "Please ring doorbell twice",
  "variant_id": 1,
  "quantity": 1,
  "lens_type": "single-vision",
  "lens_sub_type": null,
  "coating": "anti-reflective",
  "add_ons": ["uv400"],
  "prescription_method": "manual",
  "prescription_data": {
    "od_sph": -1.50, "od_cyl": -0.50, "od_axis": 90,
    "os_sph": -1.75, "os_cyl": -0.75, "os_axis": 85,
    "add": null, "pd": 64
  },
  "rx_image_url": null,
  "payment_method": "easypaisa",
  "coupon_code": "SAVE10"
}
```

**Server-side calculation** (not trusted from client):
1. Look up variant price (variant.price or product.original_price)
2. Look up lens, coating, addon prices from LensOption records
3. Subtotal = frame_price × quantity + lens_price + coating_price + sum(addon_prices)
4. Payment discount = subtotal × 0.15 (easypaisa)
5. Coupon discount = validate and apply
6. Shipping = 0 if (subtotal - payment_discount - coupon_discount) >= 3000 else 200
7. Total = subtotal - payment_discount - coupon_discount + shipping

**Side effects**:
- Decrement `variant.stock` by `quantity`
- Increment `promo_code.used_count` if coupon applied
- Generate `order_number` (DOS-YYYY-XXXX)
- Send Order Confirmation email via BackgroundTasks

**Response 201**:
```json
{
  "data": {
    "order_number": "DOS-2026-0042",
    "status": "placed",
    "total": 2655.0,
    "customer_email": "ahmed@example.com"
  },
  "message": "success"
}
```

**Errors**: `400` out of stock | `404` variant not found | `422` validation error

---

## GET /api/orders/track

**Purpose**: Public order tracking — no auth required.

**Query params**: `order_number=DOS-2026-0042` OR `phone=03001234567`

**Response 200** (by order number):
```json
{
  "data": {
    "order_number": "DOS-2026-0042",
    "status": "shipped",
    "tracking_number": "TCS-987654",
    "created_at": "2026-05-15T10:30:00",
    "items": [
      {
        "product_name": "Aviator Gold",
        "color": "Gold", "size": "Medium",
        "lens_type": "Single Vision", "coating": "Anti-Reflective",
        "quantity": 1, "total": 2655.0
      }
    ],
    "timeline": [
      { "status": "placed",     "completed": true,  "at": "2026-05-15T10:30:00" },
      { "status": "processing", "completed": true,  "at": "2026-05-15T14:00:00" },
      { "status": "shipped",    "completed": true,  "at": "2026-05-16T09:00:00" },
      { "status": "delivered",  "completed": false, "at": null }
    ]
  }
}
```

**Response 200** (by phone — multiple orders):
```json
{ "data": [ ...array of order summaries... ] }
```

**Errors**: `404` no matching order found

---

## GET /api/orders/my-orders

**Auth**: Required

**Response 200**: `{ "data": [ ...array of order summaries for logged-in user... ], "total": 5 }`

---

## GET /api/orders/{order_number}

**Auth**: Required (own order only; admin sees all)

**Response 200**: Full order detail object (same shape as admin order detail).

---

## GET /api/wishlist

**Auth**: Required

**Response 200**: `{ "data": [ ...array of product summary objects... ] }`

---

## POST /api/wishlist/{product_id}

**Auth**: Required

**Response 201**: `{ "data": null, "message": "Added to wishlist" }`
**Response 200** (already exists): `{ "data": null, "message": "Already in wishlist" }`

---

## DELETE /api/wishlist/{product_id}

**Auth**: Required

**Response 200**: `{ "data": null, "message": "Removed from wishlist" }`
