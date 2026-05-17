"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ordersApi } from "@/lib/api";
import type { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const STATUS_VARIANTS: Record<string, "orange" | "green" | "gray" | "red"> = {
  pending: "orange",
  confirmed: "orange",
  processing: "orange",
  shipped: "orange",
  delivered: "green",
  cancelled: "red",
  refunded: "gray",
};

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.track(orderId, "").catch(() => {}).finally(() => setLoading(false));
    // For confirmation page, we use the track endpoint with order number
    ordersApi.track(orderId, "").then(({ data }) => {
      // Map track response to Order type (best effort)
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading…</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h1 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-400">Thank you for your purchase. We&apos;ll process your order shortly.</p>
      </div>

      {/* Order ID box */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded p-4 text-center mb-6">
        <p className="text-gray-400 text-sm mb-1">Your Order ID</p>
        <p className="font-mono text-2xl font-bold text-[#E8670A]">{orderId}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Link href={`/tracking?order_number=${orderId}`}>
          <Button variant="primary" size="lg">Track My Order</Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" size="lg">Continue Shopping</Button>
        </Link>
      </div>

      <p className="text-center text-gray-500 text-sm mt-8">
        A confirmation email will be sent to your registered email address.
      </p>
    </div>
  );
}
