import { createClient } from '@/lib/supabase/server'

export default async function sitemap() {
  const supabase = createClient()

  // Fetch all cars
  const { data: cars } = await supabase
    .from('cars')
    .select('id')

  // Fetch all dealers
  const { data: dealers } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'dealer')

  // Sitemap entries
  const urls = [
    { url: 'https://ourauto.in', priority: 1 },
    { url: 'https://ourauto.in/marketplace', priority: 0.9 },
    ...cars?.map((car: any) => ({ url: `https://ourauto.in/cars/${car.id}`, priority: 0.8 })) || [],
    ...dealers?.map((dealer: any) => ({ url: `https://ourauto.in/dealer/${dealer.id}`, priority: 0.7 })) || [],
  ]

  // XML generation
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (entry) =>
        `<url><loc>${entry.url}</loc><priority>${entry.priority}</priority></url>`
    )
    .join('\n')}\n</sitemapindex>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
