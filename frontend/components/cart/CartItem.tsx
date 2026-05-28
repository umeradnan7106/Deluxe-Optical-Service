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

  const rx = item.prescription;
  const hasManualRx = rx?.method === "manual";
  const hasPhotoRx = rx?.method === "upload";

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 mb-3">
      <div className="flex gap-4">
        {/* Image — 90×80, object-contain, white bg */}
        <div className="relative shrink-0 rounded overflow-hidden bg-white border border-[#e5e7eb]" style={{ width: 90, height: 80 }}>
          {item.thumbnail_url ? (
            <Image src={item.thumbnail_url} alt={item.product_name} fill className="object-contain" sizes="90px" />
          ) : (
            <Placeholder className="w-full h-full" />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="text-[#1a1a1a] text-[15px] font-medium leading-snug mb-0.5">{item.product_name}</p>
          <p className="text-[#6b7280] text-[12px]">{item.color_name}</p>

          {/* Lens details */}
          {item.selected_lens_options.length > 0 && (
            <div className="mt-1.5 bg-[#f9fafb] border border-[#e5e7eb] rounded px-2 py-1.5 text-[11px] text-[#6b7280]">
              <span className="font-medium text-[#1a1a1a]">Lens: </span>
              {item.selected_lens_options.length} option{item.selected_lens_options.length !== 1 ? "s" : ""} (+{formatPrice(item.lens_options_price)})
            </div>
          )}

          {/* Prescription info */}
          {hasManualRx && rx && (
            <div className="mt-1.5 text-[11px] text-[#6b7280] space-y-0.5">
              {rx.right_sph !== undefined && (
                <p><span className="font-medium text-[#1a1a1a]">OD:</span> SPH {(rx.right_sph ?? 0) >= 0 ? "+" : ""}{rx.right_sph}{rx.right_cyl !== undefined ? ` CYL ${rx.right_cyl}` : ""}{rx.right_axis !== undefined ? ` Axis ${rx.right_axis}°` : ""}</p>
              )}
              {rx.left_sph !== undefined && (
                <p><span className="font-medium text-[#1a1a1a]">OS:</span> SPH {(rx.left_sph ?? 0) >= 0 ? "+" : ""}{rx.left_sph}{rx.left_cyl !== undefined ? ` CYL ${rx.left_cyl}` : ""}{rx.left_axis !== undefined ? ` Axis ${rx.left_axis}°` : ""}</p>
              )}
              {rx.pd !== undefined && <p><span className="font-medium text-[#1a1a1a]">PD:</span> {rx.pd}mm</p>}
            </div>
          )}
          {hasPhotoRx && rx?.prescription_url && (
            <div className="mt-1.5 flex items-center gap-2">
              <Image src={rx.prescription_url} alt="Prescription" width={40} height={40} className="rounded border border-[#e5e7eb] object-cover" />
              <span className="text-[11px] text-[#6b7280]">Prescription photo</span>
            </div>
          )}

          {/* Qty + price on same row */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center border border-[#e5e7eb] rounded">
              <button
                onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
                className="px-2.5 py-1 text-[#1a1a1a] hover:bg-gray-100 text-sm"
              >
                −
              </button>
              <span className="px-3 text-[#1a1a1a] text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)}
                className="px-2.5 py-1 text-[#1a1a1a] hover:bg-gray-100 text-sm"
              >
                +
              </button>
            </div>
            <span className="text-[#E8670A] font-semibold text-sm">{formatPrice(itemTotal)}</span>
          </div>

          {/* Remove link */}
          <button
            onClick={() => removeItem(item.product_id, item.variant_id)}
            className="text-[#6b7280] hover:text-red-500 text-xs flex items-center gap-1 transition-colors mt-1.5"
          >
            <TrashIcon className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
