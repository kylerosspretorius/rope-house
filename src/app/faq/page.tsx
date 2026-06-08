'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FaqItem {
  q: string
  a: string
}

interface FaqSection {
  title: string
  items: FaqItem[]
}

const faqs: FaqSection[] = [
  {
    title: 'Ordering & Payment',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Browse the collection, add items to your cart, and proceed to checkout. Fill in your billing and contact details and you\'ll be securely redirected to PayFast to complete payment. No account is required — you can check out as a guest.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards (Visa, Mastercard), instant EFT, and Mobicred through PayFast — South Africa\'s leading secure payment gateway.',
      },
      {
        q: 'Is it safe to pay on The Rope House website?',
        a: 'Yes. All payments are handled by PayFast, a PCI DSS-compliant gateway. Your card details are never stored on our servers — they go directly to PayFast\'s secure environment.',
      },
      {
        q: 'Can I change or cancel my order after placing it?',
        a: 'Please contact us within 24 hours of placing your order if you need to make changes. Once an order has been dispatched we\'re unable to modify it. For completed orders, you can submit a refund request directly from your account dashboard.',
      },
    ],
  },
  {
    title: 'Delivery & Shipping',
    items: [
      {
        q: 'Which areas do you deliver to?',
        a: 'We deliver across South Africa. Delivery is arranged personally by Sally-Anne after your payment is confirmed — she\'ll be in touch within 24 hours to confirm your delivery window.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Delivery typically takes 3–7 business days depending on your location. Cape Town and surrounding areas are generally faster. You\'ll be contacted to confirm your specific delivery window.',
      },
      {
        q: 'How much does shipping cost?',
        a: 'Shipping costs are discussed personally after your order is placed, as they vary by location and item size. Sally-Anne keeps shipping as affordable as possible and will confirm the cost before dispatching.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'We currently only ship within South Africa. If you\'re based abroad and interested in a piece, reach out via email and we can explore options together.',
      },
    ],
  },
  {
    title: 'Products & Materials',
    items: [
      {
        q: 'Are all products handmade?',
        a: 'Yes — every item is handcrafted by Sally-Anne using 100% natural jute rope. No two pieces are exactly alike, and slight variations in texture, weave, and colour are a natural feature of handmade goods, not a flaw.',
      },
      {
        q: 'What material is used?',
        a: '100% natural jute rope, finished with cream cotton braiding for a clean coastal look. Jute is a sustainable, biodegradable plant fibre that gives each piece its signature warm, earthy character.',
      },
      {
        q: 'Do you offer custom or personalised pieces?',
        a: 'Yes! We love custom orders — different sizes, colour accents, or fully bespoke designs. Reach out via the contact section on the homepage or WhatsApp to discuss what you have in mind. Custom pieces are quoted individually.',
      },
      {
        q: 'What if my item arrives damaged?',
        a: 'We pack every order with care, but if something arrives damaged please photograph it immediately and email us at ropehouseafrica@gmail.com. We\'ll arrange a replacement or refund as quickly as possible.',
      },
    ],
  },
  {
    title: 'Returns & Refunds',
    items: [
      {
        q: 'What is your returns policy?',
        a: 'We accept returns within 7 days of delivery for items that are undamaged and in their original condition. Please contact us before sending anything back. Custom orders are non-refundable.',
      },
      {
        q: 'How do I request a refund?',
        a: 'If you have an account, log in and visit My Account → Order History. On any completed order you\'ll see a "Request refund" option. Sally-Anne will review it and respond within 2–3 business days. Guest customers can email ropehouseafrica@gmail.com with their order ID.',
      },
      {
        q: 'How long does a refund take to process?',
        a: 'Once approved, refunds are processed back to your original payment method within 3–5 business days depending on your bank.',
      },
    ],
  },
  {
    title: 'Care & Maintenance',
    items: [
      {
        q: 'How do I care for my jute product?',
        a: 'Wipe with a damp cloth only — do not soak or submerge in water. Keep away from prolonged direct moisture. All products have a dust and mould-resistant finish applied. Avoid placing in areas with heavy condensation.',
      },
      {
        q: 'Can jute products be used in bathrooms?',
        a: 'Our bathroom accessories are designed for bathroom use. Ensure good ventilation in the room and avoid direct water splashing on the piece. The mould-resistant finish helps, but prolonged dampness should be avoided.',
      },
      {
        q: 'What bulb should I use in a rope lamp?',
        a: 'Use a maximum 10W LED bulb (equivalent to approximately 60W incandescent). Do not exceed the recommended wattage and ensure adequate ventilation around the shade. Never leave lamps on unattended for long periods.',
      },
    ],
  },
]

function AccordionItem({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="border-b border-stone-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-medium text-stone-800 leading-snug">{item.q}</span>
        <span className={`text-stone-400 flex-shrink-0 mt-0.5 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      {open && (
        <p className="pb-5 text-sm text-stone-500 leading-relaxed -mt-2 pr-6">
          {item.a}
        </p>
      )}
    </li>
  )
}

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 pt-28 pb-16 px-6 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-3">Help</p>
        <h1 className="text-3xl md:text-4xl font-light text-stone-800">Frequently Asked Questions</h1>
        <p className="mt-4 text-stone-500 text-sm max-w-sm mx-auto">
          Everything you need to know about ordering, delivery, and caring for your piece.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16 space-y-12">
        {faqs.map((section) => (
          <section key={section.title}>
            <h2 className="text-xs tracking-widest uppercase text-stone-400 mb-2 pb-3 border-b border-stone-200">
              {section.title}
            </h2>
            <ul>
              {section.items.map((item) => (
                <AccordionItem key={item.q} item={item} />
              ))}
            </ul>
          </section>
        ))}

        {/* CTA */}
        <div className="bg-white border border-stone-200 p-8 text-center">
          <p className="text-sm font-light text-stone-700 mb-1">Still have a question?</p>
          <p className="text-xs text-stone-400 mb-6">We're happy to help — reach out directly.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:ropehouseafrica@gmail.com"
              className="text-xs tracking-widest uppercase px-6 py-3 bg-stone-800 text-white hover:bg-stone-700 transition-colors"
            >
              Email Us
            </a>
            <a
              href="tel:0713515650"
              className="text-xs tracking-widest uppercase px-6 py-3 border border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white transition-colors"
            >
              071 351 5650
            </a>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700 transition-colors">
            ← Back to shop
          </Link>
        </div>
      </div>
    </main>
  )
}
