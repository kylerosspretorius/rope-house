import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '../../../../sanity/lib/writeClient'

export async function POST(req: NextRequest) {
  const { email, name, productId, productSlug, productName } = await req.json() as {
    email: string
    name?: string
    productId: string
    productSlug: string
    productName: string
  }

  if (!email || !productId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Silently succeed if already subscribed (avoids duplicate emails)
  const existing = await writeClient.fetch<string | null>(
    `*[_type == "stockNotification" && email == $email && productId == $productId && notified != true][0]._id`,
    { email, productId }
  )

  if (existing) {
    return NextResponse.json({ success: true })
  }

  await writeClient.create({
    _type: 'stockNotification',
    email,
    name: name ?? '',
    productId,
    productSlug,
    productName,
    notified: false,
  })

  return NextResponse.json({ success: true })
}
