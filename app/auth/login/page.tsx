export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white dark:bg-neutral-900">
        <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">
          Dealer Login
        </h1>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 transition font-semibold text-black"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
