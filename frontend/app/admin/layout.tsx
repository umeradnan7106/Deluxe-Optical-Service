import AdminShell from "@/components/admin/AdminShell";

export const metadata = { title: { template: "%s | Admin — Deluxe Opt", default: "Admin Panel — Deluxe Opt" } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
