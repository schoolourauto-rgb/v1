"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function CarFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [brand, setBrand] = useState(searchParams.get("brand") || "")
  const [fuel, setFuel] = useState(searchParams.get("fuel") || "")
  const [transmission, setTransmission] = useState(
    searchParams.get("transmission") || ""
  )
  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || ""
  )
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  )
  const [sort, setSort] = useState(searchParams.get("sort") || "")

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (brand) params.set("brand", brand)
    if (fuel) params.set("fuel", fuel)
    if (transmission) params.set("transmission", transmission)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    if (sort) params.set("sort", sort)

    router.push(`/cars?${params.toString()}`)
  }

  const resetFilters = () => {
    router.push("/cars")
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Filters</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <input
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={fuel}
          onChange={(e) => setFuel(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Fuel</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
        </select>

        <select
          value={transmission}
          onChange={(e) => setTransmission(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Transmission</option>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Sort</option>
          <option value="price-low">Price Low → High</option>
          <option value="price-high">Price High → Low</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          onClick={applyFilters}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>

        <button
          onClick={resetFilters}
          className="border px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
