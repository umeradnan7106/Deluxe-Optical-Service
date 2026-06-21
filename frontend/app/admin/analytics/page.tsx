"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
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
  pending: "#C9A84C", confirmed: "#3b82f6", processing: "#8b5cf6",
  shipped: "#06b6d4", delivered: "#22c55e", cancelled: "#ef4444", refunded: "#6b7280",
};

type DateRange = "today" | "7d" | "30d" | "90d";
const DATE_RANGE_LABELS: { key: DateRange; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 Days" },
  { key: "30d", label: "Last 30 Days" },
  { key: "90d", label: "Last 90 Days" },
];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>("30d");

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

  const kpiCards = [
    { label: "Total Revenue", value: stats ? formatPrice(stats.total_revenue) : "—", change: "↑ 615%", up: true },
    { label: "Total Orders", value: stats?.total_orders ?? "—", change: "↑ 733%", up: true },
    { label: "Avg Order Value", value: stats ? formatPrice(avgOrderValue) : "—", change: "↑ 12%", up: true },
    { label: "Total Customers", value: "—", change: "↑ 200%", up: true },
    { label: "New Customers", value: "—", change: "↑ 5 this period", up: true },
    { label: "Conversion Rate", value: "—", change: "↑ from 71%", up: true },
  ];

  const labelCls = "text-[10px] font-semibold uppercase tracking-[.08em] text-[#64748b] mb-1.5";
  const filterTabCls = (active: boolean) => `px-3 py-1.5 rounded text-[11px] font-medium cursor-pointer transition-colors ${active ? "bg-white text-[#1B2B5E] shadow-sm" : "text-[#64748b] hover:text-[#1B2B5E]"}`;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-playfair text-2xl md:text-[26px] text-[#1B2B5E] font-bold">Analytics</h1>
          <p className="text-[#64748b] text-xs mt-0.5">Store performance overview</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-1">
            {DATE_RANGE_LABELS.map(({ key, label }) => (
              <button key={key} onClick={() => setDateRange(key)} className={filterTabCls(dateRange === key)}>
                {label}
              </button>
            ))}
          </div>
          <button className="px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs text-[#64748b] hover:border-[#1B2B5E] transition-colors bg-white">
            ↺ Refresh
          </button>
        </div>
      </div>

      {/* 6 KPI cards — 3 col */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {kpiCards.map(({ label, value, change, up }) => (
          <div key={label} className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-4">
            <p className={labelCls}>{label}</p>
            <p className="font-playfair text-[28px] font-bold text-[#1B2B5E] leading-none mb-1">{value}</p>
            <p className={`text-[11px] font-semibold ${up ? "text-[#059669]" : "text-[#dc2626]"}`}>{change} vs prev period</p>
          </div>
        ))}
      </div>

      {/* Revenue & Orders line chart */}
      <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-playfair text-[16px] font-bold text-[#1B2B5E]">Revenue &amp; Orders</p>
            <p className="text-[#64748b] text-xs">
              {stats ? `${formatPrice(stats.total_revenue)} total · ${stats.total_orders} orders` : "Loading…"}
            </p>
          </div>
          <div className="flex gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded p-0.5">
            <button className="px-3 py-1 text-[11px] bg-white rounded text-[#1B2B5E] font-medium shadow-sm">Daily</button>
            <button className="px-3 py-1 text-[11px] text-[#64748b]">Weekly</button>
          </div>
        </div>
        {revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v, name) => [name === "revenue" ? formatPrice(Number(v)) : v, name === "revenue" ? "Revenue" : "Orders"]} />
              <Line type="monotone" dataKey="revenue" stroke="#1B2B5E" strokeWidth={2} dot={false} name="revenue" />
              <Line type="monotone" dataKey="orders" stroke="#C9A84C" strokeWidth={2} dot={false} name="orders" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[220px] flex items-center justify-center text-[#64748b] text-sm">Loading chart…</div>
        )}
      </div>

      {/* Status donut + New vs Returning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
          <p className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4">Order Status Breakdown</p>
          {pieData.length > 0 ? (
            <div className="flex gap-4 items-center">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75}>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? "#ccc"} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {pieData.map(({ name, value }) => (
                  <div key={name} className="flex justify-between items-center text-xs py-1.5 border-b border-[#F1F5F9] last:border-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[name] ?? "#ccc" }} />
                      <span className="capitalize text-[#0F172A]">{name}</span>
                    </div>
                    <span className="font-semibold text-[#0F172A]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[160px] flex items-center justify-center text-[#64748b] text-sm">No data yet</div>
          )}
        </div>

        <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
          <p className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4">New vs Returning Customers</p>
          <div className="flex items-center justify-center gap-8 py-4">
            <div className="text-center">
              <p className="font-playfair text-[36px] font-bold text-[#1B2B5E] leading-none">—</p>
              <p className="text-[11px] text-[#64748b] mt-1">New · ~78%</p>
            </div>
            <div className="w-px h-16 bg-[#E2E8F0]" />
            <div className="text-center">
              <p className="font-playfair text-[36px] font-bold text-[#059669] leading-none">—</p>
              <p className="text-[11px] text-[#64748b] mt-1">Returning · ~22%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products + Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
          <p className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4">Top Products</p>
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-[#64748b] border-b border-[#F1F5F9]">
                <th className="text-left pb-2 font-semibold text-[10px] uppercase tracking-wide">#</th>
                <th className="text-left pb-2 font-semibold text-[10px] uppercase tracking-wide">Product</th>
                <th className="text-left pb-2 font-semibold text-[10px] uppercase tracking-wide">Units</th>
                <th className="text-left pb-2 font-semibold text-[10px] uppercase tracking-wide">Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#F8FAFC]">
                <td className="py-2.5 pr-2 text-[#C9A84C] font-bold">1</td>
                <td className="py-2.5 pr-2 font-medium text-[#0F172A]">Full Golden Aviator</td>
                <td className="py-2.5 pr-2 text-[#64748b]">84</td>
                <td className="py-2.5 font-bold text-[#059669]">Rs. 1,26,000</td>
              </tr>
              <tr className="border-b border-[#F8FAFC]">
                <td className="py-2.5 pr-2 text-[#64748b] font-bold">2</td>
                <td className="py-2.5 pr-2 font-medium text-[#0F172A]">Classic Blue Cut</td>
                <td className="py-2.5 pr-2 text-[#64748b]">62</td>
                <td className="py-2.5 font-bold text-[#059669]">Rs. 1,30,200</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-2 text-[#64748b] font-bold">3</td>
                <td className="py-2.5 pr-2 font-medium text-[#0F172A]">Black Rimless Frame</td>
                <td className="py-2.5 pr-2 text-[#64748b]">51</td>
                <td className="py-2.5 font-bold text-[#059669]">Rs. 91,800</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
          <p className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4">Top Customers</p>
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-[#64748b] border-b border-[#F1F5F9]">
                <th className="text-left pb-2 font-semibold text-[10px] uppercase tracking-wide">Customer</th>
                <th className="text-left pb-2 font-semibold text-[10px] uppercase tracking-wide">Orders</th>
                <th className="text-left pb-2 font-semibold text-[10px] uppercase tracking-wide">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#F8FAFC]">
                <td className="py-2.5 font-medium text-[#1B2B5E] cursor-pointer hover:underline">Ali Khan</td>
                <td className="py-2.5 text-[#64748b]">8</td>
                <td className="py-2.5 font-bold text-[#0F172A]">Rs. 18,400</td>
              </tr>
              <tr className="border-b border-[#F8FAFC]">
                <td className="py-2.5 font-medium text-[#1B2B5E] cursor-pointer hover:underline">Omar Malik</td>
                <td className="py-2.5 text-[#64748b]">5</td>
                <td className="py-2.5 font-bold text-[#0F172A]">Rs. 14,200</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-[#1B2B5E] cursor-pointer hover:underline">Sara Qureshi</td>
                <td className="py-2.5 text-[#64748b]">4</td>
                <td className="py-2.5 font-bold text-[#0F172A]">Rs. 9,800</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
