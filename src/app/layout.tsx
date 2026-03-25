import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'

export const metadata: Metadata = {
  title: 'The Rope House',
  description: 'Handcrafted natural jute rope homewares — lamps, mirrors and bathroom accessories.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <CartDrawer />
        {children}
      </body>
    </html>
  )
}
