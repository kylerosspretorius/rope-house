'use client'

import { useCartStore } from '@/store/cart'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const links = [
  { label: 'Collection', href: '/#collection' },
  { label: 'Craft', href: '/#craft' },
  { label: 'Care', href: '/#care' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const { openCart, count } = useCartStore()
  const { data: session } = useSession()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const itemCount = mounted ? count() : 0
  const opaque = !isHome || scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        opaque ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo — static small on narrow screens */}
        <a href="/" className="block flex-shrink-0 max-[400px]:block hidden">
          <Image
            src="/images/logo-rope-house.jpeg"
            alt="The Rope House"
            width={40}
            height={40}
            className="rounded-full shadow border border-stone-300"
          />
        </a>

        {/* Hanging logo — hidden on narrow screens */}
        <div className="relative flex flex-col items-center max-[400px]:hidden" style={{ marginTop: '120px' }}>
          <div className="absolute bottom-full flex gap-[3px]">
            <div className="w-[2px] h-20 bg-gradient-to-b from-stone-400 to-stone-600 rounded-b" />
            <div className="w-[2px] h-24 bg-gradient-to-b from-stone-300 to-stone-500 rounded-b" />
            <div className="w-[2px] h-20 bg-gradient-to-b from-stone-400 to-stone-600 rounded-b" />
          </div>
          <a href="/" className="block animate-sway" style={{ transformOrigin: 'top center' }}>
            <Image
              src="/images/logo-rope-house.jpeg"
              alt="The Rope House"
              width={130}
              height={130}
              className="rounded-full shadow-xl border-2 border-stone-300"
            />
          </a>
        </div>

        {/* Desktop nav — centred */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-xs tracking-widest uppercase transition-colors hover:opacity-60 ${opaque ? 'text-stone-600' : 'text-white/80'}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right — Account + Cart + Mobile menu */}
        <div className="flex items-center gap-6">
          {/* Account link */}
          <Link
            href="/account"
            title={session ? session.user?.name ?? 'My Account' : 'Sign In'}
            className={`flex items-center gap-1.5 text-xs tracking-widest uppercase transition-colors hover:opacity-60 ${opaque ? 'text-stone-600' : 'text-white/80'}`}
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? 'Account'}
                width={22}
                height={22}
                className="rounded-full"
              />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            )}
            <span className="hidden sm:inline">{session ? 'Account' : 'Sign In'}</span>
          </Link>

          <button
            onClick={openCart}
            className={`relative flex items-center gap-2 text-xs tracking-widest uppercase transition-colors hover:opacity-60 ${opaque ? 'text-stone-600' : 'text-white/80'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-stone-800 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            className={`md:hidden transition-colors ${opaque ? 'text-stone-800' : 'text-white'}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-6 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-xs tracking-widest uppercase text-stone-600 hover:text-stone-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
