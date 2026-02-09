'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Car {
  id: string
  name: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel_type: string
  transmission: string
  status: string
}

export default function MarketplacePage() {
  const supabase = createClient()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
  })

  useEffect(() => {
    const fetchCars = async () => {
      let query = supabase.from('cars').select('*').eq('status', 'active')

      if (filters.brand) {
        query = query.ilike('brand', `%${filters.brand}%`)
      }

      if (filters.minPrice) {
        query = query.gte('price', Number(filters.minPrice))
      }

      if (filters.maxPrice) {
        query = query.lte('price', Number(filters.maxPrice))
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching cars:', error)
      } else {
        setCars(data || [])
      }

      setLoading(false)
    }

    fetchCars()
  }, [filters, supabase])

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`
    }
    return `₹${price.toLocaleString()}`
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-zinc-400">Browse premium cars from verified dealers</p>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl mb-12 space-y-4">
          <h3 className="font-semibold text-yellow-500">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              placeholder="Brand (e.g., Honda, BMW)"
              className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-yellow-500"
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            />
            <input
              placeholder="Min Price"
              type="number"
              className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-yellow-500"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
            <input
              placeholder="Max Price"
              type="number"
              className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-yellow-500"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-zinc-400">Loading cars...</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-xl text-center">
            <p className="text-zinc-400">No cars found matching your filters</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-zinc-400 mb-6">{cars.length} cars found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <Link
                  key={car.id}
                  href={`/car/${car.id}`}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-yellow-500 transition group"
                >
                  {/* Image Placeholder */}
                  <div className="bg-zinc-800 h-48 flex items-center justify-center group-hover:bg-zinc-700 transition">
                    <span className="text-zinc-500">🚗 Car Image</span>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-yellow-500 transition">{car.name}</h3>
                      <p className="text-sm text-zinc-400">
                        {car.year} • {car.brand} {car.model}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Price:</span>
                        <span className="font-bold text-yellow-500">{formatPrice(car.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Mileage:</span>
                        <span>{(car.mileage / 1000).toFixed(0)}K km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Fuel:</span>
                        <span>{car.fuel_type}</span>
                      </div>
                    </div>

                    <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-lg transition mt-4">
                      View Details
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
