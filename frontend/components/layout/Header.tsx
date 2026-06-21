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

const DRAWER_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/products?gender=men", label: "Men" },
  { href: "/products?gender=women", label: "Women" },
  { href: "/products?category=sunglasses", label: "Sunglasses" },
  { href: "/products?category=prescription", label: "Prescription" },
  { href: "/products?category=blue-cut", label: "Blue Cut" },
  { href: "/products?category=transition", label: "Transition" },
  { href: "/products?sale=true", label: "Sale", gold: true },
  { href: "/tracking", label: "Track Order" },
];

export default function Header() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductListItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const accountHref = !isAuthenticated ? "/auth/login" : isAdmin ? "/admin" : "/account/orders";
  const loadWishlist = useWishlistStore((s) => s.load);
  const wishlistLoaded = useWishlistStore((s) => s.loaded);
  const wishlistCount = useWishlistStore((s) => s.ids.length);

  useEffect(() => {
    if (isAuthenticated && !wishlistLoaded) loadWishlist();
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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const inDesktop = desktopSearchRef.current?.contains(e.target as Node);
      const inMobile = mobileSearchRef.current?.contains(e.target as Node);
      if (!inDesktop && !inMobile) setShowSuggestions(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

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

  const SuggestionsList = () => (
    <>
      {suggestions.map((p) => (
        <button
          key={p.id}
          onClick={() => handleSuggestionClick(p.slug)}
          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#EEF1FA] transition-colors text-left"
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
          <span className="text-[#1B2B5E] text-sm font-semibold shrink-0">
            {formatPrice(p.sale_price ?? p.base_price)}
          </span>
        </button>
      ))}
      <button
        onClick={() => { setShowSuggestions(false); if (query.trim()) router.push(`/products?q=${encodeURIComponent(query)}`); }}
        className="w-full text-center py-2 text-[#1B2B5E] text-xs hover:bg-[#EEF1FA] transition-colors border-t border-[#e5e7eb]"
      >
        See all results for &ldquo;{query}&rdquo;
      </button>
    </>
  );

  return (
    <>
      <header className="bg-white border-b border-[#e5e7eb] sticky top-0 z-50 shadow-sm">
        {/* ── MOBILE LAYOUT (< md) ─────────────────────────────── */}
        <div className="md:hidden">
          {/* Row 1: hamburger | logo (centered) | account + cart */}
          <div className="relative h-14 flex items-center px-4">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="text-[#1B2B5E] p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 font-playfair text-[#1B2B5E] text-2xl font-bold tracking-wide whitespace-nowrap"
            >
              Deluxe<span className="text-[#C9A84C]">Opt</span>
            </Link>

            <div className="ml-auto flex items-center gap-1">
              <Link
                href={accountHref}
                aria-label="Account"
                className="text-[#1B2B5E] hover:text-[#C9A84C] transition-colors p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <UserIcon className="w-6 h-6" />
              </Link>
              <Link
                href="/cart"
                aria-label="Cart"
                className="relative text-[#1B2B5E] hover:text-[#C9A84C] transition-colors p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#C9A84C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Row 2: full-width search */}
          <div className="px-4 pb-3" ref={mobileSearchRef}>
            <form className="relative flex" onSubmit={handleSearchSubmit}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search for frames, sunglasses…"
                className="flex-1 h-11 bg-[#F8FAFC] border border-[#e2e8f0] text-[#1a1a1a] placeholder-[#94a3b8] text-sm px-4 rounded-l-lg outline-none focus:ring-1 focus:ring-[#1B2B5E] focus:border-[#1B2B5E]"
                autoComplete="off"
              />
              <button
                type="submit"
                aria-label="Search"
                className="bg-[#1B2B5E] hover:bg-[#243570] h-11 px-3 rounded-r-lg text-white transition-colors"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e2e8f0] rounded-lg shadow-lg overflow-hidden z-50">
                  <SuggestionsList />
                </div>
              )}
            </form>
          </div>
        </div>

        {/* ── DESKTOP LAYOUT (md+) ─────────────────────────────── */}
        <div className="hidden md:flex max-w-[1500px] mx-auto px-4 md:px-6 h-16 items-center gap-4">
          <Link
            href="/"
            className="flex-shrink-0 font-playfair text-[#1B2B5E] text-2xl font-bold tracking-wide"
          >
            Deluxe<span className="text-[#C9A84C]">Opt</span>
          </Link>

          <div className="flex flex-1 max-w-xl mx-auto relative" ref={desktopSearchRef}>
            <form className="flex w-full" onSubmit={handleSearchSubmit}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search for frames, sunglasses…"
                className="flex-1 bg-[#F8FAFC] border border-[#e2e8f0] text-[#1a1a1a] placeholder-[#94a3b8] text-sm px-4 py-2.5 rounded-l-lg outline-none focus:ring-1 focus:ring-[#1B2B5E] focus:border-[#1B2B5E]"
                autoComplete="off"
              />
              <button
                type="submit"
                aria-label="Search"
                className="bg-[#1B2B5E] hover:bg-[#243570] px-4 rounded-r-lg text-white transition-colors"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e2e8f0] rounded-lg shadow-lg overflow-hidden z-50">
                <SuggestionsList />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Link
              href="/account/wishlist"
              onClick={handleWishlistClick}
              aria-label="Wishlist"
              className="relative w-10 h-10 bg-[#F8FAFC] border border-[#e2e8f0] rounded-lg flex items-center justify-center text-[#1B2B5E] hover:border-[#1B2B5E] hover:bg-[#EEF1FA] transition-colors"
            >
              <HeartIcon className="w-5 h-5" />
              {isAuthenticated && wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#C9A84C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1B2B5E] border border-[#1B2B5E]/40 px-3 py-1.5 rounded-lg hover:bg-[#EEF1FA] transition-colors"
              >
                Admin Panel
              </Link>
            )}

            <Link
              href={accountHref}
              aria-label="Account"
              className="w-10 h-10 bg-[#F8FAFC] border border-[#e2e8f0] rounded-lg flex items-center justify-center text-[#1B2B5E] hover:border-[#1B2B5E] hover:bg-[#EEF1FA] transition-colors"
            >
              <UserIcon className="w-5 h-5" />
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative w-10 h-10 bg-[#F8FAFC] border border-[#e2e8f0] rounded-lg flex items-center justify-center text-[#1B2B5E] hover:border-[#1B2B5E] hover:bg-[#EEF1FA] transition-colors"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#C9A84C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ──────────────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />

          <div
            className="absolute left-0 top-0 h-full w-[280px] bg-white flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-[#e2e8f0] shrink-0 bg-[#1B2B5E]">
              <Link
                href="/"
                onClick={() => setDrawerOpen(false)}
                className="font-playfair text-white text-xl font-bold tracking-wide"
              >
                Deluxe<span className="text-[#C9A84C]">Opt</span>
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="text-white/60 hover:text-white p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto py-2">
              <ul>
                {DRAWER_LINKS.map(({ href, label, gold }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setDrawerOpen(false)}
                      className={`block px-5 py-3.5 text-sm font-medium transition-colors min-h-[44px] flex items-center border-l-4 ${
                        gold
                          ? "text-[#C9A84C] border-transparent"
                          : "text-[#1a1a1a] hover:bg-[#EEF1FA] hover:text-[#1B2B5E] hover:border-[#1B2B5E] border-transparent"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="border-t border-[#e2e8f0] mt-3 pt-3 px-5 space-y-1">
                <Link
                  href="/account/wishlist"
                  onClick={(e) => {
                    if (!isAuthenticated) { e.preventDefault(); router.push("/auth/login"); }
                    setDrawerOpen(false);
                  }}
                  className="flex items-center gap-3 py-3 text-sm text-[#1a1a1a] hover:text-[#1B2B5E] transition-colors min-h-[44px]"
                >
                  <HeartIcon className="w-5 h-5 shrink-0" />
                  Wishlist
                  {isAuthenticated && wishlistCount > 0 && (
                    <span className="ml-auto bg-[#C9A84C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  href={accountHref}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 py-3 text-sm text-[#1a1a1a] hover:text-[#1B2B5E] transition-colors min-h-[44px]"
                >
                  <UserIcon className="w-5 h-5 shrink-0" />
                  {isAuthenticated ? "My Account" : "Login / Register"}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
