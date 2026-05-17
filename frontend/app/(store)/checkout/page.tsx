"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const BANK_DETAILS: Record<string, { title: string; details: string }> = {
  easypaisa: { title: "EasyPaisa", details: "Account: 0300-1234567 (Deluxe Opt)" },
  jazzcash: { title: "JazzCash", details: "Account: 0301-1234567 (Deluxe Opt)" },
  bank_transfer: { title: "Bank Transfer", details: "HBL | AC: 1234-5678-9012 | Title: Deluxe Opt Service" },
};

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

  const F = ({ label, name, type = "text", placeholder, required }: {
    label: string; name: keyof FormData; type?: string; placeholder?: string; required?: boolean;
  }) => (
    <div>
      <label className="text-gray-300 text-xs font-medium block mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        placeholder={placeholder}
        className={`w-full bg-[#2a2a2a] border text-white text-sm px-3 py-2.5 rounded-[5px] outline-none focus:border-[#E8670A] transition-colors ${
          errors[name] ? "border-red-500" : "border-[#3a3a3a]"
        }`}
      />
      {errors[name] && <p className="text-red-400 text-xs mt-0.5">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-8">
      <h1 className="text-white text-2xl font-semibold mb-6">Checkout</h1>

      {/* Step progress */}
      <div className="flex gap-0 mb-8 border-b border-[#2a2a2a]">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`px-6 py-3 text-sm font-medium border-b-2 -mb-px ${
              i === step ? "border-[#E8670A] text-[#E8670A]"
              : i < step ? "border-green-500 text-green-400"
              : "border-transparent text-gray-500"
            }`}
          >
            {i + 1}. {s}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main form */}
        <div className="flex-1">
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <F label="Full Name" name="full_name" required />
                <F label="Phone" name="phone" type="tel" required />
              </div>
              <F label="Email" name="email" type="email" required />
              <F label="Street Address" name="address" placeholder="House no., street, area" required />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-xs font-medium block mb-1">Province<span className="text-red-400 ml-0.5">*</span></label>
                  <select
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value, city: "" })}
                    className={`w-full bg-[#2a2a2a] border text-white text-sm px-3 py-2.5 rounded-[5px] outline-none focus:border-[#E8670A] ${errors.province ? "border-red-500" : "border-[#3a3a3a]"}`}
                  >
                    <option value="">Select Province</option>
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.province && <p className="text-red-400 text-xs mt-0.5">{errors.province}</p>}
                </div>
                <div>
                  <label className="text-gray-300 text-xs font-medium block mb-1">City<span className="text-red-400 ml-0.5">*</span></label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={`w-full bg-[#2a2a2a] border text-white text-sm px-3 py-2.5 rounded-[5px] outline-none focus:border-[#E8670A] ${errors.city ? "border-red-500" : "border-[#3a3a3a]"}`}
                    disabled={!form.province}
                  >
                    <option value="">Select City</option>
                    {(CITIES_BY_PROVINCE[form.province] ?? []).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <p className="text-red-400 text-xs mt-0.5">{errors.city}</p>}
                </div>
              </div>
              <div>
                <label className="text-gray-300 text-xs font-medium block mb-1">Order Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Special instructions for delivery…"
                  rows={3}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white text-sm px-3 py-2.5 rounded-[5px] outline-none focus:border-[#E8670A] resize-none"
                />
              </div>
              <Button variant="primary" size="lg" onClick={() => { if (validateStep0()) setStep(1); }}>
                Continue to Payment
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map(({ value, label, discount }) => (
                  <button
                    key={value}
                    onClick={() => setPaymentMethod(value)}
                    className={`rounded border p-4 text-left transition-colors ${
                      paymentMethod === value ? "border-[#E8670A] bg-[#FFF0E6]/5" : "border-[#2a2a2a] hover:border-[#E8670A]/50"
                    }`}
                  >
                    <p className="text-white font-medium text-sm">{label}</p>
                    {discount > 0 && <Badge variant="orange" className="mt-1">{discount}% off</Badge>}
                    {value !== "cod" && BANK_DETAILS[value] && (
                      <p className="text-gray-500 text-xs mt-2">{BANK_DETAILS[value].details}</p>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="md" onClick={() => setStep(0)}>Back</Button>
                <Button variant="primary" size="md" onClick={() => setStep(2)}>Review Order</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-[#1a1a1a] rounded p-4 text-sm space-y-2">
                <h3 className="text-white font-semibold mb-3">Delivery Details</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    ["Name", form.full_name],
                    ["Phone", form.phone],
                    ["Email", form.email],
                    ["Address", form.address],
                    ["City", form.city],
                    ["Province", form.province],
                  ].map(([l, v]) => (
                    <div key={l}><span className="text-gray-400">{l}: </span><span className="text-white">{v}</span></div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
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

        {/* Sticky order summary sidebar */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-[#1a1a1a] rounded p-5 sticky top-24 space-y-3">
            <h3 className="text-white font-semibold mb-2">Order Summary</h3>
            {items.map((item) => (
              <div key={`${item.product_id}-${item.variant_id}`} className="flex justify-between text-sm">
                <span className="text-gray-300 truncate flex-1">{item.product_name} ×{item.quantity}</span>
                <span className="text-white ml-2">{formatPrice((item.sale_price ?? item.base_price) * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-[#2a2a2a] pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span className="text-white">{formatPrice(subtotal)}</span></div>
              {couponDiscount > 0 && <div className="flex justify-between"><span className="text-gray-400">Coupon</span><span className="text-green-400">-{formatPrice(couponDiscount)}</span></div>}
              {payDiscount > 0 && <div className="flex justify-between"><span className="text-gray-400">Payment Discount</span><span className="text-green-400">-{formatPrice(payDiscount)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-400">Shipping</span><span className={shipping === 0 ? "text-green-400" : "text-white"}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-bold border-t border-[#2a2a2a] pt-2">
                <span className="text-white">Total</span>
                <span className="text-[#E8670A] text-lg">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
