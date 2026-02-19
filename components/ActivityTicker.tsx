"use client"
import { useEffect, useState } from "react"

const messages = [
  "🔥 Someone just viewed a Swift in Surat",
  "📞 3 new enquiries in last 10 mins",
  "🏆 A dealer unlocked Gold badge",
  "🚀 Featured car just boosted",
]

export default function ActivityTicker() {
  const [index, setIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-black text-white text-xs py-2 text-center tracking-wide">
      {mounted ? messages[index] : messages[0]}
    </div>
  )
}
