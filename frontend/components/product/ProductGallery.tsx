"use client";

import { useState } from "react";
import Image from "next/image";
import { XMarkIcon, MagnifyingGlassPlusIcon } from "@heroicons/react/24/outline";
import type { ProductImage } from "@/types";
import Placeholder from "@/components/ui/Placeholder";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const active = images[activeIdx];

  if (!images.length) {
    return <Placeholder className="w-full aspect-[4/3] rounded-lg" label={productName} />;
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div className="relative aspect-[4/3] bg-white border border-[#e5e7eb] rounded-lg overflow-hidden">
          <Image
            src={active.url}
            alt={active.alt_text || productName}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-3 right-3 bg-black/10 hover:bg-black/20 rounded-full p-2 transition-colors"
            aria-label="Zoom"
          >
            <MagnifyingGlassPlusIcon className="w-5 h-5 text-[#1a1a1a]" />
          </button>
        </div>

        {/* Thumbnails — horizontal bottom row */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveIdx(idx)}
                className={`relative shrink-0 rounded-md overflow-hidden border-2 bg-white transition-colors ${
                  idx === activeIdx ? "border-[#E8670A]" : "border-[#e5e7eb] hover:border-[#E8670A]/50"
                }`}
                style={{ width: 80, height: 70 }}
              >
                <Image src={img.url} alt={img.alt_text || productName} fill className="object-contain" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-2xl aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={active.url}
              alt={active.alt_text || productName}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={(e) => { e.stopPropagation(); setActiveIdx(idx); }}
                className={`relative rounded overflow-hidden border-2 bg-white transition-colors ${
                  idx === activeIdx ? "border-[#E8670A]" : "border-white/30"
                }`}
                style={{ width: 48, height: 40 }}
              >
                <Image src={img.url} alt={img.alt_text || ""} fill className="object-contain" sizes="48px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
