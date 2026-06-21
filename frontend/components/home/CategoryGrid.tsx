import Link from "next/link";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import sunglassesImg from "@/app/public/sunglasses-category.png";
import prescriptionImg from "@/app/public/prescription-category.png";
import transitionImg from "@/app/public/transition-category.png";
import bluecutImg from "@/app/public/bluecut-category.png";

const CATS: {
  label: string;
  href: string;
  gradient: string;
  image?: StaticImageData;
}[] = [
  {
    label: "Sunglasses",
    href: "/products?category=sunglasses",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
    image: sunglassesImg,
  },
  {
    label: "Prescription",
    href: "/products?category=prescription",
    gradient: "linear-gradient(135deg, #1c1c2e 0%, #2d2d4e 100%)",
    image: prescriptionImg,
  },
  {
    label: "Blue Cut",
    href: "/products?category=blue-cut",
    gradient: "linear-gradient(135deg, #0f1f3d 0%, #1a3a6e 100%)",
    image: bluecutImg,
  },
  {
    label: "Transition",
    href: "/products?category=transition",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #2d1a4e 100%)",
    image: transitionImg,
  },
  {
    label: "Screen",
    href: "/products?category=screen",
    gradient: "linear-gradient(135deg, #1a2e1a 0%, #2d4e2d 100%)",
  },
  {
    label: "Kids",
    href: "/products?category=kids",
    gradient: "linear-gradient(135deg, #2e1a1a 0%, #4e2d2d 100%)",
  },
];

function CatTile({ label, href, gradient, image, height, minWidth, textSize }: {
  label: string; href: string; gradient: string; image?: StaticImageData;
  height: number; minWidth?: number; textSize: string;
}) {
  return (
    <Link
      href={href}
      className="group snap-start shrink-0 relative rounded-xl overflow-hidden cursor-pointer flex-1"
      style={{ height, minWidth }}
    >
      {image ? (
        <Image src={image} alt={label} fill className="object-cover" sizes="200px" />
      ) : (
        <div className="absolute inset-0" style={{ background: gradient }} />
      )}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className={`text-white ${textSize} font-semibold leading-tight`}>{label}</p>
      </div>
    </Link>
  );
}

export default function CategoryGrid() {
  return (
    <section className="bg-[#faf9f7] py-10 md:py-16">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 md:mb-8">
          <p className="text-[#C9A84C] text-[10px] font-semibold uppercase tracking-widest mb-1">Explore</p>
          <h2 className="font-playfair text-[26px] md:text-[32px] text-[#1B2B5E] font-bold">Shop by Category</h2>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex md:hidden gap-3 overflow-x-auto pb-2 snap-x scrollbar-none -mx-4 px-4">
          {CATS.map((cat) => (
            <CatTile key={cat.label} {...cat} height={160} minWidth={140} textSize="text-[13px]" />
          ))}
        </div>

        {/* Tablet: 3-column grid */}
        <div className="hidden md:grid lg:hidden grid-cols-3 gap-4">
          {CATS.map((cat) => (
            <CatTile key={cat.label} {...cat} height={220} textSize="text-[14px]" />
          ))}
        </div>

        {/* Desktop: 6-column auto-fill */}
        <div className="hidden lg:flex gap-4 overflow-x-auto pb-2 snap-x">
          {CATS.map((cat) => (
            <CatTile key={cat.label} {...cat} height={220} minWidth={140} textSize="text-[14px]" />
          ))}
        </div>
      </div>
    </section>
  );
}
