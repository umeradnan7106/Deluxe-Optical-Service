"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  TruckIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  TagIcon,
  ShoppingCartIcon,
  ArchiveBoxArrowDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
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

const WaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const SizeChartSVG = () => (
  <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[300px] mx-auto">
    <rect x="20" y="50" width="110" height="80" rx="14" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
    <rect x="190" y="50" width="110" height="80" rx="14" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
    <path d="M130 90 Q160 76 190 90" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="20" y1="74" x2="0" y2="74" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="300" y1="74" x2="320" y2="74" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="20" y1="32" x2="130" y2="32" stroke="#E8670A" strokeWidth="1" strokeDasharray="4,2" />
    <line x1="20" y1="27" x2="20" y2="37" stroke="#E8670A" strokeWidth="1.5" />
    <line x1="130" y1="27" x2="130" y2="37" stroke="#E8670A" strokeWidth="1.5" />
    <text x="75" y="24" textAnchor="middle" fontSize="10" fill="#6b7280" fontFamily="sans-serif">Lens Width</text>
    <line x1="130" y1="32" x2="190" y2="32" stroke="#E8670A" strokeWidth="1" strokeDasharray="4,2" />
    <line x1="190" y1="27" x2="190" y2="37" stroke="#E8670A" strokeWidth="1.5" />
    <text x="160" y="24" textAnchor="middle" fontSize="10" fill="#6b7280" fontFamily="sans-serif">Bridge</text>
    <line x1="300" y1="160" x2="320" y2="160" stroke="#E8670A" strokeWidth="1" strokeDasharray="4,2" />
    <line x1="300" y1="74" x2="300" y2="164" stroke="#E8670A" strokeWidth="1" strokeDasharray="4,2" />
    <line x1="320" y1="74" x2="320" y2="164" stroke="#E8670A" strokeWidth="1" strokeDasharray="4,2" />
    <text x="310" y="174" textAnchor="middle" fontSize="10" fill="#6b7280" fontFamily="sans-serif">Temple</text>
  </svg>
);

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

