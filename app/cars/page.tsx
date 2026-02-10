import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import CarCard from "@/components/marketplace/CarCard";
import { createClient } from "@/lib/supabase/server";


export default async function CarsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const supabase = createClient();
  const params = await searchParams;
  const brand = params?.brand || "";
  const min = params?.min || "";
  const max = params?.max || "";
  const page = Number(params?.page || 1);
  const pageSize = 9;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("cars").select("*", { count: "exact" });
  if (brand) {
    query = query.eq("brand", brand);
  }
  if (min) {
    query = query.gte("price", Number(min));
  }
  if (max) {
    query = query.lte("price", Number(max));
  }
  const { data: cars, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) {
    console.error(error);
  }
  const totalPages = Math.ceil((count || 0) / pageSize);
  if (!cars || cars.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">No cars found.</div>
      </main>
    );
  }
  // Build query string for pagination links
  const buildQuery = (params: Record<string, string | string[] | undefined>) => {
    const filtered: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === "string" && value !== undefined) {
        filtered[key] = value;
      } else if (Array.isArray(value)) {
        filtered[key] = value.join(",");
      }
    });
    const search = new URLSearchParams(filtered);
    return search.toString();
  };
  return (
    <main className="flex-1">
      <Container>
        <Section title="Marketplace">
          <form action="/cars" method="GET" className="flex gap-4 mb-6">
            <select name="brand" defaultValue={brand} className="border rounded-lg px-3 py-2">
              <option value="">All Brands</option>
              <option value="BMW">BMW</option>
              <option value="Audi">Audi</option>
              <option value="Toyota">Toyota</option>
            </select>
            <input
              type="number"
              name="min"
              placeholder="Min Price"
              className="border rounded-lg px-3 py-2"
              defaultValue={min}
            />
            <input
              type="number"
              name="max"
              placeholder="Max Price"
              className="border rounded-lg px-3 py-2"
              defaultValue={max}
            />
            <button className="bg-yellow-500 px-4 py-2 rounded-lg" type="submit">
              Apply
            </button>
            {(brand || min || max) && (
              <a href="/cars" className="px-3 py-2 rounded-lg border bg-neutral-100 text-neutral-800">Clear Filters</a>
            )}
          </form>
          <div className="mb-4 text-sm text-muted-foreground">{cars.length} cars found</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cars.map(car => (
              <CarCard
                key={car.id}
                id={car.id}
                image={car.image_url}
                title={car.brand + " " + car.model}
                year={car.year}
                price={car.price}
                location={car.location || "Unknown"}
              />
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            {brand && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Brand: {brand}</span>}
            {min && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Min: ₹{min}</span>}
            {max && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Max: ₹{max}</span>}
          </div>
          {/* Pagination UI */}
          <div className="flex gap-2 justify-center mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <a
                key={i}
                href={`/cars?${buildQuery({
                  brand,
                  min,
                  max,
                  page: String(i + 1),
                })}`}
                className={`px-3 py-1 border rounded-lg ${page === i + 1 ? 'bg-yellow-500 text-black' : 'bg-neutral-100 text-neutral-800'}`}
              >
                {i + 1}
              </a>
            ))}
          </div>
        </Section>
      </Container>
    </main>
  );
}

