
import Link from "next/link";

export default function DealerDashboard() {
  // TODO: Replace stat values with real data from backend
  const stats = [
    { label: "Total Listings", value: "--" },
    { label: "Active Leads", value: "--" },
    { label: "Referral Credits", value: "--" },
  ];

  return (
    <div className="space-y-10">
      {/* Stat Cards */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-lg font-semibold mb-2 text-zinc-400">{stat.label}</div>
              <div className="text-4xl font-extrabold text-yellow-500">{stat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-sm">
          <div className="text-lg font-semibold mb-4 text-zinc-100">Quick Actions</div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/dealer/add"
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full font-semibold shadow-sm transition-all duration-200"
            >
              Add Car
            </Link>
            <Link
              href="/dealer/listings"
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 rounded-full font-semibold transition-all duration-200"
            >
              View Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Listings Preview */}
      <section>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-sm">
          <div className="text-lg font-semibold mb-4 text-zinc-100">Your Listings</div>
          <div className="text-zinc-400">No listings yet. Add your first car!</div>
        </div>
      </section>
    </div>
  );
}
