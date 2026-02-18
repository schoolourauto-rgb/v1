export default function CarCardSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-neutral-900 rounded-xl p-4 space-y-4">
      <div className="aspect-[4/3] bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4"></div>
      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2"></div>
    </div>
  )
}
