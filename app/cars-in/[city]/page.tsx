import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = params.city.charAt(0).toUpperCase() + params.city.slice(1);
  return {
    title: `Used Cars in ${city} | OurAuto`,
    description: `Find the best used cars, trending brands, and top dealers in ${city}. Search, compare, and connect directly with trusted sellers on OurAuto.`,
  };
}

export default async function CityCarsPage({ params }: { params: { city: string } }) {
  const city = params.city.toLowerCase();
  const supabase = await createClient();

  // Fetch cars in city
  const { data: cars, count: totalListings } = await supabase
    .from('cars')
    .select('*', { count: 'exact' })
    .eq('city', city)
    .eq('is_active', true);

  // Trending brands in city
  const { data: brands } = await supabase
    .from('cars')
    .select('brand')
    .eq('city', city)
    .neq('brand', null);
  const trendingBrands = Array.from(new Set((brands ?? []).map(b => b.brand))).slice(0, 6);

  // Top dealers in city
  const { data: dealers } = await supabase
    .from('dealers')
    .select('id, name, trust_score, profile_views')
    .eq('city', city)
    .order('trust_score', { ascending: false })
    .limit(5);

  if (!cars) return notFound();

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Used Cars in {city.charAt(0).toUpperCase() + city.slice(1)}</h1>
      <div className="mb-4 text-zinc-600">{totalListings} listings found</div>

      {/* Trending Brands */}
      {trendingBrands.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Trending Brands</h2>
          <div className="flex gap-2 flex-wrap">
            {trendingBrands.map((brand) => (
              <span key={brand} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold text-sm">{brand}</span>
            ))}
          </div>
        </div>
      )}

      {/* Top Dealers */}
      {dealers && dealers.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold mb-2">Top Dealers in {city.charAt(0).toUpperCase() + city.slice(1)}</h2>
          <div className="flex gap-4 flex-wrap">
            {dealers.map((dealer) => (
              <div key={dealer.id} className="bg-white border border-zinc-200 rounded-lg p-4 min-w-[180px]">
                <div className="font-bold text-lg mb-1">{dealer.name}</div>
                <div className="text-green-600 font-semibold text-sm">Trust: {dealer.trust_score}</div>
                <div className="text-xs text-zinc-400">Profile Views: {dealer.profile_views ?? 0}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest Cars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cars.map((car: any) => (
          <div key={car.id} className="bg-white border border-zinc-200 rounded-lg p-4">
            <img src={car.car_images?.[0]?.image_url || '/logo.png'} alt={car.title} className="w-full h-40 object-cover rounded mb-3" />
            <div className="font-bold text-lg text-black mb-1">{car.brand} {car.model}</div>
            <div className="text-zinc-700 text-sm mb-1">{car.year} • {car.fuel_type} • {car.transmission}</div>
            <div className="text-zinc-900 font-semibold">₹{car.price?.toLocaleString()}</div>
            <div className="text-zinc-500 text-xs mt-1">{car.city}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
