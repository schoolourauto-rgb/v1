
import { createClient } from '@/lib/supabase/server';
import CarCard from '@/components/marketplace/CarCard';
import type { Car as CarType } from '@/types/car';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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
  alternates: {
    canonical: 'https://ourauto.in/dealer/',
  },
};


export default async function DealerProfilePage({ params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();

    // Fetch dealer profile (minimal columns)
    const { data: dealer, error: dealerError } = await supabase
      .from('dealers')
      .select('id, business_name, city, mobile')
      .eq('id', params.id)
      .maybeSingle();

    if (dealerError) {
      // Log and treat as not found
      console.error('Fetch dealer error', dealerError.message);
      notFound();
    }
    if (!dealer) {
      notFound();
    }

    // Fetch dealer's cars (minimal columns)
    const { data: carsData, error: carsError } = await supabase
      .from('cars')
      .select('id, title, brand, model, year, price, fuel_type, city, transmission, car_images(image_url)')
      .eq('dealer_id', dealer.id);
    if (carsError) {
      console.error('Fetch cars error', carsError.message);
    }

    type CarDisplay = CarType & { image: string; location: string };
    const cars: CarDisplay[] =
      carsData?.map((row: any) => ({
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
    };

    return (
      <>
        <link rel="canonical" href={`https://ourauto.in/dealer/${dealer.id}`} />
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
                    price={car.price?.toLocaleString?.('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }) ?? ''}
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
    );
  } catch (err) {
    // Defensive error boundary
    console.error('DealerProfilePage error', err);
    notFound();
  }
}
