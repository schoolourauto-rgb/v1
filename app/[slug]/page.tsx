


if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error("Supabase ENV variables missing");
  export default function LocationLandingPage() {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-semibold">Service temporarily unavailable</h1>
      </div>
    );
  }
  // Return early so the rest of the file is not executed
  // This export will be used if ENV is missing
  // No 500 will be thrown
}
import { createClient } from '@/lib/supabase/server'
import CarCard from '@/components/marketplace/CarCard'
import { CarWithImages } from '@/types'

function parseSlug(slug: string) {
  let brand = ''
  let city = ''
  let category = ''

  if (slug.startsWith('cars-in-')) {
    city = slug.replace('cars-in-', '')
  } else if (slug.includes('-in-')) {
    const parts = slug.split('-in-')
    if (['suv', 'sedan', 'hatchback', 'luxury'].includes(parts[0].toLowerCase())) {
      category = parts[0]
      city = parts[1]
    } else {
      brand = parts[0]
      city = parts[1]
    }
  }
  return { brand, city, category }
}

export default function TestPage() {
  return <div>Slug route working</div>;
}
