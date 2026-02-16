export default function EmptyState() {
  return (
    <div className="text-center py-24">
      <h2 className="text-3xl font-bold mb-4">
        Fresh inventory coming soon
      </h2>
      <p className="text-neutral-500 mb-6">
        Dealers are updating listings. Check back shortly.
      </p>
      <a href="/auth/login">
        <button className="bg-yellow-500 text-black px-6 py-3 rounded-xl">
          Dealer Login
        </button>
      </a>
    </div>
  );
}
