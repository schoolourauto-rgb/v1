import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import ProfilePanel from "./ProfilePanel";
import StatCard from "./StatCard";
import { Button } from "@/components/ui/Button";
import { Car } from "lucide-react";


interface DashboardTabsProps {
  cars: any[];
  profile: any;
  guidelines: React.ReactNode;
  onProfileSave: (data: any) => Promise<void>;
  setAddCarOpen?: (open: boolean) => void;
}

  const activeCount = cars.filter((c) => c.status === "active").length;
  const soldCount = cars.filter((c) => c.status === "sold").length;
  return (
    <Tabs defaultValue="cars" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="cars">Posted Cars</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="guide">Guidelines</TabsTrigger>
      </TabsList>
      <TabsContent value="cars">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard title="Total Cars" value={cars.length} />
          <StatCard title="Active" value={activeCount} />
          <StatCard title="Sold" value={soldCount} />
        </div>
        {/* Cars grid or empty state */}
        {cars.length === 0 ? (
          <div className="text-center py-20">
            <Car className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No cars posted yet</h3>
            <p className="text-muted-foreground mb-6">Start selling by adding your first car listing.</p>
            <Button onClick={() => (typeof setAddCarOpen === 'function' ? setAddCarOpen(true) : undefined)}>
              Add Your First Car
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cars.map((car) => (
              <div key={car.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-2 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-lg font-bold text-yellow-400">{car.title || car.make + ' ' + car.model}</div>
                <div className="text-sm text-muted-foreground">{car.year} • {car.fuel_type || car.fuel} • {car.transmission || 'Manual'}</div>
                <div className="text-base font-semibold">₹{car.price?.toLocaleString('en-IN')}</div>
                <div className="text-xs text-muted-foreground">{car.mileage || car.km} KM</div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="profile">
        <ProfilePanel profile={profile} onSave={onProfileSave} />
      </TabsContent>
      <TabsContent value="guide">
        {guidelines}
      </TabsContent>
    </Tabs>
  );
}
