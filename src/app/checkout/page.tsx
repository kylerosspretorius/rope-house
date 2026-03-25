'use client'

import { useState, useRef } from 'react'
import { useCartStore } from '@/store/cart'
import { urlFor } from '../../../sanity/lib/image'
import Image from 'next/image'

function formatPrice(n: number) {
  return 'R ' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const [form, setForm] = useState({ nameFirst: '', nameLast: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const payfastFormRef = useRef<HTMLFormElement>(null)
  const [payfastData, setPayfastData] = useState<Record<string, string> | null>(null)

  const cartTotal = total()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (items.length === 0) {
      setError('Your cart is empty.')
      return
    }

    setLoading(true)
    try {
      const orderId = `RH-${Date.now()}`
      const itemName = items.length === 1
        ? items[0].name
        : `Rope House Order (${items.length} items)`

      const res = await fetch('/api/payfast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameFirst: form.nameFirst,
          nameLast: form.nameLast,
          email: form.email,
          amount: cartTotal,
          itemName,
          orderId,
        }),
      })

      if (!res.ok) throw new Error('Failed to initiate payment.')

      const data = await res.json()
      setPayfastData(data)

      // Submit hidden PayFast form after state update
      setTimeout(() => {
        payfastFormRef.current?.submit()
        clearCart()
      }, 100)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !payfastData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <p className="text-stone-500 mb-6">Your cart is empty.</p>
          <a href="/#collection" className="text-sm tracking-widest uppercase text-stone-800 underline underline-offset-4">
            Back to shop
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 py-16 px-6">
      {/* Hidden PayFast form — auto-submitted */}
      {payfastData && (
        <form
          ref={payfastFormRef}
          action={payfastData.payfastUrl}
          method="POST"
          style={{ display: 'none' }}
        >
          {Object.entries(payfastData)
            .filter(([key]) => key !== 'payfastUrl')
            .map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value} />
            ))}
        </form>
      )}

      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700 transition-colors">
          ← Back to shop
        </a>
        <h1 className="mt-6 text-3xl font-light text-stone-800">Checkout</h1>

        <div className="mt-10 grid md:grid-cols-2 gap-12">
          {/* Details form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xs tracking-widest uppercase text-stone-500">Your Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-wide text-stone-500 mb-1">First Name</label>
                <input
                  name="nameFirst"
                  required
                  value={form.nameFirst}
                  onChange={handleChange}
                  className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-stone-800 transition-colors bg-white"
                />
              </div>
              <div>
                <label className="block text-xs tracking-wide text-stone-500 mb-1">Last Name</label>
                <input
                  name="nameLast"
                  required
                  value={form.nameLast}
                  onChange={handleChange}
                  className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-stone-800 transition-colors bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-wide text-stone-500 mb-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-stone-800 transition-colors bg-white"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-800 text-white text-sm tracking-widest uppercase py-4 hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Redirecting…' : `Pay ${formatPrice(cartTotal)}`}
            </button>

            <p className="text-xs text-stone-400 text-center">
              You will be redirected to PayFast to complete your payment securely.
            </p>
          </form>

          {/* Order summary */}
          <div>
            <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-6">Order Summary</h2>
            <ul className="divide-y divide-stone-200 bg-white border border-stone-200">
              {items.map((item) => {
                const imageUrl = item.images?.[0]
                  ? urlFor(item.images[0]).width(120).height(140).fit('crop').url()
                  : null
                return (
                  <li key={item._id} className="flex gap-4 p-4">
                    {imageUrl && (
                      <div className="relative w-16 h-20 bg-stone-100 flex-shrink-0">
                        <Image src={imageUrl} alt={item.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-sm font-medium text-stone-800">{item.name}</p>
                      <p className="text-xs text-stone-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm text-stone-800 self-center">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                )
              })}
            </ul>
            <div className="mt-4 flex justify-between text-sm border-t border-stone-200 pt-4">
              <span className="text-stone-500">Total</span>
              <span className="font-medium text-stone-800">{formatPrice(cartTotal)}</span>
            </div>
            <p className="mt-2 text-xs text-stone-400">Shipping arranged after payment confirmation.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
