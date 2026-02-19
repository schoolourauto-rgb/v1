"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

export default function LeadForm({ carId, dealerId }: { carId: string, dealerId: string }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    const form = e.target

    await supabase.from("leads").insert({
      car_id: carId,
      dealer_id: dealerId,
      name: form.name.value,
      phone: form.phone.value,
      message: form.message.value,
      status: "new",
    })

    alert("Enquiry sent successfully!")
    form.reset()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        name="name"
        placeholder="Your Name"
        required
        className="input"
      />
      <input
        name="phone"
        placeholder="Phone Number"
        required
        className="input"
      />
      <textarea
        name="message"
        placeholder="Message"
        className="input"
      />
      <button className="bg-black text-white px-4 py-2 rounded-lg">
        {loading ? "Sending..." : "Send Enquiry"}
      </button>
    </form>
  )
}
