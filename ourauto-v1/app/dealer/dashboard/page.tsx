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
  status: 'draft' | 'active' | 'sold'
  created_at: string
}

export default function DealerDashboard() {
  const supabase = createClient()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCars = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('dealer_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching cars:', error)
      } else {
        setCars(data || [])
      }

      setLoading(false)
    }

    fetchCars()
  }, [supabase])

  const totalCars = cars.length
  const activeCars = cars.filter((c) => c.status === 'active').length
  const draftCars = cars.filter((c) => c.status === 'draft').length
  const isUnlocked = totalCars >= 6

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Dealer Dashboard</h1>
          <p className="text-zinc-400">Manage your car inventory</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <p className="text-zinc-400 text-sm font-medium">Total Cars</p>
            <p className="text-4xl font-bold mt-2">{totalCars}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <p className="text-zinc-400 text-sm font-medium">Active Listings</p>
            <p className="text-4xl font-bold mt-2 text-green-500">{activeCars}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <p className="text-zinc-400 text-sm font-medium">Drafts</p>
            <p className="text-4xl font-bold mt-2 text-yellow-500">{draftCars}</p>
          </div>
          <div
            className={`border p-6 rounded-xl ${
              isUnlocked ? 'bg-green-900/30 border-green-800' : 'bg-yellow-900/30 border-yellow-800'
            }`}
          >
            <p className={`text-sm font-medium ${isUnlocked ? 'text-green-400' : 'text-yellow-400'}`}>
              Marketplace Status
            </p>
            <p className={`text-2xl font-bold mt-2 ${isUnlocked ? 'text-green-400' : 'text-yellow-400'}`}>
              {isUnlocked ? '🎉 Unlocked!' : `${totalCars}/6`}
            </p>
          </div>
        </div>

        {/* Unlock Progress */}
        {!isUnlocked && (
          <div className="bg-yellow-900/20 border border-yellow-800 p-6 rounded-xl mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-yellow-400">Unlock Marketplace</h3>
                <p className="text-sm text-yellow-300/70 mt-1">Add {6 - totalCars} more cars to go live</p>
              </div>
              <Link
                href="/dealer/add-car"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition"
              >
                + Add Car
              </Link>
            </div>
            <div className="w-full bg-yellow-900/30 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all"
                style={{ width: `${(totalCars / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Add Car Button (if unlocked or first time) */}
        {isUnlocked && (
          <div className="mb-12">
            <Link
              href="/dealer/add-car"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-lg transition inline-block"
            >
              + Add Another Car
            </Link>
          </div>
        )}

        {/* Cars Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Cars</h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-zinc-400">Loading your cars...</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-xl text-center">
              <p className="text-zinc-400 mb-4">No cars added yet</p>
              <Link
                href="/dealer/add-car"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2.5 rounded-lg transition inline-block"
              >
                Add Your First Car
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <div key={car.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-yellow-500 transition">
                  <div className="bg-zinc-800 h-40 flex items-center justify-center">
                    <p className="text-zinc-500 text-sm">No image yet</p>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold">{car.name}</h3>
                      <p className="text-sm text-zinc-400">
                        {car.year} • {car.brand} {car.model}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-yellow-500">₹{(car.price / 100000).toFixed(1)}L</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          car.status === 'active'
                            ? 'bg-green-900/50 text-green-300'
                            : car.status === 'draft'
                              ? 'bg-yellow-900/50 text-yellow-300'
                              : 'bg-red-900/50 text-red-300'
                        }`}
                      >
                        {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link
                        href={`/dealer/edit-car/${car.id}`}
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-sm py-2 rounded-lg transition text-center"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/car/${car.id}`}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-sm py-2 rounded-lg transition text-center"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

