

import DealerSidebar from "@/components/dealer/DealerSidebar";

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 hidden md:block">
        <DealerSidebar />
      </aside>

      {/* Mobile sidebar */}
      <div className="md:hidden">
        <DealerSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
