"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { adminApi } from "@/lib/api";
import type { ProductListItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { PlusIcon, PencilSquareIcon, TrashIcon, PhotoIcon } from "@heroicons/react/24/outline";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  async function load() {
    setLoading(true);
    try {
      const { data } = await adminApi.products.list({ page, per_page: 20, search: search || undefined });
      setProducts(data.items);
      setTotal(data.total);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [page, search]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete(id: number) {
    if (!confirm("Deactivate this product?")) return;
    await adminApi.products.delete(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl text-gray-900 font-semibold">Products</h1>
        <Link href="/admin/products/new">
          <Button variant="primary" size="md">
            <PlusIcon className="w-4 h-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or SKU…"
          className="flex-1 bg-white border border-gray-300 text-gray-900 text-sm px-3 py-2 rounded-[5px] outline-none focus:border-[#E8670A]"
        />
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2 mb-2">
        {loading ? Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 flex gap-3 animate-pulse">
            <div className="w-12 h-12 bg-gray-100 rounded shrink-0" />
            <div className="flex-1"><div className="h-4 bg-gray-100 rounded mb-1 w-3/4" /><div className="h-3 bg-gray-100 rounded w-1/2" /></div>
          </div>
        )) : products.map((p) => (
          <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0 relative">
              {p.thumbnail_url ? (
                <Image src={p.thumbnail_url} alt={p.name} fill className="object-cover" sizes="48px" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <PhotoIcon className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <div className="min-w-0 mr-2">
                  <p className="text-gray-900 font-medium text-sm truncate">{p.name}</p>
                  <p className="text-gray-400 text-xs font-mono">{p.sku}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Link href={`/admin/products/${p.id}/edit`}
                    className="p-1.5 text-gray-500 hover:text-gray-900 border border-gray-200 rounded min-w-[36px] min-h-[36px] flex items-center justify-center">
                    <PencilSquareIcon className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(p.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 border border-red-200 rounded min-w-[36px] min-h-[36px] flex items-center justify-center">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500 capitalize">{p.category}</span>
                <span className="text-[#E8670A] text-sm font-medium">{formatPrice(p.sale_price ?? p.base_price)}</span>
                {p.is_featured && <Badge variant="orange">Featured</Badge>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white border border-gray-200 shadow-sm rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 text-left">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }, (_, i) => (
                <tr key={i} className="border-b border-gray-200">
                  {Array.from({ length: 6 }, (_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
                </tr>
              ))
            ) : products.map((p) => (
              <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-900 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.sku}</td>
                <td className="px-4 py-3 text-gray-700 capitalize">{p.category}</td>
                <td className="px-4 py-3">
                  <span className="text-[#E8670A]">{formatPrice(p.sale_price ?? p.base_price)}</span>
                  {p.sale_price && <span className="text-gray-500 line-through ml-2 text-xs">{formatPrice(p.base_price)}</span>}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={p.is_featured ? "orange" : "gray"}>{p.is_featured ? "Featured" : "Normal"}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${p.id}/edit`}>
                      <Button variant="outline" size="sm"><PencilSquareIcon className="w-4 h-4" /></Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(p.id)} className="border-red-500 text-red-400 hover:bg-red-500/10">
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-gray-500 text-xs mt-3">{total} products total</p>
    </div>
  );
}
