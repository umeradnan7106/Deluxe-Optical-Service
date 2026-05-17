import AdminSidebar from "@/components/layout/AdminSidebar";

export const metadata = { title: { template: "%s | Admin — Deluxe Opt", default: "Admin Panel — Deluxe Opt" } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
