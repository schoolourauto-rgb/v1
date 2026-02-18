"use client"

import Link from "next/link"
import { Home, Search, PlusCircle, Bell, User } from "lucide-react"
import { usePathname } from "next/navigation"

export default function MobileNav() {
  const pathname = usePathname()

  const navItem = (href: string, icon: React.ReactNode) => (
    <Link
      href={href}
      className={`flex flex-col items-center text-xs ${
        pathname === href ? "text-yellow-500" : "text-neutral-500"
      }`}
    >
      {icon}
    </Link>
  )

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 z-50 sm:hidden flex justify-around py-2">
      {navItem("/", <Home size={20} />)}
      {navItem("/marketplace", <Search size={20} />)}
      {navItem("/dealer/add", <PlusCircle size={22} />)}
      {navItem("/dealer/dashboard", <Bell size={20} />)}
      {navItem("/dealer/profile", <User size={20} />)}
    </div>
  )
}
