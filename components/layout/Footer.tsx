import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand/About */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">OurAuto</h3>
            <p className="text-sm text-muted-foreground">Premium automotive marketplace for dealers</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/marketplace" className="hover:text-foreground transition">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-foreground transition">
                  Become Dealer
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm">Customer Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="tel:+919408000012" className="hover:text-foreground transition">
                  +91 94080 00012
                </a>
              </li>
              <li>
                <a href="mailto:support@ourauto.in" className="hover:text-foreground transition">
                  support@ourauto.in
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {currentYear} OurAuto.in. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Designed for premium dealers</p>
        </div>
      </div>
    </footer>
  )
}
