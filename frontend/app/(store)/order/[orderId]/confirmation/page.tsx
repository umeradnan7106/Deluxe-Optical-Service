"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Button from "@/components/ui/Button";

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="max-w-[620px] mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="font-playfair text-[30px] text-[#1B2B5E] font-bold mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-[#6b7280] text-sm">Thank you for your purchase. We&apos;ll process your order shortly.</p>
      </div>

      {/* Order ID box */}
      <div className="bg-[#1B2B5E] rounded-lg p-5 text-center mb-6">
        <p className="text-white/60 text-sm mb-1">Your Order ID</p>
        <p className="font-mono text-[18px] md:text-2xl font-bold">
          <span className="text-[#C9A84C]">#</span>
          <span className="text-white">{orderId}</span>
        </p>
      </div>

      {/* Order Details card */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-5 mb-4">
        <h2 className="font-playfair text-[18px] text-[#1B2B5E] font-bold mb-4">Order Details</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#6b7280]">Status</span>
            <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full">Pending</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6b7280]">Estimated Delivery</span>
            <span className="text-[#1a1a1a]">3–5 Business Days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6b7280]">Payment</span>
            <span className="text-[#1a1a1a]">Cash on Delivery</span>
          </div>
        </div>
      </div>

      {/* Confirmation note */}
      <p className="text-center text-[#6b7280] text-xs mb-8">
        A confirmation will be sent to your registered contact. Save your Order ID for tracking.
      </p>

      {/* Actions — stacked on mobile, side by side on tablet+ */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href={`/tracking?order_number=${orderId}`} className="w-full sm:w-auto">
          <Button variant="primary" size="lg" className="w-full sm:w-auto">Track My Order</Button>
        </Link>
        <Link href="/products" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto px-6 py-3 border border-[#e5e7eb] text-[#1a1a1a] rounded-[5px] text-sm font-medium hover:bg-gray-50 transition-colors min-h-[44px]">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
}
