"use client"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import CarCard from "@/components/marketplace/CarCard"
import ListingCardSkeleton from "@/components/marketplace/ListingCardSkeleton"
import { createClient } from "@/lib/supabase/client"



export default function Page() {
  // Smart hero search state
  const [brand, setBrand] = useState("")
  const [city, setCity] = useState("")
  const [max, setMax] = useState("")
  const router = useRouter()

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = []
    if (brand) params.push(`brand=${encodeURIComponent(brand)}`)
    if (city) params.push(`city=${encodeURIComponent(city)}`)
    if (max) params.push(`max=${encodeURIComponent(max)}`)
    const query = params.length ? `?${params.join("&")}` : ""
    router.push(`/marketplace${query}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted text-foreground">
      {/* Premium Hero Section */}
      <section className="relative bg-black text-white">
        <div className="absolute inset-0">
          <div className="relative w-full h-full aspect-[16/7]">
            <Image
              src="/hero-car.jpg"
              alt="Luxury Cars"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-30"
            />
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="OurAuto" width={120} height={40} className="object-contain" />
              <nav className="hidden md:flex gap-6 text-lg">
                <a href="/marketplace" className="hover:text-yellow-400">Marketplace</a>
                <a href="/dealer/dashboard" className="hover:text-yellow-400">Dealer</a>
                <a href="/about" className="hover:text-yellow-400">About</a>
              </nav>
            </div>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition">Sell Car</button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Find Your Perfect Car</h1>
          <p className="mt-4 text-gray-300">Search from hundreds of verified listings across India</p>
          {/* Search Bar */}
          <form onSubmit={handleHeroSearch} className="mt-10 bg-white rounded-xl p-4 flex flex-col md:flex-row gap-4 shadow-xl">
            <input
              placeholder="Brand (BMW, Audi...)"
              className="flex-1 px-4 py-3 rounded-lg text-black outline-none"
              value={brand}
              onChange={e => setBrand(e.target.value)}
            />
            <input
              placeholder="City"
              className="flex-1 px-4 py-3 rounded-lg text-black outline-none"
              value={city}
              onChange={e => setCity(e.target.value)}
            />
            <input
              placeholder="Max Price"
              className="flex-1 px-4 py-3 rounded-lg text-black outline-none"
              value={max}
              onChange={e => setMax(e.target.value)}
              type="number"
              min="0"
            />
            <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-lg transition">Search</button>
          </form>
          {/* Quick Filter Chips */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {["BMW", "Audi", "Mercedes", "Hyundai", "Toyota", "Tata"].map((brand) => (
              <button key={brand} className="px-5 py-2 rounded-full bg-neutral-800 text-gray-200 hover:bg-yellow-500 hover:text-black font-medium transition border border-neutral-700">
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* Premium Category Cards Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Browse by Category</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "SUV", image: "/categories/suv.jpg" },
              { name: "Sedan", image: "/categories/sedan.jpg" },
              { name: "Hatchback", image: "/categories/hatchback.jpg" },
              { name: "Luxury", image: "/categories/luxury.jpg" },
            ].map((cat) => (
              <a
                key={cat.name}
                href={`/marketplace?category=${cat.name.toLowerCase()}`}
                className="relative h-48 rounded-2xl overflow-hidden group"
              >
                <img
                  src={cat.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  loading="lazy"
                  alt={cat.name}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-xl font-semibold text-white">{cat.name}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      {/* Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-fadeInUp">
            {/* Cars fetched from Supabase */}
            {/* Placeholder: No cars data */}
          </div>
        </div>
      </section>
    </div>
  )
}
