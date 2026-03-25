'use client'

import Image from 'next/image'
import { Product } from '@/types/product'
import { useCartStore } from '@/store/cart'
import { urlFor } from '../../sanity/lib/image'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const outOfStock = product.stock === 0

  const imageUrl = product.images?.[0]
    ? urlFor(product.images[0]).width(600).height(700).fit('crop').url()
    : null

  return (
    <div className="group flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-stone-100 aspect-[4/5]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.images[0].alt || product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400">
            No image
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm tracking-widest uppercase text-stone-500">Sold Out</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-4 flex flex-col gap-3">
        <div>
          <h3 className="text-base font-medium text-stone-800">{product.name}</h3>
          {product.description && (
            <p className="mt-1 text-sm text-stone-500 line-clamp-2">{product.description}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-stone-800">
            R{product.price.toLocaleString('en-ZA')}
          </span>
          <button
            onClick={() => !outOfStock && addItem(product)}
            disabled={outOfStock}
            className="text-sm tracking-widest uppercase px-4 py-2 border border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
