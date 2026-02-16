

import { createClient } from '@/lib/supabase/client'
import CarCard from '@/components/marketplace/CarCard'
import ListingCardSkeleton from '@/components/marketplace/ListingCardSkeleton'
import Link from 'next/link'

interface Car {
  id: string
  title: string
  brand: string
  year: number
  price: number
  city?: string | null
  is_active?: boolean | null
  created_at?: string | null
  car_images?: Array<{ image_url?: string }>
  dealer_id?: string;
  dealer_name?: string;
  activeDealer?: boolean;
}

export const revalidate = 60; // 1 minute cache for public data

export default async function MarketplacePage({ searchParams }: { searchParams?: Promise<any> }) {
  // create supabase client instance
  const supabase = createClient();
  let query = supabase
    .from('cars')
    .select('id, title, brand, year, price, city, is_active, created_at, car_images(image_url)')
    .eq('is_active', true)

  // Filters from URL
  let params: any = {}
  if (searchParams) {
    params = await searchParams
  }
  const { brand, city, min, max, sort } = params || {}
  if (brand) query = query.eq('brand', brand)
  if (city) query = query.eq('city', city)
  if (min) query = query.gte('price', Number(min))
  if (max) query = query.lte('price', Number(max))

  // Sorting
  if (sort === 'price_low') query = query.order('price', { ascending: true })
  else if (sort === 'price_high') query = query.order('price', { ascending: false })
  else query = query.order('featured', { ascending: false }).order('created_at', { ascending: false })

  const { data: cars, error } = await query

  // Helper for price formatting
  const formatPrice = (price: number) =>
    price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">Browse premium cars from verified dealers</p>
        </div>

        {/* Filters */}
        <form className="bg-card border border-border p-6 rounded-xl mb-12 space-y-4" method="get">
          <h3 className="font-semibold text-yellow-500">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              name="brand"
              placeholder="Brand (e.g., Honda, BMW)"
              className="p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-yellow-500 text-foreground placeholder:text-muted-foreground transition-colors duration-300"
              defaultValue={brand || ''}
            />
            <input
              name="city"
              placeholder="City (e.g., Mumbai)"
              className="p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-yellow-500 text-foreground placeholder:text-muted-foreground transition-colors duration-300"
              defaultValue={city || ''}
            />
            <input
              name="min"
              placeholder="Min Price"
              type="number"
              className="p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-yellow-500 text-foreground placeholder:text-muted-foreground transition-colors duration-300"
              defaultValue={min || ''}
            />
            <input
              name="max"
              placeholder="Max Price"
              type="number"
              className="p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-yellow-500 text-foreground placeholder:text-muted-foreground transition-colors duration-300"
              defaultValue={max || ''}
            />
            <select
              name="sort"
              className="p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-yellow-500 text-foreground transition-colors duration-300"
              defaultValue={sort || 'newest'}
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price Low → High</option>
              <option value="price_high">Price High → Low</option>
            </select>
          </div>
          <button type="submit" className="mt-6 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-medium transition-all duration-200 hover:opacity-90">
            Apply Filters
          </button>
        </form>

        {/* Results */}
        {!cars ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-fadeInUp">
            {[...Array(6)].map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="bg-card border border-border p-12 rounded-xl text-center">
            <p className="text-muted-foreground">No cars found matching your filters</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">{cars.length} cars found</p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-fadeInUp">
              {cars.map((car: Car) => (
                <CarCard
                  key={car.id}
                  id={car.id}
                  image={car.car_images?.[0]?.image_url || "/logo.png"}
                  title={car.title}
                  year={car.year}
                  price={formatPrice(car.price)}
                  location={car.city || ""}
                  dealer={car.dealer_id ? { id: car.dealer_id, name: car.dealer_name || 'Dealer', activeDealer: car.activeDealer } : undefined}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
