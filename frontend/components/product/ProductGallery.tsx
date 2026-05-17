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
    return <Placeholder className="w-full aspect-square rounded" label={productName} />;
  }

  return (
    <>
      <div className="flex gap-3">
        {/* Thumbnails — vertical strip */}
        <div className="flex flex-col gap-2 w-16 shrink-0">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-square rounded overflow-hidden border-2 transition-colors ${
                idx === activeIdx ? "border-[#E8670A]" : "border-transparent"
              }`}
            >
              <Image src={img.url} alt={img.alt_text || productName} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div className="relative flex-1 aspect-square bg-[#1a1a1a] rounded overflow-hidden">
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
            className="absolute bottom-3 right-3 bg-[#0F0F0F]/70 rounded-full p-2 hover:bg-[#0F0F0F] transition-colors"
            aria-label="Zoom"
          >
            <MagnifyingGlassPlusIcon className="w-5 h-5 text-white" />
          </button>
        </div>
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
          <div className="relative w-full max-w-2xl aspect-square" onClick={(e) => e.stopPropagation()}>
            <Image
              src={active.url}
              alt={active.alt_text || productName}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          {/* Thumbnail strip in lightbox */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveIdx(idx)}
                className={`relative w-12 h-12 rounded overflow-hidden border-2 transition-colors ${
                  idx === activeIdx ? "border-[#E8670A]" : "border-white/30"
                }`}
              >
                <Image src={img.url} alt={img.alt_text || ""} fill className="object-cover" sizes="48px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
