"use client";

import { useState } from "react";
import Link from "next/link";
import { cartApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { PAYMENT_METHODS } from "@/lib/constants";
import useCartStore from "@/store/cartStore";
import type { ValidateCouponResponse } from "@/types";

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
      const couponData = data as unknown as ValidateCouponResponse;
      let discountAmount: number;
      if (typeof couponData.discount_amount === "number") {
        discountAmount = couponData.discount_amount;
      } else if (couponData.discount_type === "percentage") {
        discountAmount = Math.round(subtotal * couponData.discount_value / 100);
      } else {
        discountAmount = couponData.discount_value;
      }
      applyCoupon(couponData.code, discountAmount);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setCouponError(msg || "Invalid coupon code");
    } finally {
      setApplyingCoupon(false);
    }
  }

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg p-5 space-y-5">
      <h3 className="font-playfair text-[20px] text-[#1B2B5E] font-bold">Order Summary</h3>

      {/* Coupon */}
      <div>
        <div className="flex gap-2">
          <input
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 bg-white border border-[#e2e8f0] text-[#1a1a1a] text-sm px-3 py-2 rounded-[5px] outline-none focus:border-[#1B2B5E]"
          />
          <button
            onClick={handleApplyCoupon}
            disabled={applyingCoupon}
            className="bg-[#1B2B5E] text-white text-sm px-4 py-2 rounded-[5px] hover:bg-[#243570] disabled:opacity-50 transition-colors"
          >
            {applyingCoupon ? "…" : "Apply"}
          </button>
        </div>
        {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
        {couponDiscount > 0 && (
          <p className="text-green-600 text-xs mt-1">Coupon applied! You save {formatPrice(couponDiscount)}</p>
        )}
      </div>

      {/* Price breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[#6b7280]">Subtotal</span>
          <span className="text-[#1a1a1a]">{formatPrice(subtotal)}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-[#6b7280]">Coupon Discount</span>
            <span className="text-green-600">-{formatPrice(couponDiscount)}</span>
          </div>
        )}
        {payDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-[#6b7280]">Payment Discount (15%)</span>
            <span className="text-green-600">-{formatPrice(payDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-[#6b7280]">Shipping</span>
          <span className={shipping === 0 ? "text-green-600" : "text-[#1a1a1a]"}>
            {shipping === 0 ? "FREE" : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between font-semibold border-t border-[#e5e7eb] pt-2 mt-2">
          <span className="text-[#1a1a1a]">Total</span>
          <span className="text-[#1B2B5E] text-lg">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Select Payment Method */}
      <div>
        <p className="text-[#1a1a1a] text-[13px] font-semibold mb-2">Select Payment Method</p>
        <div className="space-y-2">
          {PAYMENT_METHODS.map(({ value, label, discount }) => (
            <button
              key={value}
              onClick={() => setPaymentMethod(value)}
              className={`w-full flex items-center justify-between rounded border p-3 text-left text-sm transition-colors ${
                paymentMethod === value
                  ? "border-[#1B2B5E] bg-[#EEF1FA]"
                  : "border-[#e2e8f0] hover:border-[#1B2B5E]/50"
              }`}
            >
              <span className="text-[#1a1a1a] font-medium">{label}</span>
              {discount > 0 && (
                <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                  {discount}% off
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <Link href="/checkout" className="block">
        <button className="w-full bg-[#1B2B5E] text-white text-[15px] font-medium py-3 rounded-lg hover:bg-[#243570] transition-colors">
          Proceed to Checkout
        </button>
      </Link>
    </div>
  );
}
