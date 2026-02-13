import Link from "next/link";

interface CityGridProps {
  brand?: string;
  cities: string[];
}

export default function CityGrid({ brand, cities }: CityGridProps) {
  return (
    <section className="my-8">
      <h3 className="text-lg font-semibold mb-2">
        {brand ? `Used ${capitalize(brand)} Cars in:` : "Browse by City"}
      </h3>
      <div className="flex flex-wrap gap-2">
        {cities.map((city) => (
          <Link
            key={city}
            href={brand ? `/cars/${encodeURIComponent(brand.toLowerCase())}/city/${encodeURIComponent(city.toLowerCase())}` : `/cars/city/${encodeURIComponent(city.toLowerCase())}`}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-yellow-100"
          >
            {capitalize(city)}
          </Link>
        ))}
      </div>
    </section>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
