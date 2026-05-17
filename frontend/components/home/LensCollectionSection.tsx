"use client";

import { useState, useEffect } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { lensCollectionApi } from "@/lib/api";
import type { LensCollection } from "@/types";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function LensCollectionSection() {
  const [collections, setCollections] = useState<LensCollection[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    lensCollectionApi.list().then((res) => {
      setCollections(res.data);
    }).catch(() => {});
  }, []);

  if (!collections.length) return null;
  const active = collections[activeIdx];

  return (
    <section className="bg-[#0F0F0F] py-16">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="mb-10 text-center">
          <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-1">Our Lens Technology</p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl text-white font-semibold">Choose Your Lens</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Video + pills */}
          <div className="flex-1">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-[#1a1a1a] mb-4">
              {active.video_url ? (
                <video
                  key={active.video_url}
                  src={active.video_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                  No video available
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {collections.map((lc, i) => (
                <button
                  key={lc.id}
                  onClick={() => setActiveIdx(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    i === activeIdx
                      ? "bg-[#E8670A] text-white"
                      : "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525]"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: lc.color_dot }}
                  />
                  {lc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Active detail + other lenses */}
          <div className="lg:w-[380px] shrink-0">
            <div className="bg-[#1a1a1a] rounded-lg p-6 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: active.color_dot }} />
                <h3 className="font-['Cormorant_Garamond'] text-2xl text-white font-semibold">{active.name}</h3>
              </div>
              <p className="text-[#E8670A] font-semibold mb-3">From {formatPrice(active.price_from)}</p>
              {active.description && (
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{active.description}</p>
              )}
              {active.bullets.length > 0 && (
                <ul className="space-y-2 mb-5">
                  {active.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckIcon className="w-4 h-4 text-[#E8670A] mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/products?category=eyeglasses">
                <Button variant="primary" size="md" fullWidth>Shop {active.name} Frames</Button>
              </Link>
            </div>

            {/* Other lenses */}
            {collections.filter((_, i) => i !== activeIdx).length > 0 && (
              <div className="space-y-2">
                {collections
                  .filter((_, i) => i !== activeIdx)
                  .map((lc) => (
                    <button
                      key={lc.id}
                      onClick={() => setActiveIdx(collections.indexOf(lc))}
                      className="w-full flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#252525] transition-colors text-left"
                    >
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: lc.color_dot }} />
                      <span className="text-gray-400 text-sm flex-1">{lc.name}</span>
                      <span className="text-gray-600 text-xs shrink-0">{formatPrice(lc.price_from)}+</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
