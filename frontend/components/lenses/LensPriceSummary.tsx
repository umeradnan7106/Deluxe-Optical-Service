"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { LensOption } from "@/types";
import Placeholder from "@/components/ui/Placeholder";

interface LensPriceSummaryProps {
  productSlug: string;
  productName: string;
  variantColor: string;
  thumbnailUrl?: string | null;
  framePrice: number;
  selectedLensType: LensOption | null;
  selectedAddons: LensOption[];
  onAddToCart: () => void;
  canAddToCart: boolean;
}

export default function LensPriceSummary({
  productSlug,
  productName,
  variantColor,
  thumbnailUrl,
  framePrice,
  selectedLensType,
  selectedAddons,
  onAddToCart,
  canAddToCart,
}: LensPriceSummaryProps) {
  const lensPrice = selectedLensType?.price ?? 0;
  const addonsPrice = selectedAddons.reduce((s, a) => s + a.price, 0);
  const total = framePrice + lensPrice + addonsPrice;

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg p-5 space-y-4 sticky top-24">
      {/* Back link */}
      <Link href={`/products/${productSlug}`} className="text-[#E8670A] text-sm underline hover:no-underline">
        ← Back to Frame
      </Link>

      {/* Product */}
      <div className="flex gap-3">
        <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden bg-[#f9fafb]">
          {thumbnailUrl ? (
            <Image src={thumbnailUrl} alt={productName} fill className="object-cover" sizes="64px" />
          ) : (
            <Placeholder className="w-full h-full" />
          )}
        </div>
        <div>
          <p className="font-['Cormorant_Garamond'] text-[18px] text-[#1a1a1a] font-medium leading-snug text-center">
            {productName}
          </p>
          <p className="text-[#6b7280] text-[12px] mt-0.5 text-center">{variantColor}</p>
        </div>
      </div>

      {/* Price Summary box */}
      <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[#6b7280]">Frame</span>
          <span className="text-[#1a1a1a]">{formatPrice(framePrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#6b7280]">Lens type</span>
          <span className="text-[#1a1a1a]">{selectedLensType ? formatPrice(lensPrice) : "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#6b7280]">Add-ons</span>
          <span className="text-[#1a1a1a]">{addonsPrice > 0 ? formatPrice(addonsPrice) : "—"}</span>
        </div>
        <div className="flex justify-between font-semibold border-t border-[#e5e7eb] pt-2 mt-2">
          <span className="text-[#1a1a1a]">Total</span>
          <span className="text-[#E8670A] text-lg">{formatPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={onAddToCart}
        disabled={!canAddToCart}
        className="w-full bg-[#0F0F0F] text-white py-3 rounded-[5px] text-sm font-medium hover:bg-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Add to Cart
      </button>

      {!canAddToCart && (
        <p className="text-[#6b7280] text-xs text-center">Complete Step 1 to add to cart</p>
      )}
    </div>
  );
}
