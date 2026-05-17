"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";

const SLIDES = [
  {
    eyebrow: "New Collection 2025",
    title: "See the World in Style",
    subtitle: "Premium Pakistani eyewear crafted for you. Free delivery on orders above Rs. 3,000.",
    cta1: { label: "Shop Now", href: "/products" },
    cta2: { label: "Find Your Frame", href: "/products?category=eyeglasses" },
    image: "/images/hero-1.jpg",
    thumbnails: ["/images/hero-thumb-1a.jpg", "/images/hero-thumb-1b.jpg"],
  },
  {
    eyebrow: "Blue Cut Lenses",
    title: "Protect Your Eyes from Screens",
    subtitle: "Reduce digital eye strain with our advanced blue-light blocking lenses.",
    cta1: { label: "Shop Blue Cut", href: "/products?category=eyeglasses" },
    cta2: { label: "Learn More", href: "/lens-guide" },
    image: "/images/hero-2.jpg",
    thumbnails: ["/images/hero-thumb-2a.jpg", "/images/hero-thumb-2b.jpg"],
  },
  {
    eyebrow: "Sale — Up to 40% Off",
    title: "Unbeatable Prices on Premium Frames",
    subtitle: "Shop our seasonal sale — limited stock. Pay online and save an extra 15%.",
    cta1: { label: "View Sale", href: "/products?sale=true" },
    cta2: { label: "All Frames", href: "/products" },
    image: "/images/hero-3.jpg",
    thumbnails: ["/images/hero-thumb-3a.jpg", "/images/hero-thumb-3b.jpg"],
  },
];

const STATS = [
  { value: "2,400+", label: "Happy Customers" },
  { value: "500+", label: "Frame Styles" },
  { value: "3–5 Day", label: "Delivery" },
  { value: "15-Day", label: "Easy Returns" },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[active];

  return (
    <section className="bg-[#0F0F0F] min-h-[580px] flex items-center overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row gap-10 items-center py-12">
          {/* Left */}
          <div className="flex-1">
            <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-3">{slide.eyebrow}</p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-white font-semibold leading-tight mb-4">
              {slide.title}
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">{slide.subtitle}</p>

            <div className="flex gap-3 mb-10 flex-wrap">
              <Link href={slide.cta1.href}>
                <Button variant="primary" size="lg">{slide.cta1.label}</Button>
              </Link>
              <Link href={slide.cta2.href}>
                <Button variant="outline" size="lg">{slide.cta2.label}</Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-[#E8670A] text-xl font-bold">{value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — images */}
          <div className="lg:w-[480px] shrink-0 hidden lg:block">
            <div className="relative aspect-[4/3] rounded overflow-hidden mb-3">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                sizes="480px"
                priority
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="flex gap-3">
              {slide.thumbnails.map((src, i) => (
                <div key={i} className="flex-1 aspect-video relative rounded overflow-hidden bg-[#1a1a1a]">
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="160px"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              ))}
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}
