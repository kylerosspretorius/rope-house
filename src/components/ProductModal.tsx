'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types/product'
import { useCartStore } from '@/store/cart'
import { urlFor } from '../../sanity/lib/image'

interface Props {
  product: Product
  onClose: () => void
}

export default function ProductModal({ product, onClose }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const outOfStock = product.stock === 0
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const images = product.images ?? []
  const activeUrl = images[activeIndex]
    ? urlFor(images[activeIndex]).width(900).height(1050).fit('crop').url()
    : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Panel */}
      <div
        className="relative z-10 bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto sm:rounded-none grid sm:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative aspect-[4/5] bg-stone-100">
          {activeUrl ? (
            <Image src={activeUrl} alt={images[activeIndex]?.alt || product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400">No image</div>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 px-4">
              {images.map((img, i) => {
                const thumbUrl = urlFor(img).width(80).height(80).fit('crop').url()
                return (
                  <button
                    key={img._key}
                    onClick={() => setActiveIndex(i)}
                    className={`w-10 h-10 relative border-2 transition-colors ${i === activeIndex ? 'border-stone-800' : 'border-transparent'}`}
                  >
                    <Image src={thumbUrl} alt="" fill className="object-cover" />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <button
              onClick={onClose}
              className="mb-6 text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700 transition-colors"
            >
              ✕ Close
            </button>
            <h2 className="text-2xl font-light text-stone-800">{product.name}</h2>
            <p className="mt-1 text-lg text-stone-600">
              R {product.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </p>
            {product.description && (
              <p className="mt-5 text-stone-500 leading-relaxed text-sm">{product.description}</p>
            )}
            {outOfStock && (
              <p className="mt-4 text-xs tracking-widest uppercase text-stone-400">Out of stock</p>
            )}
          </div>

          <button
            onClick={() => { if (!outOfStock) { addItem(product); onClose() } }}
            disabled={outOfStock}
            className="mt-8 w-full py-3 text-sm tracking-widest uppercase bg-stone-800 text-white hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {outOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
