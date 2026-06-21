"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";
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
const PAYMENT_STATUS = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
];

const inputCls = "w-full border-[1.5px] border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] bg-white outline-none focus:border-[#1B2B5E] transition-colors";
const labelCls = "block text-[10px] font-semibold uppercase tracking-[.06em] text-[#64748b] mb-1.5";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5 mb-5">
      <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4 pb-3 border-b border-[#F1F5F9]">{title}</h2>
      {children}
    </div>
  );
}

export default function NewDraftOrderPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [customer, setCustomer] = useState({
    name: "", phone: "", email: "", address: "", city: "", province: "Punjab", notes: "",
  });
  const [items, setItems] = useState<DraftItem[]>([
    { _key: "item-0", product_name: "", color_name: "", sku_variant: "", quantity: 1, frame_price: 0, lens_options_price: 0, lens_option_names: "" },
  ]);
  const [payment, setPayment] = useState({ method: "cod", status: "pending", shipping_fee: 0, payment_discount: 0 });

  function addItem() {
    setItems((prev) => [
      ...prev,
      { _key: `item-${Date.now()}`, product_name: "", color_name: "", sku_variant: "", quantity: 1, frame_price: 0, lens_options_price: 0, lens_option_names: "" },
    ]);
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
    if (items.some((i) => !i.product_name)) {
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
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748b] mb-1">
            <button onClick={() => router.push("/admin/orders")} className="hover:text-[#1B2B5E] transition-colors">Orders</button>
            <span>/</span>
            <span className="text-[#1B2B5E] font-medium">Create Draft Order</span>
          </div>
          <h1 className="font-playfair text-2xl md:text-[26px] text-[#1B2B5E] font-bold">Create Draft Order</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.push("/admin/orders")}
            className="px-3 py-2 border border-[#E2E8F0] text-[#64748b] text-xs font-semibold rounded-lg hover:border-[#1B2B5E] hover:text-[#1B2B5E] transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="px-4 py-2 bg-[#1B2B5E] hover:bg-[#243570] text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors">
            {saving ? "Creating…" : "Create Order"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          {/* Customer Information */}
          <Card title="Customer Information">
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-[#64748b] mb-2">Search existing customer (optional)</p>
              <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg px-3">
                <span className="text-[#94a3b8]">🔍</span>
                <input className="flex-1 border-none outline-none text-sm py-2 text-[#0F172A] placeholder:text-[#94a3b8]" placeholder="Search by name, email, or phone…" />
              </div>
            </div>
            <p className="text-[10px] font-semibold text-[#64748b] uppercase tracking-[.06em] mb-3">OR fill in manually</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelCls}>Full Name *</label>
                <input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} className={inputCls} placeholder="Ali Khan" />
              </div>
              <div>
                <label className={labelCls}>Phone *</label>
                <input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} className={inputCls} placeholder="03001234567" />
              </div>
            </div>
            <div className="mb-4">
              <label className={labelCls}>Email</label>
              <input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} className={inputCls} placeholder="ali@email.com" />
            </div>
            <div className="mb-4">
              <label className={labelCls}>Delivery Address *</label>
              <textarea value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} rows={2} className={`${inputCls} resize-none`} placeholder="House/Flat, Street, Area…" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>City *</label>
                <input value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} className={inputCls} placeholder="Karachi" />
              </div>
              <div>
                <label className={labelCls}>Province *</label>
                <select value={customer.province} onChange={(e) => setCustomer({ ...customer, province: e.target.value })} className={inputCls}>
                  {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </Card>

          {/* Products */}
          <Card title="Products">
            <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg px-3 mb-4">
              <span className="text-[#94a3b8]">🔍</span>
              <input className="flex-1 border-none outline-none text-sm py-2.5 text-[#0F172A] placeholder:text-[#94a3b8]" placeholder="Search products by name or SKU…" />
            </div>
            {items.map((item, idx) => (
              <div key={item._key} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-12 bg-white border border-[#E2E8F0] rounded-lg flex items-center justify-center text-xl shrink-0">🕶</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-xs font-semibold text-[#64748b]">Item {idx + 1}</p>
                      {items.length > 1 && (
                        <button onClick={() => removeItem(item._key)} className="text-[#94a3b8] hover:text-[#dc2626] transition-colors">
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className={labelCls}>Product Name *</label>
                        <input value={item.product_name} onChange={(e) => updateItem(item._key, "product_name", e.target.value)} className={inputCls} placeholder="Full Golden Aviator" />
                      </div>
                      <div>
                        <label className={labelCls}>Color / Size</label>
                        <input value={item.color_name} onChange={(e) => updateItem(item._key, "color_name", e.target.value)} className={inputCls} placeholder="Gold · Medium" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className={labelCls}>Qty</label>
                        <input type="number" value={item.quantity} min={1} onChange={(e) => updateItem(item._key, "quantity", parseInt(e.target.value) || 1)} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Frame Rs.</label>
                        <input type="number" value={item.frame_price} min={0} onChange={(e) => updateItem(item._key, "frame_price", parseFloat(e.target.value) || 0)} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Lens Rs.</label>
                        <input type="number" value={item.lens_options_price} min={0} onChange={(e) => updateItem(item._key, "lens_options_price", parseFloat(e.target.value) || 0)} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>SKU</label>
                        <input value={item.sku_variant} onChange={(e) => updateItem(item._key, "sku_variant", e.target.value)} className={inputCls} placeholder="optional" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className={labelCls}>Lens Options (comma-separated)</label>
                      <input value={item.lens_option_names} onChange={(e) => updateItem(item._key, "lens_option_names", e.target.value)} className={inputCls} placeholder="e.g. Single Vision, Anti-Reflective" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addItem}
              className="w-full flex items-center justify-center gap-2 py-2.5 border-[1.5px] border-dashed border-[#E2E8F0] rounded-lg text-[#64748b] hover:border-[#1B2B5E] hover:text-[#1B2B5E] text-sm font-medium transition-colors">
              <PlusIcon className="w-4 h-4" />Add Another Product
            </button>
          </Card>

          {/* Payment */}
          <Card title="Payment">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelCls}>Payment Method</label>
                <select value={payment.method} onChange={(e) => setPayment({ ...payment, method: e.target.value })} className={inputCls}>
                  {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Payment Status</label>
                <select value={payment.status} onChange={(e) => setPayment({ ...payment, status: e.target.value })} className={inputCls}>
                  {PAYMENT_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Shipping Fee (Rs.)</label>
                <input type="number" value={payment.shipping_fee} min={0} onChange={(e) => setPayment({ ...payment, shipping_fee: parseFloat(e.target.value) || 0 })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Discount (Rs.)</label>
                <input type="number" value={payment.payment_discount} min={0} onChange={(e) => setPayment({ ...payment, payment_discount: parseFloat(e.target.value) || 0 })} className={inputCls} />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelCls}>Order Notes (internal)</label>
              <textarea value={customer.notes} onChange={(e) => setCustomer({ ...customer, notes: e.target.value })} rows={2} className={`${inputCls} resize-none`} placeholder="Internal notes about this order…" />
            </div>
          </Card>
        </div>

        {/* Summary sidebar */}
        <div>
          <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5 sticky top-[68px]">
            <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4 pb-3 border-b border-[#F1F5F9]">Order Summary</h2>
            <div className="text-sm space-y-2.5 mb-4">
              {items.map((item, idx) => item.product_name && (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-[#64748b] truncate max-w-[150px]">{item.product_name} ×{item.quantity}</span>
                  <span className="font-semibold">{formatPrice((item.frame_price + item.lens_options_price) * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between text-[#64748b]">
                <span>Shipping</span>
                <span>{payment.shipping_fee > 0 ? formatPrice(payment.shipping_fee) : <span className="text-[#059669]">Free</span>}</span>
              </div>
              {payment.payment_discount > 0 && (
                <div className="flex justify-between text-[#059669]">
                  <span>Discount</span><span>-{formatPrice(payment.payment_discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t-2 border-[#E2E8F0] pt-2.5 mt-1">
                <span>Total</span>
                <span className="font-playfair text-[#1B2B5E]">{formatPrice(total)}</span>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

            <button onClick={handleSubmit} disabled={saving}
              className="w-full py-3 bg-[#1B2B5E] hover:bg-[#243570] text-white text-sm font-bold rounded-lg disabled:opacity-50 transition-colors mb-2">
              {saving ? "Creating…" : "Create Order"}
            </button>
            <p className="text-[11px] text-[#94a3b8] text-center">Customer will receive WhatsApp confirmation</p>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-[#E2E8F0] p-4">
        <button onClick={handleSubmit} disabled={saving}
          className="w-full bg-[#1B2B5E] text-white font-bold py-3 rounded-lg min-h-[48px] disabled:opacity-60 text-sm">
          {saving ? "Creating…" : `Create Order · ${formatPrice(total)}`}
        </button>
      </div>
      <div className="lg:hidden h-20" />
    </div>
  );
}
