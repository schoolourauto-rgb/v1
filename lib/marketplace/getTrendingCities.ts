import { createClient } from '@/lib/supabase/server';

export async function getTrendingCities() {
  const supabase = await createClient();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from('search_logs')
    .select('city')
    .gte('created_at', since);
  const cityCounts: Record<string, number> = {};
  (data || []).forEach((row: any) => {
    if (row.city) cityCounts[row.city] = (cityCounts[row.city] || 0) + 1;
  });
  return Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([city]) => city);
}
