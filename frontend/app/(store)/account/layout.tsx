"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/account/orders", label: "My Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/profile", label: "Profile & Settings" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Mobile: horizontal scroll tab pills */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors min-h-[40px] flex items-center",
              pathname === href
                ? "bg-[#C9A84C] text-white border-[#C9A84C]"
                : "text-gray-400 border-[#2a2a2a] hover:border-[#C9A84C] hover:text-white"
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-48 shrink-0">
          <h2 className="text-white font-semibold mb-4">My Account</h2>
          <nav className="space-y-1">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "block px-3 py-2 rounded text-sm transition-colors",
                  pathname === href
                    ? "bg-[#C9A84C]/10 text-[#C9A84C] border-l-2 border-[#C9A84C]"
                    : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
