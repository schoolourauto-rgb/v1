"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <h2 className="text-xl font-semibold">
        Something went wrong
      </h2>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded"
      >
        Try again
      </button>
    </div>
  )
}
