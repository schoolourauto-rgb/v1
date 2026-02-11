import { createClient } from "@/lib/supabase/server";

export default async function AdminDealersPage() {
  const supabase = createClient();
  const { data: dealers } = await supabase
    .from("dealers")
    .select("id, dealership_name, phone, location, verified")
    .order("created_at", { ascending: false });

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
          {dealers?.map((dealer: any) => (
            <tr key={dealer.id}>
              <td>{dealer.dealership_name}</td>
              <td>{dealer.phone}</td>
              <td>{dealer.location}</td>
              <td>{dealer.verified ? "Yes" : "No"}</td>
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
