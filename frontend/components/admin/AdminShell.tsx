"use client";

import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 md:px-6 shrink-0">
          <button
            className="md:hidden mr-3 p-1.5 rounded hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Bars3Icon className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-gray-500 font-medium">Deluxe Opt — Admin</span>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
