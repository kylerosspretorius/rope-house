'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '../../../../sanity/lib/image'
import { ProductImage } from '@/types/product'

interface Props {
  images: ProductImage[]
  name: string
}

export default function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0)

  if (!images?.length) {
    return <div className="aspect-[4/5] bg-stone-100 flex items-center justify-center text-stone-400 text-sm">No image</div>
  }

  const mainUrl = urlFor(images[active]).width(900).height(1100).fit('crop').url()

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
        <Image
          src={mainUrl}
          alt={images[active]?.alt || name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-3 flex-wrap">
          {images.map((img, i) => {
            const thumbUrl = urlFor(img).width(120).height(150).fit('crop').url()
            return (
              <button
                key={img._key}
                onClick={() => setActive(i)}
                className={`relative w-16 flex-shrink-0 border-2 transition-colors ${
                  i === active ? 'border-stone-800' : 'border-transparent hover:border-stone-300'
                }`}
                style={{ aspectRatio: '4/5' }}
              >
                <Image src={thumbUrl} alt={img.alt || ''} fill className="object-cover" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
