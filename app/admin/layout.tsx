import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <ul className="space-y-2">
            <li><Link href="/admin">Dashboard</Link></li>
            <li><Link href="/admin/dealers">Dealers</Link></li>
            <li><Link href="/admin/cars">Cars</Link></li>
            <li><Link href="/admin/leads">Leads</Link></li>
            <li><Link href="/admin/activity">Activity Logs</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
