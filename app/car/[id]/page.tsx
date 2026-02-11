import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { CarImage } from '@/types';
import CarDetail from '../CarDetailClient';
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient();

  const { data: car } = await supabase
    .from('cars')
    .select(`
      *,
      car_images(image_url),
      profiles(mobile, business_name)
    `)
    .eq('id', id)
    .single();

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-zinc-400">Car not found</p>
          <Link href="/marketplace" className="text-yellow-500 hover:underline">
            Back to marketplace
          </Link>
        </div>
      </div>
    )
  }

  // Structured data for SEO
  const images = car.car_images?.map((img: CarImage) => img.image_url) ?? []
  const schemaProduct = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: car.title || car.name,
    image: images,
    description: `${car.year} ${car.brand} ${car.model} available in ${car.location || car.city}`,
    brand: {
      "@type": "Brand",
      name: car.brand
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: car.price,
      availability: "https://schema.org/InStock",
      url: `https://ourauto.in/cars/${car.id}`
    },
    vehicleModelDate: car.year,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.mileage,
      unitCode: "KMT"
    },
    fuelType: car.fuel_type,
    vehicleTransmission: car.transmission
  }
  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://ourauto.in"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Marketplace",
        item: "https://ourauto.in/marketplace"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: car.title || car.name,
        item: `https://ourauto.in/cars/${car.id}`
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      <CarDetail car={car} user={user} />
      {/* Internal links for topic clusters */}
      <div className="max-w-5xl mx-auto mt-10 mb-20">
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href={`/${car.brand?.toLowerCase()}-in-${car.location?.toLowerCase() || car.city?.toLowerCase() || ''}`} className="text-sm bg-neutral-900 text-yellow-500 px-4 py-2 rounded hover:bg-yellow-500 hover:text-black transition">
            More {car.brand} cars in {car.location || car.city}
          </Link>
          <Link href={`/cars-in-${car.location?.toLowerCase() || car.city?.toLowerCase() || ''}`} className="text-sm bg-neutral-900 text-yellow-500 px-4 py-2 rounded hover:bg-yellow-500 hover:text-black transition">
            More cars in {car.location || car.city}
          </Link>
          <Link href={`/dealer/${car.dealer_id}`} className="text-sm bg-neutral-900 text-yellow-500 px-4 py-2 rounded hover:bg-yellow-500 hover:text-black transition">
            Other cars by this dealer
          </Link>
        </div>
      </div>
    </>
  )
}
