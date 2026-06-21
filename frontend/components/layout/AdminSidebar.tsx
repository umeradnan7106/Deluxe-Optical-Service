"use client";

import React from "react";
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
  ExclamationTriangleIcon,
  DocumentTextIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; exact?: boolean };

const NAV_STRUCTURE: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: Squares2X2Icon, exact: true },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingBagIcon },
      { href: "/admin/abandoned-carts", label: "Abandoned Carts", icon: ExclamationTriangleIcon },
      { href: "/admin/orders/new", label: "Draft Orders", icon: DocumentTextIcon },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: TagIcon },
      { href: "/admin/inventory", label: "Inventory", icon: ArchiveBoxIcon },
      { href: "/admin/categories", label: "Categories", icon: RectangleGroupIcon },
    ],
  },
  {
    label: "Marketing",
    items: [
      { href: "/admin/promo-codes", label: "Promo Codes", icon: TicketIcon },
      { href: "/admin/blogs", label: "Blogs", icon: BookOpenIcon },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/lens-options", label: "Lens Options", icon: EyeDropperIcon },
      { href: "/admin/faqs", label: "FAQs", icon: QuestionMarkCircleIcon },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/admin/customers", label: "Customers", icon: UsersIcon },
      { href: "/admin/reviews", label: "Reviews", icon: StarIcon },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/analytics", label: "Analytics", icon: ChartBarIcon },
      { href: "/admin/settings", label: "Settings", icon: Cog6ToothIcon },
    ],
  },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] shrink-0 bg-[#0f1829] border-r border-[#1e293b] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1e293b] flex items-center justify-between">
        <div>
          <div className="font-playfair text-[18px] text-white font-bold">
            Deluxe<span className="text-[#C9A84C]">Opt</span>
          </div>
          <p className="text-[#334155] text-[10px] mt-0.5 uppercase tracking-widest font-semibold">Admin Panel</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 text-white/50 hover:text-white">
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV_STRUCTURE.map((section) => (
          <div key={section.label} className="py-3 border-b border-[#1e293b] last:border-b-0">
            <p className="text-[9px] font-bold uppercase tracking-[.12em] text-[#334155] px-4 mb-2">{section.label}</p>
            {section.items.map(({ href, label, icon: Icon, exact = false }) => {
              const isActive = exact
                ? pathname === href
                : pathname === href || (pathname.startsWith(href + "/") && href !== "/admin");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-[9px] text-[12.5px] transition-all border-l-[3px]",
                    isActive
                      ? "border-[#C9A84C] text-white bg-[#1a2540]"
                      : "border-transparent text-[#64748b] hover:text-white hover:bg-[#1a2540]"
                  )}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
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
