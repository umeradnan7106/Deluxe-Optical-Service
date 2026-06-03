"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface DraftItem {
  _key: string;
  product_name: string;
  color_name: string;
  sku_variant: string;
  quantity: number;
  frame_price: number;
  lens_options_price: number;
  lens_option_names: string;
}

const PROVINCES = ["Punjab", "Sindh", "KPK", "Balochistan", "Islamabad", "AJK", "GB"];
const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on Delivery" },
  { value: "easypaisa", label: "EasyPaisa" },
  { value: "jazzcash", label: "JazzCash" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

const inputCls = "w-full bg-white border border-gray-300 text-gray-900 text-sm px-3 py-2 rounded outline-none focus:border-[#E8670A] transition-colors";
const selectCls = inputCls;

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded p-5 mb-4">
      <h2 className="text-gray-900 font-semibold text-sm uppercase tracking-wide mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function NewDraftOrderPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Customer
  const [customer, setCustomer] = useState({
    name: "", phone: "", email: "", address: "", city: "", province: "Punjab", notes: "",
  });

  // Items
  const [items, setItems] = useState<DraftItem[]>([
    { _key: "item-0", product_name: "", color_name: "", sku_variant: "", quantity: 1, frame_price: 0, lens_options_price: 0, lens_option_names: "" },
  ]);

  // Payment
  const [payment, setPayment] = useState({
    method: "cod",
    shipping_fee: 0,
    payment_discount: 0,
  });

  function addItem() {
    setItems((prev) => [...prev, {
      _key: `item-${Date.now()}`, product_name: "", color_name: "", sku_variant: "",
      quantity: 1, frame_price: 0, lens_options_price: 0, lens_option_names: "",
    }]);
  }

  function removeItem(key: string) {
    setItems((prev) => prev.filter((i) => i._key !== key));
  }

  function updateItem(key: string, field: keyof DraftItem, value: string | number) {
    setItems((prev) => prev.map((i) => i._key === key ? { ...i, [field]: value } : i));
  }

  const subtotal = items.reduce((sum, i) => sum + (i.frame_price + i.lens_options_price) * i.quantity, 0);
  const total = Math.max(0, subtotal + payment.shipping_fee - payment.payment_discount);

  async function handleSubmit() {
    if (!customer.name || !customer.phone || !customer.address || !customer.city) {
      setError("Customer name, phone, address, and city are required.");
      return;
    }
    if (items.length === 0 || items.some((i) => !i.product_name)) {
      setError("All items must have a product name.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const { data } = await adminApi.orders.createDraft({
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_email: customer.email || null,
        shipping_address: customer.address,
        city: customer.city,
        province: customer.province,
        notes: customer.notes || null,
        items: items.map((i) => ({
          product_name: i.product_name,
          color_name: i.color_name,
          sku_variant: i.sku_variant || null,
          quantity: i.quantity,
          frame_price: i.frame_price,
          lens_options_price: i.lens_options_price,
          lens_option_names: i.lens_option_names ? i.lens_option_names.split(",").map((s) => s.trim()).filter(Boolean) : [],
        })),
        payment_method: payment.method,
        subtotal,
        shipping_fee: payment.shipping_fee,
        payment_discount: payment.payment_discount,
        total,
      });
      router.push(`/admin/orders/${data.id}`);
    } catch {
      setError("Failed to create draft order. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl text-gray-900 font-semibold">Create Draft Order</h1>
        <button onClick={() => router.push("/admin/orders")} className="text-gray-500 text-sm hover:text-gray-900">
          ← Back to Orders
        </button>
      </div>

      {/* 1. Customer */}
      <SectionCard title="1. Customer">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Full Name *">
            <input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} className={inputCls} placeholder="Ahmed Khan" />
          </Field>
          <Field label="Phone *">
            <input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} className={inputCls} placeholder="03001234567" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Email">
            <input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} className={inputCls} placeholder="optional" />
          </Field>
          <Field label="City *">
            <input value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} className={inputCls} placeholder="Lahore" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Province">
            <select value={customer.province} onChange={(e) => setCustomer({ ...customer, province: e.target.value })} className={selectCls}>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Shipping Address *">
          <input value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} className={inputCls} placeholder="Street address, house number, area" />
        </Field>
        <div className="mt-3">
          <Field label="Order Notes">
            <textarea value={customer.notes} onChange={(e) => setCustomer({ ...customer, notes: e.target.value })} className={inputCls + " h-16 resize-none"} placeholder="Any special instructions…" />
          </Field>
        </div>
      </SectionCard>

      {/* 2. Products */}
      <SectionCard title="2. Products">
        {items.map((item, idx) => (
          <div key={item._key} className="border border-gray-200 rounded p-4 mb-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium">Item {idx + 1}</span>
              {items.length > 1 && (
                <button onClick={() => removeItem(item._key)} className="text-gray-400 hover:text-red-400 transition-colors">
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Field label="Product Name *">
                <input value={item.product_name} onChange={(e) => updateItem(item._key, "product_name", e.target.value)} className={inputCls} placeholder="Ray-Ban Aviator Classic" />
              </Field>
              <Field label="Color">
                <input value={item.color_name} onChange={(e) => updateItem(item._key, "color_name", e.target.value)} className={inputCls} placeholder="Matte Black" />
              </Field>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <Field label="SKU">
                <input value={item.sku_variant} onChange={(e) => updateItem(item._key, "sku_variant", e.target.value)} className={inputCls} placeholder="optional" />
              </Field>
              <Field label="Qty">
                <input type="number" value={item.quantity} min={1} onChange={(e) => updateItem(item._key, "quantity", parseInt(e.target.value) || 1)} className={inputCls} />
              </Field>
              <Field label="Frame Price (Rs.)">
                <input type="number" value={item.frame_price} min={0} onChange={(e) => updateItem(item._key, "frame_price", parseFloat(e.target.value) || 0)} className={inputCls} />
              </Field>
              <Field label="Lens Price (Rs.)">
                <input type="number" value={item.lens_options_price} min={0} onChange={(e) => updateItem(item._key, "lens_options_price", parseFloat(e.target.value) || 0)} className={inputCls} />
              </Field>
            </div>
          </div>
        ))}
        <button onClick={addItem} className="flex items-center gap-1 text-[#E8670A] text-sm hover:text-orange-300 transition-colors">
          <PlusIcon className="w-4 h-4" />
          Add Item
        </button>
      </SectionCard>

      {/* 3. Lens Options */}
      <SectionCard title="3. Lens Options (per item)">
        {items.map((item, idx) => (
          <div key={item._key} className="mb-3">
            <Field label={`Item ${idx + 1} — Lens Options (comma-separated)`}>
              <input value={item.lens_option_names} onChange={(e) => updateItem(item._key, "lens_option_names", e.target.value)} className={inputCls} placeholder="e.g. Blue Cut, Anti-Glare" />
            </Field>
          </div>
        ))}
      </SectionCard>

      {/* 4. Payment */}
      <SectionCard title="4. Payment">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Payment Method">
            <select value={payment.method} onChange={(e) => setPayment({ ...payment, method: e.target.value })} className={selectCls}>
              {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </Field>
          <Field label="Shipping Fee (Rs.)">
            <input type="number" value={payment.shipping_fee} min={0} onChange={(e) => setPayment({ ...payment, shipping_fee: parseFloat(e.target.value) || 0 })} className={inputCls} />
          </Field>
          <Field label="Discount (Rs.)">
            <input type="number" value={payment.payment_discount} min={0} onChange={(e) => setPayment({ ...payment, payment_discount: parseFloat(e.target.value) || 0 })} className={inputCls} />
          </Field>
        </div>
      </SectionCard>

      {/* 5. Summary */}
      <SectionCard title="5. Summary">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
          </div>
          {payment.shipping_fee > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span><span>{formatPrice(payment.shipping_fee)}</span>
            </div>
          )}
          {payment.payment_discount > 0 && (
            <div className="flex justify-between text-green-500">
              <span>Discount</span><span>-{formatPrice(payment.payment_discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-900 font-semibold border-t border-gray-200 pt-2 mt-2">
            <span>Total</span><span className="text-[#E8670A]">{formatPrice(total)}</span>
          </div>
        </div>

        {error && <p className="mt-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}

        <div className="flex gap-3 mt-4">
          <Button variant="primary" size="md" onClick={handleSubmit} disabled={saving}>
            {saving ? "Creating…" : "Create Draft Order"}
          </Button>
          <Button variant="outline" size="md" onClick={() => router.push("/admin/orders")}>
            Cancel
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
