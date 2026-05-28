"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Squares2X2Icon,
  ShoppingBagIcon,
  TagIcon,
  StarIcon,
  ArchiveBoxIcon,
  TicketIcon,
  BookOpenIcon,
  EyeDropperIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  UsersIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  { href: "/admin", label: "Dashboard", icon: Squares2X2Icon, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBagIcon },
  { href: "/admin/products", label: "Products", icon: TagIcon },
  { href: "/admin/analytics", label: "Analytics", icon: ChartBarIcon },
  { href: "/admin/customers", label: "Customers", icon: UsersIcon },
  { href: "/admin/reviews", label: "Reviews", icon: StarIcon },
  { href: "/admin/inventory", label: "Inventory", icon: ArchiveBoxIcon },
  { href: "/admin/promo-codes", label: "Promo Codes", icon: TicketIcon },
  { href: "/admin/blogs", label: "Blogs", icon: BookOpenIcon },
  { href: "/admin/lens-options", label: "Lens Options", icon: EyeDropperIcon },
  { href: "/admin/faqs", label: "FAQs", icon: QuestionMarkCircleIcon },
  { href: "/admin/settings", label: "Settings", icon: Cog6ToothIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] shrink-0 bg-[#0F0F0F] border-r border-[#1a1a1a] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1a1a1a]">
        <span className="font-['Cormorant_Garamond'] text-lg text-white font-semibold">
          Deluxe<span className="text-[#E8670A]">Opt</span>
        </span>
        <p className="text-gray-500 text-xs mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        {NAV_SECTIONS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href) && href !== "/admin";
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-5 py-2.5 text-sm transition-colors border-l-2",
                isActive
                  ? "border-[#E8670A] text-white bg-[#1a1a1a]"
                  : "border-transparent text-gray-400 hover:text-white hover:bg-[#1a1a1a]/50"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
