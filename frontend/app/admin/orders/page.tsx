"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
  const searchParams = useSearchParams();
  const router = useRouter();
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
      <h1 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold mb-6">Orders</h1>

      {/* Status tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button key={tab} onClick={() => changeTab(tab)}
            className={`px-4 py-2 rounded text-sm capitalize transition-colors ${activeTab === tab ? "bg-[#E8670A] text-white" : "bg-[#1a1a1a] text-gray-400 hover:text-white"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        placeholder="Search by order #, name, or phone…"
        className="w-full max-w-md bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded mb-4 outline-none focus:border-[#E8670A]" />

      {/* Table */}
      <div className="bg-[#1a1a1a] rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-gray-400 text-left">
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
              <tr key={i} className="border-b border-[#2a2a2a]">
                {Array.from({ length: 8 }, (_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-[#2a2a2a] rounded animate-pulse" /></td>)}
              </tr>
            )) : orders.map((o) => (
              <tr key={o.id} className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/30 transition-colors">
                <td className="px-4 py-3 font-mono text-[#E8670A] text-xs">{o.order_number}</td>
                <td className="px-4 py-3 text-white">
                  <p>{o.customer_name}</p>
                  <p className="text-gray-500 text-xs">{o.customer_phone}</p>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(o.created_at)}</td>
                <td className="px-4 py-3 text-gray-300">{o.item_count} item{o.item_count !== 1 ? "s" : ""}</td>
                <td className="px-4 py-3 text-gray-300 text-xs">{PM_LABELS[o.payment_method] ?? o.payment_method}</td>
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
            className="px-3 py-1 bg-[#1a1a1a] rounded disabled:opacity-40 hover:bg-[#2a2a2a]">Prev</button>
          <button disabled={page * 20 >= total} onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-[#1a1a1a] rounded disabled:opacity-40 hover:bg-[#2a2a2a]">Next</button>
        </div>
      </div>
    </div>
  );
}
