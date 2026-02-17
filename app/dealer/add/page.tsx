export default function AddCarPage() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 transition-colors duration-200">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">Add New Car</h1>
      <form className="space-y-4">
        <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white" placeholder="Car Model" />
        <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white" placeholder="Year" />
        <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white" placeholder="Price" />
        <button type="submit" className="bg-yellow-500 text-black font-semibold px-4 py-2 rounded transition-colors duration-200">Submit</button>
      </form>
    </div>
  );
}