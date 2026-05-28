"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface AdminReview {
  id: number;
  product_id: number;
  product_name: string;
  order_id: number | null;
  customer_name: string;
  customer_email: string;
  rating: number;
  title: string;
  body: string;
  images: string[];
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
}

type FilterTab = "pending" | "approved" | "all";

export default function AdminReviewsPage() {
  const [tab, setTab] = useState<FilterTab>("pending");
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);

  async function load() {
    setLoading(true);
    try {
      const params: Record<string, string | number | undefined> = {};
      if (tab === "pending") params.is_approved = 0;
      if (tab === "approved") params.is_approved = 1;
      const { data } = await adminApi.reviews.list(params);
      setReviews((data as unknown as { items: AdminReview[] }).items);
      setTotal((data as unknown as { total: number }).total);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  async function approve(id: number) {
    await adminApi.reviews.approve(id);
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, is_approved: true } : r));
    if (tab === "pending") setReviews((prev) => prev.filter((r) => r.id !== id));
    setSelectedReview(null);
  }

  async function reject(id: number) {
    await adminApi.reviews.reject(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setSelectedReview(null);
  }

  async function toggleFeature(id: number) {
    const { data } = await adminApi.reviews.feature(id);
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, is_featured: (data as { is_featured: boolean }).is_featured } : r));
  }

  const TABS: { key: FilterTab; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "all", label: "All" },
  ];

  return (
    <div>
      <h1 className="font-['Cormorant_Garamond'] text-3xl text-gray-900 font-semibold mb-6">Reviews</h1>

      <div className="flex gap-2 mb-6">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded text-sm transition-colors ${tab === key ? "bg-[#E8670A] text-white" : "bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-gray-900"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 text-left">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Excerpt</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({ length: 5 }, (_, i) => (
              <tr key={i} className="border-b border-gray-200">
                {Array.from({ length: 6 }, (_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
              </tr>
            )) : reviews.map((r) => (
              <tr key={r.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-gray-900">{r.customer_name}</p>
                  <p className="text-gray-500 text-xs">{r.customer_email}</p>
                </td>
                <td className="px-4 py-3 text-gray-700 text-sm">{r.product_name}</td>
                <td className="px-4 py-3">
                  <span className="text-[#E8670A]">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs max-w-[200px]">
                  <p className="font-medium text-gray-700">{r.title}</p>
                  <p className="truncate">{r.body.slice(0, 80)}{r.body.length > 80 ? "…" : ""}</p>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(r.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    <button onClick={() => setSelectedReview(r)} className="text-xs text-[#E8670A] hover:underline px-2 py-1">View</button>
                    {!r.is_approved && (
                      <button onClick={() => approve(r.id)} className="text-xs text-green-400 hover:text-green-300 px-2 py-1">Approve</button>
                    )}
                    <button onClick={() => reject(r.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1">Reject</button>
                    {r.is_approved && (
                      <button onClick={() => toggleFeature(r.id)} className={`text-xs px-2 py-1 ${r.is_featured ? "text-[#E8670A]" : "text-gray-500 hover:text-gray-900"}`}>
                        {r.is_featured ? "★ Featured" : "Feature"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-gray-500 text-xs mt-3">{total} reviews total</p>

      {/* Full Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sm rounded w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-gray-900 font-semibold text-lg">{selectedReview.title}</h3>
              <button onClick={() => setSelectedReview(null)} className="text-gray-500 hover:text-gray-900">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <p className="text-[#E8670A]">{"★".repeat(selectedReview.rating)}{"☆".repeat(5 - selectedReview.rating)}</p>
              <p className="text-gray-500">By <span className="text-gray-900">{selectedReview.customer_name}</span> · {selectedReview.customer_email}</p>
              <p className="text-gray-500">Product: <span className="text-[#E8670A]">{selectedReview.product_name}</span></p>
              <p className="text-gray-500">Date: {formatDate(selectedReview.created_at)}</p>
              {selectedReview.order_id && <Badge variant="green">Verified Purchase</Badge>}
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">{selectedReview.body}</p>
            {selectedReview.images?.length > 0 && (
              <div className="flex gap-2 mb-4">
                {selectedReview.images.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <Image src={url} alt="" width={80} height={80} className="rounded object-cover border border-gray-200" />
                  </a>
                ))}
              </div>
            )}
            <div className="flex gap-2 border-t border-gray-200 pt-4">
              {!selectedReview.is_approved && (
                <Button variant="primary" size="sm" onClick={() => approve(selectedReview.id)}>Approve</Button>
              )}
              <Button variant="outline" size="sm" onClick={() => reject(selectedReview.id)} className="border-red-500 text-red-400 hover:bg-red-500/10">Reject</Button>
              {selectedReview.is_approved && (
                <Button variant="outline" size="sm" onClick={() => toggleFeature(selectedReview.id)}>
                  {selectedReview.is_featured ? "Unfeature" : "Feature"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
