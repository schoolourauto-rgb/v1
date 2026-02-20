import Link from "next/link";
"use client";

export default function DealerSidebar() {
  return (
    <nav className="p-6">
      <ul className="space-y-4">
        <li>
          <Link href="/dealer/dashboard" className="hover:underline">Dashboard</Link>
        </li>
        <li>
          <Link href="/dealer/cars" className="hover:underline">Cars</Link>
        </li>
        <li>
          <Link href="/dealer/leads" className="hover:underline">Leads</Link>
        </li>
        <li>
          <Link href="/dealer/settings" className="hover:underline">Settings</Link>
        </li>
      </ul>
    </nav>
  );
}
