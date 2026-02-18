"use client"


import { useState, useEffect } from 'react'
import LeadForm from './[id]/LeadForm'
import { CarWithImages } from '@/types'
import { User } from '@supabase/supabase-js'
import { getSimilarCars } from '@/lib/marketplace/getSimilarCars'
import CarCard from '@/components/CarCard'

interface CarDetailProps {
  car: CarWithImages & { profiles?: { mobile?: string; business_name?: string } }
  user: User | null
}

export default function CarDetailClient({ car, user }: CarDetailProps) {
  const images = car.car_images || [];
  const [selected, setSelected] = useState(images[0]?.image_url);
  const dealerMobile = car.profiles?.mobile;
  const dealerName = car.profiles?.business_name;
  const [similar, setSimilar] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getSimilarCars(car);
      setSimilar(res);
    })();
  }, [car]);

  // Price formatting
  const formatPrice = (price: number) =>
    price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen bg-background text-foreground p-10 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Gallery */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{car.title}</h1>
          {selected && (
            <img
              src={selected}
              className="w-full h-96 object-cover rounded-xl bg-muted"
            />
          )}
          {/* Thumbnails */}
          <div className="flex gap-3 mt-4">
            {images.map((img: { image_url: string }, index: number) => (
              <img
                key={index}
                src={img.image_url}
                onClick={() => setSelected(img.image_url)}
                className="w-24 h-24 object-cover rounded cursor-pointer border border-border bg-muted"
              />
            ))}
          </div>
        </div>
        {/* Specs + Price + Seller */}
        <div>
          <p className="text-2xl text-yellow-500 font-bold mb-4">{formatPrice(car.price)}</p>
          {/* WhatsApp Share Button */}
          {car && (
            (() => {
              const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/car/${car.id}`;
              const whatsappMessage = `🚗 ${car.year} ${car.brand} ${car.model}\n💰 ₹${car.price}\n📍 ${car.city}\n\nView full details:\n${shareUrl}`;
              return (
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold inline-block mb-4"
                >
                  Share on WhatsApp
                </a>
              );
            })()
          )}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* ...existing code... */}
          </div>
          <div className="mb-6">
            <span className="text-sm text-muted-foreground">Description</span>
            <div className={!user ? 'blur-md mt-2' : 'mt-2'}>{car.description || 'No description provided.'}</div>
            {!user && (
              <p className="text-primary mt-4">Login to view full details</p>
            )}
          </div>
          {/* Seller Info */}
          <div className="bg-card rounded-xl p-4 mb-6">
            <span className="text-sm text-muted-foreground">Seller</span>
            <div className="text-base font-medium mt-1">{dealerName || 'Dealer'}</div>
            {dealerMobile && (
              <a
                href={`https://wa.me/91${dealerMobile}?text=${encodeURIComponent(
                  `I'm interested in ${car.title}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                Contact Dealer on WhatsApp
              </a>
            )}
          </div>
          {/* Lead Form */}
          <div className="bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Contact Seller</h3>
            {car.id && car.dealer_id && (
              <LeadForm carId={car.id} sellerId={car.dealer_id} />
            )}
          </div>
        </div>
      </div>
      {/* Related Cars */}
      <div className="mt-12">
        <span className="text-lg font-semibold mb-4 block">Similar Cars</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {similar.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
}
