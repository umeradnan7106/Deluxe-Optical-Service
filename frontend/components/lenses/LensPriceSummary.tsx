import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import type { LensOption } from "@/types";
import Placeholder from "@/components/ui/Placeholder";

interface LensPriceSummaryProps {
  productName: string;
  variantColor: string;
  thumbnailUrl?: string | null;
  framePrice: number;
  selectedLensType: LensOption | null;
  selectedCoating: LensOption | null;
  selectedAddons: LensOption[];
  onAddToCart: () => void;
  canAddToCart: boolean;
}

export default function LensPriceSummary({
  productName,
  variantColor,
  thumbnailUrl,
  framePrice,
  selectedLensType,
  selectedCoating,
  selectedAddons,
  onAddToCart,
  canAddToCart,
}: LensPriceSummaryProps) {
  const lensPrice = selectedLensType?.price ?? 0;
  const coatingPrice = selectedCoating?.price ?? 0;
  const addonsPrice = selectedAddons.reduce((s, a) => s + a.price, 0);
  const total = framePrice + lensPrice + coatingPrice + addonsPrice;

  return (
    <div className="bg-[#1a1a1a] rounded p-5 space-y-4 sticky top-24">
      {/* Product */}
      <div className="flex gap-3">
        <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden bg-[#2a2a2a]">
          {thumbnailUrl ? (
            <Image src={thumbnailUrl} alt={productName} fill className="object-cover" sizes="64px" />
          ) : (
            <Placeholder className="w-full h-full" />
          )}
        </div>
        <div>
          <p className="text-white font-medium text-sm leading-snug">{productName}</p>
          <p className="text-gray-400 text-xs mt-0.5">{variantColor}</p>
        </div>
      </div>

      <div className="border-t border-[#2a2a2a] pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Frame</span>
          <span className="text-white">{formatPrice(framePrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Lens ({selectedLensType?.name ?? "Not selected"})</span>
          <span className="text-white">{lensPrice > 0 ? formatPrice(lensPrice) : "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Coating ({selectedCoating?.name ?? "None"})</span>
          <span className="text-white">{coatingPrice > 0 ? formatPrice(coatingPrice) : "Free"}</span>
        </div>
        {selectedAddons.length > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-400">Add-ons</span>
            <span className="text-white">{addonsPrice > 0 ? formatPrice(addonsPrice) : "Free"}</span>
          </div>
        )}
      </div>

      <div className="border-t border-[#2a2a2a] pt-3 flex justify-between font-semibold">
        <span className="text-white">Total</span>
        <span className="text-[#E8670A] text-lg">{formatPrice(total)}</span>
      </div>

      <Button
        variant="dark"
        size="lg"
        fullWidth
        onClick={onAddToCart}
        disabled={!canAddToCart}
      >
        Add to Cart
      </Button>

      {!canAddToCart && (
        <p className="text-gray-500 text-xs text-center">Complete Step 1 to add to cart</p>
      )}
    </div>
  );
}
