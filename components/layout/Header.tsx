
"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LEFT SIDE - LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="OurAuto"
            width={140}
            height={40}
            priority
            className="object-contain"
          />
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/marketplace" className="hover:text-blue-600 transition">
            Marketplace
          </Link>
          <Link href="/sell" className="hover:text-blue-600 transition">
            Sell Car
          </Link>
          <Link href="/dealer" className="hover:text-blue-600 transition">
            Dealers
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition">
            About
          </Link>

          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition"
          >
            Login
          </Link>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-6 py-4 space-y-4">
          <Link href="/marketplace" onClick={() => setOpen(false)} className="block">
            Marketplace
          </Link>
          <Link href="/sell" onClick={() => setOpen(false)} className="block">
            Sell Car
          </Link>
          <Link href="/dealer" onClick={() => setOpen(false)} className="block">
            Dealers
          </Link>
          <Link href="/about" onClick={() => setOpen(false)} className="block">
            About
          </Link>
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  )
}
