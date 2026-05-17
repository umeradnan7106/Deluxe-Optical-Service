# API Contract: Products (`/api/products`)

---

## GET /api/products

**Purpose**: Paginated product listing with filters and sorting.

**Query parameters**:
| Param | Type | Default | Values |
|-------|------|---------|--------|
| category | string | — | sunglasses\|prescription\|blue-cut\|screen\|transition\|kids |
| gender | string | — | men\|women\|unisex\|kids |
| frame_shape | string | — | round\|square\|oval\|cat-eye\|aviator\|wayfarer |
| material | string | — | (free text match) |
| rim_type | string | — | full-rim\|half-rim\|rimless |
| min_price | float | — | |
| max_price | float | — | |
| is_featured | bool | — | true\|false |
| search | string | — | full-text on name, sku |
| sort | string | newest | newest\|price_asc\|price_desc\|best_selling\|top_rated |
| page | int | 1 | |
| per_page | int | 20 | max 100 |

**Response 200**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Aviator Gold",
      "slug": "aviator-gold",
      "sku": "DOS-SG-001",
      "category": "sunglasses",
      "gender": "men",
      "original_price": 2500.0,
      "sale_price": 1999.0,
      "is_featured": true,
      "main_image_url": "https://...",
      "avg_rating": 4.5,
      "review_count": 12,
      "variants_summary": [
        { "color_name": "Gold", "color_hex": "#8B6914", "sizes": ["S", "M"] }
      ]
    }
  ],
  "total": 84,
  "page": 1,
  "per_page": 20
}
```

---

## GET /api/products/{slug}

**Purpose**: Full product detail for the product detail page.

**Response 200**:
```json
{
  "data": {
    "id": 1,
    "name": "Aviator Gold",
    "slug": "aviator-gold",
    "sku": "DOS-SG-001",
    "frame_number": "52-18-140",
    "category": "sunglasses",
    "gender": "men",
    "frame_shape": "aviator",
    "material": "Metal",
    "rim_type": "full-rim",
    "weight_grams": 25.5,
    "original_price": 2500.0,
    "sale_price": 1999.0,
    "description": "<p>Rich HTML...</p>",
    "description_image_url": "https://...",
    "spec_image_url": "https://...",
    "frame_width_mm": 140,
    "lens_width_mm": 52,
    "bridge_mm": 18,
    "temple_mm": 140,
    "lens_height_mm": 40,
    "meta_title": "...",
    "meta_description": "...",
    "is_active": true,
    "is_featured": true,
    "avg_rating": 4.5,
    "review_count": 12,
    "images": [
      { "id": 1, "url": "https://...", "sort_order": 0 },
      { "id": 2, "url": "https://...", "sort_order": 1 }
    ],
    "variants": [
      {
        "id": 1, "color_name": "Gold", "color_hex": "#8B6914",
        "size_label": "Medium", "size_code": "M",
        "lens_width": 52, "bridge": 18, "temple": 140,
        "sku_variant": "DOS-SG-001-M-GLD",
        "price": null, "stock": 15, "is_active": true
      }
    ]
  },
  "message": "success"
}
```

**Errors**: `404` product not found or inactive

---

## GET /api/products/{slug}/lens-options

**Purpose**: Return lens options grouped by type for a specific product.
Only options assigned via ProductLensOption are returned.

**Response 200**:
```json
{
  "data": {
    "lens_types": [
      { "id": 1, "name": "Single Vision", "price": 800.0, "description": "...", "sub_type": null },
      { "id": 2, "name": "Progressive — Premium", "price": 3500.0, "description": "...", "sub_type": "premium" }
    ],
    "coatings": [
      { "id": 10, "name": "Standard Clear", "price": 0.0, "description": "..." },
      { "id": 11, "name": "Anti-Reflective", "price": 500.0, "description": "..." }
    ],
    "addons": [
      { "id": 20, "name": "UV400 Protection", "price": 0.0, "description": "Included Free" }
    ]
  },
  "message": "success"
}
```

---

## GET /api/products/{slug}/related

**Purpose**: 4 related products from the same category (excluding current product).

**Response 200**: `{ "data": [ ...4 product summary objects... ] }`
