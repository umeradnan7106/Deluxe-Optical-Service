import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Lens Guide",
  description: "Everything you need to know about eyeglass lenses — blue cut, anti-glare, photochromic, and more.",
};

const LENS_TYPES = [
  {
    id: "blue-cut",
    name: "Blue Cut Lenses",
    color: "#4F8EF7",
    badge: "Most Popular",
    description:
      "Blue light blocking lenses filter harmful high-energy visible (HEV) blue light emitted by screens, LED lights, and digital devices. Ideal for professionals who spend 6+ hours daily on computers, tablets, or phones.",
    benefits: [
      "Reduces digital eye strain and headaches",
      "Improves sleep quality by limiting blue light before bedtime",
      "Protects retina from cumulative screen damage",
      "Clear lenses — no colour distortion",
    ],
    cta: { label: "Shop Blue Cut Frames", href: "/products?category=eyeglasses" },
  },
  {
    id: "screen",
    name: "Anti-Reflective (AR) Coating",
    color: "#10B981",
    badge: "Recommended",
    description:
      "AR coating eliminates reflections from the front and back of your lenses, giving you clearer vision in all lighting conditions. Essential for driving at night and reducing glare from oncoming headlights.",
    benefits: [
      "Eliminates glare from screens, lights, and headlights",
      "Makes lenses appear nearly invisible — more natural look",
      "Easier for others to see your eyes in conversation",
      "Reduces eye fatigue from reflective light sources",
    ],
    cta: { label: "Shop AR Frames", href: "/products?category=eyeglasses" },
  },
  {
    id: "transition",
    name: "Photochromic (Transition) Lenses",
    color: "#8B5CF6",
    badge: "Dual Purpose",
    description:
      "Photochromic lenses automatically darken in sunlight and return to clear indoors. A perfect 2-in-1 solution — prescription eyeglasses and sunglasses in one pair.",
    benefits: [
      "Seamlessly adapts from clear (indoors) to dark (outdoors)",
      "100% UV protection in their darkened state",
      "No need to carry two pairs of glasses",
      "Available in prescription and non-prescription",
    ],
    cta: { label: "Shop Photochromic Frames", href: "/products?category=eyeglasses" },
  },
  {
    id: "uv400",
    name: "UV400 Sunglasses",
    color: "#F59E0B",
    badge: "Eye Protection",
    description:
      "UV400 lenses block 99–100% of both UVA and UVB radiation — the most comprehensive protection available for your eyes. Essential for outdoor activities in Pakistani summer.",
    benefits: [
      "Blocks 100% of harmful UV rays (UVA + UVB)",
      "Reduces risk of cataracts and macular degeneration",
      "Reduces squinting and eye strain in bright sunlight",
      "Available in polarised options for water and driving",
    ],
    cta: { label: "Shop Sunglasses", href: "/products?category=sunglasses" },
  },
];

export default function LensGuidePage() {
  return (
    <div className="bg-[#0F0F0F] min-h-screen">
      {/* Hero */}
      <section className="bg-[#111111] border-b border-[#2a2a2a] py-12 md:py-20">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-3">Lens Education</p>
          <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl lg:text-6xl text-white font-semibold mb-4">Lens Guide</h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Not sure which lens is right for you? We break down every option so you can make the best choice for your eyes and lifestyle.
          </p>
        </div>
      </section>

      {/* Lens Sections */}
      <section className="py-10 md:py-16">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 space-y-10 md:space-y-12">
          {LENS_TYPES.map(({ id, name, color, badge, description, benefits, cta }, idx) => (
            <div
              key={name}
              id={id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center scroll-mt-28 ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              {/* Text */}
              <div className={idx % 2 === 1 ? "lg:order-2" : ""}>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: color }}
                  >
                    {badge}
                  </span>
                </div>
                <h2 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold mb-4">{name}</h2>
                <p className="text-gray-400 leading-relaxed mb-6 text-sm">{description}</p>
                <ul className="space-y-3 mb-6">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircleIcon className="w-5 h-5 shrink-0 mt-0.5" style={{ color }} />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link href={cta.href}>
                  <Button variant="primary" size="md">{cta.label}</Button>
                </Link>
              </div>

              {/* Color block */}
              <div className={`rounded-xl p-6 md:p-12 flex items-center justify-center ${idx % 2 === 1 ? "lg:order-1" : ""}`} style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${color}25` }}>
                    <div className="w-12 h-12 rounded-full" style={{ backgroundColor: color }} />
                  </div>
                  <p className="font-['Cormorant_Garamond'] text-2xl font-semibold text-white">{name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#111111] border-t border-[#2a2a2a] py-10 md:py-16">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-['Cormorant_Garamond'] text-2xl md:text-4xl text-white font-semibold mb-3">
            Ready to Find Your Perfect Lenses?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Browse our full collection and select your lens type during checkout. Our optical team handles the rest.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/products?category=eyeglasses">
              <Button variant="primary" size="lg">Shop Blue Cut Frames</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">Ask an Optician</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
