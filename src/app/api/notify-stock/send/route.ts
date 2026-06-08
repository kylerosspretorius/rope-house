import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '../../../../../sanity/lib/writeClient'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface Notification {
  _id: string
  email: string
  name: string
}

// Called by a Sanity webhook (or manually) when a product is restocked.
// Configure in Sanity Studio → API → Webhooks:
//   URL:    https://your-domain.com/api/notify-stock/send?secret=<SANITY_WEBHOOK_SECRET>
//   Filter: _type == "product" && stock > 0
//   Projection: { _id, name, slug, stock }
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!secret || secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as { _id: string; name: string; slug?: { current: string }; stock: number }

  const productId = body._id
  const productName = body.name
  const productSlug = body.slug?.current ?? ''

  if (!productId) {
    return NextResponse.json({ error: 'Missing product ID in payload' }, { status: 400 })
  }

  // Webhook fires on all saves; only proceed if stock > 0
  if (!body.stock || body.stock <= 0) {
    return NextResponse.json({ message: 'Stock is 0, skipping notifications' })
  }

  const notifications: Notification[] = await writeClient.fetch(
    `*[_type == "stockNotification" && productId == $productId && notified != true]`,
    { productId }
  )

  if (!notifications.length) {
    return NextResponse.json({ message: 'No pending notifications for this product' })
  }

  const from = process.env.AUTH_EMAIL_FROM!
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

  await Promise.all(
    notifications.map(async (n) => {
      await resend.emails.send({
        from,
        to: n.email,
        subject: `Back in Stock: ${productName}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#1c1917">
            <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#a8a29e;margin:0 0 24px">The Rope House</p>
            <h2 style="font-size:22px;font-weight:300;margin:0 0 16px">
              Good news${n.name ? `, ${n.name}` : ''}!
            </h2>
            <p style="font-size:14px;color:#78716c;line-height:1.7;margin:0 0 24px">
              <strong style="color:#1c1917">${productName}</strong> is back in stock.
              We know you've been waiting — grab yours before it sells out again.
            </p>
            <a href="${siteUrl}/products/${productSlug}"
               style="display:inline-block;background:#1c1917;color:#fff;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;padding:15px 36px;text-decoration:none">
              Shop Now
            </a>
            <p style="font-size:12px;color:#a8a29e;margin-top:32px;line-height:1.6">
              You requested to be notified about this item. To unsubscribe from future notifications,
              reply to this email.
            </p>
          </div>
        `,
      })

      await writeClient.patch(n._id).set({ notified: true }).commit()
    })
  )

  return NextResponse.json({ success: true, sent: notifications.length })
}
