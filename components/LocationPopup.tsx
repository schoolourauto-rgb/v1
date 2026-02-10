"use client"

import { useEffect, useState } from "react"

export default function LocationPopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hasLocation = localStorage.getItem("user_location")

    if (!hasLocation) {
      setShow(true)
    }
  }, [])

  const enableLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const data = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        localStorage.setItem("user_location", JSON.stringify(data))
        setShow(false)
      },
      () => {
        alert("Location permission denied")
      }
    )
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-card border border-border rounded-xl p-4 shadow-lg z-50">
      <h3 className="font-semibold text-lg mb-2">
        Enable Location
      </h3>
      <p className="text-muted-foreground text-sm mb-4">
        Show cars near your area for better results.
      </p>
      <button
        onClick={enableLocation}
        className="w-full bg-primary text-primary-foreground py-2 rounded-lg"
      >
        Allow Location
      </button>
    </div>
  )
}
