"use client";

import { useEffect, useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { adminApi } from "@/lib/api";
import Button from "@/components/ui/Button";

interface SubOption {
  name: string;
  price: number;
}

interface LensOption {
  id: number;
  name: string;
  type: "lens-type" | "coating";
  sub_type: string | null;
  price: number;
  description: string | null;
  sub_options: SubOption[] | null;
  is_active: boolean;
  sort_order: number;
}

const BLANK_FORM = { name: "", type: "lens-type" as LensOption["type"], sub_type: "", price: 0, description: "", is_active: true, sort_order: 0 };

const TABS: { key: LensOption["type"]; label: string }[] = [
  { key: "lens-type", label: "Lens Types" },
  { key: "coating", label: "Coatings" },
];

export default function LensOptionsPage() {
  const [options, setOptions] = useState<LensOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<LensOption["type"]>("lens-type");
  const [modal, setModal] = useState<{ open: boolean; editing: LensOption | null }>({ open: false, editing: null });
  const [form, setForm] = useState(BLANK_FORM);
  const [subOptions, setSubOptions] = useState<SubOption[]>([]);
  const [hasSubOptions, setHasSubOptions] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.lensOptions.list();
      const all = (res.data as LensOption[]).filter((o) => o.type !== "addon" as string);
      setOptions(all);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = options.filter((o) => o.type === tab);

  function openCreate() {
    setForm({ ...BLANK_FORM, type: tab, sort_order: filtered.length });
    setSubOptions([]);
    setHasSubOptions(false);
    setModal({ open: true, editing: null });
  }

  function openEdit(o: LensOption) {
    setForm({ name: o.name, type: o.type, sub_type: o.sub_type ?? "", price: o.price, description: o.description ?? "", is_active: o.is_active, sort_order: o.sort_order });
    const subs = o.sub_options ?? [];
    setSubOptions(subs);
    setHasSubOptions(subs.length > 0);
    setModal({ open: true, editing: o });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        sub_type: form.sub_type || null,
        description: form.description || null,
        sub_options: hasSubOptions && subOptions.length > 0 ? JSON.stringify(subOptions) : null,
      };
      if (modal.editing) {
        await adminApi.lensOptions.update(modal.editing.id, payload);
      } else {
        await adminApi.lensOptions.create(payload);
      }
      setModal({ open: false, editing: null });
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this lens option?")) return;
    await adminApi.lensOptions.delete(id);
    await load();
  }

  async function move(idx: number, dir: -1 | 1) {
    const all = [...options];
    const tabItems = filtered.map((o) => all.findIndex((x) => x.id === o.id));
    const fromGlobalIdx = tabItems[idx];
    const toGlobalIdx = tabItems[idx + dir];
    if (toGlobalIdx === undefined || toGlobalIdx === -1) return;
    [all[fromGlobalIdx].sort_order, all[toGlobalIdx].sort_order] = [all[toGlobalIdx].sort_order, all[fromGlobalIdx].sort_order];
    setOptions([...all]);
    await adminApi.lensOptions.reorder(all.map((o) => ({ id: o.id, sort_order: o.sort_order })));
  }

  function fld(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm((f) => ({ ...f, [target.name]: value }));
  }

  function addSubOption() {
    setSubOptions((prev) => [...prev, { name: "", price: 0 }]);
  }

  function updateSubOption(idx: number, field: keyof SubOption, value: string | number) {
    setSubOptions((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  }

  function removeSubOption(idx: number) {
    setSubOptions((prev) => prev.filter((_, i) => i !== idx));
  }

  const inputCls = "w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-[#E8670A]";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Lens Options</h1>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <PlusIcon className="w-4 h-4 mr-1.5" />New Option
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white border border-gray-200 shadow-sm rounded-lg p-1 w-fit">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${tab === key ? "bg-[#E8670A] text-white" : "text-gray-500 hover:text-gray-900"}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="bg-gray-100 h-12 rounded" />)}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="text-left px-4 py-3 w-10">Order</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Description</th>
                <th className="text-left px-4 py-3">Sub-options</th>
                <th className="text-left px-4 py-3">Active</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, idx) => (
                <tr key={o.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => move(idx, -1)} disabled={idx === 0} className="text-gray-500 hover:text-gray-900 disabled:opacity-30">
                        <ChevronUpIcon className="w-3 h-3" />
                      </button>
                      <button onClick={() => move(idx, 1)} disabled={idx === filtered.length - 1} className="text-gray-500 hover:text-gray-900 disabled:opacity-30">
                        <ChevronDownIcon className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{o.name}</td>
                  <td className="px-4 py-3 text-[#E8670A] font-medium">Rs. {o.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-xs">
                    <p className="line-clamp-1">{o.description || "—"}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {o.sub_options?.length ? `${o.sub_options.length} sub-option${o.sub_options.length !== 1 ? "s" : ""}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${o.is_active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      {o.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(o)} className="text-gray-500 hover:text-gray-900">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(o.id)} className="text-gray-500 hover:text-red-400">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No {tab} options yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-900 font-semibold">{modal.editing ? "Edit Lens Option" : "New Lens Option"}</h2>
              <button onClick={() => setModal({ open: false, editing: null })} className="text-gray-500 hover:text-gray-900">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 text-xs mb-1">Name</label>
                <input name="name" value={form.name} onChange={fld} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Type</label>
                  <select name="type" value={form.type} onChange={fld} className={inputCls}>
                    <option value="lens-type">Lens Type</option>
                    <option value="coating">Coating</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Price (Rs.)</label>
                  <input name="price" type="number" value={form.price} onChange={fld} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-gray-500 text-xs mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={fld} rows={3}
                  className={inputCls + " resize-none"} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Sort Order</label>
                  <input name="sort_order" type="number" value={form.sort_order} onChange={fld} className={inputCls} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={fld} className="accent-[#E8670A]" />
                <span className="text-gray-700 text-sm">Active</span>
              </label>

              {/* Sub-options section */}
              <div className="border-t border-gray-200 pt-4">
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input type="checkbox" checked={hasSubOptions} onChange={(e) => setHasSubOptions(e.target.checked)} className="accent-[#E8670A]" />
                  <span className="text-gray-700 text-sm font-medium">Has sub-options (e.g. progressive variants)</span>
                </label>

                {hasSubOptions && (
                  <div>
                    <table className="w-full text-xs mb-2">
                      <thead>
                        <tr className="text-gray-500 border-b border-gray-200">
                          <th className="text-left pb-1.5 pr-2">Sub-option Name</th>
                          <th className="text-left pb-1.5 pr-2">Price (Rs.)</th>
                          <th className="w-6 pb-1.5"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {subOptions.map((s, idx) => (
                          <tr key={idx} className="border-b border-gray-100">
                            <td className="py-1.5 pr-2">
                              <input value={s.name} onChange={(e) => updateSubOption(idx, "name", e.target.value)}
                                className="w-full border border-gray-200 rounded px-2 py-1 text-gray-900 text-xs focus:outline-none focus:border-[#E8670A]"
                                placeholder="e.g. Single Vision" />
                            </td>
                            <td className="py-1.5 pr-2">
                              <input type="number" value={s.price} min={0} onChange={(e) => updateSubOption(idx, "price", parseFloat(e.target.value) || 0)}
                                className="w-full border border-gray-200 rounded px-2 py-1 text-gray-900 text-xs focus:outline-none focus:border-[#E8670A]" />
                            </td>
                            <td className="py-1.5">
                              <button onClick={() => removeSubOption(idx)} className="text-gray-400 hover:text-red-400">
                                <XMarkIcon className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button onClick={addSubOption}
                      className="flex items-center gap-1 text-[#E8670A] text-xs hover:text-orange-400 transition-colors">
                      <PlusIcon className="w-3.5 h-3.5" />
                      Add sub-option
                    </button>
                  </div>
                )}
              </div>
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
