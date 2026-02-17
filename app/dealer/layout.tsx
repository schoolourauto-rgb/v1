

import Link from "next/link";

export default function DealerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 p-6">
        <h2 className="text-xl font-bold mb-8 text-yellow-400">
          Dealer Panel
        </h2>
        <nav className="space-y-4 text-sm">
          <Link href="/dealer">Dashboard</Link>
          <Link href="/dealer/add">Add New Car</Link>
          <Link href="/dealer/chat">Leads / Chat</Link>
          <Link href="/dealer/profile">Profile</Link>
          <Link href="/dealer/refer">Refer & Earn</Link>
          <Link href="/dealer/help">Help & Support</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-zinc-950">
        {children}
      </main>
    </div>
  );
}
