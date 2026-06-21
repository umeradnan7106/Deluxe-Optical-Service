"use client";

import { useEffect, useState, useRef } from "react";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { adminApi } from "@/lib/api";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

interface LensCollectionItem {
  id: number;
  name: string;
  video_url: string;
  description: string | null;
  bullets: string[];
  price_from: number;
  color_dot: string;
  is_active: boolean;
  sort_order: number;
}

const BLANK = {
  name: "",
  video_url: "",
  description: "",
  bullets: [""],
  price_from: 0,
  color_dot: "#C9A84C",
  is_active: true,
  sort_order: 0,
};

export default function LensCollectionPage() {
  const [items, setItems] = useState<LensCollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: LensCollectionItem | null }>({ open: false, editing: null });
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const videoRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.lensCollections.list();
      setItems(res.data as LensCollectionItem[]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setForm({ ...BLANK, sort_order: items.length });
    setModal({ open: true, editing: null });
  }

  function openEdit(item: LensCollectionItem) {
    setForm({
      name: item.name,
      video_url: item.video_url,
      description: item.description ?? "",
      bullets: item.bullets.length > 0 ? item.bullets : [""],
      price_from: item.price_from,
      color_dot: item.color_dot,
      is_active: item.is_active,
      sort_order: item.sort_order,
    });
    setModal({ open: true, editing: item });
  }

  async function handleVideoUpload(file: File) {
    setUploading(true);
    try {
      const res = await adminApi.lensCollections.uploadVideo(file);
      setForm((f) => ({ ...f, video_url: res.data.url }));
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        description: form.description || null,
        bullets: form.bullets.filter((b) => b.trim()),
      };
      if (modal.editing) {
        await adminApi.lensCollections.update(modal.editing.id, payload);
      } else {
        await adminApi.lensCollections.create(payload);
      }
      setModal({ open: false, editing: null });
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this lens collection?")) return;
    await adminApi.lensCollections.delete(id);
    await load();
  }

  async function move(idx: number, dir: -1 | 1) {
    const updated = [...items];
    const to = idx + dir;
    if (to < 0 || to >= updated.length) return;
    [updated[idx].sort_order, updated[to].sort_order] = [updated[to].sort_order, updated[idx].sort_order];
    [updated[idx], updated[to]] = [updated[to], updated[idx]];
    setItems(updated);
  }

  function setBullet(i: number, val: string) {
    setForm((f) => {
      const bullets = [...f.bullets];
      bullets[i] = val;
      return { ...f, bullets };
    });
  }

  function addBullet() {
    setForm((f) => ({ ...f, bullets: [...f.bullets, ""] }));
  }

  function removeBullet(i: number) {
    setForm((f) => ({ ...f, bullets: f.bullets.filter((_, idx) => idx !== i) }));
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Lens Collections</h1>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <PlusIcon className="w-4 h-4 mr-1.5" />New Collection
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1,2,3].map((i) => <div key={i} className="bg-gray-100 h-14 rounded" />)}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="text-left px-4 py-3 w-10">Order</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Color</th>
                <th className="text-left px-4 py-3">Price From</th>
                <th className="text-left px-4 py-3">Video</th>
                <th className="text-left px-4 py-3">Active</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => move(idx, -1)} disabled={idx === 0} className="text-gray-500 hover:text-gray-900 disabled:opacity-30">
                        <ChevronUpIcon className="w-3 h-3" />
                      </button>
                      <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="text-gray-500 hover:text-gray-900 disabled:opacity-30">
                        <ChevronDownIcon className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{item.name}</td>
                  <td className="px-4 py-3">
                    <div className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: item.color_dot }} />
                  </td>
                  <td className="px-4 py-3 text-[#C9A84C]">{formatPrice(item.price_from)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {item.video_url ? (
                      <span className="text-green-400">Set</span>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-900/40 text-green-400" : "bg-gray-100 text-gray-500"}`}>
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(item)} className="text-gray-500 hover:text-gray-900">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-400">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No lens collections yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 w-full max-w-lg my-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-900 font-semibold">{modal.editing ? "Edit Collection" : "New Collection"}</h2>
              <button onClick={() => setModal({ open: false, editing: null })} className="text-gray-500 hover:text-gray-900">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 text-xs mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-xs mb-1">Video</label>
                <div className="flex gap-2 items-center">
                  <input value={form.video_url} onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
                    placeholder="Video URL or upload below"
                    className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-[#C9A84C]"
                  />
                  <button
                    onClick={() => videoRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-2 bg-white border border-gray-300 rounded text-gray-500 hover:text-gray-900 text-xs transition-colors disabled:opacity-50"
                  >
                    {uploading ? "…" : "Upload"}
                  </button>
                  <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleVideoUpload(f); }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Price From (Rs.)</label>
                  <input type="number" value={form.price_from} onChange={(e) => setForm((f) => ({ ...f, price_from: Number(e.target.value) }))}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Color Dot</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={form.color_dot} onChange={(e) => setForm((f) => ({ ...f, color_dot: e.target.value }))}
                      className="w-10 h-9 rounded cursor-pointer bg-transparent border-0"
                    />
                    <input value={form.color_dot} onChange={(e) => setForm((f) => ({ ...f, color_dot: e.target.value }))}
                      className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-sm font-mono focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-gray-500 text-xs mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-[#C9A84C] resize-none"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-xs mb-1">Bullet Points</label>
                <div className="space-y-2">
                  {form.bullets.map((b, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={b} onChange={(e) => setBullet(i, e.target.value)}
                        className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-[#C9A84C]"
                      />
                      <button onClick={() => removeBullet(i)} className="text-gray-500 hover:text-red-400">
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button onClick={addBullet} className="text-[#C9A84C] text-xs hover:underline">+ Add bullet</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="accent-[#C9A84C]" />
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
