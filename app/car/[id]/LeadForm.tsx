"use client"

import { useState } from "react"

export default function LeadForm({ carId, sellerId }: { carId: string, sellerId: string }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    // Basic validation
    if (!name || !phone) {
      setError("Name and phone are required.")
      setLoading(false)
      return
    }

    // Prevent spam: simple honeypot
    if (message.includes("http") || message.length > 500) {
      setError("Invalid message.")
      setLoading(false)
      return
    }

    // Call API route
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carId, sellerId, name, email, phone, message })
    })
    const data = await res.json()
    if (data.success) {
      setSuccess(true)
      setName("")
      setEmail("")
      setPhone("")
      setMessage("")
    } else {
      setError(data.error || "Failed to submit inquiry.")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="text" placeholder="Your Name" className="w-full p-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground transition-colors duration-300" value={name} onChange={e => setName(e.target.value)} />
      <input type="email" placeholder="Your Email" className="w-full p-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground transition-colors duration-300" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="tel" placeholder="Your Phone" className="w-full p-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground transition-colors duration-300" value={phone} onChange={e => setPhone(e.target.value)} />
      <textarea placeholder="Message" className="w-full p-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground transition-colors duration-300" rows={3} value={message} onChange={e => setMessage(e.target.value)} />
      <button type="submit" className="w-full py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mt-2" disabled={loading}>{loading ? "Sending..." : "Send Inquiry"}</button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      {success && <div className="text-green-500 text-sm mt-2">Inquiry sent successfully!</div>}
    </form>
  )
}
