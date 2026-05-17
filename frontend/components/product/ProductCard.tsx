"use client";

import Image from "next/image";
import Link from "next/link";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import type { ProductListItem } from "@/types";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Placeholder from "@/components/ui/Placeholder";
import useCartStore from "@/store/cartStore";

interface ProductCardProps {
  product: ProductListItem;
  wishlisted?: boolean;
  onWishlistToggle?: (productId: number) => void;
}

export default function ProductCard({ product, wishlisted = false, onWishlistToggle }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const discountPct =
    product.sale_price ? getDiscountPercent(product.base_price, product.sale_price) : 0;

  const displayPrice = product.sale_price ?? product.base_price;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      thumbnail_url: product.thumbnail_url,
      variant_id: 0,
      color_name: "",
      base_price: product.base_price,
      sale_price: product.sale_price ?? null,
      quantity: 1,
      selected_lens_options: [],
      lens_options_price: 0,
      prescription: null,
    });
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block bg-white border border-gray-200 rounded overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {!imgError && product.thumbnail_url ? (
          <Image
            src={product.thumbnail_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <Placeholder className="w-full h-full" label="No image" />
        )}

        {/* Discount badge */}
        {discountPct > 0 && (
          <span className="absolute top-2 left-2 bg-[#E8670A] text-white text-xs font-bold px-2 py-0.5 rounded">
            -{discountPct}%
          </span>
        )}

        {/* Wishlist */}
        <button
          className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5 hover:bg-white transition-colors shadow-sm"
          onClick={(e) => { e.preventDefault(); onWishlistToggle?.(product.id); }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlisted ? (
            <HeartSolidIcon className="w-4 h-4 text-[#E8670A]" />
          ) : (
            <HeartIcon className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {/* Category badge */}
        <Badge variant="dark" className="absolute bottom-2 left-2 capitalize">
          {product.category.replace("-", " ")}
        </Badge>
      </div>

      {/* Body */}
      <div className="p-3">
        <p className="text-gray-400 text-[10px] mb-0.5">{product.sku}</p>
        <h3 className="text-gray-900 text-sm font-medium leading-snug line-clamp-2 mb-1">
          {product.name}
        </h3>

        {product.average_rating !== null && (
          <div className="flex items-center gap-1 mb-1.5">
            <StarRating rating={product.average_rating} size="sm" />
            <span className="text-gray-400 text-[11px]">({product.review_count})</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="text-[#E8670A] font-semibold text-sm">{formatPrice(displayPrice)}</span>
            {product.sale_price && (
              <span className="text-gray-500 text-xs line-through">{formatPrice(product.base_price)}</span>
            )}
          </div>
        </div>

        <Button
          variant="dark"
          size="sm"
          fullWidth
          className="mt-2"
          onClick={handleQuickAdd}
        >
          Add to Cart
        </Button>
      </div>
    </Link>
  );
}
