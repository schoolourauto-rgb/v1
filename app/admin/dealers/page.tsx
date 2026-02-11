
import { createClient } from "@/lib/supabase/server";
import { Dealer } from "@/types";

export default async function AdminDealersPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, business_name, owner_name, mobile, role, created_at, updated_at")
    .eq("role", "dealer")
    .order("created_at", { ascending: false });
  const dealers: Dealer[] = data ?? [];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Dealers</h2>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Dealership</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dealers.map((dealer: Dealer) => (
            <tr key={dealer.id}>
              <td>{dealer.business_name}</td>
              <td>{dealer.mobile}</td>
              <td>-</td>
              <td>Yes</td>
              <td>
                {/* Approve/Reject toggle will be implemented here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
