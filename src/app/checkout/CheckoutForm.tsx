'use client'

import { useState, useRef, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { useSession, signIn } from 'next-auth/react'
import { urlFor } from '../../../sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'
import type { DeliverySettings } from './page'

const SA_PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
  'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape',
]

function formatPrice(n: number) {
  return 'R ' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const inputClass = 'w-full border border-stone-300 px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-stone-800 transition-colors bg-white placeholder:text-stone-300'
const labelClass = 'block text-xs tracking-wide text-stone-500 mb-1.5'

interface Form {
  email: string
  phone: string
  nameFirst: string
  nameLast: string
  addressLine1: string
  addressLine2: string
  city: string
  province: string
  postalCode: string
  country: string
}

interface Props {
  delivery: DeliverySettings | null
}

export default function CheckoutForm({ delivery }: Props) {
  const { items, total, clearCart } = useCartStore()
  const { data: session } = useSession()
  const [form, setForm] = useState<Form>({
    email: '', phone: '', nameFirst: '', nameLast: '',
    addressLine1: '', addressLine2: '', city: '',
    province: '', postalCode: '', country: 'South Africa',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const payfastFormRef = useRef<HTMLFormElement>(null)
  const [payfastData, setPayfastData] = useState<Record<string, string> | null>(null)

  useEffect(() => {
    if (session?.user?.email) {
      setForm(f => ({
        ...f,
        email: session.user.email ?? '',
        nameFirst: f.nameFirst || (session.user.name?.split(' ')[0] ?? ''),
        nameLast: f.nameLast || (session.user.name?.split(' ').slice(1).join(' ') ?? ''),
      }))
    }
  }, [session])

  const cartSubtotal = total()
  const deliveryCost = delivery?.deliveryType === 'fixed' ? (delivery.deliveryAmount ?? 0) : 0
  const orderTotal = cartSubtotal + deliveryCost

  const deliveryLine = delivery?.deliveryType === 'fixed'
    ? formatPrice(deliveryCost)
    : delivery?.deliveryType === 'free'
    ? 'Free'
    : delivery?.deliveryNote ?? 'Arranged after payment'

  const deliveryIsPrice = delivery?.deliveryType === 'fixed' || delivery?.deliveryType === 'free'

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (items.length === 0) { setError('Your cart is empty.'); return }

    setLoading(true)
    try {
      const orderId = `RH-${Date.now()}`
      const itemName = items.length === 1 ? items[0].name : `Rope House Order (${items.length} items)`

      const res = await fetch('/api/payfast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameFirst: form.nameFirst,
          nameLast: form.nameLast,
          email: form.email,
          phone: form.phone,
          amount: orderTotal,
          subtotal: cartSubtotal,
          deliveryAmount: deliveryCost,
          itemName,
          orderId,
          items: items.map(i => ({ _id: i._id, name: i.name, quantity: i.quantity, price: i.price })),
          billingAddress: {
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2,
            city: form.city,
            province: form.province,
            postalCode: form.postalCode,
            country: form.country,
          },
        }),
      })

      if (!res.ok) throw new Error('Failed to initiate payment.')
      const data = await res.json()
      setPayfastData(data)
      setTimeout(() => { payfastFormRef.current?.submit(); clearCart() }, 100)
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
      {payfastData && (
        <form ref={payfastFormRef} action={payfastData.payfastUrl} method="POST" style={{ display: 'none' }}>
          {Object.entries(payfastData).filter(([key]) => key !== 'payfastUrl').map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}

      <div className="max-w-5xl mx-auto">
        <a href="/" className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700 transition-colors">
          ← Back to shop
        </a>
        <h1 className="mt-6 text-3xl font-light text-stone-800 mb-10">Checkout</h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">

          {/* ── Left: form ───────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Account banner */}
            {session ? (
              <div className="flex items-center gap-3 bg-stone-100 border border-stone-200 px-4 py-3">
                {session.user?.image && (
                  <Image src={session.user.image} alt="" width={28} height={28} className="rounded-full flex-shrink-0" />
                )}
                <p className="text-sm text-stone-600">
                  Signed in as <span className="font-medium text-stone-800">{session.user?.email}</span>
                </p>
                <Link href="/account" className="ml-auto text-xs tracking-wide text-stone-400 hover:text-stone-700 transition-colors whitespace-nowrap">
                  My orders →
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-white border border-stone-200 px-4 py-3">
                <p className="text-sm text-stone-500">Have an account?</p>
                <button
                  type="button"
                  onClick={() => signIn(undefined, { callbackUrl: '/checkout' })}
                  className="text-xs tracking-widest uppercase text-stone-800 hover:opacity-60 transition-opacity"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Contact */}
            <section>
              <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-4 pb-2 border-b border-stone-200">Contact</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    name="email" type="email" required
                    value={form.email} onChange={handleChange}
                    readOnly={!!session?.user?.email}
                    className={`${inputClass} ${session?.user?.email ? 'bg-stone-50 text-stone-400 cursor-default' : ''}`}
                    placeholder="your@email.com"
                  />
                  {!session && <p className="mt-1.5 text-xs text-stone-400">We'll send your order confirmation here.</p>}
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input name="phone" type="tel" required value={form.phone} onChange={handleChange} className={inputClass} placeholder="+27 82 000 0000" />
                </div>
              </div>
            </section>

            {/* Name */}
            <section>
              <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-4 pb-2 border-b border-stone-200">Full Name</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input name="nameFirst" required value={form.nameFirst} onChange={handleChange} className={inputClass} placeholder="Jane" />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input name="nameLast" required value={form.nameLast} onChange={handleChange} className={inputClass} placeholder="Smith" />
                </div>
              </div>
            </section>

            {/* Billing address */}
            <section>
              <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-4 pb-2 border-b border-stone-200">Billing Address</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Address Line 1</label>
                  <input name="addressLine1" required value={form.addressLine1} onChange={handleChange} className={inputClass} placeholder="12 Harbour Road" />
                </div>
                <div>
                  <label className={labelClass}>Address Line 2 <span className="text-stone-300">(optional)</span></label>
                  <input name="addressLine2" value={form.addressLine2} onChange={handleChange} className={inputClass} placeholder="Apartment, suite, unit…" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>City</label>
                    <input name="city" required value={form.city} onChange={handleChange} className={inputClass} placeholder="Cape Town" />
                  </div>
                  <div>
                    <label className={labelClass}>Postal Code</label>
                    <input name="postalCode" required value={form.postalCode} onChange={handleChange} className={inputClass} placeholder="8001" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Province</label>
                    <select name="province" required value={form.province} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="" disabled>Select province</option>
                      {SA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <input name="country" required value={form.country} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </div>
            </section>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full bg-stone-800 text-white text-sm tracking-widest uppercase py-4 hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Redirecting to PayFast…' : `Pay ${formatPrice(orderTotal)}`}
            </button>
            <p className="text-xs text-stone-400 text-center -mt-4">
              You will be redirected to PayFast to complete your payment securely.
            </p>
          </form>

          {/* ── Right: order summary ──────────────────────────────── */}
          <div className="lg:sticky lg:top-24">
            <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-4">Order Summary</h2>
            <div className="bg-white border border-stone-200">
              <ul className="divide-y divide-stone-100">
                {items.map((item) => {
                  const imageUrl = item.images?.[0]
                    ? urlFor(item.images[0]).width(120).height(140).fit('crop').url()
                    : null
                  return (
                    <li key={item._id} className="flex gap-4 p-4">
                      {imageUrl && (
                        <div className="relative w-14 flex-shrink-0 bg-stone-100" style={{ height: 72 }}>
                          <Image src={imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                        <p className="text-xs text-stone-400 mt-0.5">Qty {item.quantity}</p>
                        <p className="text-xs text-stone-500 mt-0.5">{formatPrice(item.price)} each</p>
                      </div>
                      <p className="text-sm text-stone-800 self-center font-medium whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </li>
                  )
                })}
              </ul>

              <div className="px-4 py-4 border-t border-stone-200 space-y-2">
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Delivery</span>
                  <span className={deliveryIsPrice ? 'text-stone-800 font-medium' : 'text-stone-400 text-xs self-center text-right max-w-[140px] leading-snug'}>
                    {deliveryLine}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium text-stone-800 pt-2 border-t border-stone-100">
                  <span>Total</span>
                  <span>{formatPrice(orderTotal)}</span>
                </div>
              </div>
            </div>

            {delivery?.deliveryType === 'flexible' && delivery.deliveryNote && (
              <p className="mt-4 text-xs text-stone-400 leading-relaxed">{delivery.deliveryNote}</p>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}
