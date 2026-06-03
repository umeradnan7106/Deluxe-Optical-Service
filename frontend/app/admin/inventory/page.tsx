"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface InventoryItem {
  variant_id: number;
  product_name: string;
  sku: string;
  sku_variant: string | null;
  color_name: string;
  size_label: string | null;
  stock: number;
  low_stock_threshold: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

const STATUS_LABELS = { in_stock: "In Stock", low_stock: "Low Stock", out_of_stock: "Out of Stock" };
const STATUS_COLORS: Record<string, "green" | "orange" | "red"> = {
  in_stock: "green", low_stock: "orange", out_of_stock: "red",
};

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStock, setEditStock] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkStock, setBulkStock] = useState("");
  const [bulkSaving, setBulkSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const params = filter !== "all" ? { status_filter: filter } : {};
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/inventory?${new URLSearchParams(params as Record<string, string>)}`, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth-storage") || "{}").state?.accessToken}` },
      });
      const inv = await res.json();
      setItems(inv.items);
      setSelected(new Set());
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function saveStock(variantId: number) {
    await adminApi.variants.update(variantId, { stock: Number(editStock) });
    setEditingId(null);
    load();
  }

  function toggleSelect(variantId: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(variantId)) next.delete(variantId); else next.add(variantId);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((i) => i.variant_id)));
    }
  }

  async function handleBulkUpdate() {
    const newStock = Number(bulkStock);
    if (isNaN(newStock) || newStock < 0) return;
    setBulkSaving(true);
    try {
      await Promise.all(Array.from(selected).map((id) => adminApi.variants.update(id, { stock: newStock })));
      setBulkModalOpen(false);
      setBulkStock("");
      load();
    } catch {
      //
    } finally {
      setBulkSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl text-gray-900 font-semibold">Inventory</h1>
        {selected.size > 0 && (
          <Button variant="primary" size="sm" onClick={() => setBulkModalOpen(true)}>
            Update Selected ({selected.size})
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-none pb-1">
        {[
          { value: "all", label: "All" },
          { value: "low_stock", label: "Low Stock" },
          { value: "out_of_stock", label: "Out of Stock" },
        ].map(({ value, label }) => (
          <button key={value} onClick={() => setFilter(value)}
            className={`shrink-0 px-4 py-2 rounded text-sm transition-colors ${filter === value ? "bg-[#E8670A] text-white" : "bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-gray-900"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2 mb-4">
        {loading ? Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 animate-pulse">
            <div className="h-4 bg-gray-100 rounded mb-2 w-2/3" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        )) : items.map((item) => (
          <div key={item.variant_id} className={`bg-white border rounded-lg p-3 ${selected.has(item.variant_id) ? "border-[#E8670A] bg-orange-50" : "border-gray-200"}`}>
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <input type="checkbox" checked={selected.has(item.variant_id)}
                  onChange={() => toggleSelect(item.variant_id)} className="accent-[#E8670A] shrink-0" />
                <div className="min-w-0">
                  <p className="text-gray-900 font-medium text-sm truncate">{item.product_name}</p>
                  <p className="text-gray-500 text-xs">{item.color_name}{item.size_label ? ` · ${item.size_label}` : ""}</p>
                </div>
              </div>
              <Badge variant={STATUS_COLORS[item.status]}>{STATUS_LABELS[item.status]}</Badge>
            </div>
            <p className="text-gray-400 font-mono text-xs mb-2">{item.sku_variant || item.sku}</p>
            {editingId === item.variant_id ? (
              <div className="flex gap-2 items-center">
                <input type="number" value={editStock} onChange={(e) => setEditStock(e.target.value)}
                  className="flex-1 bg-white border border-[#E8670A] text-gray-900 text-[16px] px-3 py-2 rounded min-h-[44px]" autoFocus />
                <button onClick={() => saveStock(item.variant_id)}
                  className="px-4 py-2 bg-green-500 text-white text-sm rounded min-h-[44px]">Save</button>
                <button onClick={() => setEditingId(null)}
                  className="px-3 py-2 border border-gray-200 text-gray-500 text-sm rounded min-h-[44px]">✕</button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-gray-900">{item.stock}</span>
                <button onClick={() => { setEditingId(item.variant_id); setEditStock(String(item.stock)); }}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded text-sm text-gray-600 hover:border-[#E8670A] hover:text-[#E8670A] min-h-[44px]">
                  <PencilSquareIcon className="w-4 h-4" />
                  Edit Stock
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white border border-gray-200 shadow-sm rounded overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 text-left">
              <th className="px-4 py-3 w-8">
                <input type="checkbox" checked={items.length > 0 && selected.size === items.length}
                  onChange={toggleAll} className="accent-[#E8670A]" />
              </th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Color</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }, (_, i) => (
                <tr key={i} className="border-b border-gray-200">
                  {Array.from({ length: 6 }, (_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
                </tr>
              ))
            ) : items.map((item) => (
              <tr key={item.variant_id} className={`border-b border-gray-200 hover:bg-gray-50 ${selected.has(item.variant_id) ? "bg-orange-50" : ""}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.has(item.variant_id)}
                    onChange={() => toggleSelect(item.variant_id)} className="accent-[#E8670A]" />
                </td>
                <td className="px-4 py-3 text-gray-900">{item.product_name}</td>
                <td className="px-4 py-3 text-gray-700">{item.color_name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{item.sku_variant || item.sku}</td>
                <td className="px-4 py-3">
                  {editingId === item.variant_id ? (
                    <div className="flex gap-2 items-center">
                      <input type="number" value={editStock} onChange={(e) => setEditStock(e.target.value)}
                        className="w-20 bg-white border border-[#E8670A] text-gray-900 text-sm px-2 py-1 rounded" autoFocus />
                      <button onClick={() => saveStock(item.variant_id)} className="text-green-500 text-xs hover:text-green-400">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-500 text-xs hover:text-gray-900">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gray-900">{item.stock}</span>
                      <button onClick={() => { setEditingId(item.variant_id); setEditStock(String(item.stock)); }}
                        className="text-gray-400 hover:text-[#E8670A] transition-colors">
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_COLORS[item.status]}>{STATUS_LABELS[item.status]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk update modal */}
      {bulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50">
          <div className="bg-white rounded-t-2xl md:rounded-xl shadow-2xl p-6 w-full md:max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 font-semibold">Bulk Update Stock</h2>
              <button onClick={() => setBulkModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Set stock to the same value for {selected.size} selected item{selected.size !== 1 ? "s" : ""}.
            </p>
            <div className="mb-4">
              <label className="text-gray-700 text-xs font-medium block mb-1">New Stock Value</label>
              <input type="number" value={bulkStock} onChange={(e) => setBulkStock(e.target.value)} min={0}
                className="w-full bg-white border border-gray-300 text-gray-900 text-[16px] md:text-sm px-3 py-2 rounded outline-none focus:border-[#E8670A] min-h-[44px]"
                placeholder="e.g. 50" autoFocus />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="primary" size="md" fullWidth onClick={handleBulkUpdate} disabled={bulkSaving || !bulkStock}>
                {bulkSaving ? "Saving…" : "Update"}
              </Button>
              <Button variant="outline" size="md" fullWidth onClick={() => setBulkModalOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
