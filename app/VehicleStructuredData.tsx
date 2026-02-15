import { Car } from "@/types/car";

export function VehicleStructuredData({ listings }: { listings: Car[] }) {
  // Only include a few cars for SEO (avoid huge JSON-LD)
  const vehicles = listings.map((car) => ({
    "@type": "Vehicle",
    "name": car.title,
    "brand": car.brand,
    "model": car.model,
    "vehicleModelDate": car.year,
    "fuelType": car.fuel_type,
    "offers": {
      "@type": "Offer",
      "price": car.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    },
    "image": (car as any).image || (car as any).car_images?.[0]?.image_url || '/logo.png',
    "url": `https://ourauto.in/car/${car.id}`,
    "vehicleTransmission": car.transmission,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": (car as any).location || (car as any).city || 'Unknown'
    }
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": vehicles.map((v, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": v
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      key="vehicle-jsonld"
    />
  );
}
