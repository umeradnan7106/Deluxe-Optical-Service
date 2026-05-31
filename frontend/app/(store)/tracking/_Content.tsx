"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ordersApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Button from "@/components/ui/Button";

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

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending", confirmed: "Confirmed", processing: "Processing",
  shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled", refunded: "Refunded",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

export default function TrackOrderContent() {
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

  return (
    <div className="max-w-[700px] mx-auto px-4 py-10">
      <h1 className="font-['Cormorant_Garamond'] text-2xl md:text-4xl text-[#1a1a1a] font-semibold mb-2">Track Your Order</h1>
      <p className="text-[#6b7280] text-sm mb-8">Enter your order number or phone to see real-time status.</p>

      {/* Search card */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-5 mb-8">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            placeholder="DOS-2026-0001 or 03001234567"
            className="flex-1 bg-white border border-[#e5e7eb] text-[#1a1a1a] px-4 py-2.5 rounded-[5px] outline-none focus:border-[#E8670A] text-sm"
          />
          <Button variant="primary" size="md" onClick={handleTrack} disabled={loading}>
            {loading ? "Tracking…" : "Track Order"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm mb-6">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Order summary card */}
          <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[#6b7280] text-xs mb-0.5">Order Number</p>
                <p className="font-mono font-bold text-[#1a1a1a] text-lg">{result.order_number}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[result.status] ?? "bg-gray-100 text-gray-700"}`}>
                {STATUS_LABELS[result.status] ?? result.status}
              </span>
            </div>
            <div className="space-y-1 text-xs text-[#6b7280]">
              <p>Ordered: {formatDate(result.created_at)}</p>
              <p>Delivering to: {result.city}, {result.province}</p>
              {result.items_summary.length > 0 && (
                <p>{result.items_summary.length} item{result.items_summary.length !== 1 ? "s" : ""}</p>
              )}
              {result.tracking_number && (
                <p>Tracking No: <span className="text-[#1a1a1a] font-medium">{result.tracking_number}</span></p>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
            <h3 className="text-[#1a1a1a] font-semibold text-sm mb-3">Items</h3>
            {result.items_summary.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1.5 border-b border-[#f3f4f6] last:border-0">
                <span className="text-[#1a1a1a]">{item.product_name} ({item.color})</span>
                <span className="text-[#6b7280]">×{item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
            <h3 className="text-[#1a1a1a] font-semibold text-sm mb-6">Order Timeline</h3>
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-[#e5e7eb]" />

              <div className="space-y-6">
                {result.timeline.map((step) => (
                  <div key={step.status} className="flex items-start gap-4 relative">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      step.current
                        ? "bg-[#E8670A] animate-pulse"
                        : step.completed
                        ? "bg-green-500"
                        : "bg-white border-2 border-[#e5e7eb]"
                    }`}>
                      {step.completed && !step.current && (
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      )}
                      {step.current && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className={`text-sm font-medium ${
                        step.current ? "text-[#E8670A]"
                        : step.completed ? "text-[#1a1a1a]"
                        : "text-[#6b7280]"
                      }`}>
                        {step.label}
                      </p>
                      <p className="text-[#6b7280] text-xs mt-0.5">
                        {step.completed && !step.current ? "Completed" : step.current ? "In progress" : "Estimated"}
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
        <div className="text-center py-12 text-[#6b7280]">
          <p>Enter your order number or phone number above to track your order.</p>
        </div>
      )}
    </div>
  );
}
