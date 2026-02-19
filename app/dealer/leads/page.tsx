
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function DealerLeadsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return notFound()

  const { data: leads } = await supabase
    .from("leads")
    .select(`
      id,
      name,
      phone,
      status,
      created_at,
      cars(title)
    `)
    .eq("dealer_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Leads</h1>

      {leads && leads.length > 0 ? (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-left text-sm">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Car</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t">
                  <td className="p-4">
                    <p className="font-semibold">{lead.name}</p>
                    <p className="text-sm text-gray-500">{lead.phone}</p>
                  </td>

                  <td className="p-4">
                    {lead.cars?.title || "Car"}
                  </td>

                  <td className="p-4">
                    <StatusToggle
                      id={lead.id}
                      currentStatus={lead.status}
                    />
                  </td>

                  <td className="p-4 space-x-3">
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-blue-600"
                    >
                      Call
                    </a>

                    <a
                      href={`https://wa.me/${lead.phone}`}
                      target="_blank"
                      className="text-green-600"
                    >
                      WhatsApp
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-10 text-center rounded-xl shadow">
          <p className="text-gray-500">
            No leads received yet.
          </p>
        </div>
      )}
    </div>
  )
}

async function updateStatus(id: string, status: string) {
  "use server"
  const supabase = createClient()

  await supabase
    .from("leads")
    .update({ status })
    .eq("id", id)
}

function StatusToggle({
  id,
  currentStatus,
}: {
  id: string
  currentStatus: string
}) {
  return (
    <form
      action={async (formData: FormData) => {
        const newStatus = formData.get("status") as string
        await updateStatus(id, newStatus)
      }}
    >
      <select
        name="status"
        defaultValue={currentStatus}
        className="border px-2 py-1 rounded"
      >
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="closed">Closed</option>
      </select>

      <button
        type="submit"
        className="ml-2 text-sm text-blue-600"
      >
        Update
      </button>
    </form>
  )
}
