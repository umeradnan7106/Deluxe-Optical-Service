"use client";

import { useState } from "react";
import Link from "next/link";
import { cartApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { PAYMENT_METHODS } from "@/lib/constants";
import useCartStore from "@/store/cartStore";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function CartSummary() {
  const { getSubtotal, getShippingFee, getPaymentDiscount, getTotal, couponCode, couponDiscount,
    paymentMethod, setPaymentMethod, applyCoupon } = useCartStore();
  const [couponInput, setCouponInput] = useState(couponCode ?? "");
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const payDiscount = getPaymentDiscount();
  const total = getTotal();

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    setCouponError("");
    try {
      const { data } = await cartApi.validateCoupon(couponInput.trim(), subtotal);
      applyCoupon(data.code, data.discount_value);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setCouponError(msg || "Invalid coupon code");
    } finally {
      setApplyingCoupon(false);
    }
  }

  return (
    <div className="bg-[#1a1a1a] rounded p-5 space-y-5">
      {/* Coupon */}
      <div>
        <p className="text-white text-sm font-medium mb-2">Coupon Code</p>
        <div className="flex gap-2">
          <input
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 bg-[#2a2a2a] border border-[#3a3a3a] text-white text-sm px-3 py-2 rounded-[5px] outline-none focus:border-[#E8670A]"
          />
          <Button variant="outline" size="md" onClick={handleApplyCoupon} disabled={applyingCoupon}>
            {applyingCoupon ? "…" : "Apply"}
          </Button>
        </div>
        {couponError && <p className="text-red-400 text-xs mt-1">{couponError}</p>}
        {couponDiscount > 0 && (
          <p className="text-green-400 text-xs mt-1">Coupon applied! You save {formatPrice(couponDiscount)}</p>
        )}
      </div>

      {/* Payment method */}
      <div>
        <p className="text-white text-sm font-medium mb-2">Payment Method</p>
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map(({ value, label, discount }) => (
            <button
              key={value}
              onClick={() => setPaymentMethod(value)}
              className={`rounded border p-3 text-left text-sm transition-colors ${
                paymentMethod === value
                  ? "border-[#E8670A] bg-[#FFF0E6]/5"
                  : "border-[#2a2a2a] hover:border-[#E8670A]/50"
              }`}
            >
              <p className="text-white font-medium">{label}</p>
              {discount > 0 && <Badge variant="orange" className="mt-1">{discount}% off</Badge>}
            </button>
          ))}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="space-y-2 text-sm border-t border-[#2a2a2a] pt-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Subtotal</span>
          <span className="text-white">{formatPrice(subtotal)}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-400">Coupon Discount</span>
            <span className="text-green-400">-{formatPrice(couponDiscount)}</span>
          </div>
        )}
        {payDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-400">Payment Discount (15%)</span>
            <span className="text-green-400">-{formatPrice(payDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-400">Shipping</span>
          <span className={shipping === 0 ? "text-green-400" : "text-white"}>
            {shipping === 0 ? "FREE" : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between font-semibold border-t border-[#2a2a2a] pt-2 mt-2">
          <span className="text-white">Total</span>
          <span className="text-[#E8670A] text-lg">{formatPrice(total)}</span>
        </div>
      </div>

      <Link href="/checkout" className="block">
        <Button variant="primary" size="lg" fullWidth>Proceed to Checkout</Button>
      </Link>
    </div>
  );
}
