
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="OurAuto"
              width={320}
              height={120}
              priority
              className="object-contain"
            />
          </div>
          <p className="mt-6 text-lg text-gray-400">
            Premium Automotive Marketplace
          </p>
          <div className="mt-8 flex gap-4">
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
        </section>
      </div>
    </div>
  )
}
