"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import useCartStore from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { items, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (items.length === 0) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="font-['Cormorant_Garamond'] text-3xl text-[#1a1a1a] font-semibold mb-3">Your cart is empty</h2>
          <p className="text-[#6b7280] text-sm mb-6">Add some frames to get started.</p>
          <Link href="/products">
            <Button variant="primary" size="lg">Browse Frames</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-8">
      <h1 className="font-['Cormorant_Garamond'] text-3xl text-[#1a1a1a] font-semibold mb-6">
        Shopping Cart ({items.length} item{items.length !== 1 ? "s" : ""})
      </h1>

      {/* Free shipping progress */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 mb-6">
        {remaining > 0 ? (
          <p className="text-[#1a1a1a] text-sm mb-2">
            Add <span className="text-[#E8670A] font-semibold">{formatPrice(remaining)}</span> more for FREE delivery!
          </p>
        ) : (
          <p className="text-green-700 text-sm mb-2 font-semibold">You qualify for FREE delivery! 🎉</p>
        )}
        <div className="relative w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
          <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 text-[#6b7280]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
              <path d="M1.5 8.5h13v9H3a1.5 1.5 0 01-1.5-1.5v-7.5zM14.5 17.5h6l-2-5-4-1.5v6.5zM6 17.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM17 17.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items — 70% */}
        <div className="lg:w-[70%]">
          {items.map((item) => (
            <CartItem key={`${item.product_id}-${item.variant_id}`} item={item} />
          ))}
        </div>

        {/* Summary sidebar — 30% */}
        <div className="lg:w-[30%] shrink-0">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
