import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-zinc-800">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

      <div className="flex gap-4">
        <Link
          href="/dealer/add"
          className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold"
        >
          Add New Car
        </Link>

        <Link
          href="/dealer/chat"
          className="border border-yellow-400 text-yellow-400 px-6 py-3 rounded-xl"
        >
          View Leads
        </Link>
      </div>
    </div>
  );
}
