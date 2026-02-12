export default function ListingCardSkeleton() {
  return (
    <div className="animate-pulse bg-card backdrop-blur-xl border border-border rounded-2xl shadow-xl overflow-hidden h-80">
      <div className="relative w-full aspect-[4/3] bg-card/60" />
      <div className="p-5 space-y-2">
        <div className="h-5 bg-card/80 rounded w-2/3" />
        <div className="h-4 bg-card/80 rounded w-1/3" />
        <div className="h-6 bg-card/80 rounded w-1/4" />
        <div className="h-4 bg-card/80 rounded w-1/2 mt-3" />
      </div>
    </div>
  )
}
