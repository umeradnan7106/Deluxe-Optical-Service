"use client";

import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { CartItem as CartItemType } from "@/types";
import { formatPrice } from "@/lib/utils";
import useCartStore from "@/store/cartStore";
import Placeholder from "@/components/ui/Placeholder";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();
  const displayPrice = item.sale_price ?? item.base_price;
  const itemTotal = (displayPrice + item.lens_options_price) * item.quantity;

  return (
    <div className="flex gap-4 py-4 border-b border-[#2a2a2a]">
      {/* Image */}
      <div className="relative w-[60px] h-[60px] shrink-0 rounded overflow-hidden bg-[#2a2a2a]">
        {item.thumbnail_url ? (
          <Image src={item.thumbnail_url} alt={item.product_name} fill className="object-cover" sizes="60px" />
        ) : (
          <Placeholder className="w-full h-full" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <div>
            <p className="text-white text-sm font-medium leading-snug">{item.product_name}</p>
            <p className="text-gray-400 text-xs mt-0.5">{item.color_name}</p>
          </div>
          <span className="text-[#E8670A] font-semibold text-sm shrink-0">{formatPrice(itemTotal)}</span>
        </div>

        {/* Lens info */}
        {item.selected_lens_options.length > 0 && (
          <div className="mt-1.5 bg-[#2a2a2a] rounded px-2 py-1.5 text-xs text-gray-300">
            <span className="text-gray-500">Lenses: </span>
            {item.selected_lens_options.length} option(s) added (+{formatPrice(item.lens_options_price)})
          </div>
        )}

        {/* Prescription summary */}
        {item.prescription && item.prescription.method !== "later" && (
          <p className="text-gray-500 text-xs mt-1">
            Prescription: {item.prescription.method === "upload" ? "Uploaded" : "Manual entry"}
          </p>
        )}

        {/* Quantity + remove */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border border-[#3a3a3a] rounded">
            <button
              onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
              className="px-2 py-0.5 text-white hover:bg-[#2a2a2a] text-sm"
            >
              −
            </button>
            <span className="px-3 text-white text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)}
              className="px-2 py-0.5 text-white hover:bg-[#2a2a2a] text-sm"
            >
              +
            </button>
          </div>
          <button
            onClick={() => removeItem(item.product_id, item.variant_id)}
            className="text-gray-500 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
          >
            <TrashIcon className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
