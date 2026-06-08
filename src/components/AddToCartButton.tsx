'use client'

import { useState } from 'react'
import { Product } from '@/types/product'
import { useCartStore } from '@/store/cart'

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem)
  const [added, setAdded] = useState(false)

  function handleClick() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleClick}
      className="w-full py-4 text-sm tracking-widest uppercase bg-stone-800 text-white hover:bg-stone-700 transition-colors"
    >
      {added ? '✓ Added to Cart' : 'Add to Cart'}
    </button>
  )
}
