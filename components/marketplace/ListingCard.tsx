import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type ListingCardProps = {
  title: string;
  price: string;
  mileage: string;
  imageUrl: string;
};

export function ListingCard({
  title,
  price,
  mileage,
  imageUrl,
}: ListingCardProps) {
  return (
    <Card>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="mt-6">
        <h3 className="line-clamp-1 text-xl font-semibold text-black dark:text-white">
          {title}
        </h3>

        <p className="mt-2 text-base text-black/60 dark:text-gray-300">
          {mileage}
        </p>

        <p className="mt-3 text-2xl font-bold text-black dark:text-white">
          {price}
        </p>

        <div className="mt-6">
          <Button className="w-full" variant="secondary">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
