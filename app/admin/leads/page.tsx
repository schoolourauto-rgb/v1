import { requireAdmin } from "@/lib/auth/requireAdmin";

export default async function LeadsPage() {
  await requireAdmin();
  // TODO: List all leads with admin controls
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Leads</h1>
      <div>Lead list and admin controls go here.</div>
    </div>
  );
}
