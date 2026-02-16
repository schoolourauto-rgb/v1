import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black mt-20">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-black dark:text-white">OurAuto</h3>
            <p className="text-base text-black/60 dark:text-gray-300">Premium automotive marketplace for dealers</p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-black dark:text-white text-base">Platform</h4>
            <ul className="space-y-2 text-base text-black/60 dark:text-gray-300">
              <li>
                <Link href="/marketplace" className="hover:text-yellow-500 transition">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-yellow-500 transition">
                  Become Dealer
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-black dark:text-white text-base">Support</h4>
            <ul className="space-y-2 text-base text-black/60 dark:text-gray-300">
              <li>
                <a href="#" className="hover:text-yellow-500 transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-500 transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-black dark:text-white text-base">Legal</h4>
            <ul className="space-y-2 text-base text-black/60 dark:text-gray-300">
              <li>
                <a href="#" className="hover:text-yellow-500 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-500 transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-10 flex justify-between items-center">
            <p className="text-base text-black/60 dark:text-gray-400">© {currentYear} OurAuto.in. All rights reserved.</p>
          <p className="text-base text-black/60 dark:text-gray-400">Designed for premium dealers</p>
        </div>
      </div>
    </footer>
  )
}
