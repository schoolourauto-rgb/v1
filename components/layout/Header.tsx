
"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";

import { useState } from "react";
import { Menu } from "lucide-react";
import MobileNav from "./MobileNav";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-[var(--card)] border-b border-[var(--border)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo Left */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={110} height={36} className="h-9 w-auto object-contain" />
        </Link>
        {/* Nav Center (desktop) */}
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          <Link href="/marketplace" className="text-base font-medium text-[var(--text)] hover:text-[var(--accent)] transition">Marketplace</Link>
          <Link href="/about" className="text-base font-medium text-[var(--text)] hover:text-[var(--accent)] transition">About</Link>
          <Link href="/dealer/dashboard" className="text-base font-medium text-[var(--text)] hover:text-[var(--accent)] transition">Dashboard</Link>
        </nav>
        {/* Right: Theme toggle + login */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/dealer/login" className="btn btn-primary px-4 py-2 text-base font-semibold">Dealer Login</Link>
          {/* Hamburger for mobile */}
          <button className="md:hidden ml-2 p-2 rounded-2xl hover:bg-[var(--background)]" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu size={26} />
          </button>
        </div>
      </div>
      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setMobileOpen(false)}>
          <div className="absolute top-0 right-0 w-64 h-full bg-[var(--card)] shadow-modern p-6 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image src="/logo.png" alt="Logo" width={100} height={32} className="h-8 w-auto object-contain" />
            </Link>
            <Link href="/marketplace" className="text-lg font-medium text-[var(--text)] hover:text-[var(--accent)] transition" onClick={() => setMobileOpen(false)}>Marketplace</Link>
            <Link href="/about" className="text-lg font-medium text-[var(--text)] hover:text-[var(--accent)] transition" onClick={() => setMobileOpen(false)}>About</Link>
            <Link href="/dealer/dashboard" className="text-lg font-medium text-[var(--text)] hover:text-[var(--accent)] transition" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            <Link href="/dealer/login" className="btn btn-primary px-4 py-2 text-base font-semibold mt-4" onClick={() => setMobileOpen(false)}>Dealer Login</Link>
          </div>
        </div>
      )}
    </header>
  );
}
