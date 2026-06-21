"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  PlusIcon, ClipboardDocumentListIcon, StarIcon,
  BanknotesIcon, ShoppingBagIcon, UserGroupIcon, ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface DailyStats { date: string; orders: number; revenue: number }
interface DashboardStats {
  today_orders: number;
  today_revenue: number;
  pending_orders: number;
  low_stock_items: number;
  total_revenue: number;
  total_orders: number;
  unapproved_reviews: number;
  orders_7d: DailyStats[];
  orders_by_status: Record<string, number>;
}
interface RecentOrder { id: number; order_number: string; customer_name: string; total_amount: number; status: string; payment_method: string; created_at: string }
interface PendingReview { id: number; product_name: string; customer_name: string; rating: number; body: string; created_at: string }
interface LowStockItem { variant_id: number; product_name: string; sku_variant: string | null; color_name: string; stock: number; low_stock_threshold: number }

const STATUS_COLORS_PIE: Record<string, string> = {
  pending: "#C9A84C", confirmed: "#3b82f6", processing: "#8b5cf6",
  shipped: "#06b6d4", delivered: "#22c55e", cancelled: "#ef4444", refunded: "#6b7280",
};
const STATUS_BADGE: Record<string, "orange" | "gray" | "green" | "red"> = {
  pending: "orange", confirmed: "gray", processing: "gray",
  shipped: "gray", delivered: "green", cancelled: "red", refunded: "gray",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);

  useEffect(() => {
    adminApi.dashboard.stats().then(({ data }) => setStats(data as DashboardStats)).catch(() => {});
    adminApi.dashboard.recentOrders().then(({ data }) => setRecentOrders(data as RecentOrder[])).catch(() => {});
    adminApi.dashboard.pendingReviews().then(({ data }) => setPendingReviews(data as PendingReview[])).catch(() => {});
    adminApi.dashboard.lowStock().then(({ data }) => setLowStock(data as LowStockItem[])).catch(() => {});
  }, []);

  const pieData = stats
    ? Object.entries(stats.orders_by_status).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-playfair text-2xl md:text-[26px] text-[#1B2B5E] font-bold">Dashboard</h1>
          <p className="text-[#64748b] text-xs mt-0.5">Welcome back, Admin</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/products/new">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-[#1B2B5E] hover:bg-[#243570] text-white text-xs font-semibold rounded-lg transition-colors">
              <PlusIcon className="w-3.5 h-3.5" />Add Product
            </button>
          </Link>
          <Link href="/admin/orders?status=pending">
            <button className="flex items-center gap-1.5 px-3 py-2 border border-[#1B2B5E] text-[#1B2B5E] text-xs font-semibold rounded-lg hover:bg-[#EEF1FA] transition-colors">
              <ClipboardDocumentListIcon className="w-3.5 h-3.5" />
              Pending
              {stats && stats.pending_orders > 0 && (
                <span className="bg-[#C9A84C] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">{stats.pending_orders}</span>
              )}
            </button>
          </Link>
          <Link href="/admin/reviews">
            <button className="flex items-center gap-1.5 px-3 py-2 border border-[#1B2B5E] text-[#1B2B5E] text-xs font-semibold rounded-lg hover:bg-[#EEF1FA] transition-colors">
              <StarIcon className="w-3.5 h-3.5" />
              Reviews
              {stats && stats.unapproved_reviews > 0 && (
                <span className="bg-[#C9A84C] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">{stats.unapproved_reviews}</span>
              )}
            </button>
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {stats ? [
          {
            label: "Today's Revenue", value: formatPrice(stats.today_revenue),
            sub: `All time: ${formatPrice(stats.total_revenue)}`,
            Icon: BanknotesIcon, iconBg: "bg-[#EEF1FA]", iconColor: "text-[#1B2B5E]", accent: "border-l-[#1B2B5E]",
          },
          {
            label: "Today's Orders", value: stats.today_orders,
            sub: `${stats.pending_orders} pending`,
            Icon: ShoppingBagIcon, iconBg: "bg-[#FDF6E3]", iconColor: "text-[#C9A84C]", accent: "border-l-[#C9A84C]",
          },
          {
            label: "Total Orders", value: stats.total_orders,
            sub: `${stats.pending_orders} need action`,
            Icon: UserGroupIcon, iconBg: "bg-[#d1fae5]", iconColor: "text-[#059669]", accent: "border-l-[#059669]",
          },
          {
            label: "Low Stock Items", value: stats.low_stock_items,
            sub: "need restocking",
            Icon: ExclamationTriangleIcon,
            iconBg: stats.low_stock_items > 0 ? "bg-[#fee2e2]" : "bg-[#d1fae5]",
            iconColor: stats.low_stock_items > 0 ? "text-[#dc2626]" : "text-[#059669]",
            accent: stats.low_stock_items > 0 ? "border-l-[#dc2626]" : "border-l-[#059669]",
          },
        ].map(({ label, value, sub, Icon, iconBg, iconColor, accent }) => (
          <div key={label} className={`bg-white border-[1.5px] border-[#E2E8F0] border-l-4 ${accent} rounded-xl p-[18px]`}>
            <div className={`w-10 h-10 ${iconBg} rounded-[10px] flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[.08em] text-[#64748b] mb-1">{label}</p>
            <p className="font-playfair text-[26px] font-bold text-[#1B2B5E] leading-none">{value}</p>
            <p className="text-[#94a3b8] text-[11px] mt-1.5">{sub}</p>
          </div>
        )) : Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl p-[18px] animate-pulse h-28" />
        ))}
      </div>

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
            <div className="mb-4">
              <p className="font-playfair text-[16px] font-bold text-[#1B2B5E]">Revenue & Orders — Last 7 Days</p>
              <p className="text-[11px] text-[#64748b]">Blue = Revenue · Gold = Orders</p>
            </div>
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={stats.orders_7d}>
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 12 }} />
                <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#C9A84C" strokeWidth={2} dot={false} name="Orders" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#1B2B5E" strokeWidth={2} dot={false} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
            <div className="mb-4">
              <p className="font-playfair text-[16px] font-bold text-[#1B2B5E]">Order Status Breakdown</p>
            </div>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65}>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS_PIE[entry.name] ?? "#6b7280"} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ color: "#64748b", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-[#94a3b8] text-sm text-center pt-14">No orders yet</p>}
          </div>
        </div>
      )}

      {/* Bottom section: Recent Orders + side panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-playfair text-[16px] font-bold text-[#1B2B5E]">Recent Orders</p>
            <Link href="/admin/orders" className="text-[#C9A84C] text-xs hover:underline font-semibold">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left border-b border-[#F1F5F9]">
                  {["Order ID", "Customer", "Total", "Status"].map((h) => (
                    <th key={h} className="pb-2 pr-3 font-semibold uppercase tracking-wider text-[10px] text-[#64748b]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 6).map((o) => (
                  <tr key={o.id} className="border-b border-[#F8FAFC] hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-2.5 pr-3">
                      <Link href={`/admin/orders/${o.id}`} className="text-[#1B2B5E] font-mono font-bold hover:text-[#C9A84C] transition-colors">{o.order_number}</Link>
                    </td>
                    <td className="py-2.5 pr-3 text-[#374151] font-medium">{o.customer_name}</td>
                    <td className="py-2.5 pr-3 font-bold text-[#1B2B5E]">{formatPrice(o.total_amount)}</td>
                    <td className="py-2.5"><Badge variant={STATUS_BADGE[o.status] ?? "gray"}>{o.status}</Badge></td>
                  </tr>
                ))}
                {recentOrders.length === 0 && <tr><td colSpan={4} className="py-6 text-[#94a3b8] text-center">No orders yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* Low Stock */}
          <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-playfair text-[15px] font-bold text-[#1B2B5E]">Low Stock Alert</p>
              {lowStock.length > 0 && <span className="text-[#dc2626] text-xs font-bold">{lowStock.length} items</span>}
            </div>
            <div className="text-xs space-y-2">
              {lowStock.slice(0, 4).map((item) => (
                <div key={item.variant_id} className="flex justify-between py-1.5 border-b border-[#F8FAFC]">
                  <span className="text-[#374151] truncate max-w-[140px]">{item.product_name} — {item.color_name}</span>
                  <span className={`font-bold ml-2 shrink-0 ${item.stock === 0 ? "text-[#dc2626]" : "text-[#d97706]"}`}>
                    {item.stock === 0 ? "Out" : `${item.stock}`}
                  </span>
                </div>
              ))}
              {lowStock.length === 0 && <p className="text-[#94a3b8] text-center py-2">All well stocked</p>}
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-playfair text-[15px] font-bold text-[#1B2B5E]">Pending Reviews</p>
              {pendingReviews.length > 0 && (
                <span className="bg-[#fef3c7] text-[#92400e] text-[9px] font-bold px-2 py-0.5 rounded-full">{pendingReviews.length}</span>
              )}
            </div>
            <div className="text-xs space-y-2">
              {pendingReviews.slice(0, 3).map((r) => (
                <div key={r.id} className="border-b border-[#F8FAFC] pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[#374151] font-medium">{r.customer_name}</p>
                      <p className="text-[#64748b] truncate max-w-[120px]">{r.product_name}</p>
                    </div>
                    <span className="text-[#C9A84C] shrink-0">{"★".repeat(r.rating)}</span>
                  </div>
                </div>
              ))}
              {pendingReviews.length === 0 && <p className="text-[#94a3b8] text-center py-2">No pending reviews</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products placeholder */}
      <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
        <p className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4">Top Products — This Month</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left border-b border-[#F1F5F9]">
                {["#", "Product", "Units Sold", "Revenue", "Avg Rating", ""].map((h) => (
                  <th key={h} className="pb-2 pr-4 font-semibold uppercase tracking-wider text-[10px] text-[#64748b]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="py-6 text-[#94a3b8] text-center text-xs">
                  Top product data will appear here once orders are placed
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
