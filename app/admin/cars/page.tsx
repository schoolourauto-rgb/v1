export const dynamic = "force-dynamic"
import { createServerClient } from "@/lib/supabase/server";


export default async function AdminCarsPage() {
  const supabase = createServerClient();
  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }
  const { data: cars } = await supabase
    .from("cars")
    .select("id, title, brand, model, year, price, dealer_id")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Cars</h2>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Title</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Year</th>
            <th>Price</th>
            <th>Dealer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars?.map((car: any) => (
            <tr key={car.id}>
              <td>{car.title}</td>
              <td>{car.brand}</td>
              <td>{car.model}</td>
              <td>{car.year}</td>
              <td>₹{car.price}</td>
              <td>{car.dealer_id}</td>
              <td>
                {/* Delete action will be implemented here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
