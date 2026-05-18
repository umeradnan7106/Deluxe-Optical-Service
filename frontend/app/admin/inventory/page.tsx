"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import Badge from "@/components/ui/Badge";

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

  async function load() {
    setLoading(true);
    try {
      const params = filter !== "all" ? { status_filter: filter } : {};
      const { data } = await adminApi.products.list(params);
      // use inventory endpoint
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/inventory?${new URLSearchParams(params as Record<string, string>)}`, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth-storage") || "{}").state?.accessToken}` },
      });
      const inv = await res.json();
      setItems(inv.items);
    } catch {
      // ignore
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

  return (
    <div>
      <h1 className="font-['Cormorant_Garamond'] text-3xl text-gray-900 font-semibold mb-6">Inventory</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { value: "all", label: "All" },
          { value: "low_stock", label: "Low Stock" },
          { value: "out_of_stock", label: "Out of Stock" },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded text-sm transition-colors ${
              filter === value ? "bg-[#E8670A] text-white" : "bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-gray-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 text-left">
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
                  {Array.from({ length: 5 }, (_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
                </tr>
              ))
            ) : items.map((item) => (
              <tr key={item.variant_id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">{item.product_name}</td>
                <td className="px-4 py-3 text-gray-700">{item.color_name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{item.sku_variant || item.sku}</td>
                <td className="px-4 py-3">
                  {editingId === item.variant_id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="w-20 bg-white border border-[#E8670A] text-gray-900 text-sm px-2 py-1 rounded"
                        autoFocus
                      />
                      <button onClick={() => saveStock(item.variant_id)} className="text-green-400 text-xs hover:text-green-300">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-500 text-xs hover:text-gray-900">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingId(item.variant_id); setEditStock(String(item.stock)); }}
                      className="text-gray-900 hover:text-[#E8670A] transition-colors font-mono"
                    >
                      {item.stock}
                    </button>
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
    </div>
  );
}
