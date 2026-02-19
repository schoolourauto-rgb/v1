import { Card } from "./card";
import { Badge } from "./badge";
import React from "react";

type Car = {
  id: string;
  image: string;
  title: string;
  price: number;
  status: "active" | "sold" | "pending";
};

export function CarsGrid({ cars, className }: { cars: Car[]; className?: string }) {
  return (
    <div className={"grid sm:grid-cols-2 md:grid-cols-3 gap-6 " + (className || "") }>
      {cars.map((car) => (
        <Card key={car.id} className="p-0 overflow-hidden">
          <img
            src={car.image}
            alt={car.title}
            className="w-full h-40 object-cover rounded-t-2xl"
          />
          <div className="p-4 space-y-2">
            <div className="font-semibold">{car.title}</div>
            <div className="text-green-600 font-bold">₹{car.price}</div>
            <Badge variant={car.status === "active" ? "success" : car.status === "sold" ? "danger" : "warning"}>
              {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}
