import Link from "next/link";
import Button from "@/components/ui/Button";

const CARDS = [
  {
    title: "Men's Collection",
    subtitle: "Bold frames built for confidence",
    href: "/products?gender=men",
    gradient: "from-black/70 to-black/20",
    bg: "bg-[#1a1212]",
  },
  {
    title: "Women's Collection",
    subtitle: "Elegant frames for every style",
    href: "/products?gender=women",
    gradient: "from-black/70 to-black/20",
    bg: "bg-[#121218]",
  },
];

export default function GenderCards() {
  return (
    <section className="max-w-[1500px] mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CARDS.map(({ title, subtitle, href, gradient, bg }) => (
          <Link key={title} href={href} className="group">
            <div className={`relative rounded overflow-hidden h-72 ${bg} flex items-end p-8 hover:ring-1 hover:ring-[#E8670A] transition-all`}>
              <div className={`absolute inset-0 bg-gradient-to-t ${gradient}`} />
              <div className="relative">
                <p className="text-gray-400 text-sm mb-1">{subtitle}</p>
                <h2 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold mb-4">{title}</h2>
                <Button variant="outline" size="md">Shop Now</Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
