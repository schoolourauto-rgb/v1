
import { requireAdmin } from "@/lib/auth/requireAdmin";

export default async function DealersPage() {
  await requireAdmin();
  // TODO: List all dealers with pagination and controls
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Dealers</h1>
      <div>Dealer list and controls go here.</div>
    </div>
  );
}
