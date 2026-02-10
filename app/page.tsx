'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="space-y-8 text-center">
          <h1 className="text-6xl font-bold">OurAuto</h1>
          <p className="text-2xl text-zinc-400">Premium Automotive Marketplace</p>
          <div className="flex gap-4 justify-center mt-12">
            <a
              href="/login"
              className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              Seller Login
            </a>
            <a
              href="/signup"
              className="bg-card text-card-foreground border border-border shadow-lg backdrop-blur-sm font-semibold px-8 py-3 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              Become a Dealer
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
