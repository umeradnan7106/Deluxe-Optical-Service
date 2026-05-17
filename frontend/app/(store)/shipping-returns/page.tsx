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
      <section className="bg-[#111111] border-b border-[#2a2a2a] py-20">
        <div className="max-w-[1500px] mx-auto px-6 text-center">
          <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-3">Policies</p>
          <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-white font-semibold mb-4">
            Shipping & Returns
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Fast, tracked delivery across Pakistan — and a hassle-free returns policy if something isn't right.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1500px] mx-auto px-6 space-y-10">

          {/* Free Shipping Banner */}
          <div className="bg-[#FFF0E6] rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 border border-[#E8670A]/30">
            <div className="w-12 h-12 rounded-full bg-[#E8670A]/20 flex items-center justify-center shrink-0">
              <TruckIcon className="w-6 h-6 text-[#E8670A]" />
            </div>
            <div>
              <p className="text-[#C0510A] font-semibold text-lg">Free Delivery on Orders Over Rs. 3,000</p>
              <p className="text-[#A0440A] text-sm">
                Orders below Rs. 3,000 are charged a flat shipping fee of Rs. 200, delivered within 3–5 business days anywhere in Pakistan.
              </p>
            </div>
          </div>

          {/* Delivery Policy */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <TruckIcon className="w-6 h-6 text-[#E8670A]" />
              <h2 className="text-gray-900 text-xl font-semibold">Delivery Policy</h2>
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
                    <div className="w-10 h-10 rounded-full bg-[#E8670A] flex items-center justify-center shrink-0 text-white text-sm font-bold z-10">
                      {step}
                    </div>
                    <div className="pt-2">
                      <p className="text-gray-900 font-medium text-sm">{title}</p>
                      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Returns Policy */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <ArrowPathIcon className="w-6 h-6 text-[#E8670A]" />
              <h2 className="text-gray-900 text-xl font-semibold">Returns & Exchanges</h2>
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
                <div key={label} className="bg-gray-50 rounded-lg p-4 flex items-center gap-3 border border-gray-200">
                  <Icon className="w-5 h-5 text-[#E8670A] shrink-0" />
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
