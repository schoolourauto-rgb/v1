
import { createClient } from "@/lib/supabase/server";
import { Car } from "@/types/car";
import CarCard from "@/components/marketplace/CarCard";
import Link from "next/link";
import { parseFilters } from "@/lib/seo/parseFilters";
import { buildMetadata } from "@/lib/seo/metadataBuilder";
import { buildJsonLd } from "@/lib/seo/jsonLdBuilder";
import { normalizeFilters } from "@/lib/seo/normalizeFilters";
import { evaluateCluster, getClusterType, getStrongestParentPath, getCanonicalPath } from "@/lib/seo/canonicalEngine";
import { redirect } from "next/navigation";

export const revalidate = 60;
export const runtime = "edge";

import { type Metadata, type ResolvingMetadata } from 'next';

export default async function CarsPage({ params, searchParams }: {
  params: { filters?: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const rawFilters = params.filters ?? [];
  const parsedFilters = parseFilters(rawFilters);
  const normalizedSegments = normalizeFilters(parsedFilters);
  if (JSON.stringify(rawFilters) !== JSON.stringify(normalizedSegments)) {
    redirect(`/cars/${normalizedSegments.join("/")}`);
  }

  const supabase = createClient();
  let query = supabase
    .from("cars")
    .select(`
      id,
      name,
      brand,
      model,
      year,
      price,
      fuel_type,
      transmission,
      location,
      car_images(image_url)
    `, { count: "exact" })
    .eq("status", "active");

  if (parsedFilters.brand) query = query.ilike("brand", parsedFilters.brand);
  if (parsedFilters.model) query = query.ilike("model", parsedFilters.model);
  if (parsedFilters.city) query = query.ilike("location", parsedFilters.city);
  if (parsedFilters.maxPrice) query = query.lte("price", parsedFilters.maxPrice);
  if (parsedFilters.fuel) query = query.ilike("fuel_type", parsedFilters.fuel);
  if (parsedFilters.transmission) query = query.ilike("transmission", parsedFilters.transmission);
  if (parsedFilters.year) query = query.eq("year", parsedFilters.year);

  const { data, count } = await query.order("created_at", { ascending: false });


  // Cluster evaluation for canonical, index, sitemap, etc.
  const filterDepth = Object.values(parsedFilters).filter(Boolean).length;
  const clusterType = getClusterType(parsedFilters);
  const currentPath = `/cars/${rawFilters.join("/")}`;
  const strongestParentPath = getStrongestParentPath(parsedFilters);
  const canonicalData = evaluateCluster({
    inventory: count ?? 0,
    depth: filterDepth,
    clusterType,
    strongestParentPath,
    currentPath,
  });

  const listings: Car[] =
    (data || []).map((row: any) => ({
      id: row.id,
      title: row.name,
      make: row.brand,
      model: row.model,
      year: row.year,
      fuel: row.fuel_type,
      price: row.price,
      image: row.car_images?.[0]?.image_url ?? "/logo.png",
      location: row.location ?? "Unknown",
      transmission: row.transmission,
    }));

  const jsonLd = buildJsonLd(listings, parsedFilters);

  // Brand mesh: only show if brand is present and no model/city/budget/fuel/transmission filter is active
  const showBrandMesh =
    !!parsedFilters.brand &&
    !parsedFilters.model &&
    !parsedFilters.city &&
    !parsedFilters.maxPrice &&
    !parsedFilters.fuel &&
    !parsedFilters.transmission;

  let brandCities: { city: string; listing_count: number }[] = [], brandModels: { model: string; listing_count: number }[] = [], budgets: { budget: string; listing_count: number }[] = [], fuels: { fuel: string; listing_count: number }[] = [];
  if (showBrandMesh && parsedFilters.brand) {
    const [brandCitiesRes, brandModelsRes, budgetsRes, fuelsRes] = await Promise.all([
      supabase
        .from("seo_brand_city_counts")
        .select("city, listing_count")
        .eq("brand", parsedFilters.brand)
        .order("listing_count", { ascending: false })
        .limit(8),
      supabase
        .from("seo_brand_model_counts")
        .select("model, listing_count")
        .eq("brand", parsedFilters.brand)
        .order("listing_count", { ascending: false })
        .limit(8),
      supabase
        .from("seo_budget_counts")
        .select("budget, listing_count")
        .order("listing_count", { ascending: false })
        .limit(6),
      supabase
        .from("seo_fuel_counts")
        .select("fuel, listing_count")
        .order("listing_count", { ascending: false })
        .limit(4),
    ]);
    brandCities = (brandCitiesRes.data as { city: string; listing_count: number }[] ?? []).filter((c) => c.listing_count >= 3);
    brandModels = (brandModelsRes.data as { model: string; listing_count: number }[] ?? []).filter((m) => m.listing_count >= 3);
    budgets = (budgetsRes.data as { budget: string; listing_count: number }[] ?? []).filter((b) => b.listing_count >= 3);
    fuels = (fuelsRes.data as { fuel: string; listing_count: number }[] ?? []).filter((f) => f.listing_count >= 3);
  }

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function formatBudget(budget: string) {
    if (budget.startsWith("under-")) {
      return `Under ₹${budget.replace("under-", "").replace("-lakh", " Lakh")}`;
    }
    if (budget.startsWith("above-")) {
      return `Above ₹${budget.replace("above-", "").replace("-lakh", " Lakh")}`;
    }
    return budget;
  }

  // City mesh: only show if city is present and no brand/model filter is active
  const showCityMesh =
    !!parsedFilters.city &&
    !parsedFilters.brand &&
    !parsedFilters.model &&
    !parsedFilters.maxPrice &&
    !parsedFilters.fuel &&
    !parsedFilters.transmission;

  let cityBrands: { brand: string; listing_count: number }[] = [], cityBudgets: { budget: string; listing_count: number }[] = [], cityFuels: { fuel: string; listing_count: number }[] = [], cityTransmissions: { transmission: string; listing_count: number }[] = [];
  if (showCityMesh && parsedFilters.city) {
    const [cityBrandsRes, cityBudgetsRes, cityFuelsRes, cityTransRes] = await Promise.all([
      supabase
        .from("seo_city_brand_counts")
        .select("brand, listing_count")
        .eq("city", parsedFilters.city)
        .order("listing_count", { ascending: false })
        .limit(8),
      supabase
        .from("seo_budget_counts")
        .select("budget, listing_count")
        .order("listing_count", { ascending: false })
        .limit(6),
      supabase
        .from("seo_fuel_counts")
        .select("fuel, listing_count")
        .order("listing_count", { ascending: false })
        .limit(4),
      supabase
        .from("seo_transmission_counts")
        .select("transmission, listing_count")
        .order("listing_count", { ascending: false })
        .limit(3),
    ]);
    cityBrands = (cityBrandsRes.data as { brand: string; listing_count: number }[] ?? []).filter((b) => b.listing_count >= 3);
    cityBudgets = (cityBudgetsRes.data as { budget: string; listing_count: number }[] ?? []).filter((b) => b.listing_count >= 3);
    cityFuels = (cityFuelsRes.data as { fuel: string; listing_count: number }[] ?? []).filter((f) => f.listing_count >= 3);
    cityTransmissions = (cityTransRes.data as { transmission: string; listing_count: number }[] ?? []).filter((t) => t.listing_count >= 3);
  }

  return (
    <>
      {/* Canonical link and robots meta handled by generateMetadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8">
        {listings.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">No cars found for these filters.</div>
        ) : (
          listings.map((car) => (
            <CarCard
              key={car.id}
              id={car.id}
              image={car.image}
              title={car.title}
              year={car.year}
              price={typeof car.price === 'number' ? `₹${car.price.toLocaleString('en-IN')}` : car.price}
              location={car.location}
            />
          ))
        )}
      </div>

      {showBrandMesh && (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
          {/* ...existing brand mesh code... */}
        </div>
      )}

      {showCityMesh && (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
          {/* Section A: Top Brands in City */}
          {cityBrands.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3">Top Brands in {capitalize(parsedFilters.city!)}</h2>
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {cityBrands.map((b) => (
                  <li key={b.brand}>
                    <Link href={`/cars/${b.brand}/city/${parsedFilters.city}`}>
                      {capitalize(b.brand)} Cars in {capitalize(parsedFilters.city!)} ({b.listing_count})
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Section B: Budget in City */}
          {cityBudgets.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3">Cars by Budget in {capitalize(parsedFilters.city!)}</h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {cityBudgets.map((b) => (
                  <li key={b.budget}>
                    <Link href={`/cars/city/${parsedFilters.city}/budget/${b.budget}`}>
                      Cars {formatBudget(b.budget)} in {capitalize(parsedFilters.city!)} ({b.listing_count})
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Section C: Fuel in City */}
          {cityFuels.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3">Cars by Fuel in {capitalize(parsedFilters.city!)}</h2>
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {cityFuels.map((f) => (
                  <li key={f.fuel}>
                    <Link href={`/cars/city/${parsedFilters.city}/${f.fuel}`}>
                      {capitalize(f.fuel)} Cars in {capitalize(parsedFilters.city!)} ({f.listing_count})
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Section D: Transmission in City */}
          {cityTransmissions.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3">Cars by Transmission in {capitalize(parsedFilters.city!)}</h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {cityTransmissions.map((t) => (
                  <li key={t.transmission}>
                    <Link href={`/cars/city/${parsedFilters.city}/${t.transmission}`}>
                      {capitalize(t.transmission)} Cars in {capitalize(parsedFilters.city!)} ({t.listing_count})
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </>
  );
}

