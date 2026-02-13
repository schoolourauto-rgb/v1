export default function StatsCards() {
  const stats = [
    { label: "Total Listings", value: 12 },
    { label: "Active Leads", value: 5 },
    { label: "Total Views", value: 324 },
    { label: "Earnings", value: "₹ 0" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[#1a1a1a] p-6 rounded-2xl shadow-xl border border-zinc-800"
        >
          <p className="text-sm text-zinc-400">{stat.label}</p>
          <h3 className="text-2xl font-bold mt-2 text-yellow-400">
            {stat.value}
          </h3>
        </div>
      ))}
    </div>
  );
}
