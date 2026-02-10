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
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="mt-4">
        <h3 className="line-clamp-1 text-lg font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          {mileage}
        </p>

        <p className="mt-2 text-xl font-bold">
          {price}
        </p>

        <div className="mt-4">
          <Button className="w-full">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
