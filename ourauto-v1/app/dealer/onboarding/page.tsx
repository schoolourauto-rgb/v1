'use client'

import Link from 'next/link'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome to OurAuto 🎉</h1>
            <p className="text-zinc-400 text-lg">Get your dealership up and running in minutes</p>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-800 p-8 rounded-2xl space-y-4">
            <h2 className="text-2xl font-semibold text-yellow-400">Next Step: Add Your First Car</h2>
            <p className="text-zinc-300">
              To unlock the marketplace and start selling, you need to list a minimum of <strong>6 cars</strong> on your
              profile.
            </p>

            <div className="bg-black/50 p-6 rounded-xl space-y-3 text-left">
              <div className="flex gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-semibold">Step 1: Add Car Details</p>
                  <p className="text-sm text-zinc-400">Title, brand, model, price, mileage, etc.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">📸</span>
                <div>
                  <p className="font-semibold">Step 2: Upload Minimum 5 Photos</p>
                  <p className="text-sm text-zinc-400">High-quality images help you sell faster</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <p className="font-semibold">Step 3: List on Marketplace</p>
                  <p className="text-sm text-zinc-400">Your car goes live when you publish it</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/dealer/add-car"
              className="block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-lg transition text-lg"
            >
              Add Your First Car
            </Link>
            <Link
              href="/dealer/dashboard"
              className="block bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-8 py-4 rounded-lg transition"
            >
              View Dashboard
            </Link>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl text-left space-y-2">
            <p className="text-sm text-zinc-400">
              <strong>💡 Pro Tip:</strong> Professional photos, detailed descriptions, and competitive pricing help you
              get more inquiries.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

