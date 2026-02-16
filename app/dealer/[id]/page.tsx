
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
      .select('id, business_name, city, mobile, created_at, activeDealer')
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

    // Fetch dealer's active cars, sorted by priorityScore DESC
    const { data: carsData, error: carsError } = await supabase
      .from('cars')
      .select('id, title, brand, model, year, price, fuel_type, city, transmission, car_images(image_url), priorityScore, status')
      .eq('dealer_id', dealer.id)
      .eq('status', 'active')
      .order('priorityScore', { ascending: false });
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

    // Count of active listings
    const totalActiveListings = cars.length;
    // Format joined date
    const joinedDate = dealer.created_at ? new Date(dealer.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '-';

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
        <div className="max-w-3xl mx-auto py-8">
          <div className="mb-6 border-b pb-4">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xl font-semibold">{dealer.business_name}</span>
              {dealer.activeDealer && (
                <span className="px-2 py-[2px] border border-border rounded text-xs text-muted-foreground bg-background/80 backdrop-blur-sm select-none" style={{fontWeight: 500, letterSpacing: 0.1}}>Active Dealer</span>
              )}
            </div>
            <div className="text-sm text-muted-foreground flex flex-wrap gap-4">
              <span>City: {dealer.city || '-'}</span>
              <span>Joined: {joinedDate}</span>
              <span>Active Listings: {totalActiveListings}</span>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {cars.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground py-12">
                  No active inventory for this dealer.
                </div>
              ) : (
                cars.map((car) => (
                  <div key={car.id} className="relative">
                    <CarCard
                      id={car.id}
                      image={car.image}
                      title={car.title}
                      year={car.year}
                      price={typeof car.price === 'number' ? '₹' + car.price.toLocaleString('en-IN') : car.price}
                      location={car.location}
                      dealer={{ id: dealer.id, name: dealer.business_name, activeDealer: dealer.activeDealer }}
                    />
                  </div>
                ))
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
