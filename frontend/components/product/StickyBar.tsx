"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F0F0F] border-t border-[#2a2a2a] shadow-2xl">
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-3 flex items-center gap-4">
        {/* Thumbnail */}
        <div className="relative w-12 h-12 shrink-0 rounded overflow-hidden bg-[#1a1a1a]">
          {thumbnailUrl ? (
            <Image src={thumbnailUrl} alt={productName} fill className="object-cover" sizes="48px" />
          ) : (
            <Placeholder className="w-full h-full" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{productName}</p>
          <p className="text-gray-400 text-xs">{variantName}</p>
        </div>

        {/* Price */}
        <div className="shrink-0 text-right">
          <p className="text-[#E8670A] font-semibold">{formatPrice(displayPrice)}</p>
          {salePrice && (
            <p className="text-gray-500 text-xs line-through">{formatPrice(price)}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 shrink-0">
          <Link href={`/products/${productSlug}/select-lenses`}>
            <Button variant="primary" size="sm">Select Lenses</Button>
          </Link>
          <Button variant="dark" size="sm" onClick={onAddToCart}>Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}
