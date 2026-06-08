import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeClient } from '../../../../sanity/lib/writeClient'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function formatPrice(n: number) {
  return 'R ' + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { sanityId, orderId, customerEmail, customerName, amount } = await req.json() as {
    sanityId: string
    orderId: string
    customerEmail: string
    customerName: string
    amount: number
  }

  if (!sanityId || !orderId || !customerEmail) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (customerEmail !== session.user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await writeClient
    .patch(sanityId)
    .set({ refundStatus: 'requested', refundRequestedAt: new Date().toISOString() })
    .commit()

  const from = process.env.AUTH_EMAIL_FROM!
  const adminEmail = process.env.ADMIN_EMAIL!
  const displayAmount = formatPrice(amount)

  await Promise.all([
    // Admin notification
    resend.emails.send({
      from,
      to: adminEmail,
      subject: `Refund Request — ${orderId}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#1c1917">
          <h2 style="font-size:18px;font-weight:400;margin:0 0 20px">Refund Request Received</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f5f5f4;color:#78716c;width:130px">Order ID</td>
              <td style="padding:8px 0;border-bottom:1px solid #f5f5f4;font-weight:500">${orderId}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f5f5f4;color:#78716c">Customer</td>
              <td style="padding:8px 0;border-bottom:1px solid #f5f5f4">${customerName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f5f5f4;color:#78716c">Email</td>
              <td style="padding:8px 0;border-bottom:1px solid #f5f5f4">${customerEmail}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#78716c">Amount</td>
              <td style="padding:8px 0;font-weight:600">${displayAmount}</td>
            </tr>
          </table>
          <p style="font-size:12px;color:#a8a29e;margin-top:28px;line-height:1.6">
            Log in to Sanity Studio to update the refund status for this order.
            Once updated to "approved" or "rejected" the customer will see the status change in their dashboard.
          </p>
        </div>
      `,
    }),

    // Customer confirmation
    resend.emails.send({
      from,
      to: customerEmail,
      subject: `Refund Request Received — ${orderId}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#1c1917">
          <h2 style="font-size:18px;font-weight:300;margin:0 0 16px">We've received your refund request</h2>
          <p style="font-size:14px;color:#78716c;line-height:1.6;margin:0 0 20px">
            Hi ${customerName},<br><br>
            Your refund request for order <strong style="color:#1c1917">${orderId}</strong>
            (${displayAmount}) has been received and is being reviewed.
          </p>
          <p style="font-size:14px;color:#78716c;line-height:1.6;margin:0 0 20px">
            Sally-Anne will review your request and get back to you within 2–3 business days.
            You can track the status of your request at any time in your account dashboard.
          </p>
          <p style="font-size:12px;color:#a8a29e;margin-top:24px">
            If you have any questions, please reply to this email.
          </p>
        </div>
      `,
    }),
  ])

  return NextResponse.json({ success: true })
}
