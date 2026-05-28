"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";

const SLIDES = [
  {
    eyebrow: "Pakistan's Premium Eyewear Store",
    titlePre: "See the World in ",
    titleOrange: "Style",
    subtitle: "Premium frames with prescription lens customization. Delivered anywhere in Pakistan with Cash on Delivery.",
    cta1: { label: "Shop Frames", href: "/products" },
    cta2: { label: "Build Your Lenses", href: "/products?category=prescription" },
    image: "/images/hero-1.jpg",
  },
  {
    eyebrow: "Custom Prescription Lenses",
    titlePre: "Your ",
    titleOrange: "Perfect Vision",
    titlePost: " Starts Here",
    subtitle: "Single Vision, Progressive, Blue Cut, Transition — all crafted to your exact prescription.",
    cta1: { label: "Shop Prescription", href: "/products?category=prescription" },
    cta2: { label: "Learn More", href: "/products" },
    image: "/images/hero-2.jpg",
  },
  {
    eyebrow: "Seasonal Sale",
    titlePre: "Unbeatable Prices on ",
    titleOrange: "Premium Frames",
    subtitle: "Shop our seasonal sale — limited stock. Pay online and save an extra 15%.",
    cta1: { label: "Shop Sale", href: "/products?sale=true" },
    cta2: { label: "View All", href: "/products" },
    image: "/images/hero-3.jpg",
  },
];

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
      <div className="max-w-[1500px] mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row gap-10 items-center py-12 min-h-[480px]">
          {/* Left 50% — text */}
          <div className="flex-1 lg:w-1/2">
            <span className="inline-block border border-[#E8670A] text-[#E8670A] text-xs px-3 py-1 rounded-full mb-4">
              {slide.eyebrow}
            </span>

            <h1 className="font-['Cormorant_Garamond'] text-[48px] md:text-[56px] text-white font-semibold leading-tight mb-4">
              {slide.titlePre}
              <span className="text-[#E8670A]">{slide.titleOrange}</span>
              {"titlePost" in slide && slide.titlePost}
            </h1>
            <p className="text-[#6b7280] text-[14px] leading-relaxed mb-8 max-w-lg">{slide.subtitle}</p>

            <div className="flex gap-3 mb-10 flex-wrap">
              <Link href={slide.cta1.href}>
                <Button variant="primary" size="lg">{slide.cta1.label}</Button>
              </Link>
              <Link href={slide.cta2.href}>
                <button className="px-6 py-3 border border-white text-white rounded-[5px] text-sm font-medium hover:bg-white/10 transition-colors">
                  {slide.cta2.label}
                </button>
              </Link>
            </div>

            <div className="border-t border-[#2a2a2a] pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STATS.map(({ value, label }) => (
                  <div key={label}>
                    <p className="font-['Cormorant_Garamond'] text-[#E8670A] text-xl font-bold">{value}</p>
                    <p className="text-[#6b7280] text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 50% — single image */}
          <div className="lg:w-1/2 shrink-0 hidden lg:block">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#1a1a1a]">
              <Image
                src={slide.image}
                alt={slide.titlePre + slide.titleOrange}
                fill
                className="object-contain"
                sizes="700px"
                priority
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Dot navigation */}
      <div className="flex gap-2 justify-center pb-6">
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
