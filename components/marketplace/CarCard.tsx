import Image from "next/image"
import Link from "next/link"
import type { Car } from "@/types/car";


interface CarCardProps extends Car {
  location?: string;
  dealer?: {
    id: string;
    name: string;
    [key: string]: any;
  };
  listingTier?: "simple" | "hot" | "featured";
  structuredFields?: any;
  detectedFeatures?: any;
  rawDescription?: string;
  views?: number;
  leads?: number;
  is_featured?: boolean;
}



export default function CarCard({
  id,
  image,
  title,
  year,
  price,
  location,
  dealer,
  listingTier = "simple",
  structuredFields,
  detectedFeatures,
  rawDescription,
  views = 0,
  leads = 0,
  created_at,
  is_featured = false,
}: CarCardProps) {
  let daysAgo = "";
  if (created_at) {
    const days = Math.floor((Date.now() - new Date(created_at).getTime()) / (1000 * 60 * 60 * 24));
    daysAgo = days === 0 ? "Today" : `${days}d ago`;
  }

  return (
    <Link
      href={`/cars/${id}`}
      className="group flex flex-col bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-modern hover:shadow-xl transition hover:scale-[1.02] duration-300 overflow-hidden p-0 w-full max-w-full sm:max-w-md mx-auto"
    >
      <div className="relative w-full h-0 pb-[60%] bg-[var(--background)] overflow-hidden">
        <Image
          src={image || "/placeholder.jpg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onLoadingComplete={(img) => img.setAttribute("data-loaded", "true")}
        />
        {listingTier === "hot" && (
          <span className="absolute top-4 left-4 bg-[var(--accent)] text-black text-xs font-bold px-3 py-1 rounded-2xl shadow-modern z-10">
            🔥 Hot Deal
          </span>
        )}
        {listingTier === "featured" && (
          <span className="absolute top-4 left-4 bg-[var(--accent)] text-black text-xs font-bold px-3 py-1 rounded-2xl shadow-modern z-10">
            ⭐ Featured
          </span>
        )}
      </div>
      <div className="flex flex-col justify-between flex-1 p-4 gap-2">
        <h3 className="text-xl font-semibold line-clamp-2 text-[var(--text)] mb-1" style={{fontSize:'16px'}}>{title}</h3>
        <div className="flex flex-wrap items-center gap-3 text-base text-[var(--text)]">
          <span className="text-2xl font-bold text-[var(--text)]" style={{fontSize:'18px'}}>₹{price ?? "-"}</span>
          {year && <span className="opacity-70" style={{fontSize:'14px'}}>{year}</span>}
          {location && <span className="opacity-70" style={{fontSize:'14px'}}>{location}</span>}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text)] opacity-60 mt-1">
          {dealer?.name && <span style={{fontSize:'14px'}}>{dealer.name}</span>}
          {daysAgo && <span style={{fontSize:'14px'}}>• {daysAgo}</span>}
          {views > 0 && <span style={{fontSize:'14px'}}>• {views} views</span>}
        </div>
      </div>
    </Link>
  );
}
//
