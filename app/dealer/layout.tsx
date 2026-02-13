"use client";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
