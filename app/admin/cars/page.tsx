import { requireAdmin } from "@/lib/auth/requireAdmin";

export default async function CarsPage() {
  await requireAdmin();
  // TODO: List all cars with admin controls
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Cars</h1>
      <div>Car list and admin controls go here.</div>
    </div>
  );
}
