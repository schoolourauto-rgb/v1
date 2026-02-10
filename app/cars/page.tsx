import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


export default async function CarsPage({ searchParams }: PageProps<"/cars">) {
  const resolvedSearchParams = await searchParams;
  const page = Math.max(0, Number(resolvedSearchParams?.page ?? 0));
  const limit = 12
  const from = page * limit
  const to = from + limit - 1

  const supabase = createClient();
  const { data, count, error } = await supabase
    .from("listings")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Listings fetch error:", error);
  }

  const listings = data ?? [];
  const total = count ?? 0;

  const canPrev = page > 0;
  const canNext = total > 0 && (page + 1) * limit < total;

  function getPageHref(newPage: number) {
    const params = new URLSearchParams();
    if (newPage > 0) params.set("page", String(newPage));
    return `/cars?${params.toString()}`;
  }

  return (
    <main className="flex-1">
      <Section>
        <Container>
          <h1 className="text-3xl font-bold">Available Cars</h1>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.isArray(listings) && listings.length > 0 ? (
              listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  title={listing.title || `${listing.brand ?? ""} ${listing.model ?? ""} ${listing.year ?? ""}`}
                  price={listing.price ? `₹${Number(listing.price).toLocaleString()}` : "-"}
                  mileage={listing.mileage ? `${Number(listing.mileage).toLocaleString()} km` : "-"}
                  imageUrl={listing.image_url || "/car.jpg"}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">No cars available.</div>
            )}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <a
              href={getPageHref(page - 1)}
              aria-disabled={!canPrev}
              tabIndex={!canPrev ? -1 : 0}
              className={`px-4 py-2 rounded border bg-background text-foreground transition-colors ${!canPrev ? "opacity-50 pointer-events-none" : "hover:bg-muted"}`}
            >
              Previous
            </a>
            <a
              href={getPageHref(page + 1)}
              aria-disabled={!canNext}
              tabIndex={!canNext ? -1 : 0}
              className={`px-4 py-2 rounded border bg-background text-foreground transition-colors ${!canNext ? "opacity-50 pointer-events-none" : "hover:bg-muted"}`}
            >
              Next
            </a>
          </div>
        </Container>
      </Section>
    </main>
  );
}
