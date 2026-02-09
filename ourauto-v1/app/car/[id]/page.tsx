'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
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
  color?: string
  description?: string
  dealer_id: string
  created_at: string
}

interface CarImage {
  id: string
  image_url: string
}

export default function CarDetailPage() {
  const supabase = createClient()
  const params = useParams()
  const carId = params.id as string

  const [car, setCar] = useState<Car | null>(null)
  const [images, setImages] = useState<CarImage[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      // Fetch car
      const { data: carData } = await supabase
        .from('cars')
        .select('*')
        .eq('id', carId)
        .single()

      if (carData) {
        setCar(carData)

        // Fetch images
        const { data: imagesData } = await supabase
          .from('car_images')
          .select('*')
          .eq('car_id', carId)

        setImages(imagesData || [])
      }

      setLoading(false)
    }

    fetchData()
  }, [carId, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-zinc-400">Car not found</p>
          <Link href="/marketplace" className="text-yellow-500 hover:underline">
            Back to marketplace
          </Link>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`
    }
    return `₹${price.toLocaleString()}`
  }

  const isDealer = user && user.id === car.dealer_id

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link href="/marketplace" className="text-yellow-500 hover:underline mb-6 inline-block text-sm">
          ← Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-xl aspect-video flex items-center justify-center">
                {images.length > 0 ? (
                  <img
                    src={images[0].image_url}
                    alt={car.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-zinc-500">🚗 No images</span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="bg-zinc-800 rounded-lg aspect-square">
                      <img src={img.image_url} alt="Car" className="w-full h-full object-cover rounded-lg" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Basic Info */}
            <div className="border-b border-zinc-800 pb-8">
              <h1 className="text-4xl font-bold mb-2">{car.name}</h1>
              <p className="text-lg text-zinc-400 mb-6">
                {car.year} • {car.brand} {car.model}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900 p-4 rounded-lg">
                  <p className="text-sm text-zinc-500">Price</p>
                  <p className="text-2xl font-bold text-yellow-500 mt-1">{formatPrice(car.price)}</p>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg">
                  <p className="text-sm text-zinc-500">Mileage</p>
                  <p className="text-2xl font-bold mt-1">{(car.mileage / 1000).toFixed(0)}K km</p>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg">
                  <p className="text-sm text-zinc-500">Fuel Type</p>
                  <p className="text-2xl font-bold mt-1">{car.fuel_type}</p>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg">
                  <p className="text-sm text-zinc-500">Transmission</p>
                  <p className="text-2xl font-bold mt-1">{car.transmission}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">About this car</h2>
              {user ? (
                <p className="text-zinc-300 leading-relaxed">{car.description || 'No description provided'}</p>
              ) : (
                <div className="bg-yellow-900/20 border border-yellow-800 p-6 rounded-lg text-center">
                  <p className="text-yellow-400 font-semibold mb-2">Login to view full details</p>
                  <Link
                    href="/login"
                    className="text-yellow-500 hover:text-yellow-400 transition text-sm"
                  >
                    Login now →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Inquiry Card */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
              <h3 className="text-xl font-bold">Interested?</h3>
              {user ? (
                <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition">
                  Send Inquiry
                </button>
              ) : (
                <>
                  <p className="text-sm text-zinc-400">Login to send inquiry</p>
                  <Link
                    href="/login"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition block text-center"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* Dealer Contact */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
              <h3 className="font-bold">Dealer Information</h3>
              <div className="space-y-2">
                <p className="text-sm text-zinc-400">Verified Dealer</p>
                <p className="font-semibold text-yellow-500">⭐ 4.8/5 Rating</p>
              </div>
              {isDealer && (
                <Link
                  href={`/dealer/edit-car/${car.id}`}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 rounded-lg transition text-center text-sm"
                >
                  Edit Car
                </Link>
              )}
            </div>

            {/* Key Features */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
              <h3 className="font-bold">Details</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-zinc-400">Year:</span>
                  <span className="font-semibold">{car.year}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-zinc-400">Color:</span>
                  <span className="font-semibold">{car.color || 'Not specified'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-zinc-400">Listed:</span>
                  <span className="font-semibold">{new Date(car.created_at).toLocaleDateString()}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
