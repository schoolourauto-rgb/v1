import { useState, useMemo, useCallback } from "react";
import { Car } from "@/types/car";
import { Search, Filter } from "lucide-react";
import Image from "next/image";

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "LPG"];
const TRANSMISSIONS = ["Manual", "Automatic"];
const YEARS = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i);
const PRICE_RANGES = [
  { label: "Any", value: "" },
  { label: "< ₹5L", value: "500000" },
  { label: "< ₹10L", value: "1000000" },
  { label: "< ₹20L", value: "2000000" },
  { label: "< ₹50L", value: "5000000" },
  { label: "> ₹50L", value: "5000001" },
];
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price Low → High", value: "price_low" },
  { label: "Price High → Low", value: "price_high" },
];

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

interface Props {
  listings: Car[];
}

export default function HeroSectionClient({ listings }: Props) {
  const [query, setQuery] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("newest");
    const [filtered, setFiltered] = useState<Car[]>(listings); // Keep filtered state based on listings

  // Debounced search
  const handleSearch = useCallback(
    debounce((q: string, f: string, t: string, y: string, p: string, s: string) => {
      let result = listings.filter((car) => {
        const matchesQuery =
          `${car.make} ${car.model} ${car.year} ${car.fuel} ${car.transmission}`
            .toLowerCase()
            .includes(q.toLowerCase());
        const matchesFuel = !f || car.fuel === f;
        const matchesTransmission = !t || car.transmission === t;
        const matchesYear = !y || car.year === Number(y);
        const matchesPrice =
          !p || (p === "5000001" ? car.price > 5000000 : car.price <= Number(p));
        return matchesQuery && matchesFuel && matchesTransmission && matchesYear && matchesPrice;
      });
      if (s === "price_low") result = result.sort((a, b) => a.price - b.price);
      else if (s === "price_high") result = result.sort((a, b) => b.price - a.price);
      else result = result.sort((a, b) => b.year - a.year);
      setFiltered(result);
    }, 300),
    [listings]
  );

  // Update filtered cars on filter change
  useMemo(() => {
    handleSearch(query, fuel, transmission, year, price, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, fuel, transmission, year, price, sort, listings]);

  // Handlers
  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
  const onFuelChange = (e: React.ChangeEvent<HTMLSelectElement>) => setFuel(e.target.value);
  const onTransmissionChange = (e: React.ChangeEvent<HTMLSelectElement>) => setTransmission(e.target.value);
  const onYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => setYear(e.target.value);
  const onPriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => setPrice(e.target.value);
  const onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSort(e.target.value);
  const onClear = () => {
    setQuery("");
    setFuel("");
    setTransmission("");
    setYear("");
    setPrice("");
    setSort("newest");
    setFiltered(listings);
  };

  return (
    <div className="w-full">
      {/* Glassmorphism Search Bar & Filters */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
          <div className="flex items-center flex-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-6 py-5 shadow-2xl transition-all duration-300 focus-within:border-white/30 focus-within:bg-white/10">
            <Search className="text-white/60 mr-4" size={22} aria-label="Search icon" />
            <input
              type="text"
              placeholder="Search make, model, year..."
              className="bg-transparent w-full outline-none text-white placeholder-white/40 text-lg tracking-wide"
              value={query}
              onChange={onQueryChange}
              aria-label="Search cars"
            />
          </div>
          <select
            className="bg-white/10 text-white rounded-xl px-4 py-3 outline-none border border-white/10 focus:border-white/30 transition min-w-[120px]"
            value={price}
            onChange={onPriceChange}
            aria-label="Price Range"
          >
            {PRICE_RANGES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <select
            className="bg-white/10 text-white rounded-xl px-4 py-3 outline-none border border-white/10 focus:border-white/30 transition min-w-[120px]"
            value={fuel}
            onChange={onFuelChange}
            aria-label="Fuel Type"
          >
            <option value="">Fuel</option>
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <select
            className="bg-white/10 text-white rounded-xl px-4 py-3 outline-none border border-white/10 focus:border-white/30 transition min-w-[120px]"
            value={year}
            onChange={onYearChange}
            aria-label="Year"
          >
            <option value="">Year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            className="bg-white/10 text-white rounded-xl px-4 py-3 outline-none border border-white/10 focus:border-white/30 transition min-w-[120px]"
            value={transmission}
            onChange={onTransmissionChange}
            aria-label="Transmission"
          >
            <option value="">Transmission</option>
            {TRANSMISSIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            className="bg-white/10 text-white rounded-xl px-4 py-3 outline-none border border-white/10 focus:border-white/30 transition min-w-[120px]"
            value={sort}
            onChange={onSortChange}
            aria-label="Sort"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button
            className="ml-2 bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-[1.04] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            onClick={onClear}
            type="button"
            aria-label="Clear Filters"
          >
            Clear
          </button>
        </div>
      </div>
      {/* Listings Grid */}
      <div className="max-w-6xl mx-auto w-full">
        {filtered.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-white/80 flex flex-col items-center justify-center min-h-[300px] animate-fadeIn">
            <Filter size={40} className="mb-4 text-yellow-400" />
            <h2 className="text-2xl font-semibold mb-2">No cars found</h2>
            <p className="mb-4">Try adjusting your filters or search terms.</p>
            <button
              className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-[1.04] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              onClick={onClear}
              type="button"
              aria-label="Clear Filters"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 animate-fadeInUp">
            {filtered.map((car) => (
              <div
                key={car.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-lg group focus-within:ring-2 focus-within:ring-yellow-400"
                tabIndex={0}
                aria-label={`View details for ${car.title}`}
              >
                <Image
                  src={car.image}
                  alt={car.title}
                  width={400}
                  height={200}
                  className="h-48 w-full object-cover group-hover:scale-105 transition duration-500 bg-zinc-200"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/logo.png";
                  }}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 truncate" title={car.title}>{car.title}</h3>
                  <p className="text-white/60 text-sm mb-1">
                    {car.year} • {car.fuel} • {car.transmission}
                  </p>
                  <p className="text-white/80 text-base mb-1">{car.location}</p>
                  <p className="mt-2 font-bold text-white text-lg">
                    ₹ {car.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
