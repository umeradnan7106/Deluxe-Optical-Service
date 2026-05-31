"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
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

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] shrink-0 bg-[#0F0F0F] border-r border-[#1a1a1a] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1a1a1a] flex items-center justify-between">
        <div>
          <span className="font-['Cormorant_Garamond'] text-lg text-white font-semibold">
            Deluxe<span className="text-[#E8670A]">Opt</span>
          </span>
          <p className="text-gray-500 text-xs mt-0.5">Admin Panel</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 text-gray-400 hover:text-white">
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_SECTIONS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href) && href !== "/admin";
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
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

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <SidebarContent />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-0 top-0 h-full" onClick={(e) => e.stopPropagation()}>
            <SidebarContent onClose={onClose} />
          </div>
        </div>
      )}
    </>
  );
}
