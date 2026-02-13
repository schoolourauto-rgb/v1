import Link from "next/link";

interface RelatedSearchBlockProps {
  brand?: string;
  city?: string;
  fuel?: string;
  transmission?: string;
  price?: number;
}

export default function RelatedSearchBlock({ brand, city, fuel, transmission, price }: RelatedSearchBlockProps) {
  const links = [
    brand && { label: `More ${capitalize(brand)} Cars`, href: `/cars/${encodeURIComponent(brand.toLowerCase())}` },
    city && { label: `More Cars in ${capitalize(city)}`, href: `/cars/city/${encodeURIComponent(city.toLowerCase())}` },
    fuel && { label: `More ${capitalize(fuel)} Cars`, href: `/cars/${fuel.toLowerCase()}` },
    transmission && { label: `More ${capitalize(transmission)} Cars`, href: `/cars/${transmission.toLowerCase()}` },
    price && { label: `Cars Under ₹${price.toLocaleString()}`, href: `/cars/budget/under-${price / 100000}-lakh` },
  ].filter(Boolean);

  return (
    <section className="my-8">
      <h3 className="text-lg font-semibold mb-2">Related Searches</h3>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link key={link!.href} href={link!.href} className="px-3 py-1 bg-gray-100 rounded hover:bg-yellow-100">
            {link!.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
