"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";
import type { User } from "@/types";

interface CustomerUser extends User {
  total_orders?: number;
  total_spent?: number;
  last_order_date?: string | null;
}

interface GuestOrder {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  total: number;
  status: string;
  created_at: string | null;
}

export default function CustomersPage() {
  const [tab, setTab] = useState<"registered" | "guest">("registered");
  const [users, setUsers] = useState<CustomerUser[]>([]);
  const [guestOrders, setGuestOrders] = useState<GuestOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [guestTotal, setGuestTotal] = useState(0);
  const [guestPage, setGuestPage] = useState(1);

  useEffect(() => {
    if (tab !== "registered") return;
    setLoading(true);
    adminApi.users.list({ page, per_page: 20 })
      .then(({ data }) => {
        setUsers((data as { items: CustomerUser[]; total: number }).items ?? []);
        setTotal((data as { items: CustomerUser[]; total: number }).total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, tab]);

  useEffect(() => {
    if (tab !== "guest") return;
    setLoading(true);
    adminApi.users.listGuests({ page: guestPage, per_page: 20 })
      .then(({ data }) => {
        setGuestOrders((data as { items: GuestOrder[]; total: number }).items ?? []);
        setGuestTotal((data as { items: GuestOrder[]; total: number }).total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [guestPage, tab]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl text-gray-900 font-semibold">Customers</h1>
        <p className="text-[#6b7280] text-sm">{total} total</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e5e7eb] mb-5">
        {(["registered", "guest"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px capitalize transition-colors ${
              tab === t ? "border-[#E8670A] text-[#E8670A]" : "border-transparent text-[#6b7280] hover:text-[#1a1a1a]"
            }`}
          >
            {t === "registered" ? "Registered" : "Guest"}
          </button>
        ))}
      </div>

      {tab === "registered" && (
        <div className="bg-white border border-[#e5e7eb] rounded-lg overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                <th className="text-left px-4 py-3 text-[#6b7280] font-medium text-xs uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-[#6b7280] font-medium text-xs uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-[#6b7280] font-medium text-xs uppercase tracking-wide hidden md:table-cell">Phone</th>
                <th className="text-left px-4 py-3 text-[#6b7280] font-medium text-xs uppercase tracking-wide hidden lg:table-cell">Total Orders</th>
                <th className="text-left px-4 py-3 text-[#6b7280] font-medium text-xs uppercase tracking-wide hidden lg:table-cell">Total Spent</th>
                <th className="text-left px-4 py-3 text-[#6b7280] font-medium text-xs uppercase tracking-wide hidden xl:table-cell">Last Order</th>
                <th className="text-left px-4 py-3 text-[#6b7280] font-medium text-xs uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-[#6b7280]">Loading…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-[#6b7280]">No customers found</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[#1a1a1a] font-medium">{u.full_name || "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-[#6b7280]">{u.email}</td>
                    <td className="px-4 py-3 text-[#6b7280] hidden md:table-cell">{u.phone || "—"}</td>
                    <td className="px-4 py-3 text-[#1a1a1a] hidden lg:table-cell">{u.total_orders ?? "—"}</td>
                    <td className="px-4 py-3 text-[#1a1a1a] hidden lg:table-cell">{u.total_spent != null ? formatPrice(u.total_spent) : "—"}</td>
                    <td className="px-4 py-3 text-[#6b7280] hidden xl:table-cell text-xs">
                      {u.last_order_date ? new Date(u.last_order_date).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${
                        u.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}>
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {total > 20 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#e5e7eb]">
              <p className="text-[#6b7280] text-xs">Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 border border-[#e5e7eb] rounded text-sm disabled:opacity-40 hover:bg-gray-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * 20 >= total}
                  className="px-3 py-1.5 border border-[#e5e7eb] rounded text-sm disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "guest" && (
        <div className="bg-white border border-[#e5e7eb] rounded-lg overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                <th className="text-left px-4 py-3 text-[#6b7280] font-medium text-xs uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-[#6b7280] font-medium text-xs uppercase tracking-wide">Contact</th>
                <th className="text-left px-4 py-3 text-[#6b7280] font-medium text-xs uppercase tracking-wide">Order #</th>
                <th className="text-left px-4 py-3 text-[#6b7280] font-medium text-xs uppercase tracking-wide">Total</th>
                <th className="text-left px-4 py-3 text-[#6b7280] font-medium text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-[#6b7280] font-medium text-xs uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-[#6b7280]">Loading…</td></tr>
              ) : guestOrders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-[#6b7280]">No guest orders found</td></tr>
              ) : guestOrders.map((o) => (
                <tr key={o.order_number} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors">
                  <td className="px-4 py-3 text-[#1a1a1a] font-medium">{o.customer_name}</td>
                  <td className="px-4 py-3 text-[#6b7280]">
                    <p>{o.customer_email || "—"}</p>
                    <p className="text-xs">{o.customer_phone}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-[#E8670A] text-xs">{o.order_number}</td>
                  <td className="px-4 py-3 text-[#1a1a1a]">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded capitalize">{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[#6b7280] text-xs">{o.created_at ? formatDate(o.created_at) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {guestTotal > 20 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#e5e7eb]">
              <p className="text-[#6b7280] text-xs">{guestTotal} guest orders total</p>
              <div className="flex gap-2">
                <button onClick={() => setGuestPage((p) => Math.max(1, p - 1))} disabled={guestPage === 1} className="px-3 py-1.5 border border-[#e5e7eb] rounded text-sm disabled:opacity-40 hover:bg-gray-50">Prev</button>
                <button onClick={() => setGuestPage((p) => p + 1)} disabled={guestPage * 20 >= guestTotal} className="px-3 py-1.5 border border-[#e5e7eb] rounded text-sm disabled:opacity-40 hover:bg-gray-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
