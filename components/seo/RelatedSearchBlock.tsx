import Link from "next/link";

interface RelatedSearchBlockProps {
  brand?: string;
  city?: string;
  fuel?: string;
  transmission?: string;
  price?: number;
}


export default function RelatedSearchBlock({ brand, city, fuel, transmission, price }: RelatedSearchBlockProps) {
  const links: { label: string; href: string }[] = [
    brand ? { label: `More ${capitalize(brand)} Cars`, href: `/cars/${encodeURIComponent(brand.toLowerCase())}` } : undefined,
    city ? { label: `More Cars in ${capitalize(city)}`, href: `/cars/city/${encodeURIComponent(city.toLowerCase())}` } : undefined,
    fuel ? { label: `More ${capitalize(fuel)} Cars`, href: `/cars/${fuel.toLowerCase()}` } : undefined,
    transmission ? { label: `More ${capitalize(transmission)} Cars`, href: `/cars/${transmission.toLowerCase()}` } : undefined,
    price ? { label: `Cars Under ₹${price.toLocaleString()}`, href: `/cars/budget/under-${price / 100000}-lakh` } : undefined,
  ].filter((l): l is { label: string; href: string } => !!l);

  return (
    <section className="my-8">
      <h3 className="text-lg font-semibold mb-2">Related Searches</h3>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link key={link!.href} href={link!.href} className="px-3 py-1 bg-yellow-100 rounded hover:bg-yellow-500 text-black transition">
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
