"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { adminApi } from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface AdminOrder {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  total: number;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
  item_count: number;
}

const STATUS_TABS = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const STATUS_BADGE: Record<string, "orange" | "gray" | "green" | "red"> = {
  pending: "orange", confirmed: "gray", processing: "gray",
  shipped: "gray", delivered: "green", cancelled: "red", refunded: "gray",
};
const PM_LABELS: Record<string, string> = {
  cod: "COD", easypaisa: "EasyPaisa", jazzcash: "JazzCash", bank_transfer: "Bank Transfer",
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("status") || "all");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, per_page: 20 };
      if (activeTab !== "all") params.status = activeTab;
      if (search) params.search = search;
      const { data } = await adminApi.orders.list(params);
      setOrders((data as { items: AdminOrder[] }).items);
      setTotal((data as { total: number }).total);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [activeTab, search, page]); // eslint-disable-line react-hooks/exhaustive-deps

  function changeTab(tab: string) {
    setActiveTab(tab);
    setPage(1);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl text-gray-900 font-semibold">Orders</h1>
        <button onClick={() => router.push("/admin/orders/new")}
          className="flex items-center gap-1.5 bg-[#E8670A] text-white text-sm px-4 py-2 rounded hover:bg-[#C45408] transition-colors">
          + Create Draft Order
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none pb-1">
        {STATUS_TABS.map((tab) => (
          <button key={tab} onClick={() => changeTab(tab)}
            className={`shrink-0 px-4 py-2 rounded text-sm capitalize transition-colors ${activeTab === tab ? "bg-[#E8670A] text-white" : "bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-gray-900"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        placeholder="Search by order #, name, or phone…"
        className="w-full bg-white border border-gray-300 text-gray-900 text-[16px] md:text-sm px-3 py-2 rounded mb-4 outline-none focus:border-[#E8670A] min-h-[44px]" />

      {/* Mobile card list */}
      <div className="md:hidden space-y-3 mb-4">
        {loading ? Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-100 rounded mb-2 w-1/2" />
            <div className="h-3 bg-gray-100 rounded mb-2 w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
        )) : orders.map((o) => (
          <div key={o.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[#E8670A] font-bold text-sm">{o.order_number}</span>
              <Badge variant={STATUS_BADGE[o.status] ?? "gray"}>{o.status}</Badge>
            </div>
            <p className="text-gray-900 text-sm font-medium">{o.customer_name}</p>
            <p className="text-gray-500 text-xs mb-1.5">{o.customer_phone} · {formatDate(o.created_at)}</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 text-xs">{o.item_count} item{o.item_count !== 1 ? "s" : ""} · {PM_LABELS[o.payment_method] ?? o.payment_method}</span>
              <span className="text-[#E8670A] font-bold text-sm">{formatPrice(o.total)}</span>
            </div>
            <Link href={`/admin/orders/${o.id}`}
              className="w-full text-center bg-[#E8670A] text-white text-sm font-medium py-2.5 rounded min-h-[44px] flex items-center justify-center">
              View Details
            </Link>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white border border-gray-200 shadow-sm rounded overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 text-left">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({ length: 5 }, (_, i) => (
              <tr key={i} className="border-b border-gray-200">
                {Array.from({ length: 8 }, (_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
              </tr>
            )) : orders.map((o) => (
              <tr key={o.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-[#E8670A] text-xs">{o.order_number}</td>
                <td className="px-4 py-3 text-gray-900">
                  <p>{o.customer_name}</p>
                  <p className="text-gray-500 text-xs">{o.customer_phone}</p>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(o.created_at)}</td>
                <td className="px-4 py-3 text-gray-700">{o.item_count} item{o.item_count !== 1 ? "s" : ""}</td>
                <td className="px-4 py-3 text-gray-700 text-xs">{PM_LABELS[o.payment_method] ?? o.payment_method}</td>
                <td className="px-4 py-3 text-[#E8670A]">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_BADGE[o.status] ?? "gray"}>{o.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="text-[#E8670A] text-xs hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>{total} orders total</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-white border border-gray-200 shadow-sm rounded disabled:opacity-40 hover:bg-gray-100">Prev</button>
          <button disabled={page * 20 >= total} onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-white border border-gray-200 shadow-sm rounded disabled:opacity-40 hover:bg-gray-100">Next</button>
        </div>
      </div>
    </div>
  );
}
