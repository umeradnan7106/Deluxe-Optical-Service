"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TruckIcon, ArrowPathIcon, ShieldCheckIcon, MapPinIcon } from "@heroicons/react/24/outline";

import HeroSlider from "@/components/home/HeroSlider";
import GenderCards from "@/components/home/GenderCards";
import CategoryGrid from "@/components/home/CategoryGrid";
import LensCollectionSection from "@/components/home/LensCollectionSection";
import ReviewsStrip from "@/components/home/ReviewsStrip";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";
import { productsApi } from "@/lib/api";
import type { ProductListItem } from "@/types";

const TRUST_ITEMS = [
  { Icon: TruckIcon, label: "Free Delivery", sub: "Orders over Rs. 3,000" },
  { Icon: ArrowPathIcon, label: "15-Day Returns", sub: "Hassle-free returns" },
  { Icon: ShieldCheckIcon, label: "Secure Payments", sub: "EasyPaisa, JazzCash, Bank" },
  { Icon: MapPinIcon, label: "Pakistan-Wide", sub: "Delivery to all cities" },
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
      <HeroSlider />

      {/* Trust Strip */}
      <section className="bg-[#1a1a1a] border-y border-[#2a2a2a]">
        <div className="max-w-[1500px] mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_ITEMS.map(({ Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8670A]/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#E8670A]" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{label}</p>
                  <p className="text-gray-500 text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GenderCards />
      <CategoryGrid />

      {/* Bestsellers */}
      {featured.length > 0 && (
        <section className="max-w-[1500px] mx-auto px-6 py-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-1">Top Picks</p>
              <h2 className="font-['Cormorant_Garamond'] text-4xl text-white font-semibold">Bestsellers</h2>
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

      {/* Prescription CTA */}
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

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-[1500px] mx-auto px-6 py-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-1">Just Landed</p>
              <h2 className="font-['Cormorant_Garamond'] text-4xl text-white font-semibold">New Arrivals</h2>
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

      <LensCollectionSection />
      <ReviewsStrip />

      {/* Newsletter CTA */}
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
