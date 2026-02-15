// JSON-LD generator for Vehicle structured data
function generateVehicleJsonLd(cars: Car[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: cars.slice(0, 6).map((car, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Vehicle",
        name: car.title,
        brand: {
          "@type": "Brand",
          name: car.make,
        },
        model: car.model,
        vehicleModelDate: car.year,
        fuelType: car.fuel,
        vehicleTransmission: car.transmission,
        offers: {
          "@type": "Offer",
          price: car.price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };
}

import HeroSection from "@/components/marketplace/HeroSection";
import { createServerClient } from "@/lib/supabase/server";
import { Car } from "@/types/car";
import BrandGrid from "@/components/seo/BrandGrid";
import CityGrid from "@/components/seo/CityGrid";
import BudgetGrid from "@/components/seo/BudgetGrid";
import FuelGrid from "@/components/seo/FuelGrid";
import TransmissionGrid from "@/components/seo/TransmissionGrid";

// Server Component: Fetch active cars from Supabase and pass to HeroSection
export const revalidate = 60;
export const runtime = "edge";

export default async function Page() {
  const supabase = createServerClient();
  if (!supabase) {
    throw new Error("Supabase client not configured. Check environment variables.");
  }

  // Fetch mesh data from materialized views
  const [
    { data: brands },
    { data: cities },
    { data: cars, error },
  ] = await Promise.all([
    supabase
      .from("seo_brand_counts")
      .select("brand, listing_count")
      .order("listing_count", { ascending: false })
      .limit(12),
    supabase
      .from("seo_city_counts")
      .select("city, listing_count")
      .order("listing_count", { ascending: false })
      .limit(10),
    supabase
      .from("cars")
      .select(`
        id,
        title,
        brand,
        model,
        year,
        price,
        fuel_type,
        transmission,
        city,
        car_images(image_url)
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
  ]);

  let listings: Car[] = [];
  let errorMsg = "";
  if (error) {
    errorMsg = "Failed to load cars.";
  } else if (cars) {
    listings = (cars as any[]).map((row) => ({
      id: row.id,
      title: row.title,
      make: row.brand,
      model: row.model,
      year: row.year,
      fuel: row.fuel_type,
      price: row.price,
      image: row.car_images?.[0]?.image_url ?? "/logo.png",
      location: row.city ?? "Unknown",
      transmission: row.transmission,
    }));
  }

  const jsonLd = generateVehicleJsonLd(listings);

  return (
    <>
      {errorMsg && (
        <div className="text-center text-red-500 py-4">{errorMsg}</div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <HeroSection listings={listings} />

      {/* Hierarchical mesh: Brand > City */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <BrandGrid brands={(brands ?? []).filter((b) => b.listing_count && b.brand).map((b) => b.brand!)} />
        <CityGrid cities={(cities ?? []).filter((c) => c.listing_count && c.city).map((c) => c.city!)} />
      </div>
    </>
  );
}
