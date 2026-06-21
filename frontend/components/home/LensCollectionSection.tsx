"use client";

import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { PlayIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/constants";

const WaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface Lens {
  id: number;
  name: string;
  colorDot: string;
  price: string;
  description: string;
  bullets: string[];
  videoUrl: string | null;
}

const LENSES: Lens[] = [
  {
    id: 1,
    name: "Transitions",
    colorDot: "#8B6914",
    price: "From Rs. 1,200",
    description: "Adapts to sunlight automatically — darkens outdoors, clears indoors within minutes.",
    bullets: ["Blocks 100% UVA & UVB radiation", "Darkens outdoors, clears in minutes", "Available in grey, brown & graphite green"],
    videoUrl: null,
  },
  {
    id: 2,
    name: "Blue Cut",
    colorDot: "#93c5fd",
    price: "From Rs. 500",
    description: "Filters harmful blue light from screens. Reduces eye strain and improves sleep.",
    bullets: ["Blocks harmful blue light (380–500nm)", "Reduces digital eye strain", "Improves sleep quality"],
    videoUrl: null,
  },
  {
    id: 3,
    name: "Polarized",
    colorDot: "#1a1a1a",
    price: "From Rs. 800",
    description: "Eliminates glare from reflective surfaces. Perfect for driving and outdoor activities.",
    bullets: ["Eliminates 99% of reflected glare", "Enhances contrast and clarity", "Ideal for driving and outdoors"],
    videoUrl: null,
  },
  {
    id: 4,
    name: "Clear",
    colorDot: "#e5e7eb",
    price: "Free",
    description: "Standard clear lenses with basic UV protection. Perfect for everyday prescription wear.",
    bullets: ["Basic UV protection", "Lightweight and comfortable", "Prescription compatible"],
    videoUrl: null,
  },
  {
    id: 5,
    name: "Prescription Sun",
    colorDot: "#f59e0b",
    price: "From Rs. 1,000",
    description: "Your prescription power in a premium sun lens. See clearly and look great outdoors.",
    bullets: ["Custom Rx power in sun lens", "Full UV protection", "Available in multiple tints"],
    videoUrl: null,
  },
];

export default function LensCollectionSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = LENSES[activeIdx];

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-[#C9A84C] text-[10px] font-semibold uppercase tracking-[.12em] mb-2">Our Lens Technology</p>
          <h2 className="font-playfair text-[28px] md:text-[38px] text-[#1B2B5E] font-bold">Choose Your Lens</h2>
          <p className="text-[#64748b] text-sm mt-2 max-w-md mx-auto">Select a lens type to learn how it benefits your vision</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* Left: Video + pills */}
          <div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0f1829] mb-5 border border-[#C9A84C]/20">
              {active.videoUrl ? (
                <video key={active.videoUrl} src={active.videoUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#475569]">
                  <PlayIcon className="w-12 h-12 opacity-30 text-[#C9A84C]" />
                  <p className="text-sm opacity-50 text-white">Video — {active.name}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {LENSES.map((lens, i) => (
                <button
                  key={lens.id}
                  onClick={() => setActiveIdx(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    i === activeIdx
                      ? "bg-[#1B2B5E] text-white border-[#1B2B5E]"
                      : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#1B2B5E] hover:text-[#1B2B5E]"
                  }`}
                >
                  <span className="w-3 h-3 rounded-full shrink-0 border border-[#e5e7eb]" style={{ backgroundColor: lens.colorDot }} />
                  {lens.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Active detail + other lenses */}
          <div>
            <div className="bg-[#EEF1FA] border border-[#C9A84C]/30 rounded-xl p-5 mb-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-[#e5e7eb]" style={{ backgroundColor: active.colorDot }} />
                  <h3 className="font-playfair text-[20px] text-[#1B2B5E] font-semibold">{active.name}</h3>
                </div>
                <span className="text-[12px] text-[#A8893A] font-semibold">{active.price}</span>
              </div>
              <p className="text-[#64748b] text-[13px] leading-relaxed mb-3">{active.description}</p>
              <ul className="space-y-1.5 mb-4">
                {active.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-[#0F172A]">
                    <CheckIcon className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href="/products?category=prescription"
                className="block w-full bg-[#1B2B5E] hover:bg-[#243570] text-white text-sm font-semibold py-2.5 px-4 rounded-lg text-center transition-colors"
              >
                Shop {active.name} Frames
              </Link>
            </div>

            <div className="space-y-2">
              {LENSES.filter((_, i) => i !== activeIdx).map((lens) => (
                <button
                  key={lens.id}
                  onClick={() => setActiveIdx(LENSES.indexOf(lens))}
                  className="w-full flex items-center gap-3 p-3 bg-white border border-[#e2e8f0] rounded-lg hover:border-[#1B2B5E] hover:bg-[#F5F7FF] transition-colors text-left"
                >
                  <span className="w-3 h-3 rounded-full shrink-0 border border-[#e5e7eb]" style={{ backgroundColor: lens.colorDot }} />
                  <span className="text-[#0F172A] text-sm flex-1 font-medium">{lens.name}</span>
                  <span className="text-[#C9A84C] text-xs shrink-0 font-semibold">{lens.price}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CTA strip */}
        <div className="bg-[#1B2B5E] rounded-xl p-5 md:p-6 mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white text-[15px] font-semibold">Not sure which lens is right for you?</p>
            <p className="text-white/50 text-[12px] mt-0.5">Our optical experts are ready to help you choose</p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#A8893A] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shrink-0"
          >
            <WaIcon className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
