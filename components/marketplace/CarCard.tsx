import Image from "next/image"
import Link from "next/link"

interface CarCardProps {
  id: string
  image: string
  title: string
  year: number
  price: string
  location: string
}

export default function CarCard({
  id,
  image,
  title,
  year,
  price,
  location,
}: CarCardProps) {
  return (
    <Link
      href={`/cars/${id}`}
      className="group block bg-card backdrop-blur-xl border border-border rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-yellow-500"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-card/60">
        <Image
          src={image || "/placeholder.jpg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition duration-300"
          priority={false}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-5 space-y-2">
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-sm">
            ₹{price}
          </span>
          <span className="bg-card/80 text-foreground px-2 py-1 rounded text-xs">
            {year}
          </span>
          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
            {location}
          </span>
        </div>
        <p className="text-sm text-gray-400">
          {year} • {location}
        </p>
      </div>
    </Link>
  )
}
