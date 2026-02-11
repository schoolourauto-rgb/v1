


if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error("Supabase ENV variables missing");
  export default function LocationLandingPage() {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-semibold">Service temporarily unavailable</h1>
      </div>
    );
  }
  // Return early so the rest of the file is not executed
  // This export will be used if ENV is missing
  // No 500 will be thrown
}
import { createClient } from '@/lib/supabase/server'
import CarCard from '@/components/marketplace/CarCard'
import { CarWithImages } from '@/types'

function parseSlug(slug: string) {
  let brand = ''
  let city = ''
  let category = ''

  if (slug.startsWith('cars-in-')) {
    city = slug.replace('cars-in-', '')
  } else if (slug.includes('-in-')) {
    const parts = slug.split('-in-')
    if (['suv', 'sedan', 'hatchback', 'luxury'].includes(parts[0].toLowerCase())) {
      category = parts[0]
      city = parts[1]
    } else {
      brand = parts[0]
      city = parts[1]
    }
  }
  return { brand, city, category }
}

export default async function LocationLandingPage({ params }: { params: { slug: string } }) {
  try {
    const { brand, city, category } = parseSlug(params.slug)
    const supabase = createClient()

    let query = supabase.from('cars').select('*')
    if (brand) query = query.eq('brand', brand)
    if (city) query = query.eq('city', city)
    if (category) query = query.eq('category', category)

    const { data: cars, error } = await query
    if (error) {
      console.error('Supabase error:', error)
      return <div>Service temporarily unavailable</div>
    }

    // Dynamic meta title
    const title = brand
      ? `${brand.charAt(0).toUpperCase() + brand.slice(1)} Cars in ${city.charAt(0).toUpperCase() + city.slice(1)} | OurAuto Marketplace`
      : category
      ? `${category.charAt(0).toUpperCase() + category.slice(1)} Cars in ${city.charAt(0).toUpperCase() + city.slice(1)} | OurAuto Marketplace`
      : `Cars in ${city.charAt(0).toUpperCase() + city.slice(1)} | OurAuto Marketplace`

    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 py-12 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cars && cars.length > 0 ? (
            (cars as CarWithImages[]).map((car: CarWithImages) => {
              const safePrice =
                typeof car.price === "number"
                  ? car.price.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    })
                  : "Price on request";

              return (
                <CarCard
                  key={car.id}
                  id={car.id}
                  image={car.car_images?.[0]?.image_url || "/logo.png"}
                  title={car.name || "Untitled Car"}
                  year={car.year || "N/A"}
                  price={safePrice}
                  location={car.location ?? city ?? "India"}
                />
              );
            })
          ) : (
            <p className="text-muted-foreground col-span-full">
              No cars found for this search.
            </p>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Slug page error:', error)
    return <div>Service temporarily unavailable</div>
  }
}
