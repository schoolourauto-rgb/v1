import './globals.css'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ThemeProviderClient from './ThemeProviderClient'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProviderClient>
          <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300">
            {/* TEMP: Tailwind test box */}
            <div className="bg-red-500 text-white p-10 text-4xl">TEST TAILWIND</div>
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </ThemeProviderClient>
      </body>
    </html>
  )
}
