import React from "react";
import { CarsGrid } from "./cars-grid";

type Car = {
  id: string;
  image: string;
  title: string;
  price: number;
  status: "active" | "sold" | "pending";
};

export function DashboardCars({ cars }: { cars: Car[] }) {
  return <CarsGrid cars={cars} />;
}
