"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { productsApi } from "@/lib/api";
import type { ProductListItem, PaginatedResponse } from "@/types";
import { PRODUCT_CATEGORIES, PRODUCT_GENDERS } from "@/lib/constants";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";
import { AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const FRAME_SHAPES = ["round", "square", "oval", "cat-eye", "aviator", "wayfarer", "rectangle"];
const RIM_TYPES = ["full-rim", "half-rim", "rimless"];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<PaginatedResponse<ProductListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter state
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [categories, setCategories] = useState<string[]>(
    searchParams.getAll("category")
  );
  const [genders, setGenders] = useState<string[]>(searchParams.getAll("gender"));
  const [frameShapes, setFrameShapes] = useState<string[]>([]);
  const [rimTypes, setRimTypes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean | undefined> = {
        sort,
        page,
        per_page: 20,
        q: searchParams.get("q") || undefined,
      };
      if (categories.length === 1) params.category = categories[0];
      if (genders.length === 1) params.gender = genders[0];
      if (frameShapes.length === 1) params.frame_shape = frameShapes[0];
      if (rimTypes.length === 1) params.rim_type = rimTypes[0];
      if (minPrice) params.min_price = Number(minPrice);
      if (maxPrice) params.max_price = Number(maxPrice);
      if (searchParams.get("sale") === "true") params.sale = true;
      if (searchParams.get("is_featured") === "true") params.is_featured = true;

      const { data: res } = await productsApi.list(params);
      setData(res);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [sort, page, categories, genders, frameShapes, rimTypes, minPrice, maxPrice, searchParams]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  function toggleFilter(arr: string[], val: string, set: (v: string[]) => void) {
    set(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
    setPage(1);
  }

  function clearAll() {
    setCategories([]); setGenders([]); setFrameShapes([]); setRimTypes([]);
    setMinPrice(""); setMaxPrice(""); setSort("newest"); setPage(1);
  }

  const hasFilters = categories.length || genders.length || frameShapes.length || rimTypes.length || minPrice || maxPrice;

  const Sidebar = () => (
    <aside className="w-full md:w-[220px] shrink-0 space-y-6 text-sm">
      {/* Sort */}
      <div>
        <h3 className="text-white font-semibold mb-2">Sort By</h3>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white px-3 py-2 rounded text-sm"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-white font-semibold mb-2">Category</h3>
        {PRODUCT_CATEGORIES.map(({ value, label }) => (
          <label key={value} className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer mb-1">
            <input
              type="checkbox"
              checked={categories.includes(value)}
              onChange={() => toggleFilter(categories, value, setCategories)}
              className="accent-[#E8670A]"
            />
            {label}
          </label>
        ))}
      </div>

      {/* Gender */}
      <div>
        <h3 className="text-white font-semibold mb-2">Gender</h3>
        {PRODUCT_GENDERS.map(({ value, label }) => (
          <label key={value} className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer mb-1">
            <input
              type="checkbox"
              checked={genders.includes(value)}
              onChange={() => toggleFilter(genders, value, setGenders)}
              className="accent-[#E8670A]"
            />
            {label}
          </label>
        ))}
      </div>

      {/* Frame Shape */}
      <div>
        <h3 className="text-white font-semibold mb-2">Frame Shape</h3>
        {FRAME_SHAPES.map((s) => (
          <label key={s} className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer mb-1 capitalize">
            <input
              type="checkbox"
              checked={frameShapes.includes(s)}
              onChange={() => toggleFilter(frameShapes, s, setFrameShapes)}
              className="accent-[#E8670A]"
            />
            {s}
          </label>
        ))}
      </div>

      {/* Rim Type */}
      <div>
        <h3 className="text-white font-semibold mb-2">Rim Type</h3>
        {RIM_TYPES.map((r) => (
          <label key={r} className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer mb-1 capitalize">
            <input
              type="checkbox"
              checked={rimTypes.includes(r)}
              onChange={() => toggleFilter(rimTypes, r, setRimTypes)}
              className="accent-[#E8670A]"
            />
            {r}
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-white font-semibold mb-2">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
            className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white px-2 py-1.5 rounded text-xs"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
            className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white px-2 py-1.5 rounded text-xs"
          />
        </div>
      </div>

      {hasFilters ? (
        <Button variant="outline" size="sm" fullWidth onClick={clearAll}>
          Clear All
        </Button>
      ) : null}
    </aside>
  );

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-8">
      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <h1 className="text-white font-semibold">Products</h1>
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white"
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F0F0F] overflow-y-auto p-6 md:hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-semibold">Filters</h2>
            <button onClick={() => setSidebarOpen(false)} aria-label="Close"><XMarkIcon className="w-6 h-6 text-white" /></button>
          </div>
          <Sidebar />
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">
              {loading ? "Loading…" : `${data?.total ?? 0} products`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="bg-[#1a1a1a] rounded animate-pulse aspect-[3/4]" />
              ))}
            </div>
          ) : data?.items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">No products found</p>
              <Button variant="outline" size="md" className="mt-4" onClick={clearAll}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data?.items.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>

              {/* Pagination */}
              {data && data.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-[#E8670A] text-white"
                          : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
