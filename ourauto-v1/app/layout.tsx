import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import ThemeProviderClient from './ThemeProviderClient'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProviderClient attribute="class" defaultTheme="dark">
          <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </ThemeProviderClient>
      </body>
    </html>
  )
}
