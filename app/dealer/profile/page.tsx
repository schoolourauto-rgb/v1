export default function DealerProfilePage() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 transition-colors duration-200">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">Profile</h1>
      <div className="space-y-2">
        <div className="text-white">Name: Dealer Name</div>
        <div className="text-white">Email: dealer@email.com</div>
        <button className="bg-yellow-500 text-black font-semibold px-4 py-2 rounded mt-4 transition-colors duration-200">Edit</button>
      </div>
    </div>
  );
}