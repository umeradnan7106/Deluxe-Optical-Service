# API Contract: Content Endpoints (Reviews, Blogs, FAQs, Uploads, Lens Collection)

---

## POST /api/reviews

**Purpose**: Submit a product review (any visitor, no auth required).

**Request body**:
```json
{
  "product_id": 1,
  "order_id": 42,
  "customer_name": "Sara Ali",
  "customer_email": "sara@example.com",
  "rating": 5,
  "title": "Perfect frames!",
  "body": "Great quality, arrived in 3 days.",
  "images": ["https://cloudinary.com/..."]
}
```

**Response 201**: `{ "data": { "id": 99, "is_approved": false }, "message": "Review submitted for approval" }`

---

## GET /api/reviews/product/{product_id}

**Purpose**: Paginated approved reviews for a product.

**Query params**: `page=1&per_page=10`

**Response 200**:
```json
{
  "data": [
    {
      "id": 10, "customer_name": "Sara Ali", "rating": 5,
      "title": "Perfect frames!", "body": "...",
      "images": [], "is_verified_purchase": true,
      "created_at": "2026-05-10T08:00:00"
    }
  ],
  "total": 25, "page": 1, "per_page": 10
}
```

---

## GET /api/reviews/featured

**Purpose**: Featured reviews for the homepage reviews strip.

**Response 200**: `{ "data": [ ...up to 6 featured approved reviews... ] }`

---

## POST /api/upload/image

**Purpose**: Upload a product or blog image to Cloudinary.
**Auth**: Required (admin only — enforced at route level)

**Request**: multipart/form-data with `file` field

**Response 201**: `{ "data": { "url": "https://...", "public_id": "deluxe-opt/products/abc123" } }`

**Errors**: `400` unsupported file type | `413` file too large (>10MB)

---

## POST /api/upload/prescription

**Purpose**: Upload a prescription photo (customer-facing, no auth required).

**Request**: multipart/form-data with `file` field

**Response 201**: `{ "data": { "url": "https://...", "public_id": "deluxe-opt/prescriptions/..." } }`

**Folder**: Cloudinary `deluxe-opt/prescriptions/`

---

## GET /api/blogs

**Purpose**: Paginated published blogs only.

**Query params**: `category=lens-guide&page=1&per_page=9`

**Response 200**:
```json
{
  "data": [
    {
      "id": 1, "title": "How to Choose Progressive Lenses",
      "slug": "how-to-choose-progressive-lenses",
      "cover_image_url": "https://...", "category": "lens-guide",
      "meta_description": "...",
      "published_at": "2026-05-01T00:00:00",
      "read_time_minutes": 4
    }
  ],
  "total": 18, "page": 1, "per_page": 9
}
```

**Note**: `read_time_minutes` computed from word count (~200 words/min).

---

## GET /api/blogs/{slug}

**Purpose**: Full blog detail (published only).

**Response 200**: Full blog object including `content` (rich HTML).

**Errors**: `404` not found or unpublished

---

## GET /api/faqs

**Purpose**: Active FAQs ordered by sort_order.

**Query params**: `category=prescription` (optional)

**Response 200**:
```json
{
  "data": [
    { "id": 1, "question": "How do I measure my PD?", "answer": "...", "category": "prescription" }
  ]
}
```

---

## GET /api/lens-collection

**Purpose**: Active lens collections for homepage video section.

**Response 200**:
```json
{
  "data": [
    {
      "id": 1, "name": "Transitions", "video_url": "https://...",
      "description": "...", "bullets": ["Darkens in sunlight", "Clear indoors"],
      "price_from": 1500.0, "color_dot": "#8B4513"
    }
  ]
}
```
