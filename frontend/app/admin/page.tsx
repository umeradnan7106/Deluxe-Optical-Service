"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

interface Stats {
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
  total_products: number;
  low_stock_count: number;
  unapproved_reviews: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    adminApi.stats().then(({ data }) => setStats(data as Stats)).catch(() => {});
  }, []);

  const cards = stats
    ? [
        { label: "Total Orders", value: stats.total_orders, sub: `${stats.pending_orders} pending` },
        { label: "Revenue", value: formatPrice(stats.total_revenue), sub: "all time" },
        { label: "Products", value: stats.total_products, sub: `${stats.low_stock_count} low stock` },
        { label: "Reviews", value: stats.unapproved_reviews, sub: "awaiting approval" },
      ]
    : [];

  return (
    <div>
      <h1 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold mb-8">Dashboard</h1>
      {stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map(({ label, value, sub }) => (
            <div key={label} className="bg-[#1a1a1a] rounded p-5">
              <p className="text-gray-400 text-xs mb-1">{label}</p>
              <p className="text-white text-2xl font-bold">{value}</p>
              <p className="text-gray-500 text-xs mt-1">{sub}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="bg-[#1a1a1a] rounded p-5 animate-pulse h-24" />
          ))}
        </div>
      )}
    </div>
  );
}
