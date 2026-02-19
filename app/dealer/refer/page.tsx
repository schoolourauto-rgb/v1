export default function ReferPage() {
  return (
    <div className="bg-[var(--bg-card)] p-8 rounded-2xl shadow-md max-w-2xl">

      <h1 className="text-2xl font-semibold mb-6">
        Refer & Earn
      </h1>

      <div className="space-y-4 text-[var(--text-muted)]">
        <p>Share your referral code with other dealers.</p>
        <p>For every successful signup, you get 1 free hot deal credit.</p>
      </div>

      <div className="mt-6 p-4 bg-[var(--accent)]/20 rounded-lg">
        <span className="font-medium">Your Code:</span> ABC123
      </div>

    </div>
  );
}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button onClick={handleWhatsApp} className="bg-green-500 hover:bg-green-400 text-white rounded-xl px-5 py-2 font-semibold transition-all duration-200">
            WhatsApp
          </button>
        </div>
        <div className="text-xs text-zinc-400 mt-1">Share: <a href={referralLink} className="underline text-yellow-400" target="_blank" rel="noopener noreferrer">{referralLink}</a></div>
      </div>

      {/* Progress Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between mb-2 text-sm text-zinc-300">
          <span>Referrals: {totalReferrals}/{targetReferrals}</span>
          <span>Target: {targetReferrals}</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-4 overflow-hidden">
          <div
            className="bg-yellow-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${(totalReferrals / targetReferrals) * 100}%` }}
          />
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-lg text-zinc-200">Total Credits: <span className="text-yellow-400 font-bold">{credits}</span></div>
        <div className="text-lg text-zinc-200">Available Balance: <span className="text-green-400 font-bold">{balance}</span></div>
      </div>

      {/* Referral List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="text-lg font-semibold text-zinc-100 mb-4">Your Referrals</div>
        {referrals.length === 0 ? (
          <div className="text-zinc-400 text-center">No referrals yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-zinc-400">
                  <th className="px-4 py-2 text-left">Dealer</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r, i) => (
                  <tr key={i} className="hover:bg-zinc-800 transition">
                    <td className="px-4 py-2 font-medium text-zinc-100">{r.name}</td>
                    <td className="px-4 py-2">
                      <span className={
                        r.status === "Joined"
                          ? "bg-green-500 text-white px-3 py-1 rounded-full text-xs"
                          : "bg-yellow-500 text-black px-3 py-1 rounded-full text-xs"
                      }>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-zinc-300">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}