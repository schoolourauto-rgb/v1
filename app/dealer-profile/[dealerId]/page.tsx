import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CarCard } from "@/components/CarCard";

export default async function DealerProfilePage({ params }: { params: { dealerId: string } }) {
  const supabase = await createClient();
  const { data: dealer } = await supabase
    .from("dealers")
    .select("id, dealership_name, city, verified, trust_score, created_at, profile_views, total_leads")
    .eq("id", params.dealerId)
    .maybeSingle();
  if (!dealer) return notFound();

  const { data: cars } = await supabase
    .from("cars")
    .select("id, title, price, city, car_images(image_url), views, leads, created_at, updated_at, is_featured")
    .eq("dealer_id", params.dealerId)
    .eq("status", "active");

  // Trust meter color
  let trustColor = 'bg-red-500';
  if (dealer.trust_score > 70) trustColor = 'bg-green-500';
  else if (dealer.trust_score > 30) trustColor = 'bg-orange-400';

  // Badges
  const badges = [];
  if (dealer.trust_score > 80) badges.push('Elite Dealer');
  if ((cars?.length ?? 0) >= 20) badges.push('Power Seller');
  if (dealer.verified) badges.push('Verified Dealer');
  if (dealer.created_at && (new Date().getFullYear() - new Date(dealer.created_at).getFullYear() >= 1)) badges.push('Trusted Since');

  // Stats
  const totalListings = cars?.length || 0;
  const totalLeads = dealer.total_leads ?? 0;
  const memberSince = dealer.created_at ? new Date(dealer.created_at).toLocaleDateString() : '-';
  const cityRank = 1; // Placeholder, implement city rank logic if needed
  const profileViews = dealer.profile_views ?? 0;

  // WhatsApp share
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dealer-profile/${dealer.id}`;
  const whatsappMessage = `Check out this dealer on OurAuto!\n${dealer.dealership_name} in ${dealer.city}\nTrust Score: ${dealer.trust_score}\n${shareUrl}`;

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">{dealer.dealership_name}</h1>
        <div className={`w-32 h-4 rounded-full ${trustColor} relative`}>
          <div className="absolute left-1/2 -translate-x-1/2 text-xs text-white font-bold top-0">Trust {dealer.trust_score}</div>
        </div>
        {badges.map((badge) => (
          <Badge key={badge}>{badge}</Badge>
        ))}
      </div>
      <div className="mb-4 text-gray-600 flex flex-wrap gap-4">
        <span>City: {dealer.city || "-"}</span>
        <span>Total Listings: {totalListings}</span>
        <span>Total Leads: {totalLeads}</span>
        <span>Profile Views: {profileViews}</span>
        <span>Member Since: {memberSince}</span>
        <span>City Rank: {cityRank}</span>
      </div>
      <div className="mb-4">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold inline-block"
        >
          Share Profile on WhatsApp
        </a>
      </div>
      <h2 className="text-xl font-semibold mb-2">Active Cars</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cars?.map((car: any) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </main>
  );
}
