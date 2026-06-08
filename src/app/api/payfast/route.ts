import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { writeClient } from '../../../../sanity/lib/writeClient'

function generateSignature(data: Record<string, string>, passphrase: string): string {
  const pfString = Object.keys(data)
    .map((key) => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}`)
    .join('&')

  const str = passphrase ? `${pfString}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}` : pfString
  return crypto.createHash('md5').update(str).digest('hex')
}

interface CartItem {
  _id: string
  name: string
  quantity: number
  price: number
}

interface BillingAddress {
  addressLine1: string
  addressLine2?: string
  city: string
  province: string
  postalCode: string
  country: string
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    nameFirst, nameLast, email, phone,
    amount, subtotal, deliveryAmount,
    itemName, orderId, items,
    billingAddress,
  }: {
    nameFirst: string
    nameLast: string
    email: string
    phone: string
    amount: number
    subtotal: number
    deliveryAmount: number
    itemName: string
    orderId: string
    items: CartItem[]
    billingAddress: BillingAddress
  } = body

  const sandbox = process.env.PAYFAST_SANDBOX === 'true'
  const merchantId = sandbox ? '10000100' : process.env.PAYFAST_MERCHANT_ID!
  const merchantKey = sandbox ? '46f0cd694581a' : process.env.PAYFAST_MERCHANT_KEY!
  const passphrase = sandbox ? 'jt7NOE43FZPn' : (process.env.PAYFAST_PASSPHRASE ?? '')
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

  const data: Record<string, string> = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${siteUrl}/checkout/success`,
    cancel_url: `${siteUrl}/checkout/cancel`,
    notify_url: `${siteUrl}/api/payfast/notify`,
    name_first: nameFirst,
    name_last: nameLast,
    email_address: email,
    m_payment_id: orderId,
    amount: Number(amount).toFixed(2),
    item_name: itemName,
  }

  const signature = generateSignature(data, passphrase)

  await writeClient.create({
    _type: 'order',
    orderId,
    customerEmail: email,
    customerName: `${nameFirst} ${nameLast}`,
    customerPhone: phone,
    billingAddress: {
      addressLine1: billingAddress.addressLine1,
      addressLine2: billingAddress.addressLine2 ?? '',
      city: billingAddress.city,
      province: billingAddress.province,
      postalCode: billingAddress.postalCode,
      country: billingAddress.country,
    },
    subtotal: Number(subtotal),
    deliveryAmount: Number(deliveryAmount ?? 0),
    amount: Number(amount),
    status: 'pending',
    items: items.map((item) => ({
      _key: item._id,
      productId: item._id,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
  })

  return NextResponse.json({
    ...data,
    signature,
    payfastUrl: sandbox
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process',
  })
}
