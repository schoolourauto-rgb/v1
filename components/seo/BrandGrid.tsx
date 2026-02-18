import Link from "next/link";

interface BrandGridProps {
  brands: string[];
}

export default function BrandGrid({ brands }: BrandGridProps) {
  return (
    <section className="my-8">
      <h2 className="text-xl font-bold mb-4">Browse by Brand</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <Link
            key={brand}
            href={`/cars/${encodeURIComponent(brand.toLowerCase())}`}
            className="block p-3 bg-white rounded shadow hover:bg-yellow-50 text-center"
          >
            Used {capitalize(brand)} Cars
          </Link>
        ))}
      </div>
    </section>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
