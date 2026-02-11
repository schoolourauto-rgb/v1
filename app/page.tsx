export default function Home() {
  return <div>Home working</div>;
}

                {/* Social Proof Block */}
                <section className="py-16 text-center">
                  <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-3xl font-bold">52+</p>
                      <p className="text-muted-foreground">Verified Dealers</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">1,284+</p>
                      <p className="text-muted-foreground">Cars Listed</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">12</p>
                      <p className="text-muted-foreground">Cities Covered</p>
                    </div>
                  </div>
                </section>
          {/* Search Bar */}
          <form onSubmit={handleHeroSearch} className="mt-12 bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border rounded-2xl shadow-2xl flex flex-col md:flex-row gap-4 px-6 py-4 w-full max-w-2xl mx-auto hover:scale-[1.02] transition-all duration-200">
            <input
              placeholder="Brand (BMW, Audi...)"
              className="flex-1 rounded-xl px-6 py-4 bg-background text-foreground border border-border focus:ring-2 focus:ring-yellow-500 placeholder:text-muted-foreground transition"
              value={brand}
              onChange={e => setBrand(e.target.value)}
            />
            <input
              placeholder="City"
              className="flex-1 rounded-xl px-6 py-4 bg-background text-foreground border border-border focus:ring-2 focus:ring-yellow-500 placeholder:text-muted-foreground transition"
              value={city}
              onChange={e => setCity(e.target.value)}
            />
            <input
              placeholder="Max Price"
              className="flex-1 rounded-xl px-6 py-4 bg-background text-foreground border border-border focus:ring-2 focus:ring-yellow-500 placeholder:text-muted-foreground transition"
              value={max}
              onChange={e => setMax(e.target.value)}
              type="number"
              min="0"
            />
            <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500">
              Search
            </button>
          </form>
          {/* Quick Filter Chips */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['BMW', 'Audi', 'Mercedes', 'Hyundai', 'Toyota', 'Tata'].map((brand) => (
              <button
                key={brand}
                className="px-5 py-2 rounded-full border border-muted bg-background text-foreground hover:bg-muted transition font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* Premium Category Cards Section */}
      <section className="py-20 bg-background text-foreground transition-colors duration-300 dark:bg-gradient-to-b dark:from-black dark:to-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Browse by Category</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "SUV", image: "/categories/suv.jpg" },
              { name: "Sedan", image: "/categories/sedan.jpg" },
              { name: "Hatchback", image: "/categories/hatchback.jpg" },
              { name: "Luxury", image: "/categories/luxury.jpg" },
            ].map((cat) => (
              <a
                key={cat.name}
                href={`/marketplace?category=${cat.name.toLowerCase()}`}
                className="relative h-48 rounded-2xl overflow-hidden group"
              >
                <img
                  src={cat.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  loading="lazy"
                  alt={cat.name}
                />
                <div className="absolute inset-0 bg-background/80 dark:bg-black/50 flex items-center justify-center">
                  <span className="text-xl font-semibold text-foreground">{cat.name}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      {/* Grid */}
      <section className="py-20 bg-background text-foreground transition-colors duration-300 dark:bg-gradient-to-b dark:from-black dark:to-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-fadeInUp">
            {/* Cars fetched from Supabase */}
            {/* Placeholder: No cars data */}
          </div>
        </div>
      </section>
    </div>
  )
}
