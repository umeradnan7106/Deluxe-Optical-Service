"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ordersApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface TimelineStep {
  status: string;
  label: string;
  completed: boolean;
  current: boolean;
}

interface TrackResult {
  order_number: string;
  status: string;
  customer_name: string;
  city: string;
  province: string;
  total: number;
  tracking_number: string | null;
  items_summary: { product_name: string; quantity: number; color: string }[];
  timeline: TimelineStep[];
  created_at: string;
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("order_number") || "");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleTrack() {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const { data } = await ordersApi.track(query.trim(), "");
      setResult(data as unknown as TrackResult);
    } catch {
      setError("Order not found. Please check your order number or phone.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (searchParams.get("order_number")) handleTrack();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const STATUS_LABELS: Record<string, string> = {
    pending: "Pending", confirmed: "Confirmed", processing: "Processing",
    shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled", refunded: "Refunded",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold mb-2">Track Your Order</h1>
      <p className="text-gray-400 text-sm mb-6">Enter your order number or phone to see real-time status.</p>

      <div className="flex gap-2 mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleTrack()}
          placeholder="DOS-2026-0001 or 03001234567"
          className="flex-1 bg-[#1a1a1a] border border-[#3a3a3a] text-white px-4 py-3 rounded-[5px] outline-none focus:border-[#E8670A]"
        />
        <Button variant="primary" size="lg" onClick={handleTrack} disabled={loading}>
          {loading ? "Tracking…" : "Track"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded p-4 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Order summary */}
          <div className="bg-[#1a1a1a] rounded p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-xs">Order Number</p>
                <p className="text-white font-mono font-bold text-lg">{result.order_number}</p>
              </div>
              <Badge variant={
                result.status === "delivered" ? "green"
                : result.status === "cancelled" ? "red"
                : "orange"
              }>
                {STATUS_LABELS[result.status] ?? result.status}
              </Badge>
            </div>
            <p className="text-gray-400 text-xs">Ordered: {formatDate(result.created_at)}</p>
            <p className="text-gray-400 text-xs">Delivering to: {result.city}, {result.province}</p>
            {result.tracking_number && (
              <p className="text-gray-400 text-xs mt-1">Tracking No: <span className="text-white">{result.tracking_number}</span></p>
            )}
          </div>

          {/* Items */}
          <div className="bg-[#1a1a1a] rounded p-5">
            <h3 className="text-white font-semibold mb-3 text-sm">Items</h3>
            {result.items_summary.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span className="text-gray-300">{item.product_name} ({item.color}) ×{item.quantity}</span>
              </div>
            ))}
          </div>

          {/* 4-step timeline */}
          <div className="bg-[#1a1a1a] rounded p-5">
            <h3 className="text-white font-semibold mb-4 text-sm">Order Timeline</h3>
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-[#2a2a2a]" />

              <div className="space-y-6">
                {result.timeline.map((step) => (
                  <div key={step.status} className="flex items-center gap-4 relative">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      step.completed
                        ? step.current ? "bg-[#E8670A]" : "bg-green-500"
                        : "bg-[#2a2a2a] border border-[#3a3a3a]"
                    }`}>
                      {step.completed && !step.current && (
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      )}
                      {step.current && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${step.current ? "text-[#E8670A]" : step.completed ? "text-white" : "text-gray-500"}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && !error && !loading && (
        <div className="text-center py-12 text-gray-500">
          <p>Enter your order number or phone number above to track your order.</p>
        </div>
      )}
    </div>
  );
}
