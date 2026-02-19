


export default function DealerLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">

      {/* Sidebar */}
      <aside className="w-64 bg-[var(--bg-card)] border-r border-[var(--border)] p-6">
        <h2 className="text-xl font-semibold mb-6">Dealer Panel</h2>

        <nav className="space-y-3">
          <a href="/dealer/dashboard" className="block px-4 py-2 rounded-lg hover:bg-[var(--accent)]/20">
            Dashboard
          </a>
          <a href="/dealer/cars" className="block px-4 py-2 rounded-lg hover:bg-[var(--accent)]/20">
            Cars
          </a>
          <a href="/dealer/refer" className="block px-4 py-2 rounded-lg hover:bg-[var(--accent)]/20">
            Refer & Earn
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
