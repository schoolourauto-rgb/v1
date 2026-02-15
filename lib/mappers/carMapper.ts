import type { Car } from "@/types/car";
import type { Database } from "@/lib/supabase/types";



type CarRow = Database["public"]["Tables"]["cars"]["Row"];

export function mapCarRowToCar(data: CarRow): Car {
  return {
    id: data.id ?? "",
    title: data.title ?? "",
    brand: data.brand ?? "",
    dealer_id: data.dealer_id ?? "",
    model: data.model ?? "",
    year: data.year ?? 0,
    fuel_type: data.fuel_type ?? "",
    price: data.price ?? 0,
    transmission: data.transmission ?? "",
    city: data.city ?? "",
  };
}
