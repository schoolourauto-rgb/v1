'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="space-y-8 text-center">
          <h1 className="text-6xl font-bold">OurAuto</h1>
          <p className="text-2xl text-zinc-400">Premium Automotive Marketplace</p>
          <div className="flex gap-4 justify-center mt-12">
            <a
              href="/login"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-lg transition"
            >
              Seller Login
            </a>
            <a
              href="/signup"
              className="bg-zinc-800 border border-zinc-700 hover:border-yellow-500 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              Become a Dealer
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
