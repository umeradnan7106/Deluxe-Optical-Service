"use client";

import Link from "next/link";
import useCartStore from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/constants";
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
          <p className="text-6xl mb-6">🛒</p>
          <h2 className="text-white text-xl font-semibold mb-3">Your cart is empty</h2>
          <p className="text-gray-400 text-sm mb-6">
            Add some frames to get started.
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg">Browse Frames</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-8">
      <h1 className="text-white text-2xl font-semibold mb-6">Shopping Cart ({items.length} item{items.length !== 1 ? "s" : ""})</h1>

      {/* Free shipping progress bar */}
      <div className="bg-[#1a1a1a] rounded p-4 mb-6">
        {remaining > 0 ? (
          <p className="text-gray-300 text-sm mb-2">
            Add <span className="text-[#E8670A] font-medium">{formatPrice(remaining)}</span> more for free delivery!
          </p>
        ) : (
          <p className="text-green-400 text-sm mb-2 font-medium">You qualify for FREE delivery!</p>
        )}
        <div className="w-full bg-[#2a2a2a] rounded-full h-2">
          <div
            className="bg-[#E8670A] h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Rs. 0</span>
          <span>Rs. {FREE_SHIPPING_THRESHOLD.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="flex-1">
          {items.map((item) => (
            <CartItem key={`${item.product_id}-${item.variant_id}`} item={item} />
          ))}
        </div>

        {/* Summary sidebar */}
        <div className="lg:w-80 shrink-0">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
