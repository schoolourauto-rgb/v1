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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 animate-in fade-in duration-500">
      {/* Premium Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col justify-center bg-background text-foreground transition-colors duration-300 dark:bg-gradient-to-b dark:from-black dark:via-neutral-900 dark:to-black pt-24 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.08),transparent_60%)] before:pointer-events-none">
        <div className="absolute inset-0">
          <div className="relative w-full h-full aspect-[16/7]">
            <Image
              src="/hero-car.jpg"
              alt="Luxury Cars"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-30"
              onError={(e) => { (e.target as HTMLImageElement).src = "/categories/fallback.jpg"; }}
            />
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center flex flex-col items-center justify-center min-h-[60vh]">
                {/* Customer Care Strip */}
                <div className="w-full bg-card border-t border-border py-3 flex justify-center items-center mt-4">
                  <span className="text-sm text-muted-foreground">
                    Customer Care:{" "}
                    <a href="tel:9408000012" className="font-medium text-foreground hover:text-yellow-500 transition">
                      +91 94080 00012
                    </a>
                  </span>
                </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Buy Cars from Verified Dealers Only
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            No individuals. No spam. Only trusted car showrooms with real inventory.
          </p>
                {/* Trust Section */}
                <section className="py-16 md:py-24 border-t border-border">
                  <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-10">
                      Why OurAuto?
                    </h2>
                    <div className="grid md:grid-cols-4 gap-8 text-sm md:text-base">
                      <div>✅ Verified showroom dealers only</div>
                      <div>✅ Real, curated inventory</div>
                      <div>✅ Direct dealer contact</div>
                      <div>✅ No middlemen or fake listings</div>
                    </div>
                  </div>
                </section>

                {/* Social Proof Block */}
                <section className="py-16 text-center">
                  <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-3xl font-bold">52+</p>
                      <p className="text-muted-foreground">Verified Dealers</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">1,284+</p>
                      <p className="text-muted-foreground">Cars Listed</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">12</p>
                      <p className="text-muted-foreground">Cities Covered</p>
                    </div>
                  </div>
                </section>
          {/* Search Bar */}
          <form onSubmit={handleHeroSearch} className="mt-12 bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border rounded-2xl shadow-2xl flex flex-col md:flex-row gap-4 px-6 py-4 w-full max-w-2xl mx-auto hover:scale-[1.02] transition-all duration-200">
            <input
              placeholder="Brand (BMW, Audi...)"
              className="flex-1 rounded-xl px-6 py-4 bg-background text-foreground border border-border focus:ring-2 focus:ring-yellow-500 placeholder:text-muted-foreground transition"
              value={brand}
              onChange={e => setBrand(e.target.value)}
            />
            <input
              placeholder="City"
              className="flex-1 rounded-xl px-6 py-4 bg-background text-foreground border border-border focus:ring-2 focus:ring-yellow-500 placeholder:text-muted-foreground transition"
              value={city}
              onChange={e => setCity(e.target.value)}
            />
            <input
              placeholder="Max Price"
              className="flex-1 rounded-xl px-6 py-4 bg-background text-foreground border border-border focus:ring-2 focus:ring-yellow-500 placeholder:text-muted-foreground transition"
              value={max}
              onChange={e => setMax(e.target.value)}
              type="number"
              min="0"
            />
            <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500">
              Search
            </button>
          </form>
          {/* Quick Filter Chips */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['BMW', 'Audi', 'Mercedes', 'Hyundai', 'Toyota', 'Tata'].map((brand) => (
              <button
                key={brand}
                className="px-5 py-2 rounded-full border border-muted bg-background text-foreground hover:bg-muted transition font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* Premium Category Cards Section */}
      <section className="py-20 bg-background text-foreground transition-colors duration-300 dark:bg-gradient-to-b dark:from-black dark:to-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Browse by Category</h2>
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
                <div className="absolute inset-0 bg-background/80 dark:bg-black/50 flex items-center justify-center">
                  <span className="text-xl font-semibold text-foreground">{cat.name}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      {/* Grid */}
      <section className="py-20 bg-background text-foreground transition-colors duration-300 dark:bg-gradient-to-b dark:from-black dark:to-neutral-900">
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
