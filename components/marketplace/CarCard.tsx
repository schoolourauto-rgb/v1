import Image from "next/image"
import Link from "next/link"
export interface CarCardProps {
  id: string;
  image?: string;
  title: string;
  year?: string | number;
  price: string | number;
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
  created_at?: string;
  is_featured?: boolean;
}

interface DealerInfo {
  id: string;
  name: string;
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

    // ✅ SAFE JS OUTSIDE JSX
    let daysAgo = "";
    if (created_at) {
      const days = Math.floor(
        (Date.now() - new Date(created_at).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      daysAgo = days === 0 ? "Today" : `${days}d ago`;
    }

    return (
      <Link
        href={`/cars/${id}`}
        className="group block bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border border-white/20 dark:border-neutral-800 rounded-xl shadow-sm sm:shadow-md hover:shadow-md transition-all duration-300 overflow-hidden p-4 sm:p-5"
      >
        <div className="relative w-full aspect-[4/3] bg-neutral-100/70 dark:bg-neutral-800/70 rounded-lg overflow-hidden">
          <Image
            src={image || "/placeholder.jpg"}
            alt={title}
            fill
            className="object-cover transition-opacity duration-500 opacity-0 data-[loaded=true]:opacity-100"
            onLoadingComplete={(img) => img.setAttribute("data-loaded", "true")}
          />

          {listingTier === "hot" && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              🔥 Hot Deal
            </span>
          )}

          {listingTier === "featured" && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded">
              ⭐ Featured
            </span>
          )}
        </div>

        <div className="mt-3 space-y-2">
          <h3 className="text-base sm:text-xl font-semibold line-clamp-2">{title}</h3>

          <div className="flex items-center gap-3 text-sm text-neutral-600">
            <span className="text-xl sm:text-2xl font-bold">₹{price}</span>
            <span>{year}</span>
            <span>{location}</span>
            {daysAgo && <span>⏳ {daysAgo}</span>}
          </div>

          <div className="flex gap-3 text-xs">
            {views > 0 && (
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
                👀 {views} views
              </span>
            )}
            {leads > 0 && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                📞 {leads} enquiries
              </span>
            )}
          </div>

          {dealer && (
            <Link
              href={`/dealer-profile/${dealer.id}`}
              className="text-xs text-neutral-500 hover:text-yellow-500"
              onClick={(e) => e.stopPropagation()}
            >
              {dealer.name}
            </Link>
          )}
        </div>
      </Link>
    );
}
