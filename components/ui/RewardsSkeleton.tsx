import { Card } from "@/components/ui/card";

export function RewardsSkeleton() {
  return (
    <Card className="flex flex-col items-center justify-center min-h-[120px]">
      <div className="h-8 w-32 animate-pulse rounded bg-muted mb-2" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-muted mb-1" />
      <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
    </Card>
  );
}
