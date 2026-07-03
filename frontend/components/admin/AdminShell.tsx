"use client";

import { useState } from "react";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import AdminSidebar from "@/components/layout/AdminSidebar";
import useAuthStore from "@/store/authStore";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  const initials = user?.full_name
    ? user.full_name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "A";

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[52px] bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 ">
          {/* Left: hamburger + title */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-[#F8FAFC] border border-[#E2E8F0] transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Bars3Icon className="w-5 h-5 text-[#64748b]" />
            </button>
            <div>
              <div className="font-playfair text-[18px] font-bold text-[#1B2B5E] leading-tight hidden md:block">Admin Panel</div>
              <div className="text-[11px] text-[#64748b] hidden md:block">{today}</div>
            </div>
          </div>

          {/* Right: bell + user */}
          <div className="flex items-center gap-2">
            <div className="relative w-[34px] h-[34px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-center cursor-pointer hover:border-[#1B2B5E] transition-colors">
              <BellIcon className="w-[18px] h-[18px] text-[#64748b]" />
            </div>
            <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 cursor-pointer hover:border-[#1B2B5E] transition-colors">
              <div className="w-[26px] h-[26px] bg-[#1B2B5E] rounded-full flex items-center justify-center text-white text-[11px] font-bold">
                {initials}
              </div>
              <span className="text-[12px] font-semibold text-[#0F172A] hidden sm:block">
                {user?.full_name?.split(" ")[0] ?? "Admin"}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
