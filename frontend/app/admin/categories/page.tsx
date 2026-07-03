"use client";

import { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const STORAGE_KEY = "admin-custom-categories";

const DEFAULT_CATEGORIES = [
  { icon: "👓", name: "Eyeglasses", slug: "eyeglasses" },
  { icon: "🕶", name: "Sunglasses", slug: "sunglasses" },
  { icon: "💊", name: "Prescription", slug: "prescription" },
  { icon: "💻", name: "Blue Cut", slug: "blue-cut" },
  { icon: "☀️", name: "Transition", slug: "transition" },
  { icon: "👁", name: "Contact Lenses", slug: "contact-lenses" },
  { icon: "🎒", name: "Accessories", slug: "accessories" },
  { icon: "🔥", name: "Sale", slug: "sale" },
];

interface CustomCategory { id: number; name: string; slug: string; showInNavbar: boolean; productCount: number }

const labelCls = "block text-[10px] font-semibold uppercase tracking-[.06em] text-[#64748b] mb-1.5";
const inputCls = "w-full border-[1.5px] border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] bg-white outline-none focus:border-[#1B2B5E] transition-colors";

export default function CategoriesPage() {
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CustomCategory[]) : [];
    } catch {
      return [];
    }
  });
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newNavbar, setNewNavbar] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customCategories));
    } catch {
      // storage full or unavailable — ignore
    }
  }, [customCategories]);

  function handleAdd() {
    if (!newName.trim()) return;
    const slug = newSlug.trim() || newName.toLowerCase().replace(/\s+/g, "-");
    setCustomCategories((prev) => [
      ...prev,
      { id: Date.now(), name: newName.trim(), slug, showInNavbar: newNavbar, productCount: 0 },
    ]);
    setNewName("");
    setNewSlug("");
    setNewNavbar(true);
  }

  function handleDelete(id: number) {
    setCustomCategories((prev) => prev.filter((c) => c.id !== id));
  }

  function toggleNavbar(id: number) {
    setCustomCategories((prev) => prev.map((c) => c.id === id ? { ...c, showInNavbar: !c.showInNavbar } : c));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl md:text-[26px] text-[#1B2B5E] font-bold">Categories</h1>
          <p className="text-[#64748b] text-xs mt-0.5">Manage product categories</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-[#EEF1FA] border-[1.5px] border-[#E2E8F0] rounded-xl p-4 mb-6 text-sm">
        <strong className="text-[#1B2B5E]">📌 How Categories Work: </strong>
        <span className="text-[#64748b]">Default categories are always available. Custom categories appear in the product form and store navbar when enabled. Assign products to categories from the product edit page.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Default Categories */}
        <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
            <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E]">Default Categories</h2>
            <span className="text-[11px] text-[#64748b]">Built-in · cannot delete</span>
          </div>
          <div className="flex flex-col gap-2">
            {DEFAULT_CATEGORIES.map((cat) => (
              <div key={cat.slug} className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                <span className="text-sm font-medium text-[#0F172A]">{cat.icon} {cat.name}</span>
                <span className="bg-[#d1fae5] text-[#065f46] text-[10px] font-bold px-2 py-0.5 rounded">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Categories */}
        <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
          <div className="mb-4 pb-3 border-b border-[#F1F5F9]">
            <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E]">Custom Categories</h2>
            <p className="text-xs text-[#64748b] mt-0.5">Add categories that appear in navbar and product filters</p>
          </div>

          {/* Existing custom categories */}
          <div className="flex flex-col gap-3 mb-5">
            {customCategories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between px-4 py-3 border-[1.5px] border-[#E2E8F0] rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{cat.name}</p>
                  <p className="text-xs text-[#64748b]">{cat.productCount} products assigned · /{cat.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleNavbar(cat.id)}
                    title={cat.showInNavbar ? "In navbar" : "Hidden from navbar"}
                    className={`w-9 h-5 rounded-full transition-colors relative ${cat.showInNavbar ? "bg-[#059669]" : "bg-[#E2E8F0]"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${cat.showInNavbar ? "left-[18px]" : "left-0.5"}`} />
                  </button>
                  <button className="w-8 h-8 border border-[#E2E8F0] rounded-lg flex items-center justify-center text-[#64748b] hover:border-[#1B2B5E] hover:text-[#1B2B5E] transition-colors">
                    <PencilIcon className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 border border-[#E2E8F0] rounded-lg flex items-center justify-center text-[#64748b] hover:border-[#dc2626] hover:text-[#dc2626] transition-colors">
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {customCategories.length === 0 && (
              <p className="text-[#94a3b8] text-sm text-center py-4">No custom categories yet</p>
            )}
          </div>

          {/* Add new */}
          <div className="bg-[#F8FAFC] border-[1.5px] border-dashed border-[#E2E8F0] rounded-xl p-4">
            <p className="text-[11px] font-bold uppercase tracking-[.08em] text-[#64748b] mb-3">Add New Category</p>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Category Name *</label>
                <input value={newName} onChange={(e) => {
                  setNewName(e.target.value);
                  setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                }} className={inputCls} placeholder="e.g. Kids Glasses" />
              </div>
              <div>
                <label className={labelCls}>Slug (auto-generated)</label>
                <input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} className={inputCls} placeholder="kids-glasses" />
              </div>
              <div>
                <label className={labelCls}>Show in Navbar?</label>
                <select value={newNavbar ? "yes" : "no"} onChange={(e) => setNewNavbar(e.target.value === "yes")} className={inputCls}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <button
                onClick={handleAdd}
                disabled={!newName.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1B2B5E] hover:bg-[#243570] text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />Add Category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
