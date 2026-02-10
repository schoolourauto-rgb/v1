'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

  const router = useRouter()

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
      // Onboarding flow frozen for V1. No redirect.
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchCars()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalCars = cars.length
  const activeCars = cars.filter((c) => c.status === 'active').length
  const draftCars = cars.filter((c) => c.status === 'draft').length
  const isUnlocked = totalCars >= 6

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Dealer Dashboard</h1>
          <p className="text-muted-foreground">Manage your car inventory</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-sm">
            <p className="text-muted-foreground text-sm font-medium">Total Cars</p>
            <p className="text-4xl font-bold mt-2">{totalCars}</p>
          </div>
          <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-sm">
            <p className="text-muted-foreground text-sm font-medium">Active Listings</p>
            <p className="text-4xl font-bold mt-2 text-green-500">{activeCars}</p>
          </div>
          <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-sm">
            <p className="text-muted-foreground text-sm font-medium">Drafts</p>
            <p className="text-4xl font-bold mt-2 text-yellow-500">{draftCars}</p>
          </div>
          <div
            className={`border border-border p-6 rounded-xl shadow-sm ${
              isUnlocked ? 'bg-green-900/30' : 'bg-yellow-900/30'
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
          <div className="bg-yellow-900/20 border border-yellow-800 p-6 rounded-xl shadow-sm mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-yellow-400">Unlock Marketplace</h3>
                <p className="text-sm text-yellow-300/70 mt-1">Add {6 - totalCars} more cars to go live</p>
              </div>
              <Link
                href="/dealer/add-car"
                className="bg-primary hover:opacity-90 text-primary-foreground font-semibold px-6 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                + Add Car
              </Link>
            </div>
            <div className="w-full bg-yellow-900/30 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
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
              className="bg-primary hover:opacity-90 text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 inline-block"
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
            <div className="bg-card text-card-foreground border border-border p-12 rounded-xl shadow-sm text-center">
              <p className="text-muted-foreground mb-4">No cars added yet</p>
              <Link
                href="/dealer/add-car"
                className="bg-primary hover:opacity-90 text-primary-foreground font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 inline-block"
              >
                Add Your First Car
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <div key={car.id} className="bg-card text-card-foreground border border-border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                  <div className="bg-muted h-40 flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">No image yet</p>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold">{car.name}</h3>
                      <p className="text-sm text-muted-foreground">
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
                        className="flex-1 bg-muted hover:bg-muted/70 text-foreground text-sm py-2 rounded-lg border border-border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 text-center"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/car/${car.id}`}
                        className="flex-1 bg-primary hover:opacity-90 text-primary-foreground font-semibold text-sm py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 text-center"
                      >
                        View
                      </Link>
                    </div>
                    <div>
                      <button
                        onClick={async () => {
                          await supabase
                            .from('cars')
                            .update({ status: car.status === 'active' ? 'draft' : 'active' })
                            .eq('id', car.id)

                          fetchCars()
                        }}
                        className="mt-2 text-sm px-3 py-1 border border-border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                      >
                        {car.status === 'active' ? 'Set Draft' : 'Activate'}
                      </button>
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

