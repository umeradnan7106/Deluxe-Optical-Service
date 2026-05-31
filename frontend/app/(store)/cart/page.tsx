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
    <>
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 md:py-8 pb-24 md:pb-8">
      <h1 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl text-[#1a1a1a] font-semibold mb-5 md:mb-6">
        Shopping Cart ({items.length} item{items.length !== 1 ? "s" : ""})
      </h1>

      {/* Free shipping progress */}
      <div className={`border rounded-lg p-4 mb-6 ${remaining <= 0 ? "bg-green-50 border-green-200" : "bg-white border-[#e5e7eb]"}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={`w-5 h-5 ${remaining <= 0 ? "text-green-600" : "text-[#6b7280]"}`}>
              <path d="M1.5 8.5h13v9H3a1.5 1.5 0 01-1.5-1.5v-7.5zM14.5 17.5h6l-2-5-4-1.5v6.5zM6 17.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM17 17.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[13px] font-semibold text-[#1a1a1a]">
              {remaining <= 0 ? "FREE Delivery Unlocked!" : "Free Delivery Progress"}
            </span>
          </div>
          <span className="text-[12px] text-[#6b7280]">{formatPrice(Math.min(subtotal, FREE_SHIPPING_THRESHOLD))} / {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
        </div>
        {remaining > 0 ? (
          <p className="text-[#1a1a1a] text-[13px] mb-2">
            Spend <span className="text-[#E8670A] font-semibold">{formatPrice(remaining)}</span> more to get <span className="font-semibold">FREE delivery</span> on your order.
          </p>
        ) : (
          <p className="text-green-700 text-[13px] mb-2 font-medium">Your order qualifies for FREE delivery — no shipping charges!</p>
        )}
        <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${remaining <= 0 ? "bg-green-500" : "bg-[#E8670A]"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] text-[#6b7280]">Rs. 0</span>
          <span className="text-[11px] text-[#6b7280]">{formatPrice(FREE_SHIPPING_THRESHOLD)} — Free shipping</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
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

    {/* Mobile sticky checkout button */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e5e7eb] px-4 py-3 shadow-lg">
      <Link href="/checkout" className="block">
        <button className="w-full bg-[#E8670A] hover:bg-[#C45408] text-white rounded-[5px] py-3.5 text-sm font-medium transition-colors min-h-[44px]">
          Proceed to Checkout — {formatPrice(subtotal)}
        </button>
      </Link>
    </div>
    </>
  );
}
