"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"

export default function Header() {
  const { theme } = useTheme()
  return (
    <header
      className={`border-b w-full ${
        theme === "dark" ? "bg-black border-border" : "bg-white border-gray-200"
      }`}
    >
      <div className="mx-auto max-w-[1280px] flex items-center justify-between px-4 py-2">
        <Link href="/" className="flex items-center" aria-label="OurAuto Home">
          <Image
            src="/logo.png"
            alt="OurAuto Logo"
            width={140}
            height={40}
            priority
            className="hidden md:block h-10 w-auto"
          />
          <Image
            src="/logo.png"
            alt="OurAuto Logo"
            width={110}
            height={32}
            priority
            className="md:hidden h-8 w-auto"
          />
        </Link>
        <nav className="flex items-center space-x-4">
          {/* Add navigation links here */}
          <div className="md:hidden">
            {/* Mobile menu placeholder */}
            <button
              className="rounded-lg p-2 text-gray-500 hover:text-primary focus:outline-none"
              aria-label="Open mobile menu"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
