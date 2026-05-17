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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">FAQs</h1>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <PlusIcon className="w-4 h-4 mr-1.5" />New FAQ
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1,2,3].map((i) => <div key={i} className="bg-[#1a1a1a] h-14 rounded" />)}
        </div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#2a2a2a]">
          <table className="w-full text-sm">
            <thead className="bg-[#252525] text-gray-400 uppercase text-xs">
              <tr>
                <th className="text-left px-4 py-3 w-10">Order</th>
                <th className="text-left px-4 py-3">Question</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Active</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq, idx) => (
                <tr key={faq.id} className="border-t border-[#2a2a2a] hover:bg-[#252525]">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => move(idx, -1)} disabled={idx === 0} className="text-gray-500 hover:text-white disabled:opacity-30">
                        <ChevronUpIcon className="w-3 h-3" />
                      </button>
                      <button onClick={() => move(idx, 1)} disabled={idx === faqs.length - 1} className="text-gray-500 hover:text-white disabled:opacity-30">
                        <ChevronDownIcon className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white max-w-sm">
                    <p className="line-clamp-2 text-sm">{faq.question}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-400 capitalize text-xs">{faq.category}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${faq.is_active ? "bg-green-900/40 text-green-400" : "bg-gray-700 text-gray-400"}`}>
                      {faq.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(faq)} className="text-gray-400 hover:text-white">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(faq.id)} className="text-gray-400 hover:text-red-400">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {faqs.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No FAQs yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-lg border border-[#2a2a2a]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">{modal.editing ? "Edit FAQ" : "New FAQ"}</h2>
              <button onClick={() => setModal({ open: false, editing: null })} className="text-gray-400 hover:text-white">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs mb-1">Question</label>
                <input name="question" value={form.question} onChange={fld}
                  className="w-full bg-[#252525] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E8670A]"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">Answer</label>
                <textarea name="answer" value={form.answer} onChange={fld} rows={4}
                  className="w-full bg-[#252525] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E8670A] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Category</label>
                  <select name="category" value={form.category} onChange={fld}
                    className="w-full bg-[#252525] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E8670A]">
                    {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Sort Order</label>
                  <input name="sort_order" type="number" value={form.sort_order} onChange={fld}
                    className="w-full bg-[#252525] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E8670A]"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={fld} className="accent-[#E8670A]" />
                <span className="text-gray-300 text-sm">Active</span>
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
