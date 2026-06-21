"use client";

import { useEffect, useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { adminApi } from "@/lib/api";
import Button from "@/components/ui/Button";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
}

const BLANK = { question: "", answer: "", category: "general", sort_order: 0, is_active: true };

const CATEGORIES = [
  { key: "orders", label: "Orders & Delivery" },
  { key: "prescription", label: "Prescription & Lenses" },
  { key: "payments", label: "Payments & Returns" },
  { key: "fitting", label: "Frame Fitting" },
  { key: "general", label: "General" },
];

export default function FAQsAdminPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: FAQ | null }>({ open: false, editing: null });
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.faqs.list();
      setFaqs(res.data as FAQ[]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setForm({ ...BLANK, sort_order: faqs.length });
    setModal({ open: true, editing: null });
  }

  function openEdit(faq: FAQ) {
    setForm({ question: faq.question, answer: faq.answer, category: faq.category, sort_order: faq.sort_order, is_active: faq.is_active });
    setModal({ open: true, editing: faq });
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (modal.editing) {
        await adminApi.faqs.update(modal.editing.id, form);
      } else {
        await adminApi.faqs.create(form);
      }
      setModal({ open: false, editing: null });
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this FAQ?")) return;
    await adminApi.faqs.delete(id);
    await load();
  }

  async function move(idx: number, dir: -1 | 1) {
    const updated = [...faqs];
    const target = updated[idx + dir];
    const current = updated[idx];
    if (!target) return;
    [current.sort_order, target.sort_order] = [target.sort_order, current.sort_order];
    [updated[idx], updated[idx + dir]] = [updated[idx + dir], updated[idx]];
    setFaqs(updated);
    await adminApi.faqs.reorder(updated.map((f) => ({ id: f.id, sort_order: f.sort_order })));
  }

  function fld(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm((f) => ({ ...f, [target.name]: value }));
  }

  const [catFilter, setCatFilter] = useState("all");
  const CAT_TABS = [
    { key: "all", label: "All" },
    { key: "orders", label: "Orders" },
    { key: "prescription", label: "Lenses & Prescription" },
    { key: "payments", label: "Payments" },
    { key: "fitting", label: "Frame Sizing" },
  ];
  const filteredFaqs = catFilter === "all" ? faqs : faqs.filter((f) => f.category === catFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-playfair text-2xl md:text-[26px] text-[#1B2B5E] font-bold">FAQs</h1>
          <p className="text-[#64748b] text-xs mt-0.5">Manage store FAQ content</p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <PlusIcon className="w-4 h-4 mr-1.5" />Add FAQ
        </Button>
      </div>

      {/* SEO info banner */}
      <div className="bg-[#FDF6E3] border-[1.5px] border-[rgba(201,168,76,.3)] rounded-xl p-4 mb-5 text-sm">
        <strong className="text-[#1B2B5E]">📊 SEO-Structured FAQs:</strong>{" "}
        <span className="text-[#64748b]">FAQs here are automatically structured as Google FAQ Schema (JSON-LD). This helps your FAQs appear directly in Google search results as expandable rich snippets. Each FAQ must have a clear question + complete answer.</span>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1,2,3].map((i) => <div key={i} className="bg-gray-100 h-14 rounded" />)}
        </div>
      ) : (
        <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F1F5F9]">
            <div className="flex gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-1 overflow-x-auto scrollbar-none">
              {CAT_TABS.map(({ key, label }) => (
                <button key={key} onClick={() => setCatFilter(key)}
                  className={`shrink-0 px-3 py-1.5 rounded text-xs font-medium transition-colors ${catFilter === key ? "bg-white text-[#1B2B5E] shadow-sm" : "text-[#64748b] hover:text-[#1B2B5E]"}`}>
                  {label}{key === "all" ? ` (${faqs.length})` : ""}
                </button>
              ))}
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] text-[#64748b] uppercase text-[10px]">
              <tr>
                <th className="text-left px-4 py-3 w-10 tracking-wide font-semibold">⠿</th>
                <th className="text-left px-4 py-3 tracking-wide font-semibold">Question</th>
                <th className="text-left px-4 py-3 tracking-wide font-semibold">Category</th>
                <th className="text-left px-4 py-3 tracking-wide font-semibold">Active</th>
                <th className="text-left px-4 py-3 tracking-wide font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaqs.map((faq) => {
                const globalIdx = faqs.findIndex((f) => f.id === faq.id);
                return (
                <tr key={faq.id} className="border-t border-[#F1F5F9] hover:bg-[#FAFBFD]">
                  <td className="px-4 py-3 text-[#94a3b8] cursor-grab text-base">⠿</td>
                  <td className="px-4 py-3 text-[#0F172A] max-w-sm">
                    <p className="line-clamp-2 text-sm font-medium">{faq.question}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className="inline-block bg-[#EEF1FA] text-[#1B2B5E] px-2 py-0.5 rounded font-semibold text-[10px] capitalize">{faq.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${faq.is_active ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#f3f4f6] text-[#374151]"}`}>
                      {faq.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => move(globalIdx, -1)} disabled={globalIdx === 0} className="w-7 h-7 border border-[#E2E8F0] rounded flex items-center justify-center text-[#64748b] hover:border-[#1B2B5E] hover:text-[#1B2B5E] disabled:opacity-30 transition-colors">
                        <ChevronUpIcon className="w-3 h-3" />
                      </button>
                      <button onClick={() => move(globalIdx, 1)} disabled={globalIdx === faqs.length - 1} className="w-7 h-7 border border-[#E2E8F0] rounded flex items-center justify-center text-[#64748b] hover:border-[#1B2B5E] hover:text-[#1B2B5E] disabled:opacity-30 transition-colors">
                        <ChevronDownIcon className="w-3 h-3" />
                      </button>
                      <button onClick={() => openEdit(faq)} className="w-7 h-7 border border-[#E2E8F0] rounded flex items-center justify-center text-[#64748b] hover:border-[#1B2B5E] hover:text-[#1B2B5E] transition-colors">
                        <PencilIcon className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(faq.id)} className="w-7 h-7 border border-[#E2E8F0] rounded flex items-center justify-center text-[#64748b] hover:border-[#dc2626] hover:text-[#dc2626] transition-colors">
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );})}
              {filteredFaqs.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[#64748b]">{catFilter === "all" ? "No FAQs yet." : "No FAQs in this category."}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-playfair text-xl font-bold text-[#1B2B5E]">{modal.editing ? "Edit FAQ" : "New FAQ"}</h2>
              <button onClick={() => setModal({ open: false, editing: null })} className="text-gray-500 hover:text-gray-900">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 text-xs mb-1">Question</label>
                <input name="question" value={form.question} onChange={fld}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-xs mb-1">Answer</label>
                <textarea name="answer" value={form.answer} onChange={fld} rows={4}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-[#C9A84C] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Category</label>
                  <select name="category" value={form.category} onChange={fld}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-[#C9A84C]">
                    {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Sort Order</label>
                  <input name="sort_order" type="number" value={form.sort_order} onChange={fld}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={fld} className="accent-[#C9A84C]" />
                <span className="text-gray-700 text-sm">Active</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="primary" size="md" fullWidth onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
              <Button variant="outline" size="md" fullWidth onClick={() => setModal({ open: false, editing: null })}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
