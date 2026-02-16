
"use client"


"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"


export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <header className="border-b border-yellow-500 bg-white dark:bg-black sticky top-0 z-30 transition-colors duration-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
        <span className="font-semibold tracking-wide text-base select-none text-black dark:text-white">FREE MARKETPLACE</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-black dark:text-white hover:text-yellow-500 transition-colors duration-200 text-xl p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <Link
            href="/auth/login"
            className="text-black dark:text-white hover:text-yellow-500 transition-colors duration-200 text-sm font-medium px-3 py-1 rounded-lg"
          >
            Dealer Login
          </Link>
        </div>
      </div>
    </header>
  );
}
