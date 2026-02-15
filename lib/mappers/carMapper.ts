import type { Car } from "@/types/car";
import type { Database } from "@/lib/supabase/types";



type CarRow = Database["public"]["Tables"]["cars"]["Row"];

export function mapCarRowToCar(data: CarRow): Car {
  return {
    id: data.id ?? "",
    title: data.title ?? "",
    make: data.brand ?? "",
    model: data.model ?? "",
    year: data.year ?? 0,
    fuel: data.fuel_type ?? "",
    price: data.price ?? 0,
    image: "",
    location: "",
    transmission: data.transmission ?? "",
  };
}
