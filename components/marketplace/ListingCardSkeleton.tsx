export default function ListingCardSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-black rounded-2xl shadow-lg overflow-hidden h-80">
      <div className="relative w-full aspect-[4/3] bg-neutral-100 dark:bg-neutral-900" />
      <div className="p-6 space-y-3">
        <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
        <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
        <div className="h-7 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
        <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2 mt-3" />
      </div>
    </div>
  )
}
