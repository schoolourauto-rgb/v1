import { createClient } from '@/lib/supabase/server';

export default async function sitemap() {
  const supabase = createClient();

  // Fetch all cars, brands, and cities
  const [{ data: cars }, { data: brandsData }, { data: citiesData }] = await Promise.all([
    supabase.from('cars').select('id'),
    supabase.from('cars').select('brand'),
    supabase.from('cars').select('location'),
  ]);

  const brands = Array.from(new Set((brandsData || []).map((r) => r.brand).filter(Boolean)));
  const cities = Array.from(new Set((citiesData || []).map((r) => r.location).filter(Boolean)));
  const carIds = (cars || []).map((r) => r.id);

  const urls = [
    { url: 'https://ourauto.in/cars', priority: 1 },
    ...brands.map((brand) => ({ url: `https://ourauto.in/cars/${encodeURIComponent(brand)}`, priority: 0.9 })),
    ...cities.map((city) => ({ url: `https://ourauto.in/cars/city/${encodeURIComponent(city)}`, priority: 0.8 })),
    ...carIds.map((id) => ({ url: `https://ourauto.in/cars/${id}`, priority: 0.7 })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (entry) =>
        `<url><loc>${entry.url}</loc><priority>${entry.priority}</priority></url>`
    )
    .join('\n')}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
