"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircleIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import { productsApi } from "@/lib/api";
import type { Product, PrescriptionData, LensOption } from "@/types";
import LensStep1Usage from "@/components/lenses/LensStep1Usage";
import LensStep2Prescription from "@/components/lenses/LensStep2Prescription";
import LensStep4Addons from "@/components/lenses/LensStep4Addons";
import Button from "@/components/ui/Button";
import useCartStore from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import Placeholder from "@/components/ui/Placeholder";

const STEPS = ["Usage", "Prescription", "Lens", "Add-Ons", "Review"];

/* ── Lens step (step 3): choose anti-reflective, etc. ────────────────── */
const LENS_OPTIONS_STATIC = [
  { id: "standard", label: "Standard Clear", price: 0, desc: "Basic clear lens included with frame" },
  { id: "ar", label: "Anti-Reflective", price: 500, desc: "Reduces glare and eye strain" },
  { id: "hc", label: "Hard Coat", price: 300, desc: "Scratch-resistant coating" },
  { id: "ar-hc", label: "Anti-Reflective + Hard Coat", price: 700, desc: "Best protection bundle" },
];

export default function SelectLensesPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

  const [selectedVariantIdx] = useState(0);
  const [selectedLensTypeId, setSelectedLensTypeId] = useState<number | null>(null);
  const [prescription, setPrescription] = useState<PrescriptionData | null>(null);
  const [selectedLensCoatingId, setSelectedLensCoatingId] = useState<string>("standard");
  const [selectedAddonIds, setSelectedAddonIds] = useState<number[]>([]);

  useEffect(() => {
    productsApi.detail(slug).then(({ data }) => {
      setProduct(data);
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#E8670A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#6b7280] text-sm">Loading product…</p>
        </div>
      </div>
    );
  }

  const variant = product.variants[selectedVariantIdx];
  const framePrice = product.sale_price ?? product.base_price;
  const thumbnail = variant?.images?.[0]?.url ?? null;

  const lensTypes = product.lens_options.lens_type;
  const addons = product.lens_options.addon;

  const selectedLensType = lensTypes.find((l) => l.id === selectedLensTypeId) ?? null;
  const selectedAddonObjects = addons.filter((a) => selectedAddonIds.includes(a.id));
  const selectedCoating = LENS_OPTIONS_STATIC.find((c) => c.id === selectedLensCoatingId);

  const isNonRx = selectedLensTypeId === -1;
  const canAddToCart = selectedLensTypeId !== null;

  function toggleAddon(id: number) {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  const lensOptionsPrice =
    (selectedLensType?.price ?? 0) +
    (selectedCoating?.price ?? 0) +
    selectedAddonObjects.reduce((s, a) => s + a.price, 0);
  const total = framePrice + lensOptionsPrice;

  function handleAddToCart() {
    if (!product || !variant) return;
    const labels: string[] = [];
    if (selectedLensType) labels.push(selectedLensType.name);
    if (selectedCoating && selectedCoating.id !== "standard") labels.push(selectedCoating.label);
    labels.push(...selectedAddonObjects.map((a) => a.name));

    addItem({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      thumbnail_url: thumbnail,
      variant_id: variant.id,
      color_name: variant.color_name,
      base_price: product.base_price,
      sale_price: product.sale_price ?? null,
      quantity: 1,
      selected_lens_options: [
        ...(selectedLensTypeId && selectedLensTypeId !== -1 ? [selectedLensTypeId] : []),
        ...selectedAddonIds,
      ],
      lens_option_labels: labels,
      lens_options_price: lensOptionsPrice,
      prescription: isNonRx ? null : prescription,
    });
    router.push("/cart");
  }

  /* ── Step content ──────────────────────────────────────────────────── */
  const stepContent = [
    /* Step 1 — Usage / Lens Type */
    <LensStep1Usage key="s1" lensTypes={lensTypes} selectedId={selectedLensTypeId} onSelect={setSelectedLensTypeId} />,

    /* Step 2 — Prescription */
    isNonRx ? (
      <div key="s2" className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
          <CheckCircleIcon className="w-8 h-8 text-green-500" />
        </div>
        <p className="font-['Cormorant_Garamond'] text-xl text-[#1a1a1a] font-semibold mb-1">No Prescription Needed</p>
        <p className="text-[#6b7280] text-sm">No prescription required for Non-Rx lenses. Continue to lens coating.</p>
      </div>
    ) : (
      <LensStep2Prescription key="s2" prescription={prescription} onChange={setPrescription} />
    ),

    /* Step 3 — Lens coating */
    <div key="s3" className="space-y-3">
      <h3 className="font-['Cormorant_Garamond'] text-[22px] text-[#1a1a1a] font-semibold mb-1">Choose Your Lens</h3>
      <p className="text-[#6b7280] text-sm mb-4">Select a lens coating for your frames.</p>
      {LENS_OPTIONS_STATIC.map((opt) => {
        const isSelected = selectedLensCoatingId === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setSelectedLensCoatingId(opt.id)}
            className={`w-full text-left rounded-lg border p-4 transition-colors ${
              isSelected ? "border-[#E8670A] bg-[#FFF0E6]" : "border-[#e5e7eb] bg-white hover:border-[#E8670A]/50"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Lens icon placeholder */}
              <div className="w-[44px] h-[44px] rounded bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center shrink-0">
                <svg viewBox="0 0 44 44" className="w-7 h-7" fill="none">
                  <ellipse cx="22" cy="22" rx="14" ry="10" stroke="#E8670A" strokeWidth="2" />
                  {opt.id !== "standard" && <ellipse cx="22" cy="22" rx="10" ry="6" fill="#E8670A" opacity=".12" />}
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#1a1a1a] font-medium text-[14px]">{opt.label}</p>
                <p className="text-[#6b7280] text-[12px] mt-0.5">{opt.desc}</p>
              </div>
              <span className="text-[#E8670A] text-sm font-medium shrink-0">
                {opt.price === 0 ? "Included" : `+${formatPrice(opt.price)}`}
              </span>
              {isSelected && (
                <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
              )}
            </div>
          </button>
        );
      })}
    </div>,

    /* Step 4 — Add-Ons */
    <LensStep4Addons key="s4" addons={addons} selectedIds={selectedAddonIds} onToggle={toggleAddon} />,

    /* Step 5 — Review */
    <ReviewStep
      key="s5"
      product={product}
      variant={variant}
      thumbnail={thumbnail}
      selectedLensType={selectedLensType}
      prescription={prescription}
      selectedCoating={selectedCoating ?? null}
      selectedAddonObjects={selectedAddonObjects}
      framePrice={framePrice}
      total={total}
      canAddToCart={canAddToCart}
      onAddToCart={handleAddToCart}
    />,
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-0">
          {/* Left panel — 50% */}
          <div className="hidden md:flex md:w-1/2 pr-8">
            <LeftPanel
              productSlug={product.slug}
              productName={product.name}
              variantColor={variant?.color_name ?? ""}
              thumbnail={thumbnail}
              framePrice={framePrice}
              selectedLensType={selectedLensType}
              selectedCoating={selectedCoating ?? null}
              selectedAddonObjects={selectedAddonObjects}
              prescription={prescription}
              total={total}
              canAddToCart={canAddToCart}
              onAddToCart={handleAddToCart}
            />
          </div>

          {/* Steps — 50% */}
          <div className="md:w-1/2 md:pl-8 md:border-l md:border-[#e5e7eb]">
            {/* Step tabs */}
            <div className="flex border-b border-[#e5e7eb] mb-6 overflow-x-auto">
              {STEPS.map((s, i) => {
                const completed = i < step;
                const current = i === step;
                return (
                  <button
                    key={s}
                    onClick={() => i <= step && setStep(i)}
                    className={`flex items-center gap-1.5 px-3 py-3 text-xs whitespace-nowrap border-b-2 -mb-px transition-colors ${
                      current
                        ? "border-[#E8670A] text-[#E8670A] font-medium"
                        : completed
                        ? "border-transparent text-green-600"
                        : "border-transparent text-[#6b7280]"
                    }`}
                  >
                    {completed ? <CheckCircleIcon className="w-3.5 h-3.5" /> : <span className="text-[10px] opacity-60">{i + 1}.</span>}
                    <span>{s}</span>
                  </button>
                );
              })}
            </div>

            {/* Step content */}
            <div className="mb-8">{stepContent[step]}</div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="px-5 py-2.5 border border-[#e5e7eb] text-[#1a1a1a] rounded-[5px] text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Back
              </button>
              <p className="text-[#6b7280] text-xs">Step {step + 1} of {STEPS.length}</p>
              {step < STEPS.length - 1 ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={step === 0 && selectedLensTypeId === null}
                >
                  Continue
                </Button>
              ) : (
                <div />
              )}
            </div>

            {/* Mobile back link */}
            <div className="md:hidden mt-4">
              <Link href={`/products/${slug}`} className="text-[#E8670A] text-sm underline">
                ← Back to Frame
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Left Panel ──────────────────────────────────────────────────────── */
interface LeftPanelProps {
  productSlug: string;
  productName: string;
  variantColor: string;
  thumbnail: string | null;
  framePrice: number;
  selectedLensType: LensOption | null;
  selectedCoating: { id: string; label: string; price: number } | null;
  selectedAddonObjects: LensOption[];
  prescription: PrescriptionData | null;
  total: number;
  canAddToCart: boolean;
  onAddToCart: () => void;
}

function LeftPanel({
  productSlug, productName, variantColor, thumbnail,
  framePrice, selectedLensType, selectedCoating, selectedAddonObjects,
  prescription, total, canAddToCart, onAddToCart,
}: LeftPanelProps) {
  const lensPrice = selectedLensType?.price ?? 0;
  const coatingPrice = selectedCoating?.price ?? 0;
  const addonsPrice = selectedAddonObjects.reduce((s, a) => s + a.price, 0);

  return (
    <div className="w-full sticky top-24 flex flex-col gap-5">
      {/* Back link */}
      <Link href={`/products/${productSlug}`} className="text-[#E8670A] text-sm hover:underline w-fit">
        ← Back to Frame
      </Link>

      {/* Large product image — centered, white bg, object-contain */}
      <div className="relative w-full aspect-[4/3] bg-white border border-[#e5e7eb] rounded-lg overflow-hidden">
        {thumbnail ? (
          <Image src={thumbnail} alt={productName} fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
        ) : (
          <Placeholder className="w-full h-full" />
        )}
      </div>

      {/* Product name + color */}
      <div className="text-center">
        <p className="font-['Cormorant_Garamond'] text-[20px] text-[#1a1a1a] font-medium">{productName}</p>
        <p className="text-[#6b7280] text-[13px] mt-0.5">{variantColor}</p>
      </div>

      {/* Price summary — real-time selections */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 space-y-2 text-[13px]">
        <div className="flex justify-between">
          <span className="text-[#6b7280]">Frame</span>
          <span className="text-[#1a1a1a]">{formatPrice(framePrice)}</span>
        </div>
        {selectedLensType && (
          <div className="flex justify-between">
            <span className="text-[#6b7280]">Lens Type: <span className="text-[#1a1a1a]">{selectedLensType.name}</span></span>
            <span className="text-[#1a1a1a]">{lensPrice === 0 ? "Free" : `+${formatPrice(lensPrice)}`}</span>
          </div>
        )}
        {prescription && prescription.method !== "later" && (
          <div className="flex justify-between">
            <span className="text-[#6b7280]">Prescription</span>
            <span className="text-[#1a1a1a]">{prescription.method === "upload" ? "Photo uploaded" : "Manual entry"}</span>
          </div>
        )}
        {selectedCoating && selectedCoating.id !== "standard" && (
          <div className="flex justify-between">
            <span className="text-[#6b7280]">Lens: <span className="text-[#1a1a1a]">{selectedCoating.label}</span></span>
            <span className="text-[#1a1a1a]">+{formatPrice(coatingPrice)}</span>
          </div>
        )}
        {selectedAddonObjects.length > 0 && (
          <div className="flex justify-between">
            <span className="text-[#6b7280]">Add-ons: <span className="text-[#1a1a1a]">{selectedAddonObjects.map((a) => a.name).join(", ")}</span></span>
            <span className="text-[#1a1a1a]">+{formatPrice(addonsPrice)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold border-t border-[#e5e7eb] pt-2 mt-2">
          <span className="text-[#1a1a1a]">Total</span>
          <span className="text-[#E8670A] text-base">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Add to Cart button */}
      <button
        onClick={onAddToCart}
        disabled={!canAddToCart}
        className="w-full flex items-center justify-center gap-2 bg-[#0F0F0F] text-white py-3 rounded-[5px] text-sm font-medium hover:bg-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ShoppingCartIcon className="w-4 h-4" />
        Add to Cart
      </button>
      {!canAddToCart && (
        <p className="text-[#6b7280] text-xs text-center -mt-3">Complete Step 1 to add to cart</p>
      )}
    </div>
  );
}

/* ── Review Step ─────────────────────────────────────────────────────── */
interface ReviewStepProps {
  product: Product;
  variant: Product["variants"][0] | undefined;
  thumbnail: string | null;
  selectedLensType: LensOption | null;
  prescription: PrescriptionData | null;
  selectedCoating: { id: string; label: string; price: number } | null;
  selectedAddonObjects: LensOption[];
  framePrice: number;
  total: number;
  canAddToCart: boolean;
  onAddToCart: () => void;
}

function ReviewStep({
  product, variant, thumbnail,
  selectedLensType, prescription, selectedCoating, selectedAddonObjects,
  framePrice, total, canAddToCart, onAddToCart,
}: ReviewStepProps) {
  const lensPrice = selectedLensType?.price ?? 0;
  const coatingPrice = selectedCoating?.price ?? 0;
  const addonsPrice = selectedAddonObjects.reduce((s, a) => s + a.price, 0);

  return (
    <div className="space-y-5">
      <h3 className="font-['Cormorant_Garamond'] text-[22px] text-[#1a1a1a] font-semibold">Review & Add to Cart</h3>

      {/* Product summary */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 flex items-center gap-4">
        <div className="relative w-16 h-14 shrink-0 rounded bg-white border border-[#e5e7eb] overflow-hidden">
          {thumbnail ? (
            <Image src={thumbnail} alt={product.name} fill className="object-contain" sizes="64px" />
          ) : (
            <Placeholder className="w-full h-full" />
          )}
        </div>
        <div>
          <p className="text-[#1a1a1a] font-medium text-sm">{product.name}</p>
          <p className="text-[#6b7280] text-xs mt-0.5">{variant?.color_name}</p>
        </div>
        <span className="ml-auto text-[#E8670A] font-semibold text-sm">{formatPrice(framePrice)}</span>
      </div>

      {/* Selections */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 space-y-3 text-sm">
        {selectedLensType && (
          <div className="flex justify-between items-center">
            <span className="text-[#6b7280]">Lens Type</span>
            <span className="text-[#1a1a1a] font-medium">{selectedLensType.name} {lensPrice > 0 && <span className="text-[#6b7280]">(+{formatPrice(lensPrice)})</span>}</span>
          </div>
        )}
        {!selectedLensType && (
          <div className="flex justify-between items-center">
            <span className="text-[#6b7280]">Lens Type</span>
            <span className="text-[#1a1a1a] font-medium">Non-Rx (Plano)</span>
          </div>
        )}

        {/* Prescription */}
        {prescription && prescription.method !== "later" && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-[#6b7280]">Prescription</span>
              <span className="text-[#1a1a1a] font-medium">{prescription.method === "upload" ? "Photo uploaded" : "Manual entry"}</span>
            </div>
            {prescription.method === "manual" && (
              <div className="bg-[#f9fafb] rounded p-3 text-xs text-[#6b7280] space-y-1">
                {prescription.right_sph !== undefined && (
                  <p><span className="font-medium text-[#1a1a1a]">OD:</span> SPH {(prescription.right_sph ?? 0) >= 0 ? "+" : ""}{prescription.right_sph}{prescription.right_cyl !== undefined ? ` CYL ${prescription.right_cyl}` : ""}{prescription.right_axis !== undefined ? ` Axis ${prescription.right_axis}°` : ""}</p>
                )}
                {prescription.left_sph !== undefined && (
                  <p><span className="font-medium text-[#1a1a1a]">OS:</span> SPH {(prescription.left_sph ?? 0) >= 0 ? "+" : ""}{prescription.left_sph}{prescription.left_cyl !== undefined ? ` CYL ${prescription.left_cyl}` : ""}{prescription.left_axis !== undefined ? ` Axis ${prescription.left_axis}°` : ""}</p>
                )}
                {prescription.pd !== undefined && <p><span className="font-medium text-[#1a1a1a]">PD:</span> {prescription.pd}mm</p>}
              </div>
            )}
            {prescription.method === "upload" && prescription.prescription_url && (
              <div className="flex items-center gap-3">
                <Image src={prescription.prescription_url} alt="Rx" width={56} height={56} className="rounded border border-[#e5e7eb] object-cover" />
                <span className="text-xs text-[#6b7280]">Prescription photo uploaded</span>
              </div>
            )}
          </>
        )}

        {selectedCoating && selectedCoating.id !== "standard" && (
          <div className="flex justify-between items-center">
            <span className="text-[#6b7280]">Lens</span>
            <span className="text-[#1a1a1a] font-medium">{selectedCoating.label} {coatingPrice > 0 && <span className="text-[#6b7280]">(+{formatPrice(coatingPrice)})</span>}</span>
          </div>
        )}

        {selectedAddonObjects.length > 0 && (
          <div className="flex justify-between items-start">
            <span className="text-[#6b7280]">Add-ons</span>
            <span className="text-[#1a1a1a] font-medium text-right">
              {selectedAddonObjects.map((a) => a.name).join(", ")} {addonsPrice > 0 && <span className="text-[#6b7280]">(+{formatPrice(addonsPrice)})</span>}
            </span>
          </div>
        )}

        {/* Price breakdown */}
        <div className="border-t border-[#e5e7eb] pt-3 space-y-1.5 text-[13px]">
          <div className="flex justify-between text-[#6b7280]">
            <span>Frame</span><span>{formatPrice(framePrice)}</span>
          </div>
          {lensPrice > 0 && <div className="flex justify-between text-[#6b7280]"><span>Lens Type</span><span>+{formatPrice(lensPrice)}</span></div>}
          {coatingPrice > 0 && <div className="flex justify-between text-[#6b7280]"><span>Coating</span><span>+{formatPrice(coatingPrice)}</span></div>}
          {addonsPrice > 0 && <div className="flex justify-between text-[#6b7280]"><span>Add-ons</span><span>+{formatPrice(addonsPrice)}</span></div>}
          <div className="flex justify-between font-semibold text-[15px] pt-1 border-t border-[#e5e7eb]">
            <span className="text-[#1a1a1a]">Total</span>
            <span className="text-[#E8670A]">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Add to Cart — full width, dark bg, cart icon, no WhatsApp */}
      <button
        onClick={onAddToCart}
        disabled={!canAddToCart}
        className="w-full flex items-center justify-center gap-2 bg-[#0F0F0F] text-white py-4 rounded-[5px] text-sm font-medium hover:bg-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ShoppingCartIcon className="w-4 h-4" />
        Add to Cart
      </button>
    </div>
  );
}
