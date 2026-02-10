
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

        {/* LEFT SIDE */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-white"
        >
          OurAuto
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <Link href="/marketplace" className="hover:text-white transition">
            Marketplace
          </Link>
          <Link href="/sell" className="hover:text-white transition">
            Sell Car
          </Link>
          <Link href="/dealer" className="hover:text-white transition">
            Dealers
          </Link>
          <Link href="/about" className="hover:text-white transition">
            About
          </Link>

          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition"
          >
            Login
          </Link>
        </nav>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-black border-t border-gray-800 px-6 py-4 space-y-4 text-gray-300">
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
