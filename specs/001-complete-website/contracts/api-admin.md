# API Contract: Admin Endpoints (`/api/admin/*`)

**Auth required for ALL admin endpoints**: `Authorization: Bearer <access_token>`
where the user has `is_admin = True`. Returns `403` if non-admin token provided.

---

## GET /api/admin/dashboard/stats

**Response 200**:
```json
{
  "data": {
    "today_orders": 8,
    "today_revenue": 24500.0,
    "pending_orders": 3,
    "low_stock_items": 5,
    "orders_7d": [
      { "date": "2026-05-11", "orders": 6, "revenue": 18000.0 }
    ],
    "orders_by_status": {
      "placed": 3, "processing": 4, "shipped": 12, "delivered": 45, "cancelled": 2
    }
  }
}
```

---

## Admin Products

### GET /api/admin/products
Query: `search`, `category`, `status` (active\|inactive), `page`, `per_page`
→ All products including inactive, paginated with variant count + main image.

### POST /api/admin/products
Creates product. Body includes product fields + initial variants + lens_option_ids.

### GET /api/admin/products/{id}
→ Full product detail pre-populated for edit form.

### PUT /api/admin/products/{id}
Updates product fields (not variants — those are separate endpoints).

### DELETE /api/admin/products/{id}
Soft delete: sets `is_active = False`.

### POST /api/admin/products/{id}/variants
**Body**: variant fields (color_name, color_hex, size_label, size_code, lens_width, bridge, temple, price, stock)
→ Creates a new variant; `sku_variant` auto-generated.

### PUT /api/admin/products/{id}/variants/{vid}
Updates variant (price, stock, is_active).

### DELETE /api/admin/products/{id}/variants/{vid}
Hard delete (no orders should reference a deleted variant; enforce at UI level).

### POST /api/admin/products/{id}/images
multipart/form-data → uploads to Cloudinary, creates ProductImage record.
Returns new image with `sort_order`.

### DELETE /api/admin/products/{id}/images/{img_id}
Deletes ProductImage record and removes from Cloudinary.

### PUT /api/admin/products/{id}/images/reorder
**Body**: `{ "order": [img_id_1, img_id_2, img_id_3] }`
→ Updates sort_order values (0, 1, 2…) based on array position.

### PUT /api/admin/products/{id}/lens-options
**Body**: `{ "lens_option_ids": [1, 2, 5, 10] }`
→ Replaces all ProductLensOption entries for this product.

---

## Admin Orders

### GET /api/admin/orders
Query: `status`, `payment_method`, `search` (order_number/name/phone), `page`, `per_page`

### GET /api/admin/orders/{id}
→ Full order detail: customer, frame, lens, prescription, payment breakdown.

### PUT /api/admin/orders/{id}/status
**Body**: `{ "status": "shipped", "tracking_number": "TCS-987654" }`
→ Updates status; triggers appropriate email via BackgroundTasks:
- `processing` → sends Processing email
- `shipped` → sends Shipped email (with tracking_number)
- `delivered` → sends Delivered email; schedules review request (3 days)

**Errors**: `400` invalid status transition (e.g., delivered → processing)

---

## Admin Reviews

### GET /api/admin/reviews
Query: `is_approved` (true\|false\|all), `page`

### PUT /api/admin/reviews/{id}/approve
Sets `is_approved = True`.

### PUT /api/admin/reviews/{id}/reject
Deletes the review record.

### PUT /api/admin/reviews/{id}/feature
Toggles `is_featured` (True/False).

---

## Admin Blogs

### GET /api/admin/blogs
### POST /api/admin/blogs — creates blog (draft)
### GET /api/admin/blogs/{id}
### PUT /api/admin/blogs/{id}
### DELETE /api/admin/blogs/{id}

### POST /api/admin/blogs/{id}/publish
Sets `is_published = True`, `published_at = now()`.

### POST /api/admin/blogs/{id}/unpublish
Sets `is_published = False`.

---

## Admin Lens Options

### GET /api/admin/lens-options — all (including inactive), grouped by type
### POST /api/admin/lens-options
### PUT /api/admin/lens-options/{id}
### DELETE /api/admin/lens-options/{id}
### PUT /api/admin/lens-options/reorder
**Body**: `{ "order": [id_1, id_2, id_3] }` → updates sort_order in bulk.

---

## Admin Lens Collections

### GET /api/admin/lens-collection
### POST /api/admin/lens-collection — includes video upload to Cloudinary
### PUT /api/admin/lens-collection/{id}
### DELETE /api/admin/lens-collection/{id}
### PUT /api/admin/lens-collection/reorder

---

## Admin Promo Codes

### GET /api/admin/promo-codes
### POST /api/admin/promo-codes
**Body**:
```json
{
  "code": "SAVE10",
  "discount_type": "percentage",
  "discount_value": 10.0,
  "min_order": 2000.0,
  "max_uses": 500,
  "expires_at": "2026-12-31T23:59:59"
}
```
Code is automatically uppercased before storage.

### PUT /api/admin/promo-codes/{id}
### DELETE /api/admin/promo-codes/{id}

---

## Admin FAQs

### GET /api/admin/faqs — all (including inactive)
### POST /api/admin/faqs
### PUT /api/admin/faqs/{id}
### DELETE /api/admin/faqs/{id}
### PUT /api/admin/faqs/reorder

---

## Admin Inventory

### GET /api/admin/inventory
Query: `status` (low_stock\|out_of_stock\|all)
→ All variants with stock levels, product name, low_stock_threshold.

**Response sample**:
```json
{
  "data": [
    {
      "product_id": 1,
      "product_name": "Aviator Gold",
      "variant_id": 3,
      "color": "Gold", "size": "Medium",
      "sku_variant": "DOS-SG-001-M-GLD",
      "stock": 2,
      "low_stock_threshold": 5,
      "status": "low_stock"
    }
  ]
}
```

### PUT /api/admin/inventory/{variant_id}
**Body**: `{ "stock": 25 }`
→ Direct stock update.
