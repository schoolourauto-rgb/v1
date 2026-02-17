import Image from "next/image"
import Link from "next/link"

interface DealerInfo {
  id: string;
  name: string;
  activeDealer?: boolean;
}


import { StructuredFields } from "@/lib/carParser";

interface CarCardProps {
  id: string;
  image: string;
  title: string;
  year: number;
  price: string;
  location: string;
  dealer?: DealerInfo;
  listingTier?: "hot" | "featured" | "simple";
  structuredFields?: StructuredFields;
  detectedFeatures?: Record<string, boolean>;
  rawDescription?: string;
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
}: CarCardProps) {
  return (
    <Link
      href={`/cars/${id}`}
      className="group block bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-yellow-500 overflow-hidden p-5"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-yellow-100 dark:bg-yellow-900">
        <Image
          src={image || "/placeholder.jpg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition duration-200"
          priority={false}
          loading="lazy"
        />
        {/* --- 3-TIER BADGE SYSTEM --- */}
        {listingTier === "hot" && (
          <span className="absolute top-2 left-2 px-2 py-[2px] border border-yellow-500 rounded text-[11px] text-black dark:text-white bg-yellow-100 dark:bg-yellow-900 backdrop-blur-sm select-none" style={{fontWeight: 500, letterSpacing: 0.1, fontSize: '11px'}}>Hot Deal</span>
        )}
        {listingTier === "featured" && (
          <span className="absolute top-2 left-2 px-2 py-[2px] border border-yellow-500 rounded text-[11px] text-black dark:text-white bg-yellow-100 dark:bg-yellow-900 backdrop-blur-sm select-none" style={{fontWeight: 500, letterSpacing: 0.1, fontSize: '11px'}}>Featured</span>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-black dark:text-white leading-tight line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-black dark:text-white">₹{price}</span>
          <span className="text-xs px-2 py-1 rounded bg-transparent text-black dark:text-white font-medium ml-2">{year}</span>
          <span className="text-xs text-black dark:text-white ml-2">{location}</span>
        </div>

        {/* Structured fields */}
        {structuredFields && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-black dark:text-white mt-2">
            <div><b>Reg.No:</b> {structuredFields.regNo}</div>
            <div><b>Make:</b> {structuredFields.make}</div>
            <div><b>Model:</b> {structuredFields.model}</div>
            <div><b>Version:</b> {structuredFields.version}</div>
            <div><b>Fuel:</b> {structuredFields.fuel}</div>
            <div><b>Colour:</b> {structuredFields.colour}</div>
            <div><b>Owner:</b> {structuredFields.owner}</div>
            <div><b>Insurance:</b> {structuredFields.insurance}</div>
            <div><b>KM:</b> {structuredFields.km}</div>
            <div><b>Price:</b> {structuredFields.price}</div>
          </div>
        )}

        {/* Feature badges */}
        {detectedFeatures && Object.keys(detectedFeatures).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(detectedFeatures).filter(([_, v]) => v).map(([k]) => (
              <span key={k} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold border border-green-300">
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </span>
            ))}
          </div>
        )}

        {/* Raw description */}
        {rawDescription && (
          <div className="mt-3 text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-line border-t pt-2">
            {rawDescription}
          </div>
        )}
        {/* Dealer info */}
        {dealer && (
          <div className="flex items-center gap-2 mt-2">
            <Link
              href={`/dealer/${dealer.id}`}
              className="text-xs text-black dark:text-white underline hover:text-yellow-500 transition-colors duration-200"
              onClick={e => e.stopPropagation()}
              tabIndex={0}
            >
              {dealer.name}
            </Link>
            {dealer.activeDealer && (
              <span className="ml-2 px-2 py-[2px] rounded text-[10px] bg-transparent text-yellow-500 dark:text-yellow-500">Active Dealer</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
