'use client'

import { useCartStore } from '@/store/cart'
import { urlFor } from '../../sanity/lib/image'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, count } = useCartStore()
  const router = useRouter()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
          <h2 className="text-sm tracking-widest uppercase font-medium">
            Cart {count() > 0 && <span className="text-stone-400">({count()})</span>}
          </h2>
          <button onClick={closeCart} className="text-stone-400 hover:text-stone-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-stone-400 text-sm tracking-wide">Your cart is empty</p>
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {items.map((item) => {
                const imageUrl = item.images?.[0]
                  ? urlFor(item.images[0]).width(120).height(140).fit('crop').url()
                  : null
                return (
                  <li key={item._id} className="flex gap-4 py-5">
                    {imageUrl && (
                      <div className="relative w-20 h-24 bg-stone-100 flex-shrink-0">
                        <Image src={imageUrl} alt={item.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-stone-800">{item.name}</h3>
                        <p className="text-sm text-stone-500 mt-0.5">R{item.price.toLocaleString('en-ZA')}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-stone-200">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="px-3 py-1 text-stone-500 hover:text-stone-800 transition-colors"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="px-3 py-1 text-stone-500 hover:text-stone-800 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-xs text-stone-400 hover:text-stone-800 transition-colors tracking-wide"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-stone-200 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="tracking-wide text-stone-600">Subtotal</span>
              <span className="font-medium text-stone-800">R{total().toLocaleString('en-ZA')}</span>
            </div>
            <p className="text-xs text-stone-400">Shipping calculated at checkout</p>
            <button
              onClick={() => { closeCart(); router.push('/checkout') }}
              className="w-full bg-stone-800 text-white text-sm tracking-widest uppercase py-4 hover:bg-stone-700 transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  )
}
