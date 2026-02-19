"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

export default function AddCarPage() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    const form = e.target

    const { data: userData } = await supabase.auth.getUser()

    await supabase.from("cars").insert({
      dealer_id: userData.user?.id,
      title: form.title.value,
      price: form.price.value,
      brand: form.brand.value,
      model: form.model.value,
      year: form.year.value,
      fuel: form.fuel.value,
      transmission: form.transmission.value,
      km_driven: form.km.value,
    })

    router.push("/dealer/cars")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">Add Car</h1>

      <input name="title" placeholder="Title" required className="input" />
      <input name="brand" placeholder="Brand" className="input" />
      <input name="model" placeholder="Model" className="input" />
      <input name="price" type="number" placeholder="Price" className="input" />
      <input name="year" type="number" placeholder="Year" className="input" />
      <input name="fuel" placeholder="Fuel Type" className="input" />
      <input name="transmission" placeholder="Transmission" className="input" />
      <input name="km" type="number" placeholder="KM Driven" className="input" />

      <button
        disabled={loading}
        className="bg-black text-white px-5 py-2 rounded-lg"
      >
        {loading ? "Adding..." : "Add Car"}
      </button>
    </form>
  )
}
