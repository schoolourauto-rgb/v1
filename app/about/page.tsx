import { ShieldCheck, Phone, UserCheck, Ban } from "lucide-react";

export const metadata = {
  title: "About OurAuto",
  description: "Learn about OurAuto's mission, values, and why we are the trusted choice for verified used cars in India.",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2">About OurAuto</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">India’s trusted platform for verified used cars, direct from showroom dealers.</p>
      </section>

      {/* Mission Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
        <p className="text-gray-700 dark:text-gray-300">
          OurAuto operates on a <span className="font-semibold">verified dealers only</span> model. We do not allow middlemen or unverified listings. Every car you see is from a real, trusted showroom dealer—no spam, no fake inventory, just genuine cars.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <li className="flex items-center gap-3">
            <ShieldCheck className="text-yellow-500" />
            <span>Verified showroom dealers</span>
          </li>
          <li className="flex items-center gap-3">
            <UserCheck className="text-yellow-500" />
            <span>Direct dealer contact</span>
          </li>
          <li className="flex items-center gap-3">
            <Ban className="text-yellow-500" />
            <span>No spam listings</span>
          </li>
          <li className="flex items-center gap-3">
            <ShieldCheck className="text-yellow-500" />
            <span>Trusted inventory</span>
          </li>
        </ul>
      </section>

      {/* Contact Information */}
      <section className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
        <div className="flex items-center gap-2 text-lg">
          <Phone className="text-yellow-500" />
          <span>Customer Care: <a href="tel:+919408000012" className="underline">+91 94080 00012</a></span>
        </div>
      </section>
        {/* Safety & Anti-Fraud Policy */}
        <section
          className="mb-10 rounded-lg border border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-zinc-900/60 px-4 py-6"
          aria-label="Safety and Anti-Fraud Policy"
        >
          <h2 className="text-2xl font-semibold mb-2">Your Safety Comes First</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            At OurAuto, your safety and trust are our top priorities. We are committed to providing a secure, transparent platform for buying used cars from verified dealers.
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-800 dark:text-gray-200">
            <li>Never pay any advance amount before physically inspecting the vehicle.</li>
            <li>Always visit the dealer’s official showroom before making payment.</li>
            <li>Avoid transferring money to personal bank accounts.</li>
            <li>OurAuto does not collect booking or advance payments on behalf of dealers.</li>
            <li>Immediately report any suspicious activity to customer care.</li>
          </ul>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Disclaimer: OurAuto is a marketplace platform connecting buyers with verified dealers. We do not participate in financial transactions between buyers and dealers.
          </div>
        </section>
    </main>
  );
}
