export default function ListingCardSkeleton() {
  return (
    <div className="animate-pulse bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 h-80">
      <div className="relative w-full aspect-[4/3] bg-neutral-800" />
      <div className="p-5 space-y-2">
        <div className="h-5 bg-neutral-700 rounded w-2/3" />
        <div className="h-4 bg-neutral-700 rounded w-1/3" />
        <div className="h-6 bg-neutral-700 rounded w-1/4" />
        <div className="h-4 bg-neutral-700 rounded w-1/2 mt-3" />
      </div>
    </div>
  )
}
