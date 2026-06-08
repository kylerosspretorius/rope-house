import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { client } from '../../../sanity/lib/client'
import { ordersByEmailQuery } from '../../../sanity/queries'
import SignOutButton from '@/components/SignOutButton'
import RefundButton from '@/components/RefundButton'

interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

interface BillingAddress {
  addressLine1?: string
  addressLine2?: string
  city?: string
  province?: string
  postalCode?: string
  country?: string
}

interface Order {
  _id: string
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  amount: number
  status: 'pending' | 'complete' | 'failed' | 'cancelled'
  payfastPaymentId?: string
  refundStatus?: string
  refundRequestedAt?: string
  _createdAt: string
  billingAddress?: BillingAddress
  items: OrderItem[]
}

const statusConfig: Record<string, { label: string; className: string }> = {
  complete:  { label: 'Paid',      className: 'bg-green-100 text-green-700' },
  pending:   { label: 'Pending',   className: 'bg-amber-100 text-amber-700' },
  failed:    { label: 'Failed',    className: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelled', className: 'bg-stone-100 text-stone-500' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatPrice(n: number) {
  return 'R ' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function AddressBlock({ address, phone }: { address?: BillingAddress; phone?: string }) {
  if (!address?.addressLine1 && !phone) return null
  const lines = [
    address?.addressLine1,
    address?.addressLine2,
    [address?.city, address?.province].filter(Boolean).join(', '),
    [address?.postalCode, address?.country].filter(Boolean).join(', '),
  ].filter(Boolean) as string[]

  return (
    <div className="border-t border-stone-100 pt-4 mt-4">
      <p className="text-xs tracking-wide text-stone-400 mb-3 uppercase">Billing Details</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {lines.length > 0 && (
          <div>
            <p className="text-xs text-stone-400 mb-1">Address</p>
            {lines.map((line, i) => (
              <p key={i} className="text-sm text-stone-600 leading-snug">{line}</p>
            ))}
          </div>
        )}
        {phone && (
          <div>
            <p className="text-xs text-stone-400 mb-1">Phone</p>
            <p className="text-sm text-stone-600">{phone}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function OrderCard({ order, email }: { order: Order; email: string }) {
  const badge = statusConfig[order.status] ?? statusConfig.pending
  const canRefund = order.status === 'complete'

  return (
    <li className="bg-white border border-stone-200 p-6">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-800">{order.orderId}</p>
          <p className="text-xs text-stone-400 mt-0.5">{formatDate(order._createdAt)}</p>
          {order.customerName && (
            <p className="text-xs text-stone-500 mt-0.5">{order.customerName}</p>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-xs px-2 py-1 rounded-full ${badge.className}`}>
            {badge.label}
          </span>
          <span className="text-sm font-medium text-stone-800">{formatPrice(order.amount)}</span>
        </div>
      </div>

      {/* Items */}
      {order.items?.length > 0 && (
        <ul className="border-t border-stone-100 mt-4 pt-4 space-y-2">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span className="text-stone-600">
                {item.productName}
                <span className="text-stone-400 ml-1">× {item.quantity}</span>
              </span>
              <span className="text-stone-800">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Billing address */}
      <AddressBlock address={order.billingAddress} phone={order.customerPhone} />

      {/* Refund */}
      {canRefund && (
        <div className="border-t border-stone-100 mt-4 pt-4">
          <RefundButton
            sanityId={order._id}
            orderId={order.orderId}
            customerEmail={email}
            customerName={order.customerName ?? email}
            amount={order.amount}
            initialRefundStatus={order.refundStatus}
          />
        </div>
      )}
    </li>
  )
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/account/login')
  }

  const email = session.user.email
  const orders: Order[] = await client.fetch(ordersByEmailQuery, { email })

  const activeOrders = orders.filter(o => o.status === 'pending')
  const previousOrders = orders.filter(o => o.status !== 'pending')

  return (
    <main className="min-h-screen bg-stone-50 py-24 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-2xl font-light text-stone-800">My Account</h1>
            <p className="text-sm text-stone-400 mt-1">{email}</p>
          </div>
          <SignOutButton />
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-stone-200 p-10 text-center">
            <p className="text-sm text-stone-400">No orders yet.</p>
            <a href="/#collection" className="inline-block mt-4 text-xs tracking-widest uppercase text-stone-800 underline underline-offset-4">
              Shop now
            </a>
          </div>
        ) : (
          <div className="space-y-12">

            {/* Active orders */}
            {activeOrders.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-xs tracking-widest uppercase text-stone-500">Active Orders</h2>
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-medium">
                    {activeOrders.length}
                  </span>
                </div>
                <ul className="space-y-4">
                  {activeOrders.map(order => (
                    <OrderCard key={order._id} order={order} email={email} />
                  ))}
                </ul>
              </section>
            )}

            {/* Previous orders */}
            {previousOrders.length > 0 && (
              <section>
                <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-5">Order History</h2>
                <ul className="space-y-4">
                  {previousOrders.map(order => (
                    <OrderCard key={order._id} order={order} email={email} />
                  ))}
                </ul>
              </section>
            )}

          </div>
        )}
      </div>
    </main>
  )
}
