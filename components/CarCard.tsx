"use client";

import { Heart, MessageCircle, Bookmark } from "lucide-react";

export default function CarCard({ car }: { car: any }) {
  return (
    <div className="rounded-2xl card-bg soft-border hover:scale-[1.03] transition overflow-hidden relative flex flex-col">
      {/* Hot Deal Badge */}
      {(car.views > 50 || car.leads > 5) && (
        <span className="absolute top-2 left-2 bg-accent text-accentFg text-xs px-2 py-1 rounded-full">
          🔥 Hot Deal
        </span>
      )}
      {/* Dealer header */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <img
          src={car.dealer.avatar}
          alt={car.dealer.name}
          className="w-10 h-10 rounded-full border-2 border-accent"
        />
        <div>
          <div className="font-semibold text-foreground text-sm cursor-pointer hover:underline">
            {car.dealer.name}
            <span className="ml-2 text-xs bg-accent text-accentFg rounded px-2 py-0.5 font-bold">{car.dealer.trust}%</span>
          </div>
          <div className="text-foreground/60 text-xs">{car.city}</div>
        </div>
      </div>

      {/* Car image */}
      <div className="relative mt-4 flex justify-center">
        <img
          src={car.image}
          alt={car.title}
          className="w-full max-w-xs aspect-[4/5] object-cover rounded-2xl soft-border"
        />
        {/* Price badge */}
        <div className="absolute top-4 left-4 bg-accent text-accentFg font-bold px-4 py-2 rounded-2xl text-lg soft-border">
          ₹{car.price.toLocaleString()}
        </div>
      </div>

      {/* Car info */}
      <div className="px-4 pt-4 pb-2">
        <div className="font-bold text-lg text-foreground mb-1">
          {car.brand} {car.model} <span className="text-foreground/60 font-normal">({car.year})</span>
        </div>
        <div className="text-foreground/60 text-sm mb-2">
          {car.fuel_type} • {car.transmission}
        </div>
        <div className="text-foreground/60 text-xs mb-2">{car.location}</div>
        <div className="flex gap-3 mb-2 justify-center">
          <button className="flex items-center gap-1 bg-background text-foreground px-3 py-1 rounded-2xl soft-border hover:bg-accent hover:text-accentFg transition">
            <Heart size={18} />
          </button>
          <button className="flex items-center gap-1 bg-background text-foreground px-3 py-1 rounded-2xl soft-border hover:bg-accent hover:text-accentFg transition">
            <MessageCircle size={18} />
          </button>
          <button className="flex items-center gap-1 bg-background text-foreground px-3 py-1 rounded-2xl soft-border hover:bg-accent hover:text-accentFg transition">
            <Bookmark size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
