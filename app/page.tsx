
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-black via-neutral-900 to-black">

          {/* Responsive Logo */}
          <div className="w-full flex justify-center">
            <div className="relative w-[220px] sm:w-[280px] md:w-[340px] lg:w-[400px] aspect-[3/1]">
              <Image
                src="/logo.png"
                alt="OurAuto"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>

          {/* Subtitle */}
          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-xl">
            Premium Automotive Marketplace
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition shadow-lg hover:shadow-xl">
              Seller Login
            </button>

            <button className="px-8 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition">
              Become a Dealer
            </button>
          </div>

        </section>
      </div>
    </div>
  )
}
