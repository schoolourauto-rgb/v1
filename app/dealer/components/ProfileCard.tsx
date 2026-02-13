export default function ProfileCard() {
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-zinc-800">
      <h3 className="text-lg font-semibold mb-4">Dealer Profile</h3>

      <p className="text-sm text-zinc-400">
        Email: dealer@email.com
      </p>

      <button className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded-xl">
        Edit Profile
      </button>
    </div>
  );
}
