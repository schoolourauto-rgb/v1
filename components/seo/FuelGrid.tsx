import Link from "next/link";

const FUELS = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "LPG"];

interface FuelGridProps {
  brand?: string;
  city?: string;
}

export default function FuelGrid({ brand, city }: FuelGridProps) {
  return (
    <section className="my-8">
      <h3 className="text-lg font-semibold mb-2">Browse by Fuel Type</h3>
      <div className="flex flex-wrap gap-2">
        {FUELS.map((fuel) => (
          <Link
            key={fuel}
            href={
              brand
                ? city
                  ? `/cars/${encodeURIComponent(brand.toLowerCase())}/city/${encodeURIComponent(city.toLowerCase())}/${fuel.toLowerCase()}`
                  : `/cars/${encodeURIComponent(brand.toLowerCase())}/${fuel.toLowerCase()}`
                : city
                ? `/cars/city/${encodeURIComponent(city.toLowerCase())}/${fuel.toLowerCase()}`
                : `/cars/${fuel.toLowerCase()}`
            }
            className="px-3 py-1 bg-gray-100 rounded hover:bg-yellow-100"
          >
            {fuel}
          </Link>
        ))}
      </div>
    </section>
  );
}
