"use client";

import { useState } from "react";
import {
  ChatBubbleLeftEllipsisIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";

const SUBJECTS = [
  "Order Inquiry",
  "Prescription Help",
  "Returns & Exchanges",
  "Product Information",
  "Shipping & Delivery",
  "Other",
];

const INFO_BLOCKS = [
  {
    Icon: ChatBubbleLeftEllipsisIcon,
    label: "WhatsApp",
    value: "+92 300 000 0000",
    sub: "Chat with us anytime",
    href: "https://wa.me/923000000000",
  },
  {
    Icon: EnvelopeIcon,
    label: "Email",
    value: "support@deluxeopt.pk",
    sub: "We reply within 24 hours",
    href: "mailto:support@deluxeopt.pk",
  },
  {
    Icon: MapPinIcon,
    label: "Location",
    value: "Lahore, Pakistan",
    sub: "Pakistan-wide delivery",
    href: null,
  },
  {
    Icon: ClockIcon,
    label: "Working Hours",
    value: "Mon – Sat, 9am – 7pm",
    sub: "Sundays: 11am – 5pm",
    href: null,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#111111] border-b border-[#2a2a2a] py-12 md:py-20">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-3">Get in Touch</p>
          <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl lg:text-6xl text-white font-semibold mb-4">Contact Us</h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">
            Have a question about your order or need help choosing the right frames? We&apos;re here for you.
          </p>
        </div>
      </section>

      {/* 2-col */}
      <section className="py-10 md:py-16">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Form */}
            <div className="bg-white rounded-xl p-5 md:p-8 border border-gray-200 shadow-sm">
              <h2 className="text-gray-900 text-xl font-semibold mb-6">Send us a Message</h2>
              {sent ? (
                <div className="text-center py-12">
                  <p className="text-[#E8670A] text-2xl font-semibold mb-2">Message Sent!</p>
                  <p className="text-gray-600">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Full Name *</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 min-h-[44px] text-gray-900 text-sm focus:outline-none focus:border-[#E8670A]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Phone</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        type="tel"
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 min-h-[44px] text-gray-900 text-sm focus:outline-none focus:border-[#E8670A]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">Email *</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      required
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 min-h-[44px] text-gray-900 text-sm focus:outline-none focus:border-[#E8670A]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 min-h-[44px] text-gray-900 text-sm focus:outline-none focus:border-[#E8670A]"
                    >
                      <option value="">Select a subject…</option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-[#E8670A] resize-none"
                    />
                  </div>
                  <Button variant="primary" size="md" fullWidth type="submit">Send Message</Button>
                </form>
              )}
            </div>

            {/* Info blocks */}
            <div className="space-y-4">
              {INFO_BLOCKS.map(({ Icon, label, value, sub, href }) => (
                <div key={label} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#E8670A]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#E8670A]" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-gray-900 font-medium hover:text-[#E8670A] transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-gray-900 font-medium">{value}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-0.5">{sub}</p>
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
