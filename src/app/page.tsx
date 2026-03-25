import { client } from '../../sanity/lib/client'
import { allProductsQuery } from '../../sanity/queries'
import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'

export const revalidate = 60

export default async function Home() {
  const products: Product[] = await client.fetch(allProductsQuery)

  return (
    <main>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative h-screen flex items-end pb-28 px-6 bg-stone-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-55"
          style={{ backgroundImage: "url('/images/hero-rope.jpg')" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <p className="text-xs tracking-[0.4em] uppercase text-stone-300 mb-5">
            Handcrafted in South Africa
          </p>
          <h1 className="text-5xl md:text-7xl font-light text-white leading-tight max-w-2xl">
            Natural rope,<br />timeless craft.
          </h1>
          <p className="mt-5 text-stone-300 text-base max-w-md leading-relaxed">
            Handmade homewares woven from 100% natural jute — lamps, mirrors and bathroom accessories with a warm coastal character.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href="#collection"
              className="text-sm tracking-widest uppercase text-white border border-white/50 px-8 py-3 hover:bg-white hover:text-stone-900 transition-colors duration-300"
            >
              Shop Collection
            </a>
            <a
              href="#craft"
              className="text-sm tracking-widest uppercase text-white/70 px-8 py-3 hover:text-white transition-colors duration-300"
            >
              Our Craft ↓
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-white/30" />
        </div>
      </section>


      {/* ── CRAFT / ABOUT ────────────────────────────────────────────── */}
      <section id="craft" className="py-28 px-6 bg-stone-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-stone-400 mb-4">The Craft</p>
            <h2 className="text-3xl md:text-4xl font-light text-stone-800 leading-snug">
              Every piece begins<br />with a single strand.
            </h2>
            <p className="mt-6 text-stone-500 leading-relaxed">
              The Rope House was born from a love of natural materials and the beauty of honest craft. Each piece is made by hand using 100% natural jute rope, finished with cream cotton braiding for a clean, coastal look.
            </p>
            <p className="mt-4 text-stone-500 leading-relaxed">
              From sculptural lamps to bathroom accessories, every item is designed to bring warmth, texture and a grounded presence to your home — equally at home in a beach house, a boho loft, or a modern minimal interior.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-stone-200 pt-10">
              <div>
                <p className="text-2xl font-light text-stone-800">100%</p>
                <p className="text-xs tracking-wide text-stone-400 mt-1">Natural Jute</p>
              </div>
              <div>
                <p className="text-2xl font-light text-stone-800">Hand</p>
                <p className="text-xs tracking-wide text-stone-400 mt-1">Crafted</p>
              </div>
              <div>
                <p className="text-2xl font-light text-stone-800">SA</p>
                <p className="text-xs tracking-wide text-stone-400 mt-1">Made Locally</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="/images/rope-pillar-lamp.jpg"
                alt="Rope Pillar Lamp"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden mt-10">
              <img
                src="/images/halo-rope-mirror-wall.jpg"
                alt="Halo Rope Mirror"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>


      {/* ── COLLECTION ───────────────────────────────────────────────── */}
      <section id="collection" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <p className="text-xs tracking-[0.4em] uppercase text-stone-400 mb-3">Shop</p>
            <h2 className="text-3xl md:text-4xl font-light text-stone-800">The Collection</h2>
            <p className="mt-3 text-stone-500 text-sm tracking-wide max-w-sm mx-auto">
              Each piece handcrafted from 100% natural jute rope with a cream cotton braided finish
            </p>
          </div>

          {products.length === 0 ? (
            <p className="text-center text-stone-400">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>


      {/* ── CARE ─────────────────────────────────────────────────────── */}
      <section id="care" className="py-28 px-6 bg-stone-800 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-stone-400 mb-3">Maintenance</p>
            <h2 className="text-3xl md:text-4xl font-light">Care Instructions</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {/* All products */}
            <div className="border border-stone-700 p-8">
              <h3 className="text-xs tracking-widest uppercase text-stone-400 mb-6">All Products</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-stone-300">
                  <span className="mt-1 w-1 h-1 rounded-full bg-stone-500 flex-shrink-0" />
                  Dust and mould-resistant finishes
                </li>
                <li className="flex items-start gap-3 text-stone-300">
                  <span className="mt-1 w-1 h-1 rounded-full bg-stone-500 flex-shrink-0" />
                  Wipe with a damp cloth only
                </li>
                <li className="flex items-start gap-3 text-stone-300">
                  <span className="mt-1 w-1 h-1 rounded-full bg-stone-500 flex-shrink-0" />
                  Do not soak or submerge in water
                </li>
                <li className="flex items-start gap-3 text-stone-300">
                  <span className="mt-1 w-1 h-1 rounded-full bg-stone-500 flex-shrink-0" />
                  Keep away from prolonged direct moisture
                </li>
              </ul>
            </div>
            {/* Lamps */}
            <div className="border border-stone-700 p-8">
              <h3 className="text-xs tracking-widest uppercase text-stone-400 mb-6">Lamps</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-stone-300">
                  <span className="mt-1 w-1 h-1 rounded-full bg-stone-500 flex-shrink-0" />
                  Maximum 10W LED bulb
                </li>
                <li className="flex items-start gap-3 text-stone-300">
                  <span className="mt-1 w-1 h-1 rounded-full bg-stone-500 flex-shrink-0" />
                  Equivalent to ≈60W incandescent
                </li>
                <li className="flex items-start gap-3 text-stone-300">
                  <span className="mt-1 w-1 h-1 rounded-full bg-stone-500 flex-shrink-0" />
                  Do not exceed recommended wattage
                </li>
                <li className="flex items-start gap-3 text-stone-300">
                  <span className="mt-1 w-1 h-1 rounded-full bg-stone-500 flex-shrink-0" />
                  Allow adequate ventilation around shade
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* ── CONTACT ──────────────────────────────────────────────────── */}
      <section id="contact" className="py-28 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-stone-400 mb-3">Get in Touch</p>
          <h2 className="text-3xl md:text-4xl font-light text-stone-800">Contact Us</h2>
          <p className="mt-5 text-stone-500 max-w-sm mx-auto">
            Questions about a product, a custom order, or just want to say hello — we'd love to hear from you.
          </p>
          <div className="mt-14 flex flex-col sm:flex-row justify-center gap-8 sm:gap-16">
            <div>
              <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Contact</p>
              <p className="text-stone-800 font-medium">Sally-Anne</p>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Phone</p>
              <a href="tel:0713515650" className="text-stone-800 font-medium hover:text-stone-500 transition-colors">
                071 351 5650
              </a>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Email</p>
              <a href="mailto:ropehouseafrica@gmail.com" className="text-stone-800 font-medium hover:text-stone-500 transition-colors">
                ropehouseafrica@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="bg-stone-900 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs tracking-widest uppercase text-stone-500">
            The Rope House
          </span>
          <div className="flex gap-6">
            {[
              { label: 'Collection', href: '#collection' },
              { label: 'Craft', href: '#craft' },
              { label: 'Care', href: '#care' },
              { label: 'Contact', href: '#contact' },
            ].map((link) => (
              <a key={link.href} href={link.href} className="text-xs tracking-widest uppercase text-stone-500 hover:text-stone-300 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <span className="text-xs text-stone-600">
            © {new Date().getFullYear()} The Rope House
          </span>
        </div>
      </footer>

    </main>
  )
}
