import Link from "next/link";
import Button from "@/components/ui/Button";

const CARDS = [
  {
    title: "Men's Collection",
    subtitle: "Bold frames built for confidence",
    href: "/products?gender=men",
    btnLabel: "Shop Men",
  },
  {
    title: "Women's Collection",
    subtitle: "Elegant frames for every style",
    href: "/products?gender=women",
    btnLabel: "Shop Women",
  },
];

export default function GenderCards() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="text-center mb-8">
          <p className="text-[#E8670A] text-xs font-semibold uppercase tracking-widest mb-1">Collections</p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl text-[#1a1a1a] font-semibold">Shop by Gender</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CARDS.map(({ title, subtitle, href, btnLabel }) => (
            <div
              key={title}
              className="relative rounded-lg overflow-hidden min-h-[220px] md:min-h-[380px] bg-[#1a1212] flex items-end p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
              <div className="relative">
                <p className="text-white/70 text-sm mb-1">{subtitle}</p>
                <h3 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold mb-4">{title}</h3>
                <Link href={href}>
                  <Button variant="primary" size="md">{btnLabel}</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
