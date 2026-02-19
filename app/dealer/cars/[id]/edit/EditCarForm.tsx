"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

export default function EditCarForm({ car }: any) {
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

    await supabase
      .from("cars")
      .update({
        title: form.title.value,
        price: form.price.value,
        brand: form.brand.value,
        model: form.model.value,
        year: form.year.value,
        fuel: form.fuel.value,
        transmission: form.transmission.value,
        km_driven: form.km.value,
      })
      .eq("id", car.id)

    router.push("/dealer/cars")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">Edit Car</h1>

      <input name="title" defaultValue={car.title} className="input" />
      <input name="brand" defaultValue={car.brand} className="input" />
      <input name="model" defaultValue={car.model} className="input" />
      <input name="price" type="number" defaultValue={car.price} className="input" />
      <input name="year" type="number" defaultValue={car.year} className="input" />
      <input name="fuel" defaultValue={car.fuel} className="input" />
      <input name="transmission" defaultValue={car.transmission} className="input" />
      <input name="km" type="number" defaultValue={car.km_driven} className="input" />

      <button className="bg-black text-white px-5 py-2 rounded-lg">
        {loading ? "Updating..." : "Update Car"}
      </button>
    </form>
  )
}
