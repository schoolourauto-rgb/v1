export const dynamic = "force-dynamic"
import { createClient } from "@/lib/supabase/server";
import type { Car } from '@/types/car';

export default async function AdminCarsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cars")
    .select("id, title, brand, model, year, price, dealer_id")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch cars");
  }

  const cars = data ?? [];

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
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td>{car.title}</td>
              <td>{car.brand}</td>
              <td>{car.model}</td>
              <td>{car.year}</td>
              <td>₹{car.price}</td>
              <td>{car.dealer_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
