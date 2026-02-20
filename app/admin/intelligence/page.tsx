import { requireAdmin } from "@/lib/auth/requireAdmin";
// adminSupabase removed. Replace with server client if needed.

export default async function IntelligencePage() {
  await requireAdmin();
  // Fetch recent fraud flags, risky dealers, suspicious clusters
  // TODO: Implement actual queries
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Intelligence</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Recent Fraud Flags</h2>
        <div>Fraud flags table (paginated) here</div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Top Risky Dealers</h2>
        <div>Dealers with lowest trust scores here</div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Suspicious IP Clusters</h2>
        <div>IP clusters with high lead activity here</div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Suspicious Phone Clusters</h2>
        <div>Phone clusters with high lead activity here</div>
      </section>
    </div>
  );
}
