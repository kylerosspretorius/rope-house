import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'stockNotification',
  title: 'Stock Notification',
  type: 'document',
  fields: [
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'productId', title: 'Product ID', type: 'string' }),
    defineField({ name: 'productSlug', title: 'Product Slug', type: 'string' }),
    defineField({ name: 'productName', title: 'Product Name', type: 'string' }),
    defineField({ name: 'notified', title: 'Notified', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { email: 'email', productName: 'productName', notified: 'notified' },
    prepare({ email, productName, notified }) {
      return {
        title: email,
        subtitle: `${productName} · ${notified ? '✓ Notified' : 'Waiting'}`,
      }
    },
  },
})
