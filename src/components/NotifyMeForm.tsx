'use client'

import { useState } from 'react'

interface Props {
  productId: string
  productSlug: string
  productName: string
}

export default function NotifyMeForm({ productId, productSlug, productName }: Props) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (submitted) {
    return (
      <div className="bg-stone-50 border border-stone-200 px-5 py-4">
        <p className="text-sm text-stone-700 font-medium">You&apos;re on the list.</p>
        <p className="text-xs text-stone-400 mt-1">
          We&apos;ll email you as soon as <span className="text-stone-600">{productName}</span> is back in stock.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-stone-500 mb-4">Get notified when this item is back in stock.</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setLoading(true)
          setError('')
          try {
            const res = await fetch('/api/notify-stock', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, name, productId, productSlug, productName }),
            })
            if (!res.ok) throw new Error()
            setSubmitted(true)
          } catch {
            setError('Something went wrong. Please try again.')
          } finally {
            setLoading(false)
          }
        }}
        className="space-y-3"
      >
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-stone-800 transition-colors bg-white placeholder:text-stone-300"
        />
        <input
          type="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-stone-800 transition-colors bg-white placeholder:text-stone-300"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-sm tracking-widest uppercase border border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Notify Me'}
        </button>
      </form>
    </div>
  )
}
