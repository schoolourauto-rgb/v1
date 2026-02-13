import type { Car } from "@/types/car";
import type { ParsedFilters } from "./parseFilters";

export function buildJsonLd(listings: Car[], filters: ParsedFilters) {
  // Homepage or list page
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: listings.slice(0, 6).map((car, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Vehicle",
        name: car.title,
        brand: {
          "@type": "Brand",
          name: car.make,
        },
        model: car.model,
        vehicleModelDate: car.year,
        fuelType: car.fuel,
        vehicleTransmission: car.transmission,
        offers: {
          "@type": "Offer",
          price: car.price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        },
        ...(filters.city && { address: { addressLocality: filters.city } }),
      },
    })),
  };
}
