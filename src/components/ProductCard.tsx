'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/product'
import { useCartStore } from '@/store/cart'
import { urlFor } from '../../sanity/lib/image'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const outOfStock = product.stock === 0
  const href = `/products/${product.slug.current}`

  const imageUrl = product.images?.[0]
    ? urlFor(product.images[0]).width(600).height(700).fit('crop').url()
    : null

  return (
    <div className="group flex flex-col">
      {/* Image */}
      <Link href={href} className="relative overflow-hidden bg-stone-100 aspect-[4/5] block">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.images[0].alt || product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400">No image</div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm tracking-widest uppercase text-stone-500">Sold Out</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <span className="text-xs tracking-widest uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-stone-900/70 px-4 py-2">
            View Details
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="mt-4 flex flex-col gap-3">
        <div>
          <Link href={href}>
            <h3 className="text-base font-medium text-stone-800 hover:text-stone-500 transition-colors">
              {product.name}
            </h3>
          </Link>
          {product.description && (
            <p className="mt-1 text-sm text-stone-500 line-clamp-2">{product.description}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-stone-800">
            R {product.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </span>
          {outOfStock ? (
            <Link
              href={href}
              className="text-sm tracking-widest uppercase px-4 py-2 border border-stone-300 text-stone-400 hover:border-stone-800 hover:text-stone-800 transition-colors"
            >
              Notify Me
            </Link>
          ) : (
            <button
              onClick={() => addItem(product)}
              className="text-sm tracking-widest uppercase px-4 py-2 border border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white transition-colors duration-200"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
