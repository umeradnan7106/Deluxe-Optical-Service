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
      <section className="bg-[#111111] border-b border-[#2a2a2a] py-20">
        <div className="max-w-[1500px] mx-auto px-6 text-center">
          <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-3">Help Centre</p>
          <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-white font-semibold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Find answers to the most common questions about our products, ordering, and delivery.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-[1500px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Category nav */}
            <aside className="lg:w-56 shrink-0">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Categories</p>
              <nav className="space-y-1">
                {CATEGORIES.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setCategory(key)}
                    className={`w-full text-left px-4 py-2.5 rounded text-sm transition-colors ${
                      category === key
                        ? "bg-[#E8670A] text-white font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
                    <div key={faq.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <button
                        onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left"
                      >
                        <span className="text-gray-900 text-sm font-medium pr-4">{faq.question}</span>
                        <ChevronDownIcon
                          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
                            openId === faq.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openId === faq.id && (
                        <div className="px-5 pb-5 border-t border-gray-200">
                          <p className="text-gray-600 text-sm leading-relaxed pt-4">{faq.answer}</p>
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
