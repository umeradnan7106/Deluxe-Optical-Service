"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

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

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [tracking, setTracking] = useState("");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    adminApi.orders.detail(Number(id)).then(({ data }) => {
      const o = data as AdminOrderDetail;
      setOrder(o);
      setTracking(o.tracking_number ?? "");
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
        {Array.from({ length: 4 }, (_, i) => <div key={i} className="bg-gray-100 rounded p-5 animate-pulse h-32" />)}
      </div>
    );
  }

  const allowedTransitions = VALID_TRANSITIONS[order.status] ?? [];
  let prescriptionData: Record<string, unknown> | null = null;
  try { prescriptionData = order.prescription_data ? JSON.parse(order.prescription_data) : null; } catch { /* */ }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-3xl text-gray-900 font-semibold">{order.order_number}</h1>
          <p className="text-gray-500 text-sm mt-0.5">Placed {formatDate(order.created_at)}</p>
        </div>
        <button onClick={() => router.push("/admin/orders")} className="text-gray-500 text-sm hover:text-gray-900">
          ← Back to Orders
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer Info */}
          <div className="bg-white border border-gray-200 shadow-sm rounded p-5">
            <h2 className="text-gray-500 text-xs uppercase tracking-wide mb-3">Customer</h2>
            <p className="text-gray-900 font-medium">{order.customer_name}</p>
            <p className="text-gray-700 text-sm">{order.customer_phone}</p>
            {order.customer_email && <p className="text-gray-500 text-sm">{order.customer_email}</p>}
            <p className="text-gray-500 text-sm mt-2">{order.shipping_address}</p>
            <p className="text-gray-500 text-sm">{order.city}, {order.province}</p>
            {order.notes && <p className="text-gray-500 text-sm mt-2 italic">Note: {order.notes}</p>}
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-200 shadow-sm rounded p-5">
            <h2 className="text-gray-500 text-xs uppercase tracking-wide mb-3">Order Items</h2>
            {order.items.map((item, idx) => (
              <div key={idx} className="border-b border-gray-200 last:border-0 py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-900 font-medium">{item.product_name}</p>
                    <p className="text-gray-500 text-sm">{item.color_name}{item.sku_variant ? ` · ${item.sku_variant}` : ""}</p>
                    {item.lens_option_names?.length > 0 && (
                      <p className="text-gray-500 text-xs mt-1">Lenses: {item.lens_option_names.join(" · ")}</p>
                    )}
                    {item.prescription_method && (
                      <p className="text-gray-500 text-xs">Prescription: {item.prescription_method}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900">×{item.quantity}</p>
                    <p className="text-[#E8670A]">{formatPrice((item.frame_price + item.lens_options_price) * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lens & Prescription */}
          {(order.items.some((i) => i.lens_option_names?.length > 0) || order.prescription_method) && (
            <div className="bg-white border border-gray-200 shadow-sm rounded p-5">
              <h2 className="text-gray-500 text-xs uppercase tracking-wide mb-3">Lens & Prescription</h2>

              {order.items.filter((i) => i.lens_option_names?.length > 0).map((item, idx) => (
                <div key={idx} className="mb-3">
                  <p className="text-gray-700 text-sm font-medium">{item.product_name}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {item.lens_option_names.map((name, j) => (
                      <span key={j} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">{name}</span>
                    ))}
                  </div>
                </div>
              ))}

              {order.prescription_method && (
                <div className={order.items.some((i) => i.lens_option_names?.length > 0) ? "mt-3 pt-3 border-t border-gray-100" : ""}>
                  <p className="text-gray-700 text-sm mb-2">
                    Method: <span className="text-gray-900 capitalize">{order.prescription_method.replace(/_/g, " ")}</span>
                  </p>
                  {order.prescription_url && (
                    <a href={order.prescription_url} target="_blank" rel="noopener noreferrer"
                      className="text-[#E8670A] text-sm hover:underline block mb-3">View uploaded prescription</a>
                  )}
                  {prescriptionData && (
                    <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left text-gray-500 pb-1.5 pr-3 font-medium">Field</th>
                          <th className="text-left text-gray-500 pb-1.5 font-medium">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(prescriptionData).flatMap(([k, v]) =>
                          typeof v === "object" && v !== null
                            ? Object.entries(v as Record<string, unknown>).map(([sk, sv]) => (
                                <tr key={`${k}-${sk}`} className="border-b border-gray-100">
                                  <td className="py-1.5 pr-3 text-gray-500 capitalize">{`${k} ${sk}`.replace(/_/g, " ")}</td>
                                  <td className="py-1.5 text-gray-900">{String(sv ?? "—")}</td>
                                </tr>
                              ))
                            : [(
                                <tr key={k} className="border-b border-gray-100">
                                  <td className="py-1.5 pr-3 text-gray-500 capitalize">{k.replace(/_/g, " ")}</td>
                                  <td className="py-1.5 text-gray-900">{String(v ?? "—")}</td>
                                </tr>
                              )]
                        )}
                      </tbody>
                    </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Payment Strip */}
          <div className="bg-white border border-gray-200 shadow-sm rounded p-5">
            <h2 className="text-gray-500 text-xs uppercase tracking-wide mb-3">Payment</h2>
            <p className="text-gray-700 text-sm mb-3">{PM_LABELS[order.payment_method] ?? order.payment_method}</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.shipping_fee > 0 && <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{formatPrice(order.shipping_fee)}</span></div>}
              {order.coupon_discount > 0 && <div className="flex justify-between text-green-400"><span>Coupon ({order.promo_code})</span><span>-{formatPrice(order.coupon_discount)}</span></div>}
              {order.payment_discount > 0 && <div className="flex justify-between text-green-400"><span>Online discount</span><span>-{formatPrice(order.payment_discount)}</span></div>}
              <div className="flex justify-between text-gray-900 font-semibold border-t border-gray-200 pt-2 mt-2">
                <span>Total</span><span className="text-[#E8670A]">{formatPrice(order.total)}</span>
              </div>
            </div>
            <div className="mt-3">
              <Badge variant={order.payment_status === "paid" ? "green" : "orange"}>
                Payment: {order.payment_status}
              </Badge>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-white border border-gray-200 shadow-sm rounded p-5">
            <h2 className="text-gray-500 text-xs uppercase tracking-wide mb-3">Order Status</h2>
            <Badge variant={STATUS_BADGE[order.status] ?? "gray"}>{order.status}</Badge>
            {allowedTransitions.length > 0 && (
              <div className="mt-3 space-y-2">
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[16px] md:text-sm px-3 py-2 rounded outline-none focus:border-[#E8670A] min-h-[44px]">
                  <option value="">Select new status…</option>
                  {allowedTransitions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <Button variant="primary" size="sm" onClick={handleStatusUpdate} disabled={!newStatus || updating}>
                  {updating ? "Updating…" : "Update Status"}
                </Button>
              </div>
            )}
          </div>

          {/* Tracking Number */}
          {(order.status === "shipped" || order.status === "delivered" || order.tracking_number) && (
            <div className="bg-white border border-gray-200 shadow-sm rounded p-5">
              <h2 className="text-gray-500 text-xs uppercase tracking-wide mb-3">Tracking Number</h2>
              <input value={tracking} onChange={(e) => setTracking(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[16px] md:text-sm px-3 py-2 rounded outline-none focus:border-[#E8670A] mb-2 min-h-[44px]"
                placeholder="Enter tracking number…" />
              <Button variant="outline" size="sm" onClick={handleTrackingUpdate} disabled={updating}>
                Save Tracking
              </Button>
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}
