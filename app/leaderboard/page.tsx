import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dealer Leaderboard',
  description: 'Top trusted dealers on ourauto.in',
};

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: dealers } = await supabase
    .from('dealers')
    .select('id, name, trust_score, referral_code')
    .order('trust_score', { ascending: false })
    .limit(20);

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">🏆 Dealer Leaderboard</h1>
      <ol className="space-y-4">
        {dealers?.map((dealer, idx) => (
          <li key={dealer.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <span className="text-2xl font-bold w-8 text-center">
              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
            </span>
            <div className="flex-1">
              <div className="font-semibold text-lg">{dealer.name || 'Dealer'}</div>
              <div className="text-sm text-gray-500">Trust Score: {dealer.trust_score}</div>
              <div className="text-xs text-gray-400">Referral: {dealer.referral_code}</div>
              <div className="text-xs mt-1">
                {idx === 0 && 'Top Trusted Dealer'}
                {idx === 1 && 'Rising Dealer'}
                {idx === 2 && 'Verified Pro'}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
