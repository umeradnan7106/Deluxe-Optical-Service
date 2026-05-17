"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/products?gender=men", label: "Men" },
  { href: "/products?gender=women", label: "Women" },
  { href: "/products?category=sunglasses", label: "Sunglasses" },
  { href: "/products?category=eyeglasses&prescription=true", label: "Prescription" },
  { href: "/lens-guide#blue-cut", label: "Blue Cut" },
  { href: "/lens-guide#screen", label: "Screen" },
  { href: "/lens-guide#transition", label: "Transition" },
  { href: "/products?sale=true", label: "Sale", orange: true },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#1a1a1a] border-b border-[#2a2a2a] hidden md:block">
      <div className="max-w-[1500px] mx-auto px-6 flex items-center justify-between h-11">
        <ul className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, orange }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href.split("?")[0]));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors rounded-sm",
                    orange
                      ? "text-[#E8670A] hover:text-[#C45408]"
                      : "text-gray-300 hover:text-white",
                    isActive && !orange && "text-white border-b-2 border-[#E8670A]"
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/track-order"
          className="text-sm text-gray-400 hover:text-[#E8670A] transition-colors"
        >
          Track Order
        </Link>
      </div>
    </nav>
  );
}