const USP_ITEMS = [
  { Icon: ArchiveBoxArrowDownIcon, title: "Open Parcel Delivery", sub: "Check before you pay" },
  { Icon: ArrowPathIcon, title: "7-Day Easy Returns", sub: "Hassle-free process" },
  { Icon: TruckIcon, title: "Free Delivery", sub: "On orders above Rs. 3,000" },
  { Icon: ChatBubbleLeftRightIcon, title: "WhatsApp Support", sub: "Chat anytime" },
];

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
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

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
    return <div className="flex items-center justify-center min-h-[60vh] text-[#6b7280]">Loading…</div>;
  }
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="text-[#1a1a1a] font-semibold mb-2">Unable to load product</p>
        <p className="text-[#6b7280] text-sm mb-4">{loadError}</p>
        <Link href="/products" className="text-[#E8670A] text-sm hover:underline">Browse all products</Link>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="text-[#1a1a1a] font-semibold mb-2">Product not found</p>
        <Link href="/products" className="text-[#E8670A] text-sm hover:underline">Browse all products</Link>
      </div>
    );
  }

  const variant = product.variants[selectedVariantIdx];
  const allImages = variant?.images ?? [];
  const displayPrice = product.sale_price ?? product.base_price;
  const discountPct = product.sale_price ? getDiscountPercent(product.base_price, product.sale_price) : 0;

  const frameSizeStr = (() => {
    const parts = [product.lens_width_mm, product.bridge_mm, product.temple_mm].filter((v) => v != null);
    if (!parts.length) return null;
    if (variant?.size_label) {
      return `${variant.size_label} (${product.lens_width_mm}□${product.bridge_mm}-${product.temple_mm})`;
    }
    return `${product.lens_width_mm}□${product.bridge_mm}-${product.temple_mm}`;
  })();

  const shortDesc = (() => {
    const stripped = stripHtml(product.description);
    return stripped.length > 120 ? stripped.slice(0, 120) + "…" : stripped;
  })();

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

  return (
    <>
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex gap-2 text-xs text-[#6b7280] mb-6">
          <Link href="/" className="hover:text-[#E8670A]">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#E8670A]">Products</Link>
          <span>/</span>
          <span className="text-[#1a1a1a]">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Gallery + Width Guide */}
          <div className="lg:w-1/2 space-y-4">
            <ProductGallery images={allImages} productName={product.name} />
            <WidthGuide
              sizeLabel={variant?.size_label ?? null}
              colorName={variant?.color_name ?? null}
              material={product.material}
              frameShape={product.frame_shape}
              rimType={product.rim_type}
              frameWidthMm={product.frame_width_mm}
              lensWidthMm={product.lens_width_mm}
              bridgeMm={product.bridge_mm}
              templeMm={product.temple_mm}
              lensHeightMm={product.lens_height_mm}
            />
          </div>

          {/* Right: Details */}
          <div className="lg:w-1/2">
            {/* Category label above title */}
            {product.category && (
              <p className="text-[#E8670A] text-[11px] font-semibold uppercase tracking-widest mb-2">
                {product.category}
              </p>
            )}

            {/* Rating */}
            {product.average_rating !== null && (
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={product.average_rating} size="md" />
                <span className="text-[#6b7280] text-sm">({product.review_count} reviews)</span>
              </div>
            )}

            {/* Title + SKU */}
            <h1 className="font-['Cormorant_Garamond'] text-3xl text-[#1a1a1a] font-semibold leading-tight mb-1">
              {product.name}
            </h1>
            <p className="text-[#6b7280] text-xs mb-3">SKU: {product.sku}</p>

            {/* Short description */}
            {shortDesc && (
              <p className="text-[#6b7280] text-[13px] leading-[1.6] mb-3">{shortDesc}</p>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[#E8670A] text-2xl font-bold">{formatPrice(displayPrice)}</span>
              {product.sale_price && (
                <>
                  <span className="text-[#6b7280] line-through text-lg">{formatPrice(product.base_price)}</span>
                  <Badge variant="orange">-{discountPct}%</Badge>
                </>
              )}
            </div>

            <hr className="border-[#e5e7eb] my-3" />

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mb-4">
                <p className="text-[#6b7280] text-sm mb-2">
                  Color: <span className="text-[#1a1a1a] font-medium">{variant?.color_name}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIdx(i)}
                      title={v.color_name}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        i === selectedVariantIdx ? "border-[#E8670A] scale-110" : "border-[#e5e7eb]"
                      }`}
                      style={{ backgroundColor: v.color_hex ?? "#ccc" }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Frame size */}
            {frameSizeStr && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#6b7280] text-sm">Frame Size</p>
                  <button
                    onClick={() => setSizeChartOpen(true)}
                    className="border border-[#E8670A] text-[#E8670A] rounded-[5px] px-3 py-1 text-xs hover:bg-[#FFF0E6] transition-colors"
                  >
                    Size Chart
                  </button>
                </div>
                <div className="inline-flex items-center bg-[#f9fafb] border border-[#e5e7eb] rounded px-3 py-1.5 text-sm text-[#1a1a1a] font-mono">
                  {frameSizeStr}
                </div>
              </div>
            )}

            <hr className="border-[#e5e7eb] my-3" />

            {/* Select Lenses CTA — immediately after frame size divider */}
            <Link href={`/products/${product.slug}/select-lenses`} className="block w-full mb-1">
              <Button variant="primary" size="lg" fullWidth>Select Your Lenses</Button>
            </Link>
            <p className="text-[#6b7280] text-xs text-center mb-4">No prescription? You can still add frame-only.</p>

            {/* Payment box */}
            <div className="bg-[#FFF0E6] border border-[#fddbb4] rounded-[5px] p-3 mb-4 flex items-start gap-2">
              <TagIcon className="w-5 h-5 text-[#E8670A] shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold text-[#C45408]">Save 15% with online payment</p>
                <p className="text-[11px] text-[#6b7280] mt-0.5">EasyPaisa, JazzCash, or Bank Transfer — 15% instant discount</p>
              </div>
            </div>

            {/* Qty + Add to Cart — 20% / 80% */}
            <div className="flex gap-2 mb-3">
              <div className="flex items-center border border-[#e5e7eb] rounded-[5px] overflow-hidden" style={{ flex: "0 0 20%" }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex-1 py-2.5 text-[#1a1a1a] hover:bg-[#f9fafb] transition-colors text-lg leading-none"
                >
                  −
                </button>
                <span className="px-2 text-center text-[#1a1a1a] text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex-1 py-2.5 text-[#1a1a1a] hover:bg-[#f9fafb] transition-colors text-lg leading-none"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!variant || variant.stock === 0}
                className="flex items-center justify-center gap-2 bg-[#0F0F0F] hover:bg-[#1a1a1a] text-white rounded-[5px] text-sm font-medium transition-colors disabled:opacity-50"
                style={{ flex: "1" }}
              >
                <ShoppingCartIcon className="w-4 h-4" />
                {variant?.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>

            {/* Stock badge */}
            {variant && variant.stock <= 5 && variant.stock > 0 && (
              <p className="text-[#E8670A] text-xs mb-3">Only {variant.stock} left in stock</p>
            )}

            {/* WhatsApp button */}
            <a
              href={`${WHATSAPP_URL}?text=Hi! I'm interested in: ${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25d366] hover:bg-[#1ebe5d] text-white rounded-[5px] py-3 text-sm font-medium transition-colors mb-5"
            >
              <WaIcon className="w-[18px] h-[18px]" />
              Order via WhatsApp
            </a>

            {/* USP 2×2 grid */}
            <div className="grid grid-cols-2 gap-2">
              {USP_ITEMS.map(({ Icon, title, sub }) => (
                <div key={title} className="bg-white border border-[#e5e7eb] rounded-lg p-3 text-center">
                  <div className="w-8 h-8 rounded-full bg-[#FFF0E6] flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-[22px] h-[22px] text-[#E8670A]" />
                  </div>
                  <p className="text-[12px] font-semibold text-[#1a1a1a] leading-tight">{title}</p>
                  <p className="text-[10px] text-[#6b7280] mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 border-b border-[#e5e7eb]">
          <div className="flex gap-0">
            {(["features", "description", "lenses"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  tab === t ? "border-[#E8670A] text-[#E8670A]" : "border-transparent text-[#6b7280] hover:text-[#1a1a1a]"
                }`}
              >
                {t === "features" ? "Features & Size" : t === "lenses" ? "Lens Recommendation" : "Description"}
              </button>
            ))}
          </div>
        </div>

        <div className="py-8">
          {/* Features & Size tab (FIX 10) */}
          {tab === "features" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: spec table */}
              <div>
                <div className="space-y-3 text-[13px]">
                  {[
                    { label: "Size", value: frameSizeStr },
                    { label: "Color", value: variant?.color_name },
                    { label: "Material", value: product.material },
                    { label: "Shape", value: product.frame_shape },
                    { label: "Rim", value: product.rim_type },
                  ].filter(({ value }) => value).map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-2 border-b border-[#f3f4f6] pb-3">
                      <span className="text-[#6b7280] w-[90px] shrink-0">• {label}</span>
                      <span className="text-[#1a1a1a] font-medium capitalize">{value}</span>
                    </div>
                  ))}
                </div>

                {product.bullets.length > 0 && (
                  <ul className="mt-5 space-y-2 text-sm text-[#6b7280]">
                    {product.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#E8670A] mt-0.5">•</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                <Link href="/shipping-returns" className="inline-block mt-4 text-[#E8670A] text-xs hover:underline">
                  Not sure about your size? Size Guide &rsaquo;
                </Link>
              </div>

              {/* Right: first product image */}
              {allImages[0] && (
                <div>
                  <div className="bg-white border border-[#e5e7eb] rounded-lg overflow-hidden">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={allImages[0].url}
                        alt={allImages[0].alt_text || product.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                  {(product.lens_width_mm || product.bridge_mm || product.temple_mm) && (
                    <p className="text-[#6b7280] text-[11px] mt-2 text-center">
                      {[
                        product.lens_width_mm && `${product.lens_width_mm}mm lens`,
                        product.bridge_mm && `${product.bridge_mm}mm bridge`,
                        product.temple_mm && `${product.temple_mm}mm temple`,
                      ].filter(Boolean).join(" | ")}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Description tab (FIX 11) */}
          {tab === "description" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div
                className="prose prose-sm text-[#6b7280] max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
              {(allImages[2] || allImages[1]) && (
                <div className="bg-white border border-[#e5e7eb] rounded-lg overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={(allImages[2] ?? allImages[1]).url}
                      alt={(allImages[2] ?? allImages[1]).alt_text || product.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "lenses" && (
            <p className="text-[#6b7280]">Explore lens options tailored for this frame in the &ldquo;Select Lenses&rdquo; flow above.</p>
          )}
        </div>

        {/* Reviews Section */}
        <div className="mt-12 border-t border-[#e5e7eb] pt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#1a1a1a] font-semibold">Customer Reviews</h2>
              {reviewTotal > 0 && product.average_rating !== null && (
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={product.average_rating} size="md" />
                  <span className="text-[#6b7280] text-sm">{product.average_rating.toFixed(1)} out of 5 ({reviewTotal} reviews)</span>
                </div>
              )}
            </div>
            <Button variant="outline" size="md" onClick={() => setShowReviewModal(true)}>Write a Review</Button>
          </div>

          {reviews.length === 0 ? (
            <p className="text-[#6b7280] text-sm">No reviews yet. Be the first to review this product!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((r) => (
                <div key={r.id} className="border-b border-[#e5e7eb] pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-[#1a1a1a] font-medium text-sm">{r.customer_name}</span>
                      {r.order_id && (
                        <span className="ml-2 text-[10px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded">Verified Purchase</span>
                      )}
                    </div>
                    <span className="text-[#6b7280] text-xs">{new Date(r.created_at).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })}</span>
                  </div>
                  <StarRating rating={r.rating} size="sm" />
                  <p className="text-[#1a1a1a] font-medium text-sm mt-2">{r.title}</p>
                  <p className="text-[#6b7280] text-sm mt-1 leading-relaxed">{r.body}</p>
                  {r.images?.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {r.images.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                          <Image src={url} alt="" width={64} height={64} className="rounded object-cover border border-[#e5e7eb]" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {reviews.length < reviewTotal && (
                <button onClick={() => setReviewPage((p) => p + 1)} className="text-[#E8670A] text-sm hover:underline">
                  Load more reviews ({reviewTotal - reviews.length} remaining)
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Size Chart Modal (FIX 4) */}
      {sizeChartOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSizeChartOpen(false)}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Cormorant_Garamond'] text-xl text-[#1a1a1a] font-semibold">Size Chart</h3>
              <button onClick={() => setSizeChartOpen(false)} className="text-[#6b7280] hover:text-[#1a1a1a]">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <SizeChartSVG />
            {frameSizeStr && (
              <p className="text-center text-[#1a1a1a] font-mono text-sm mt-4 bg-[#f9fafb] border border-[#e5e7eb] rounded px-3 py-2">
                {frameSizeStr}
              </p>
            )}
            <p className="text-[#6b7280] text-xs mt-3 text-center">
              {[
                product.lens_width_mm && `Lens: ${product.lens_width_mm}mm`,
                product.bridge_mm && `Bridge: ${product.bridge_mm}mm`,
                product.temple_mm && `Temple: ${product.temple_mm}mm`,
              ].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-['Cormorant_Garamond'] text-xl text-[#1a1a1a] font-semibold mb-4">Write a Review</h3>
            {reviewSuccess ? (
              <div className="text-center py-6">
                <p className="text-green-600 font-medium">Review submitted!</p>
                <p className="text-[#6b7280] text-sm mt-1">It will appear after approval.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#6b7280] block mb-1">Your Name *</label>
                    <input value={reviewForm.name} onChange={(e) => setReviewForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full bg-white border border-[#e5e7eb] text-[#1a1a1a] text-sm px-3 py-2 rounded outline-none focus:border-[#E8670A]" />
                  </div>
                  <div>
                    <label className="text-xs text-[#6b7280] block mb-1">Email *</label>
                    <input type="email" value={reviewForm.email} onChange={(e) => setReviewForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full bg-white border border-[#e5e7eb] text-[#1a1a1a] text-sm px-3 py-2 rounded outline-none focus:border-[#E8670A]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#6b7280] block mb-1">Rating *</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setReviewForm((f) => ({ ...f, rating: s }))}>
                        <span className={`text-xl ${s <= reviewForm.rating ? "text-[#E8670A]" : "text-[#e5e7eb]"}`}>★</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#6b7280] block mb-1">Title *</label>
                  <input value={reviewForm.title} onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full bg-white border border-[#e5e7eb] text-[#1a1a1a] text-sm px-3 py-2 rounded outline-none focus:border-[#E8670A]"
                    placeholder="Summarize your experience" />
                </div>
                <div>
                  <label className="text-xs text-[#6b7280] block mb-1">Review *</label>
                  <textarea value={reviewForm.body} onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
                    rows={4}
                    className="w-full bg-white border border-[#e5e7eb] text-[#1a1a1a] text-sm px-3 py-2 rounded outline-none focus:border-[#E8670A] resize-none"
                    placeholder="Share your experience…" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="primary" size="md" onClick={submitReview}
                    disabled={reviewSubmitting || !reviewForm.name || !reviewForm.email || !reviewForm.title || !reviewForm.body}>
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
