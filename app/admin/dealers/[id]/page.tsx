import { requireAdmin } from "@/lib/auth/requireAdmin";

export default async function DealerDetailPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  // TODO: Fetch dealer info, stats, and activity logs from DB
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Dealer Detail</h1>
      <div className="mb-6">Dealer info, joined date, stats, etc.</div>
      <h2 className="text-lg font-semibold mb-2">Activity Timeline</h2>
      <ul className="border-l-2 border-gray-300 pl-4">
        {/* Map activity logs here */}
        <li className="mb-4">
          <div className="font-semibold">[10:03] Dealer Signup</div>
        </li>
        <li className="mb-4">
          <div className="font-semibold">[10:05] Car Created (#123)</div>
        </li>
        <li className="mb-4">
          <div className="font-semibold">[10:06] Status Changed → Active</div>
        </li>
        <li className="mb-4">
          <div className="font-semibold">[10:20] Lead Received</div>
        </li>
        <li className="mb-4">
          <div className="font-semibold">[10:45] Dealer Logout</div>
        </li>
      </ul>
    </div>
  );
}
