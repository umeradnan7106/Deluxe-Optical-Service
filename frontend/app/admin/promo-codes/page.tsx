"use client";

import { useEffect, useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { adminApi } from "@/lib/api";
import Button from "@/components/ui/Button";

interface PromoCode {
  id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order: number | null;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
}

const BLANK: Omit<PromoCode, "id" | "used_count"> = {
  code: "",
  discount_type: "percentage",
  discount_value: 0,
  min_order: null,
  max_uses: null,
  is_active: true,
  expires_at: null,
};

export default function PromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: PromoCode | null }>({ open: false, editing: null });
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.promoCodes.list();
      setCodes(res.data as PromoCode[]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setForm(BLANK);
    setModal({ open: true, editing: null });
  }

  function openEdit(pc: PromoCode) {
    setForm({
      code: pc.code,
      discount_type: pc.discount_type,
      discount_value: pc.discount_value,
      min_order: pc.min_order,
      max_uses: pc.max_uses,
      is_active: pc.is_active,
      expires_at: pc.expires_at,
    });
    setModal({ open: true, editing: pc });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = { ...form, code: form.code.toUpperCase() };
      if (modal.editing) {
        await adminApi.promoCodes.update(modal.editing.id, payload);
      } else {
        await adminApi.promoCodes.create(payload);
      }
      setModal({ open: false, editing: null });
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this promo code?")) return;
    await adminApi.promoCodes.delete(id);
    await load();
  }

  function fld(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm((f) => ({ ...f, [target.name]: value }));
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Promo Codes</h1>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <PlusIcon className="w-4 h-4 mr-1.5" />New Code
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1,2,3].map((i) => <div key={i} className="bg-gray-100 h-12 rounded" />)}
        </div>
      ) : (
        <>
          {/* Mobile card list */}
          <div className="md:hidden space-y-2 mb-4">
            {codes.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No promo codes yet.</p>
            ) : codes.map((pc) => (
              <div key={pc.id} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <span className="font-mono font-bold text-gray-900">{pc.code}</span>
                    <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${pc.is_active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      {pc.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEdit(pc)} className="text-gray-500 hover:text-gray-900 p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(pc.id)} className="text-gray-500 hover:text-red-400 p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span>{pc.discount_type === "percentage" ? `${pc.discount_value}% off` : `Rs. ${pc.discount_value} off`}</span>
                  {pc.min_order && <span>Min: Rs. {pc.min_order}</span>}
                  <span>Used: {pc.used_count}/{pc.max_uses ?? "∞"}</span>
                  <span>Expires: {pc.expires_at ? new Date(pc.expires_at).toLocaleDateString("en-PK") : "Never"}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="text-left px-4 py-3">Code</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Value</th>
                  <th className="text-left px-4 py-3">Min Order</th>
                  <th className="text-left px-4 py-3">Used / Max</th>
                  <th className="text-left px-4 py-3">Active</th>
                  <th className="text-left px-4 py-3">Expires</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((pc) => (
                  <tr key={pc.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-900 font-mono font-medium">{pc.code}</td>
                    <td className="px-4 py-3">
                      {pc.discount_type === "percentage"
                        ? <span className="inline-block bg-[#EEF1FA] text-[#1B2B5E] text-[10px] font-bold px-2 py-0.5 rounded">Percentage</span>
                        : <span className="inline-block bg-[#FDF6E3] text-[#A8893A] text-[10px] font-bold px-2 py-0.5 rounded">Fixed Amount</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {pc.discount_type === "percentage" ? `${pc.discount_value}%` : `Rs. ${pc.discount_value}`}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{pc.min_order ? `Rs. ${pc.min_order}` : "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{pc.used_count} / {pc.max_uses ?? "∞"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pc.is_active ? "bg-green-900/40 text-green-400" : "bg-gray-100 text-gray-500"}`}>
                        {pc.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {pc.expires_at ? new Date(pc.expires_at).toLocaleDateString("en-PK") : "Never"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(pc)} className="text-gray-500 hover:text-gray-900">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(pc.id)} className="text-gray-500 hover:text-red-400">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {codes.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No promo codes yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/70 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
          <div className="bg-white border border-gray-200 shadow-sm rounded-t-2xl md:rounded-xl p-6 w-full md:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-900 font-semibold">{modal.editing ? "Edit Promo Code" : "New Promo Code"}</h2>
              <button onClick={() => setModal({ open: false, editing: null })} className="text-gray-500 hover:text-gray-900">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 text-xs mb-1">Code</label>
                <input name="code" value={form.code} onChange={fld}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-[16px] md:text-sm uppercase focus:outline-none focus:border-[#C9A84C] min-h-[44px]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Type</label>
                  <select name="discount_type" value={form.discount_type} onChange={fld}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-[16px] md:text-sm focus:outline-none focus:border-[#C9A84C] min-h-[44px]">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Value</label>
                  <input name="discount_value" type="number" value={form.discount_value} onChange={fld}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-[16px] md:text-sm focus:outline-none focus:border-[#C9A84C] min-h-[44px]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Min Order (Rs.)</label>
                  <input name="min_order" type="number" value={form.min_order ?? ""} onChange={(e) => setForm((f) => ({ ...f, min_order: e.target.value ? Number(e.target.value) : null }))}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-[16px] md:text-sm focus:outline-none focus:border-[#C9A84C] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Max Uses</label>
                  <input name="max_uses" type="number" value={form.max_uses ?? ""} onChange={(e) => setForm((f) => ({ ...f, max_uses: e.target.value ? Number(e.target.value) : null }))}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-[16px] md:text-sm focus:outline-none focus:border-[#C9A84C] min-h-[44px]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-500 text-xs mb-1">Expires At</label>
                <input name="expires_at" type="datetime-local" value={form.expires_at?.slice(0, 16) ?? ""} onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value || null }))}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-[16px] md:text-sm focus:outline-none focus:border-[#C9A84C] min-h-[44px]"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={fld} className="accent-[#C9A84C]" />
                <span className="text-gray-700 text-sm">Active</span>
              </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
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
