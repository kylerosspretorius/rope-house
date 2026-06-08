import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { client } from '../../../../sanity/lib/client'
import { productBySlugQuery, allProductSlugsQuery } from '../../../../sanity/queries'
import { Product } from '@/types/product'
import ProductGallery from './ProductGallery'
import AddToCartButton from '@/components/AddToCartButton'
import NotifyMeForm from '@/components/NotifyMeForm'
import { urlFor } from '../../../../sanity/lib/image'

export const revalidate = 60
export const dynamicParams = true

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(allProductSlugsQuery)
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product: Product | null = await client.fetch(productBySlugQuery, { slug })
  if (!product) return {}

  const imageUrl = product.images?.[0]
    ? urlFor(product.images[0]).width(1200).height(630).fit('crop').url()
    : undefined

  return {
    title: `${product.name} — The Rope House`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product: Product | null = await client.fetch(productBySlugQuery, { slug })
  if (!product) notFound()

  const outOfStock = product.stock === 0
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    url: `${siteUrl}/products/${product.slug.current}`,
    brand: { '@type': 'Brand', name: 'The Rope House' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'ZAR',
      availability: outOfStock
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
    },
  }

  const carePoints = [
    'Wipe with a damp cloth only — do not soak',
    'Keep away from prolonged direct moisture',
    'Dust and mould-resistant finish applied',
    'Slight variations are natural for handcrafted pieces',
  ]

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-stone-100 bg-stone-50 py-4 px-6">
        <nav className="max-w-6xl mx-auto flex items-center gap-2 text-xs tracking-wide text-stone-400">
          <Link href="/" className="hover:text-stone-700 transition-colors">Home</Link>
          <span>·</span>
          <Link href="/#collection" className="hover:text-stone-700 transition-colors">Collection</Link>
          <span>·</span>
          <span className="text-stone-600">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-start">

          {/* ── Gallery ─────────────────────────────────────── */}
          <ProductGallery images={product.images} name={product.name} />

          {/* ── Info ────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24 space-y-8">

            {/* Title + price */}
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-2">The Rope House</p>
              <h1 className="text-3xl font-light text-stone-800">{product.name}</h1>
              <p className="mt-2 text-xl text-stone-600">
                R {product.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-stone-500 leading-relaxed">{product.description}</p>
            )}

            {/* Stock + CTA */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${outOfStock ? 'bg-stone-300' : 'bg-green-400'}`} />
                <span className="text-sm text-stone-500 tracking-wide">
                  {outOfStock ? 'Currently out of stock' : 'In stock — ready to dispatch'}
                </span>
              </div>
              {outOfStock ? (
                <NotifyMeForm
                  productId={product._id}
                  productSlug={product.slug.current}
                  productName={product.name}
                />
              ) : (
                <AddToCartButton product={product} />
              )}
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-100">
              {[
                { stat: '100%', label: 'Natural jute' },
                { stat: 'Hand', label: 'Crafted' },
                { stat: 'SA', label: 'Made locally' },
              ].map(({ stat, label }) => (
                <div key={label} className="text-center">
                  <p className="text-lg font-light text-stone-800">{stat}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Care */}
            <div className="pt-4 border-t border-stone-100">
              <h3 className="text-xs tracking-widest uppercase text-stone-400 mb-3">Care</h3>
              <ul className="space-y-2">
                {carePoints.map(tip => (
                  <li key={tip} className="flex items-start gap-3 text-sm text-stone-500">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-stone-300 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Back + FAQ links */}
            <div className="flex items-center justify-between pt-2 text-xs tracking-wide text-stone-400">
              <Link href="/#collection" className="hover:text-stone-700 transition-colors">
                ← Back to collection
              </Link>
              <Link href="/faq" className="hover:text-stone-700 transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
