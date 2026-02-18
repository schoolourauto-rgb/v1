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
    ...(cars || []).map((car: any) => ({
      url: `${baseUrl}/car/${car.id}`,
      lastModified: car.updated_at || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Dealer profile pages
    ...(dealers || []).map((dealer: any) => ({
      url: `${baseUrl}/dealer-profile/${dealer.id}`,
      lastModified: dealer.updated_at || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // City listing pages
    ...(cities || []).map((city: any) => ({
      url: `${baseUrl}/cars/${encodeURIComponent(city.city)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ]

  return urls
}
