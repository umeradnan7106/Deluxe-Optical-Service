"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { productsApi } from "@/lib/api";
import type { Product, LensOption, PrescriptionData } from "@/types";
import LensStep1Usage from "@/components/lenses/LensStep1Usage";
import LensStep2Prescription from "@/components/lenses/LensStep2Prescription";
import LensStep3Coating from "@/components/lenses/LensStep3Coating";
import LensStep4Addons from "@/components/lenses/LensStep4Addons";
import LensPriceSummary from "@/components/lenses/LensPriceSummary";
import Button from "@/components/ui/Button";
import useCartStore from "@/store/cartStore";

const STEPS = ["Usage", "Prescription", "Lens", "Coatings", "Add-Ons"];

export default function SelectLensesPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

  // Selections
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedLensTypeId, setSelectedLensTypeId] = useState<number | null>(null);
  const [prescription, setPrescription] = useState<PrescriptionData | null>(null);
  const [selectedCoatingId, setSelectedCoatingId] = useState<number | null>(null);
  const [selectedAddonIds, setSelectedAddonIds] = useState<number[]>([]);

  useEffect(() => {
    productsApi.detail(slug).then(({ data }) => {
      setProduct(data);
      // Auto-select first coating (default)
      if (data.lens_options.coating.length > 0) {
        setSelectedCoatingId(data.lens_options.coating[0].id);
      }
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading || !product) {
    return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading…</div>;
  }

  const variant = product.variants[selectedVariantIdx];
  const framePrice = variant?.price ?? product.sale_price ?? product.base_price;
  const thumbnail = variant?.images?.[0]?.url ?? null;

  const lensTypes = product.lens_options.lens_type;
  const coatings = product.lens_options.coating;
  const addons = product.lens_options.addon;

  const selectedLensType = lensTypes.find((l) => l.id === selectedLensTypeId) ?? null;
  const selectedCoating = coatings.find((c) => c.id === selectedCoatingId) ?? null;
  const selectedAddonObjects = addons.filter((a) => selectedAddonIds.includes(a.id));

  const isNonRx = selectedLensTypeId === -1;
  const canAddToCart = selectedLensTypeId !== null;

  function toggleAddon(id: number) {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function handleAddToCart() {
    if (!product || !variant) return;
    const lensOptionsPrice =
      (selectedLensType?.price ?? 0) +
      (selectedCoating?.price ?? 0) +
      selectedAddonObjects.reduce((s, a) => s + a.price, 0);

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
        ...(selectedCoatingId ? [selectedCoatingId] : []),
        ...selectedAddonIds,
      ],
      lens_options_price: lensOptionsPrice,
      prescription: isNonRx ? null : prescription,
    });

    router.push("/cart");
  }

  const stepContent = [
    <LensStep1Usage key="s1" lensTypes={lensTypes} selectedId={selectedLensTypeId} onSelect={setSelectedLensTypeId} />,
    isNonRx ? (
      <div key="s2" className="text-gray-400 text-sm py-8 text-center">
        No prescription required for Non-Rx lenses. Continue to the next step.
      </div>
    ) : (
      <LensStep2Prescription key="s2" prescription={prescription} onChange={setPrescription} />
    ),
    <LensStep3Coating key="s3" coatings={coatings} selectedId={selectedCoatingId} onSelect={setSelectedCoatingId} />,
    <LensStep4Addons key="s4" addons={addons} selectedIds={selectedAddonIds} onToggle={toggleAddon} />,
    // Step 5: Review
    <div key="s5" className="space-y-4">
      <h3 className="text-white font-semibold">Order Review</h3>
      <div className="bg-[#1a1a1a] rounded p-4 space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-gray-400">Lens Type</span><span className="text-white">{selectedLensType?.name ?? "Non-Rx"}</span></div>
        <div className="flex justify-between"><span className="text-gray-400">Coating</span><span className="text-white">{selectedCoating?.name ?? "None"}</span></div>
        {selectedAddonObjects.length > 0 && (
          <div className="flex justify-between"><span className="text-gray-400">Add-ons</span><span className="text-white">{selectedAddonObjects.map((a) => a.name).join(", ")}</span></div>
        )}
      </div>
      <div className="flex gap-3">
        <Button variant="dark" size="lg" fullWidth onClick={handleAddToCart} disabled={!canAddToCart}>
          Add to Cart
        </Button>
        <a
          href={`https://wa.me/923001234567?text=I'd like to order: ${encodeURIComponent(product.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button variant="whatsapp" size="lg" fullWidth>Order via WhatsApp</Button>
        </a>
      </div>
    </div>,
  ];

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-8">
      <h1 className="font-['Cormorant_Garamond'] text-2xl text-white mb-6">Customise Your Lenses</h1>

      <div className="flex gap-8">
        {/* Summary sidebar */}
        <div className="hidden md:block w-[320px] shrink-0">
          <LensPriceSummary
            productName={product.name}
            variantColor={variant?.color_name ?? ""}
            thumbnailUrl={thumbnail}
            framePrice={framePrice}
            selectedLensType={selectedLensType}
            selectedCoating={selectedCoating}
            selectedAddons={selectedAddonObjects}
            onAddToCart={handleAddToCart}
            canAddToCart={canAddToCart}
          />
        </div>

        {/* Steps */}
        <div className="flex-1">
          {/* Step tabs */}
          <div className="flex border-b border-[#2a2a2a] mb-6 overflow-x-auto">
            {STEPS.map((s, i) => {
              const completed = i < step;
              const current = i === step;
              return (
                <button
                  key={s}
                  onClick={() => i <= step && setStep(i)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
                    current
                      ? "border-[#E8670A] text-[#E8670A]"
                      : completed
                      ? "border-transparent text-green-400"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  {completed && <CheckCircleIcon className="w-4 h-4" />}
                  <span>{i + 1}. {s}</span>
                </button>
              );
            })}
          </div>

          <p className="text-gray-500 text-xs mb-4">Step {step + 1} of {STEPS.length}</p>

          {/* Step content */}
          <div className="mb-6">{stepContent[step]}</div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="md"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 0 && selectedLensTypeId === null}
              >
                Continue
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
