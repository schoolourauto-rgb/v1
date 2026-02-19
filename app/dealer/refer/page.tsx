export default function ReferPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-card rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Refer & Earn</h2>

        <div className="flex gap-3">
          <button className="btn-primary">
            Copy
          </button>

          <button className="bg-green-500 hover:bg-green-400 text-white rounded-xl px-5 py-2 font-semibold transition-all duration-200">
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
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
                <div className="p-6 space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Refer & Earn</h2>
                    <p className="text-sm text-gray-500">Share your referral code and earn featured ad credits.</p>
                    <div className="flex gap-3">
                      <button className="bg-blue-600 text-white px-5 py-2 rounded-xl">Copy Code</button>
                      <button className="bg-green-500 text-white px-5 py-2 rounded-xl">Share on WhatsApp</button>
                    </div>
                  </div>
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