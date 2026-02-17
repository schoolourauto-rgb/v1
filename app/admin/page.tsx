
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createClient } from "@/lib/supabase/server";


export default async function AdminDashboard() {
  await requireAdmin();
  const supabase = await createClient();
  // Storage usage metric
  let storageCount = 0;
  try {
    const { data } = await supabase.storage.from("car-images").list("", { limit: 10000 });
    storageCount = Array.isArray(data) ? data.length : 0;
  } catch {
    storageCount = 0;
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">Total Dealers</div>
        <div className="bg-white p-4 rounded shadow">Active Dealers</div>
        <div className="bg-white p-4 rounded shadow">Total Listings</div>
        <div className="bg-white p-4 rounded shadow">Active Listings</div>
        <div className="bg-white p-4 rounded shadow">Total Views</div>
        <div className="bg-white p-4 rounded shadow">Total Leads</div>
        <div className="bg-white p-4 rounded shadow">New Signups Today</div>
        <div className="bg-white p-4 rounded shadow">Car Images Stored: {storageCount}</div>
      </div>
    </div>
  );
}
