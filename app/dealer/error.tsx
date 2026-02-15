"use client";

export default function DealerError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold">
        Something went wrong.
      </h2>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-yellow-500 rounded"
      >
        Try again
      </button>
    </div>
  );
}
