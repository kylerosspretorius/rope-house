import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({ name: 'orderId', title: 'Order ID', type: 'string' }),
    defineField({ name: 'customerEmail', title: 'Customer Email', type: 'string' }),
    defineField({ name: 'customerName', title: 'Customer Name', type: 'string' }),
    defineField({ name: 'customerPhone', title: 'Phone', type: 'string' }),
    defineField({
      name: 'billingAddress',
      title: 'Billing Address',
      type: 'object',
      fields: [
        defineField({ name: 'addressLine1', title: 'Address Line 1', type: 'string' }),
        defineField({ name: 'addressLine2', title: 'Address Line 2', type: 'string' }),
        defineField({ name: 'city', title: 'City', type: 'string' }),
        defineField({ name: 'province', title: 'Province', type: 'string' }),
        defineField({ name: 'postalCode', title: 'Postal Code', type: 'string' }),
        defineField({ name: 'country', title: 'Country', type: 'string' }),
      ],
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'productId', type: 'string' }),
            defineField({ name: 'productName', type: 'string' }),
            defineField({ name: 'quantity', type: 'number' }),
            defineField({ name: 'price', type: 'number' }),
          ],
        },
      ],
    }),
    defineField({ name: 'subtotal', title: 'Subtotal (ZAR)', type: 'number' }),
    defineField({ name: 'deliveryAmount', title: 'Delivery (ZAR)', type: 'number' }),
    defineField({ name: 'amount', title: 'Total (ZAR)', type: 'number' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['pending', 'complete', 'failed', 'cancelled'] },
      initialValue: 'pending',
    }),
    defineField({ name: 'payfastPaymentId', title: 'PayFast Payment ID', type: 'string' }),
    defineField({
      name: 'refundStatus',
      title: 'Refund Status',
      type: 'string',
      options: { list: ['none', 'requested', 'approved', 'rejected'] },
      initialValue: 'none',
    }),
    defineField({ name: 'refundRequestedAt', title: 'Refund Requested At', type: 'datetime' }),
  ],
  preview: {
    select: { orderId: 'orderId', email: 'customerEmail', amount: 'amount', status: 'status' },
    prepare({ orderId, email, amount, status }) {
      return {
        title: orderId ?? 'Unknown order',
        subtitle: `${email} · R${amount} · ${status}`,
      }
    },
  },
})
