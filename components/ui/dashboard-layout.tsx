import { cn } from "@/lib/utils";
import React from "react";

export function DashboardLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-h-screen bg-neutral-50 dark:bg-black flex flex-col", className)}>
      <header className="w-full px-8 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900">
        <div className="font-bold text-xl tracking-tight">Dealer Panel</div>
        <nav className="flex items-center gap-6">
          <a href="/dealer/dashboard" className="hover:underline">Dashboard</a>
          <a href="/dealer/cars" className="hover:underline">Cars</a>
          <a href="/dealer/leads" className="hover:underline">Leads</a>
          <a href="/dealer/settings" className="hover:underline">Settings</a>
        </nav>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
