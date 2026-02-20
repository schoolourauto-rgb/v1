"use client";

import { Car } from "@/types/car";
import HeroSectionClient from "./HeroSectionClient";

interface HeroSectionProps {
  listings: Car[];
}

export default function HeroSection({ listings }: HeroSectionProps) {
  return (
    <section
      aria-label="Hero"
      className="relative min-h-[70vh] flex flex-col justify-center bg-[var(--bg-main)] text-[var(--text-main)] px-4 sm:px-6 py-16 sm:py-24 overflow-hidden rounded-2xl shadow-lg shadow-black/10 border border-[var(--border)]"
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="w-full h-full bg-[radial-gradient(circle_at_60%_40%,rgba(234,179,8,0.08),transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-4">
          Find Your Next Car. <span className="text-[var(--accent)]">No Surprises.</span>
        </h1>

        <p className="text-lg md:text-xl text-[var(--text-muted)] mb-8">
          100% Verified Dealers • Real Inventory
        </p>

        <HeroSectionClient listings={listings} />
      </div>
    </section>
  );
}
