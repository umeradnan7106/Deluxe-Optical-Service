"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface AbandonedCartItem {
  id: number;
  session_id: string;
  email: string | null;
  phone: string | null;
  item_count: number;
  email_sent: boolean;
  created_at: string | null;
  updated_at: string | null;
}

interface Stats {
  total: number;
  email_sent: number;
  not_contacted: number;
}

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "not_contacted", label: "Not Contacted" },
  { key: "email_sent", label: "Email Sent" },
];

export default function AbandonedCartsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [carts, setCarts] = useState<AbandonedCartItem[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, email_sent: 0, not_contacted: 0 });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean> = { page, per_page: 20 };
      if (activeTab === "email_sent") params.email_sent = true;
      if (activeTab === "not_contacted") params.email_sent = false;
      const { data } = await adminApi.abandonedCarts.list(params);
      const d = data as { items: AbandonedCartItem[]; total: number; stats: Stats };
      setCarts(d.items);
      setTotal(d.total);
      if (d.stats) setStats(d.stats);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [activeTab, page]); // eslint-disable-line react-hooks/exhaustive-deps

  function changeTab(tab: string) {
    setActiveTab(tab);
    setPage(1);
  }

  return (
    <div>
      <h1 className="font-['Cormorant_Garamond'] text-3xl text-gray-900 font-semibold mb-6">Abandoned Carts</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Abandoned", value: stats.total },
          { label: "Not Contacted", value: stats.not_contacted },
          { label: "Email Sent", value: stats.email_sent },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-200 shadow-sm rounded p-4">
            <p className="text-gray-500 text-xs mb-1">{label}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none pb-1">
        {FILTER_TABS.map(({ key, label }) => (
          <button key={key} onClick={() => changeTab(key)}
            className={`shrink-0 px-4 py-2 rounded text-sm capitalize transition-colors ${activeTab === key ? "bg-[#E8670A] text-white" : "bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-gray-900"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 shadow-sm rounded overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 text-left">
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Last Updated</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({ length: 5 }, (_, i) => (
              <tr key={i} className="border-b border-gray-200">
                {Array.from({ length: 4 }, (_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
              </tr>
            )) : carts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No abandoned carts found</td>
              </tr>
            ) : carts.map((c) => (
              <tr key={c.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  {c.email && <p className="text-gray-900 text-sm">{c.email}</p>}
                  {c.phone && <p className="text-gray-500 text-xs">{c.phone}</p>}
                  {!c.email && !c.phone && <span className="text-gray-400 text-xs">Anonymous</span>}
                </td>
                <td className="px-4 py-3 text-gray-700">{c.item_count} item{c.item_count !== 1 ? "s" : ""}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{c.updated_at ? formatDate(c.updated_at) : "—"}</td>
                <td className="px-4 py-3">
                  <Badge variant={c.email_sent ? "green" : "gray"}>
                    {c.email_sent ? "Email Sent" : "Not Contacted"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>{total} carts total</span>
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
