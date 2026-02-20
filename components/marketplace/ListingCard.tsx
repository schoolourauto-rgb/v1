import Image from "next/image";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ borderRadius: '1rem' }}
    >
      <Card className="flex flex-col bg-[var(--card)] rounded-2xl shadow-modern transition overflow-hidden p-0 w-full max-w-full sm:max-w-md mx-auto">
      <div className="relative w-full h-0 pb-[60%] bg-[var(--background)] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={false}
          onLoadingComplete={img => img.setAttribute("data-loaded", "true")}
        />
        <span className="absolute top-4 left-4 bg-[var(--accent)] text-[var(--text)] text-xs font-bold px-3 py-1 rounded-2xl shadow-modern z-10">🔥 Hot Deal</span>
      </div>
      <div className="flex flex-col justify-between flex-1 p-4 gap-2">
        <h3 className="text-xl font-semibold line-clamp-1 text-[var(--text)] mb-1" style={{fontSize:'16px'}}>{title}</h3>
        <div className="flex flex-wrap items-center gap-3 text-base text-[var(--text)]">
          <span className="text-2xl font-bold text-[var(--text)]" style={{fontSize:'18px'}}>{price}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text)] opacity-60 mt-1">
          <span style={{fontSize:'14px'}}>{mileage}</span>
        </div>
        <div className="mt-4">
          <Button className="w-full sm:w-auto" variant="outline">
            View Details
          </Button>
        </div>
      </div>
      </Card>
    </motion.div>
  );
}
