

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/marketplace/HeroSection";
import { Section } from "@/components/layout/Section";
import { CarsGrid } from "@/components/ui/cars-grid";
import Link from "next/link";
import { VehicleStructuredData } from "./VehicleStructuredData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OurAuto – Buy & Sell Cars in India",
  description: "Buy and sell verified used cars from trusted showroom dealers across India. 100% verified inventory, no spam, no fake listings.",
  openGraph: {
    title: "OurAuto – Buy & Sell Cars in India",
    description: "Buy and sell verified used cars from trusted showroom dealers across India. 100% verified inventory, no spam, no fake listings.",
    url: "https://ourauto.in/",
    siteName: "OurAuto",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OurAuto – Buy & Sell Cars in India",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1",
  alternates: {
    canonical: "https://ourauto.in/",
  },
};

async function getFeaturedCars() {
  // SSR fetch for featured cars (mocked for now)
  // Replace with real fetch if needed
  return [
    {
      id: "1",
      image: "/cars/featured1.jpg",
      title: "2022 Honda City ZX",
      price: 1249000,
      status: "active" as const,
      brand: "Honda",
      model: "City ZX",
      year: 2022,
      dealer_id: "dealer1",
    },
    {
      id: "2",
      image: "/cars/featured2.jpg",
      title: "2021 Maruti Suzuki Swift",
      price: 749000,
      status: "active" as const,
      brand: "Maruti Suzuki",
      model: "Swift",
      year: 2021,
      dealer_id: "dealer2",
    },
    {
      id: "3",
      image: "/cars/featured3.jpg",
      title: "2023 Hyundai Creta SX",
      price: 1599000,
      status: "active" as const,
      brand: "Hyundai",
      model: "Creta SX",
      year: 2023,
      dealer_id: "dealer3",
    },
  ];
}

export default async function HomePage() {
  const featuredCars = await getFeaturedCars();
  return (
    <>
      <Header />
      <main className="bg-background text-foreground min-h-screen">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
          <HeroSection listings={featuredCars} />
        </div>

        {/* Search/Browse Cars Section */}
        <Section title="Browse Cars" className="bg-[var(--bg)]">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            <p className="text-lg font-medium">Browse verified cars from trusted dealers across India.</p>
            <Link href="/marketplace" className="btn btn-primary px-6 py-3 rounded-xl font-semibold text-base">Browse Marketplace</Link>
          </div>
          <CarsGrid cars={featuredCars} />
        </Section>

        {/* Sell Your Car CTA */}
        <Section className="bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl shadow-lg max-w-5xl mx-auto mt-16 mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to sell your car?</h2>
          <p className="mb-6 text-lg">List your car with OurAuto and reach verified buyers instantly.</p>
          <Link href="/sell" className="btn btn-primary px-8 py-3 rounded-xl font-semibold text-lg">Sell Your Car</Link>
        </Section>

        {/* Structured Data for SEO */}
        <VehicleStructuredData listings={featuredCars} />
      </main>
      <Footer />
    </>
  );
}
