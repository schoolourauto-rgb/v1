
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function DealerCarsPage() {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const boostPrice = 500;

  // Get wallet balance
  const { data: wallet } = await supabase
    .from("dealer_wallet")
    .select("balance")
    .eq("dealer_id", user.id)
    .single();

  const { data: cars } = await supabase
    .from("cars")
    .select("*")
    .eq("dealer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Cars</h1>
      {cars?.map((car) => (
        <div key={car.id} className="border p-4 mb-2">
          <div>{car.title}</div>
        </div>
      ))}
    </div>
  );
}
  import { cookies } from "next/headers";

  export default async function DealerCarsPage() {
    const supabase = createClient(cookies());

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const boostPrice = 500;

    const { data: wallet } = await supabase
      .from("dealer_wallet")
      .select("balance")
      .eq("dealer_id", user.id)
      .single();

    // You can add boost logic here, but do not return randomly

    const { data: cars } = await supabase
      .from("cars")
      .select("*")
      .eq("dealer_id", user.id)
      .order("created_at", { ascending: false });

    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">My Cars</h1>
        {cars?.map((car) => (
          <div key={car.id} className="border p-4 mb-2">
            <div>{car.title}</div>
          </div>
        ))}
      </div>
    );
  }
                    <Link
                      href={`/dealer/cars/${car.id}/edit`}
                      className="text-blue-600"
                    >
                      Edit
                    </Link>


// ===============================
// SERVER ACTION
// ===============================
async function toggleStatus(formData: FormData) {
  "use server";
  const carId = formData.get("carId") as string;
  const currentStatus = formData.get("currentStatus") as string;
  const supabase = createClient(cookies());
  const newStatus = currentStatus === "active" ? "sold" : "active";
  await supabase
    .from("cars")
    .update({ status: newStatus })
    .eq("id", carId);
}

// ===============================
// SERVER ACTIONS
// ===============================
async function toggleStatus(formData: FormData) {
  "use server";
  const carId = formData.get("carId") as string;
  const currentStatus = formData.get("currentStatus") as string;
  const supabase = createClient(cookies());
  const newStatus = currentStatus === "active" ? "sold" : "active";
  await supabase
    .from("cars")
    .update({ status: newStatus })
    .eq("id", carId);
}

async function deleteCar(formData: FormData) {
  "use server";
  const carId = formData.get("carId") as string;
  const supabase = createClient(cookies());
  await supabase.from("cars").delete().eq("id", carId);
}

export default async function DealerCarsPage() {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const boostPrice = 500;

  const { data: wallet } = await supabase
    .from("dealer_wallet")
    .select("balance")
    .eq("dealer_id", user.id)
    .single();

  const { data: cars } = await supabase
    .from("cars")
    .select("*")
    .eq("dealer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Cars</h1>
      {cars?.map((car) => (
        <div key={car.id} className="border p-4 mb-2">
          <div>{car.title}</div>
          <form action={toggleStatus}>
            <input type="hidden" name="carId" value={car.id} />
            <input type="hidden" name="currentStatus" value={car.status} />
            <button className="text-yellow-600">
              {car.status === "active" ? "Mark Sold" : "Mark Active"}
            </button>
          </form>
          <form action={deleteCar}>
            <input type="hidden" name="carId" value={car.id} />
            <button className="text-red-600 ml-3">
              Delete
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
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
