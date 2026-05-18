"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import React from "react";
import { TruckIcon, ArrowPathIcon, ShieldCheckIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

import HeroSlider from "@/components/home/HeroSlider";
import GenderCards from "@/components/home/GenderCards";
import CategoryGrid from "@/components/home/CategoryGrid";
import LensCollectionSection from "@/components/home/LensCollectionSection";
import ReviewsStrip from "@/components/home/ReviewsStrip";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";
import { productsApi } from "@/lib/api";
import { WHATSAPP_URL } from "@/lib/constants";
import type { ProductListItem } from "@/types";

type TrustItem = { Icon: React.ComponentType<{ className?: string }>; label: string; sub: string; href?: string };

const WaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.847L.057 24l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.36-.213-3.72.976.994-3.624-.234-.372A9.818 9.818 0 1112 21.818z" />
  </svg>
);

const TRUST_ITEMS: TrustItem[] = [
  { Icon: TruckIcon, label: "Free Delivery", sub: "Orders over Rs. 3,000" },
  { Icon: CheckBadgeIcon, label: "100% Authentic", sub: "Genuine products only" },
  { Icon: ArrowPathIcon, label: "15-Day Returns", sub: "Hassle-free returns" },
  { Icon: WaIcon, label: "WhatsApp Support", sub: "Order & track via WhatsApp", href: WHATSAPP_URL },
  { Icon: ShieldCheckIcon, label: "COD Available", sub: "Pay on delivery" },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<ProductListItem[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductListItem[]>([]);

  useEffect(() => {
    productsApi.featured()
      .then((res) => setFeatured(res.data.slice(0, 4)))
      .catch(() => {});
    productsApi.list({ per_page: 4 })
      .then((res) => setNewArrivals(res.data.items))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. Trust Strip */}
      <section className="bg-[#1a1a1a] border-y border-[#2a2a2a]">
        <div className="max-w-[1500px] mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {TRUST_ITEMS.map((item) => (
              item.href ? (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-[#E8670A]/10 flex items-center justify-center shrink-0">
                    <item.Icon className="w-5 h-5 text-[#E8670A]" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{item.label}</p>
                    <p className="text-gray-500 text-xs">{item.sub}</p>
                  </div>
                </a>
              ) : (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8670A]/10 flex items-center justify-center shrink-0">
                    <item.Icon className="w-5 h-5 text-[#E8670A]" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{item.label}</p>
                    <p className="text-gray-500 text-xs">{item.sub}</p>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* 3. Shop by Gender */}
      <GenderCards />

      {/* 4. Shop by Category */}
      <CategoryGrid />

      {/* 5. Bestsellers */}
      {featured.length > 0 && (
        <section className="max-w-[1500px] mx-auto px-6 py-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-1">Top Picks</p>
              <h2 className="font-['Cormorant_Garamond'] text-4xl text-gray-900 font-semibold">Bestsellers</h2>
            </div>
            <Link href="/products?featured=true">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Prescription CTA Banner */}
      <section className="bg-[#111111] py-12">
        <div className="max-w-[1500px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2a2a]">
            <div>
              <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-1">Prescription Eyewear</p>
              <h2 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold mb-2">Got a Prescription?</h2>
              <p className="text-gray-400 max-w-lg text-sm leading-relaxed">
                Upload your prescription or enter it manually during checkout. Our optical team verifies every order for your comfort and safety.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link href="/products?category=eyeglasses">
                <Button variant="primary" size="lg">Shop Prescription Frames</Button>
              </Link>
              <Link href="/lens-guide">
                <Button variant="outline" size="lg">Lens Guide</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-[1500px] mx-auto px-6 py-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-1">Just Landed</p>
              <h2 className="font-['Cormorant_Garamond'] text-4xl text-gray-900 font-semibold">New Arrivals</h2>
            </div>
            <Link href="/products">
              <Button variant="outline" size="sm">Shop All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 8. Lens Collection Section */}
      <LensCollectionSection />

      {/* 9. Customer Reviews Strip */}
      <ReviewsStrip />

      {/* 10. Newsletter / Final CTA */}
      <section className="bg-[#E8670A] py-16">
        <div className="max-w-[1500px] mx-auto px-6 text-center">
          <h2 className="font-['Cormorant_Garamond'] text-4xl text-white font-semibold mb-2">Stay in the Loop</h2>
          <p className="text-orange-100 mb-8 max-w-md mx-auto text-sm">
            Get the latest styles, exclusive offers, and optical tips delivered to your inbox.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded text-white bg-white/20 placeholder:text-orange-200 border border-orange-300/50 focus:outline-none focus:border-white"
            />
            <button
              type="submit"
              className="bg-white text-[#E8670A] font-semibold px-6 py-3 rounded hover:bg-orange-50 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
