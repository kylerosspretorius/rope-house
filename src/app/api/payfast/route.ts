import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function generateSignature(data: Record<string, string>, passphrase: string): string {
  const sorted = Object.keys(data)
    .sort()
    .map((key) => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}`)
    .join('&')

  const str = passphrase ? `${sorted}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}` : sorted
  return crypto.createHash('md5').update(str).digest('hex')
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nameFirst, nameLast, email, amount, itemName, orderId } = body

  const merchantId = process.env.PAYFAST_MERCHANT_ID!
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY!
  const passphrase = process.env.PAYFAST_PASSPHRASE ?? ''
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!
  const sandbox = process.env.PAYFAST_SANDBOX === 'true'

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

  return NextResponse.json({
    ...data,
    signature,
    payfastUrl: sandbox
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process',
  })
}
