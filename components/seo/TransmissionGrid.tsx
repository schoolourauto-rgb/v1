import Link from "next/link";

const TRANSMISSIONS = ["Manual", "Automatic"];

interface TransmissionGridProps {
  brand?: string;
  city?: string;
}

export default function TransmissionGrid({ brand, city }: TransmissionGridProps) {
  return (
    <section className="my-8">
      <h3 className="text-lg font-semibold mb-2">Browse by Transmission</h3>
      <div className="flex flex-wrap gap-2">
        {TRANSMISSIONS.map((trans) => (
          <Link
            key={trans}
            href={
              brand
                ? city
                  ? `/cars/${encodeURIComponent(brand.toLowerCase())}/city/${encodeURIComponent(city.toLowerCase())}/${trans.toLowerCase()}`
                  : `/cars/${encodeURIComponent(brand.toLowerCase())}/${trans.toLowerCase()}`
                : city
                ? `/cars/city/${encodeURIComponent(city.toLowerCase())}/${trans.toLowerCase()}`
                : `/cars/${trans.toLowerCase()}`
            }
            className="px-3 py-1 bg-gray-100 rounded hover:bg-yellow-100"
          >
            {trans}
          </Link>
        ))}
      </div>
    </section>
  );
}
