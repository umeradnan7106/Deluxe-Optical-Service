import AdminSidebar from "@/components/layout/AdminSidebar";

export const metadata = { title: { template: "%s | Admin — Deluxe Opt", default: "Admin Panel — Deluxe Opt" } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 shrink-0">
          <span className="text-sm text-gray-500 font-medium">Deluxe Opt — Admin</span>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
