export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createClient()

  const { data: car } = await supabase
    .from("cars")
    .select(`
      title,
      price,
      brand,
      model,
      year,
      car_images(image_url, is_primary)
    `)
    .eq("slug", params.slug)
    .single()

  if (!car) return {}

  const primaryImage =
    car.car_images?.find((img: any) => img.is_primary)?.image_url

  return {
    title: `${car.title} - ₹${car.price}`,
    description: `${car.year} ${car.brand} ${car.model} available for ₹${car.price}. Contact dealer now.`,
    openGraph: {
      title: car.title,
      description: `${car.year} ${car.brand} ${car.model}`,
      type: "website",
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
    alternates: {
      canonical: `/car/${params.slug}`,
    },
  }
}
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import LeadForm from "./LeadForm"

import Link from "next/link"

export default async function CarDetailsPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createClient()

  const { data: car } = await supabase
    .from("cars")
    .select(`
      *,
      car_images(image_url, is_primary),
      dealer_profiles(name, phone, id)
    `)
    .eq("slug", params.slug)
    .eq("status", "active")
    .single()

  if (!car) return notFound()

  const primaryImage =
    car.car_images?.find((img: any) => img.is_primary)?.image_url

  // 🔎 RELATED CARS QUERY
  const { data: relatedCars } = await supabase
    .from("cars")
    .select(`
      id,
      title,
      slug,
      price,
      year,
      fuel,
      transmission,
      car_images(image_url, is_primary)
    `)
    .eq("status", "active")
    .eq("brand", car.brand)
    .neq("id", car.id)
    .limit(4)

  let finalRelated = relatedCars

  if (!relatedCars || relatedCars.length === 0) {
    const { data: priceFallback } = await supabase
      .from("cars")
      .select(`
        id,
        title,
        slug,
        price,
        year,
        fuel,
        transmission,
        car_images(image_url, is_primary)
      `)
      .eq("status", "active")
      .gte("price", car.price - 200000)
      .lte("price", car.price + 200000)
      .neq("id", car.id)
      .limit(4)
    finalRelated = priceFallback
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* IMAGE SECTION */}
      <div>
        <img
          src={primaryImage}
          className="w-full h-96 object-cover rounded-xl"
        />

        <div className="flex gap-4 mt-4">
          {car.car_images?.map((img: any) => (
            <img
              key={img.image_url}
              src={img.image_url}
              className="w-24 h-20 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>

      {/* DETAILS */}
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{car.title}</h1>
          <p className="text-2xl text-green-600 font-semibold">
            ₹{car.price}
          </p>

          <ul className="space-y-2 text-gray-600">
            <li>Brand: {car.brand}</li>
            <li>Model: {car.model}</li>
            <li>Year: {car.year}</li>
            <li>Fuel: {car.fuel}</li>
            <li>Transmission: {car.transmission}</li>
            <li>KM Driven: {car.km_driven}</li>
          </ul>
        </div>

        {/* DEALER + LEAD FORM */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold">
            Contact Dealer
          </h2>

          <p>
            Dealer: {car.dealer_profiles?.name || "Dealer"}
          </p>

          <LeadForm carId={car.id} dealerId={car.dealer_profiles?.id} />
        </div>
      </div>

      {/* RELATED CARS */}
      {finalRelated && finalRelated.length > 0 && (
        <div className="mt-16 space-y-6">
          <h2 className="text-2xl font-bold">Related Cars</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {finalRelated.map((related: any) => {
              const primaryImage =
                related.car_images?.find((img: any) => img.is_primary)
                  ?.image_url

              return (
                <Link
                  key={related.id}
                  href={`/car/${related.slug}`}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                >
                  <img
                    src={
                      primaryImage ||
                      "https://via.placeholder.com/400x300"
                    }
                    className="w-full h-40 object-cover"
                    alt={related.title}
                  />

                  <div className="p-4 space-y-1">
                    <h3 className="font-semibold text-sm">
                      {related.title}
                    </h3>

                    <p className="text-green-600 font-bold">
                      ₹{related.price}
                    </p>

                    <p className="text-xs text-gray-500">
                      {related.year} • {related.fuel}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
