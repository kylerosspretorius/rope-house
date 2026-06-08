import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { writeClient } from '../../../../../sanity/lib/writeClient'
import { client } from '../../../../../sanity/lib/client'
import { groq } from 'next-sanity'

function verifySignature(data: Record<string, string>, passphrase: string, received: string): boolean {
  const filtered = Object.fromEntries(
    Object.entries(data).filter(([k]) => k !== 'signature')
  )
  const sorted = Object.keys(filtered)
    .sort()
    .map((k) => `${k}=${encodeURIComponent(filtered[k]).replace(/%20/g, '+')}`)
    .join('&')
  const str = passphrase ? `${sorted}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}` : sorted
  const expected = crypto.createHash('md5').update(str).digest('hex')
  return expected === received
}

export async function POST(req: NextRequest) {
  const text = await req.text()
  const params = new URLSearchParams(text)
  const data = Object.fromEntries(params.entries())

  const passphrase = process.env.PAYFAST_PASSPHRASE ?? ''
  const { signature, payment_status, m_payment_id, pf_payment_id } = data

  if (!verifySignature(data, passphrase, signature)) {
    return new NextResponse('Invalid signature', { status: 400 })
  }

  const orderId = m_payment_id
  const status = payment_status === 'COMPLETE' ? 'complete'
    : payment_status === 'FAILED' ? 'failed'
    : 'cancelled'

  // Find the order document
  const order = await client.fetch(
    groq`*[_type == "order" && orderId == $orderId][0]{ _id, items }`,
    { orderId }
  )

  if (!order) {
    return new NextResponse('Order not found', { status: 404 })
  }

  // Update order status and store PayFast payment ID
  await writeClient.patch(order._id).set({ status, payfastPaymentId: pf_payment_id }).commit()

  // Decrement stock for each item on successful payment
  if (status === 'complete' && order.items?.length) {
    await Promise.all(
      order.items.map(async (item: { productId: string; quantity: number }) => {
        const product = await client.fetch(
          groq`*[_type == "product" && _id == $id][0]{ _id, stock }`,
          { id: item.productId }
        )
        if (product) {
          const newStock = Math.max(0, (product.stock ?? 0) - item.quantity)
          await writeClient.patch(product._id).set({ stock: newStock }).commit()
        }
      })
    )
  }

  return new NextResponse('OK', { status: 200 })
}
