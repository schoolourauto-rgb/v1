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
      className="group block bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-yellow-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/10"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition duration-700 ease-out"
        />
      </div>

      {/* Content */}
      <div className="p-5 space-y-2">
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>

        <p className="text-sm text-gray-400">
          {year} • {location}
        </p>

        <p className="text-xl font-bold text-yellow-500">
          {price}
        </p>

        <div className="pt-3">
          <span className="text-sm text-yellow-500 group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  )
}
