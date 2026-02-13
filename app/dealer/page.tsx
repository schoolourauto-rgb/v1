import StatsCards from "./components/StatsCards";
import ListingsSection from "./components/ListingsSection";
import QuickActions from "./components/QuickActions";
import ProfileCard from "./components/ProfileCard";

export default function DealerDashboard() {
  return (
    <div className="space-y-8">
      <StatsCards />
      <QuickActions />
      <ListingsSection />
      <ProfileCard />
    </div>
  );
}
