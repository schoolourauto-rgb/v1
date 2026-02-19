
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
  "use server";
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const boostPrice = 500;

  // Get wallet balance
  const { data: wallet } = await supabase
    .from("dealer_wallet")
    .select("balance")
    .eq("dealer_id", user.id)
    .single();

  if (!wallet || wallet.balance < boostPrice) {
    return;
  }

  // Deduct balance
  await supabase
    .from("dealer_wallet")
    .update({ balance: wallet.balance - boostPrice })
    .eq("dealer_id", user.id);

  // Mark featured for 7 days
  await supabase
    .from("cars")
    .update({
      is_featured: true,
      featured_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    .eq("id", carId)
    .eq("dealer_id", user.id);
}

async function deleteCar(id: string) {
  "use server"
  const supabase = createServerClient(cookies())
  await supabase.from("cars").delete().eq("id", id)
}

async function toggleStatus(id: string, currentStatus: string) {
  "use server"
  const supabase = createServerClient(cookies())
  await supabase
    .from("cars")
    .update({
      status: currentStatus === "active" ? "sold" : "active",
    })
    .eq("id", id)
}

export default async function DealerCarsPage() {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: cars } = await supabase
    .from("cars")
    .select("*")
    .eq("dealer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Cars</h1>
        <Link
          href="/dealer/cars/add"
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Add Car
        </Link>
      </div>

      {cars && cars.length > 0 ? (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-left text-sm">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="border-t">
                  <td className="p-4">{car.title}</td>
                  <td className="p-4">₹{car.price}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        car.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {car.status}
                    </span>
                    <form action={async () => boostCar(car.id)}>
                      <button className="text-purple-600 ml-3">
                        Boost
                      </button>
                    </form>
                  </td>
                  <td className="p-4 space-x-3">
                    <Link
                      href={`/dealer/cars/${car.id}/edit`}
                      className="text-blue-600"
                    >
                      Edit
                    </Link>

                    <form action={async () => toggleStatus(car.id, car.status)}>
                      <button className="text-yellow-600">
                        {car.status === "active" ? "Mark Sold" : "Mark Active"}
                      </button>
                    </form>

                    <form action={async () => deleteCar(car.id)}>
                      <button className="text-red-600 ml-3">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-10 text-center rounded-xl shadow">
          <p className="text-gray-500 mb-4">
            You have not added any cars yet.
          </p>
          <Link
            href="/dealer/cars/add"
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            Add Your First Car
          </Link>
        </div>
      )}
    </div>
  )
}
