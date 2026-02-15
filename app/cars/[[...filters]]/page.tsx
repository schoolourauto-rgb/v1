
import { createServerClientTyped } from "@/lib/supabase/server";
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

interface CarsPageProps {
  params: { filters?: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function CarsPage({ params, searchParams }: CarsPageProps) {
  // Filter normalization
  const rawFilters = params.filters ?? [];
  const parsedFilters = parseFilters(rawFilters);
  const normalizedSegments = normalizeFilters(parsedFilters);
  if (JSON.stringify(rawFilters) !== JSON.stringify(normalizedSegments)) {
    redirect(`/cars/${normalizedSegments.join("/")}`);
  }

  // Pagination setup
  const page = Number(searchParams?.page ?? 1);
  const PAGE_SIZE = 12;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // Canonical redirect for ?page=1
  if (page === 1 && searchParams?.page) {
    redirect(`/cars/${normalizedSegments.join("/")}`);
  }


  const supabase = await createServerClientTyped();
  let query = supabase
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
    `, { count: "exact" })
    .eq("status", "active")
    .range(from, to);

  if (parsedFilters.brand) query = query.ilike("brand", parsedFilters.brand);
  if (parsedFilters.model) query = query.ilike("model", parsedFilters.model);
  if (parsedFilters.city) query = query.ilike("city", parsedFilters.city);
  if (parsedFilters.maxPrice) query = query.lte("price", parsedFilters.maxPrice);
  if (parsedFilters.fuel) query = query.ilike("fuel_type", parsedFilters.fuel);
  if (parsedFilters.transmission) query = query.ilike("transmission", parsedFilters.transmission);
  if (parsedFilters.year) query = query.eq("year", parsedFilters.year);
  const { data, count, error } = await query;
  if (error) {
    console.error(error);
    return <div className="p-8 text-center text-red-500">Error loading cars.</div>;
  }

  // Total pages calculation (server-side)
  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;

  const listings: (Car & { image: string; location: string })[] =
    (data ?? []).map((row: any) => ({
      id: row.id,
      title: row.title,
      brand: row.brand,
      dealer_id: row.dealer_id ?? '',
      model: row.model,
      year: row.year,
      fuel: row.fuel_type,
      price: row.price,
      transmission: row.transmission,
      city: row.city ?? '',
      image: (row.car_images as { image_url: string }[] | undefined)?.[0]?.image_url ?? "/logo.png",
      location: row.city ?? "Unknown",
    }));

  const jsonLd = buildJsonLd(listings, parsedFilters);

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

  // No city mesh: all city mesh views do not exist in types

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

      {/* Pagination controls */}
      <div className="flex justify-center gap-4 mt-10">
        {page > 1 && (
          <Link href={`/cars/${normalizedSegments.join("/")}${page - 1 === 1 ? "" : `?page=${page - 1}`}`}>Previous</Link>
        )}
        <span className="px-4">Page {page} of {totalPages}</span>
        {page < totalPages && (
          <Link href={`/cars/${normalizedSegments.join("/")}?page=${page + 1}`}>Next</Link>
        )}
      </div>

      {/* showCityMesh removed: all city mesh views do not exist */}
    </>
  );
}

