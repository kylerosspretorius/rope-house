'use client'

import { useState } from 'react'

interface Props {
  sanityId: string
  orderId: string
  customerEmail: string
  customerName: string
  amount: number
  initialRefundStatus?: string
}

const refundBadge: Record<string, { label: string; className: string }> = {
  requested: { label: 'Refund Requested', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  approved:  { label: 'Refund Approved',  className: 'bg-green-50 text-green-700 border border-green-200' },
  rejected:  { label: 'Refund Not Approved', className: 'bg-red-50 text-red-700 border border-red-200' },
}

export default function RefundButton({ sanityId, orderId, customerEmail, customerName, amount, initialRefundStatus }: Props) {
  const [status, setStatus] = useState(initialRefundStatus ?? 'none')
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (status !== 'none' && refundBadge[status]) {
    const badge = refundBadge[status]
    return (
      <span className={`inline-block text-xs px-3 py-1.5 ${badge.className}`}>
        {badge.label}
      </span>
    )
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-xs text-stone-500">Request a refund for this order?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              setLoading(true)
              setError('')
              try {
                const res = await fetch('/api/refund', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ sanityId, orderId, customerEmail, customerName, amount }),
                })
                if (!res.ok) throw new Error('Failed')
                setStatus('requested')
              } catch {
                setError('Something went wrong. Please try again.')
              } finally {
                setLoading(false)
                setConfirming(false)
              }
            }}
            disabled={loading}
            className="text-xs tracking-wide bg-stone-800 text-white px-4 py-1.5 hover:bg-stone-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Confirm'}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={loading}
            className="text-xs tracking-wide text-stone-400 hover:text-stone-700 transition-colors px-2"
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-xs text-red-500 w-full">{error}</p>}
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs tracking-wide text-stone-400 hover:text-stone-700 underline underline-offset-4 transition-colors"
    >
      Request refund
    </button>
  )
}
