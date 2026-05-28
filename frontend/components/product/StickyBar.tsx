"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import Placeholder from "@/components/ui/Placeholder";

interface StickyBarProps {
  productSlug: string;
  productName: string;
  variantName: string;
  price: number;
  salePrice?: number | null;
  thumbnailUrl?: string | null;
  onAddToCart: () => void;
}

export default function StickyBar({
  productSlug,
  productName,
  variantName,
  price,
  salePrice,
  thumbnailUrl,
  onAddToCart,
}: StickyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  const displayPrice = salePrice ?? price;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-[#E8670A] shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-3 flex items-center gap-4">
        {/* Thumbnail */}
        <div className="relative w-10 h-10 shrink-0 rounded overflow-hidden bg-white border border-[#e5e7eb]">
          {thumbnailUrl ? (
            <Image src={thumbnailUrl} alt={productName} fill className="object-contain" sizes="40px" />
          ) : (
            <Placeholder className="w-full h-full" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[#1a1a1a] text-[13px] font-medium truncate">{productName}</p>
          {variantName && <p className="text-[#6b7280] text-[11px]">{variantName}</p>}
          <p className="text-[#E8670A] text-[16px] font-semibold">{formatPrice(displayPrice)}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 shrink-0">
          <Link href={`/products/${productSlug}/select-lenses`}>
            <Button variant="primary" size="sm">Select Lenses</Button>
          </Link>
          <Button variant="dark" size="sm" onClick={onAddToCart}>
            <ShoppingCartIcon className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
