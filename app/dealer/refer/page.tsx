"use client";

import { useState } from "react";

export default function ReferPage() {
  const [copied, setCopied] = useState(false);

  const referralCode = "YOURCODE";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = `Join OurAuto using my referral code: ${referralCode}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Refer & Earn</h1>

      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow">
        <p className="text-lg font-semibold mb-4">
          Your Referral Code:
        </p>

        <div className="flex gap-4 items-center">
          <div className="px-4 py-2 bg-yellow-400 text-black rounded-xl font-bold">
            {referralCode}
          </div>

          <button
            onClick={handleCopy}
            className="bg-black text-white dark:bg-white dark:text-black rounded-xl px-5 py-2 font-semibold"
          >
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            onClick={handleWhatsApp}
            className="bg-green-500 text-white rounded-xl px-5 py-2 font-semibold"
          >
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