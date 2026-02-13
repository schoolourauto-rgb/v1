"use client";

import Link from "next/link";

const menu = [
  { name: "Dashboard", href: "/dealer" },
  { name: "My Listings", href: "/dealer/listings" },
  { name: "Add New Car", href: "/dealer/add" },
  { name: "Leads / Chat", href: "/dealer/chat" },
  { name: "Profile", href: "/dealer/profile" },
  { name: "Refer & Earn", href: "/dealer/refer" },
  { name: "Help & Support", href: "/dealer/help" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#111] border-r border-zinc-800 p-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-10">
        OurAuto
      </h1>

      <nav className="space-y-4">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="block px-4 py-2 rounded-xl hover:bg-yellow-400 hover:text-black transition"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
