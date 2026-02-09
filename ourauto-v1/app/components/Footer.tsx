import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-800 bg-black mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">OurAuto</h3>
            <p className="text-sm text-zinc-400">Premium automotive marketplace for dealers</p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm">Platform</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
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
            <h4 className="font-semibold text-white text-sm">Support</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
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
            <h4 className="font-semibold text-white text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
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
        <div className="border-t border-zinc-800 pt-8 flex justify-between items-center">
          <p className="text-sm text-zinc-500">© {currentYear} OurAuto. All rights reserved.</p>
          <p className="text-sm text-zinc-500">Designed for premium dealers</p>
        </div>
      </div>
    </footer>
  )
}
