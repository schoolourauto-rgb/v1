"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setTheme(isDark ? "dark" : "light");
  };

  if (theme === null) return null; // Avoid hydration mismatch

  return (
    <button
      aria-label="Toggle theme"
      className="rounded-2xl p-2 text-xl transition-colors duration-200 hover:bg-[var(--bg)] border border-[var(--border)]"
      onClick={toggleTheme}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
