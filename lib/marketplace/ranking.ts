export function calculateCarScore({
  views,
  leads,
  trust,
  ageDays,
  isFeatured = false,
}: {
  views: number;
  leads: number;
  trust: number;
  ageDays: number;
  isFeatured?: boolean;
}) {
  let score = (
    views * 0.3 +
    leads * 0.5 +
    trust * 0.2 -
    ageDays * 0.1
  );
  if (isFeatured) score += 20;
  // Paid boost logic
  if (typeof arguments[0].boost_expires_at === "string" && new Date(arguments[0].boost_expires_at) > new Date()) {
    score += 40;
  }
  return score;
}
