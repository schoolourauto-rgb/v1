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
          name: car.brand,
        },
        model: car.model,
        vehicleModelDate: car.year,
        fuelType: car.fuel_type,
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
import { createClient } from "@/lib/supabase/server";
import { Car } from "@/types/car";
import BrandGrid from "@/components/seo/BrandGrid";
import CityGrid from "@/components/seo/CityGrid";
import BudgetGrid from "@/components/seo/BudgetGrid";
import FuelGrid from "@/components/seo/FuelGrid";
import TransmissionGrid from "@/components/seo/TransmissionGrid";

// Server Component: Fetch active cars from Supabase and pass to HeroSection
export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  // RLS policy required: Ensure only active cars are fetched and user cannot access others
  let brands = [], cities = [], cars = [], error = null;
  try {
    const results = await Promise.all([
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
    brands = results[0].data || [];
    cities = results[1].data || [];
    cars = results[2].data || [];
    error = results[2].error || null;
  } catch (err) {
    error = err;
  }

  let listings: Car[] = Array.isArray(cars) ? cars : [];

  // Empty state UI
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 rounded-xl bg-zinc-900 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Failed to load cars</h2>
        <p className="text-sm text-zinc-300 mb-6">There was a problem fetching car listings. Please try again later.</p>
        <p className="text-xs text-zinc-400">If you are an admin, check Supabase RLS policies and deployment sync.</p>
      </div>
    );
  }
  if (!listings.length) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 rounded-xl bg-zinc-900 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">No cars found</h2>
        <p className="text-sm text-zinc-300 mb-6">There are currently no cars available. Please check back soon.</p>
      </div>
    );
  }
  let errorMsg = "";
  if (error) {
    errorMsg = "Failed to load cars.";
  } else if (cars) {
    listings = (cars as any[]).map((row) => ({
      id: row.id,
      title: row.title,
      brand: row.brand,
      dealer_id: row.dealer_id ?? '',
      model: row.model,
      year: row.year,
      fuel_type: row.fuel_type,
      price: row.price,
      transmission: row.transmission,
      city: row.city ?? '',
      image: row.car_images?.[0]?.image_url ?? "/logo.png",
      location: row.city ?? "Unknown",
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

      {/* Centered Search Bar */}
      <div className="w-full flex justify-center items-center py-8 bg-white border-b border-zinc-200">
        <input
          type="text"
          placeholder="Search Inventory by Brand, Model, or City"
          className="w-full max-w-xl px-6 py-3 rounded-lg border border-zinc-300 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Trust Strip */}
      <div className="w-full flex justify-center items-center py-2 bg-zinc-50 border-b border-zinc-200 text-zinc-700 text-sm font-medium">
        <span className="mx-4">Live Dealer Inventory</span>
        <span className="mx-4">Direct Dealer Contact</span>
        <span className="mx-4">Updated Daily</span>
      </div>

      {/* Inventory Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.slice(0, 12).map((car) => (
              <div key={car.id} className="bg-white border border-zinc-200 rounded-lg p-4">
                <img src={car.image} alt={car.title} className="w-full h-40 object-cover rounded mb-3" />
                <div className="font-bold text-lg text-black mb-1">{car.brand} {car.model}</div>
                <div className="text-zinc-700 text-sm mb-1">{car.year} • {car.fuel_type} • {car.transmission}</div>
                <div className="text-zinc-900 font-semibold">₹{car.price.toLocaleString()}</div>
                <div className="text-zinc-500 text-xs mt-1">{car.city}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-zinc-400 py-12">No inventory available.</div>
        )}
      </div>

      {/* Minimal Footer */}
      <footer className="w-full py-6 border-t border-zinc-200 bg-white text-center text-zinc-500 text-sm">
        Powered by OurAuto
      </footer>

      {/* Hierarchical mesh: Brand > City */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <BrandGrid brands={(brands ?? []).filter((b) => b.listing_count && b.brand).map((b) => b.brand!)} />
        <CityGrid cities={(cities ?? []).filter((c) => c.listing_count && c.city).map((c) => c.city!)} />
      </div>
    </>
  );
}
