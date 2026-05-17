"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { productsApi } from "@/lib/api";
import type { Product } from "@/types";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { WHATSAPP_URL } from "@/lib/constants";
import ProductGallery from "@/components/product/ProductGallery";
import WidthGuide from "@/components/product/WidthGuide";
import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import StickyBar from "@/components/product/StickyBar";
import ProductCard from "@/components/product/ProductCard";
import useCartStore from "@/store/cartStore";

type Tab = "features" | "description" | "lenses";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product["variants"]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<Tab>("features");

  useEffect(() => {
    async function load() {
      const [pRes, rRes] = await Promise.all([
        productsApi.detail(slug),
        productsApi.list({ category: undefined, page: 1, per_page: 4 }),
      ]);
      setProduct(pRes.data);
    }
    load().catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading…</div>;
  }
  if (!product) {
    return <div className="flex items-center justify-center min-h-screen text-gray-400">Product not found</div>;
  }

  const variant = product.variants[selectedVariantIdx];
  const allImages = variant?.images ?? [];
  const displayPrice = product.sale_price ?? product.base_price;
  const discountPct = product.sale_price ? getDiscountPercent(product.base_price, product.sale_price) : 0;

  function handleAddToCart() {
    if (!variant) return;
    addItem({
      product_id: product!.id,
      product_name: product!.name,
      product_slug: product!.slug,
      thumbnail_url: variant.images?.[0]?.url ?? null,
      variant_id: variant.id,
      color_name: variant.color_name,
      base_price: product!.base_price,
      sale_price: product!.sale_price ?? null,
      quantity,
      selected_lens_options: [],
      lens_options_price: 0,
      prescription: null,
    });
    router.push("/cart");
  }

  const USP_ITEMS = [
    "Free delivery on orders Rs. 3,000+",
    "15-day easy returns",
    "Authentic products guaranteed",
    "Pakistan-wide delivery",
  ];

  return (
    <>
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white">Products</Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Gallery + Width Guide */}
          <div className="lg:w-1/2 space-y-4">
            <ProductGallery images={allImages} productName={product.name} />
            <WidthGuide
              productName={product.name}
              frameWidthMm={product.frame_width_mm as number | undefined}
              lensWidthMm={product.lens_width_mm as number | undefined}
              bridgeMm={product.bridge_mm as number | undefined}
              templeMm={product.temple_mm as number | undefined}
              lensHeightMm={product.lens_height_mm as number | undefined}
            />
          </div>

          {/* Right: Details */}
          <div className="lg:w-1/2">
            {/* Rating */}
            {product.average_rating !== null && (
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={product.average_rating} size="md" />
                <span className="text-gray-400 text-sm">({product.review_count} reviews)</span>
              </div>
            )}

            {/* Title */}
            <h1 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold leading-tight mb-1">
              {product.name}
            </h1>
            <p className="text-gray-500 text-xs mb-4">SKU: {product.sku}</p>

            {/* Price */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[#E8670A] text-2xl font-bold">{formatPrice(displayPrice)}</span>
              {product.sale_price && (
                <>
                  <span className="text-gray-500 line-through text-lg">{formatPrice(product.base_price)}</span>
                  <Badge variant="orange">-{discountPct}%</Badge>
                </>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mb-5">
                <p className="text-gray-400 text-sm mb-2">
                  Color: <span className="text-white">{variant?.color_name}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIdx(i)}
                      title={v.color_name}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        i === selectedVariantIdx ? "border-[#E8670A] scale-110" : "border-gray-600"
                      }`}
                      style={{ backgroundColor: v.color_hex ?? "#ccc" }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Payment info box */}
            <div className="bg-[#1a1a1a] rounded p-3 mb-5 text-xs text-gray-300">
              <p className="font-medium text-white mb-1">Save 15% with online payment</p>
              <p>EasyPaisa, JazzCash, or Bank Transfer — 15% instant discount</p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-gray-400 text-sm">Qty:</span>
              <div className="flex items-center border border-[#3a3a3a] rounded">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-white hover:bg-[#2a2a2a]"
                >
                  −
                </button>
                <span className="px-4 text-white text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-white hover:bg-[#2a2a2a]"
                >
                  +
                </button>
              </div>
              {variant && variant.stock <= 5 && variant.stock > 0 && (
                <Badge variant="red">Only {variant.stock} left</Badge>
              )}
              {variant && variant.stock === 0 && <Badge variant="gray">Out of Stock</Badge>}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 mb-6">
              <Link href={`/products/${product.slug}/select-lenses`} className="w-full">
                <Button variant="primary" size="lg" fullWidth>Select Lenses</Button>
              </Link>
              <Button
                variant="dark"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                disabled={!variant || variant.stock === 0}
              >
                Add to Cart (No Lens)
              </Button>
              <a
                href={`${WHATSAPP_URL}?text=Hi! I'm interested in: ${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="whatsapp" size="lg" fullWidth>Order via WhatsApp</Button>
              </a>
            </div>

            {/* USP grid */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              {USP_ITEMS.map((u) => (
                <div key={u} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8670A]" />
                  {u}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 border-b border-[#2a2a2a]">
          <div className="flex gap-0">
            {(["features", "description", "lenses"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-3 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
                  tab === t ? "border-[#E8670A] text-[#E8670A]" : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {t === "features" ? "Features & Size" : t === "lenses" ? "Lens Recommendation" : "Description"}
              </button>
            ))}
          </div>
        </div>

        <div className="py-6 text-gray-300 text-sm leading-relaxed">
          {tab === "features" && (
            <ul className="space-y-2">
              {product.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#E8670A] mt-0.5">•</span>
                  {b}
                </li>
              ))}
            </ul>
          )}
          {tab === "description" && (
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          )}
          {tab === "lenses" && (
            <p className="text-gray-400">Explore lens options tailored for this frame in the "Select Lenses" flow above.</p>
          )}
        </div>
      </div>

      <StickyBar
        productSlug={product.slug}
        productName={product.name}
        variantName={variant?.color_name ?? ""}
        price={product.base_price}
        salePrice={product.sale_price}
        thumbnailUrl={variant?.images?.[0]?.url ?? null}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}
