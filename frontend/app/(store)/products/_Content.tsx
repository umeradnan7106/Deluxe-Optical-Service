"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { productsApi } from "@/lib/api";
import type { ProductListItem, PaginatedResponse } from "@/types";
import { PRODUCT_CATEGORIES, PRODUCT_GENDERS } from "@/lib/constants";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";
import { AdjustmentsHorizontalIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

const FRAME_SHAPES = ["Round", "Square", "Oval", "Cat-Eye", "Aviator", "Wayfarer"];
const MATERIALS = ["Acetate", "Metal", "Titanium", "Plastic"];

function FilterCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-lg p-4">
      <h3 className="text-[#1B2B5E] font-semibold text-sm mb-3">{title}</h3>
      {children}
    </div>
  );
}

function CheckboxFilter({ label, checked, onChange }: {
  value: string; label: string; checked: boolean; onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 text-[#64748b] hover:text-[#1B2B5E] cursor-pointer mb-2 text-[13px] min-h-[32px]">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-[#C9A84C] w-4 h-4" />
      {label}
    </label>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<PaginatedResponse<ProductListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [categories, setCategories] = useState<string[]>(searchParams.getAll("category"));
  const [genders, setGenders] = useState<string[]>(searchParams.getAll("gender"));
  const [frameShapes, setFrameShapes] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean | undefined> = {
        sort, page, per_page: 20,
        q: searchParams.get("q") || undefined,
      };
      if (categories.length === 1) params.category = categories[0];
      if (genders.length === 1) params.gender = genders[0];
      if (frameShapes.length === 1) params.frame_shape = frameShapes[0].toLowerCase().replace(" ", "-");
      if (materials.length === 1) params.material = materials[0].toLowerCase();
      if (minPrice) params.min_price = Number(minPrice);
      if (maxPrice) params.max_price = Number(maxPrice);
      if (searchParams.get("sale") === "true") params.sale = true;
      if (searchParams.get("is_featured") === "true") params.is_featured = true;

      const { data: res } = await productsApi.list(params);
      setData(res);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, [sort, page, categories, genders, frameShapes, materials, minPrice, maxPrice, searchParams]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Lock body scroll when sheet open
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sheetOpen]);

  function toggleFilter(arr: string[], val: string, set: (v: string[]) => void) {
    set(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
    setPage(1);
  }

  function clearAll() {
    setCategories([]); setGenders([]); setFrameShapes([]); setMaterials([]);
    setMinPrice(""); setMaxPrice(""); setSort("newest"); setPage(1);
  }

  const activeFilterCount = categories.length + genders.length + frameShapes.length + materials.length
    + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  const activeFilterTags = [
    ...categories.map((v) => ({ label: v, clear: () => setCategories(categories.filter((c) => c !== v)) })),
    ...genders.map((v) => ({ label: v, clear: () => setGenders(genders.filter((g) => g !== v)) })),
    ...frameShapes.map((v) => ({ label: v, clear: () => setFrameShapes(frameShapes.filter((f) => f !== v)) })),
    ...materials.map((v) => ({ label: v, clear: () => setMaterials(materials.filter((m) => m !== v)) })),
    ...(minPrice ? [{ label: `Min Rs. ${minPrice}`, clear: () => setMinPrice("") }] : []),
    ...(maxPrice ? [{ label: `Max Rs. ${maxPrice}`, clear: () => setMaxPrice("") }] : []),
  ];

  const FilterContent = () => (
    <div className="space-y-3 text-sm">
      <FilterCard title="Sort By">
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="w-full bg-white border border-[#e5e7eb] text-[#1a1a1a] px-3 py-2 rounded-[5px] text-sm"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </FilterCard>

      <FilterCard title="Category">
        {PRODUCT_CATEGORIES.map(({ value, label }) => (
          <CheckboxFilter key={value} value={value} label={label}
            checked={categories.includes(value)}
            onChange={() => toggleFilter(categories, value, setCategories)}
          />
        ))}
      </FilterCard>

      <FilterCard title="Gender">
        {PRODUCT_GENDERS.map(({ value, label }) => (
          <CheckboxFilter key={value} value={value} label={label}
            checked={genders.includes(value)}
            onChange={() => toggleFilter(genders, value, setGenders)}
          />
        ))}
      </FilterCard>

      <FilterCard title="Frame Shape">
        {FRAME_SHAPES.map((s) => (
          <CheckboxFilter key={s} value={s} label={s}
            checked={frameShapes.includes(s)}
            onChange={() => toggleFilter(frameShapes, s, setFrameShapes)}
          />
        ))}
      </FilterCard>

      <FilterCard title="Material">
        {MATERIALS.map((m) => (
          <CheckboxFilter key={m} value={m} label={m}
            checked={materials.includes(m)}
            onChange={() => toggleFilter(materials, m, setMaterials)}
          />
        ))}
      </FilterCard>

      <FilterCard title="Price Range">
        <div className="flex gap-2">
          <div className="flex-1">
            <p className="text-[#6b7280] text-[10px] mb-1">Min Rs.</p>
            <input type="number" placeholder="0" value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
              className="w-full bg-white border border-[#e5e7eb] text-[#1a1a1a] px-2 py-2 rounded text-xs h-9"
            />
          </div>
          <div className="flex-1">
            <p className="text-[#6b7280] text-[10px] mb-1">Max Rs.</p>
            <input type="number" placeholder="Any" value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
              className="w-full bg-white border border-[#e5e7eb] text-[#1a1a1a] px-2 py-2 rounded text-xs h-9"
            />
          </div>
        </div>
      </FilterCard>

      {activeFilterCount > 0 && (
        <button
          onClick={clearAll}
          className="w-full border border-[#e2e8f0] text-[#64748b] py-2 rounded-[5px] text-sm hover:border-[#1B2B5E] hover:text-[#1B2B5E] transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 md:py-8">

      {/* ── Mobile: top bar with Filters button + Sort pills ── */}
      <div className="md:hidden mb-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-playfair text-2xl text-[#1B2B5E] font-bold">Products</h1>
          <button
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#1B2B5E] min-h-[44px] px-2"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-[#C9A84C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Sort pills — horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SORT_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => { setSort(o.value); setPage(1); }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                sort === o.value
                  ? "bg-[#1B2B5E] text-white border-[#1B2B5E]"
                  : "bg-white text-[#64748b] border-[#e2e8f0]"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Mobile Bottom Sheet ── */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setSheetOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e7eb] shrink-0">
              <button onClick={clearAll} className="text-[#6b7280] text-sm min-h-[44px] pr-2">
                Clear All
              </button>
              <h2 className="text-[#1a1a1a] font-semibold text-sm">Filters</h2>
              <button
                onClick={() => setSheetOpen(false)}
                aria-label="Close filters"
                className="text-[#6b7280] min-h-[44px] pl-2"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable filter list */}
            <div className="flex-1 overflow-y-auto p-4">
              <FilterContent />
            </div>

            {/* Sticky Apply button */}
            <div className="p-4 border-t border-[#e5e7eb] shrink-0">
              <button
                onClick={() => setSheetOpen(false)}
                className="w-full bg-[#1B2B5E] hover:bg-[#243570] text-white py-3 rounded-lg text-sm font-medium min-h-[44px] transition-colors"
              >
                Apply Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Desktop sidebar — 220px fixed */}
        <div className="hidden md:block w-[220px] shrink-0">
          <FilterContent />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="font-playfair text-3xl text-[#1B2B5E] font-bold hidden md:block">
                All Products
              </h1>
              <p className="text-[#64748b] text-sm mt-0.5">
                {loading ? "Loading…" : `${data?.total ?? 0} products found`}
              </p>
            </div>
          </div>

          {/* Active filter tags */}
          {activeFilterTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilterTags.map((tag) => (
                <span key={tag.label} className="inline-flex items-center gap-1 bg-[#EEF1FA] text-[#1B2B5E] text-xs font-medium px-2.5 py-1 rounded-full">
                  {tag.label}
                  <button onClick={tag.clear} className="hover:text-[#C9A84C]">
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="bg-white border border-[#e5e7eb] rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-gray-100" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-4 bg-gray-100 rounded" />
                    <div className="h-8 bg-gray-100 rounded mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.items.length === 0 ? (
            <div className="text-center py-12 text-[#6b7280]">
              <p className="text-lg font-playfair text-[#1B2B5E] mb-2">No products found</p>
              <p className="text-sm mb-4">Try adjusting your filters or search terms.</p>
              <Button variant="outline" size="md" onClick={clearAll}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {data?.items.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>

              {/* Mobile pagination: prev/next only */}
              {data && data.pages > 1 && (
                <div className="flex md:hidden items-center justify-between mt-8 gap-3">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-[5px] bg-gray-100 text-[#1a1a1a] text-sm disabled:opacity-40 min-h-[44px]"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                    Previous
                  </button>
                  <span className="text-[#6b7280] text-sm shrink-0">
                    {page} / {data.pages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === data.pages}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-[5px] bg-gray-100 text-[#1a1a1a] text-sm disabled:opacity-40 min-h-[44px]"
                  >
                    Next
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Desktop pagination: all pages */}
              {data && data.pages > 1 && (
                <div className="hidden md:flex justify-center gap-2 mt-8">
                  {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-[#1B2B5E] text-white"
                          : "bg-[#F5F7FF] text-[#64748b] hover:bg-[#EEF1FA]"
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
