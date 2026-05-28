"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from "recharts";

interface DailyStats { date: string; orders: number; revenue: number }
interface DashboardStats {
  today_orders: number;
  today_revenue: number;
  total_revenue: number;
  total_orders: number;
  orders_7d: DailyStats[];
  orders_by_status: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#E8670A", confirmed: "#3b82f6", processing: "#8b5cf6",
  shipped: "#06b6d4", delivered: "#22c55e", cancelled: "#ef4444", refunded: "#6b7280",
};

const PAYMENT_COLORS = ["#E8670A", "#3b82f6", "#8b5cf6", "#22c55e"];
const PAYMENT_DATA = [
  { name: "Cash on Delivery", value: 60 },
  { name: "EasyPaisa", value: 20 },
  { name: "JazzCash", value: 15 },
  { name: "Bank Transfer", value: 5 },
];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [range, setRange] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    adminApi.dashboard.stats().then(({ data }) => setStats(data as DashboardStats)).catch(() => {});
  }, []);

  const revenueData = stats?.orders_7d ?? [];
  const pieData = stats
    ? Object.entries(stats.orders_by_status).map(([name, value]) => ({ name, value }))
    : [];

  const avgOrderValue = stats && stats.total_orders > 0
    ? stats.total_revenue / stats.total_orders
    : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl text-gray-900 font-semibold">Analytics</h1>
        <div className="flex border border-[#e5e7eb] rounded-lg overflow-hidden text-sm">
          {(["daily", "weekly", "monthly"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 capitalize transition-colors ${
                range === r ? "bg-[#E8670A] text-white" : "bg-white text-[#6b7280] hover:bg-gray-50"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Revenue", value: stats ? formatPrice(stats.total_revenue) : "—" },
          { label: "Total Orders", value: stats?.total_orders ?? "—" },
          { label: "Avg. Order Value", value: stats ? formatPrice(avgOrderValue) : "—" },
          { label: "Today's Revenue", value: stats ? formatPrice(stats.today_revenue) : "—" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-[#e5e7eb] rounded-lg p-5">
            <p className="text-[#6b7280] text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
            <p className="text-[#1a1a1a] text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Revenue line chart */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-5 mb-5">
        <h2 className="text-[#1a1a1a] font-semibold mb-4">Revenue Over Time</h2>
        {revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={revenueData}>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => formatPrice(Number(v))} />
              <Line type="monotone" dataKey="revenue" stroke="#E8670A" strokeWidth={2} dot={false} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[240px] flex items-center justify-center text-[#6b7280] text-sm">Loading chart…</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Orders by status donut */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
          <h2 className="text-[#1a1a1a] font-semibold mb-4">Orders by Status</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? "#ccc"} />
                  ))}
                </Pie>
                <Legend formatter={(v) => <span className="text-xs capitalize">{v}</span>} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-[#6b7280] text-sm">No data yet</div>
          )}
        </div>

        {/* Payment methods bar chart */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
          <h2 className="text-[#1a1a1a] font-semibold mb-4">Payment Methods</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={PAYMENT_DATA} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7280" }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} width={100} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {PAYMENT_DATA.map((_, i) => (
                  <Cell key={i} fill={PAYMENT_COLORS[i % PAYMENT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer type breakdown */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
        <h2 className="text-[#1a1a1a] font-semibold mb-4">Customer Type Breakdown</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Registered Customers", pct: 65, color: "#E8670A" },
            { label: "Guest Checkouts", pct: 35, color: "#3b82f6" },
          ].map(({ label, pct, color }) => (
            <div key={label} className="bg-[#f9fafb] rounded-lg p-4">
              <p className="text-[#6b7280] text-sm mb-2">{label}</p>
              <p className="text-[#1a1a1a] text-3xl font-bold mb-3">{pct}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
