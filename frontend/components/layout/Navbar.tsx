"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/products?gender=men", label: "Men" },
  { href: "/products?gender=women", label: "Women" },
  { href: "/products?category=sunglasses", label: "Sunglasses" },
  { href: "/products?category=prescription", label: "Prescription" },
  { href: "/products?category=blue-cut", label: "Blue Cut" },
  { href: "/products?category=transition", label: "Transition" },
  { href: "/products?sale=true", label: "Sale", gold: true },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#1B2B5E] border-b-2 border-[#C9A84C] hidden md:block">
      <div className="max-w-[1500px] mx-auto px-6 flex items-center justify-between h-11 overflow-x-auto scrollbar-none">
        <ul className="flex items-center gap-1 flex-nowrap">
          {NAV_LINKS.map(({ href, label, gold }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href.split("?")[0]));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px inline-block",
                    gold
                      ? "text-[#C9A84C] hover:text-[#A8893A] border-transparent"
                      : "text-white/75 hover:text-white border-transparent",
                    isActive && !gold && "text-white border-[#C9A84C]"
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/tracking"
          className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1"
        >
          Track Order ›
        </Link>
      </div>
    </nav>
  );
}
