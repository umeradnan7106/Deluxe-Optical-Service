"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ordersApi } from "@/lib/api";
import useCartStore from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import { PROVINCES, CITIES_BY_PROVINCE, PAYMENT_METHODS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const STEPS = ["Delivery", "Payment", "Review"];

interface FormData {
  full_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  notes: string;
}

const BANK_DETAILS: Record<string, string> = {
  easypaisa: "Account: 0300-1234567 (Deluxe Opt)",
  jazzcash: "Account: 0301-1234567 (Deluxe Opt)",
  bank_transfer: "HBL | AC: 1234-5678-9012 | Title: Deluxe Opt Service",
};

const inputCls = (error?: string) =>
  `w-full bg-white border text-[#1a1a1a] text-sm px-3 py-2.5 rounded-[5px] outline-none focus:border-[#1B2B5E] transition-colors ${
    error ? "border-red-400" : "border-[#e2e8f0]"
  }`;
const labelCls = "text-[#6b7280] text-xs font-medium block mb-1";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, paymentMethod, setPaymentMethod, couponCode, couponDiscount, getSubtotal, getShippingFee, getPaymentDiscount, getTotal, clearCart } = useCartStore();
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    full_name: user?.full_name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    address: "",
    city: "",
    province: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const payDiscount = getPaymentDiscount();
  const total = getTotal();

  function validateStep0(): boolean {
    const e: Partial<FormData> = {};
    if (!form.full_name.trim()) e.full_name = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city) e.city = "Required";
    if (!form.province) e.province = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handlePlaceOrder() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const { data } = await ordersApi.create({
        customer_name: form.full_name,
        customer_email: form.email,
        customer_phone: form.phone,
        shipping_address: form.address,
        city: form.city,
        province: form.province,
        payment_method: paymentMethod,
        promo_code: couponCode || undefined,
        notes: form.notes || undefined,
        items: items.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          selected_lens_options: item.selected_lens_options,
          prescription: item.prescription,
        })),
      });
      clearCart();
      router.push(`/order/${data.order_number}/confirmation`);
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-[#f9fafb] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-8 pb-24 md:pb-8">
        <h1 className="font-playfair text-2xl md:text-3xl text-[#1B2B5E] font-bold mb-5 md:mb-6">Checkout</h1>

        {/* Step indicator — compact on mobile, full dots on desktop */}
        <div className="mb-6 md:mb-8">
          {/* Mobile: text indicator */}
          <div className="md:hidden flex items-center gap-2 text-sm text-[#6b7280]">
            <span className="text-[#1B2B5E] font-medium">Step {step + 1} of {STEPS.length}</span>
            <span>—</span>
            <span className="text-[#1a1a1a] font-medium">{STEPS[step]}</span>
          </div>

          {/* Desktop: dots */}
          <div className="hidden md:flex items-center">
            {STEPS.map((s, i) => {
              const completed = i < step;
              const current = i === step;
              return (
                <div key={s} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      completed ? "bg-green-500 text-white" : current ? "bg-[#1B2B5E] text-white" : "bg-[#e2e8f0] text-[#64748b]"
                    }`}>
                      {completed ? <CheckCircleIcon className="w-5 h-5" /> : i + 1}
                    </div>
                    <span className={`text-sm font-medium ${current ? "text-[#1B2B5E]" : completed ? "text-green-600" : "text-[#64748b]"}`}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`mx-3 h-0.5 w-20 rounded ${i < step ? "bg-green-500" : "bg-[#e5e7eb]"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main form */}
          <div className="flex-1">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="font-playfair text-xl text-[#1B2B5E] font-bold mb-4">Delivery Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Full Name <span className="text-red-400">*</span></label>
                      <input
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        className={inputCls(errors.full_name)}
                      />
                      {errors.full_name && <p className="text-red-500 text-xs mt-0.5">{errors.full_name}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Phone <span className="text-red-400">*</span></label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={inputCls(errors.phone)}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-0.5">{errors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Email <span className="text-red-400">*</span></label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputCls(errors.email)}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Street Address <span className="text-red-400">*</span></label>
                    <input
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="House no., street, area"
                      className={inputCls(errors.address)}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-0.5">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Province <span className="text-red-400">*</span></label>
                      <select
                        value={form.province}
                        onChange={(e) => setForm({ ...form, province: e.target.value, city: "" })}
                        className={inputCls(errors.province)}
                      >
                        <option value="">Select Province</option>
                        {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                      {errors.province && <p className="text-red-500 text-xs mt-0.5">{errors.province}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>City <span className="text-red-400">*</span></label>
                      <select
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className={inputCls(errors.city)}
                        disabled={!form.province}
                      >
                        <option value="">Select City</option>
                        {(CITIES_BY_PROVINCE[form.province] ?? []).map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.city && <p className="text-red-500 text-xs mt-0.5">{errors.city}</p>}
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Order Notes (optional)</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Special instructions for delivery…"
                      rows={3}
                      className="w-full bg-white border border-[#e2e8f0] text-[#1a1a1a] text-sm px-3 py-2.5 rounded-[5px] outline-none focus:border-[#1B2B5E] resize-none"
                    />
                  </div>
                  <Button variant="primary" size="lg" onClick={() => { if (validateStep0()) setStep(1); }}>
                    Continue to Payment
                  </Button>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="font-playfair text-xl text-[#1B2B5E] font-bold mb-4">Payment Method</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PAYMENT_METHODS.map(({ value, label, discount }) => (
                      <button
                        key={value}
                        onClick={() => setPaymentMethod(value)}
                        className={`rounded-lg border p-4 text-left transition-colors ${
                          paymentMethod === value ? "border-[#1B2B5E] bg-[#EEF1FA]" : "border-[#e5e7eb] bg-white hover:border-[#1B2B5E]/50"
                        }`}
                      >
                        <p className="text-[#1a1a1a] font-medium text-sm">{label}</p>
                        {discount > 0 && <Badge variant="orange" className="mt-1">{discount}% off</Badge>}
                        {value !== "cod" && BANK_DETAILS[value] && (
                          <p className="text-[#6b7280] text-xs mt-2">{BANK_DETAILS[value]}</p>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" size="md" onClick={() => setStep(0)}>Back</Button>
                    <Button variant="primary" size="md" onClick={() => setStep(2)}>Review Order</Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="font-playfair text-xl text-[#1B2B5E] font-bold mb-4">Review Your Order</h2>
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-4 text-sm space-y-2">
                    <h3 className="text-[#1a1a1a] font-semibold mb-2">Delivery Details</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13px]">
                      {[
                        ["Name", form.full_name],
                        ["Phone", form.phone],
                        ["Email", form.email],
                        ["Province", form.province],
                        ["City", form.city],
                      ].map(([l, v]) => (
                        <div key={l}>
                          <span className="text-[#6b7280]">{l}: </span>
                          <span className="text-[#1a1a1a] font-medium">{v}</span>
                        </div>
                      ))}
                      <div className="col-span-2">
                        <span className="text-[#6b7280]">Address: </span>
                        <span className="text-[#1a1a1a] font-medium">{form.address}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-4 text-sm">
                    <h3 className="text-[#1a1a1a] font-semibold mb-2">Payment</h3>
                    <p className="text-[#1a1a1a]">{PAYMENT_METHODS.find((m) => m.value === paymentMethod)?.label}</p>
                    {paymentMethod !== "cod" && BANK_DETAILS[paymentMethod] && (
                      <p className="text-[#6b7280] text-xs mt-1">{BANK_DETAILS[paymentMethod]}</p>
                    )}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" size="md" onClick={() => setStep(1)}>Back</Button>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handlePlaceOrder}
                      disabled={submitting}
                      fullWidth
                    >
                      {submitting ? "Placing Order…" : "Place Order"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:w-[320px] shrink-0">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-5 sticky top-24 space-y-3">
              <h3 className="font-playfair text-[20px] text-[#1B2B5E] font-bold">Order Summary</h3>
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={`${item.product_id}-${item.variant_id}`} className="flex justify-between items-start">
                    <span className="text-[#6b7280] truncate flex-1 mr-2">{item.product_name} ×{item.quantity}</span>
                    <span className="text-[#1a1a1a] shrink-0">{formatPrice((item.sale_price ?? item.base_price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#e5e7eb] pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Subtotal</span>
                  <span className="text-[#1a1a1a]">{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#6b7280]">Coupon</span>
                    <span className="text-green-600">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                {payDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#6b7280]">Payment Discount</span>
                    <span className="text-green-600">-{formatPrice(payDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : "text-[#1a1a1a]"}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold border-t border-[#e5e7eb] pt-2 mt-1">
                  <span className="text-[#1a1a1a]">Total</span>
                  <span className="text-[#1B2B5E] text-lg font-bold">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky Place Order button — only on review step */}
      {step === 2 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e5e7eb] px-4 py-3 shadow-lg">
          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="w-full bg-[#1B2B5E] hover:bg-[#243570] text-white rounded-lg py-3.5 text-sm font-medium transition-colors disabled:opacity-50 min-h-[44px]"
          >
            {submitting ? "Placing Order…" : `Place Order — ${formatPrice(total)}`}
          </button>
        </div>
      )}
    </div>
  );
}
