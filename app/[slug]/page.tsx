import { createServerClientTyped } from '@/lib/supabase/server'
import CarCard from '@/components/marketplace/CarCard'

function parseSlug(slug?: string) {
  let brand = '';
  let city = '';
  let category = '';
  if (!slug) {
    return { brand, city, category };
  }
  if (slug.startsWith('cars-in-')) {
    city = slug.replace('cars-in-', '');
  } else if (slug.includes('-in-')) {
    const parts = slug.split('-in-');
    if (['suv', 'sedan', 'hatchback', 'luxury'].includes(parts[0].toLowerCase())) {
      category = parts[0];
      city = parts[1];
    } else {
      if (!slug) return { city: "", category: "" }
  
      if (slug.startsWith("cars-in-")) {
        city = slug.replace("cars-in-", "");
      } else if (slug.includes("-in-")) {
        const parts = slug.split("-in-");
        if (['suv', 'sedan', 'hatchback', 'luxury'].includes(parts[0].toLowerCase())) {
          category = parts[0];
          city = parts[1];
        } else {
          brand = parts[0];
          city = parts[1];
        }
      }
  
      return { brand, city, category };
    }
  }
  return { brand, city, category };
}

// import type { Database } from '@/lib/supabase/types';
import type { Car } from '@/types/car';

interface LocationLandingPageProps {
  params: { slug?: string };
}

export default async function LocationLandingPage({ params }: LocationLandingPageProps) {
  const { brand, city, category } = parseSlug(params?.slug);

    const supabase = await createServerClientTyped();
  let cars: Car[] = [];
    let query = supabase
      .from('cars')
      .select(`
        id,
        title,
        brand,
        model,
        fuel_type,
        price,
        year,
        city,
        transmission,
        car_images (
          image_url
        )
      `);
    if (brand) query = query.eq('brand', brand);
    if (city) query = query.eq('city', city);
    if (category) query = query.eq('category', category);
    const { data, error } = await query;
    let displayCars: (Car & { image: string; location: string })[] = [];
    if (!error && data) {
      displayCars = data.map((car: any) => ({
        id: car.id,
        title: car.title,
        brand: car.brand,
        dealer_id: car.dealer_id ?? '',
        model: car.model,
        year: car.year,
        fuel: car.fuel_type ?? '',
        price: car.price,
        transmission: car.transmission ?? '',
        city: car.city ?? '',
        image: car.car_images?.[0]?.image_url ?? '/logo.png',
        location: car.city ?? city ?? '',
      }));
      cars = displayCars;
    }
    // Removed unnecessary check for supabase

  // Dynamic meta title
  const title = brand
    ? `${brand.charAt(0).toUpperCase() + brand.slice(1)} Cars in ${city.charAt(0).toUpperCase() + city.slice(1)} | OurAuto Marketplace`
    : category
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} Cars in ${city.charAt(0).toUpperCase() + city.slice(1)} | OurAuto Marketplace`
    : `Cars in ${city.charAt(0).toUpperCase() + city.slice(1)} | OurAuto Marketplace`;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {displayCars && displayCars.length > 0 ? (
          displayCars.map((car) => (
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
          <p className="text-muted-foreground col-span-full">No cars found for this search.</p>
        )}
      </div>
    </div>
  );
}
