export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white dark:bg-neutral-900">
        <h1 className="text-2xl font-bold mb-6">
          Dealer Sign Up
        </h1>

        <form className="space-y-4">
          <input type="text" placeholder="Dealer Name" className="input-style" />
          <input type="email" placeholder="Email" className="input-style" />
          <input type="password" placeholder="Password" className="input-style" />

          <button className="w-full bg-yellow-500 text-black py-3 rounded-xl">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
