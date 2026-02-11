
import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data: car } = await supabase
    .from("cars")
    .select("id, title, brand, model, year, price, fuel_type, transmission, mileage, images")
    .eq("id", id)
    .single();

  if (!car) return notFound();

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={car.images?.[0] || "/hero-car.jpg"}
          alt={car.title}
          className="w-full md:w-96 h-60 object-cover rounded-lg"
        />
        <div>
          <h1 className="text-2xl font-bold mb-2">{car.title}</h1>
          <div className="mb-2 text-muted-foreground">{car.brand} {car.model} ({car.year})</div>
          <div className="mb-2">Fuel: {car.fuel_type} | Transmission: {car.transmission}</div>
          <div className="mb-2">Mileage: {car.mileage} km</div>
          <div className="text-primary font-bold text-xl mb-4">₹{car.price}</div>
        </div>
      </div>
    </div>
  );
}
