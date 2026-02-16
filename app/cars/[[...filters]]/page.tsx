

import { createClient } from "@/lib/supabase/server";
import CarCard from "@/components/marketplace/CarCard";
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

  // --- TRUST LAYER: STATS STRIP ---
  const supabase = await createClient();
  const [{ count: dealersCount }, { count: listingsCount }, latestListing] = await Promise.all([
    supabase.from("dealers").select("*", { count: "exact", head: true }),
    supabase.from("cars").select("*", { count: "exact", head: true }).eq("status", "active"),
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
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white flex flex-col min-h-screen">
      {/* Canonical link and robots meta handled by generateMetadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* HEADER: SAFE, PREMIUM */}
      <header className="w-full border-b border-neutral-200 dark:border-neutral-800 backdrop-blur-sm bg-white/80 dark:bg-black/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
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
      <section className="flex justify-center py-20 px-4">
        <form className="w-full max-w-[600px] mx-auto">
          <input
            type="text"
            placeholder="Search by Brand, Model or City"
            className="w-full h-14 sm:h-[56px] rounded-full bg-white dark:bg-black border border-yellow-500 px-8 text-lg sm:text-xl text-black dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 placeholder:text-black dark:placeholder:text-white outline-none font-semibold shadow-md"
            disabled
            style={{ boxShadow: '0 2px 16px 0 rgba(255, 221, 51, 0.08)' }}
          />
        </form>
      </section>

      {/* TRUST STRIP: PREMIUM */}
      <section className="w-full py-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-8 text-base md:text-lg font-semibold tracking-tight text-black dark:text-white text-center pb-3">
          <span className="flex items-center gap-2"><svg width="18" height="18" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#FACC15"/><path d="M6.5 10.5l2 2 5-5" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Verified Dealers</span>
          <span className="flex items-center gap-2"><svg width="18" height="18" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#FACC15"/><path d="M6.5 10.5l2 2 5-5" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Direct Contact</span>
          <span className="flex items-center gap-2"><svg width="18" height="18" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#FACC15"/><path d="M6.5 10.5l2 2 5-5" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Updated Daily</span>
        </div>
        <div className="border-b border-yellow-500 w-full" />
      </section>

      {/* INVENTORY SECTION: STRUCTURED */}
      <section className="max-w-6xl mx-auto px-4 py-20 flex-1 w-full">
        {(error || listings.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black dark:text-white mb-4">No Listings Yet</h2>
            <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 mb-10 font-medium">Inventory will appear here once dealers publish vehicles.</p>
            <Link href="/cars" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full px-5 py-2.5 text-lg shadow-lg transition-all duration-200 hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2">Browse All Vehicles</Link>
          </div>
        ) : (
          // PREMIUM LISTING GRID: Hot Deals, Featured, Latest Listings
          <div className="opacity-0 animate-fadeIn">
            {/* Hot Deals Section */}
            <div className="mb-12">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 flex items-center gap-2"><span role="img" aria-label="Hot">🔥</span>Hot Deals</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {listings.filter(car => car.listingTier === 'hot').map(car => (
                  <div key={car.id} className="relative">
                    <CarCard
                      id={car.id}
                      image={car.image}
                      title={car.title}
                      year={car.year}
                      price={typeof car.price === 'number' ? `₹${car.price.toLocaleString('en-IN')}` : String(car.price)}
                      location={car.location}
                      dealer={car.dealer_id ? { id: car.dealer_id, name: car.dealer_name || 'Dealer', activeDealer: car.activeDealer } : undefined}
                      listingTier={car.listingTier}
                    />
                    <span className="absolute top-2 right-2 px-2 py-[2px] rounded-full text-[11px] font-bold select-none bg-yellow-500 text-black shadow-md border border-yellow-600" style={{letterSpacing: 0.2}}>🔥 Hot Deal</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Featured Section */}
            <div className="mb-12">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 flex items-center gap-2"><span role="img" aria-label="Featured">⭐</span>Featured</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {listings.filter(car => car.listingTier === 'featured').map(car => (
                  <div key={car.id} className="relative">
                    <CarCard
                      id={car.id}
                      image={car.image}
                      title={car.title}
                      year={car.year}
                      price={typeof car.price === 'number' ? `₹${car.price.toLocaleString('en-IN')}` : String(car.price)}
                      location={car.location}
                      dealer={car.dealer_id ? { id: car.dealer_id, name: car.dealer_name || 'Dealer', activeDealer: car.activeDealer } : undefined}
                      listingTier={car.listingTier}
                    />
                    <span className="absolute top-2 right-2 px-2 py-[2px] rounded-full text-[11px] font-bold select-none bg-yellow-200 text-yellow-900 shadow border border-yellow-400" style={{letterSpacing: 0.2}}>⭐ Featured</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Latest Listings Section */}
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 flex items-center gap-2"><span role="img" aria-label="Latest">🟡</span>Latest Listings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {listings.filter(car => car.listingTier !== 'hot' && car.listingTier !== 'featured').map(car => {
                  let showRecentlyAdded = false;
                  if (car.updated_at) {
                    const now = dayjs();
                    const updated = dayjs(car.updated_at);
                    if (now.diff(updated, 'hour') < 48) {
                      showRecentlyAdded = true;
                    }
                  }
                  return (
                    <div key={car.id} className="relative">
                      <CarCard
                        id={car.id}
                        image={car.image}
                        title={car.title}
                        year={car.year}
                        price={typeof car.price === 'number' ? `₹${car.price.toLocaleString('en-IN')}` : String(car.price)}
                        location={car.location}
                        dealer={car.dealer_id ? { id: car.dealer_id, name: car.dealer_name || 'Dealer', activeDealer: car.activeDealer } : undefined}
                        listingTier={car.listingTier}
                      />
                      {showRecentlyAdded && (
                        <span className="absolute top-2 right-2 px-2 py-[2px] rounded-full text-[11px] font-bold select-none bg-yellow-100 text-yellow-900 border border-yellow-400 shadow" style={{letterSpacing: 0.2}}>🟡 Recently Added</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {/* ...existing code for pagination (to be updated in next steps)... */}
      </section>

      {/* FOOTER placeholder (if needed, can be replaced with actual Footer component) */}
      {/* <footer className="w-full py-8 text-center text-xs text-black dark:text-white opacity-60">&copy; {new Date().getFullYear()} India's Verified Car Marketplace</footer> */}
    </div>
  );
}

