"use client"

import { useEffect, useState } from "react"

export default function InstallAppPopup() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      console.log("App installed")
    }

    setDeferredPrompt(null)
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-card border border-border rounded-xl p-4 shadow-lg z-50">
      <h3 className="font-semibold mb-2">
        Install OurAuto App
      </h3>
      <p className="text-sm text-muted-foreground mb-3">
        Install app for faster access & better experience.
      </p>
      <button
        onClick={handleInstall}
        className="w-full bg-primary text-primary-foreground py-2 rounded-lg"
      >
        Install Now
      </button>
    </div>
  )
}
