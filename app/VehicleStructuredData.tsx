import { Car } from "@/types/car";

export function VehicleStructuredData({ listings }: { listings: Car[] }) {
  // Only include a few cars for SEO (avoid huge JSON-LD)
  const vehicles = listings.map((car) => ({
    "@type": "Vehicle",
    "name": car.title,
    "brand": car.make,
    "model": car.model,
    "vehicleModelDate": car.year,
    "fuelType": car.fuel,
    "offers": {
      "@type": "Offer",
      "price": car.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    },
    "image": car.image,
    "url": `https://ourauto.in/car/${car.id}`,
    "vehicleTransmission": car.transmission,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": car.location
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
