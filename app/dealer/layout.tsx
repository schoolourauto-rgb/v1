


import Link from "next/link";
import Header from "@/components/layout/Header";

const navLinks = [
  { href: "/dealer", label: "Dashboard" },
  { href: "/dealer/add", label: "Add New Car" },
  { href: "/dealer/listings", label: "Listings" },
  { href: "/dealer/chat", label: "Leads / Chat" },
  { href: "/dealer/profile", label: "Profile" },
  { href: "/dealer/refer", label: "Refer & Earn" },
  { href: "/dealer/help", label: "Help & Support" },
];

export default function DealerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-zinc-800 p-6 flex flex-col">
        <h2 className="text-2xl font-extrabold mb-10 text-yellow-400 tracking-tight">Dealer Panel</h2>
        <nav className="flex-1">
          <ul className="space-y-3">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-4 py-2 rounded-lg hover:bg-zinc-800 transition"
                  // TODO: Add active className logic in client component
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
