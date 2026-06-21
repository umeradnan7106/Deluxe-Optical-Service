"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import heroImage1 from "@/app/public/hero-image-1.jpg";
import heroImage2 from "@/app/public/hero-image-2.jpg";
import heroImage3 from "@/app/public/hero-image-3.jpeg";

const SLIDES = [
  {
    eyebrow: "Pakistan's Premium Eyewear Destination",
    titlePre: "See the World in ",
    titleGold: "Pure Style",
    subtitle: "Premium frames with custom prescription lens crafting. Delivered anywhere in Pakistan. Open parcel — check before you pay.",
    cta1: { label: "Shop Frames", href: "/products" },
    cta2: { label: "Build Your Lenses →", href: "/products?category=prescription" },
    image: heroImage1,
  },
  {
    eyebrow: "Custom Prescription Lenses",
    titlePre: "Your ",
    titleGold: "Perfect Vision",
    titlePost: " Starts Here",
    subtitle: "Single Vision, Progressive, Blue Cut, Transition — all crafted to your exact prescription.",
    cta1: { label: "Shop Prescription", href: "/products?category=prescription" },
    cta2: { label: "Learn More →", href: "/products" },
    image: heroImage2,
  },
  {
    eyebrow: "Seasonal Sale — Limited Stock",
    titlePre: "Unbeatable Prices on ",
    titleGold: "Premium Frames",
    subtitle: "Shop our seasonal sale — limited stock. Pay online and save an extra 15%.",
    cta1: { label: "Shop Sale", href: "/products?sale=true" },
    cta2: { label: "View All →", href: "/products" },
    image: heroImage3,
  },
];

const STATS = [
  { value: "2,400+", label: "Happy Customers" },
  { value: "500+", label: "Frame Styles" },
  { value: "3–5 Day", label: "Delivery" },
  { value: "15%", label: "Online Discount" },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[active];

  return (
    <section className="bg-[#1B2B5E] overflow-hidden relative">
      {/* subtle gold gradient overlay top-right */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none" />

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 w-full relative">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center pt-8 pb-4 lg:py-16 lg:min-h-[520px]">

          {/* Image */}
          <div className="w-full order-1 lg:order-2 lg:w-1/2 shrink-0">
            <div className="aspect-video lg:aspect-[5/3] rounded-2xl overflow-hidden relative border border-[#C9A84C]/20">
              <Image
                key={active}
                src={slide.image}
                alt={slide.eyebrow}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={active === 0}
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 order-2 lg:order-1 lg:w-1/2 text-center lg:text-left pb-4 lg:pb-0">
            <div className="inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#C9A84C] text-[11px] font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
              {slide.eyebrow}
            </div>

            <h1
              className="font-playfair text-white font-bold leading-[1.05] mb-4"
              style={{ fontSize: "clamp(28px, 5vw, 56px)" }}
            >
              {slide.titlePre}
              <em className="text-[#C9A84C] not-italic">{slide.titleGold}</em>
              {"titlePost" in slide && slide.titlePost}
            </h1>

            <p className="text-white/60 text-[14px] md:text-[15px] leading-[1.75] mb-7 max-w-[460px] mx-auto lg:mx-0">
              {slide.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8 md:mb-10">
              <Link
                href={slide.cta1.href}
                className="inline-flex items-center justify-center bg-[#C9A84C] hover:bg-[#A8893A] text-white px-7 py-3.5 rounded-lg text-[14px] font-semibold transition-colors min-h-[44px]"
              >
                {slide.cta1.label}
              </Link>
              <Link
                href={slide.cta2.href}
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/30 text-white px-7 py-3.5 rounded-lg text-[14px] font-medium transition-colors min-h-[44px]"
              >
                {slide.cta2.label}
              </Link>
            </div>

            {/* Stats */}
            <div className="border-t border-white/10 pt-6 flex flex-wrap gap-0">
              {STATS.map(({ value, label }, i) => (
                <div key={label} className={`flex-1 min-w-[80px] ${i > 0 ? "border-l border-white/10 pl-5" : ""} pr-5`}>
                  <p className="font-playfair text-white text-[26px] font-bold leading-none">
                    <span className="text-[#C9A84C]">{value}</span>
                  </p>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex gap-2 justify-center py-4 md:pb-6 relative">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all ${i === active ? "w-6 h-2 bg-[#C9A84C]" : "w-2 h-2 bg-white/20 hover:bg-white/40"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
