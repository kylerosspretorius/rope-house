'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const { status } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') router.push('/account')
  }, [status, router])

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await signIn('email', { email, redirect: false })
    setSent(true)
    setLoading(false)
  }

  if (status === 'loading') return null

  if (sent) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-light text-stone-800 mb-3">Check your email</h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            We sent a sign-in link to <strong>{email}</strong>. Click it to access your account.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-light text-stone-800 mb-2 text-center">Your Account</h1>
        <p className="text-sm text-stone-400 text-center mb-10">Sign in to view your orders</p>

        {/* Google sign in */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/account' })}
          className="w-full flex items-center justify-center gap-3 border border-stone-300 bg-white px-6 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors mb-6"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-stone-200" />
          <span className="text-xs text-stone-400 tracking-wide">or</span>
          <div className="flex-1 h-px bg-stone-200" />
        </div>

        {/* Email magic link */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label className="block text-xs tracking-wide text-stone-500 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-stone-800 transition-colors bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-800 text-white text-xs tracking-widest uppercase py-4 hover:bg-stone-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send Sign-In Link'}
          </button>
        </form>
      </div>
    </main>
  )
}
