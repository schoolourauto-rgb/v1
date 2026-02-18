import { createClient } from "@/lib/supabase/server";
import CarCard from "@/components/marketplace/CarCard";
import EmptyState from "@/components/marketplace/EmptyState";
import Link from "next/link";
import { parseFilters } from "@/lib/seo/parseFilters";
import { buildMetadata } from "@/lib/seo/metadataBuilder";
import { buildJsonLd } from "@/lib/seo/jsonLdBuilder";
import { normalizeFilters } from "@/lib/seo/normalizeFilters";
import { evaluateCluster, getClusterType, getStrongestParentPath, getCanonicalPath } from "@/lib/seo/canonicalEngine";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getListings, MarketplaceListing } from "@/lib/marketplace/getListings";
dayjs.extend(relativeTime);

// --- PREMIUM HOMEPAGE ELEVATION ---
// (ThemeProviderClient only in layout.tsx)

export const revalidate = 60;

import { type Metadata } from 'next';
import Head from "next/head";

interface CarsPageProps {
  params: { filters?: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
}


export async function generateMetadata({ params }: CarsPageProps): Promise<Metadata> {
  const rawFilters = params.filters ?? [];
  const parsedFilters = parseFilters(rawFilters);
  const normalizedSegments = normalizeFilters(parsedFilters);
  const { title, description } = buildMetadata(parsedFilters);
  const city = parsedFilters.city || "";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://ourauto.in/cars/${normalizedSegments.join("/")}`,
      siteName: "OurAuto",
      type: "website",
      images: [
        `https://ourauto.in/api/share-image/city/${city}`
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `https://ourauto.in/api/share-image/city/${city}`
      ],
    },
    alternates: {
      canonical: `https://ourauto.in/cars/${normalizedSegments.join("/")}`,
    },
  };
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

  // --- TRUST LAYER: STATS STRIP ---
  const supabase = await createClient();
  const [{ count: dealersCount }, { count: listingsCount }, latestListing] = await Promise.all([
    supabase.from("dealers").select("id", { count: "exact", head: true }).limit(1),
    supabase.from("cars").select("id", { count: "exact", head: true }).eq("status", "active").limit(1),
    supabase.from("cars").select("updated_at").eq("status", "active").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  // --- INVENTORY QUERY (via priority system) ---
  const { listings, count, error } = await getListings({
    filters: parsedFilters,
    from,
    to,
  });

  // Total pages calculation (server-side)
  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;

  const jsonLd = buildJsonLd(listings, parsedFilters);

  // --- HOMEPAGE ELEVATION ---
  // (No search logic, just UI)
  if (!listings || listings.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white flex flex-col min-h-screen">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      {/* Canonical link and robots meta handled by generateMetadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* HEADER: SAFE, PREMIUM */}
      <header className="w-full border-b border-neutral-200 dark:border-neutral-800 backdrop-blur-sm bg-white/80 dark:bg-black/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-3 sm:py-4 px-4 sm:px-6">
          <span className="font-semibold tracking-tight text-lg md:text-xl select-none">FREE MARKETPLACE</span>
          <div className="flex items-center gap-4">
            {/* Theme Toggle (do not remove) */}
            {/* ThemeProviderClient handled globally in layout.tsx */}
            {/* Dealer Login (do not remove) */}
            <Link href="/auth/login" className="text-sm font-medium hover:underline">Dealer Login</Link>
          </div>
        </div>
      </header>

      {/* SEARCH: PREMIUM */}
      <section className="flex justify-center py-16 sm:py-20 px-4 sm:px-6">
        <form className="w-full">
          <input
            type="text"
            placeholder="Search by Brand, Model or City"
            className="w-full rounded-full px-4 sm:px-6 py-4 bg-white dark:bg-neutral-900 text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 border border-yellow-500/40 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 shadow-sm"
            disabled
            style={{ boxShadow: '0 2px 16px 0 rgba(255, 221, 51, 0.08)' }}
          />
        </form>
      </section>

      {/* TRUST STRIP: PREMIUM */}
      <section className="w-full py-16 sm:py-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-8 text-base md:text-lg font-semibold tracking-tight text-black dark:text-white text-center pb-3">
          <span className="flex items-center gap-2"><svg width="18" height="18" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#FACC15"/><path d="M6.5 10.5l2 2 5-5" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Verified Dealers</span>
          <span className="flex items-center gap-2"><svg width="18" height="18" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#FACC15"/><path d="M6.5 10.5l2 2 5-5" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Direct Contact</span>
          <span className="flex items-center gap-2"><svg width="18" height="18" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#FACC15"/><path d="M6.5 10.5l2 2 5-5" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Updated Daily</span>
        </div>
        <div className="border-b border-yellow-500 w-full" />
      </section>

      {/* INVENTORY SECTION: STRUCTURED */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 flex-1 w-full">
        {/* Listing grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((car: MarketplaceListing) => (
            <CarCard
              key={car.id}
              id={car.id}
              image={car.image || "/logo.png"}
              title={car.title}
              year={car.year}
              price={car.price != null ? car.price.toLocaleString() : ""}
              location={car.city || ""}
              dealer={car.dealer_id ? { id: car.dealer_id, name: car.dealer_name || 'Dealer', activeDealer: car.activeDealer } : undefined}
              listingTier={car.listingTier}
            />
          ))}
        </div>
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <Link
                key={i + 1}
                href={
                  i === 0
                    ? `/cars/${normalizedSegments.join("/")}`
                    : `/cars/${normalizedSegments.join("/")}?page=${i + 1}`
                }
                className={`px-4 py-2 rounded-lg border border-yellow-500 font-semibold transition-colors duration-150 ${page === i + 1 ? 'bg-yellow-500 text-black' : 'bg-transparent text-yellow-500 hover:bg-yellow-500 hover:text-black'}`}
                aria-current={page === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER placeholder (if needed, can be replaced with actual Footer component) */}
      {/* <footer className="w-full py-8 text-center text-xs text-black dark:text-white opacity-60">&copy; {new Date().getFullYear()} India's Verified Car Marketplace</footer> */}
    </div>
  );
}

