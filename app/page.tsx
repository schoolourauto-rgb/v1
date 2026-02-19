

import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Find Your Perfect Used Car",
  description:
    "Browse trusted dealer listings. Find verified used cars at the best price.",
}

export default async function HomePage() {
  const supabase = await createClient()

  // 🔥 Featured Cars (only active, featured, and not expired)
  const { data: featuredCars } = await supabase
    .from("cars")
    .select(`
      id,
      title,
      slug,
      price,
      year,
      fuel,
      transmission,
      is_featured,
      featured_until,
      car_images(image_url, is_primary)
    `)
    .eq("status", "active")
    .eq("is_featured", true)
    .gte("featured_until", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div className="space-y-20">

      {/* HERO SECTION */}
      <section className="bg-black text-white py-24 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Find Your Perfect Used Car
        </h1>

        <p className="text-lg text-gray-300 mb-8">
          Browse verified dealer listings and get the best deals today.
        </p>

        <Link
          href="/cars"
          className="bg-white text-black px-8 py-3 rounded-lg font-semibold"
        >
          Browse Cars
        </Link>
      </section>

      {/* FEATURED CARS */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <h2 className="text-3xl font-bold">Featured Cars</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredCars?.map((car: any) => {
            const primaryImage =
              car.car_images?.find((img: any) => img.is_primary)
                ?.image_url

            return (
              <Link
                key={car.id}
                href={`/car/${car.slug}`}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={
                    primaryImage ||
                    "https://via.placeholder.com/400x300"
                  }
                  className="w-full h-52 object-cover"
                  alt={car.title}
                />

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold">
                    {car.title}
                  </h3>

                  <p className="text-green-600 font-bold">
                    ₹{car.price}
                  </p>

                  <p className="text-sm text-gray-500">
                    {car.year} • {car.fuel} • {car.transmission}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-xl font-bold mb-3">
              Verified Dealers
            </h3>
            <p className="text-gray-600">
              All listings are posted by verified dealers.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">
              Best Price Deals
            </h3>
            <p className="text-gray-600">
              Compare prices and choose the best deal.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">
              Fast Enquiries
            </h3>
            <p className="text-gray-600">
              Contact dealers instantly and close faster.
            </p>
          </div>
        </div>
      </section>

      {/* DEALER CTA */}
      <section className="bg-black text-white py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-6">
          Are You a Dealer?
        </h2>

        <p className="text-gray-300 mb-8">
          List your cars and connect with serious buyers.
        </p>

        <Link
          href="/signup"
          className="bg-white text-black px-8 py-3 rounded-lg font-semibold"
        >
          Join as Dealer
        </Link>
      </section>
    </div>
  )
}
