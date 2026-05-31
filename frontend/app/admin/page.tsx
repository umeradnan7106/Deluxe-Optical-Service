"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { PlusIcon, ClipboardDocumentListIcon, StarIcon } from "@heroicons/react/24/outline";

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
  pending: "#E8670A", confirmed: "#3b82f6", processing: "#8b5cf6",
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl text-gray-900 font-semibold">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/products/new">
            <Button variant="primary" size="sm"><PlusIcon className="w-4 h-4" />Add Product</Button>
          </Link>
          <Link href="/admin/orders?status=pending">
            <Button variant="outline" size="sm">
              <ClipboardDocumentListIcon className="w-4 h-4" />
              Pending Orders
              {stats && stats.pending_orders > 0 && (
                <span className="ml-1 bg-[#E8670A] text-white text-xs px-1.5 rounded-full">{stats.pending_orders}</span>
              )}
            </Button>
          </Link>
          <Link href="/admin/reviews">
            <Button variant="outline" size="sm">
              <StarIcon className="w-4 h-4" />
              Reviews
              {stats && stats.unapproved_reviews > 0 && (
                <span className="ml-1 bg-[#E8670A] text-white text-xs px-1.5 rounded-full">{stats.unapproved_reviews}</span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {stats ? [
          { label: "Today's Orders", value: stats.today_orders, sub: `${stats.pending_orders} pending`, color: "text-[#E8670A]" },
          { label: "Today's Revenue", value: formatPrice(stats.today_revenue), sub: "all time: " + formatPrice(stats.total_revenue), color: "text-green-600" },
          { label: "Pending Orders", value: stats.pending_orders, sub: `${stats.total_orders} total orders`, color: "text-blue-600" },
          { label: "Low Stock Items", value: stats.low_stock_items, sub: "need restocking", color: stats.low_stock_items > 0 ? "text-red-500" : "text-gray-900" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white border border-gray-200 shadow-sm rounded p-5">
            <p className="text-gray-500 text-xs mb-1">{label}</p>
            <p className={`${color} text-2xl font-bold`}>{value}</p>
            <p className="text-gray-400 text-xs mt-1">{sub}</p>
          </div>
        )) : Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-gray-100 rounded p-5 animate-pulse h-24" />
        ))}
      </div>

      {/* Shopify-like overview metrics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Avg. Order Value",
              value: stats.total_orders > 0 ? formatPrice(Math.round(stats.total_revenue / stats.total_orders)) : "—",
              sub: "per completed order",
            },
            {
              label: "Fulfillment Rate",
              value: stats.total_orders > 0
                ? `${Math.round(((stats.total_orders - (stats.orders_by_status?.cancelled ?? 0)) / stats.total_orders) * 100)}%`
                : "—",
              sub: "orders fulfilled",
            },
            {
              label: "Pending Reviews",
              value: stats.unapproved_reviews,
              sub: "awaiting approval",
            },
            {
              label: "Total Revenue",
              value: formatPrice(stats.total_revenue),
              sub: `from ${stats.total_orders} orders`,
            },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-[#f9fafb] border border-gray-200 rounded px-4 py-3">
              <p className="text-gray-400 text-[11px] uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-gray-900 text-lg font-bold">{value}</p>
              <p className="text-gray-400 text-[11px] mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 shadow-sm rounded p-5">
            <p className="text-gray-500 text-xs mb-4 uppercase tracking-wide">Orders & Revenue — Last 7 Days</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.orders_7d}>
                <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fill: "#6b7280", fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#6b7280", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4 }} labelStyle={{ color: "#111" }} />
                <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#E8670A" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white border border-gray-200 shadow-sm rounded p-5">
            <p className="text-gray-500 text-xs mb-4 uppercase tracking-wide">Orders by Status</p>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS_PIE[entry.name] ?? "#6b7280"} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ color: "#6b7280", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-400 text-sm text-center pt-12">No orders yet</p>}
          </div>
        </div>
      )}

      {/* Bottom tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="bg-white border border-gray-200 shadow-sm rounded p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-xs uppercase tracking-wide">Recent Orders</p>
            <Link href="/admin/orders" className="text-[#E8670A] text-xs hover:underline">View all</Link>
          </div>
          <table className="w-full text-xs">
            <thead><tr className="text-gray-500 text-left border-b border-gray-200">
              <th className="pb-2">Order</th><th className="pb-2">Customer</th><th className="pb-2">Total</th><th className="pb-2">Status</th>
            </tr></thead>
            <tbody>
              {recentOrders.slice(0, 6).map((o) => (
                <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 pr-3">
                    <Link href={`/admin/orders/${o.id}`} className="text-[#E8670A] font-mono hover:underline">{o.order_number}</Link>
                  </td>
                  <td className="py-2 pr-3 text-gray-700">{o.customer_name}</td>
                  <td className="py-2 pr-3 text-gray-900">{formatPrice(o.total_amount)}</td>
                  <td className="py-2"><Badge variant={STATUS_BADGE[o.status] ?? "gray"}>{o.status}</Badge></td>
                </tr>
              ))}
              {recentOrders.length === 0 && <tr><td colSpan={4} className="py-4 text-gray-400 text-center">No orders yet</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white border border-gray-200 shadow-sm rounded p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-xs uppercase tracking-wide">Pending Reviews</p>
            <Link href="/admin/reviews" className="text-[#E8670A] text-xs hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {pendingReviews.slice(0, 5).map((r) => (
              <div key={r.id} className="border-b border-gray-100 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-900 text-xs font-medium">{r.customer_name}</p>
                    <p className="text-gray-500 text-xs">{r.product_name}</p>
                  </div>
                  <span className="text-[#E8670A] text-xs">{"★".repeat(r.rating)}</span>
                </div>
                <p className="text-gray-600 text-xs mt-0.5 truncate">{r.body}</p>
              </div>
            ))}
            {pendingReviews.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No pending reviews</p>}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white border border-gray-200 shadow-sm rounded p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-xs uppercase tracking-wide">Low Stock Alerts</p>
            <Link href="/admin/inventory?filter=low_stock" className="text-[#E8670A] text-xs hover:underline">View inventory</Link>
          </div>
          <table className="w-full text-xs">
            <thead><tr className="text-gray-500 text-left border-b border-gray-200">
              <th className="pb-2">Product</th><th className="pb-2">Color</th><th className="pb-2">SKU</th><th className="pb-2">Stock</th><th className="pb-2">Threshold</th>
            </tr></thead>
            <tbody>
              {lowStock.slice(0, 8).map((item) => (
                <tr key={item.variant_id} className="border-b border-gray-100">
                  <td className="py-2 pr-3 text-gray-900">{item.product_name}</td>
                  <td className="py-2 pr-3 text-gray-700">{item.color_name}</td>
                  <td className="py-2 pr-3 text-gray-400 font-mono">{item.sku_variant ?? "—"}</td>
                  <td className="py-2 pr-3">
                    <span className={item.stock === 0 ? "text-red-500 font-bold" : "text-orange-500"}>{item.stock}</span>
                  </td>
                  <td className="py-2 text-gray-400">{item.low_stock_threshold}</td>
                </tr>
              ))}
              {lowStock.length === 0 && <tr><td colSpan={5} className="py-4 text-gray-400 text-center">All products well stocked</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
