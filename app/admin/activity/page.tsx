import { requireAdmin } from "@/lib/auth/requireAdmin";

export default async function ActivityLogsPage() {
  await requireAdmin();
  // TODO: Fetch and paginate activity logs
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Activity Logs</h1>
      <div>Paginated activity logs will be shown here.</div>
    </div>
  );
}
