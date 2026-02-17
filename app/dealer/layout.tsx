import Link from "next/link";
import { usePathname } from "next/navigation";

export const dynamic = "force-dynamic"



import { onboardDealer } from "@/lib/dealer/onboardDealer";
import { getServerUser } from "@/lib/supabase/getServerUser";
import { redirect } from "next/navigation";

import React from "react";

const navLinks = [
  { href: "/dealer", label: "Dashboard" },
  { href: "/dealer/add", label: "Add Car" },
  { href: "/dealer/chat", label: "Chat" },
  { href: "/dealer/profile", label: "Profile" },
  { href: "/dealer/refer", label: "Refer" },
  { href: "/dealer/help", label: "Help" },
];

function SidebarNav() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  return (
    <nav className="flex flex-col gap-2 p-6">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function DealerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800">
        <div className="text-2xl font-bold px-6 py-8 mb-4">Dealer Panel</div>
        <SidebarNav />
      </aside>
      <main className="flex-1 p-8 bg-black">{children}</main>
    </div>
  );
}
