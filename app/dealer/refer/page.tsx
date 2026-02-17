"use client";
import { useState } from "react";

const referralCode = "DEALER123";
const referralLink = `https://ourauto.com/signup?ref=${referralCode}`;
const referrals = [
  { name: "Jay Patel", status: "Joined", date: "2026-02-10" },
  { name: "Amit Shah", status: "Pending", date: "2026-02-15" },
];
const totalReferrals = referrals.length;
const targetReferrals = 5;
const credits = 100;
const balance = 60;

export default function DealerReferPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=Join OurAuto and earn rewards! Use my code: ${referralCode} ${referralLink}`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-8">
      {/* Explanation */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm text-center">
        <h1 className="text-2xl font-bold mb-2 text-yellow-400">Refer & Earn</h1>
        <p className="text-zinc-200 mb-2">Invite dealers to OurAuto. Earn <span className="text-yellow-400 font-bold">5 credits</span> for every signup using your code. More referrals = more rewards!</p>
      </div>

      {/* Referral Code Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col items-center gap-4">
        <div className="text-lg text-zinc-300 mb-1">Your Referral Code</div>
        <div className="font-mono text-2xl bg-zinc-800 px-8 py-3 rounded-xl text-yellow-400 tracking-widest select-all border border-zinc-700">{referralCode}</div>
        <div className="flex gap-3">
          <button onClick={handleCopy} className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl px-5 py-2 font-semibold transition-all duration-200">
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