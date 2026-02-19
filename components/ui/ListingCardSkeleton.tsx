import { Card } from "@/components/ui/card";

export function ListingCardSkeleton() {
  return (
    <Card>
      <div className="aspect-[4/3] w-full animate-pulse rounded-lg bg-muted" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
      </div>
    </Card>
  );
}
