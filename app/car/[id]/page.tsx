import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CarDetail from '../CarDetailClient'

export default async function Page({ params }: any) {
  const supabase = createClient()

  const { data: car } = await supabase
    .from('cars')
    .select(`
      *,
      car_images(image_url),
      profiles(mobile, business_name)
    `)
    .eq('id', params.id)
    .single()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-zinc-400">Car not found</p>
          <Link href="/marketplace" className="text-yellow-500 hover:underline">
            Back to marketplace
          </Link>
        </div>
      </div>
    )
  }

  return <CarDetail car={car} user={user} />
}
