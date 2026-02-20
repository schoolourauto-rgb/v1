import { ListingCardSkeleton } from "@/components/ui/ListingCardSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen p-4 sm:p-6 flex items-center justify-center">
      <ListingCardSkeleton />
    </div>
  );
}
