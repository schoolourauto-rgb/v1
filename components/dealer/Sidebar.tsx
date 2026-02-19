"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { name: "Dashboard", href: "/dealer/dashboard" },
  { name: "Cars", href: "/dealer/cars" },
  { name: "Leads", href: "/dealer/leads" },
  { name: "Settings", href: "/dealer/settings" },
  { name: "Support", href: "/dealer/support" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-black text-white p-5 hidden md:block">
      <h2 className="text-xl font-bold mb-8">Dealer Panel</h2>

      <nav className="space-y-3">
        {links.map((link) => {
          const active = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-lg transition ${
                active
                  ? "bg-white text-black font-semibold"
                  : "hover:bg-gray-800"
              }`}
            >
              {link.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
