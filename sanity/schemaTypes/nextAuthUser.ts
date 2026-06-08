import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'nextAuthUser',
  title: 'Customer',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'emailVerified', title: 'Email Verified', type: 'datetime' }),
    defineField({ name: 'image', title: 'Profile Image', type: 'url' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'email' },
  },
})
