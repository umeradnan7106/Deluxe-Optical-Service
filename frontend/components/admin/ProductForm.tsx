"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { adminApi } from "@/lib/api";
import type { LensOption } from "@/types";
import Button from "@/components/ui/Button";
import { generateSlug } from "@/lib/utils";
import {
  XMarkIcon,
  PlusIcon,
  PhotoIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

// ─── Local Types ────────────────────────────────────────────────────────────

interface VariantRow {
  _key: string;           // local unique key for React
  id?: number;            // existing id (edit mode)
  color_name: string;
  color_hex: string;
  size_label: string;
  lens_width: string;     // lens□bridge-temple lens part
  bridge: string;
  temple: string;
  sku_variant: string;
  price: string;
  stock: string;
  is_active: boolean;
  sku_auto: boolean;      // true = auto-generate SKU from color/size
}

interface ImageRow {
  _key: string;
  id?: number;
  url: string;            // existing URL or local object URL preview
  file?: File;
  public_id?: string;
  toDelete?: boolean;
  variant_key?: string;   // _key of the variant this image belongs to
  color_name?: string;
}

interface ProductFormState {
  name: string;
  sku: string;
  brand: string;
  category: string;
  gender: string;
  frame_shape: string;
  material: string;
  is_prescription_required: boolean;
  base_price: string;
  sale_price: string;
  // Frame specs
  frame_width_mm: string;
  lens_width_mm: string;
  bridge_mm: string;
  temple_mm: string;
  lens_height_mm: string;
  rim_type: string;
  // Sidebar
  is_active: boolean;
  is_featured: boolean;
  slug: string;
  meta_title: string;
  meta_description: string;
}

interface AdminProductData {
  id: number;
  name: string;
  sku: string;
  brand: string | null;
  category: string;
  gender: string;
  frame_shape: string | null;
  material: string | null;
  is_prescription_required: boolean;
  base_price: number;
  sale_price: number | null;
  description: string;
  bullets: string[];
  frame_width_mm: number | null;
  lens_width_mm: number | null;
  bridge_mm: number | null;
  temple_mm: number | null;
  lens_height_mm: number | null;
  rim_type: string | null;
  is_active: boolean;
  is_featured: boolean;
  slug: string;
  meta_title: string | null;
  meta_description: string | null;
  variants: Array<{
    id: number;
    color_name: string;
    color_hex: string | null;
    size_label: string | null;
    sku_variant: string | null;
    price: number | null;
    stock: number;
    is_active: boolean;
    images: Array<{ id: number; url: string; public_id: string | null; sort_order: number }>;
  }>;
  lens_option_ids: number[];
}

interface ProductFormProps {
  productId?: number;
}

// ─── Toolbar Button ──────────────────────────────────────────────────────────

function TbBtn({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`min-w-[36px] min-h-[36px] px-2 py-1 text-xs rounded transition-colors ${active ? "bg-[#E8670A] text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
    >
      {children}
    </button>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded p-4 md:p-5 mb-4">
      <h2 className="text-gray-900 font-semibold mb-4 text-[13px] md:text-sm uppercase tracking-wide">{title}</h2>
      {children}
    </div>
  );
}

// ─── Input ───────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-white border border-gray-300 text-gray-900 text-[16px] md:text-sm px-3 py-2 rounded outline-none focus:border-[#E8670A] transition-colors min-h-[44px]";
const selectCls = inputCls;

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const isEdit = productId !== undefined;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProductFormState>({
    name: "", sku: "", brand: "", category: "eyeglasses", gender: "unisex",
    frame_shape: "", material: "", is_prescription_required: false,
    base_price: "", sale_price: "",
    frame_width_mm: "", lens_width_mm: "", bridge_mm: "", temple_mm: "", lens_height_mm: "",
    rim_type: "full-rim",
    is_active: true, is_featured: false,
    slug: "", meta_title: "", meta_description: "",
  });

  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [lensOptions, setLensOptions] = useState<LensOption[]>([]);
  const [selectedLensIds, setSelectedLensIds] = useState<Set<number>>(new Set());
  const [removedVariantIds, setRemovedVariantIds] = useState<number[]>([]);
  const [newImageVariantKey, setNewImageVariantKey] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugAuto, setSlugAuto] = useState(!isEdit);

  // ─── Tiptap editor ────────────────────────────────────────────────────────

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: { class: "outline-none min-h-[160px] text-gray-900 text-sm" },
    },
  });

  // ─── Load lens options ────────────────────────────────────────────────────

  useEffect(() => {
    adminApi.lensOptions.list()
      .then(({ data }) => setLensOptions(data as LensOption[]))
      .catch(() => {});
  }, []);

  // ─── Load product data in edit mode ──────────────────────────────────────

  useEffect(() => {
    if (!isEdit || !productId) return;
    adminApi.products.detail(productId).then(({ data }) => {
      const p = data as AdminProductData;
      setForm({
        name: p.name,
        sku: p.sku,
        brand: p.brand ?? "",
        category: p.category,
        gender: p.gender,
        frame_shape: p.frame_shape ?? "",
        material: p.material ?? "",
        is_prescription_required: p.is_prescription_required,
        base_price: String(p.base_price),
        sale_price: p.sale_price ? String(p.sale_price) : "",
        frame_width_mm: p.frame_width_mm ? String(p.frame_width_mm) : "",
        lens_width_mm: p.lens_width_mm ? String(p.lens_width_mm) : "",
        bridge_mm: p.bridge_mm ? String(p.bridge_mm) : "",
        temple_mm: p.temple_mm ? String(p.temple_mm) : "",
        lens_height_mm: p.lens_height_mm ? String(p.lens_height_mm) : "",
        rim_type: p.rim_type ?? "full-rim",
        is_active: p.is_active,
        is_featured: p.is_featured,
        slug: p.slug,
        meta_title: p.meta_title ?? "",
        meta_description: p.meta_description ?? "",
      });
      setSlugAuto(false);

      if (editor && p.description) {
        editor.commands.setContent(p.description);
      }

      setVariants(p.variants.map((v, i) => ({
        _key: `existing-${v.id ?? i}`,
        id: v.id,
        color_name: v.color_name,
        color_hex: v.color_hex ?? "#000000",
        size_label: v.size_label ?? "",
        lens_width: p.lens_width_mm ? String(p.lens_width_mm) : "",
        bridge: p.bridge_mm ? String(p.bridge_mm) : "",
        temple: p.temple_mm ? String(p.temple_mm) : "",
        sku_variant: v.sku_variant ?? "",
        price: v.price ? String(v.price) : "",
        stock: String(v.stock),
        is_active: v.is_active,
        sku_auto: false,
      })));

      const allImages: ImageRow[] = [];
      p.variants.forEach((v, vIdx) => {
        v.images.forEach((img) => {
          allImages.push({
            _key: `img-${img.id}`,
            id: img.id,
            url: img.url,
            public_id: img.public_id ?? undefined,
            variant_key: `existing-${v.id ?? vIdx}`,
            color_name: v.color_name,
          });
        });
      });
      setImages(allImages.sort((a, b) => (a.id ?? 0) - (b.id ?? 0)));

      setSelectedLensIds(new Set(p.lens_option_ids));
    }).catch(() => {});
  }, [isEdit, productId, editor]);

  // ─── Auto slug ───────────────────────────────────────────────────────────

  const setField = useCallback(<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && slugAuto) {
        next.slug = generateSlug(String(value));
      }
      return next;
    });
  }, [slugAuto]);

  // ─── Variants ─────────────────────────────────────────────────────────────

  function addVariant() {
    setVariants((v) => [...v, {
      _key: `new-${Date.now()}`, color_name: "", color_hex: "#000000",
      size_label: "", lens_width: "", bridge: "", temple: "",
      sku_variant: "", price: "", stock: "0", is_active: true,
      sku_auto: true,
    }]);
  }

  function updateVariant(key: string, field: keyof VariantRow, value: string | boolean) {
    setVariants((rows) => rows.map((r) => {
      if (r._key !== key) return r;
      const updated = { ...r, [field]: value };
      if (field === "sku_variant") {
        updated.sku_auto = false;
      } else if (updated.sku_auto && (field === "color_name" || field === "size_label")) {
        const colorPart = updated.color_name.slice(0, 3).toUpperCase() || "CLR";
        const sizePart = updated.size_label ? `${updated.size_label.slice(0, 3).toUpperCase()}-` : "";
        updated.sku_variant = [form.sku, `${sizePart}${colorPart}`].filter(Boolean).join("-");
      }
      return updated;
    }));
  }

  function removeVariant(key: string) {
    if (!window.confirm("Remove this variant? This cannot be undone.")) return;
    setVariants((rows) => {
      if (rows.length <= 1) { alert("Cannot delete the last variant."); return rows; }
      const row = rows.find((r) => r._key === key);
      if (row?.id) setRemovedVariantIds((ids) => [...ids, row.id!]);
      return rows.filter((r) => r._key !== key);
    });
  }

  // ─── Images ───────────────────────────────────────────────────────────────

  function handleImageFiles(files: FileList | null) {
    if (!files) return;
    const targetVariant = variants.find((v) => v._key === newImageVariantKey) ?? variants[0];
    const newRows: ImageRow[] = Array.from(files).map((file) => ({
      _key: `new-img-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
      variant_key: targetVariant?._key,
      color_name: targetVariant?.color_name,
    }));
    setImages((prev) => [...prev, ...newRows]);
  }

  function removeImage(key: string) {
    setImages((rows) => rows.map((r) => r._key === key ? { ...r, toDelete: true } : r));
  }

  // ─── Lens options ─────────────────────────────────────────────────────────

  function toggleLensOption(id: number) {
    setSelectedLensIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const groupedLensOptions = lensOptions.reduce<Record<string, LensOption[]>>((acc, o) => {
    const key = o.lens_type === "lens-type" ? "Lens Type" : o.lens_type === "coating" ? "Coating" : "Add-ons";
    acc[key] = [...(acc[key] ?? []), o];
    return acc;
  }, {});

  // ─── Save ─────────────────────────────────────────────────────────────────

  async function handleSave() {
    if (!form.name || !form.sku || !form.base_price) {
      setError("Name, SKU, and base price are required.");
      return;
    }
    const newImages = images.filter((img) => !img.toDelete && img.file);
    if (newImages.length > 0 && variants.length === 0) {
      setError("Please add at least one variant (color) before uploading images.");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const payload = {
        name: form.name,
        sku: form.sku,
        brand: form.brand || null,
        category: form.category,
        gender: form.gender,
        frame_shape: form.frame_shape || null,
        material: form.material || null,
        is_prescription_required: form.is_prescription_required,
        base_price: parseFloat(form.base_price),
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
        description: editor?.getHTML() ?? "",
        rim_type: form.rim_type || null,
        frame_width_mm: form.frame_width_mm ? parseInt(form.frame_width_mm) : null,
        lens_width_mm: form.lens_width_mm ? parseInt(form.lens_width_mm) : null,
        bridge_mm: form.bridge_mm ? parseInt(form.bridge_mm) : null,
        temple_mm: form.temple_mm ? parseInt(form.temple_mm) : null,
        lens_height_mm: form.lens_height_mm ? parseInt(form.lens_height_mm) : null,
        is_active: form.is_active,
        is_featured: form.is_featured,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
      };

      let pid = productId;

      if (!isEdit) {
        const { data } = await adminApi.products.create(payload);
        pid = data.id;
      } else {
        await adminApi.products.update(productId!, payload);
      }

      if (!pid) throw new Error("No product ID");

      // Delete removed variants
      await Promise.all(removedVariantIds.map((id) => adminApi.variants.delete(id)));
      setRemovedVariantIds([]);

      // Create/update variants
      const variantIdMap: Record<string, number> = {};
      for (const row of variants) {
        const vPayload = {
          color_name: row.color_name,
          color_hex: row.color_hex || null,
          size_label: row.size_label || null,
          sku_variant: row.sku_variant || null,
          price: row.price ? parseFloat(row.price) : null,
          stock: parseInt(row.stock) || 0,
          is_active: row.is_active,
        };
        if (row.id) {
          await adminApi.variants.update(row.id, vPayload);
          variantIdMap[row._key] = row.id;
        } else {
          const { data } = await adminApi.variants.create(pid, vPayload) as { data: { id: number } };
          variantIdMap[row._key] = data.id;
        }
      }

      const firstVariantId = variants[0]?.id ?? Object.values(variantIdMap)[0];

      // Delete marked images
      const toDelete = images.filter((img) => img.toDelete && img.id);
      await Promise.all(toDelete.map((img) => adminApi.products.deleteImage(img.id!)));

      // Upload new images to their assigned variant (or first variant as fallback)
      const imagesToUpload = images.filter((img) => !img.toDelete && img.file);
      for (const img of imagesToUpload) {
        const targetVariantId = img.variant_key
          ? (variantIdMap[img.variant_key] ?? firstVariantId)
          : firstVariantId;
        await adminApi.products.uploadImage(pid, img.file!, targetVariantId);
      }

      // Assign lens options
      await adminApi.products.assignLensOptions(pid, Array.from(selectedLensIds));

      router.push("/admin/products");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  const visibleImages = images.filter((img) => !img.toDelete);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* ── Main column ── */}
      <div className="flex-1 min-w-0 w-full">

        {/* Sticky save bar — mobile only */}
        <div className="lg:hidden sticky top-[52px] z-10 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between -mx-0 mb-4 shadow-sm">
          <span className="text-sm text-gray-600 truncate min-w-0 mr-2 font-medium">
            {form.name || "New Product"}
          </span>
          <button type="button" onClick={handleSave} disabled={saving}
            className="shrink-0 bg-[#E8670A] text-white text-xs font-medium px-3 py-1.5 rounded min-h-[36px] disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

        {/* 1. Basic Info */}
        <Section title="Basic Info">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Field label="Product Name *">
              <input value={form.name} onChange={(e) => setField("name", e.target.value)}
                className={inputCls} placeholder="e.g. Ray-Ban Aviator Classic" />
            </Field>
            <Field label="SKU *">
              <input value={form.sku} onChange={(e) => setField("sku", e.target.value.toUpperCase())}
                className={inputCls} placeholder="e.g. RB3025-GLD" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Field label="Brand">
              <input value={form.brand} onChange={(e) => setField("brand", e.target.value)}
                className={inputCls} placeholder="e.g. Ray-Ban" />
            </Field>
            <Field label="Category *">
              <select value={form.category} onChange={(e) => setField("category", e.target.value)} className={selectCls}>
                <option value="eyeglasses">Eyeglasses</option>
                <option value="sunglasses">Sunglasses</option>
                <option value="contact-lenses">Contact Lenses</option>
                <option value="accessories">Accessories</option>
              </select>
            </Field>
            <Field label="Gender">
              <select value={form.gender} onChange={(e) => setField("gender", e.target.value)} className={selectCls}>
                <option value="unisex">Unisex</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Frame Shape">
              <select value={form.frame_shape} onChange={(e) => setField("frame_shape", e.target.value)} className={selectCls}>
                <option value="">Select…</option>
                {["Round","Oval","Rectangle","Square","Cat-Eye","Aviator","Wayfarer"].map((s) => (
                  <option key={s} value={s.toLowerCase()}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Material">
              <select value={form.material} onChange={(e) => setField("material", e.target.value)} className={selectCls}>
                <option value="">Select…</option>
                {["Acetate","Metal","Titanium","TR90","Wood","Mixed"].map((m) => (
                  <option key={m} value={m.toLowerCase()}>{m}</option>
                ))}
              </select>
            </Field>
            <Field label="Rim Type">
              <select value={form.rim_type} onChange={(e) => setField("rim_type", e.target.value)} className={selectCls}>
                <option value="full-rim">Full Rim</option>
                <option value="half-rim">Half Rim</option>
                <option value="rimless">Rimless</option>
              </select>
            </Field>
          </div>
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input type="checkbox" checked={form.is_prescription_required}
              onChange={(e) => setField("is_prescription_required", e.target.checked)}
              className="accent-[#E8670A]" />
            <span className="text-sm text-gray-700">Requires prescription</span>
          </label>
        </Section>

        {/* 2. Pricing */}
        <Section title="Pricing">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Base Price (Rs.) *">
              <input type="number" value={form.base_price} onChange={(e) => setField("base_price", e.target.value)}
                className={inputCls} placeholder="0" min="0" step="50" />
            </Field>
            <Field label="Sale Price (Rs.) — leave blank for no sale">
              <input type="number" value={form.sale_price} onChange={(e) => setField("sale_price", e.target.value)}
                className={inputCls} placeholder="0" min="0" step="50" />
            </Field>
          </div>
        </Section>

        {/* 3. Product Images */}
        <Section title="Product Images">
          {variants.length > 0 && (
            <div className="mb-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-xs text-gray-600 shrink-0">Upload for color:</label>
              <select value={newImageVariantKey} onChange={(e) => setNewImageVariantKey(e.target.value)} className={selectCls + " sm:max-w-[180px]"}>
                {variants.map((v) => (
                  <option key={v._key} value={v._key}>{v.color_name || `Variant ${v._key}`}</option>
                ))}
              </select>
            </div>
          )}
          <div
            className="border-2 border-dashed border-gray-300 rounded p-4 md:p-6 text-center cursor-pointer hover:border-[#E8670A] transition-colors mb-4"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleImageFiles(e.dataTransfer.files); }}
          >
            <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">Drag & drop images or click to browse</p>
            <p className="text-gray-400 text-xs mt-1">JPEG, PNG, WebP — first image = main</p>
            <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleImageFiles(e.target.files)} />
          </div>

          {/* Images grouped by color */}
          {visibleImages.length > 0 && (() => {
            const groups: Record<string, typeof visibleImages> = {};
            visibleImages.forEach((img) => {
              const key = img.color_name || "Unassigned";
              groups[key] = [...(groups[key] ?? []), img];
            });
            return Object.entries(groups).map(([colorLabel, imgs]) => (
              <div key={colorLabel} className="mb-4">
                <p className="text-xs text-gray-500 mb-2 font-medium">{colorLabel}</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 md:gap-3">
                  {imgs.map((img, idx) => (
                    <div key={img._key} className="relative group aspect-square rounded overflow-hidden bg-gray-50 border border-gray-200">
                      <Image src={img.url} alt="" fill className="object-cover" sizes="120px" unoptimized={!!img.file} />
                      {idx === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-[#E8670A] text-white text-[10px] text-center py-0.5">Main</span>
                      )}
                      <button type="button" onClick={() => removeImage(img._key)}
                        className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <XMarkIcon className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ));
          })()}
        </Section>

        {/* 4. Variants */}
        <Section title="Variants (Colors & Sizes)">
          <p className="text-gray-400 text-xs mb-3">Each row is one color. For multiple sizes of the same color, add separate rows.</p>

          {/* Mobile card view */}
          <div className="md:hidden space-y-3 mb-3">
            {variants.map((row) => (
              <div key={row._key} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-4 h-4 rounded-full border border-gray-300 shrink-0" style={{ backgroundColor: row.color_hex }} />
                    <input value={row.color_name}
                      onChange={(e) => updateVariant(row._key, "color_name", e.target.value)}
                      className="text-sm font-medium text-gray-900 border-b border-transparent focus:border-[#E8670A] outline-none bg-transparent min-w-0 flex-1"
                      placeholder="Color name" />
                    <input type="color" value={row.color_hex}
                      onChange={(e) => updateVariant(row._key, "color_hex", e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border border-gray-200 shrink-0" />
                  </div>
                  <select value={row.size_label}
                    onChange={(e) => updateVariant(row._key, "size_label", e.target.value)}
                    className="ml-2 text-xs border border-gray-200 rounded px-1 py-1 text-gray-700 outline-none focus:border-[#E8670A] min-h-[36px] shrink-0">
                    <option value="">No size</option>
                    <option value="XS">XS</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                    <option value="XL">XL</option>
                    <option value="One Size">One Size</option>
                  </select>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <label className="text-[10px] text-gray-500 shrink-0">Lens</label>
                  <input value={row.lens_width}
                    onChange={(e) => updateVariant(row._key, "lens_width", e.target.value)}
                    className="w-10 border border-gray-200 rounded px-1 py-1 text-xs text-gray-900 text-center outline-none focus:border-[#E8670A]" placeholder="52" />
                  <span className="text-gray-400 text-xs">□</span>
                  <input value={row.bridge}
                    onChange={(e) => updateVariant(row._key, "bridge", e.target.value)}
                    className="w-10 border border-gray-200 rounded px-1 py-1 text-xs text-gray-900 text-center outline-none focus:border-[#E8670A]" placeholder="18" />
                  <span className="text-gray-400 text-xs">-</span>
                  <input value={row.temple}
                    onChange={(e) => updateVariant(row._key, "temple", e.target.value)}
                    className="w-12 border border-gray-200 rounded px-1 py-1 text-xs text-gray-900 text-center outline-none focus:border-[#E8670A]" placeholder="140" />
                </div>
                <input value={row.sku_variant}
                  onChange={(e) => updateVariant(row._key, "sku_variant", e.target.value.toUpperCase())}
                  className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-gray-500 outline-none focus:border-[#E8670A] mb-2"
                  placeholder="SKU variant" />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Price (Rs.)</label>
                    <input type="number" value={row.price}
                      onChange={(e) => updateVariant(row._key, "price", e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-[#E8670A]"
                      placeholder="—" min="0" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Stock *</label>
                    <input type="number" value={row.stock}
                      onChange={(e) => updateVariant(row._key, "stock", e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-[#E8670A]"
                      placeholder="0" min="0" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={row.is_active}
                      onChange={(e) => updateVariant(row._key, "is_active", e.target.checked)}
                      className="accent-[#E8670A]" />
                    <span className="text-xs text-gray-700">Active</span>
                  </label>
                  <button type="button" onClick={() => removeVariant(row._key)}
                    className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1">
                    <XMarkIcon className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addVariant}
              className="w-full flex items-center justify-center gap-1 text-[#E8670A] text-sm border border-dashed border-[#E8670A] rounded-lg py-2.5 hover:bg-orange-50 transition-colors min-h-[44px]">
              <PlusIcon className="w-4 h-4" />
              Add Color / Size
            </button>
          </div>

          {/* Desktop table view */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-600 border-b border-gray-200">
                  <th className="pb-2 text-left pr-2 min-w-[120px]">Color Name *</th>
                  <th className="pb-2 text-left pr-2 w-16">Color</th>
                  <th className="pb-2 text-left pr-2 w-24">Size Label</th>
                  <th className="pb-2 text-left pr-2">Lens □ Bridge - Temple</th>
                  <th className="pb-2 text-left pr-2 w-24">SKU</th>
                  <th className="pb-2 text-left pr-2 w-20">Price</th>
                  <th className="pb-2 text-left pr-2 w-16">Stock *</th>
                  <th className="pb-2 text-center pr-2 w-12">Active</th>
                  <th className="pb-2 w-6"></th>
                </tr>
              </thead>
              <tbody>
                {variants.map((row) => (
                  <tr key={row._key} className="border-b border-gray-100 align-middle">
                    <td className="py-2 pr-2">
                      <input value={row.color_name}
                        onChange={(e) => updateVariant(row._key, "color_name", e.target.value)}
                        className={inputCls + " !py-1 !min-h-0"} placeholder="e.g. Matte Black" />
                    </td>
                    <td className="py-2 pr-2">
                      <input type="color" value={row.color_hex}
                        onChange={(e) => updateVariant(row._key, "color_hex", e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border border-gray-200" title={row.color_hex} />
                    </td>
                    <td className="py-2 pr-2">
                      <select value={row.size_label}
                        onChange={(e) => updateVariant(row._key, "size_label", e.target.value)}
                        className={selectCls + " !py-1 !min-h-0"}>
                        <option value="">—</option>
                        <option value="XS">XS</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                        <option value="XL">XL</option>
                        <option value="One Size">One Size</option>
                      </select>
                    </td>
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-1">
                        <input value={row.lens_width}
                          onChange={(e) => updateVariant(row._key, "lens_width", e.target.value)}
                          className={inputCls + " !py-1 !min-h-0 w-10"} placeholder="52" />
                        <span className="text-gray-500">□</span>
                        <input value={row.bridge}
                          onChange={(e) => updateVariant(row._key, "bridge", e.target.value)}
                          className={inputCls + " !py-1 !min-h-0 w-10"} placeholder="18" />
                        <span className="text-gray-500">-</span>
                        <input value={row.temple}
                          onChange={(e) => updateVariant(row._key, "temple", e.target.value)}
                          className={inputCls + " !py-1 !min-h-0 w-12"} placeholder="140" />
                      </div>
                    </td>
                    <td className="py-2 pr-2">
                      <input value={row.sku_variant}
                        onChange={(e) => updateVariant(row._key, "sku_variant", e.target.value.toUpperCase())}
                        className={inputCls + " !py-1 !min-h-0"} placeholder="e.g. BLK-SM" />
                    </td>
                    <td className="py-2 pr-2">
                      <input type="number" value={row.price}
                        onChange={(e) => updateVariant(row._key, "price", e.target.value)}
                        className={inputCls + " !py-1 !min-h-0"} placeholder="—" min="0" />
                    </td>
                    <td className="py-2 pr-2">
                      <input type="number" value={row.stock}
                        onChange={(e) => updateVariant(row._key, "stock", e.target.value)}
                        className={inputCls + " !py-1 !min-h-0"} placeholder="0" min="0" />
                    </td>
                    <td className="py-2 pr-2 text-center">
                      <input type="checkbox" checked={row.is_active}
                        onChange={(e) => updateVariant(row._key, "is_active", e.target.checked)}
                        className="accent-[#E8670A]" />
                    </td>
                    <td className="py-2">
                      <button type="button" onClick={() => removeVariant(row._key)}
                        className="text-gray-500 hover:text-red-400 transition-colors">
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={addVariant}
              className="mt-3 flex items-center gap-1 text-[#E8670A] text-xs hover:text-orange-300 transition-colors">
              <PlusIcon className="w-4 h-4" />
              Add Color / Size
            </button>
          </div>
        </Section>

        {/* 5. Description (Tiptap) */}
        <Section title="Description">
          <div className="border border-gray-200 rounded overflow-hidden">
            {/* Toolbar */}
            <div className="flex gap-1 p-2 border-b border-gray-200 bg-gray-50 flex-wrap">
              <TbBtn active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()}>B</TbBtn>
              <TbBtn active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()}>I</TbBtn>
              <TbBtn active={editor?.isActive("heading", { level: 1 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>H1</TbBtn>
              <TbBtn active={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</TbBtn>
              <TbBtn active={editor?.isActive("heading", { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>H3</TbBtn>
              <TbBtn active={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                <ListBulletIcon className="w-3 h-3" />
              </TbBtn>
              <TbBtn active={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>1.</TbBtn>
              <TbBtn active={editor?.isActive("blockquote")} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>&ldquo;</TbBtn>
            </div>
            <div className="p-3 bg-white prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[160px] [&_.ProseMirror]:text-gray-900">
              <EditorContent editor={editor} />
            </div>
          </div>
        </Section>

        {/* 6. Frame Specs */}
        <Section title="Frame Specifications (mm)">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            {([
              ["frame_width_mm", "Frame Width"],
              ["lens_width_mm", "Lens Width"],
              ["bridge_mm", "Bridge"],
              ["temple_mm", "Temple Length"],
              ["lens_height_mm", "Lens Height"],
            ] as [keyof ProductFormState, string][]).map(([field, label]) => (
              <Field key={field} label={label}>
                <input type="number" value={form[field] as string}
                  onChange={(e) => setField(field, e.target.value)}
                  className={inputCls} placeholder="mm" min="0" />
              </Field>
            ))}
          </div>
        </Section>

        {/* 7. Lens Options */}
        <Section title="Lens Options">
          {lensOptions.length === 0 ? (
            <p className="text-gray-500 text-sm">No lens options configured yet.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedLensOptions).map(([group, opts]) => (
                <div key={group}>
                  <p className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{group}</p>
                  <div className="flex flex-wrap gap-2">
                    {opts.map((opt) => {
                      const checked = selectedLensIds.has(opt.id);
                      return (
                        <label key={opt.id}
                          className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer text-sm transition-colors ${checked ? "border-[#E8670A] bg-[#E8670A]/10 text-gray-900" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                          <input type="checkbox" checked={checked} onChange={() => toggleLensOption(opt.id)} className="accent-[#E8670A]" />
                          {opt.name}
                          {opt.price > 0 && <span className="text-xs text-gray-500">+Rs.{opt.price}</span>}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Error */}
        {error && <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}

        {/* Save */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="primary" size="md" onClick={handleSave} disabled={saving} fullWidth>
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
          </Button>
          <Button variant="outline" size="md" onClick={() => router.push("/admin/products")} fullWidth>
            Cancel
          </Button>
        </div>
      </div>

      {/* ── Right sidebar (moves to bottom on mobile) ── */}
      <div className="w-full lg:w-64 lg:shrink-0 space-y-4">
        <div className="bg-white border border-gray-200 shadow-sm rounded p-4">
          <h3 className="text-gray-900 font-semibold text-[13px] md:text-sm mb-3">Status</h3>
          <Field label="Visibility">
            <select value={form.is_active ? "active" : "draft"} onChange={(e) => setField("is_active", e.target.value === "active")} className={selectCls}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 mt-3 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setField("is_featured", e.target.checked)} className="accent-[#E8670A]" />
            <span className="text-sm text-gray-700">Featured on homepage</span>
          </label>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded p-4">
          <h3 className="text-gray-900 font-semibold text-sm mb-3">SEO</h3>
          <Field label="URL Slug">
            <input value={form.slug}
              onChange={(e) => { setSlugAuto(false); setField("slug", e.target.value); }}
              className={inputCls} placeholder="auto-generated" />
          </Field>
          <div className="mt-3">
            <Field label="Meta Title">
              <input value={form.meta_title} onChange={(e) => setField("meta_title", e.target.value)}
                className={inputCls} placeholder={form.name || "Product title"} />
            </Field>
          </div>
          <div className="mt-3">
            <Field label="Meta Description">
              <textarea value={form.meta_description} onChange={(e) => setField("meta_description", e.target.value)}
                className={inputCls + " !h-20 resize-none"} placeholder="Short page description…" />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}
