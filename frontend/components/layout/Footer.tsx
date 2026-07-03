"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const SHOP_LINKS = [
  { href: "/products?gender=men", label: "Men's Frames" },
  { href: "/products?gender=women", label: "Women's Frames" },
  { href: "/products?category=sunglasses", label: "Sunglasses" },
  { href: "/products?category=prescription", label: "Prescription" },
  { href: "/products?sale=true", label: "Sale" },
];

const HELP_LINKS = [
  { href: "/tracking", label: "Track Order" },
  { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Contact Us" },
  { href: "/shipping-returns", label: "Shipping & Returns" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/blogs", label: "Blog" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/923001234567",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

function ColSection({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#1e293b] md:border-none">
      <button
        className="md:hidden w-full flex items-center justify-between py-4 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <h5 className="text-[#C9A84C] font-semibold text-[10px] uppercase tracking-widest">{title}</h5>
        <ChevronDownIcon className={cn("w-4 h-4 text-white/55 transition-transform", open && "rotate-180")} />
      </button>
      <h5 className="hidden md:block text-[#C9A84C] font-semibold text-[10px] uppercase tracking-widest mb-4">{title}</h5>
      <ul className={cn("space-y-2 pb-4 md:pb-0", !open && "hidden md:block")}>
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className="text-white/55 hover:text-[#C9A84C] text-[13px] transition-colors block">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  return (
    <footer className="bg-[#0f1829] border-t-[3px] border-[#C9A84C]">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-10 md:py-14">

        {/* ── MOBILE: stacked ─── */}
        <div className="md:hidden space-y-0">
          <div className="pb-6 border-b border-[#1e293b]">
            <span className="font-playfair text-white text-2xl font-bold">
              Deluxe<span className="text-[#C9A84C]">Opt</span>
            </span>
            <p className="mt-2 text-white/55 text-[13px] leading-relaxed">
              Premium eyewear for every face. Pakistan-wide delivery with 7-day easy returns.
            </p>
            <div className="flex gap-3 mt-4">
              {SOCIALS.map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-8 h-8 bg-[#1e293b] rounded-lg flex items-center justify-center text-white/55 hover:bg-[#1B2B5E] hover:text-[#C9A84C] transition-all">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <ColSection title="Shop" links={SHOP_LINKS} />
          <ColSection title="Help" links={HELP_LINKS} />
          <ColSection title="Company" links={COMPANY_LINKS} />

          <div className="border-b border-[#1e293b]">
            <button
              className="w-full flex items-center justify-between py-4 text-left"
              onClick={() => setNewsletterOpen((o) => !o)}
              aria-expanded={newsletterOpen}
            >
              <h5 className="text-[#C9A84C] font-semibold text-[10px] uppercase tracking-widest">Stay Updated</h5>
              <ChevronDownIcon className={cn("w-4 h-4 text-white/55 transition-transform", newsletterOpen && "rotate-180")} />
            </button>
            {newsletterOpen && (
              <div className="pb-4">
                <p className="text-white/55 text-[13px] mb-3">Get deals and new arrivals in your inbox.</p>
                <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 bg-[#1e293b] border border-[#334155] text-white text-sm px-3 h-10 rounded-lg outline-none focus:border-[#C9A84C] placeholder-[#475569]"
                  />
                  <button type="submit" className="bg-[#C9A84C] hover:bg-[#A8893A] text-white text-sm font-semibold px-4 h-10 rounded-lg transition-colors shrink-0">
                    Subscribe
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-2 pt-6 flex-wrap">
            {["EasyPaisa", "JazzCash", "Bank Transfer", "COD"].map((m) => (
              <span key={m} className="text-[10px] bg-[#1e293b] text-white/55 px-3 py-1 rounded border border-[#334155] font-semibold">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* ── DESKTOP: 5-column grid ─── */}
        <div className="hidden md:grid grid-cols-5 gap-10">
          <div>
            <span className="font-playfair text-white text-2xl font-bold">
              Deluxe<span className="text-[#C9A84C]">Opt</span>
            </span>
            <p className="mt-3 text-white/55 text-sm leading-relaxed">
              Premium eyewear for every face. Pakistan-wide delivery with 7-day easy returns.
            </p>
            <div className="flex gap-2 mt-4">
              {SOCIALS.map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-8 h-8 bg-[#1e293b] rounded-lg flex items-center justify-center text-white/55 hover:bg-[#1B2B5E] hover:text-[#C9A84C] transition-all">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-[#C9A84C] font-semibold text-[10px] uppercase tracking-widest mb-4">Shop</h5>
            <ul className="space-y-2">
              {SHOP_LINKS.map(({ href, label }) => (
                <li key={href}><Link href={href} className="text-white/55 hover:text-[#C9A84C] text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-[#C9A84C] font-semibold text-[10px] uppercase tracking-widest mb-4">Help</h5>
            <ul className="space-y-2">
              {HELP_LINKS.map(({ href, label }) => (
                <li key={href}><Link href={href} className="text-white/55 hover:text-[#C9A84C] text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-[#C9A84C] font-semibold text-[10px] uppercase tracking-widest mb-4">Company</h5>
            <ul className="space-y-2">
              {COMPANY_LINKS.map(({ href, label }) => (
                <li key={href}><Link href={href} className="text-white/55 hover:text-[#C9A84C] text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-[#C9A84C] font-semibold text-[10px] uppercase tracking-widest mb-4">Stay Updated</h5>
            <p className="text-white/55 text-sm mb-3">Get deals and new arrivals in your inbox.</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="bg-[#1e293b] border border-[#334155] text-white text-sm px-3 py-2.5 rounded-lg outline-none focus:border-[#C9A84C] placeholder-[#475569]"
              />
              <button type="submit" className="bg-[#C9A84C] hover:bg-[#A8893A] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
                Subscribe
              </button>
            </form>
            <div className="flex gap-2 mt-4 flex-wrap">
              {["EasyPaisa", "JazzCash", "COD"].map((m) => (
                <span key={m} className="text-[10px] bg-[#1e293b] text-white/55 px-2 py-1 rounded border border-[#334155] font-semibold">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1e293b] py-4 px-4">
        <p className="text-center text-white/40 text-xs">
          © {new Date().getFullYear()} Deluxe Opt Service. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
