"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TruckIcon, ArrowPathIcon, ShieldCheckIcon, CheckBadgeIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

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

const WaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.847L.057 24l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.36-.213-3.72.976.994-3.624-.234-.372A9.818 9.818 0 1112 21.818z" />
  </svg>
);

const TRUST_ITEMS = [
  { Icon: TruckIcon, label: "Free Delivery", sub: "On orders above Rs. 3,000", href: undefined },
  { Icon: CheckBadgeIcon, label: "100% Authentic", sub: "Genuine frames only", href: undefined },
  { Icon: ArrowPathIcon, label: "7-Day Returns", sub: "Easy & hassle-free", href: undefined },
  { Icon: WaIcon, label: "WhatsApp Support", sub: "Chat anytime", href: WHATSAPP_URL },
  { Icon: ShieldCheckIcon, label: "Cash on Delivery", sub: "Pay when you receive", href: undefined },
] as const;

const WHY_ITEMS = [
  {
    Icon: ShieldCheckIcon,
    title: "100% Authentic",
    text: "Every frame is sourced directly from verified manufacturers. No counterfeits, ever.",
  },
  {
    Icon: TruckIcon,
    title: "Fast Pakistan-Wide Delivery",
    text: "3-5 day delivery to any city in Pakistan. Free shipping on orders above Rs. 3,000.",
  },
  {
    Icon: ArrowPathIcon,
    title: "Open Parcel Policy",
    text: "Check your order before paying. We support open parcel delivery for Cash on Delivery.",
  },
  {
    Icon: ChatBubbleLeftRightIcon,
    title: "Expert Lens Guidance",
    text: "Not sure which lens? Our optical experts on WhatsApp guide you to the right choice.",
  },
] as const;

const ProductSkeleton = () => (
  <div className="bg-white border border-[#e5e7eb] rounded-lg overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-gray-100" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-4 bg-gray-100 rounded" />
      <div className="h-8 bg-gray-100 rounded mt-3" />
    </div>
  </div>
);

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
      {/* Hero Slider */}
      <HeroSlider />

      {/* Trust Strip */}
      <section className="bg-white border-y border-[#e5e7eb]">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-5 md:py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
            {TRUST_ITEMS.map((item) =>
              item.href ? (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-[#FFF0E6] flex items-center justify-center shrink-0">
                    <item.Icon className="w-5 h-5 text-[#E8670A]" />
                  </div>
                  <div>
                    <p className="text-[#1a1a1a] text-sm font-semibold">{item.label}</p>
                    <p className="text-[#6b7280] text-xs">{item.sub}</p>
                  </div>
                </a>
              ) : (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF0E6] flex items-center justify-center shrink-0">
                    <item.Icon className="w-5 h-5 text-[#E8670A]" />
                  </div>
                  <div>
                    <p className="text-[#1a1a1a] text-sm font-semibold">{item.label}</p>
                    <p className="text-[#6b7280] text-xs">{item.sub}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Shop by Gender */}
      <GenderCards />

      {/* Shop by Category */}
      <CategoryGrid />

      {/* Bestsellers */}
      <section className="bg-white py-10 md:py-16">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-6 md:mb-8">
            <div>
              <p className="text-[#E8670A] text-xs font-semibold uppercase tracking-widest mb-1">Best Sellers</p>
              <h2 className="font-['Cormorant_Garamond'] text-[26px] md:text-4xl text-[#1a1a1a] font-semibold">Most Popular Frames</h2>
            </div>
            <Link href="/products?featured=true" className="text-[#E8670A] text-sm hover:underline font-medium shrink-0 ml-4">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {featured.length > 0
              ? featured.map((p) => <ProductCard key={p.id} product={p} />)
              : [1, 2, 3, 4].map((i) => <ProductSkeleton key={i} />)}
          </div>
        </div>
      </section>

      {/* Prescription CTA Banner */}
      <section className="bg-[#0F0F0F] py-10 md:py-16">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
            <div className="text-center md:text-left">
              <p className="text-[#E8670A] text-xs font-semibold uppercase tracking-widest mb-2">Custom Prescription</p>
              <h2 className="font-['Cormorant_Garamond'] text-[26px] md:text-4xl text-white font-semibold leading-tight mb-4">
                Prescription Lenses <span className="text-[#E8670A]">Made Just for You</span>
              </h2>
              <p className="text-[#6b7280] text-sm leading-relaxed mb-6">
                Upload your prescription or enter it manually during checkout. Our optical team verifies every order for your comfort and safety.
              </p>
              <Link href="/products?category=prescription">
                <Button variant="primary" size="lg">Shop Prescription</Button>
              </Link>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4">
              <div className="aspect-[4/3] bg-[#1a1a1a] rounded-lg" />
              <div className="aspect-[4/3] bg-[#1a1a1a] rounded-lg mt-8" />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-[#f9fafb] py-10 md:py-16">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-6 md:mb-8">
            <div>
              <p className="text-[#E8670A] text-xs font-semibold uppercase tracking-widest mb-1">New Drops</p>
              <h2 className="font-['Cormorant_Garamond'] text-[26px] md:text-4xl text-[#1a1a1a] font-semibold">New Arrivals</h2>
            </div>
            <Link href="/products" className="text-[#E8670A] text-sm hover:underline font-medium shrink-0 ml-4">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {newArrivals.length > 0
              ? newArrivals.map((p) => <ProductCard key={p.id} product={p} />)
              : [1, 2, 3, 4].map((i) => <ProductSkeleton key={i} />)}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#f9fafb] py-10 md:py-16 border-t border-[#e5e7eb]">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          <div className="text-center">
            <p className="text-[#E8670A] text-[10px] font-semibold uppercase tracking-widest mb-1">Our Promise</p>
            <h2 className="font-['Cormorant_Garamond'] text-[26px] md:text-[32px] text-[#1a1a1a] font-semibold">Why Choose DeluxeOpt?</h2>
            <p className="text-[#6b7280] text-[13px] md:text-[14px] max-w-lg mx-auto mt-2 leading-relaxed">
              We&apos;re committed to making quality eyewear accessible to everyone in Pakistan
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-10">
            {WHY_ITEMS.map(({ Icon, title, text }) => (
              <div key={title} className="bg-white border border-[#e5e7eb] rounded-lg p-4 md:p-6 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FFF0E6] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Icon className="w-6 h-6 md:w-9 md:h-9 text-[#E8670A]" />
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-[16px] md:text-[20px] text-[#1a1a1a] font-medium mb-1 md:mb-2">{title}</h3>
                <p className="text-[12px] md:text-[13px] text-[#6b7280] leading-[1.65]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lens Collection Section */}
      <LensCollectionSection />

      {/* Customer Reviews */}
      <ReviewsStrip />

      {/* Final CTA */}
      <section className="bg-[#E8670A] py-10 md:py-16">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-['Cormorant_Garamond'] text-[26px] md:text-4xl text-white font-semibold mb-3">
            Ready to Find Your Perfect Frames?
          </h2>
          <p className="text-orange-100 mb-6 md:mb-8 max-w-md mx-auto text-sm">
            Shop hundreds of styles from Pakistan&apos;s top eyewear destination.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/products">
              <Button variant="dark" size="lg">Browse All Frames</Button>
            </Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <button className="px-6 py-3 border border-white text-white rounded-[5px] text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
                <WaIcon className="w-4 h-4" />
                Chat on WhatsApp
              </button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
