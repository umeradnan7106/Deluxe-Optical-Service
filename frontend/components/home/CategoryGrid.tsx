import Link from "next/link";

const CATS = [
  {
    label: "Sunglasses",
    href: "/products?category=sunglasses",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
  },
  {
    label: "Prescription",
    href: "/products?category=prescription",
    gradient: "linear-gradient(135deg, #1c1c2e 0%, #2d2d4e 100%)",
  },
  {
    label: "Blue Cut",
    href: "/products?category=blue-cut",
    gradient: "linear-gradient(135deg, #0f1f3d 0%, #1a3a6e 100%)",
  },
  {
    label: "Transition",
    href: "/products?category=transition",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #2d1a4e 100%)",
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
] as const;

export default function CategoryGrid() {
  return (
    <section className="bg-[#faf9f7] py-16">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="text-center mb-8">
          <p className="text-[#E8670A] text-[10px] font-semibold uppercase tracking-widest mb-1">Explore</p>
          <h2 className="font-['Cormorant_Garamond'] text-[32px] text-[#1a1a1a] font-semibold">Shop by Category</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
          {CATS.map(({ label, href, gradient }) => (
            <Link
              key={label}
              href={href}
              className="group snap-start shrink-0 relative rounded-xl overflow-hidden cursor-pointer"
              style={{ height: 180, minWidth: 160, flex: "0 0 auto" }}
            >
              {/* Gradient background */}
              <div className="absolute inset-0" style={{ background: gradient }} />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-[14px] font-semibold leading-tight">{label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
