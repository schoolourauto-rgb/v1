"use client"

import Link from "next/link";
import { Home, Search, PlusCircle, Bell, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

export default function MobileNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home", icon: <Home size={22} /> },
    { href: "/marketplace", label: "Marketplace", icon: <Search size={22} /> },
    { href: "/sell", label: "Sell", icon: <PlusCircle size={26} /> },
    { href: "/dealer-login", label: "Dealer Login", icon: <Bell size={22} /> },
    { href: "/login", label: "Login", icon: <User size={22} /> },
    { href: "/signup", label: "Signup", icon: <User size={22} /> },
  ];

  const navItem = (href: string, icon: React.ReactNode) => (
    <Link
      href={href}
      className={`flex flex-col items-center text-xs rounded-2xl px-2 py-1 transition-all ${
        pathname === href ? "text-accent bg-accent/10" : "text-foreground/60"
      }`}
    >
      {icon}
    </Link>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background soft-border z-50 sm:hidden flex justify-between items-center py-2 px-4 rounded-t-2xl">
      <div className="flex-shrink-0">
        <Logo />
      </div>
      <div className="flex gap-4">
        {navLinks.map((link) => navItem(link.href, link.icon))}
      </div>
    </nav>
  );
}
