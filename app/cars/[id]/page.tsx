
import { createClientInstance } from "@/lib/supabase/server";
import { Car } from "@/types/car";
import { mapCarRowToCar } from "@/lib/mappers/carMapper";
import { buildMetadata } from "@/lib/seo/metadataBuilder";
import CarCard from "@/components/marketplace/CarCard";

export const revalidate = 60;
export const runtime = "edge";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps) {
  const supabase = createClientInstance();
  const { data } = await supabase
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
      car_images(image_url),
      city_id,
      created_at,
      dealer_id,
      description,
      is_active,
      km_driven
    `)
    .eq("id", params.id)
    .single();

  if (!data) return { title: "Car Not Found" };

  return buildMetadata({
    brand: data.brand,
    model: data.model,
    year: data.year,
    city: data.city ?? undefined,
  });
}

export default async function CarDetailPage({ params }: PageProps) {
  const supabase = createClientInstance();
  const { data } = await supabase
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
    .eq("id", params.id)
    .single();

  if (!data) {
    return <div className="text-center py-20">Car not found.</div>;
  }

  // Use the centralized mapper for Car
  // Use the strict-safe mapper
  // Use the strict-safe mapper, then patch image/location for UI
  // Destructure only the fields needed for CarRow
  const carRow = {
    id: data.id,
    title: data.title,
    brand: data.brand,
    model: data.model,
    year: data.year,
    price: data.price,
    fuel_type: data.fuel_type,
    transmission: data.transmission,
    city: data.city,
    city_id: null,
    created_at: null,
    dealer_id: null,
    description: null,
    is_active: null,
    km_driven: null,
  };
  let car: Car = mapCarRowToCar(carRow);
  car = {
    ...car,
    image: data.car_images?.[0]?.image_url ?? "/logo.png",
    location: data.city ?? "Unknown",
  };

  // JSON-LD for individual car
  const jsonLd = {
    "@context": "https://schema.org",
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
    ...(car.location && { address: { addressLocality: car.location } }),
    image: car.image,
  };

  // --- 250k-ready mesh reinforcement ---
  const brand = car.make?.toLowerCase();
  const model = car.model?.toLowerCase();
  const city = car.location?.toLowerCase();
  const fuel = car.fuel?.toLowerCase();
  const transmission = car.transmission?.toLowerCase();
  function priceToBudget(price: number) {
    if (price < 500000) return "under-5-lakh";
    if (price < 1000000) return "under-10-lakh";
    if (price < 1500000) return "under-15-lakh";
    return "above-15-lakh";
  }
  const budget = priceToBudget(car.price);

  // O(1) mesh queries
  const [
    { data: brandCount },
    { data: brandModelCount },
    { data: brandModelCityCount },
    { data: cityCount }
  ] = await Promise.all([
    supabase
      .from("seo_brand_counts")
      .select("listing_count")
      .eq("brand", brand)
      .single(),
    supabase
      .from("seo_brand_model_counts")
      .select("listing_count")
      .eq("brand", brand)
      .eq("model", model)
      .single(),
    supabase
      .from("seo_brand_model_city_counts")
      .select("listing_count")
      .eq("brand", brand)
      .eq("model", model)
      .eq("city", city)
      .single(),
    supabase
      .from("seo_city_counts")
      .select("listing_count")
      .eq("city", city)
      .single(),
  ]);

  function capitalize(str: string) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }
  function formatBudgetLabel(budget: string) {
    if (budget.startsWith("under-")) {
      return `Under ₹${budget.replace("under-", "").replace("-lakh", " Lakh")}`;
    }
    if (budget.startsWith("above-")) {
      return `Above ₹${budget.replace("above-", "").replace("-lakh", " Lakh")}`;
    }
    return budget;
  }

  // --- Render ---
  let meshLinks = [];
  const brandListingCount = Number(brandCount?.listing_count ?? 0);
  const brandModelListingCount = Number(brandModelCount?.listing_count ?? 0);
  const brandModelCityListingCount = Number(brandModelCityCount?.listing_count ?? 0);
  const cityListingCount = Number(cityCount?.listing_count ?? 0);

  if (brandListingCount >= 3) {
    meshLinks.push({
      href: `/cars/${brand}`,
      label: `More ${capitalize(brand)} Cars`,
    });
  }
  if (brandModelListingCount >= 3) {
    meshLinks.push({
      href: `/cars/${brand}/${model}`,
      label: `${capitalize(brand)} ${capitalize(model)} Cars`,
    });
  }
  if (brandModelCityListingCount >= 3) {
    meshLinks.push({
      href: `/cars/${brand}/${model}/city/${city}`,
      label: `${capitalize(brand)} ${capitalize(model)} in ${capitalize(city)}`,
    });
  }
  if (cityListingCount >= 3) {
    meshLinks.push({
      href: `/cars/city/${city}`,
      label: `More Cars in ${capitalize(city)}`,
    });
  }
  if (fuel) {
    meshLinks.push({
      href: `/cars/${fuel}`,
      label: `Browse ${capitalize(fuel)} Cars`,
    });
  }
  meshLinks.push({
    href: `/cars/budget/${budget}`,
    label: `Cars ${formatBudgetLabel(budget)}`,
  });
  // Cap at 10 links
  meshLinks = meshLinks.slice(0, 10);

  // --- Hybrid Similar Cars Engine ---
  const lower = car.price * 0.8;
  const upper = car.price * 1.2;
  const [
    { data: tier1 },
    { data: tier2 },
    { data: tier3 },
  ] = await Promise.all([
    supabase
      .from("cars")
      .select("id, name, price, brand, model, location, car_images(image_url)")
      .eq("status", "active")
      .eq("brand", brand)
      .eq("model", model)
      .neq("id", car.id)
      .limit(6),
    supabase
      .from("cars")
      .select("id, name, price, brand, model, location, car_images(image_url)")
      .eq("status", "active")
      .eq("location", city)
      .gte("price", lower)
      .lte("price", upper)
      .neq("id", car.id)
      .limit(8),
    supabase
      .from("cars")
      .select("id, name, price, brand, model, location, car_images(image_url)")
      .eq("status", "active")
      .eq("brand", brand)
      .neq("model", model)
      .neq("id", car.id)
      .limit(8),
  ]);

  // Deduplicate and enforce max 12, tier order
  const seen = new Set<string>();
  const similar: any[] = [];
  function pushUnique(list?: any[]) {
    list?.forEach((item) => {
      if (!seen.has(item.id) && similar.length < 12) {
        seen.add(item.id);
        similar.push(item);
      }
    });
  }
  pushUnique(tier1?.slice(0, 4));
  pushUnique(tier2?.slice(0, 4));
  pushUnique(tier3?.slice(0, 4));

  // --- Render ---
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-4">{car.title}</h1>
        <img src={car.image} alt={car.title} className="w-full max-w-md mb-6" />
        <div className="grid grid-cols-2 gap-4">
          <div><strong>Brand:</strong> {car.make}</div>
          <div><strong>Model:</strong> {car.model}</div>
          <div><strong>Year:</strong> {car.year}</div>
          <div><strong>Fuel:</strong> {car.fuel}</div>
          <div><strong>Transmission:</strong> {car.transmission}</div>
          <div><strong>Location:</strong> {car.location}</div>
          <div><strong>Price:</strong> ₹{car.price.toLocaleString()}</div>
        </div>

        {/* Mesh reinforcement links */}
        {meshLinks.length > 0 && (
          <div className="mt-10 border-t pt-8">
            <h2 className="text-xl font-semibold mb-4">Explore More</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {meshLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-blue-600 hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Similar Cars Engine */}
        {similar.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mt-12 mb-6">
              Similar Cars You May Like
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {similar.map((sim) => (
                <CarCard
                  key={sim.id}
                  id={sim.id}
                  image={sim.car_images?.[0]?.image_url ?? "/logo.png"}
                  title={sim.name}
                  year={sim.year}
                  price={typeof sim.price === 'number' ? sim.price.toLocaleString() : sim.price}
                  location={sim.location}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
