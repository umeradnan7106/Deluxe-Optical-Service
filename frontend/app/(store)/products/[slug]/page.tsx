"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { productsApi, reviewsApi } from "@/lib/api";
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

interface ReviewData {
  id: number;
  customer_name: string;
  rating: number;
  title: string;
  body: string;
  images: string[];
  order_id: number | null;
  created_at: string;
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<Tab>("features");

  // Reviews state
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [reviewPage, setReviewPage] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", email: "", rating: 5, title: "", body: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const pRes = await productsApi.detail(slug);
      setProduct(pRes.data as Product);
    }
    load().catch((err) => {
      const msg = err?.response?.data?.detail ?? err?.message ?? "Failed to load product";
      setLoadError(msg);
    }).finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    reviewsApi.forProduct(product.id, reviewPage).then(({ data }) => {
      const d = data as { items: ReviewData[]; total: number };
      setReviews((prev) => reviewPage === 1 ? d.items : [...prev, ...d.items]);
      setReviewTotal(d.total);
    }).catch(() => {});
  }, [product, reviewPage]);

  async function submitReview() {
    if (!product) return;
    setReviewSubmitting(true);
    try {
      await reviewsApi.create({ ...reviewForm, product_id: product.id });
      setReviewSuccess(true);
      setReviewForm({ name: "", email: "", rating: 5, title: "", body: "" });
      setTimeout(() => { setShowReviewModal(false); setReviewSuccess(false); }, 2000);
    } catch {
      //
    } finally {
      setReviewSubmitting(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gray-500">Loading…</div>;
  }
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="text-gray-900 font-semibold mb-2">Unable to load product</p>
        <p className="text-gray-500 text-sm mb-4">{loadError}</p>
        <Link href="/products" className="text-[#E8670A] text-sm hover:underline">Browse all products</Link>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="text-gray-900 font-semibold mb-2">Product not found</p>
        <Link href="/products" className="text-[#E8670A] text-sm hover:underline">Browse all products</Link>
      </div>
    );
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

        {/* Reviews Section */}
        <div className="mt-12 border-t border-[#2a2a2a] pt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-['Cormorant_Garamond'] text-2xl text-white font-semibold">Customer Reviews</h2>
              {reviewTotal > 0 && product.average_rating !== null && (
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={product.average_rating} size="md" />
                  <span className="text-gray-400 text-sm">{product.average_rating.toFixed(1)} out of 5 ({reviewTotal} reviews)</span>
                </div>
              )}
            </div>
            <Button variant="outline" size="md" onClick={() => setShowReviewModal(true)}>Write a Review</Button>
          </div>

          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((r) => (
                <div key={r.id} className="border-b border-[#2a2a2a] pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-white font-medium text-sm">{r.customer_name}</span>
                      {r.order_id && (
                        <span className="ml-2 text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded">Verified Purchase</span>
                      )}
                    </div>
                    <span className="text-gray-500 text-xs">{new Date(r.created_at).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })}</span>
                  </div>
                  <StarRating rating={r.rating} size="sm" />
                  <p className="text-white font-medium text-sm mt-2">{r.title}</p>
                  <p className="text-gray-300 text-sm mt-1 leading-relaxed">{r.body}</p>
                  {r.images?.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {r.images.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                          <Image src={url} alt="" width={64} height={64} className="rounded object-cover border border-[#2a2a2a]" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {reviews.length < reviewTotal && (
                <button onClick={() => setReviewPage((p) => p + 1)}
                  className="text-[#E8670A] text-sm hover:underline">
                  Load more reviews ({reviewTotal - reviews.length} remaining)
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded w-full max-w-md p-6">
            <h3 className="font-['Cormorant_Garamond'] text-xl text-white font-semibold mb-4">Write a Review</h3>
            {reviewSuccess ? (
              <div className="text-center py-6">
                <p className="text-green-400 font-medium">Review submitted!</p>
                <p className="text-gray-400 text-sm mt-1">It will appear after approval.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Your Name *</label>
                    <input value={reviewForm.name} onChange={(e) => setReviewForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded outline-none focus:border-[#E8670A]" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Email *</label>
                    <input type="email" value={reviewForm.email} onChange={(e) => setReviewForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded outline-none focus:border-[#E8670A]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Rating *</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setReviewForm((f) => ({ ...f, rating: s }))}>
                        <span className={`text-xl ${s <= reviewForm.rating ? "text-[#E8670A]" : "text-gray-600"}`}>★</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Title *</label>
                  <input value={reviewForm.title} onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded outline-none focus:border-[#E8670A]"
                    placeholder="Summarize your experience" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Review *</label>
                  <textarea value={reviewForm.body} onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
                    rows={4}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded outline-none focus:border-[#E8670A] resize-none"
                    placeholder="Share your experience…" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="primary" size="md" onClick={submitReview} disabled={reviewSubmitting || !reviewForm.name || !reviewForm.email || !reviewForm.title || !reviewForm.body}>
                    {reviewSubmitting ? "Submitting…" : "Submit Review"}
                  </Button>
                  <Button variant="outline" size="md" onClick={() => setShowReviewModal(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
