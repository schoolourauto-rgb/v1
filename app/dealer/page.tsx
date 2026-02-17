
import Link from "next/link";
export default function DealerDashboard() {
  return (
    <div className="mb-8">
      {/* Stats Cards */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
            <div className="text-xl font-semibold mb-4">Total Listings</div>
            <div className="text-3xl font-bold">--</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
            <div className="text-xl font-semibold mb-4">Active Leads</div>
            <div className="text-3xl font-bold">--</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
            <div className="text-xl font-semibold mb-4">Referral Credits</div>
            <div className="text-3xl font-bold">--</div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
          <div className="text-xl font-semibold mb-4">Quick Actions</div>
          <div className="flex gap-4">
            <Link
              href="/dealer/add"
              className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:opacity-90 transition"
            >
              Add Car
            </Link>
            <Link
              href="/dealer/listings"
              className="px-6 py-3 bg-neutral-800 border border-neutral-600 rounded-lg hover:bg-neutral-700 transition"
            >
              View Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
          <div className="text-xl font-semibold mb-4">Your Listings</div>
          <div className="text-zinc-400">Listings will appear here.</div>
        </div>
      </section>

      {/* Profile Card */}
      <section>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
          <div className="text-xl font-semibold mb-4">Profile</div>
          <div className="text-zinc-400">Profile details will appear here.</div>
        </div>
      </section>
    </div>
  );
}
