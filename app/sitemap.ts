import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-static"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"
  const supabase = await createClient()

  // Fetch all cars
  const { data: cars } = await supabase.from("cars").select("id, updated_at").eq("status", "active")
  // Fetch all dealers
  const { data: dealers } = await supabase.from("dealers").select("id, updated_at")
  // Fetch all cities
  const { data: cities } = await supabase.from("seo_city_counts").select("city")

  const urls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    // Car detail pages
    ...(cars || []).map((car: Record<string, unknown>) => ({
      url: `${baseUrl}/car/${car.id}`,
      lastModified: typeof car.updated_at === 'string' || car.updated_at instanceof Date ? car.updated_at : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Dealer profile pages
    ...(dealers || []).map((dealer: Record<string, unknown>) => ({
      url: `${baseUrl}/dealer-profile/${dealer.id}`,
      lastModified: typeof dealer.updated_at === 'string' || dealer.updated_at instanceof Date ? dealer.updated_at : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // City listing pages
    ...(cities || []).map((city: Record<string, unknown>) => {
      const cityName = typeof city.city === 'string' ? city.city : '';
      return {
        url: `${baseUrl}/cars/${encodeURIComponent(cityName)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      };
    }),
  ]

  return urls
}
