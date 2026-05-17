"use client";

import Link from "next/link";

const SHOP_LINKS = [
  { href: "/products?gender=men", label: "Men's Frames" },
  { href: "/products?gender=women", label: "Women's Frames" },
  { href: "/products?category=sunglasses", label: "Sunglasses" },
  { href: "/products?category=contact-lenses", label: "Contact Lenses" },
  { href: "/products?sale=true", label: "Sale" },
];

const HELP_LINKS = [
  { href: "/track-order", label: "Track Order" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact Us" },
  { href: "/prescription-guide", label: "Prescription Guide" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0F0F0F] border-t border-[#2a2a2a] mt-16">
      <div className="max-w-[1500px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-white font-['Cormorant_Garamond'] text-2xl font-semibold">
              Deluxe<span className="text-[#E8670A]">Opt</span>
            </span>
            <p className="mt-3 text-gray-400 text-sm leading-relaxed">
              Premium eyewear for every face. Pakistan-wide delivery with 15-day easy returns.
            </p>
            <div className="flex gap-3 mt-4">
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="text-gray-400 hover:text-[#E8670A] transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="text-gray-400 hover:text-[#E8670A] transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Shop</h3>
            <ul className="space-y-2">
              {SHOP_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-[#E8670A] text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Help</h3>
            <ul className="space-y-2">
              {HELP_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-[#E8670A] text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-2">
              {COMPANY_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-[#E8670A] text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-3">Get deals and new arrivals in your inbox.</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded-[5px] outline-none focus:border-[#E8670A]"
              />
              <button
                type="submit"
                className="bg-[#E8670A] hover:bg-[#C45408] text-white text-sm font-medium py-2 rounded-[5px] transition-colors"
              >
                Subscribe
              </button>
            </form>
            {/* Payment icons */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {["EasyPaisa", "JazzCash", "COD"].map((m) => (
                <span key={m} className="text-[10px] bg-[#2a2a2a] text-gray-400 px-2 py-1 rounded">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-[#2a2a2a] py-4">
        <p className="text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Deluxe Opt Service. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
