'use client'

import Link from 'next/link'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted text-foreground transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome to OurAuto 🎉</h1>
            <p className="text-muted-foreground text-lg">Get your dealership up and running in minutes</p>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-800 p-8 rounded-2xl shadow-lg backdrop-blur-sm space-y-4">
            <h2 className="text-2xl font-semibold text-yellow-400">Next Step: Add Your First Car</h2>
            <p className="text-muted-foreground">
              To unlock the marketplace and start selling, you need to list a minimum of <strong>6 cars</strong> on your
              profile.
            </p>

            <div className="bg-background dark:bg-black/50 p-6 rounded-2xl space-y-3 text-left border border-border transition-colors duration-300">
              <div className="flex gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-semibold">Step 1: Add Car Details</p>
                  <p className="text-sm text-muted-foreground">Title, brand, model, price, mileage, etc.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">📸</span>
                <div>
                  <p className="font-semibold">Step 2: Upload Minimum 5 Photos</p>
                  <p className="text-sm text-muted-foreground">High-quality images help you sell faster</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <p className="font-semibold">Step 3: List on Marketplace</p>
                  <p className="text-sm text-muted-foreground">Your car goes live when you publish it</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/dealer/add-car"
              className="block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-2xl shadow-lg backdrop-blur-sm border border-border transition text-lg hover:scale-[1.02] active:scale-95 duration-200"
            >
              Add Your First Car
            </Link>
            <Link
              href="/dealer/dashboard"
              className="block bg-background dark:bg-zinc-800 dark:hover:bg-zinc-700 text-foreground font-semibold px-8 py-4 rounded-2xl shadow-lg backdrop-blur-sm border border-border transition-colors duration-300 hover:scale-[1.02] active:scale-95 duration-200"
            >
              View Dashboard
            </Link>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl text-left space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>💡 Pro Tip:</strong> Professional photos, detailed descriptions, and competitive pricing help you
              get more inquiries.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

