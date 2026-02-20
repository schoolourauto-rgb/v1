import { Card } from "@/components/ui/card";

export function DashboardStatsSkeleton() {
  return (
    <Card className="flex flex-col items-center justify-center min-h-[120px]">
      <div className="h-8 w-20 animate-pulse rounded bg-muted mb-2" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
    </Card>
  );
}
