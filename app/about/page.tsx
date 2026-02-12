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
    </main>
  );
}
