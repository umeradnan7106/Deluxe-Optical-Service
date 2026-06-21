"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface OrderItem {
  product_name: string;
  color_name: string;
  sku_variant: string | null;
  quantity: number;
  frame_price: number;
  lens_options_price: number;
  lens_option_names: string[];
  prescription_method?: string;
}

interface AdminOrderDetail {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  city: string;
  province: string;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  payment_discount: number;
  coupon_discount: number;
  total: number;
  payment_method: string;
  payment_status: string;
  status: string;
  tracking_number: string | null;
  promo_code: string | null;
  prescription_method: string | null;
  prescription_url: string | null;
  prescription_data: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_BADGE: Record<string, "orange" | "gray" | "green" | "red"> = {
  pending: "orange", confirmed: "gray", processing: "gray",
  shipped: "gray", delivered: "green", cancelled: "red", refunded: "gray",
};
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: ["refunded"],
  cancelled: [],
  refunded: [],
};
const PM_LABELS: Record<string, string> = {
  cod: "Cash on Delivery", easypaisa: "EasyPaisa", jazzcash: "JazzCash", bank_transfer: "Bank Transfer",
};
const COURIERS = ["TCS", "M&P", "Leopards", "Pakistan Post", "Trax", "Call Courier"];

const inputCls = "w-full border-[1.5px] border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] bg-white outline-none focus:border-[#1B2B5E] transition-colors";
const labelCls = "block text-[10px] font-semibold uppercase tracking-[.06em] text-[#64748b] mb-1";

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [tracking, setTracking] = useState("");
  const [courier, setCourier] = useState("TCS");
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    adminApi.orders.detail(Number(id)).then(({ data }) => {
      const o = data as AdminOrderDetail;
      setOrder(o);
      setTracking(o.tracking_number ?? "");
      setNote(o.notes ?? "");
    }).catch(() => {});
  }, [id]);

  async function handleStatusUpdate() {
    if (!newStatus || !order) return;
    setUpdating(true);
    setError("");
    try {
      await adminApi.orders.updateStatus(order.id, newStatus);
      setOrder((prev) => prev ? { ...prev, status: newStatus } : prev);
      setNewStatus("");
    } catch {
      setError("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleTrackingUpdate() {
    if (!order) return;
    setUpdating(true);
    try {
      await adminApi.orders.updateTracking(order.id, tracking);
    } catch {
      setError("Failed to save tracking number.");
    } finally {
      setUpdating(false);
    }
  }

  if (!order) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl p-5 animate-pulse h-32" />
        ))}
      </div>
    );
  }

  const allowedTransitions = VALID_TRANSITIONS[order.status] ?? [];
  let prescriptionData: Record<string, unknown> | null = null;
  try { prescriptionData = order.prescription_data ? JSON.parse(order.prescription_data) : null; } catch { /* */ }

  const hasLens = order.items.some((i) => i.lens_option_names?.length > 0);
  const hasPrescription = !!order.prescription_method || !!prescriptionData;
  const customerInitials = order.customer_name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const TIMELINE = [
    { label: "Order Placed", sub: "Customer placed order", active: true },
    { label: "Payment Confirmed", sub: `${PM_LABELS[order.payment_method] ?? order.payment_method}`, active: order.payment_status === "paid" },
    { label: "Processing", sub: "Preparing your order", active: ["processing", "shipped", "delivered"].includes(order.status) },
    { label: "Shipped", sub: tracking ? `Tracking: ${tracking}` : "Awaiting shipment", active: ["shipped", "delivered"].includes(order.status) },
    { label: "Delivered", sub: "Order complete", active: order.status === "delivered" },
  ];

  return (
    <div>
      {/* Breadcrumb + Page header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748b] mb-1">
            <button onClick={() => router.push("/admin/orders")} className="hover:text-[#1B2B5E] transition-colors">Orders</button>
            <span>/</span>
            <span className="text-[#1B2B5E] font-medium">{order.order_number}</span>
          </div>
          <h1 className="font-playfair text-2xl md:text-[26px] text-[#1B2B5E] font-bold">{order.order_number}</h1>
        </div>
        <div className="flex gap-2">
          {order.customer_phone && (
            <a
              href={`https://wa.me/92${order.customer_phone.replace(/^0/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-[#1B2B5E] hover:bg-[#243570] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              💬 WhatsApp Customer
            </a>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-4 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[#64748b] text-sm">{formatDate(order.created_at)}</span>
            <Badge variant={STATUS_BADGE[order.status] ?? "gray"}>{order.status}</Badge>
            {hasPrescription && <span className="bg-[#ede9fe] text-[#6d28d9] text-[10px] font-semibold px-2 py-0.5 rounded">Prescription Order</span>}
          </div>
          {allowedTransitions.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#64748b]">Update Status:</span>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                className="border-[1.5px] border-[#E2E8F0] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#1B2B5E] min-w-[150px]">
                <option value="">{order.status}</option>
                {allowedTransitions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={handleStatusUpdate} disabled={!newStatus || updating}
                className="px-3 py-1.5 bg-[#1B2B5E] hover:bg-[#243570] text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors">
                {updating ? "Updating…" : "Update"}
              </button>
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column — 2fr */}
        <div className="lg:col-span-2 space-y-5">
          {/* Order Items */}
          <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
            <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4 pb-3 border-b border-[#F1F5F9]">Order Items</h2>
            {order.items.map((item, idx) => (
              <div key={idx} className={`flex gap-4 items-start ${idx < order.items.length - 1 ? "pb-4 mb-4 border-b border-[#F1F5F9]" : ""}`}>
                <div className="w-[68px] h-[60px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-center text-2xl shrink-0">
                  🕶
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1B2B5E]">{item.product_name}</p>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    {item.color_name}{item.sku_variant ? ` · ${item.sku_variant}` : ""}
                  </p>
                  {item.lens_option_names?.length > 0 && (
                    <p className="text-xs text-[#64748b] mt-0.5">Lenses: {item.lens_option_names.join(" · ")}</p>
                  )}
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-[#64748b]">Qty: {item.quantity}</span>
                    <span className="text-sm font-bold text-[#1B2B5E]">{formatPrice((item.frame_price + item.lens_options_price) * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lens & Prescription Details */}
          {(hasLens || hasPrescription) && (
            <div className="bg-white border-2 border-[#1B2B5E] rounded-xl p-5">
              <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4 pb-3 border-b border-[#EEF1FA] flex items-center gap-2">
                🔍 Lens & Prescription Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                {/* Lens Selection */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#C9A84C] mb-2">Lens Selection</p>
                  {order.items.filter((i) => i.lens_option_names?.length > 0).map((item, idx) => (
                    <div key={idx} className="mb-2">
                      <p className="text-xs font-semibold text-[#1B2B5E]">{item.product_name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.lens_option_names.map((n, j) => (
                          <span key={j} className="bg-[#EEF1FA] text-[#1B2B5E] text-[10px] font-semibold px-2 py-0.5 rounded">{n}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Prescription */}
                {hasPrescription && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#C9A84C] mb-2">Prescription Method</p>
                    <span className="bg-[#d1fae5] text-[#065f46] text-[10px] font-semibold px-2 py-0.5 rounded capitalize mb-2 inline-block">
                      {(order.prescription_method ?? "").replace(/_/g, " ")}
                    </span>
                    {order.prescription_url && (
                      <a href={order.prescription_url} target="_blank" rel="noopener noreferrer"
                        className="block text-xs text-[#C9A84C] hover:underline mt-1">View uploaded prescription →</a>
                    )}
                    {prescriptionData && (
                      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 mt-2 text-xs">
                        <div className="grid grid-cols-4 gap-1 font-semibold text-[#64748b] text-[10px] uppercase mb-1">
                          <span></span><span>SPH</span><span>CYL</span><span>Axis</span>
                        </div>
                        {["od", "os", "right", "left"].filter((eye) => prescriptionData?.[eye]).map((eye) => {
                          const d = prescriptionData![eye] as Record<string, unknown>;
                          return (
                            <div key={eye} className="grid grid-cols-4 gap-1 mb-0.5">
                              <span className="font-bold text-[#1B2B5E] uppercase">{eye === "od" || eye === "right" ? "OD (R)" : "OS (L)"}</span>
                              <span>{String(d.sph ?? "—")}</span>
                              <span>{String(d.cyl ?? "—")}</span>
                              <span>{String(d.axis ?? "—")}</span>
                            </div>
                          );
                        })}
                        {(!!(prescriptionData.add) || !!(prescriptionData.pd)) && (
                          <div className="flex gap-4 mt-2 pt-2 border-t border-[#E2E8F0] text-xs">
                            {!!(prescriptionData.add) && <span><strong>ADD:</strong> {String(prescriptionData.add)}</span>}
                            {!!(prescriptionData.pd) && <span><strong>PD:</strong> {String(prescriptionData.pd)}mm</span>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Manufacturing note */}
              <div className="bg-[#FDF6E3] border border-[rgba(201,168,76,.3)] rounded-lg p-3 text-xs text-[#1B2B5E]">
                <strong>📋 Lens Manufacturing Note:</strong>{" "}
                {order.items.filter((i) => i.lens_option_names?.length > 0).map((i) => (
                  `${i.product_name}: ${i.lens_option_names.join(", ")}`
                )).join(" | ")}
                {prescriptionData && ` · PD: ${String(prescriptionData.pd ?? "—")}mm`}
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
            <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4 pb-3 border-b border-[#F1F5F9]">Payment Summary</h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-[#64748b]">Frames ({order.items.length})</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.shipping_fee > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Shipping</span>
                  <span>{formatPrice(order.shipping_fee)}</span>
                </div>
              )}
              {order.shipping_fee === 0 && (
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Shipping</span>
                  <span className="text-[#059669]">Free</span>
                </div>
              )}
              {order.coupon_discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Coupon ({order.promo_code})</span>
                  <span className="text-[#059669]">-{formatPrice(order.coupon_discount)}</span>
                </div>
              )}
              {order.payment_discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#64748b]">{PM_LABELS[order.payment_method] ?? order.payment_method} discount</span>
                  <span className="text-[#059669]">-{formatPrice(order.payment_discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t-2 border-[#E2E8F0] pt-2 mt-1">
                <span>Total</span>
                <span className="font-playfair text-[#1B2B5E]">{formatPrice(order.total)}</span>
              </div>
              <p className="text-xs text-[#64748b]">
                Payment: {PM_LABELS[order.payment_method] ?? order.payment_method} ·{" "}
                <span className={order.payment_status === "paid" ? "text-[#059669] font-semibold" : "text-[#d97706] font-semibold"}>
                  {order.payment_status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          {/* Shipping & Tracking */}
          <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
            <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4 pb-3 border-b border-[#F1F5F9]">Shipping & Tracking</h2>
            <div className="mb-3">
              <label className={labelCls}>Courier</label>
              <select value={courier} onChange={(e) => setCourier(e.target.value)} className={inputCls}>
                {COURIERS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="mb-2">
              <label className={labelCls}>Tracking Number</label>
              <div className="flex gap-2">
                <input value={tracking} onChange={(e) => setTracking(e.target.value)}
                  className={`${inputCls} flex-1`} placeholder="Enter tracking number…" />
                <button onClick={handleTrackingUpdate} disabled={updating}
                  className="px-3 py-2 bg-[#1B2B5E] hover:bg-[#243570] text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors shrink-0">
                  Save & Notify
                </button>
              </div>
              <p className="text-[11px] text-[#94a3b8] mt-1">Customer will be notified via WhatsApp when tracking is added</p>
            </div>
            <p className="text-xs text-[#64748b] mt-3">
              Shipping to: <strong className="text-[#0F172A]">{order.customer_name} · {order.shipping_address}, {order.city}, {order.province}</strong>
            </p>
          </div>
        </div>

        {/* Right column — 1fr */}
        <div className="space-y-5">
          {/* Customer Card */}
          <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#F1F5F9]">
              <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E]">Customer</h2>
              <Link href="/admin/customers" className="text-[#1B2B5E] text-xs hover:underline font-semibold">View Profile →</Link>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-[#EEF1FA] flex items-center justify-center font-playfair text-[16px] font-bold text-[#1B2B5E] shrink-0">
                {customerInitials}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1B2B5E]">{order.customer_name}</p>
                {order.customer_email && <p className="text-xs text-[#64748b]">{order.customer_email}</p>}
                <p className="text-xs text-[#64748b]">{order.customer_phone}</p>
              </div>
            </div>
            <div className="text-xs text-[#64748b] mt-1">
              <p className="font-semibold text-[#374151] mb-1">Delivery Address:</p>
              <p>{order.shipping_address}</p>
              <p>{order.city}, {order.province}</p>
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
            <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-3">Order Notes</h2>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
              className={`${inputCls} resize-none`} placeholder="Add internal note about this order…" />
            <button className="mt-2 px-3 py-1.5 border border-[#1B2B5E] text-[#1B2B5E] text-xs font-semibold rounded-lg hover:bg-[#EEF1FA] transition-colors">
              Save Note
            </button>
          </div>

          {/* Order Timeline */}
          <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5">
            <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4">Order Timeline</h2>
            <div className="space-y-0">
              {TIMELINE.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ${item.active ? "bg-[#059669]" : "bg-[#E2E8F0] border-2 border-[#cbd5e1]"}`} />
                    {idx < TIMELINE.length - 1 && (
                      <div className={`w-0.5 flex-1 my-1 min-h-[20px] ${item.active ? "bg-[#059669]" : "bg-[#E2E8F0]"}`} />
                    )}
                  </div>
                  <div className={`pb-4 ${idx === TIMELINE.length - 1 ? "" : ""}`}>
                    <p className={`text-[13px] font-semibold ${item.active ? "text-[#0F172A]" : "text-[#94a3b8]"}`}>{item.label}</p>
                    <p className={`text-[11px] mt-0.5 ${item.active ? "text-[#64748b]" : "text-[#94a3b8]"}`}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
