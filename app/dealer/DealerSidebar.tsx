"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DealerSidebar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded-lg transition ${
      pathname === path
        ? "bg-yellow-500 text-black font-semibold"
        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
    }`;

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 space-y-4">
      <h2 className="text-xl font-bold text-yellow-500 mb-6">OurAuto</h2>

      <nav className="space-y-2">
        <Link href="/dealer" className={linkClass("/dealer")}>Dashboard</Link>
        <Link href="/dealer/add" className={linkClass("/dealer/add")}>Add New Car</Link>
        <Link href="/dealer/chat" className={linkClass("/dealer/chat")}>Leads / Chat</Link>
        <Link href="/dealer/profile" className={linkClass("/dealer/profile")}>Profile</Link>
        <Link href="/dealer/refer" className={linkClass("/dealer/refer")}>Refer & Earn</Link>
        <Link href="/dealer/help" className={linkClass("/dealer/help")}>Help & Support</Link>
      </nav>
    </aside>
  );
}
