import { createClient } from '@/lib/supabase/server';
import type { Car } from "@/types/car";

export async function getSimilarCars(car: Car) {
  const supabase = await createClient();
  const minPrice = Math.round(car.price * 0.9);
  const maxPrice = Math.round(car.price * 1.1);
  const { data } = await supabase
    .from('cars')
    .select('id, title, price, city, car_images(image_url)')
    .eq('status', 'active')
    .eq('city', car.city)
    .eq('brand', car.brand)
    .gte('price', minPrice)
    .lte('price', maxPrice)
    .neq('id', car.id)
    .limit(6);
  return data || [];
}
