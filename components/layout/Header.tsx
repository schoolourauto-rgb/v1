"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Sun, Moon, Menu, X } from "lucide-react"
import Logo from "../Logo"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center h-16">
          <Logo />
        </Link>

        <nav className="hidden md:flex gap-8 font-medium">
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/sell">Sell Car</Link>
          <Link href="/dealer">Sell Car with Help of Trusted Dealers</Link>
          <Link href="/about">About</Link>
        </nav>

        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full p-2"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <Link
            href="/login"
            className="px-4 py-2 rounded bg-yellow-500 text-black font-semibold"
          >
            Login
          </Link>

          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-6 py-4 space-y-3">
          <Link href="/marketplace" onClick={() => setOpen(false)}>Marketplace</Link>
          <Link href="/sell" onClick={() => setOpen(false)}>Sell Car</Link>
          <Link href="/dealer" onClick={() => setOpen(false)}>Dealers</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
        </div>
      )}
    </header>
  )
}
