import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import manImage from "@/app/public/man-image.png";
import womenImage from "@/app/public/women-image.png";

const CARDS = [
  {
    title: "Men's Collection",
    subtitle: "Bold frames built for confidence",
    href: "/products?gender=men",
    btnLabel: "Shop Men",
    image: manImage,
  },
  {
    title: "Women's Collection",
    subtitle: "Elegant frames for every style",
    href: "/products?gender=women",
    btnLabel: "Shop Women",
    image: womenImage,
  },
];

export default function GenderCards() {
  return (
    <section className="bg-white py-10 md:py-16">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 md:mb-8">
          <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-1">Collections</p>
          <h2 className="font-playfair text-[26px] md:text-4xl text-[#1B2B5E] font-bold">Shop by Gender</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CARDS.map(({ title, subtitle, href, btnLabel, image }) => (
            <div
              key={title}
              className="relative rounded-lg overflow-hidden min-h-[220px] md:min-h-[700px] flex items-end p-8"
            >
              <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-black/20" />
              <div className="relative">
                <p className="text-white/70 text-sm mb-1">{subtitle}</p>
                <h3 className="font-playfair text-3xl text-white font-semibold mb-4">{title}</h3>
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
