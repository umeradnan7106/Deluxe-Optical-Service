import type { Metadata } from "next";
import { TruckIcon, ArrowPathIcon, CurrencyDollarIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Deluxe Opt Service shipping policy, delivery timelines, and easy returns information.",
};

const DELIVERY_STEPS = [
  { step: "1", title: "Order Confirmed", desc: "You receive an email confirmation immediately after placing your order." },
  { step: "2", title: "Optical Review", desc: "Our optical team verifies your prescription (if applicable) within 24 hours." },
  { step: "3", title: "Lens Crafting", desc: "Your lenses are precision-cut and fitted to your chosen frames in 1–2 days." },
  { step: "4", title: "Dispatched", desc: "Your order is dispatched with a tracking number via our courier partner." },
  { step: "5", title: "Delivered", desc: "Your eyewear arrives at your doorstep in 3–5 business days." },
];

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#1B2B5E] py-12 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none" />
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 text-center relative">
          <p className="text-[#C9A84C] text-[11px] font-semibold uppercase tracking-[.14em] mb-3">Policies</p>
          <h1 className="font-playfair text-3xl md:text-5xl lg:text-6xl text-white font-bold mb-4">
            Shipping & Returns
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto">
            Fast, tracked delivery across Pakistan — and a hassle-free returns policy if something isn&apos;t right.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 space-y-6 md:space-y-10">

          {/* Free Shipping Banner */}
          <div className="bg-[#EEF1FA] rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 border border-[#1B2B5E]/20">
            <div className="w-12 h-12 rounded-full bg-[#1B2B5E]/10 flex items-center justify-center shrink-0">
              <TruckIcon className="w-6 h-6 text-[#1B2B5E]" />
            </div>
            <div>
              <p className="text-[#1B2B5E] font-semibold text-lg">Free Delivery on Orders Over Rs. 3,000</p>
              <p className="text-[#64748b] text-sm">
                Orders below Rs. 3,000 are charged a flat shipping fee of Rs. 200, delivered within 3–5 business days anywhere in Pakistan.
              </p>
            </div>
          </div>

          {/* Delivery Policy */}
          <div className="bg-white rounded-xl p-5 md:p-8 border border-[#e2e8f0]">
            <div className="flex items-center gap-3 mb-6">
              <TruckIcon className="w-6 h-6 text-[#1B2B5E]" />
              <h2 className="font-playfair text-[#1B2B5E] text-xl font-bold">Delivery Policy</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-gray-500 text-sm mb-1">Standard Delivery</p>
                <p className="text-gray-900 font-medium">3–5 Business Days</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Shipping Fee</p>
                <p className="text-gray-900 font-medium">Rs. 200 (Free over Rs. 3,000)</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Coverage</p>
                <p className="text-gray-900 font-medium">All cities across Pakistan</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Order Tracking</p>
                <p className="text-gray-900 font-medium">Via email + tracking page</p>
              </div>
            </div>

            {/* Timeline */}
            <h3 className="text-gray-900 font-medium mb-4">Your Order Journey</h3>
            <div className="relative">
              <div className="absolute left-5 top-6 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-6">
                {DELIVERY_STEPS.map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4 relative">
                    <div className="w-10 h-10 rounded-full bg-[#1B2B5E] flex items-center justify-center shrink-0 text-white text-sm font-bold z-10">
                      {step}
                    </div>
                    <div className="pt-2">
                      <p className="text-[#1B2B5E] font-medium text-sm">{title}</p>
                      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Returns Policy */}
          <div className="bg-white rounded-xl p-8 border border-[#e2e8f0]">
            <div className="flex items-center gap-3 mb-6">
              <ArrowPathIcon className="w-6 h-6 text-[#1B2B5E]" />
              <h2 className="font-playfair text-[#1B2B5E] text-xl font-bold">Returns & Exchanges</h2>
            </div>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                We offer a <span className="text-gray-900 font-medium">15-day return window</span> from the date of delivery. If your order arrives damaged, defective, or incorrect, we will arrange a full replacement or refund at no cost to you.
              </p>
              <p>
                For prescription orders, returns are accepted if the lenses were manufactured incorrectly according to your prescription. Frame-only exchanges are accepted for unworn, undamaged items in their original packaging.
              </p>
              <p>
                To initiate a return, contact our support team via WhatsApp or email with your order number and photos of the issue. Our team will guide you through the process within 24 hours.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { Icon: ArrowPathIcon, label: "15-Day Window", sub: "From delivery date" },
                { Icon: CurrencyDollarIcon, label: "Full Refund", sub: "For defective items" },
                { Icon: ShieldCheckIcon, label: "Free Exchange", sub: "Incorrect prescriptions" },
              ].map(({ Icon, label, sub }) => (
                <div key={label} className="bg-[#F5F7FF] rounded-lg p-4 flex items-center gap-3 border border-[#e2e8f0]">
                  <Icon className="w-5 h-5 text-[#1B2B5E] shrink-0" />
                  <div>
                    <p className="text-gray-900 text-sm font-medium">{label}</p>
                    <p className="text-gray-500 text-xs">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
