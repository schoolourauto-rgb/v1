"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <header className="bg-background border-b p-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold">
          Welcome back, Demo Dealer 👋
        </h2>
        <p className="text-sm text-muted-foreground">
          Kaludi Auto World • Verified Dealer
        </p>
      </div>

      <div className="flex gap-3 items-center">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="px-4 py-2 rounded-xl border"
        >
          {theme === "dark" ? "🌙 Dark" : "☀ Light"}
        </button>

        <button className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-semibold">
          Logout
        </button>
      </div>
    </header>
  );
}
