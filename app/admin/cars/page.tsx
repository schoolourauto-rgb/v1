import { requireAdmin } from "@/lib/auth/requireAdmin";

export default async function CarsPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Cars</h1>
      <div>Car list and admin controls go here.</div>
    </div>
  );
}
