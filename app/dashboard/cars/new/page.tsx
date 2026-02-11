
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NewCarPage() {
  // Form submission logic will be handled via API route
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Car</h2>
      <form action="/api/car" method="post" className="space-y-4">
        <input name="title" placeholder="Title" required className="input" />
        <input name="brand" placeholder="Brand" required className="input" />
        <input name="model" placeholder="Model" required className="input" />
        <input name="year" placeholder="Year" type="number" required className="input" />
        <input name="price" placeholder="Price" type="number" required className="input" />
        <input name="fuel_type" placeholder="Fuel Type" required className="input" />
        <input name="transmission" placeholder="Transmission" required className="input" />
        <input name="mileage" placeholder="Mileage" type="number" required className="input" />
        {/* Image upload will be handled separately */}
        <button type="submit" className="btn btn-primary">Add Car</button>
      </form>
    </div>
  );
}
