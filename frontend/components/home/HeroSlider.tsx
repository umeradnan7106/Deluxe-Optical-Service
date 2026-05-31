"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const SLIDES = [
  {
    eyebrow: "Pakistan's Premium Eyewear Store",
    titlePre: "See the World in ",
    titleOrange: "Style",
    subtitle: "Premium frames with prescription lens customization. Delivered anywhere in Pakistan with Cash on Delivery.",
    cta1: { label: "Shop Frames", href: "/products" },
    cta2: { label: "Build Your Lenses", href: "/products?category=prescription" },
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
  },
  {
    eyebrow: "Custom Prescription Lenses",
    titlePre: "Your ",
    titleOrange: "Perfect Vision",
    titlePost: " Starts Here",
    subtitle: "Single Vision, Progressive, Blue Cut, Transition — all crafted to your exact prescription.",
    cta1: { label: "Shop Prescription", href: "/products?category=prescription" },
    cta2: { label: "Learn More", href: "/products" },
    gradient: "linear-gradient(135deg, #0f1f3d 0%, #1a3a6e 100%)",
  },
  {
    eyebrow: "Seasonal Sale",
    titlePre: "Unbeatable Prices on ",
    titleOrange: "Premium Frames",
    subtitle: "Shop our seasonal sale — limited stock. Pay online and save an extra 15%.",
    cta1: { label: "Shop Sale", href: "/products?sale=true" },
    cta2: { label: "View All", href: "/products" },
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #2d1a4e 100%)",
  },
];

const GlassesPlaceholder = () => (
  <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 md:w-32 md:h-32 opacity-20">
    <rect x="5" y="15" width="70" height="50" rx="12" fill="none" stroke="white" strokeWidth="3" />
    <rect x="125" y="15" width="70" height="50" rx="12" fill="none" stroke="white" strokeWidth="3" />
    <path d="M75 40 Q100 28 125 40" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <line x1="5" y1="30" x2="0" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <line x1="195" y1="30" x2="200" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const STATS = [
  { value: "2,400+", label: "Customers" },
  { value: "500+", label: "Styles" },
  { value: "3-5 Day", label: "Delivery" },
  { value: "7-Day", label: "Returns" },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[active];

  return (
    <section className="bg-[#0F0F0F] overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center pt-6 pb-4 lg:py-12 lg:min-h-[480px]">

          {/* Image — order-first on mobile (top), order-last on desktop (right) */}
          <div className="w-full order-1 lg:order-2 lg:w-1/2 shrink-0">
            <div
              className="aspect-video lg:aspect-[4/3] rounded-lg overflow-hidden flex items-center justify-center"
              style={{ background: slide.gradient }}
            >
              <GlassesPlaceholder />
            </div>
          </div>

          {/* Text — order-second on mobile (below image), order-first on desktop (left) */}
          <div className="flex-1 order-2 lg:order-1 lg:w-1/2 text-center lg:text-left pb-4 lg:pb-0">
            <span className="inline-block border border-[#E8670A] text-[#E8670A] text-[10px] md:text-xs px-3 py-1 rounded-full mb-3 md:mb-4">
              {slide.eyebrow}
            </span>

            <h1
              className="font-['Cormorant_Garamond'] text-white font-semibold leading-tight mb-3 md:mb-4"
              style={{ fontSize: "clamp(24px, 6vw, 52px)" }}
            >
              {slide.titlePre}
              <span className="text-[#E8670A]">{slide.titleOrange}</span>
              {"titlePost" in slide && slide.titlePost}
            </h1>

            <p className="text-[#6b7280] text-[13px] leading-relaxed mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0">
              {slide.subtitle}
            </p>

            {/* Buttons: full-width stacked on mobile, auto on desktop */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8 md:mb-10">
              <Link href={slide.cta1.href} className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">{slide.cta1.label}</Button>
              </Link>
              <Link href={slide.cta2.href} className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 py-3 border border-white text-white rounded-[5px] text-sm font-medium hover:bg-white/10 transition-colors min-h-[44px]">
                  {slide.cta2.label}
                </button>
              </Link>
            </div>

            {/* Stats: always 2x2 */}
            <div className="border-t border-[#2a2a2a] pt-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STATS.map(({ value, label }) => (
                  <div key={label}>
                    <p className="font-['Cormorant_Garamond'] text-[#E8670A] text-lg md:text-xl font-bold">{value}</p>
                    <p className="text-[#6b7280] text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex gap-2 justify-center py-4 md:pb-6">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all ${i === active ? "w-6 h-2 bg-[#E8670A]" : "w-2 h-2 bg-[#3a3a3a] hover:bg-gray-500"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
