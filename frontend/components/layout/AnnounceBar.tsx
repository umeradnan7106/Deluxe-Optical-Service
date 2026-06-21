"use client";

export default function AnnounceBar() {
  return (
    <div className="bg-[#1B2B5E] text-white/85 overflow-hidden py-2 text-[11px] md:text-xs font-medium">
      {/* Desktop: static centred text */}
      <p className="hidden md:block text-center px-4">
        Free Delivery on Orders Above{" "}
        <strong className="text-[#C9A84C]">Rs. 3,000</strong>
        {" · "}Pakistan-wide Delivery
        {" · "}
        <strong className="text-[#C9A84C]">15% Off</strong>{" "}
        with EasyPaisa, JazzCash &amp; Bank Transfer
      </p>

      {/* Mobile: CSS marquee */}
      <div className="flex md:hidden px-4">
        <span className="animate-marquee whitespace-nowrap">
          Free Delivery on Orders Above Rs.&nbsp;3,000&nbsp;&nbsp;·&nbsp;&nbsp;Pakistan-wide Delivery&nbsp;&nbsp;·&nbsp;&nbsp;15% Off with EasyPaisa &amp; JazzCash&nbsp;&nbsp;·&nbsp;&nbsp;
        </span>
        <span className="animate-marquee whitespace-nowrap" aria-hidden>
          Free Delivery on Orders Above Rs.&nbsp;3,000&nbsp;&nbsp;·&nbsp;&nbsp;Pakistan-wide Delivery&nbsp;&nbsp;·&nbsp;&nbsp;15% Off with EasyPaisa &amp; JazzCash&nbsp;&nbsp;·&nbsp;&nbsp;
        </span>
      </div>
    </div>
  );
}
