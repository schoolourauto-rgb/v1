import React from "react";
import StatCard from "./StatCard";
import Insight from "./Insight";
import { Button } from "@/components/ui/Button";
import { Car } from "lucide-react";
import { motion } from "framer-motion";

interface PostedCarsProps {
  cars: any[];
  setAddCarOpen: (open: boolean) => void;
}

export default function PostedCars({ cars, setAddCarOpen }: PostedCarsProps) {
  const totalCars = cars.length;
  const activeCount = cars.filter((c) => c.status === "active").length;
  const soldCount = cars.filter((c) => c.status === "sold").length;
  const totalViews = cars.reduce((sum, c) => sum + (c.views || 0), 0);
  const totalLeads = cars.reduce((sum, c) => sum + (c.leads || 0), 0);
  const conversion = totalViews ? ((totalLeads / totalViews) * 100).toFixed(1) : 0;

  if (!cars.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-16 text-center bg-card">
        <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-semibold tracking-tight mb-2">Start growing your dealership today</h3>
        <p className="text-sm text-muted-foreground mb-6">Add your first listing to reach verified buyers and generate leads.</p>
        <Button onClick={() => setAddCarOpen(true)} className="rounded-xl px-6">
          Add Your First Car
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Performance Insights Card */}
      <motion.div
        className="bg-card border border-border rounded-2xl p-6 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-base font-medium mb-4">Performance Overview</h3>
        <div className="grid grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
            <Insight label="Views" value={totalViews} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Insight label="Leads" value={totalLeads} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
            <Insight label="Conversion" value={`${conversion}%`} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <Insight label="Revenue" value="₹4.2L" />
          </motion.div>
        </div>
      </motion.div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
          <StatCard title="Total Cars" value={totalCars} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <StatCard title="Active" value={activeCount} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
          <StatCard title="Sold" value={soldCount} />
        </motion.div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cars.map((car) => (
          <div key={car.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-2">
            <div className="text-base font-medium text-yellow-400">{car.title || car.make + ' ' + car.model}</div>
            <div className="text-sm text-muted-foreground">{car.year} • {car.fuel_type || car.fuel} • {car.transmission || 'Manual'}</div>
            <div className="text-base font-semibold">₹{car.price?.toLocaleString('en-IN')}</div>
            <div className="text-xs text-muted-foreground">{car.mileage || car.km} KM</div>
          </div>
        ))}
      </div>
    </>
  );
}
