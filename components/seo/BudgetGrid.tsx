import Link from "next/link";

const BUDGETS = [
  { label: "Under ₹5 Lakh", value: 500000 },
  { label: "Under ₹10 Lakh", value: 1000000 },
  { label: "Under ₹20 Lakh", value: 2000000 },
  { label: "Under ₹50 Lakh", value: 5000000 },
];

interface BudgetGridProps {
  brand?: string;
  city?: string;
}

export default function BudgetGrid({ brand, city }: BudgetGridProps) {
  return (
    <section className="my-8">
      <h3 className="text-lg font-semibold mb-2">Browse by Budget</h3>
      <div className="flex flex-wrap gap-2">
        {BUDGETS.map((b) => (
          <Link
            key={b.value}
            href={
              brand
                ? city
                  ? `/cars/${encodeURIComponent(brand.toLowerCase())}/city/${encodeURIComponent(city.toLowerCase())}/budget/under-${b.value / 100000}-lakh`
                  : `/cars/${encodeURIComponent(brand.toLowerCase())}/budget/under-${b.value / 100000}-lakh`
                : city
                ? `/cars/city/${encodeURIComponent(city.toLowerCase())}/budget/under-${b.value / 100000}-lakh`
                : `/cars/budget/under-${b.value / 100000}-lakh`
            }
            className="px-3 py-1 bg-gray-100 rounded hover:bg-yellow-100"
          >
            {b.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
