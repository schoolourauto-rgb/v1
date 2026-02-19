"use client";

export default function DealerSidebar() {
  return (
    <nav className="p-6">
      <ul className="space-y-4">
        <li>
          <a href="/dealer/dashboard" className="hover:underline">Dashboard</a>
        </li>
        <li>
          <a href="/dealer/cars" className="hover:underline">Cars</a>
        </li>
        <li>
          <a href="/dealer/leads" className="hover:underline">Leads</a>
        </li>
        <li>
          <a href="/dealer/settings" className="hover:underline">Settings</a>
        </li>
      </ul>
    </nav>
  );
}
