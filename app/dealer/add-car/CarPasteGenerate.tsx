import { useState } from "react";

export default function CarPasteGenerate() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        body: JSON.stringify({ message }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.errors?.join(" | ") || "Unknown error");
      } else {
        setResult(data.car);
      }
    } catch (err) {
      setError("Failed to generate listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Paste WhatsApp Car Details</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-3 border rounded mb-4"
        placeholder="Paste WhatsApp car details..."
        rows={8}
        disabled={loading}
      />
      <button
        onClick={handleGenerate}
        disabled={loading || !message.trim()}
        className="w-full bg-blue-600 text-white font-semibold p-3 rounded mb-4 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Listing"}
      </button>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {result && (
        <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
