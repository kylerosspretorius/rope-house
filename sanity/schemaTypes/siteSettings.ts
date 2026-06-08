import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'deliveryType',
      title: 'Delivery Type',
      type: 'string',
      options: {
        list: [
          { title: 'Fixed amount — same cost for all orders', value: 'fixed' },
          { title: 'Free delivery', value: 'free' },
          { title: 'Flexible — arranged personally after payment', value: 'flexible' },
        ],
        layout: 'radio',
      },
      initialValue: 'flexible',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'deliveryAmount',
      title: 'Fixed Delivery Amount (ZAR)',
      type: 'number',
      description: 'Only applies when Delivery Type is "Fixed amount"',
      validation: Rule => Rule.min(0),
    }),
    defineField({
      name: 'deliveryNote',
      title: 'Delivery Note',
      type: 'string',
      description: 'Short message shown to customers at checkout and in order confirmation',
      initialValue: 'Arranged personally after your payment is confirmed. Sally-Anne will be in touch within 24 hours.',
    }),
  ],
  preview: {
    select: { deliveryType: 'deliveryType', deliveryAmount: 'deliveryAmount' },
    prepare({ deliveryType, deliveryAmount }) {
      const label = deliveryType === 'fixed'
        ? `Fixed — R${deliveryAmount ?? 0}`
        : deliveryType === 'free'
        ? 'Free delivery'
        : 'Flexible delivery'
      return { title: 'Site Settings', subtitle: label }
    },
  },
})
