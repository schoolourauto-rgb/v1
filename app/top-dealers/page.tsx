import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Top Dealers | OurAuto',
  description: 'Discover the top car dealers ranked by trust, listings, and leads. Compete, connect, and grow with OurAuto.',
};

function calculateScore(dealer: any) {
  return (
    (dealer.trust_score ?? 0) * 0.5 +
    (dealer.active_listings ?? 0) * 0.2 +
    (dealer.total_leads ?? 0) * 0.2 -
    (dealer.fraud_flags ?? 0) * 0.1
  );
}

export default async function TopDealersPage() {
  const supabase = await createClient();
  const { data: dealers } = await supabase
    .from('dealers')
    .select('id, name, avatar, trust_score, total_leads, profile_views, active_listings, fraud_flags, verified')
    .eq('suspended', false)
    .order('trust_score', { ascending: false })
    .limit(20);

  const sorted = (dealers ?? [])
    .map((d) => ({ ...d, score: calculateScore(d) }))
    .sort((a, b) => b.score - a.score);

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">🏆 Top Dealers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {sorted.map((dealer, idx) => (
          <div key={dealer.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center relative">
            <span className="absolute top-2 left-2 text-2xl font-bold">#{idx + 1}</span>
            <Image
              src={dealer.avatar || '/logo.png'}
              alt={dealer.name}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full border-4 border-yellow-400 mb-3"
              sizes="(max-width: 768px) 100vw, 80px"
              priority={idx < 3}
            />
            <div className="font-bold text-lg mb-1">{dealer.name}</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-8 h-8 rounded-full border-4 border-green-400 flex items-center justify-center font-bold text-green-700 bg-green-100">{dealer.trust_score}</span>
              {dealer.verified && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">Verified</span>}
            </div>
            <div className="text-xs text-zinc-500 mb-2">Leads: {dealer.total_leads ?? 0} | Listings: {dealer.active_listings ?? 0}</div>
            <div className="text-xs text-zinc-400">Profile Views: {dealer.profile_views ?? 0}</div>
            <div className="mt-2 text-sm font-semibold text-yellow-600">Score: {dealer.score.toFixed(1)}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
