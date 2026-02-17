export default function DealerReferPage() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 transition-colors duration-200">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">Refer & Earn</h1>
      <div className="space-y-4">
        <div className="text-white">Referral Code: <span className="font-mono bg-zinc-800 px-2 py-1 rounded">DEALER123</span></div>
        <div className="flex gap-2">
          <button className="bg-yellow-500 text-black font-semibold px-4 py-2 rounded transition-colors duration-200">Copy</button>
          <button className="bg-zinc-800 text-white font-semibold px-4 py-2 rounded transition-colors duration-200">Share</button>
        </div>
        <div className="text-white">Credits: <span className="text-yellow-400 font-bold">100</span></div>
      </div>
    </div>
  );
}