import { createServerClientTyped } from '@/lib/supabase/server'
import CarCard from '@/components/marketplace/CarCard'
import type { Car as CarType } from '@/types/car';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dealer | OurAuto',
  openGraph: {
    title: 'Dealer | OurAuto',
    description: 'View dealer profile and cars on OurAuto',
    url: 'https://ourauto.in/dealer/',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dealer | OurAuto',
    description: 'View dealer profile and cars on OurAuto',
    images: ['/logo.png'],
  },
};

export default async function DealerProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createServerClientTyped()

  // Fetch dealer profile
  const { data: dealer } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  // Fetch dealer's cars
  const { data, error } = await supabase
    .from('cars')
    .select(`
      id,
      title,
      brand,
      model,
      year,
      price,
      fuel_type,
      city,
      transmission,
      car_images(image_url)
    `)
    .eq('dealer_id', params.id)

  if (error) {
    console.error('Fetch cars error', error.message)
  }

  type CarDisplay = CarType & { image: string; location: string };
  const cars: CarDisplay[] =
    data?.map((row: any) => ({
      id: row.id,
      title: row.title,
      brand: row.brand,
      dealer_id: row.dealer_id ?? params.id,
      model: row.model,
      year: row.year,
      fuel: row.fuel_type ?? '',
      price: row.price,
      transmission: row.transmission ?? '',
      image: row.car_images?.[0]?.image_url ?? '/logo.png',
      location: row.city ?? dealer?.city ?? 'N/A',
    })) ?? [];

  if (!dealer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Dealer not found</p>
        </div>
      </div>
    )
  }

  // Structured data for SEO
  const schemaDealer = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: dealer.business_name,
    url: `https://ourauto.in/dealer/${dealer.id}`,
    telephone: dealer.mobile,
    address: {
      "@type": "PostalAddress",
      addressLocality: dealer.city || '',
      addressCountry: "IN"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaDealer) }}
      />
      <div className="min-h-screen bg-background text-foreground py-12 max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">{dealer.business_name}</h1>
          <p className="text-lg text-muted-foreground mb-2">City: {dealer.city || 'N/A'}</p>
          <p className="text-lg text-muted-foreground mb-2">Phone: {dealer.mobile || 'N/A'}</p>
        </div>
        {/* Internal links for topic clusters */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <a href={`/cars-in-${dealer.city?.toLowerCase() || ''}`} className="text-sm bg-neutral-900 text-yellow-500 px-4 py-2 rounded hover:bg-yellow-500 hover:text-black transition">
            Cars in {dealer.city}
          </a>
          <a href={`/dealers-in-${dealer.city?.toLowerCase() || ''}`} className="text-sm bg-neutral-900 text-yellow-500 px-4 py-2 rounded hover:bg-yellow-500 hover:text-black transition">
            Other dealers in {dealer.city}
          </a>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-6">Cars Listed by {dealer.business_name}</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cars.length > 0 ? (
              cars.map((car) => (
                <CarCard
                  key={car.id}
                  id={car.id}
                  image={car.image}
                  title={car.title}
                  year={car.year}
                  price={car.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                  location={car.location}
                />
              ))
            ) : (
              <p className="text-muted-foreground col-span-full">No cars listed yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
