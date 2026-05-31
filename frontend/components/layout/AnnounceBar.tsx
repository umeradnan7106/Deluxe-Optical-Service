"use client";

const MESSAGE =
  "Free delivery on orders over Rs. 3,000 · 15% off with EasyPaisa, JazzCash & Bank Transfer · Pakistan-wide delivery";

export default function AnnounceBar() {
  return (
    <div className="bg-[#E8670A] text-white font-medium overflow-hidden py-1.5 md:py-2 text-[10px] md:text-xs">
      {/* Desktop: static centred text */}
      <p className="hidden md:block text-center px-4">{MESSAGE}</p>

      {/* Mobile: CSS marquee */}
      <div className="flex md:hidden px-4">
        <span className="animate-marquee whitespace-nowrap">{MESSAGE}&nbsp;&nbsp;·&nbsp;&nbsp;</span>
        <span className="animate-marquee whitespace-nowrap" aria-hidden>
          {MESSAGE}&nbsp;&nbsp;·&nbsp;&nbsp;
        </span>
      </div>
    </div>
  );
}
