
import { createClient } from "@/lib/supabase/server";
import { Dealer } from "@/types";


export default async function AdminDealersPage() {
  const supabase = createClient();
  let dealers: Dealer[] = [];
  if (!supabase) {
    // Optionally log or handle missing supabase client
  } else {
    const { data } = await supabase
      .from("dealers")
      .select("id, user_id, dealership_name, phone, location, verified, created_at, referral_code, referred_by")
      .order("created_at", { ascending: false });
    dealers = data ?? [];
  }

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
              <td>{dealer.dealership_name}</td>
              <td>{dealer.phone}</td>
              <td>{dealer.location || '-'}</td>
              <td>{dealer.verified ? 'Yes' : 'No'}</td>
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
