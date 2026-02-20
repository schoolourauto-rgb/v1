import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Skeleton />
    </div>
  );
}
