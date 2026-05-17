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

const TEAM = [
  { name: "Optical Quality", desc: "Every frame is sourced from trusted manufacturers and quality-checked before dispatch." },
  { name: "Customer First", desc: "From browsing to after-sales support, we are committed to your complete satisfaction." },
  { name: "Affordable Luxury", desc: "Premium eyewear shouldn't cost a fortune. We make quality accessible to every Pakistani." },
];

export default function AboutPage() {
  return (
    <div className="bg-[#0F0F0F] min-h-screen">
      {/* Hero */}
      <section className="bg-[#111111] border-b border-[#2a2a2a] py-20">
        <div className="max-w-[1500px] mx-auto px-6 text-center">
          <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-white font-semibold mb-4">
            About Deluxe Opt Service
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Pakistan's home for premium, affordable eyewear — crafted for every face, every style, every occasion.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-[#2a2a2a] py-12">
        <div className="max-w-[1500px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-['Cormorant_Garamond'] text-4xl text-[#E8670A] font-semibold mb-1">{value}</p>
                <p className="text-gray-400 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-[1500px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-3">Who We Are</p>
              <h2 className="font-['Cormorant_Garamond'] text-4xl text-white font-semibold mb-6">
                Built for Pakistan, Worn by the World
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
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
            <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1a1a1a] flex items-center justify-center text-gray-600 text-sm">
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
      <section className="bg-[#111111] py-16">
        <div className="max-w-[1500px] mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-2">Our Values</p>
            <h2 className="font-['Cormorant_Garamond'] text-4xl text-white font-semibold">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map(({ name, desc }) => (
              <div key={name} className="bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2a2a]">
                <h3 className="text-white font-semibold text-lg mb-3">{name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-3">Our Mission</p>
          <blockquote className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white font-semibold leading-snug">
            "To make every Pakistani see the world clearly — in style, with confidence, at a price they deserve."
          </blockquote>
        </div>
      </section>
    </div>
  );
}
