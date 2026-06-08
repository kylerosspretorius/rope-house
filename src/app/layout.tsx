import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import ScrollToTop from '@/components/ScrollToTop'
import AuthProvider from '@/components/AuthProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rope-house.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'The Rope House | Handcrafted Jute Rope Homewares',
    template: '%s | The Rope House',
  },
  description:
    'Handcrafted natural jute rope homewares made in South Africa. Shop lamps, mirrors and bathroom accessories with a warm coastal character.',
  keywords: [
    'rope homewares',
    'jute rope lamp',
    'handcrafted home decor',
    'South Africa homewares',
    'natural rope mirror',
    'coastal home accessories',
    'rope house',
  ],
  authors: [{ name: 'The Rope House' }],
  creator: 'The Rope House',
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: siteUrl,
    siteName: 'The Rope House',
    title: 'The Rope House | Handcrafted Jute Rope Homewares',
    description:
      'Handcrafted natural jute rope homewares made in South Africa. Shop lamps, mirrors and bathroom accessories.',
    images: [
      {
        url: '/images/hero-rope.jpg',
        width: 1200,
        height: 630,
        alt: 'The Rope House — handcrafted natural jute homewares',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Rope House | Handcrafted Jute Rope Homewares',
    description:
      'Handcrafted natural jute rope homewares made in South Africa. Shop lamps, mirrors and bathroom accessories.',
    images: ['/images/hero-rope.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions).catch(() => null)

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1c1917" />
      </head>
      <body>
        <AuthProvider session={session}>
          <Navbar />
          <CartDrawer />
          <ScrollToTop />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
