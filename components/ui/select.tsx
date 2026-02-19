import { cn } from "@/lib/utils";

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-yellow-500 bg-white dark:bg-black px-4 py-2 text-base text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500",
        className
      )}
      {...props}
    />
  );
}
