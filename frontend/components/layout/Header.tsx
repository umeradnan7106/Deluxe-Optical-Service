"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import useWishlistStore from "@/store/wishlistStore";
import { productsApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { ProductListItem } from "@/types";

export default function Header() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductListItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const accountHref = !isAuthenticated ? "/auth/login" : isAdmin ? "/admin" : "/account/orders";
  const loadWishlist = useWishlistStore((s) => s.load);
  const wishlistLoaded = useWishlistStore((s) => s.loaded);

  useEffect(() => {
    if (isAuthenticated && !wishlistLoaded) {
      loadWishlist();
    }
  }, [isAuthenticated, wishlistLoaded, loadWishlist]);

  const fetchSuggestions = useCallback((q: string) => {
    if (q.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    productsApi.search(q)
      .then(({ data }) => {
        const items = (data as { items?: ProductListItem[] }).items ?? (Array.isArray(data) ? data : []);
        setSuggestions(items.slice(0, 5));
        setShowSuggestions(true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, fetchSuggestions]);

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowSuggestions(false);
    if (query.trim()) router.push(`/products?q=${encodeURIComponent(query)}`);
  }

  function handleSuggestionClick(slug: string) {
    setShowSuggestions(false);
    setQuery("");
    router.push(`/products/${slug}`);
  }

  function handleWishlistClick(e: React.MouseEvent) {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push("/auth/login");
    }
  }

  return (
    <header className="bg-white border-b border-[#e5e7eb] sticky top-0 z-50">
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
        {/* Mobile: hamburger */}
        <button
          className="md:hidden text-[#1a1a1a]"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 text-[#0F0F0F] font-['Cormorant_Garamond'] text-2xl font-semibold tracking-wide">
          Deluxe<span className="text-[#E8670A]">Opt</span>
        </Link>

        {/* Desktop: search with autocomplete */}
        <div className="hidden md:flex flex-1 max-w-xl mx-auto relative" ref={searchRef}>
          <form className="flex w-full" onSubmit={handleSearchSubmit}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search for frames, sunglasses…"
              className="flex-1 bg-white border border-[#e5e7eb] text-[#1a1a1a] placeholder-[#9ca3af] text-sm px-4 py-2 rounded-l-[5px] outline-none focus:ring-1 focus:ring-[#E8670A]"
              autoComplete="off"
            />
            <button
              type="submit"
              className="bg-[#E8670A] hover:bg-[#C45408] px-3 rounded-r-[5px] text-white"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </form>

          {/* Autocomplete dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg overflow-hidden z-50">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSuggestionClick(p.slug)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#f9fafb] transition-colors text-left"
                >
                  <div className="relative w-10 h-8 shrink-0 bg-white border border-[#e5e7eb] rounded overflow-hidden">
                    {p.thumbnail_url ? (
                      <Image src={p.thumbnail_url} alt={p.name} fill className="object-contain" sizes="40px" />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1a1a1a] text-sm font-medium truncate">{p.name}</p>
                  </div>
                  <span className="text-[#E8670A] text-sm font-semibold shrink-0">
                    {formatPrice(p.sale_price ?? p.base_price)}
                  </span>
                </button>
              ))}
              <button
                onClick={() => { setShowSuggestions(false); if (query.trim()) router.push(`/products?q=${encodeURIComponent(query)}`); }}
                className="w-full text-center py-2 text-[#E8670A] text-xs hover:bg-[#FFF0E6] transition-colors border-t border-[#e5e7eb]"
              >
                See all results for &ldquo;{query}&rdquo;
              </button>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Mobile: search toggle */}
          <button
            className="md:hidden text-[#1a1a1a] hover:text-[#E8670A] transition-colors"
            onClick={() => setSearchOpen((o) => !o)}
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>

          {/* Wishlist — redirects to /login if not authenticated */}
          <Link
            href="/account/wishlist"
            onClick={handleWishlistClick}
            className="text-[#1a1a1a] hover:text-[#E8670A] transition-colors"
            aria-label="Wishlist"
          >
            <HeartIcon className="w-6 h-6" />
          </Link>

          {/* Admin Panel shortcut */}
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-[#E8670A] border border-[#E8670A]/40 px-3 py-1.5 rounded hover:bg-[#E8670A]/10 transition-colors"
            >
              Admin Panel
            </Link>
          )}

          {/* Account */}
          <Link href={accountHref} className="text-[#1a1a1a] hover:text-[#E8670A] transition-colors" aria-label="Account">
            <UserIcon className="w-6 h-6" />
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative text-[#1a1a1a] hover:text-[#E8670A] transition-colors" aria-label="Cart">
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
        <div className="md:hidden px-4 pb-3 bg-white border-b border-[#e5e7eb]">
          <form className="flex" onSubmit={handleSearchSubmit}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="flex-1 bg-white border border-[#e5e7eb] text-[#1a1a1a] placeholder-[#9ca3af] text-sm px-4 py-2 rounded-l-[5px] outline-none focus:ring-1 focus:ring-[#E8670A]"
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
