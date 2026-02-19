import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t soft-border bg-background mt-20 rounded-t-2xl">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">OurAuto</h3>
            <p className="text-base text-foreground/60">Premium automotive marketplace for dealers</p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-base">Platform</h4>
            <ul className="space-y-2 text-base text-foreground/60">
              <li>
                <Link href="/marketplace" className="hover:text-accent transition">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-accent transition">
                  Become Dealer
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-base">Support</h4>
            <ul className="space-y-2 text-base text-foreground/60">
              <li>
                <a href="#" className="hover:text-accent transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-base">Legal</h4>
            <ul className="space-y-2 text-base text-foreground/60">
              <li>
                <a href="#" className="hover:text-accent transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t soft-border pt-10 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-base text-foreground/60">© {currentYear} OurAuto.in. All rights reserved.</p>
          <p className="text-base text-foreground/60">Designed for premium dealers</p>
        </div>
      </div>
    </footer>
  )
}
