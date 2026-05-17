"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import useCartStore from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import { WHATSAPP_URL } from "@/lib/constants";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <header className="bg-[#0F0F0F] border-b-2 border-[#E8670A] sticky top-0 z-50">
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
        {/* Mobile: hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 text-white font-['Cormorant_Garamond'] text-2xl font-semibold tracking-wide">
          Deluxe<span className="text-[#E8670A]">Opt</span>
        </Link>

        {/* Desktop: search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-auto">
          <form
            className="flex w-full"
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) window.location.href = `/products?q=${encodeURIComponent(query)}`;
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for frames, sunglasses…"
              className="flex-1 bg-[#1a1a1a] text-white placeholder-gray-500 text-sm px-4 py-2 rounded-l-[5px] outline-none focus:ring-1 focus:ring-[#E8670A]"
            />
            <button
              type="submit"
              className="bg-[#E8670A] hover:bg-[#C45408] px-3 rounded-r-[5px] text-white"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* WhatsApp */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 bg-[#25d366] hover:bg-[#1ebe5d] text-white text-xs font-medium px-3 py-2 rounded-[5px] transition-colors"
          >
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.847L.057 23.999l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.36-.213-3.72.976.994-3.624-.234-.372A9.818 9.818 0 1112 21.818z" />
            </svg>
            WhatsApp
          </a>

          {/* Mobile: search toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setSearchOpen((o) => !o)}
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>

          {/* Wishlist */}
          <Link href="/wishlist" className="text-white hover:text-[#E8670A] transition-colors" aria-label="Wishlist">
            <HeartIcon className="w-6 h-6" />
          </Link>

          {/* Account */}
          <Link
            href={isAuthenticated ? "/account" : "/auth/login"}
            className="text-white hover:text-[#E8670A] transition-colors"
            aria-label="Account"
          >
            <UserIcon className="w-6 h-6" />
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative text-white hover:text-[#E8670A] transition-colors" aria-label="Cart">
            <ShoppingCartIcon className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#E8670A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile: search bar */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <form
            className="flex"
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) window.location.href = `/products?q=${encodeURIComponent(query)}`;
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="flex-1 bg-[#1a1a1a] text-white placeholder-gray-500 text-sm px-4 py-2 rounded-l-[5px] outline-none focus:ring-1 focus:ring-[#E8670A]"
              autoFocus
            />
            <button type="submit" className="bg-[#E8670A] px-3 rounded-r-[5px] text-white" aria-label="Search">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
