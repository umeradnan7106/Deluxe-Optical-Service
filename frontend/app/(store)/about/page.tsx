import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Deluxe Opt Service — Pakistan's premium online eyewear destination.",
};

const STATS = [
  { value: "2,400+", label: "Happy Customers" },
  { value: "500+", label: "Frame Styles" },
  { value: "4.8★", label: "Average Rating" },
  { value: "3–5 Day", label: "Delivery" },
];

const VALUES = [
  { name: "Optical Quality", desc: "Every frame is sourced from trusted manufacturers and quality-checked before dispatch." },
  { name: "Customer First", desc: "From browsing to after-sales support, we are committed to your complete satisfaction." },
  { name: "Affordable Luxury", desc: "Premium eyewear shouldn't cost a fortune. We make quality accessible to every Pakistani." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#1B2B5E] py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"/>
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 text-center relative">
          <p className="text-[#C9A84C] text-[11px] font-semibold uppercase tracking-[.14em] mb-3">Our Story</p>
          <h1 className="font-playfair text-3xl md:text-5xl lg:text-6xl text-white font-bold mb-4">
            About Deluxe Opt Service
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Pakistan&apos;s home for premium, affordable eyewear — crafted for every face, every style, every occasion.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-[#e2e8f0] py-12">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-playfair text-4xl text-[#C9A84C] font-bold mb-1">{value}</p>
                <p className="text-[#64748b] text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#C9A84C] text-[11px] font-semibold uppercase tracking-[.14em] mb-3">Who We Are</p>
              <h2 className="font-playfair text-4xl text-[#1B2B5E] font-bold mb-6">
                Built for Pakistan, Worn by the World
              </h2>
              <div className="space-y-4 text-[#64748b] leading-relaxed">
                <p>
                  Deluxe Opt Service was founded with a simple mission: make premium eyewear accessible to every Pakistani, without compromising on quality or style.
                </p>
                <p>
                  We partner directly with certified optical manufacturers to bring you frames that meet international quality standards — from UV-protective sunglasses to prescription-ready eyeglasses with advanced coatings.
                </p>
                <p>
                  Our optical team personally reviews every prescription order to ensure the correct lenses are crafted and delivered to your door in 3–5 business days, anywhere in Pakistan.
                </p>
              </div>
            </div>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-[#EEF1FA] flex items-center justify-center text-[#64748b] text-sm">
              <Image
                src="/images/about-store.jpg"
                alt="Deluxe Opt Service store"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#F5F7FF] py-16">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-[#C9A84C] text-[11px] font-semibold uppercase tracking-[.14em] mb-2">Our Values</p>
            <h2 className="font-playfair text-4xl text-[#1B2B5E] font-bold">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map(({ name, desc }) => (
              <div key={name} className="bg-white rounded-xl p-8 border border-[#e2e8f0]">
                <div className="w-10 h-10 rounded-full bg-[#EEF1FA] flex items-center justify-center mb-4">
                  <span className="text-[#1B2B5E] font-bold text-sm">{name[0]}</span>
                </div>
                <h3 className="text-[#1B2B5E] font-semibold text-lg mb-3">{name}</h3>
                <p className="text-[#64748b] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#C9A84C] text-[11px] font-semibold uppercase tracking-[.14em] mb-3">Our Mission</p>
          <blockquote className="font-playfair text-3xl md:text-4xl text-[#1B2B5E] font-bold leading-snug">
            &ldquo;To make every Pakistani see the world clearly — in style, with confidence, at a price they deserve.&rdquo;
          </blockquote>
        </div>
      </section>
    </div>
  );
}
