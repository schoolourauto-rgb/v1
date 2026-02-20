
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { parseFilters } from "@/lib/seo/parseFilters";
import { normalizeFilters } from "@/lib/seo/normalizeFilters";
import { buildMetadata } from "@/lib/seo/metadataBuilder";
import { buildJsonLd } from "@/lib/seo/jsonLdBuilder";
import { getListings, MarketplaceListing } from "@/lib/marketplace/getListings";
import CarCard from "@/components/marketplace/CarCard";

export const revalidate = 60;

interface CarsPageProps {
  params: { filters?: string[] };
  searchParams?: { page?: string };
}

export async function generateMetadata({ params }: CarsPageProps): Promise<Metadata> {
  const rawFilters = params.filters ?? [];
  const parsed = parseFilters(rawFilters);
  const normalized = normalizeFilters(parsed);
  const { title, description } = buildMetadata(parsed);

  return {
    title,
    description,
    alternates: {
      canonical: `https://ourauto.in/cars/${normalized.join("/")}`,
    },
  };
}

export default async function CarsPage({ params, searchParams }: CarsPageProps) {
  const rawFilters = params.filters ?? [];
  const parsed = parseFilters(rawFilters);
  const normalized = normalizeFilters(parsed);

  if (JSON.stringify(rawFilters) !== JSON.stringify(normalized)) {
    redirect(`/cars/${normalized.join("/")}`);
  }

  const page = Number(searchParams?.page ?? 1);
  const PAGE_SIZE = 12;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { listings, count } = await getListings({
    filters: parsed as Record<string, unknown>,
    from,
    to,
  });

  if (!listings?.length) {
    return (
      <div className="py-24 text-center text-[var(--text-muted)]">
        No cars found.
      </div>
    );
  }

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((car: MarketplaceListing) => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <Link
                key={i}
                href={
                  i === 0
                    ? `/cars/${normalized.join("/")}`
                    : `/cars/${normalized.join("/")}?page=${i + 1}`
                }
                className="px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--accent)]/20 transition"
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

