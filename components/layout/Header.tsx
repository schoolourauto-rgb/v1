
"use client"


import Link from "next/link"
import { useState } from "react"
import { Menu, X, Sun, Moon } from "lucide-react"
import Logo from "../Logo"
import { useTheme } from "next-themes"

export default function Header() {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LEFT: Logo */}
        <Link href="/" className="flex items-center h-16" aria-label="OurAuto Home">
          <span className="block h-9 md:h-10 w-auto flex items-center">
            <Logo />
          </span>
        </Link>

        {/* CENTER: Nav */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-8 text-base font-medium">
          <Link href="/marketplace" className="relative group px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded">
            <span className="hover:text-yellow-500 transition after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-yellow-500 after:transition-all after:duration-300 group-hover:after:w-full">
              Marketplace
            </span>
          </Link>
          <Link href="/sell" className="relative group px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded">
            <span className="hover:text-yellow-500 transition after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-yellow-500 after:transition-all after:duration-300 group-hover:after:w-full">
              Sell Car
            </span>
          </Link>
          <Link href="/dealer" className="relative group px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded">
            <span className="hover:text-yellow-500 transition after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-yellow-500 after:transition-all after:duration-300 group-hover:after:w-full">
              Dealers
            </span>
          </Link>
          <Link href="/about" className="relative group px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded">
            <span className="hover:text-yellow-500 transition after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-yellow-500 after:transition-all after:duration-300 group-hover:after:w-full">
              About
            </span>
          </Link>
        </nav>

        {/* RIGHT: Theme toggle + Login */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            aria-label="Toggle theme"
            className="rounded-full p-2 hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-yellow-500"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun size={20} className="text-yellow-400 transition-transform duration-300 hover:rotate-180" />
            ) : (
              <Moon size={20} className="text-gray-800 transition-transform duration-300 hover:rotate-180" />
            )}
          </button>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Login
          </Link>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden ml-2 text-black dark:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Open navigation menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-6 py-4 space-y-4 text-base font-medium">
          <Link href="/marketplace" onClick={() => setOpen(false)} className="block py-2 hover:text-yellow-500 transition">
            Marketplace
          </Link>
          <Link href="/sell" onClick={() => setOpen(false)} className="block py-2 hover:text-yellow-500 transition">
            Sell Car
          </Link>
          <Link href="/dealer" onClick={() => setOpen(false)} className="block py-2 hover:text-yellow-500 transition">
            Dealers
          </Link>
          <Link href="/about" onClick={() => setOpen(false)} className="block py-2 hover:text-yellow-500 transition">
            About
          </Link>
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold mt-2 hover:bg-yellow-400 transition"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  )
}
