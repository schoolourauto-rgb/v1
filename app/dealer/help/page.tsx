"use client";
import { useState } from "react";

const FAQS = [
  { q: "How do I add a car?", a: "Go to Add New Car and fill the form." },
  { q: "How do I edit my profile?", a: "Visit Profile and click Edit." },
  { q: "How do I upload images?", a: "Use the image upload on Add Car or Profile." },
  { q: "How do I contact support?", a: "Use the contact form below or email us." },
  { q: "How do I refer dealers?", a: "Go to Refer & Earn for your code and link." },
];

export default function DealerHelpPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(-1);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const filteredFaqs = FAQS.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ subject: "", message: "" });
      setTimeout(() => setSuccess(false), 1500);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-4 text-yellow-400">Help & Support</h1>
        {/* Searchable FAQ */}
        <input
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none mb-4"
          placeholder="Search FAQ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="space-y-3">
          {filteredFaqs.length === 0 && (
            <div className="text-zinc-400 text-center">No results found.</div>
          )}
          {filteredFaqs.map((f, i) => (
            <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl transition-all duration-200 shadow-sm">
              <button
                className="w-full flex justify-between items-center px-4 py-3 text-left text-zinc-100 font-semibold focus:outline-none"
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                {f.q}
                <span className="ml-2 text-yellow-400">{open === i ? "-" : "+"}</span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-40 p-4' : 'max-h-0 p-0'}`}
                style={{ background: open === i ? '#18181b' : 'transparent' }}
              >
                {open === i && <div className="text-zinc-300">{f.a}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-2 text-zinc-100">Contact Support</h2>
        <form className="space-y-4" onSubmit={handleForm}>
          <input
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none"
            placeholder="Subject"
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
            required
          />
          <textarea
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none min-h-[80px]"
            placeholder="Message"
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            required
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl py-3 font-semibold transition-all duration-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
          {success && <div className="text-green-500 font-semibold text-center mt-2">Message sent!</div>}
        </form>
      </div>

      {/* Support Info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="font-semibold text-zinc-100">Support Email</div>
          <a href="mailto:support@yourdomain.com" className="underline text-yellow-400">support@yourdomain.com</a>
        </div>
        <div className="text-zinc-400">Response time: <span className="text-zinc-100">within 24 hours</span></div>
        <div className="text-zinc-400">Live chat: <span className="text-zinc-100">Coming soon</span></div>
      </div>
    </div>
  );
}