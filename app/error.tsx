"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-2xl mb-4">Something went wrong</h1>
      <button
        onClick={() => reset()}
        className="bg-yellow-400 text-black px-4 py-2 rounded-lg"
      >
        Try Again
      </button>
    </div>
  );
}
