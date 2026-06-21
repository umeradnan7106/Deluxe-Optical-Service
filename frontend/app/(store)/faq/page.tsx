"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { faqsApi } from "@/lib/api";
import type { FAQ } from "@/types";

const CATEGORIES = [
  { key: "all", label: "All Questions" },
  { key: "orders", label: "Orders & Delivery" },
  { key: "prescription", label: "Prescription & Lenses" },
  { key: "payments", label: "Payments & Returns" },
  { key: "fitting", label: "Frame Fitting" },
  { key: "general", label: "General" },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [category, setCategory] = useState("all");
  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setOpenId(null);
    faqsApi.list(category === "all" ? undefined : category)
      .then((res) => setFaqs(res.data))
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#1B2B5E] py-12 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"/>
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 text-center relative">
          <p className="text-[#C9A84C] text-[11px] font-semibold uppercase tracking-[.14em] mb-3">Help Centre</p>
          <h1 className="font-playfair text-3xl md:text-5xl lg:text-6xl text-white font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto">
            Find answers to the most common questions about our products, ordering, and delivery.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-16">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          {/* Mobile category pills */}
          <div className="lg:hidden flex gap-2 overflow-x-auto scrollbar-none pb-3 mb-5 -mx-4 px-4">
            {CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium min-h-[40px] transition-colors ${
                  category === key
                    ? "bg-[#1B2B5E] text-white"
                    : "bg-[#F5F7FF] text-[#64748b] hover:bg-[#EEF1FA]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Desktop Category nav */}
            <aside className="hidden lg:block lg:w-56 shrink-0">
              <p className="text-[#64748b] text-xs uppercase tracking-widest mb-3">Categories</p>
              <nav className="space-y-1">
                {CATEGORIES.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setCategory(key)}
                    className={`w-full text-left px-4 py-2.5 rounded text-sm transition-colors ${
                      category === key
                        ? "bg-[#1B2B5E] text-white font-medium"
                        : "text-[#64748b] hover:bg-[#EEF1FA] hover:text-[#1B2B5E]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Accordion */}
            <div className="flex-1">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-200 rounded-lg h-14 animate-pulse" />
                  ))}
                </div>
              ) : faqs.length === 0 ? (
                <p className="text-gray-500 text-sm">No FAQs found in this category.</p>
              ) : (
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="bg-white rounded-lg overflow-hidden border border-[#e2e8f0]">
                      <button
                        onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left"
                      >
                        <span className="text-[#1B2B5E] text-sm font-medium pr-4">{faq.question}</span>
                        <ChevronDownIcon
                          className={`w-4 h-4 text-[#64748b] shrink-0 transition-transform ${
                            openId === faq.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openId === faq.id && (
                        <div className="px-5 pb-5 border-t border-[#e2e8f0]">
                          <p className="text-[#64748b] text-sm leading-relaxed pt-4">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
