"use client";

const MESSAGE =
  "Free delivery on orders over Rs. 3,000 · 15% off with EasyPaisa, JazzCash & Bank Transfer · Pakistan-wide delivery";

export default function AnnounceBar() {
  return (
    <div className="bg-[#E8670A] text-white text-xs font-medium py-2 overflow-hidden">
      {/* Desktop: static centred text */}
      <p className="hidden md:block text-center px-4">{MESSAGE}</p>

      {/* Mobile: CSS marquee */}
      <div className="flex md:hidden">
        <span className="animate-marquee whitespace-nowrap px-4">{MESSAGE}</span>
        <span className="animate-marquee whitespace-nowrap px-4" aria-hidden>
          {MESSAGE}
        </span>
      </div>
    </div>
  );
}
