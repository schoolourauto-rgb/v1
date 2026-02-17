export default function DealerHelpPage() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 transition-colors duration-200">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">Help & Support</h1>
      <div className="space-y-4">
        <div className="bg-zinc-800 rounded-lg p-4">
          <div className="font-semibold mb-2">FAQ</div>
          <div className="mb-2">Q: How do I add a car?<br/>A: Use the Add New Car page.</div>
          <div>Q: How do I contact support?<br/>A: Email us below.</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4">
          <div className="font-semibold mb-2">Support Email</div>
          <a href="mailto:support@yourdomain.com" className="underline text-yellow-400">support@yourdomain.com</a>
        </div>
      </div>
    </div>
  );
}