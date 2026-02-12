
"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          OurAuto
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/about" className="hover:text-primary transition-colors">
            About
          </Link>
          <Link
            href="/login"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:opacity-90 transition"
          >
            Login
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-3">
          <Link
            href="/login"
            className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm"
          >
            Login
          </Link>

          <button onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 space-y-4">
          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className="block"
          >
            About
          </Link>
        </div>
      )}
    </header>
  )
}
